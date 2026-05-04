import './CpuGauge.css';
import { useCPUMetrics, useSystemMetrics } from '@/api/hooks';

export default function CpuGauge() {
  const { data, loading, error } = useCPUMetrics(5000);
  const percent = data?.usage ?? -1;
  const cores = data?.cores ?? 0;
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="cpu-gauge-card">
      <div className="cpu-gauge-header">
        <div>
          <span className="cpu-gauge-title">CPU Usage</span>
          <span className="cpu-gauge-subtitle">Live performance meter</span>
        </div>
        <span className="cpu-gauge-chip">{loading ? 'Updating…' : `${cores} cores`}</span>
      </div>

      <div className="cpu-gauge-body">
        <svg className="cpu-gauge-svg" viewBox="0 0 200 140" aria-hidden="true">
          <circle
            className="gauge-bg"
            cx="100"
            cy="100"
            r="72"
          />
          <circle
            className="gauge-fill"
            cx="100"
            cy="100"
            r="72"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
          <text x="100" y="96" className="gauge-value">{Math.round(percent)}%</text>
          <text x="100" y="118" className="gauge-label">CPU Load</text>
        </svg>
        <div className="cpu-gauge-info">
          <div className="cpu-gauge-info-item">
            <span>Usage</span>
            <strong>{Math.round(percent)}%</strong>
          </div>
          <div className="cpu-gauge-info-item">
            <span>Cores</span>
            <strong>{cores}</strong>
          </div>
          <div className="cpu-gauge-info-item">
            <span>Status</span>
            <strong>{error ? 'Error' : 'Normal'}</strong>
          </div>
        </div>
      </div>

      {error && <div className="cpu-gauge-error">{error.message}</div>}
    </div>
  );
}
