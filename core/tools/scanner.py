import re
import math

class SecurityScanner:
    def __init__(self):
        # Professional Secret Detection Patterns
        self.secret_patterns = {
            "AWS_KEY": r"AKIA[0-9A-Z]{16}",
            "AWS_SECRET": r"[0-9a-zA-Z+/]{40}",
            "GENERIC_SECRET": r"(?i)(password|secret|key|token|auth)\s*[:=]\s*['\"][^'\"]+['\"]"
        }

    def calculate_entropy(self, text: str) -> float:
        """Checks for high-entropy strings (likely keys)."""
        if not text:
            return 0
        prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
        entropy = - sum([p * math.log(p) / math.log(2.0) for p in prob])
        return entropy

    def scan_content(self, content: str) -> list:
        vulnerabilities = []
        for name, pattern in self.secret_patterns.items():
            if re.search(pattern, content):
                vulnerabilities.append(f"BLOCKER: Possible {name} detected.")
        
        # Entropy check for suspicious strings
        for word in content.split():
            if len(word) > 20 and self.calculate_entropy(word) > 4.5:
                vulnerabilities.append(f"WARNING: High-entropy string detected: {word[:10]}...")
        
        return vulnerabilities
