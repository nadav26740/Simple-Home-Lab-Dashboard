from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.system_metrics import get_cpu_usage, get_ram_usage, get_storage_usage

from app.services_manager import get_services, start_service, stop_service, restart_service, enable_service, disable_service, get_service_info
from app.processes_manager import get_all_processes, kill_process, get_process_by_pid

import app.schemes.services_info as services_schemes
import app.schemes.system_info as system_schemes
import app.schemes.process_info as process_schemes
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Load environment variables
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:8000")

print(f"Allowing CORS for: {frontend_url}")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/system/cpu")
def cpu_usage() -> system_schemes.CPUInfo:
    """Returns current CPU usage percentage."""
    return get_cpu_usage()

@app.get("/system/ram")
def ram_usage() -> system_schemes.RAMInfo:
    """Returns RAM usage info including swap memory."""
    return get_ram_usage()

@app.get("/system/storage")
def storage_usage() -> system_schemes.StorageInfo:
    """Returns storage usage info for the root partition."""
    return get_storage_usage()

@app.get("/services")
def services() -> list[services_schemes.ServiceInfo]:
    return get_services()

@app.get("/services/{name}")
def service_info(name: str) -> services_schemes.ServiceFullInfo:
    """Get detailed information about a specific service"""
    try:
        return get_service_info(name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get service info: {str(e)}")

@app.post("/services/{name}/start")
def start(name: str):
    return start_service(name)

@app.post("/services/{name}/stop")
def stop(name: str):
    return stop_service(name)

@app.post("/services/{name}/restart")
def restart(name: str):
    return restart_service(name)

@app.post("/services/{name}/enable")
def enable(name: str):
    return enable_service(name)

@app.post("/services/{name}/disable")
def disable(name: str):
    return disable_service(name)

@app.get("/processes")
def processes() -> list[process_schemes.processInfo]:
    """Get all running processes with their resource usage"""
    return get_all_processes()

@app.get("/processes/{pid}")
def process(pid: int) -> process_schemes.processInfo:
    """Get information about a specific process by PID"""
    return get_process_by_pid(pid)

@app.delete("/processes/{pid}")
def kill(pid: int):
    """Kill a process by its PID"""
    return kill_process(pid)