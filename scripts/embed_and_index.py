import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from dotenv import load_dotenv
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from langchain_community.vectorstores import FAISS
from scripts.preprocess import load_and_chunk_transcripts
from scripts.config import NVIDIA_EMBEDDING_MODEL_NAME
from scripts.config import FAISS_INDEX_PATH
import os

load_dotenv()
def embed_and_index(documents=None, company_name=None):
    if documents is None:
        print("Loading and chunking transcripts...")
        documents = load_and_chunk_transcripts(company_name)
        if not documents:
            print("No documents found to embed. Exiting.")
            return

    print(f"Embedding {len(documents)} document chunks...")
    embedding_model = NVIDIAEmbeddings(model=NVIDIA_EMBEDDING_MODEL_NAME, api_key=os.getenv("NVIDIA_API_KEY"), truncate="NONE")
    vectorstore = FAISS.from_documents(documents, embedding_model)

    print(f"Saving FAISS index to {FAISS_INDEX_PATH}...")
    os.makedirs(FAISS_INDEX_PATH, exist_ok=True)
    vectorstore.save_local(FAISS_INDEX_PATH)
    print("FAISS index saved successfully.")

if __name__ == "__main__":
    # Example usage: embed and index all transcripts
    embed_and_index()
    # Example usage: embed and index transcripts for a specific company (e.g., 'AAPL')
    # embed_and_index(company_name='AAPL')