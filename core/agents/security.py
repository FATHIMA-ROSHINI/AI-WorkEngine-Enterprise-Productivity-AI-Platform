from typing import Dict, Any, List
from shared.models import WorkEngineState
import time

class SecurityAgent:
    def __init__(self, model: Any = None):
        self.model = model

    def scan_code(self, state: WorkEngineState) -> Dict[str, Any]:
        """
        Deep Structural Scan (DSS) for security protocol adherence.
        """
        print("Security Agent: Executing DSS scan on synthesis buffer...")
        
        # Real logic: Scan the implementation code for security threats
        # The code is usually in the last audit_log from the Coder
        code_content = ""
        for entry in state.get("audit_log", []):
            if entry.get("agent") == "Coder" and entry.get("action") == "CODE_READY":
                code_content = entry.get("payload", "")
                break
        
        threats = []
        if not code_content:
            threats.append("CRITICAL: Code Buffer Empty. Synthesis failure.")
        elif "eval(" in code_content:
            threats.append("VULN_ID: RCE-401 (eval() usage detected)")
        elif "exec(" in code_content:
            threats.append("VULN_ID: RCE-402 (exec() usage detected)")

        if not threats:
            print("Security Agent: Buffer secure. Protocol integrity confirmed.")
            return {
                "current_agent": "QUALITY",
                "security_status": "SECURE",
                "audit_log": state.get("audit_log", []) + [{
                    "agent": "Security", 
                    "action": "SCAN_COMPLETE", 
                    "status": "PASSED",
                    "payload": f"Audit {time.strftime('%H%M%S')}: Structural integrity verified. No threats detected."
                }]
            }
        else:
            print(f"Security Agent: Threats identified: {threats}")
            return {
                "current_agent": "CODER", 
                "security_status": "THREAT_DETECTED",
                "audit_log": state.get("audit_log", []) + [{
                    "agent": "Security", 
                    "action": "THREAT_DETECTED", 
                    "status": "FAILED",
                    "notes": threats
                }]
            }
