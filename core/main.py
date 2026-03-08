import json
import asyncio
import random
import os
from fastapi import FastAPI, WebSocket, Depends, HTTPException, Security, Query
from fastapi.security import APIKeyHeader, APIKeyQuery
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from tools.indexer import ContextVault

# --- Security Configuration ---
# Enterprise-grade API key auth
API_KEY_NAME = "X-API-Key"
MASTER_API_KEY = os.getenv("WORKENGINE_API_KEY", "nova-default-secure-key")

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
api_key_query = APIKeyQuery(name="token", auto_error=False)

async def get_api_key(
    header_key: str = Security(api_key_header),
    query_key: str = Security(api_key_query),
):
    if header_key == MASTER_API_KEY or query_key == MASTER_API_KEY:
        return header_key or query_key
    raise HTTPException(status_code=403, detail="Invalid API Key")

# --- ContextVault Setup ---
vault = ContextVault()

# --- Database Configuration ---
# Defaults to local SQLite for zero-config dev, but uses DATABASE_URL if provided (e.g., via Docker)
DEFAULT_SQLITE_URL = f"sqlite:///{os.path.join(os.getcwd(), 'workengine.db')}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

# Check if using SQLite (standard or fallback)
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    try:
        engine = create_engine(DATABASE_URL)
        # Test connection briefly
        with engine.connect() as conn:
            pass
    except Exception as e:
        print(f"Database: PostgreSQL unreachable ({e}). Falling back to local SQLite...")
        DATABASE_URL = DEFAULT_SQLITE_URL
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Database Model ---
class TaskModel(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True, index=True)
    sender = Column(String)
    recipient = Column(String)
    payload = Column(Text)
    status = Column(String, default="PENDING")

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                # Handle stale connections
                pass

manager = ConnectionManager()

# --- API Implementation ---
app = FastAPI(title="AI WorkEngine Orchestrator")

# Enterprise CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, # Credentials can't be used with "*"
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key", "Authorization"],
)

class AgentTask(BaseModel):
    task_id: str
    sender: str
    recipient: str
    payload: dict
    status: str = "PENDING"

@app.get("/")
async def root():
    return {
        "status": "WorkEngine OS: Online", 
        "version": "0.1.0", 
        "engine": "PostgreSQL" if not DATABASE_URL.startswith("sqlite") else "SQLite (Fallback)",
        "vault": "Qdrant" if vault.collection_name == "codebase_memory" else "Qdrant (In-Memory Fallback)"
    }

@app.post("/index")
async def trigger_indexing(api_key: str = Depends(get_api_key)):
    """Triggers an indexing process of the current project directory."""
    async def run_indexing():
        root_dir = os.getcwd()
        for root, dirs, files in os.walk(root_dir):
            if any(part in root for part in [".next", "node_modules", "__pycache__", ".git"]):
                continue
            for file in files:
                if file.endswith((".py", ".ts", ".tsx", ".css", ".md")):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                            vault.index_file(file_path, content)
                            await manager.broadcast({
                                "agent": "Architect",
                                "action": "INDEXING",
                                "payload": f"ContextVault™ indexed {file}"
                            })
                    except Exception as e:
                        print(f"Error indexing {file}: {e}")
        
        await manager.broadcast({
            "agent": "System",
            "action": "INDEXING_COMPLETE",
            "payload": "The entire codebase is now searchable in ContextVault™."
        })

    asyncio.create_task(run_indexing())
    return {"message": "Indexing started in background"}

import sys
from pathlib import Path

# Add project root to sys.path to allow absolute imports
root_path = str(Path(__file__).parent.parent)
if root_path not in sys.path:
    sys.path.append(root_path)

from core.graph.workflow import workengine_app
from shared.models import BaseMessage

# ... (inside app)

@app.post("/tasks")
async def create_task(
    task: AgentTask, 
    db: Session = Depends(get_db),
    api_key: str = Depends(get_api_key)
):
    try:
        print(f"Main: Starting concurrent mesh workflow for task {task.task_id}...")
        
        # 1. Initialize State for LangGraph
        initial_state = {
            "messages": [BaseMessage(content=task.payload.get("query", ""), type="human")],
            "plan": None,
            "tasks": [],
            "current_agent": "ARCHITECT",
            "audit_log": [],
            "security_status": None,
            "infra_specs": [],
            "incident_report": None
        }

        # 2. Run Workflow using LangGraph in a non-blocking thread to allow true concurrency
        async def run_mesh():
            current_state = initial_state
            
            try:
                # Use astream for real-time telemetry events
                async for event in workengine_app.astream(current_state):
                    for node_name, node_output in event.items():
                        # Extract information for the UI
                        agent_name = node_name.capitalize()
                        
                        # Determine action and payload based on node output
                        action = "PROCESSING"
                        payload = ""
                        
                        if "plan" in node_output:
                            action = "DESIGN_GENERATED"
                            payload = node_output["plan"]
                        elif "security_status" in node_output:
                            action = "SCAN_COMPLETE"
                            payload = f"Security Status: {node_output['security_status']}"
                        elif "quality_report" in node_output:
                            action = "VERIFICATION_COMPLETE"
                            payload = node_output["quality_report"]
                        elif "infra_specs" in node_output:
                            action = "INFRA_READY"
                            payload = "\n".join(node_output["infra_specs"])
                        
                        # Fallback payload from audit_log if available
                        if not payload and "audit_log" in node_output:
                            last_entry = node_output["audit_log"][-1]
                            action = last_entry.get("action", "UPDATE")
                            payload = last_entry.get("payload", last_entry.get("notes", "Step completed."))

                        await manager.broadcast({
                            "agent": agent_name,
                            "action": action,
                            "payload": payload
                        })
                        
                        # Small delay to prevent front-end flooding while maintaining high speed
                        await asyncio.sleep(0.2)

                await manager.broadcast({
                    "agent": "System",
                    "action": "WORKFLOW_COMPLETE",
                    "payload": f"Protocol {task.task_id} finalized successfully."
                })
            except Exception as e:
                await manager.broadcast({
                    "agent": "System",
                    "action": "MESH_ERROR",
                    "payload": f"Workflow failed: {str(e)}"
                })

        # Launch non-blocking task
        asyncio.create_task(run_mesh())

        return {
            "message": "Mesh protocol initiated", 
            "task_id": task.task_id
        }
    except Exception as e:
        print(f"Main: ERROR in create_task: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/stream")
async def websocket_endpoint(
    websocket: WebSocket,
    token: Optional[str] = Query(None)
):
    if token != MASTER_API_KEY:
        await websocket.close(code=4003) # Forbidden
        return
        
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
