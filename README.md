# Enterprise Document Master 🔮

An AI-powered Q&A system for corporate earnings transcripts, built with RAG, LangChain, Streamlit, and NVIDIA NeMo models.

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.9%2B-blueviolet.svg">
  <img alt="Framework" src="https://img.shields.io/badge/Framework-Streamlit-red.svg">
</p>

---

## 📋 Table of Contents
- [Features](#-features)
- [Built With](#-built-with)
- [How It Works](#-how-it-works)
- [Usage Demo](#-usage-demo)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Configuration](#-configuration)
- [License](#-license)

## 🚀 Features

* **Advanced Document Retrieval:** Utilizes a **FAISS** vector store and **NVIDIA NeMo** for high-accuracy embedding and reranking.
* **State-of-the-Art Generation:** Powered by the **Llama 3.3 Nemotron** model for insightful and context-aware answers.
* **Interactive Chat Interface:** A **Streamlit-based** UI provides a seamless, real-time Q&A experience with full conversation history.
* **Secure User Management:** Features robust **user authentication** and session management to ensure secure, personalized access.
* **Persistent Data Storage:** Integrates with **SQLite** to save user profiles, chat sessions, and message history.

## 🛠️ Built With

This project leverages a modern stack of AI and web technologies:

<p align="center">
  <a href="https://www.nvidia.com/en-us/ai-data-science/generative-ai/nemo-framework/" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Nvidia_logo.svg/2880px-Nvidia_logo.svg.png" width="120" alt="NVIDIA"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://python.langchain.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain/langchain/img/langchain-logo-wordmark.png" height="40" alt="LangChain"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://ai.meta.com/blog/meta-llama-3/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/meta-llama/llama/main/meta_llama_logo.png" height="40" alt="Llama"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://streamlit.io/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/streamlit/streamlit/develop/components/brand/assets/s-logo-primary-red.svg" height="40" alt="Streamlit"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.sqlite.org/" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Sqlite-logo.svg/2560px-Sqlite-logo.svg.png" height="40" alt="SQLite"></a>
</p>

* **Core Logic:** Python, LangChain
* **Models & AI:** NVIDIA NeMo (Embedding, Reranking), Llama 3.3 Nemotron (Generation)
* **Vector Store:** FAISS
* **Frontend:** Streamlit
* **Database:** SQLite

---

## 🧠 How It Works

The application follows a Retrieval Augmented Generation (RAG) pipeline to answer user questions.

1.  **Indexing:** All PDF documents in the `Call_Transcripts/` directory are loaded, split into smaller text chunks, and converted into numerical vectors (embeddings) using an **NVIDIA NeMo** model. These vectors are stored in a **FAISS** index for efficient searching.
2.  **User Query:** A user asks a question through the Streamlit interface.
3.  **Retrieval:** The user's question is also converted into an embedding. The FAISS index is searched to find the text chunks with embeddings most similar to the question's embedding.
4.  **Reranking:** The retrieved chunks are passed through an **NVIDIA NeMo** reranker model to prioritize the most contextually relevant documents and filter out noise.
5.  **Generation:** The original question and the top-ranked, relevant text chunks are combined into a detailed prompt. This prompt is sent to the **Llama 3.3 Nemotron** model, which generates a comprehensive answer based *only* on the provided context.
6.  **Response:** The final answer is displayed to the user in the chat interface.

---

## 🎬 Usage Demo

After launching the application, you can:
1.  **Sign Up** for a new account or **Login** with existing credentials.
2.  Create a **New Chat** session from the sidebar.
3.  Ask questions about the indexed corporate transcripts in the chat input box.
4.  View the AI-generated answers and conversation history.

<br>

>*A GIF or screenshot of the application in action would be perfect here.*

<br>

---

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
streamlit run ui/app.py# Enterprise Document Master 🔮

An AI-powered Q&A system for corporate earnings transcripts, built with RAG, LangChain, Streamlit, and NVIDIA NeMo models.

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.9%2B-blueviolet.svg">
  <img alt="Framework" src="https://img.shields.io/badge/Framework-Streamlit-red.svg">
</p>

---

## 📋 Table of Contents
- [Features](#-features)
- [Built With](#-built-with)
- [How It Works](#-how-it-works)
- [Usage Demo](#-usage-demo)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Configuration](#-configuration)
- [License](#-license)

## 🚀 Features

* **Advanced Document Retrieval:** Utilizes a **FAISS** vector store and **NVIDIA NeMo** for high-accuracy embedding and reranking.
* **State-of-the-Art Generation:** Powered by the **Llama 3.3 Nemotron** model for insightful and context-aware answers.
* **Interactive Chat Interface:** A **Streamlit-based** UI provides a seamless, real-time Q&A experience with full conversation history.
* **Secure User Management:** Features robust **user authentication** and session management to ensure secure, personalized access.
* **Persistent Data Storage:** Integrates with **SQLite** to save user profiles, chat sessions, and message history.

## 🛠️ Built With

This project leverages a modern stack of AI and web technologies:

<p align="center">
  <a href="https://www.nvidia.com/en-us/ai-data-science/generative-ai/nemo-framework/" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Nvidia_logo.svg/2880px-Nvidia_logo.svg.png" width="120" alt="NVIDIA"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://python.langchain.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain/langchain/img/langchain-logo-wordmark.png" height="40" alt="LangChain"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://ai.meta.com/blog/meta-llama-3/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/meta-llama/llama/main/meta_llama_logo.png" height="40" alt="Llama"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://streamlit.io/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/streamlit/streamlit/develop/components/brand/assets/s-logo-primary-red.svg" height="40" alt="Streamlit"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.sqlite.org/" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Sqlite-logo.svg/2560px-Sqlite-logo.svg.png" height="40" alt="SQLite"></a>
</p>

* **Core Logic:** Python, LangChain
* **Models & AI:** NVIDIA NeMo (Embedding, Reranking), Llama 3.3 Nemotron (Generation)
* **Vector Store:** FAISS
* **Frontend:** Streamlit
* **Database:** SQLite

---

## 🧠 How It Works

The application follows a Retrieval Augmented Generation (RAG) pipeline to answer user questions.

1.  **Indexing:** All PDF documents in the `Call_Transcripts/` directory are loaded, split into smaller text chunks, and converted into numerical vectors (embeddings) using an **NVIDIA NeMo** model. These vectors are stored in a **FAISS** index for efficient searching.
2.  **User Query:** A user asks a question through the Streamlit interface.
3.  **Retrieval:** The user's question is also converted into an embedding. The FAISS index is searched to find the text chunks with embeddings most similar to the question's embedding.
4.  **Reranking:** The retrieved chunks are passed through an **NVIDIA NeMo** reranker model to prioritize the most contextually relevant documents and filter out noise.
5.  **Generation:** The original question and the top-ranked, relevant text chunks are combined into a detailed prompt. This prompt is sent to the **Llama 3.3 Nemotron** model, which generates a comprehensive answer based *only* on the provided context.
6.  **Response:** The final answer is displayed to the user in the chat interface.

---

## 🎬 Usage Demo

After launching the application, you can:
1.  **Sign Up** for a new account or **Login** with existing credentials.
2.  Create a **New Chat** session from the sidebar.
3.  Ask questions about the indexed corporate transcripts in the chat input box.
4.  View the AI-generated answers and conversation history.

<br>

>*A GIF or screenshot of the application in action would be perfect here.*

<br>

---

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
