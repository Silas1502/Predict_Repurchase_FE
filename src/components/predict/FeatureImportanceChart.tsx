'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { TopReason, Transaction } from '@/types';

interface FeatureImportanceChartProps {
  reasons: TopReason[];
  transactions?: Transaction[];
  height?: number;
}

export function FeatureImportanceChart({ reasons, transactions, height = 220 }: FeatureImportanceChartProps) {
  // Debug log
  console.log('FeatureImportanceChart:', { 
    transactionsCount: transactions?.length,
    logItems: transactions?.map(t => t.log_items)
  });
  
  // Tính tổng log_items từ transactions nếu có
  const calculatedSumLogItems = transactions?.reduce((sum, t) => sum + (t.log_items || 0), 0);
  console.log('calculatedSumLogItems:', calculatedSumLogItems);
  
  // Sort by importance (highest first) and format data
  const data = [...reasons]
    .sort((a, b) => b.importance_percent - a.importance_percent)
    .slice(0, 5)
    .map((reason) => ({
      name: formatFeatureName(reason.feature),
      value: Math.max(0, Math.min(100, reason.importance_percent)),
      rawValue: reason.feature === 'sum_L5M_items_log' && calculatedSumLogItems !== undefined 
        ? calculatedSumLogItems 
        : reason.value,
      rawName: reason.feature,
      impact: reason.impact,
    }));

  if (data.length === 0) {
    return (
      <div className="w-full">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Top Yếu tố Ảnh hưởng đến Dự đoán
        </h4>
        <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">
          Không có dữ liệu
        </div>
      </div>
    );
  }

  const getBarColor = (index: number) => {
    if (index === 0) return '#22c55e';
    if (index === 1) return '#3b82f6';
    if (index === 2) return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Top Yếu tố Ảnh hưởng đến Dự đoán
      </h4>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 120, left: 20, bottom: 10 }}
        >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 13, fill: '#374151', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Ảnh hưởng']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                <LabelList
                  dataKey="value"
                  position="right"
                  content={(props: any) => {
                    const { x, y, width, value, index } = props;
                    const dataItem = data[index];
                    const rawValue = dataItem?.rawValue;
                    const impact = dataItem?.impact;
                    
                    // Icon và màu cho chiều hướng
                    const isPositive = impact === 'positive';
                    const isNegative = impact === 'negative';
                    const arrowIcon = isPositive ? '↑' : isNegative ? '↓' : '•';
                    const arrowColor = isPositive ? '#16a34a' : isNegative ? '#dc2626' : '#6b7280';
                    const arrowBg = isPositive ? '#dcfce7' : isNegative ? '#fee2e2' : '#f3f4f6';
                    
                    const label = rawValue !== undefined 
                      ? `${value.toFixed(0)}% (${rawValue})`
                      : `${value.toFixed(0)}%`;
                    
                    const baseX = (x || 0) + (width || 0) + 8;
                    const baseY = (y || 0) + 12;
                    
                    return (
                      <g>
                        {/* Label chính */}
                        <text x={baseX} y={baseY + 5} fill="#374151" fontSize={12} fontWeight={600}>
                          {label}
                        </text>
                        {/* Mũi tên trong circle */}
                        <circle 
                          cx={baseX + label.length * 6 + 12} 
                          cy={baseY + 2} 
                          r={9} 
                          fill={arrowBg}
                          stroke={arrowColor}
                          strokeWidth={1.5}
                        />
                        <text 
                          x={baseX + label.length * 6 + 12} 
                          y={baseY + 6} 
                          fill={arrowColor} 
                          fontSize={11} 
                          fontWeight={700}
                          textAnchor="middle"
                        >
                          {arrowIcon}
                        </text>
                      </g>
                    );
                  }}
                />
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
    </div>
  );
}

// Format feature name for display
function formatFeatureName(name: string): string {
  const nameMap: Record<string, string> = {
    'active_months_L5M': 'Tháng hoạt động',
    'cnt_L3M_orders': 'Số đơn 3 tháng',
    'sum_L1M_value': 'Chi tiêu 1 tháng',
    'cnt_L1M_orders': 'Số đơn 1 tháng',
    'sum_L3M_value': 'Chi tiêu 3 tháng',
    'avg_gap_L5M': 'Chu kỳ mua TB',
    'tenure_days': 'Thâm niên khách',
    'std_L1M_value': 'Độ lệch chi tiêu 1 tháng',
    'std_L3M_value': 'Độ lệch chi tiêu 3 tháng',
    'cancel_rate_L5M': 'Tỷ lệ hủy 5 tháng',
    'recency_days': 'Ngày từ lần cuối',
    'sum_L5M_items_log': 'Tổng log items 5 tháng',
    'avg_items_per_cat_L3M': 'TB items/category 3 tháng',
    'success_order_rate': 'Tỷ lệ đơn thành công',
    'avg_L5M_items_log': 'TB log items 5 tháng',
    'avg_items_per_cat_L5M': 'TB items/category 5 tháng',
    'avg_L5M_value': 'AOV 5 tháng',
    'sum_L3M_items_log': 'Tổng log items 3 tháng',
    'last_order_intensity': 'Cường độ đơn cuối',
    'avg_L3M_items_log': 'TB log items 3 tháng',
    'spend_velocity': 'Tốc độ chi tiêu',
    'avg_L3M_skus': 'TB SKU 3 tháng',
    'avg_L1M_value': 'AOV 1 tháng',
  };

  if (nameMap[name]) {
    return nameMap[name];
  }

  // Fallback: format generic names
  return name
    .replace(/_/g, ' ')
    .replace(/L1M/g, '1T')
    .replace(/L3M/g, '3T')
    .replace(/L5M/g, '5T')
    .replace(/avg/g, 'TB')
    .replace(/sum/g, 'Tổng')
    .replace(/cnt/g, 'Số')
    .replace(/std/g, 'Độ lệch')
    .replace(/cv/g, 'CV')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
