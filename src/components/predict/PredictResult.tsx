'use client';

import { PredictResponse } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GaugeChart } from './GaugeChart';
import { CheckCircle2, XCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface PredictResultProps {
  result: PredictResponse | null;
  isLoading?: boolean;
}

export function PredictResult({ result, isLoading }: PredictResultProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Kết Quả Dự Đoán</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-500">Đang phân tích dữ liệu khách hàng...</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Kết Quả Dự Đoán</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">
            Gửi biểu mẫu để xem kết quả dự đoán mua lại
          </p>
        </CardContent>
      </Card>
    );
  }

  const { probability, probability_percent, is_repurchase, potential_level, top_reasons, prediction_id, created_at } = result;
  const displayProbability = probability_percent ?? probability * 100;

  // Get badge variant based on potential level
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'High':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Format feature name for display
  const formatFeatureName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Prediction Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gauge Chart */}
        <div className="flex justify-center">
          <GaugeChart value={displayProbability} size={220} />
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            {is_repurchase ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-success-500" />
                <span className="font-medium text-success-700">Có khả năng Mua lại</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-danger-500" />
                <span className="font-medium text-danger-700">Không có khả năng Mua lại</span>
              </>
            )}
          </div>
        </div>

        {/* Potential Level Badge */}
        <div className="flex justify-center">
          <Badge variant={getBadgeVariant(potential_level)} size="md">
            <TrendingUp className="w-4 h-4 mr-1" />
            Tiềm năng {potential_level === 'High' ? 'Cao' : potential_level === 'Medium' ? 'Trung bình' : 'Thấp'}
          </Badge>
        </div>

        {/* Top Reasons */}
        {top_reasons && top_reasons.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Top 3 Yếu tố Ảnh hưởng đến Dự đoán này
            </h4>
            <div className="space-y-3">
              {top_reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatFeatureName(reason.feature)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Giá trị: {reason.value}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-primary-600">
                      {reason.importance_percent.toFixed(1)}%
                    </span>
                    <p className="text-xs text-gray-400">ảnh hưởng</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prediction ID */}
        <div className="border-t pt-4 text-center">
          <p className="text-xs text-gray-400">
            Mã Dự đoán: <span className="font-mono">{prediction_id || 'N/A'}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Tạo lúc: {created_at ? new Date(created_at).toLocaleString('vi-VN') : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
