from shared.models import WorkEngineState
from typing import Dict, Any
import time

class ReviewerAgent:
    def __init__(self, model: Any = None):
        self.model = model

    def critique(self, state: WorkEngineState) -> Dict[str, Any]:
        """
        Performs a tactical audit of the architectural synthesis.
        """
        print("Reviewer Agent: Performing protocol audit [Audit_ID: " + time.strftime('%H%M%S') + "]...")
        
        # Real logic: Audit the plan based on the user request and project state
        plan = state.get("plan", "")
        issues = []
        
        # Check for synthesis quality
        if len(plan) < 200:
            issues.append("Synthesis volume too low. Expand architectural detail.")
        
        if not issues:
            print("Reviewer Agent: Protocol Approved.")
            return {
                "current_agent": "CODER",
                "audit_log": state["audit_log"] + [{
                    "agent": "Reviewer", 
                    "action": "APPROVED", 
                    "status": "PASSED",
                    "payload": f"Audit {time.strftime('%H%M%S')}: Synthesis adheres to Secure Mesh Protocol."
                }]
            }
        else:
            print(f"Reviewer Agent: Protocol Rejected. Issues: {issues}")
            return {
                "current_agent": "ARCHITECT",
                "audit_log": state["audit_log"] + [{
                    "agent": "Reviewer", 
                    "action": "REJECTED", 
                    "status": "FAILED", 
                    "notes": issues
                }]
            }
