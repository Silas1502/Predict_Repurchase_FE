'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number; // 0 to 100 (percentage)
  size?: number;
}

export function GaugeChart({ value, size = 200 }: GaugeChartProps) {
  // Clamp value to 0-100 range
  const percentage = Math.max(0, Math.min(100, Math.round(value)));

  // Data for the gauge
  const data = [
    { name: 'filled', value: percentage },
    { name: 'empty', value: 100 - percentage },
  ];

  // Colors based on value
  const getColor = (val: number) => {
    if (val > 15) return '#22c55e'; // success-500 (High)
    if (val >= 8) return '#f59e0b'; // warning-500 (Medium)
    return '#ef4444'; // danger-500 (Low)
  };

  const COLORS = [getColor(percentage), '#e5e7eb']; // filled color, gray for empty

  return (
    <div className="relative" style={{ width: size, height: size * 0.6 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={size * 0.35}
            outerRadius={size * 0.5}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
        <span className="text-xs text-gray-500">Repurchase Probability</span>
      </div>

      {/* Scale labels */}
      <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-4 text-xs text-gray-400">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
