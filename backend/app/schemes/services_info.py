from pydantic import BaseModel, Field

class ServiceUsageInfo(BaseModel):
    cpu: float = Field(..., description="CPU usage percentage by the service", example=2.5)
    memory: float = Field(..., description="Memory usage in bytes by the service", example=15000000)

class ServiceInfo(BaseModel):
    name: str = Field(..., description="Name of the service", example="nginx")
    status: str = Field(..., description="Current status of the service", example="running")
    usage: ServiceUsageInfo = Field(..., description="Resource usage of the service", example=ServiceUsageInfo(cpu=2.5, memory=15000000))
    enabled: bool = Field(..., description="Whether the service is enabled to start at boot", example=True)

