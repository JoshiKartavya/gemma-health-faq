from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_engine import retrieve

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "Medical RAG API Running"}


@app.post("/chat")
def chat(req: ChatRequest):

    result = retrieve(req.question)

    return {
        "question": req.question,
        "retrieved_question": result["question"],
        "answer": result["answer"],
        "language": result["language"]
    }