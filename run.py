"""
Cocoa Bliss — Unified Development Server Runner
Runs both the Django backend and Vite frontend concurrently in a single terminal.
Features:
- Color-coded log prefixes for [BACKEND] and [FRONTEND]
- Complete process-tree cleanup on Windows when exiting (Ctrl+C)
- Cross-platform support
"""

import os
import sys
import shutil
import signal
import subprocess
import threading
import time

# Ensure UTF-8 output
if sys.platform == "win32":
    # Enable ANSI escape sequences on Windows
    os.system("")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

# ANSI color codes
COLOR_BACKEND = "\033[96m"   # Cyan
COLOR_FRONTEND = "\033[95m"  # Magenta
COLOR_INFO = "\033[93m"      # Yellow
COLOR_SUCCESS = "\033[92m"   # Green
COLOR_RESET = "\033[0m"
COLOR_BOLD = "\033[1m"

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

# Locate Python in backend virtualenv, fallback to current python
venv_python = os.path.join(ROOT_DIR, "backend_env", "Scripts", "python.exe")
if not os.path.exists(venv_python):
    venv_python = os.path.join(ROOT_DIR, "backend_env", "bin", "python")
if not os.path.exists(venv_python):
    venv_python = sys.executable

# Locate npm
npm_cmd = shutil.which("npm.cmd") or shutil.which("npm") or "npm"

processes = []

def kill_process_tree(proc):
    """Cleanly terminates a process and all its child subprocesses on Windows/Unix."""
    if proc is None or proc.poll() is not None:
        return
    try:
        if sys.platform == "win32":
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False
            )
        else:
            proc.terminate()
            try:
                proc.wait(timeout=3)
            except subprocess.TimeoutExpired:
                proc.kill()
    except Exception:
        pass

def cleanup():
    """Terminate all running child processes."""
    print(f"\n{COLOR_INFO}[RUNNER] Shutting down Cocoa Bliss servers...{COLOR_RESET}")
    for p in processes:
        kill_process_tree(p)
    print(f"{COLOR_SUCCESS}[RUNNER] Servers stopped cleanly.{COLOR_RESET}\n")

def stream_output(pipe, prefix, color):
    """Streams lines from process stdout/stderr with color-coded prefix."""
    try:
        for line in iter(pipe.readline, ""):
            if not line:
                break
            stripped = line.rstrip()
            if stripped:
                print(f"{color}{COLOR_BOLD}[{prefix}]{COLOR_RESET} {stripped}", flush=True)
    except Exception:
        pass
    finally:
        pipe.close()

def main():
    print("=" * 64)
    print(f"{COLOR_BOLD}🍫  COCOA BLISS — Unified Development Server{COLOR_RESET}")
    print("=" * 64)
    print(f" • Backend:  {COLOR_BACKEND}http://127.0.0.1:8000/{COLOR_RESET} (Django REST Framework)")
    print(f" • Frontend: {COLOR_FRONTEND}http://localhost:5173/{COLOR_RESET} (React 19 + Vite)")
    print(f" • Mode:     {COLOR_INFO}Single-terminal unified runner{COLOR_RESET}")
    print(f" • Stop:     Press {COLOR_BOLD}Ctrl+C{COLOR_RESET} to shut down both servers")
    print("=" * 64)
    print()

    # 1. Start Django Backend
    backend_cmd = [venv_python, "manage.py", "runserver", "127.0.0.1:8000"]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BACKEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        encoding="utf-8",
        errors="replace"
    )
    processes.append(backend_proc)

    # 2. Start Vite Frontend
    frontend_cmd = [npm_cmd, "run", "dev"]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        encoding="utf-8",
        errors="replace"
    )
    processes.append(frontend_proc)

    # Start reader threads
    t_backend = threading.Thread(
        target=stream_output,
        args=(backend_proc.stdout, "BACKEND ", COLOR_BACKEND),
        daemon=True
    )
    t_frontend = threading.Thread(
        target=stream_output,
        args=(frontend_proc.stdout, "FRONTEND", COLOR_FRONTEND),
        daemon=True
    )

    t_backend.start()
    t_frontend.start()

    def signal_handler(signum, frame):
        cleanup()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, signal_handler)

    try:
        while True:
            # Check if any process exited prematurely
            if backend_proc.poll() is not None:
                print(f"{COLOR_INFO}[RUNNER] Backend process stopped with code {backend_proc.poll()}{COLOR_RESET}")
                break
            if frontend_proc.poll() is not None:
                print(f"{COLOR_INFO}[RUNNER] Frontend process stopped with code {frontend_proc.poll()}{COLOR_RESET}")
                break
            time.sleep(0.5)
    except KeyboardInterrupt:
        pass
    finally:
        cleanup()

if __name__ == "__main__":
    main()
