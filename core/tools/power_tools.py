import os
import subprocess
from typing import Optional

class FileSystemTool:
    def __init__(self, base_path: str = "./workspace"):
        self.base_path = os.path.abspath(base_path)
        if not os.path.exists(self.base_path):
            os.makedirs(self.base_path)

    def _safe_path(self, path: str) -> str:
        full_path = os.path.abspath(os.path.join(self.base_path, path))
        if not full_path.startswith(self.base_path):
            raise PermissionError("Access denied: Path is outside workspace.")
        return full_path

    def write_file(self, path: str, content: str):
        safe_path = self._safe_path(path)
        os.makedirs(os.path.dirname(safe_path), exist_ok=True)
        with open(safe_path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"File written: {path}"

    def read_file(self, path: str) -> str:
        safe_path = self._safe_path(path)
        with open(safe_path, "r", encoding="utf-8") as f:
            return f.read()

class GitTool:
    def execute(self, command: list, cwd: str = "./workspace"):
        try:
            result = subprocess.run(
                ["git"] + command, 
                cwd=cwd, 
                capture_output=True, 
                text=True, 
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            return f"Git Error: {e.stderr}"
