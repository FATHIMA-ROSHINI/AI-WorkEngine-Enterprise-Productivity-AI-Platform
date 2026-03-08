from pydantic import BaseModel, Field
from typing import List, Optional, Sequence, Annotated, TypedDict

class BaseMessage(BaseModel):
    content: str
    type: str = "human"

class AuditEntry(BaseModel):
    agent: str
    action: str
    status: str
    payload: Optional[str] = None
    timestamp: Optional[float] = None

class WorkEngineState(TypedDict):
    """
    The Shared Memory of the Agentic Mesh.
    This structure ensures "Conflict-Free" communication between 
    Architect, Coder, and Security agents.
    """
    messages: Annotated[Sequence[BaseMessage], "The conversation history"]
    plan: Optional[str]
    tasks: List[str]
    current_agent: str
    audit_log: List[dict]
    security_status: Optional[str]
    infra_specs: Optional[List[str]]
    incident_report: Optional[str]
    quality_report: Optional[str] # Added for Quality Agent
