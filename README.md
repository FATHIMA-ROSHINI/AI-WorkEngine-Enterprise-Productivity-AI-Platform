# NOVA :: AI WorkEngine v4

**High-Scale Agentic Mesh Orchestrator**

NOVA is an enterprise-grade agentic mesh platform designed to orchestrate the entire Software Development Life Cycle (SDLC) through a high-performance, decentralized network of autonomous agents.

![NOVA UI](https://img.shields.io/badge/Aesthetic-Bold_Brutalist-FFEDD5?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_16_Turbopack-000000?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-6366F1?style=for-the-badge)

---

## ⚡ Performance Architecture

Built for **10+ concurrent agents** running simultaneously without UI degradation.

- **Atomic State Mesh:** Powered by **Zustand**, ensuring high-frequency telemetry (60+ updates/sec) only re-renders specific HUD elements.
- **GPU-Accelerated Visuals:** Real-time interactive "Agent Brain" point cloud rendered via **Three.js** and React-Three-Fiber.
- **Virtualized Telemetry:** Infinite log streaming using **React-Virtuoso** to handle 10,000+ lines with zero memory pressure.
- **Non-Blocking Orchestrator:** FastAPI backend utilizing an asynchronous task pool for true parallel agent execution.

## 🎨 UI/UX: "Bold Brutalist" Aesthetic

NOVA features a cutting-edge interface that blends **Neo-Modern Brutalism** with **Glassmorphism**.

- **Geometric Depth:** Thich `4px` borders and hard shadows create a physical "App Model" feel.
- **Playful Minimalism:** A curated pastel palette (`Lavender`, `Mint`, `Peach`, `Rose`) used for background geometric blobs and status indicators.
- **Interactive HUD:** Glassmorphic panels with `24px` backdrop blurs and animated scanner lines.
- **Zero Overlap Logic:** Flexbox-flow layout ensures that terminal expansions and HUD elements never collide.

## 🧠 The Agentic Mesh

NOVA's core is a **Decentralized State Machine** powered by LangGraph:

1.  **Architect Agent:** Performs a real-time workspace scan of your physical files to generate context-aware technical designs.
2.  **Reviewer Agent:** Tactical auditor that enforces protocol adherence and security guardrails.
3.  **Coder Agent:** Synthesizes high-fidelity Python/FastAPI microservices based on specific user requirements.
4.  **Security Agent:** Executes **Deep Structural Scans (DSS)** to detect RCE, SQLi, and secret leakage in real-time.
5.  **Quality Agent:** Generates automated verification reports and synthesis accuracy benchmarks.
6.  **Infra Agent:** Provisions tactical IaC (Terraform/Kubernetes) manifests based on the mesh synthesis.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Installation & Launch
The entire mesh can be brought online with a single command:

```bash
# Install all dependencies and start the Mesh Orchestrator + Dashboard
python start.py
```

### Manual Backend Setup
```bash
pip install -r requirements.txt
python core/main.py
```

### Manual Frontend Setup
```bash
cd dashboard
npm install
npm run dev
```

---

## 🛠️ Tech Stack
- **Backend:** FastAPI, LangGraph, Qdrant, SQLAlchemy, Pydantic v2.
- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Zustand, Framer Motion, Three.js.
- **Infrastructure:** Kubernetes, Docker, Terraform.

---
© 2026 AI WORKENGINE — NEXT-GEN MESH ORCHESTRATION
