'use client';

import { useState } from 'react';
import { TransactionTable } from '@/components/predict/TransactionTable';
import { PredictResult } from '@/components/predict/PredictResult';
import { SystemStatus } from '@/components/system/SystemStatus';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { predictRepurchase } from '@/services/api';
import { fetchCustomerHistory } from '@/services/customer';
import { Transaction, PredictResponse } from '@/types';
import { 
  Send, 
  AlertCircle, 
  Search, 
  Loader2, 
  RotateCcw,
  Sparkles,
  Target,
  Users,
  Calendar,
  Brain
} from 'lucide-react';

export default function ApplyPage() {
  const [customerId, setCustomerId] = useState('');
  const [snapshotDate, setSnapshotDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [fetchError, setFetchError] = useState('');

  const validateForm = (): boolean => {
    if (!customerId.trim()) {
      setError('Vui lòng nhập ID khách hàng');
      return false;
    }
    if (!snapshotDate) {
      setError('Vui lòng chọn ngày snapshot');
      return false;
    }
    
    // Kiểm tra có giao dịch để dự đoán không
    if (transactions.length === 0) {
      setError('Không có giao dịch để dự đoán. Vui lòng lấy lịch sử trước.');
      return false;
    }

    // Chỉ cho phép dự đoán khi đã fetch từ DB
    if (allTransactions.length === 0) {
      setError('Vui lòng nhấn "Lấy Lịch Sử" để tải dữ liệu giao dịch');
      return false;
    }

    // Kiểm tra ngày đặt không được sau snapshot_date
    const snapshot = new Date(snapshotDate);
    for (let i = 0; i < allTransactions.length; i++) {
      const t = allTransactions[i];
      const orderDate = new Date(t.order_date);
      if (orderDate > snapshot) {
        setError(`Giao dịch ${i + 1} (Order ID: ${t.order_id}): Ngày đặt (${t.order_date}) không được sau ngày snapshot (${snapshotDate})`);
        return false;
      }
    }
    
    // Cảnh báo nếu không có đơn nào trong 5 tháng gần nhất (không block)
    const minDate = new Date(snapshot);
    minDate.setMonth(minDate.getMonth() - 5);
    const hasRecentData = transactions.some(t => new Date(t.order_date) >= minDate);
    
    if (!hasRecentData) {
      console.warn('Cảnh báo: Không có đơn hàng nào trong 5 tháng gần nhất. Độ chính xác có thể giảm.');
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    const formatDateToISO = (dateStr: string): string => {
      if (!dateStr) return '';
      if (dateStr.includes('T') || dateStr.includes('Z')) {
        return dateStr;
      }
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toISOString();
    };

    try {
      const txsToSend = transactions.map(t => ({
        ...t,
        order_date: formatDateToISO(t.order_date),
      }));

      const requestData = {
        customer_info: {
          customer_id: customerId,
          snapshot_date: snapshotDate,
        },
        transactions: txsToSend,
      };

      console.log('📤 Request body:', JSON.stringify(requestData, null, 2));

      const response = await predictRepurchase(requestData);

      if (response.success) {
        setResult(response);
      } else {
        setError('Dự đoán thất bại');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong đợi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchHistory = async () => {
    if (!customerId.trim()) {
      setFetchError('Vui lòng nhập ID khách hàng');
      return;
    }

    setIsFetching(true);
    setFetchError('');
    // Reset dữ liệu cũ để load mới
    setTransactions([]);
    setAllTransactions([]);
    setResult(null);

    try {
      const response = await fetchCustomerHistory(customerId.trim());
      if (response.success && response.count > 0) {
        const fetchedTransactions: Transaction[] = response.transactions.map((raw) => ({
          order_id: raw.order_id,
          total_items: raw.total_items,
          log_items: raw.log_items,
          order_date: raw.order_date,
          order_value: raw.order_value,
          canceled_value: raw.canceled_value,
          order_n_categories: raw.order_n_categories,
          order_n_lines: raw.order_n_lines,
          is_canceled: raw.is_canceled,
          country: raw.country,
        }));

        const snapshot = new Date(snapshotDate);
        
        // Lọc chỉ lấy đơn <= snapshot date (không lấy đơn tương lai)
        const validTransactions = fetchedTransactions.filter((t) => {
          const transactionDate = new Date(t.order_date);
          return transactionDate <= snapshot;
        });
        
        // Thông báo nếu không có giao dịch nào trước ngày snapshot
        if (validTransactions.length === 0) {
          setFetchError(`Không có giao dịch nào trước ngày ${snapshotDate}. Vui lòng chọn ngày snapshot khác.`);
          setIsFetching(false);
          return;
        }
        
        if (validTransactions.length < fetchedTransactions.length) {
          const futureCount = fetchedTransactions.length - validTransactions.length;
          console.log(`${futureCount} giao dịch sau ngày snapshot đã bị loại bỏ`);
        }
        
        const startDate = new Date(snapshot);
        startDate.setMonth(startDate.getMonth() - 5);

        const filteredTransactions = validTransactions.filter((t) => {
          const transactionDate = new Date(t.order_date);
          return transactionDate >= startDate;
        });
        
        // Thông báo nếu không có giao dịch nào trong 5 tháng gần nhất
        if (filteredTransactions.length === 0) {
          setFetchError(`Không có giao dịch nào trong 5 tháng gần ${snapshotDate}. Vui lòng chọn ngày snapshot khác.`);
          setIsFetching(false);
          return;
        }

        setAllTransactions(validTransactions);
        setTransactions(filteredTransactions);

        if (filteredTransactions.length < fetchedTransactions.length) {
          const hiddenCount = fetchedTransactions.length - filteredTransactions.length;
          console.log(`${hiddenCount} giao dịch ngoài cửa sổ 5 tháng (vẫn gửi API để tính biến lịch sử)`);
        }
      } else {
        setFetchError('Không tìm thấy lịch sử cho ID khách hàng này');
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Lấy lịch sử thất bại');
    } finally {
      setIsFetching(false);
    }
  };

  const handleReset = () => {
    setCustomerId('');
    setSnapshotDate(new Date().toISOString().split('T')[0]);
    setTransactions([]);
    setAllTransactions([]);
    setResult(null);
    setError('');
    setFetchError('');
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-secondary-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-3">
                <Target className="w-4 h-4" />
                AI Prediction
              </div>
              <h1 className="text-3xl font-bold text-secondary-900">Dự Đoán Mua Lại</h1>
              <p className="mt-2 text-secondary-600 max-w-xl">
                Nhập thông tin khách hàng và lịch sử giao dịch để dự đoán khả năng mua lại với độ chính xác cao.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Brain className="w-5 h-5" />
                <span className="text-sm font-medium">Model Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="max-w-6xl mx-auto mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card className="border-0 shadow-lg shadow-secondary-100/50 overflow-hidden max-w-6xl mx-auto">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-transparent border-b border-secondary-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Thông Tin Khách Hàng</CardTitle>
                  <p className="text-sm text-secondary-500">Nhập ID khách hàng và ngày phân tích</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                    ID Khách Hàng
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="vd: 00090324bbad0e9342388303bb71ba0a"
                        value={customerId}
                        onChange={(e) => {
                          setCustomerId(e.target.value);
                          setFetchError('');
                        }}
                        disabled={isLoading || isFetching}
                        className="h-11 border-secondary-200 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <Button
                      onClick={handleFetchHistory}
                      disabled={isLoading || isFetching || !customerId.trim()}
                      variant="secondary"
                      className="h-11 px-4 bg-secondary-100 hover:bg-secondary-200 text-secondary-700"
                    >
                      {isFetching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">Lấy Lịch Sử</span>
                    </Button>
                  </div>
                  {fetchError && (
                    <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg">
                      <p className="text-sm text-rose-600 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {fetchError}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ngày Snapshot
                    <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={snapshotDate}
                    onChange={(e) => setSnapshotDate(e.target.value)}
                    disabled={isLoading || isFetching}
                    className="h-11 border-secondary-200 focus:border-primary-500 focus:ring-primary-500"
                  />
                  <p className="text-xs text-secondary-500">
                    Ngày phân tích tính từ thời điểm này
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction List */}
          <div className="max-w-6xl mx-auto">
            <TransactionTable transactions={transactions} />
          </div>

          {/* Action Buttons - Centered */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              onClick={handleReset}
              disabled={isLoading || isFetching}
              variant="outline"
              className="h-11 px-6 border-secondary-300 text-secondary-700 hover:bg-secondary-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Xóa Form
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || isFetching}
              isLoading={isLoading}
              className="h-11 px-8 btn-ecommerce"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Dự Đoán Mua Lại
            </Button>
          </div>

          {/* Result & Status - Below buttons */}
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <SystemStatus resetKey={resetKey} />
            <PredictResult result={result} isLoading={isLoading} transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
