import os
import re
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from scripts.config import TRANSCRIPTS_DIR, CHUNK_SIZE, CHUNK_OVERLAP

def preprocess_transcript(text):
    # Remove boilerplate (e.g., headers, footers, disclaimers)
    text = re.sub(r"={3,}.*?={3,}", "", text, flags=re.DOTALL) # Remove sections like === Disclaimer ===
    text = re.sub(r"\n{2,}", "\n", text) # Reduce multiple newlines to single
    return text.strip()

def load_and_chunk_transcripts(company_name=None):
    all_documents = []
    target_dir = os.path.join(TRANSCRIPTS_DIR, company_name) if company_name else TRANSCRIPTS_DIR

    for root, _, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".txt"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                preprocessed_content = preprocess_transcript(content)

                # Extract metadata from file path (e.g., company, date)
                # Assuming path format: .../Transcripts/COMPANY/YYYY-Mon-DD-COMPANY.txt
                parts = file_path.split(os.sep)
                company = parts[-2] if len(parts) >= 2 else "unknown"
                date_match = re.search(r"\\d{4}-\\w{3}-\\d{2}", file) # YYYY-Mon-DD
                date = date_match.group(0) if date_match else "unknown"

                splitter = RecursiveCharacterTextSplitter(
                    chunk_size=1200,
                    chunk_overlap=250,
                    length_function=len,
                    is_separator_regex=False,
                )
                
                # LangChain's splitter expects a list of strings for create_documents
                # and applies metadata to all documents created from that string.
                # If you want per-chunk metadata, you might need to iterate and create Document objects manually.
                chunks = splitter.split_text(preprocessed_content)
                
                for i, chunk in enumerate(chunks):
                    metadata = {
                        "company": company,
                        "date": date,
                        "source": file_path,
                        "chunk_id": f"{file_path}_{i}"
                    }
                    all_documents.append(Document(page_content=chunk, metadata=metadata))
    return all_documents

if __name__ == "__main__":
    print(f"Loading and chunking transcripts from: {TRANSCRIPTS_DIR}")
    documents = load_and_chunk_transcripts()
    print(f"Generated {len(documents)} document chunks.")
    # Example of accessing a chunk
    if documents:
        print("\n--- Example Chunk ---")
        print(f"Content: {documents[0].page_content[:200]}...")
        print(f"Metadata: {documents[0].metadata}")