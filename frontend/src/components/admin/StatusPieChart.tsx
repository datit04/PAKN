import React, { useState } from 'react';

export interface PieChartDatum {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface StatusPieChartProps {
  data: PieChartDatum[];
  size?: number;
  centerLabel?: string;
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data, size = 220, centerLabel = 'Tổng số hồ sơ' }) => {
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = size / 2;
  const strokeWidth = radius * 0.36;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const gap = total > 0 ? 2 : 0;

  let cumulative = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Biểu đồ tròn thống kê trạng thái hồ sơ">
        <g transform={`rotate(-90 ${radius} ${radius})`}>
          {total === 0 ? (
            <circle cx={radius} cy={radius} r={innerRadius} fill="none" stroke="#e1e0d9" strokeWidth={strokeWidth} />
          ) : (
            data.map(d => {
              const fraction = d.value / total;
              const segmentLength = Math.max(fraction * circumference - gap, 0);
              const dashArray = `${segmentLength} ${circumference - segmentLength}`;
              const dashOffset = -cumulative;
              cumulative += fraction * circumference;
              const isHovered = hoverKey === d.key;

              return (
                <circle
                  key={d.key}
                  cx={radius}
                  cy={radius}
                  r={innerRadius}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  onMouseEnter={() => setHoverKey(d.key)}
                  onMouseLeave={() => setHoverKey(null)}
                  style={{ transition: 'stroke-width 0.15s ease', cursor: 'pointer' }}
                >
                  <title>{`${d.label}: ${d.value.toLocaleString('vi-VN')} (${(fraction * 100).toFixed(1)}%)`}</title>
                </circle>
              );
            })
          )}
        </g>
        <text x={radius} y={radius - 6} textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: '#0b0b0b' }}>
          {total.toLocaleString('vi-VN')}
        </text>
        <text x={radius} y={radius + 16} textAnchor="middle" style={{ fontSize: 12, fill: '#898781' }}>
          {centerLabel}
        </text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 220 }}>
        {data.map(d => {
          const percent = total > 0 ? (d.value / total) * 100 : 0;
          return (
            <div
              key={d.key}
              onMouseEnter={() => setHoverKey(d.key)}
              onMouseLeave={() => setHoverKey(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '4px 8px',
                borderRadius: 6,
                background: hoverKey === d.key ? '#f5f5f4' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#334155' }}>{d.label}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0b0b0b', whiteSpace: 'nowrap' }}>
                {d.value.toLocaleString('vi-VN')} <span style={{ color: '#898781', fontWeight: 400 }}>({percent.toFixed(1)}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
