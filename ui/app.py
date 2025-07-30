import streamlit as st
import sys
import os

# --- Setup and Imports ---
# Add project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.rag_chain import get_rag_chain
from scripts.db_manager import init_db, add_user, get_user, create_chat_session, get_chat_sessions, add_chat_message, get_chat_messages, delete_chat_session, clear_chat_messages

# --- Page Configuration ---
st.set_page_config(page_title="Enterprise Doc Master", page_icon="🔮", layout="wide")

# --- Database Initialization ---
init_db()

# --- Helper Functions ---
@st.cache_resource
def load_rag_chain():
    """Load and cache the RAG chain, handling potential errors."""
    try:
        return get_rag_chain()
    except FileNotFoundError as e:
        st.error(f"Error: {e}. Please run `embed_and_index.py` to create the vector index.")
        return None
    except Exception as e:
        st.error(f"An unexpected error occurred while loading the RAG chain: {e}")
        return None

def logout():
    """Clear session state variables to log the user out."""
    keys_to_delete = ["logged_in", "user_id", "username", "current_session_id", "messages"]
    for key in keys_to_delete:
        if key in st.session_state:
            del st.session_state[key]
    st.rerun()

# --- UI Rendering Functions ---

def render_login_page():
    """Render the login and signup UI."""
    st.title("Welcome to 🔮 Enterprise Doc Master")
    st.markdown("Your personal guide to corporate earnings transcripts.")

    # Center the login/signup form
    with st.container():
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            login_tab, signup_tab = st.tabs(["Login", "Sign Up"])

            with login_tab:
                with st.form("login_form"):
                    st.subheader("Login to your account")
                    login_username = st.text_input("Username", key="login_username")
                    login_password = st.text_input("Password", type="password", key="login_password")
                    submitted = st.form_submit_button("Login")
                    if submitted:
                        user = get_user(login_username, login_password)
                        if user:
                            st.session_state.logged_in = True
                            st.session_state.user_id = user[0]
                            st.session_state.username = user[1]
                            st.rerun()
                        else:
                            st.error("Invalid username or password")

            with signup_tab:
                with st.form("signup_form"):
                    st.subheader("Create a new account")
                    signup_username = st.text_input("New Username", key="signup_username")
                    signup_password = st.text_input("New Password", type="password", key="signup_password")
                    submitted = st.form_submit_button("Sign Up")
                    if submitted:
                        if add_user(signup_username, signup_password):
                            st.success("Account created successfully! Please login.")
                        else:
                            st.error("Username already exists. Please choose another.")

def render_main_app():
    """Render the main chat application UI after login."""
    rag_chain = load_rag_chain()
    if not rag_chain:
        st.warning("The chat functionality is disabled due to an error. Please check the error messages above.")
        st.stop()
    
    # --- Sidebar for Session Management ---
    with st.sidebar:
        st.title(f"Welcome, {st.session_state.username}!")
        if st.button("Logout"):
            logout()
        
        st.divider()
        st.header("Chat Sessions")

        if st.button("➕ New Chat"):
            st.session_state.current_session_id = create_chat_session(st.session_state.user_id, None)
            st.session_state.messages = []
            st.rerun()

        sessions = get_chat_sessions(st.session_state.user_id)
        if sessions:
            # Create a mapping from a display name to session ID
            session_options = {s[0]: f"Session {s[0]} - {s[2].split(' ')[0]}" for s in sessions}
            
            # Function to be called when a session is selected
            def on_session_change():
                session_id = st.session_state["session_selector"]
                # Only reload if the session has actually changed
                if "current_session_id" not in st.session_state or st.session_state.current_session_id != session_id:
                    st.session_state.current_session_id = session_id
                    st.session_state.messages = []
                    history = get_chat_messages(session_id)
                    for sender, message, timestamp in history:
                        st.session_state.messages.append({"role": sender, "content": message})

            # Use selectbox for session selection
            selected_session_display = st.selectbox(
                "Select a session:",
                options=list(session_options.keys()),
                format_func=lambda x: session_options[x],
                key="session_selector",
                on_change=on_session_change
            )
            # Add a delete session button
            if st.button("Delete Selected Session"): 
                if selected_session_id:
                    delete_chat_session(selected_session_id)
                    st.session_state.messages = []
                    if "current_session_id" in st.session_state:
                        del st.session_state.current_session_id
                    st.success(f"Session {selected_session_id} deleted.")
                    st.rerun()
                else:
                    st.warning("Please select a session to delete.")
        else:
            st.info("No chat sessions found. Start a new one!")

    # Add a clear chat button for the current session
    if "current_session_id" in st.session_state and st.session_state.messages:
        if st.button("Clear Current Chat"): 
            clear_chat_messages(st.session_state.current_session_id)
            st.session_state.messages = []
            st.success("Chat history cleared for this session.")
            st.rerun()

    # --- Main Chat Interface ---
    st.title("🔮 Enterprise Doc Master")
    
    if "current_session_id" in st.session_state:
        # Display chat messages from history
        if "messages" not in st.session_state:
            st.session_state.messages = []

        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])

        # Accept user input
        if query := st.chat_input("Ask about the earnings calls..."):
            # Add and display user message
            st.session_state.messages.append({"role": "user", "content": query})
            add_chat_message(st.session_state.current_session_id, "user", query)
            with st.chat_message("user"):
                st.markdown(query)

            # Get and display assistant response
            with st.chat_message("assistant"):
                with st.spinner("Entity is thinking..."):
                    try:
                        result = rag_chain.invoke({"query": query})
                        full_response = result.get("result", "Sorry, I couldn't find an answer.")
                    except Exception as e:
                        full_response = f"An error occurred: {e}"
                
                st.markdown(full_response)
                st.session_state.messages.append({"role": "assistant", "content": full_response})
                add_chat_message(st.session_state.current_session_id, "assistant", full_response)
    else:
        # Welcome message when no session is selected
        st.info("⬅️ Create a new chat or select an existing one from the sidebar to get started!")


# --- Main Application Logic ---
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if st.session_state.logged_in:
    render_main_app()
else:
    render_login_page()
