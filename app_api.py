# app_api.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.src.query import retrieval_chain  # import retrieval chain from RAG file
from app.src.query import llm  # import llm from RAG file

app = FastAPI()

# Allow CORS for local React dev
# Adds CORS middleware: This allows your React frontend (running on a different port, e.g., 3000) to make requests to your backend (port 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for conversation history (use a database for production)
user_histories = {}

def build_history_text(history):
    return "\n".join(
        f"{'User' if m['role']=='user' else 'Assistant'}: {m['content']}" for m in history
    )

@app.post("/ask")
async def ask_question(request: Request):
    data = await request.json()
    user_input = data.get("question", "")
    result = retrieval_chain.invoke({"input": user_input})
    return {
        "answer": result["answer"],
        "context": result["context"]
    }
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
# @app.post("/ask")
# async def ask_question(request: Request):
#     data = await request.json()
#     print("Received data:", data)
#     user_input = data.get("question", "")
#     session_id = data.get("session_id", "default")  # You can generate or pass a session/user id from frontend

#     # Get or create history for this session
#     history = user_histories.setdefault(session_id, [])
#     # Add the new user message
#     history.append({"role": "user", "content": user_input})

#     # Build history string for the prompt (excluding the current assistant response)
#     history_text = build_history_text(history)

#     # Call the chain
#     result = retrieval_chain.invoke({
#         "history": history_text,
#         "input": user_input,
#         "context": ""  # If you use context, pass it here or let the chain handle it
#     })

#     # Add the assistant's response to the history
#     history.append({"role": "assistant", "content": result["answer"]})

#     return {
#         "answer": result["answer"],
#         "context": result["context"]
#     }