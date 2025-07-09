# app_api.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.src.main import retrieval_chain  # import retrieval chain from RAG file
from app.src.main import llm  # import llm from RAG file

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

def hybrid_qa(query):
    # Try retrieval-augmented answer
    result = retrieval_chain.invoke({"input": query})
    answer = result.get("answer", "")
    context = result.get("context", "")

    # If the answer is a "no info" message, fallback to LLM only
    if "does not contain any information" in answer.lower() or not context:
        # Use the LLM directly (no context)
        answer = llm.invoke(query).content
        context = "No context used (LLM only)."

    return {"answer": answer, "context": context}

# @app.post("/ask")
# async def ask_question(request: Request):
#     data = await request.json()
#     user_input = data.get("question", "")
#     result = retrieval_chain.invoke({"input": user_input})
#     return {
#         "answer": result["answer"],
#         "context": result["context"]
#     }
    
@app.post("/ask")
async def ask_question(request: Request):
    data = await request.json()
    user_input = data.get("question", "")
    result = hybrid_qa(user_input)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)