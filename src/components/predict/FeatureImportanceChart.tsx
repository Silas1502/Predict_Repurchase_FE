'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { TopReason } from '@/types';

interface FeatureImportanceChartProps {
  reasons: TopReason[];
  height?: number;
}

export function FeatureImportanceChart({ reasons, height = 220 }: FeatureImportanceChartProps) {
  // Sort by importance (highest first) and format data
  const data = [...reasons]
    .sort((a, b) => b.importance_percent - a.importance_percent)
    .slice(0, 5)
    .map((reason) => ({
      name: formatFeatureName(reason.feature),
      value: Math.max(0, Math.min(100, reason.importance_percent)),
      rawName: reason.feature,
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
          margin={{ top: 10, right: 60, left: 20, bottom: 10 }}
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
                  formatter={(value: number) => `${value.toFixed(0)}%`}
                  style={{ fontSize: 13, fill: '#374151', fontWeight: 600 }}
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
    'recency_days': 'Ngày từ lần cuối',
    'tenure_days': 'Thâm niên khách',
    'cnt_L1M_orders': 'Số đơn 1 tháng',
    'cnt_L3M_orders': 'Số đơn 3 tháng',
    'cnt_L5M_orders': 'Số đơn 5 tháng',
    'sum_L1M_value': 'Chi tiêu 1 tháng',
    'sum_L3M_value': 'Chi tiêu 3 tháng',
    'sum_L5M_value': 'Chi tiêu 5 tháng',
    'avg_L1M_value': 'AOV 1 tháng',
    'avg_L3M_value': 'AOV 3 tháng',
    'avg_L5M_value': 'AOV 5 tháng',
    'active_months_L5M': 'Tháng hoạt động',
    'cancel_rate_L1M': 'Tỷ lệ hủy 1 tháng',
    'cancel_rate_L3M': 'Tỷ lệ hủy 3 tháng',
    'spend_velocity': 'Tốc độ chi tiêu',
    'order_acceleration': 'Gia tốc đặt đơn',
    'recency_loyalty_score': 'Điểm gắn bó',
    'is_UK': 'Khách UK',
    'success_order_rate': 'Tỷ lệ đơn thành công',
    'global_cancel_val_ratio': 'Tỷ lệ hủy toàn phần',
    'last_order_canceled': 'Đơn cuối bị hủy',
    'avg_gap_L5M': 'Chu kỳ mua TB',
    'cv_L5M_value': 'Độ biến động chi tiêu',
    'last_order_intensity': 'Cường độ đơn cuối',
    'avg_items_per_cat_L5M': 'Độ đa dạng mua',
    'order_velocity': 'Tần suất mua/Tuổi',
    'std_L5M_value': 'Độ lệch chi tiêu',
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
