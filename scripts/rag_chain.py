import os
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

import os
from scripts import config

load_dotenv()

def get_rag_chain():
    # Load the FAISS index
    if not os.path.exists(config.FAISS_INDEX_PATH):
        raise FileNotFoundError(f"FAISS index not found at {FAISS_INDEX_PATH}. Please run embed_and_index.py first.")
    
    embedding_model = HuggingFaceEmbeddings(model_name=config.NVIDIA_EMBEDDING_MODEL_NAME)
    vectorstore = FAISS.load_local(config.FAISS_INDEX_PATH, embedding_model, allow_dangerous_deserialization=True)

    # Initialize the reranker
    retriever = vectorstore.as_retriever(search_kwargs={"k": 40}) # Retrieve more documents for reranking
    
    cross_encoder_model = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base")
    compressor = CrossEncoderReranker(model=cross_encoder_model, top_n=3) # Rerank to top 3
    
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
    llm = ChatOpenAI(
        openai_api_base=config.OPENAI_API_BASE,
        openai_api_key=config.OPENAI_API_KEY,
        model_name=config.LLM_MODEL_NAME,
        temperature=0.3
    )

    # Create the RAG chain
    rag_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=compression_retriever, # Use the compression_retriever
        chain_type_kwargs={"prompt": prompt}
    )
    return rag_chain

if __name__ == "__main__":
    # Example usage
    try:
        chain = get_rag_chain()
        query = "What were the key takeaways from the latest earnings call?"
        print(f"Query: {query}")
        response = chain.run(query)
        print(f"Response: {response}")
    except FileNotFoundError as e:
        print(e)
    except Exception as e:
        print(f"An error occurred: {e}")