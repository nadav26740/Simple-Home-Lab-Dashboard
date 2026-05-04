import psutil
from typing import List
from app.schemes import processInfo
from fastapi import HTTPException


def get_all_processes() -> List[processInfo]:
    """Get all running processes with their resource usage"""
    processes = []
    try:
        for proc in psutil.process_iter(['pid', 'ppid', 'name', 'username', 'cpu_percent', 'memory_info']):
            try:
                # Get process info
                pid = proc.info['pid']
                ppid = proc.info['ppid'] or 0
                name = proc.info['name'] or 'unknown'
                user = proc.info['username'] or 'unknown'

                # Get CPU usage (need to call cpu_percent() twice for accurate reading)
                cpu_percent = proc.info['cpu_percent'] or 0.0

                # Get memory usage in bytes
                memory_info = proc.info['memory_info']
                memory_usage = memory_info.rss if memory_info else 0

                # Create process info object
                process = processInfo(
                    name=name,
                    cpu=cpu_percent,
                    memory=memory_usage,
                    pid=pid,
                    ppid=ppid,
                    user=user
                )
                processes.append(process)

            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                # Skip processes that are no longer available or inaccessible
                continue

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get processes: {str(e)}")

    return processes


def kill_process(pid: int) -> dict:
    """Kill a process by its PID"""
    try:
        # Check if process exists
        if not psutil.pid_exists(pid):
            raise HTTPException(status_code=404, detail=f"Process with PID {pid} not found")

        # Get the process
        proc = psutil.Process(pid)

        # Try to terminate gracefully first
        proc.terminate()

        # Wait a bit for the process to terminate
        try:
            proc.wait(timeout=3)  # Wait up to 3 seconds
            return {"message": f"Process {pid} terminated successfully"}
        except psutil.TimeoutExpired:
            # If it didn't terminate gracefully, force kill
            proc.kill()
            return {"message": f"Process {pid} force killed"}

    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Process with PID {pid} not found")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail=f"Access denied to kill process {pid}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to kill process {pid}: {str(e)}")


def get_process_by_pid(pid: int) -> processInfo:
    """Get information about a specific process by PID"""
    try:
        if not psutil.pid_exists(pid):
            raise HTTPException(status_code=404, detail=f"Process with PID {pid} not found")

        proc = psutil.Process(pid)

        # Get process info
        name = proc.name()
        ppid = proc.ppid() or 0
        user = proc.username()

        # Get CPU usage
        cpu_percent = proc.cpu_percent(interval=0.1)

        # Get memory usage
        memory_info = proc.memory_info()
        memory_usage = memory_info.rss

        return processInfo(
            name=name,
            cpu=cpu_percent,
            memory=memory_usage,
            pid=pid,
            ppid=ppid,
            user=user
        )

    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Process with PID {pid} not found")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail=f"Access denied to process {pid}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get process {pid}: {str(e)}")

