/**
 * System metrics API endpoints
 */

import request from './client';

export interface CpuMetrics {
  usage: number;
  cores: number;
}

export interface MemoryMetrics {
  usage: number;
  usage_swap: number;
  total: number;
  used: number;
  free: number;
  used_swap: number;
  free_swap: number;
}

export interface DiskMetrics {
  total: number;
  used: number;
  free: number;
  percent: number;
}

export interface SystemMetrics {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics;
  uptime: number;
}

/**
 * Get current system metrics
 */
export async function getSystemMetrics(): Promise<SystemMetrics> {
  return request<SystemMetrics>('/system/metrics');
}

/**
 * Get CPU metrics
 */
export async function getCpuMetrics(): Promise<CpuMetrics> {
  return request<CpuMetrics>('/system/cpu');
}

/**
 * Get memory metrics
 */
export async function getMemoryMetrics(): Promise<MemoryMetrics> {
  return request<MemoryMetrics>('/system/ram');
}

/**
 * Get disk metrics
 */
export async function getDiskMetrics(): Promise<DiskMetrics> {
  return request<DiskMetrics>('/system/disk');
}
