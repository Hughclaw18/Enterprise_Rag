# Enterprise Document Master 🔮

An AI-powered Q&A system for corporate earnings transcripts, built with RAG, LangChain, Streamlit, and **NVIDIA NeMo** models.

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [License](#-license)

## 🚀 Features

* **Advanced Document Retrieval:** Utilizes a **FAISS** vector store and **NVIDIA NeMo** for high-accuracy embedding and reranking.
* **State-of-the-Art Generation:** Powered by the **Llama 3.3 Nemotron** model for insightful and context-aware answers.
* **Interactive Chat Interface:** A **Streamlit-based** UI provides a seamless, real-time Q&A experience with full conversation history.
* **Secure User Management:** Features robust **user authentication** and session management to ensure secure, personalized access.
* **Persistent Data Storage:** Integrates with **SQLite** to save user profiles, chat sessions, and message history.

## 🛠️ Technology Stack

* **Frontend:** Streamlit
* **Backend & Orchestration:** LangChain, Python
* **LLM:** NVIDIA NeMo (Llama 3.3 Nemotron)
* **Embedding & Reranking:** NVIDIA NeMo
* **Vector Store:** FAISS (Facebook AI Similarity Search)
* **Database:** SQLite

## 🏁 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

* Python 3.9 or higher
* An **NVIDIA API Key**

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/yourusername/Enterprise_Rag.git](https://github.com/yourusername/Enterprise_Rag.git)
    cd Enterprise_Rag
    ```

2.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set Up Environment Variables:**
    Create a `.env` file from the example and add your NVIDIA API key.
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and add your key:
    ```
    NVIDIA_API_KEY="nvapi-..."
    ```

### Data Preparation and Indexing

1.  **Add Transcripts:**
    Place your corporate earnings call PDFs inside the `Call_Transcripts/Transcripts` directory.
    ```bash
    # Create the directory if it doesn't exist
    mkdir -p Call_Transcripts/Transcripts
    ```

2.  **Generate Embeddings:**
    This script processes the PDFs, creates vector embeddings using NeMo, and builds the FAISS index for retrieval.
    ```bash
    python scripts/embed_and_index.py
    ```

### Run the Application

Launch the Streamlit web interface.
```bash
streamlit run ui/app.py
