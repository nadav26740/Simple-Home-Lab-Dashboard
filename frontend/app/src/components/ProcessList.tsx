import { useState, useMemo } from 'react';
import './ProcessList.css';
import { useProcesses, useKillProcess } from '@/api/hooks';

type SortField = 'name' | 'pid' | 'cpu' | 'memory' | 'user';
type SortOrder = 'asc' | 'desc';

export default function ProcessList() {
  const { data: processes, loading, error } = useProcesses(10000);
  const { kill, loading: killing, error: killError } = useKillProcess();
  const [sortField, setSortField] = useState<SortField>('cpu');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedProcesses = useMemo(() => {
    if (!processes) return [];

    const sorted = [...processes].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [processes, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ' ⇅';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const formatMemory = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleKill = async (pid: number, name: string) => {
    if (window.confirm(`Are you sure you want to kill process "${name}" (PID: ${pid})?`)) {
      await kill(pid);
    }
  };

  if (loading && !processes) return <div className="process-list-loading">Loading processes...</div>;
  if (error) return <div className="process-list-error">Error: {error.message}</div>;

  return (
    <div className="process-list">
      <h2>System Processes ({sortedProcesses.length})</h2>
      <div className="process-table-container">
        <table className="process-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Process Name{getSortIndicator('name')}
              </th>
              <th onClick={() => handleSort('pid')} className="sortable">
                PID{getSortIndicator('pid')}
              </th>
              <th onClick={() => handleSort('cpu')} className="sortable">
                CPU{getSortIndicator('cpu')}
              </th>
              <th onClick={() => handleSort('memory')} className="sortable">
                Memory{getSortIndicator('memory')}
              </th>
              <th onClick={() => handleSort('user')} className="sortable">
                User{getSortIndicator('user')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.map((process) => (
              <tr key={process.pid} className="process-row">
                <td className="process-name">{process.name}</td>
                <td className="process-pid">{process.pid}</td>
                <td className="process-cpu">{process.cpu.toFixed(1)}%</td>
                <td className="process-memory">{formatMemory(process.memory)}</td>
                <td className="process-user">{process.user}</td>
                <td className="process-actions">
                  <button
                    className="kill-btn"
                    onClick={() => handleKill(process.pid, process.name)}
                    disabled={killing}
                    title={`Kill process ${process.name} (PID: ${process.pid})`}
                  >
                    Kill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedProcesses.length > 50 && (
        <div className="pagination-info">
          Showing top 50 processes by {sortField} ({sortOrder === 'desc' ? 'highest' : 'lowest'} first)
        </div>
      )}
      {killError && <div className="process-list-error">Kill error: {killError.message}</div>}
    </div>
  );
}
