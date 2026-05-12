import subprocess
import psutil
from typing import List, Dict
from fastapi import HTTPException
from app.schemes import ServiceInfo, ServiceUsageInfo, ServiceFullInfo

def run_cmd(cmd: list) -> str:
    return subprocess.check_output(cmd, text=True).strip()

def _build_process_map() -> Dict[str, ServiceUsageInfo]:
    """Build a map of service names to their usage info in a single pass"""

    process_map: Dict[str, ServiceUsageInfo] = {}
    try:
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                name = proc.info['name'].lower()
                process_map[name] = ServiceUsageInfo(
                    cpu=proc.info['cpu_percent'] or -1,
                    memory=proc.info['memory_percent'] or -1
                )
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
                # print(f"Error processing PID {proc.info['pid']}: {e}")
    except Exception:
        pass
    return process_map


def _get_service_status_dict() -> Dict[str, str]:
    """Fetch service active states from systemctl list-units"""
    result = subprocess.run(
        ["systemctl", "list-units", "--type=service", "--no-pager", "--no-legend", "--all"],
        capture_output=True,
        text=True,
        timeout=5
    )
    
    service_dict = {}
    for line in result.stdout.splitlines():
        parts = line.split()
        if len(parts) >= 3:
            name = parts[0].replace(".service", "")
            active_state = parts[2]  # ACTIVE column
            service_dict[name] = active_state
    
    return service_dict


def _get_service_enabled_dict() -> Dict[str, bool]:
    """Fetch service enabled states from systemctl list-unit-files"""
    result = subprocess.run(
        ["systemctl", "list-unit-files", "--type=service", "--no-pager"],
        capture_output=True,
        text=True,
        timeout=5
    )
    
    enabled_dict = {}
    for line in result.stdout.splitlines():
        parts = line.split()
        if len(parts) >= 2:
            name = parts[0].replace(".service", "")
            enabled_state = parts[1]
            enabled_dict[name] = enabled_state == "enabled"
    
    return enabled_dict


def _combine_service_data(
    service_dict: Dict[str, str],
    enabled_dict: Dict[str, bool],
    process_map: Dict[str, ServiceUsageInfo]
) -> list[ServiceInfo]:
    """Combine status, enabled state, and process info into ServiceInfo objects"""
    result_list: list[ServiceInfo] = []
    
    for name, status in service_dict.items():
        enabled = enabled_dict.get(name, False)
        usage = process_map.get(name.lower(), ServiceUsageInfo(cpu=0, memory=0))
        
        result_list.append(ServiceInfo(
            name=name,
            status=status,
            usage=usage,
            enabled=enabled
        ))
    
    return result_list


def get_services() -> list[ServiceInfo]:
    """Get all services with their status, enabled state, and resource usage"""
    try:
        service_dict = _get_service_status_dict()
        enabled_dict = _get_service_enabled_dict()
        process_map = _build_process_map()
        
        return _combine_service_data(service_dict, enabled_dict, process_map)

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="systemctl command timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get services: {str(e)}")

def start_service(name: str):
    try:
        subprocess.run(['sudo', 'systemctl', 'start', name], check=True)
        return {"message": f"Started {name}"}
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail=f"Failed to start {name}")

def stop_service(name: str):
    try:
        subprocess.run(['sudo', 'systemctl', 'stop', name], check=True)
        return {"message": f"Stopped {name}"}
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail=f"Failed to stop {name}")

def restart_service(name: str):
    try:
        subprocess.run(['sudo', 'systemctl', 'restart', name], check=True)
        return {"message": f"Restarted {name}"}
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail=f"Failed to restart {name}")

def enable_service(name: str):
    try:
        subprocess.run(['sudo', 'systemctl', 'enable', name], check=True)
        return {"message": f"Enabled {name}"}
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail=f"Failed to enable {name}")

def disable_service(name: str):
    try:
        subprocess.run(['sudo', 'systemctl', 'disable', name], check=True)
        return {"message": f"Disabled {name}"}
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail=f"Failed to disable {name}")
    

def get_last_logs(service_name: str, lines: int = 20) -> List[str]:
    try:
        output = run_cmd([
            "journalctl",
            "-u", service_name,
            "-n", str(lines),
            "--no-pager"
        ])
        return output.splitlines()
    except Exception:
        return []


def parse_systemctl_show(output: str) -> dict:
    data = {}
    for line in output.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            data[k] = v
    return data


def get_service_info(service_name: str) -> ServiceInfo:
    try:
        cmd_output = run_cmd(["systemctl", "show", service_name])
    
    except Exception:
        return {}
    
    data = parse_systemctl_show(cmd_output)

    return ServiceFullInfo(
        name=service_name,

        memory=data.get("MemoryCurrent"),
        cpu=data.get("CPUUsageNSec"),
        main_pid=data.get("MainPID"),

        active=data.get("ActiveState"),
        loaded=data.get("LoadState"),

        cgroup=data.get("ControlPID"),

        last_logs=get_last_logs(service_name, lines=10)
    )