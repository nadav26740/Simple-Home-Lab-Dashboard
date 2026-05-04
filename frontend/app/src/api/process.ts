/**
 * Process management API endpoints
 */

import request from './client';

export interface ProcessInfo {
  name: string;
  cpu: number;
  memory: number;
  pid: number;
  ppid: number;
  user: string;
}

export interface ProcessResponse {
  message: string;
}

/**
 * Get all running processes with their resource usage
 */
export async function getProcesses(): Promise<ProcessInfo[]> {
  return request<ProcessInfo[]>('/processes');
}

/**
 * Get information about a specific process by PID
 */
export async function getProcess(pid: number): Promise<ProcessInfo> {
  return request<ProcessInfo>(`/processes/${pid}`);
}

/**
 * Kill a process by its PID
 */
export async function killProcess(pid: number): Promise<ProcessResponse> {
  return request<ProcessResponse>(`/processes/${pid}`, {
    method: 'DELETE',
  });
}
