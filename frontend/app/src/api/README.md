# API Communication Library

A comprehensive, type-safe API client library for the System Dashboard frontend.

## Structure

- **`client.ts`** - Base HTTP client with request handling, timeouts, and error handling
- **`services.ts`** - Service management endpoints (get, start, stop, restart, enable, disable)
- **`system.ts`** - System metrics endpoints (CPU, memory, disk, uptime)
- **`hooks.ts`** - React hooks for simplified API usage with loading/error states
- **`index.ts`** - Central exports for all modules

## Usage

### Basic Fetch (Direct API calls)

```typescript
import { servicesApi, systemApi } from '@/api';

// Get all services
const services = await servicesApi.getServices();

// Get system metrics
const metrics = await systemApi.getSystemMetrics();

// Start a service
await servicesApi.startService('nginx');
```

### React Hooks (Recommended for components)

```typescript
import { useServices, useSystemMetrics, useRestartService } from '@/api/hooks';

function MyComponent() {
  // Auto-refreshes every 5 seconds
  const { data: services, loading, error } = useServices();
  
  // Auto-refreshes every 5 seconds
  const { data: metrics, loading: metricsLoading } = useSystemMetrics();
  
  // For service actions
  const { restart, loading: restarting, error: restartError } = useRestartService();
  
  const handleRestart = async () => {
    const success = await restart('nginx');
    if (success) console.log('Restarted!');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <h2>Services: {services?.length}</h2>
      <button onClick={handleRestart} disabled={restarting}>
        {restarting ? 'Restarting...' : 'Restart Nginx'}
      </button>
    </>
  );
}
```

## Configuration

Set the API base URL via environment variable:

```env
# .env
VITE_API_BASE_URL=http://localhost:8000
```

Default is `http://localhost:8000` if not specified.

## Error Handling

```typescript
import { ApiError, servicesApi } from '@/api';

try {
  await servicesApi.startService('nginx');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}:`, error.data);
  }
}
```

## API Endpoints

### Services
- `GET /services` - List all services
- `GET /services/:name` - Get service details
- `POST /services/:name/start` - Start service
- `POST /services/:name/stop` - Stop service
- `POST /services/:name/restart` - Restart service
- `POST /services/:name/enable` - Enable service
- `POST /services/:name/disable` - Disable service

### System
- `GET /system/metrics` - All metrics (CPU, memory, disk, uptime)
- `GET /system/cpu` - CPU metrics only
- `GET /system/memory` - Memory metrics only
- `GET /system/disk` - Disk metrics only

## Type Safety

All API functions are fully typed with TypeScript:

```typescript
import { Service, SystemMetrics, ServiceResponse } from '@/api';

const services: Service[] = await servicesApi.getServices();
const metrics: SystemMetrics = await systemApi.getSystemMetrics();
const response: ServiceResponse = await servicesApi.startService('nginx');
```

## Hook Reference

| Hook | Returns | Auto-refresh |
|------|---------|--------------|
| `useServices(interval?)` | `{ data: Service[], loading, error }` | Yes (5s default) |
| `useSystemMetrics(interval?)` | `{ data: SystemMetrics, loading, error }` | Yes (5s default) |
| `useStartService()` | `{ start, loading, error }` | - |
| `useStopService()` | `{ stop, loading, error }` | - |
| `useRestartService()` | `{ restart, loading, error }` | - |
| `useEnableService()` | `{ enable, loading, error }` | - |
| `useDisableService()` | `{ disable, loading, error }` | - |
