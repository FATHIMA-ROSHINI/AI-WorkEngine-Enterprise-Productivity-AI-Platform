from typing import List, Dict, Any, Union
from langgraph.graph import StateGraph, END
from shared.models import WorkEngineState
from core.agents.architect import ArchitectAgent
from core.agents.reviewer import ReviewerAgent
from core.agents.coder import CoderAgent
from core.agents.sre import SREAgent
from core.agents.infra import InfraAgent
from core.agents.security import SecurityAgent
from core.agents.quality import QualityAgent

# Node Handlers
def architect_node(state: WorkEngineState):
    agent = ArchitectAgent()
    return agent.brainstorm(state)

def reviewer_node(state: WorkEngineState):
    agent = ReviewerAgent()
    return agent.critique(state)

def coder_node(state: WorkEngineState):
    agent = CoderAgent()
    return agent.implement(state)

def security_node(state: WorkEngineState):
    agent = SecurityAgent()
    return agent.scan_code(state)

def quality_node(state: WorkEngineState):
    agent = QualityAgent()
    return agent.verify_logic(state)

def infra_node(state: WorkEngineState):
    agent = InfraAgent()
    return agent.generate_infrastructure(state)

def sre_node(state: WorkEngineState):
    agent = SREAgent()
    return agent.triage_incident(state.get("incident_report", "No logs"))

# Routing Logic
def should_continue(state: WorkEngineState):
    """
    The Decision Logic of the AI WorkEngine. 
    Handles branching for Security, Quality, Infra, and SRE.
    """
    current = state.get("current_agent")
    
    if current == "ARCHITECT": return "architect"
    if current == "CODER": return "coder"
    if current == "SECURITY": return "security"
    if current == "QUALITY": return "quality"
    if current == "INFRA": return "infra"
    if current == "ESCALATION": return END
    if current == "FINALIZER": return END
    
    return "reviewer"

# Graph Construction
workflow = StateGraph(WorkEngineState)

# Add Nodes
workflow.add_node("architect", architect_node)
workflow.add_node("reviewer", reviewer_node)
workflow.add_node("coder", coder_node)
workflow.add_node("security", security_node)
workflow.add_node("quality", quality_node)
workflow.add_node("infra", infra_node)
workflow.add_node("sre", sre_node)

# Set Entry Point
workflow.set_entry_point("architect")

# Edges
workflow.add_edge("architect", "reviewer")

workflow.add_conditional_edges(
    "reviewer",
    should_continue,
    {
        "architect": "architect",
        "coder": "coder",
        "infra": "infra"
    }
)

# Mandatory Security Guardrail
workflow.add_edge("coder", "security")

workflow.add_conditional_edges(
    "security",
    lambda state: "coder" if state.get("security_status") == "VULNERABLE" else "quality",
    {"coder": "coder", "quality": "quality"}
)

workflow.add_edge("quality", "infra")
workflow.add_edge("infra", END)
workflow.add_edge("sre", "architect")

# Compile
workengine_app = workflow.compile()
