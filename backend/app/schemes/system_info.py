from pydantic import BaseModel, Field

class CPUInfo(BaseModel):
    usage: float = Field(..., description="CPU usage percentage", example=55.5)
    cores: int = Field(..., description="Number of CPU cores", example=8)

class RAMInfo(BaseModel):
    usage: float = Field(..., description="RAM usage percentage", example=65.5)
    usage_swap: float = Field(..., description="Swap memory usage percentage", example=50.0)
    total: int = Field(..., description="Total RAM in bytes", example=8000000000)
    used: int = Field(..., description="Used RAM in bytes", example=3000000000)
    free: int = Field(..., description="Free RAM in bytes", example=2000000000)
    used_swap: int = Field(..., description="Used swap memory in bytes", example=3000000000)
    free_swap: int = Field(..., description="Free swap memory in bytes", example=2000000000)

class StorageInfo(BaseModel):
    usage: float = Field(..., description="Storage usage percentage", example=75.5)
    total: int = Field(..., description="Total storage in bytes", expmple=500000000000)
    used: int = Field(..., description="Used storage in bytes", example=375000000000)
    free: int = Field(..., description="Free storage in bytes", example=125000000000)