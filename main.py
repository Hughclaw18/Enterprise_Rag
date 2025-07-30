from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from scripts.rag_chain import get_rag_chain

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Updated frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    text: str

@app.post("/query")
def query_rag(query: Query):
    try:
        rag_chain = get_rag_chain()
        response = rag_chain.invoke(query.text)
        return {"response": response['result']}
    except Exception as e:
        return {"error": str(e)}

@app.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    upload_dir = "./Call_Transcripts/Uploaded"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    file_path = os.path.join(upload_dir, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        return {"message": f"File '{file.filename}' uploaded successfully."}
    except Exception as e:
        return {"detail": str(e), "message": "An error occurred during file processing"}