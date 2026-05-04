from pydantic import BaseModel, Field

class processInfo(BaseModel):
    name: str = Field(..., description="Name of the process", example="nginx")
    cpu: float = Field(..., description="CPU usage percentage by the process", example=2.5)
    memory: float = Field(..., description="Memory usage in bytes by the process", example=15000000)
    pid: int = Field(..., description="Process ID", example=1234)
    ppid: int = Field(..., description="Parent Process ID", example=1)
    user: str = Field(..., description="User who owns the process", example="www-data")