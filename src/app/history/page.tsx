'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPredictionHistory } from '@/services/api';
import { ApplicationLog } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  History,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Clock,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<ApplicationLog[]>([]);
  const [allPredictions, setAllPredictions] = useState<ApplicationLog[]>([]); // Tất cả để tính stats
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchHistory = async (pageNum: number = page) => {
    setIsLoading(true);
    setError('');

    try {
      // Lấy dữ liệu trang hiện tại
      const response = await getPredictionHistory({ page: pageNum, page_size: pageSize });
      
      if (response.success) {
        setPredictions(response.data);
        setTotal(response.count);
        setPage(response.page);
        setPageSize(response.page_size);
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

  // Fetch tất cả để tính stats (chỉ 1 lần khi load)
  const fetchAllForStats = async () => {
    setStatsLoading(true);
    try {
      // Backend giới hạn page_size max = 100
      const response = await getPredictionHistory({ page: 1, page_size: 100 });
      if (response.success) {
        setAllPredictions(response.data);
      }
    } catch (err) {
      console.error('Lỗi tải stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
    fetchAllForStats(); // Tải tất cả để tính stats
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
      case 'Nhóm Khách hàng Tự hành':
        return 'success';
      case 'Nhóm Trọng tâm Tăng trưởng':
        return 'warning';
      case 'Nhóm Tối ưu Hóa Chi phí':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-3">
                <History className="w-4 h-4" />
                Lịch sử dự đoán
              </div>
              <h1 className="text-3xl font-bold text-secondary-900">Lịch Sử Dự Đoán</h1>
              <p className="mt-2 text-secondary-600 max-w-xl">
                Xem tất cả các dự đoán mua lại đã thực hiện và phân tích kết quả.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fetchHistory(page)}
              disabled={isLoading}
              className="h-11 px-6 border-secondary-300 text-secondary-700 hover:bg-secondary-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Cards - Dùng allPredictions để tính toàn bộ */}
        {total > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg shadow-secondary-100/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Tổng Dự đoán</p>
                    <p className="text-2xl font-bold text-secondary-900">{total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg shadow-secondary-100/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Tỷ lệ Mua lại</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {allPredictions.length > 0 
                        ? ((allPredictions.filter((p) => p.is_repurchase).length / allPredictions.length) * 100).toFixed(1)
                        : ((predictions.filter((p) => p.is_repurchase).length / predictions.length) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg shadow-secondary-100/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Tiềm năng Cao</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {allPredictions.length > 0 
                        ? allPredictions.filter((p) => p.potential_level === 'Nhóm Khách hàng Tự hành').length
                        : predictions.filter((p) => p.potential_level === 'Nhóm Khách hàng Tự hành').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg shadow-secondary-100/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Trung bình</p>
                    <p className="text-2xl font-bold text-violet-600">
                      {allPredictions.length > 0 
                        ? (allPredictions.reduce((acc, p) => acc + p.probability, 0) / allPredictions.length * 100).toFixed(1)
                        : (predictions.reduce((acc, p) => acc + p.probability, 0) / predictions.length * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Table Card */}
        <Card className="border-0 shadow-lg shadow-secondary-100/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-transparent border-b border-secondary-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <History className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Danh sách Dự đoán</CardTitle>
                  <p className="text-sm text-secondary-500">
                    {total > 0 ? `Hiển thị ${predictions.length} / ${total} dự đoán` : 'Chưa có dự đoán nào'}
                  </p>
                </div>
              </div>
              {!isLoading && total > 0 && (
                <span className="text-sm text-secondary-500 bg-secondary-100 px-3 py-1 rounded-full whitespace-nowrap">
                  Trang {page} / {totalPages}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
                <p className="text-secondary-600 font-medium">Đang tải dữ liệu...</p>
                <p className="text-sm text-secondary-400 mt-1">Vui lòng đợi trong giây lát</p>
              </div>
            ) : predictions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <History className="w-10 h-10 text-secondary-400" />
                </div>
                <p className="text-lg font-medium text-secondary-700 mb-2">Chưa có dự đoán nào</p>
                <p className="text-sm text-secondary-500 mb-6 max-w-sm mx-auto">
                  Bắt đầu thực hiện dự đoán để xem lịch sử và phân tích kết quả tại đây.
                </p>
                <Link href="/apply">
                  <Button className="btn-ecommerce gap-2">
                    <Target className="w-4 h-4" />
                    Thực hiện dự đoán
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50/80 border-b border-secondary-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Mã dự đoán
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        ID Khách hàng
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Xác suất
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Kết quả
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Phân loại
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Thời gian
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {predictions.map((prediction) => (
                      <tr key={prediction.id} className="hover:bg-secondary-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-secondary-600 bg-secondary-100 px-2 py-1 rounded">
                            {prediction.id.slice(0, 8)}...
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-secondary-400" />
                            <span className="font-mono text-sm text-secondary-700">
                              {prediction.customer_id.slice(0, 12)}...
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-16 relative flex items-center justify-center rounded-full ${
                              prediction.is_repurchase
                                ? 'bg-emerald-100'
                                : 'bg-rose-100'
                            }`}>
                              <span
                                className={`text-sm font-bold ${
                                  prediction.is_repurchase
                                    ? 'text-emerald-700'
                                    : 'text-rose-700'
                                }`}
                              >
                                {(prediction.probability * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                              prediction.is_repurchase
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {prediction.is_repurchase ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Sẽ mua lại
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Không mua lại
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge 
                            variant={getBadgeVariant(prediction.potential_level)} 
                            size="sm"
                            className="font-medium"
                          >
                            {prediction.potential_level}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(prediction.created_at)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200 bg-secondary-50/30">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoading}
                  className="h-9 border-secondary-300 text-secondary-700 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isLoading}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum
                            ? 'bg-primary-500 text-white'
                            : 'bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="text-secondary-400">...</span>}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || isLoading}
                  className="h-9 border-secondary-300 text-secondary-700 hover:bg-white"
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
