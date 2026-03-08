import ast
from typing import List, Dict

class CodeAnalyzer:
    def parse_python_file(self, content: str) -> List[Dict]:
        """
        Parses a Python file and returns a list of classes and functions.
        This allows the AI to "Understand" the code structure.
        """
        tree = ast.parse(content)
        structure = []
        
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                structure.append({
                    "type": "class",
                    "name": node.name,
                    "line": node.lineno,
                    "doc": ast.get_docstring(node)
                })
            elif isinstance(node, ast.FunctionDef):
                structure.append({
                    "type": "function",
                    "name": node.name,
                    "line": node.lineno,
                    "doc": ast.get_docstring(node)
                })
        return structure

    def search_pattern(self, content: str, pattern: str) -> bool:
        """Deep search for security/logic patterns."""
        return pattern in content
