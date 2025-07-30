import os
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain.prompts import PromptTemplate
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings, NVIDIARerank, ChatNVIDIA
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall


import os
from scripts import config

load_dotenv()

def get_rag_chain():
    # Load the FAISS index
    if not os.path.exists(config.FAISS_INDEX_PATH):
        raise FileNotFoundError(f"FAISS index not found at {config.FAISS_INDEX_PATH}. Please run embed_and_index.py first.")
    
    embedding_model = NVIDIAEmbeddings(model=config.NVIDIA_EMBEDDING_MODEL_NAME, api_key=config.NVIDIA_API_KEY, base_url=config.NVIDIA_API_BASE, truncate="NONE")
    vectorstore = FAISS.load_local(config.FAISS_INDEX_PATH, embedding_model, allow_dangerous_deserialization=True)

    # Initialize the reranker
    retriever = vectorstore.as_retriever(search_kwargs={"k": 50}) # Retrieve more documents for reranking
    
    compressor = NVIDIARerank(
        model=config.NVIDIA_RERANKING_MODEL_NAME,
        api_key=config.NVIDIA_API_KEY,
        base_url=config.NVIDIA_API_BASE,
        top_n=8
    )
    
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor,
        base_retriever=retriever
    )

    # Define the prompt template
    prompt = PromptTemplate(
        template=config.PERSONA_PROMPT_TEMPLATE,
        input_variables=["context", "question"]
    )

    # Initialize the LLM
    llm = ChatNVIDIA(
         model=config.LLM_MODEL_NAME,
         nvidia_api_key=config.NVIDIA_API_KEY,
         base_url=config.NVIDIA_API_BASE,
         temperature=0.3
     )

    # Create the RAG chain with evaluation metrics
    rag_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=compression_retriever,
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=True
    )
    
    # Add evaluation wrapper
    def evaluate_rag_chain(query, response, source_documents):
        """
        Evaluate RAG chain performance with various metrics using RAGAS
        Returns:
            dict: Dictionary containing evaluation metrics
        """
        data = {
            'question': [query],
            'answer': [response],
            'contexts': [[doc.page_content for doc in source_documents]],
            'ground_truths': [""], # RAGAS can use ground truths if available
        }
        dataset = Dataset.from_dict(data)

        score = evaluate(
            dataset,
            metrics=[
                faithfulness,
                answer_relevancy,
                context_precision,
                context_recall,
            ],
            llm=llm, # Pass the LLM to RAGAS for evaluation
            embeddings=embedding_model # Pass the embedding model to RAGAS for evaluation
        )
        return score.to_dict()
    
    # Wrap the original chain
    def wrapped_chain(query):
        result = rag_chain({"query": query})
        response = result["result"]
        source_documents = result["source_documents"]
        
        metrics = evaluate_rag_chain(query, response, source_documents)
        return {"response": response, "metrics": metrics, "source_documents": source_documents}
    
    return wrapped_chain

if __name__ == "__main__":
    # Example usage
    try:
        chain = get_rag_chain()
        query = "What were the key takeaways from the latest earnings call?"
        print(f"Query: {query}")
        result = chain(query)
        print(f"Response: {result['response']}")
        print(f"Metrics: {result['metrics']}")
        print(f"Source Documents: {result['source_documents']}")
    except FileNotFoundError as e:
        print(e)
    except Exception as e:
        print(f"An error occurred: {e}")