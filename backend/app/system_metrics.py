import psutil
from app.schemes import CPUInfo, RAMInfo, StorageInfo

def get_cpu_usage():
    """Returns current CPU usage percentage."""
    cpu_usage = psutil.cpu_percent(interval=1)
    cores_count = psutil.cpu_count(logical=True)
    return CPUInfo(usage=cpu_usage, cores=cores_count)


def get_ram_usage():
    """Returns RAM usage info including swap memory."""
    
    vir_mem = psutil.virtual_memory()
    swap_mem = psutil.swap_memory()
    return RAMInfo(
        usage=vir_mem.percent,
        usage_swap=swap_mem.percent,
        total=vir_mem.total,
        used=vir_mem.used,
        free=vir_mem.free,
        used_swap=swap_mem.used,
        free_swap=swap_mem.free
    )


def get_storage_usage():
    """Returns storage usage info for the root partition."""
    disk = psutil.disk_usage('/')
    return StorageInfo(usage=disk.percent, total=disk.total, used=disk.used, free=disk.free)