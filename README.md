# Enterprise Document Master 🔮

An AI-powered Q&A system for corporate earnings transcripts, built with Retrieval Augmented Generation (RAG), LangChain, and Streamlit.

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [License](#-license)

## 🚀 Features

* **Advanced Document Retrieval:** Utilizes a **FAISS** vector store for rapid, semantic searching of corporate transcript contents.
* **Interactive Chat Interface:** A **Streamlit-based** UI provides a seamless, real-time Q&A experience with full conversation history.
* **Secure User Management:** Features robust **user authentication** and session management to ensure secure, personalized access.
* **Persistent Data Storage:** Integrates with **SQLite** to save user profiles, chat sessions, and message history.
* **Dynamic Configuration:** Easily manage API keys and application settings through dedicated environment and configuration files.

## 🛠️ Technology Stack

* **Frontend:** Streamlit
* **Backend & Orchestration:** LangChain, Python
* **Vector Store:** FAISS (Facebook AI Similarity Search)
* **Database:** SQLite
* **LLM Provider:** OpenAI

## 🏁 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

* Python 3.9 or higher
* An OpenAI API Key

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
    Create a `.env` file from the example and add your OpenAI API key.
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and add your key:
    ```
    OPENAI_API_KEY="sk-..."
    ```

### Data Preparation and Indexing

1.  **Add Transcripts:**
    Place your corporate earnings call PDFs inside the `Call_Transcripts/Transcripts` directory.
    ```bash
    # Create the directory if it doesn't exist
    mkdir -p Call_Transcripts/Transcripts
    ```

2.  **Generate Embeddings:**
    This script processes the PDFs, creates vector embeddings, and builds the FAISS index for retrieval.
    ```bash
    python scripts/embed_and_index.py
    ```

### Run the Application

Launch the Streamlit web interface.
```bash
streamlit run ui/app.py
```

## 🏗️ Project Structure

```
Enterprise_Rag/
├── ui/               # Streamlit frontend
├── scripts/          # Core functionality
├── Call_Transcripts/ # Earnings call storage
├── models/           # FAISS vector store
└── profile_pics/     # User uploaded images
```

## ⚙️ Configuration

Edit `.streamlit/credentials.toml` for auth settings:
```toml
[server]
port = 8501

[theme]
primaryColor = "#7f7f7f"
```                                                                                     
