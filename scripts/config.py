import os

# API Keys
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE")

# Paths
TRANSCRIPTS_DIR = "f:\\Enterprise_Rag\\Call_Transcripts\\Transcripts"
FAISS_INDEX_PATH = "f:\\Enterprise_Rag\\models\\faiss_index"

# RAG Parameters
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# LLM Parameters
LLM_MODEL_NAME = "llama3-8b-8192"
NVIDIA_EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"



# Persona Prompt
PERSONA_PROMPT_TEMPLATE = """
You are a professional AI assistant focused on providing accurate information from the knowledge base.
Answer the user's question thoroughly and comprehensively, synthesizing information from the retrieved transcript excerpts.
Provide detailed and factual responses, ensuring all information is directly supported by the provided context.
If the information is not explicitly available in the context, state that you cannot provide a definitive answer based on the given transcripts.

Context:
{context}

Question:
{question}

Answer:
"""