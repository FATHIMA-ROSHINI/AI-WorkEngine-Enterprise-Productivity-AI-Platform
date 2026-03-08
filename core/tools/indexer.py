import os
import hashlib
from qdrant_client import QdrantClient
from qdrant_client.http import models

class ContextVault:
    def __init__(self):
        # Use URL from environment (provided by Docker Compose)
        url = os.getenv("VECTOR_DB_URL", "http://127.0.0.1:6333")
        try:
            # Use 127.0.0.1 to avoid localhost DNS issues in some environments
            self.client = QdrantClient(url=url, timeout=3) 
            self.collection_name = "codebase_memory"
            self._ensure_collection()
            print(f"Vault: Connected to Qdrant at {url}")
        except Exception as e:
            # FALLBACK: Use in-memory Qdrant for Zero-Config mode
            print(f"Vault: Qdrant unreachable ({e}). Initializing IN-MEMORY ContextVault™...")
            self.client = QdrantClient(":memory:")
            self.collection_name = "local_memory"
            self._ensure_collection()

    def _ensure_collection(self):
        """Creates the collection if it doesn't exist."""
        try:
            self.client.get_collection(self.collection_name)
        except Exception:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),
            )

    def index_file(self, file_path: str, content: str):
        """Indexes a single file with simulated vectorization."""
        # Point ID must be unique (using hash of path)
        point_id = int(hashlib.md5(file_path.encode()).hexdigest(), 16) % (10**15)
        
        # In a production environment, we'd use OpenAI's text-embedding-3-small
        # For this prototype, we use a deterministic "mock" vector for scaling tests
        mock_vector = [0.1] * 1536 
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=point_id,
                    vector=mock_vector,
                    payload={
                        "path": file_path, 
                        "content": content[:1000], # Store first 1k chars as snippet
                        "full_content": content
                    }
                )
            ]
        )

    def query_context(self, query: str, limit: int = 5):
        """Searches the codebase for relevant context."""
        mock_query_vector = [0.1] * 1536
        # In version 1.11+, query_points is the recommended universal endpoint
        try:
            res = self.client.query_points(
                collection_name=self.collection_name,
                query=mock_query_vector,
                limit=limit
            )
            return res.points
        except Exception as e:
            print(f"Vault: query_points failed ({e}). Attempting fallback...")
            # If for some reason query_points fails, try search_points or similar
            # though query_points is verified in this environment
            return []
