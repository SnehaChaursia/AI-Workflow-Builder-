from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import parse_workflow
from n8n_builder import build_n8n_workflow

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkflowRequest(BaseModel):
    text: str

@app.post("/parse-workflow")
def create_workflow(request: WorkflowRequest):
    # Step 1 - Parse with Groq AI
    workflow = parse_workflow(request.text)
    
    # Step 2 - Create in n8n
    n8n_result = build_n8n_workflow(workflow)
    
    # Step 3 - Return both to frontend
    return {
        **workflow,
        "n8n": n8n_result
    }

@app.get("/")
def root():
    return {"status": "Workflow Builder API is running"}