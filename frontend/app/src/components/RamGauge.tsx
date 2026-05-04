import './RamGauge.css';
import { useRAMMetrics } from '@/api/hooks';


export default function RamGauge() {
  const { data, loading, error } = useRAMMetrics(5000);
  const percent = data?.usage ?? 0;
  const used = data?.used ? Math.round(data.used / 1024 / 1024 / 1024) : 0; // Convert to GB
  const total = data?.total ? Math.round(data.total / 1024 / 1024 / 1024) : 0; // Convert to GB
  const usedSwap = data?.used_swap ? Math.round(data.used_swap / 1024 / 1024 / 1024) : 0;
  const freeSwap = data?.free_swap ? Math.round(data.free_swap / 1024 / 1024 / 1024) : 0;
  
  console.log('RAM Metrics:', { percent, used, total, usedSwap, freeSwap });
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="ram-gauge-card">
      <div className="ram-gauge-header">
        <div>
          <span className="ram-gauge-title">RAM Usage</span>
          <span className="ram-gauge-subtitle">Memory performance meter</span>
        </div>
        <span className="ram-gauge-chip">{loading ? 'Updating…' : `${total}GB`}</span>
      </div>

      <div className="ram-gauge-body">
        <svg className="ram-gauge-svg" viewBox="0 0 200 140" aria-hidden="true">
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
          <text x="100" y="118" className="gauge-label">RAM Load</text>
        </svg>
        <div className="ram-gauge-info">
          <div className="ram-gauge-info-item">
            <span>Used</span>
            <strong>{used}GB / {total}GB</strong>
          </div>
          <div className="ram-gauge-info-item">
            <span>Usage</span>
            <strong>{Math.round(percent)}%</strong>
          </div>
          <div className="ram-gauge-info-item">
            <span>Swap</span>
                <strong>{usedSwap}GB / {freeSwap + usedSwap}GB</strong>

          </div>
        </div>
      </div>

      {error && <div className="ram-gauge-error">{error.message}</div>}
    </div>
  );
}
