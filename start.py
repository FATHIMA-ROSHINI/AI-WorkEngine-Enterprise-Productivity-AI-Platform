import subprocess
import os
import sys
import time

def start_backend():
    print("Starting Backend Orchestrator (Port 8000)...")
    env = os.environ.copy()
    # Ensure the root directory is in the PYTHONPATH
    root_dir = os.path.dirname(os.path.abspath(__file__))
    env["PYTHONPATH"] = root_dir
    
    return subprocess.Popen(
        [sys.executable, "core/main.py"],
        cwd=root_dir,
        env=env
    )

def start_frontend():
    print("Starting Dashboard Command Center (Port 3000)...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    root_dir = os.path.dirname(os.path.abspath(__file__))
    dashboard_dir = os.path.join(root_dir, "dashboard")
    
    # Check if node_modules exists
    if not os.path.exists(os.path.join(dashboard_dir, "node_modules")):
        print("📦 node_modules not found. Installing dependencies...")
        subprocess.run([npm_cmd, "install"], cwd=dashboard_dir, shell=True)

    return subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=dashboard_dir,
        shell=True
    )

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root_dir)
    
    backend = None
    frontend = None
    try:
        backend = start_backend()
        time.sleep(3) # Give backend time to start
        frontend = start_frontend()
        
        print("\n" + "="*50)
        print("AI WorkEngine is coming online!")
        print(f"Dashboard: http://localhost:3000")
        print(f"API:       http://localhost:8000")
        print("="*50)
        print("\nPress Ctrl+C to shut down all agents.")
        
        while True:
            time.sleep(1)
            if backend.poll() is not None:
                print("Backend crashed or stopped.")
                break
            if frontend.poll() is not None:
                print("Frontend stopped.")
                break
                
    except KeyboardInterrupt:
        print("\nShutting down agents...")
    finally:
        if backend:
            backend.terminate()
        if frontend:
            if os.name == "nt":
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(frontend.pid)], shell=True)
            else:
                frontend.terminate()
        print("System offline.")

if __name__ == "__main__":
    main()
