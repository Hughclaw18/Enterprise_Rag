import streamlit as st
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.rag_chain import get_rag_chain

st.set_page_config(page_title="Echoes of the Oracle", page_icon="🔮")

st.title("🔮 Echoes of the Oracle")
st.markdown("### Your Mythic Guide to Corporate Prophecies")

# Initialize RAG chain (cached to avoid reloading on every rerun)
@st.cache_resource
def load_rag_chain():
    try:
        return get_rag_chain()
    except FileNotFoundError as e:
        st.error(f"Error: {e}. Please ensure you have run `embed_and_index.py` to create the FAISS index.")
        return None
    except Exception as e:
        st.error(f"An unexpected error occurred while loading the RAG chain: {e}")
        return None

rag_chain = load_rag_chain()

if rag_chain:
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # Display chat messages from history on app rerun
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Accept user input
    if query := st.chat_input("Ask Raegar Moonstorm about the earnings calls..."):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": query})
        # Display user message in chat message container
        with st.chat_message("user"):
            st.markdown(query)

        # Get assistant response
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            full_response = ""
            try:
                response = rag_chain.run(query)
                full_response = response
            except Exception as e:
                full_response = f"Raegar is momentarily lost in the cosmic winds. An error occurred: {e}"
            
            message_placeholder.markdown(full_response)
        st.session_state.messages.append({"role": "assistant", "content": full_response})
else:
    st.info("Please resolve the errors above to proceed with the chat application.")