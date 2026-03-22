'use client';

import { useEffect, useState } from 'react';
import { getPredictionHistory } from '@/services/api';
import { ApplicationLog } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<ApplicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);  // Backend mặc định 20

  const fetchHistory = async (pageNum: number = page) => {
    setIsLoading(true);
    setError('');

    try {
      // Backend dùng 'page' và 'page_size' thay vì 'limit'
      const response = await getPredictionHistory({ page: pageNum, page_size: pageSize });
      
      // Backend trả về ApplicationsListResponse trực tiếp
      if (response.success) {
        setPredictions(response.data);
        setTotal(response.count);
        setPage(response.page);
        setPageSize(response.page_size);
        // Tính total_pages từ count và page_size
        setTotalPages(Math.ceil(response.count / response.page_size));
      } else {
        setError('Không thể tải lịch sử');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong đợi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchHistory(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch Sử Dự Đoán</h1>
          <p className="mt-2 text-gray-600">
            Xem tất cả các dự đoán mua lại trước đây và kết quả của chúng.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchHistory(page)}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-center gap-3 text-danger-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tất cả Dự đoán ({total})</CardTitle>
            {!isLoading && total > 0 && (
              <span className="text-sm text-gray-500">
                Trang {page} / {totalPages}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <p className="mt-4 text-gray-500">Đang tải dự đoán...</p>
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy dự đoán nào.</p>
              <p className="text-sm text-gray-400 mt-1">
                Thực hiện dự đoán để xem tại đây.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Khách hàng
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Xác suất
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dự đoán
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mức độ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {predictions.map((prediction) => (
                    <tr key={prediction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-600">
                          {prediction.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-gray-900">
                          {prediction.customer_id.slice(0, 16)}...
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-semibold ${
                            prediction.probability > 0.15
                              ? 'text-success-600'
                              : prediction.probability >= 0.08
                              ? 'text-warning-600'
                              : 'text-danger-600'
                          }`}
                        >
                          {(prediction.probability * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            prediction.is_repurchase
                              ? 'bg-success-100 text-success-800'
                              : 'bg-danger-100 text-danger-800'
                          }`}
                        >
                          {prediction.is_repurchase ? 'Sẽ mua lại' : 'Không mua lại'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={getBadgeVariant(prediction.potential_level)} size="sm">
                          {prediction.potential_level}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(prediction.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trước
              </Button>
              <span className="text-sm text-gray-500">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || isLoading}
              >
                Sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {!isLoading && predictions.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Tổng Dự đoán</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Tỷ lệ Mua lại</p>
              <p className="text-2xl font-bold text-success-600">
                {(
                  (predictions.filter((p) => p.is_repurchase).length / predictions.length) *
                  100
                ).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Tiềm năng Cao</p>
              <p className="text-2xl font-bold text-primary-600">
                {predictions.filter((p) => p.potential_level === 'High').length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
