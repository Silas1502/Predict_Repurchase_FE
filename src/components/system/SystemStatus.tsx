'use client';

import { useEffect, useState } from 'react';
import { checkHealth } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader2, CheckCircle2, XCircle, Database, Brain, Server } from 'lucide-react';

interface SystemStatusProps {
  showDetails?: boolean;
  resetKey?: number;
}

export function SystemStatus({ showDetails = true, resetKey }: SystemStatusProps) {
  const [status, setStatus] = useState<{
    loading: boolean;
    healthy: boolean;
    modelLoaded: boolean;
    preprocessorLoaded: boolean;
    databaseConnected: boolean;
    modelVersion?: string;
    threshold?: number;
    error?: string;
  }>({
    loading: true,
    healthy: false,
    modelLoaded: false,
    preprocessorLoaded: false,
    databaseConnected: false,
  });

  const checkSystemHealth = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: undefined }));

    try {
      // Backend trả về HealthCheckResponse trực tiếp, không wrap trong { success, data }
      const data = await checkHealth();

      setStatus({
        loading: false,
        healthy: data.status === 'healthy',
        modelLoaded: data.model_loaded,
        preprocessorLoaded: data.preprocessor_loaded,
        databaseConnected: data.database_connected,
        modelVersion: data.model_version,
        threshold: data.threshold,
      });
    } catch (err) {
      setStatus({
        loading: false,
        healthy: false,
        modelLoaded: false,
        preprocessorLoaded: false,
        databaseConnected: false,
        error: err instanceof Error ? err.message : 'Không thể kết nối backend',
      });
    }
  };

  useEffect(() => {
    checkSystemHealth();
    // Check every 30 seconds
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  if (status.loading) {
    return (
      <Card className="min-h-[280px]">
        <CardContent className="p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
          <span className="text-gray-600">Đang kiểm tra trạng thái hệ thống...</span>
        </CardContent>
      </Card>
    );
  }

  if (status.error) {
    return (
      <Card className="border-danger-200 min-h-[280px]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-danger-500" />
            <div>
              <p className="font-medium text-danger-700">Lỗi Kết nối Backend</p>
              <p className="text-sm text-danger-600">{status.error}</p>
            </div>
          </div>
          <button
            onClick={checkSystemHealth}
            className="mt-3 text-sm text-primary-600 hover:text-primary-700 underline"
          >
            Kết nối lại
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={status.healthy ? 'border-success-200' : 'border-warning-200'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-base">Trạng thái Hệ thống</CardTitle>
          </div>
          <Badge variant={status.healthy ? 'success' : 'warning'} size="sm">
            {status.healthy ? 'Tốt' : 'Giảm hiệu suất'}
          </Badge>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Model Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Mô hình ML</span>
              </div>
              {status.modelLoaded ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success-500" />
                  <span className="text-xs text-success-700">Đã tải</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-danger-500" />
                  <span className="text-xs text-danger-700">Chưa tải</span>
                </div>
              )}
            </div>

            {/* Preprocessor Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Bộ tiền xử lý</span>
              </div>
              {status.preprocessorLoaded ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success-500" />
                  <span className="text-xs text-success-700">Sẵn sàng</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-danger-500" />
                  <span className="text-xs text-danger-700">Chưa sẵn sàng</span>
                </div>
              )}
            </div>

            {/* Database Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Cơ sở dữ liệu Supabase</span>
              </div>
              {status.databaseConnected ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success-500" />
                  <span className="text-xs text-success-700">Đã kết nối</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-danger-500" />
                  <span className="text-xs text-danger-700">Mất kết nối</span>
                </div>
              )}
            </div>

            {/* Model Info */}
            {status.modelVersion && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Phiên bản mô hình: <span className="font-medium">{status.modelVersion}</span>
                </p>
                {status.threshold !== undefined && (
                  <p className="text-xs text-gray-500">
                    Ngưỡng: <span className="font-medium">{(status.threshold * 100).toFixed(2)}%</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={checkSystemHealth}
            className="mt-4 w-full text-sm text-primary-600 hover:text-primary-700 underline"
          >
            Làm mới Trạng thái
          </button>
        </CardContent>
      )}
    </Card>
  );
}
