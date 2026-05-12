/**
 * Services API endpoints and methods
 */

import request from './client';

export interface ServiceUsage {
  cpu: number;
  memory: number;
}

export interface Service {
  name: string;
  status: string;
  usage: ServiceUsage;
  enabled: boolean;
}

export interface ServiceResponse {
  message: string;
}

export interface ServiceFullInfo {
  name: string;
  
  memory: string | number;
  cpu: string | number;
  main_pid: string | number;

  active: string | boolean;
  loaded: string | boolean;

  cgroup: string;
  last_logs: string[];
  enabled: boolean;
}

// 
export async function getServiceByName(serviceName: string): Promise<ServiceFullInfo> {
  return request<ServiceFullInfo>(`/services/${serviceName}`);
}

/**
 * Get list of all services
 */
export async function getServices(): Promise<Service[]> {
  return request<Service[]>('/services');
}

/**
 * Get a specific service details
 */
export async function getService(name: string): Promise<Service> {
  return request<Service>(`/services/${name}`);
}

/**
 * Start a service
 */
export async function startService(name: string): Promise<ServiceResponse> {
  return request<ServiceResponse>(`/services/${name}/start`, {
    method: 'POST',
  });
}

/**
 * Stop a service
 */
export async function stopService(name: string): Promise<ServiceResponse> {
  return request<ServiceResponse>(`/services/${name}/stop`, {
    method: 'POST',
  });
}

/**
 * Restart a service
 */
export async function restartService(name: string): Promise<ServiceResponse> {
  return request<ServiceResponse>(`/services/${name}/restart`, {
    method: 'POST',
  });
}

/**
 * Enable a service (auto-start on boot)
 */
export async function enableService(name: string): Promise<ServiceResponse> {
  return request<ServiceResponse>(`/services/${name}/enable`, {
    method: 'POST',
  });
}

/**
 * Disable a service (no auto-start on boot)
 */
export async function disableService(name: string): Promise<ServiceResponse> {
  return request<ServiceResponse>(`/services/${name}/disable`, {
    method: 'POST',
  });
}
