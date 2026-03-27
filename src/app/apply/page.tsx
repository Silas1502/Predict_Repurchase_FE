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
import { Send, AlertCircle, Search, Loader2, RotateCcw } from 'lucide-react';

const emptyTransaction: Transaction = {
  order_id: '',
  total_items: 1,
  log_items: 0,
  order_date: '',
  order_value: 0,
  canceled_value: 0,
  order_n_categories: 1,
  order_n_lines: 1,
  is_canceled: 0,
  country: 'United Kingdom',
};

export default function ApplyPage() {
  const [customerId, setCustomerId] = useState('');
  const [snapshotDate, setSnapshotDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
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
    if (transactions.length === 0) {
      setError('Cần ít nhất một giao dịch');
      return false;
    }
    // Check required fields in each transaction
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      if (!t.order_id || !t.order_date) {
        setError(`Giao dịch ${i + 1} thiếu thông tin bắt buộc (Mã đơn hoặc Ngày đặt)`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    // Helper: Chuyển đổi ngày về định dạng ISO chuẩn
    const formatDateToISO = (dateStr: string): string => {
      if (!dateStr) return '';
      // Nếu đã là ISO format (chứa T hoặc Z), giữ nguyên
      if (dateStr.includes('T') || dateStr.includes('Z')) {
        return dateStr;
      }
      // Nếu là định dạng khác, chuyển sang Date rồi toISOString
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr; // Không parse được thì trả về nguyên bản
      return d.toISOString();
    };

    try {
      // Chuẩn hóa định dạng ngày cho tất cả transactions trước khi gửi
      const txsToSend = (allTransactions.length > 0 ? allTransactions : transactions).map(t => ({
        ...t,
        order_date: formatDateToISO(t.order_date),
        // Đảm bảo total_items và log_items không âm (dữ liệu đơn hủy có thể là số âm)
        total_items: Math.abs(t.total_items),
        log_items: t.log_items < 0 ? Math.abs(t.log_items) : t.log_items,
      }));

      const requestData = {
        customer_info: {
          customer_id: customerId,
          snapshot_date: snapshotDate,
        },
        transactions: txsToSend,
      };

      // DEBUG: Log request body
      console.log('📤 Request body:', JSON.stringify(requestData, null, 2));

      const response = await predictRepurchase(requestData);

      // Backend trả về PredictResponse trực tiếp (không wrap trong ApiResponse)
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

        // Filter transactions within 5 months before snapshot date (for display only)
        const snapshot = new Date(snapshotDate);
        const startDate = new Date(snapshot);
        startDate.setMonth(startDate.getMonth() - 5);

        const filteredTransactions = fetchedTransactions.filter((t) => {
          const transactionDate = new Date(t.order_date);
          return transactionDate <= snapshot && transactionDate >= startDate;
        });

        // Save all transactions for API (to calculate historical features from beginning)
        setAllTransactions(fetchedTransactions);
        // Show only 5-month window on UI
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
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dự Đoán Mua Lại</h1>
        <p className="mt-2 text-gray-600">
          Nhập thông tin khách hàng và lịch sử giao dịch để dự đoán khả năng mua lại.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-center gap-3 text-danger-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Main Content - Form */}
        <div className="space-y-4">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Khách Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                  <div className="flex-1 w-full">
                    <Input
                      label="ID Khách Hàng Duy Nhất"
                      placeholder="vd: 00090324bbad0e9342388303bb71ba0a"
                      value={customerId}
                      onChange={(e) => {
                        setCustomerId(e.target.value);
                        setFetchError('');
                      }}
                      disabled={isLoading || isFetching}
                      required
                    />
                  </div>
                  <Button
                    onClick={handleFetchHistory}
                    disabled={isLoading || isFetching || !customerId.trim()}
                    variant="secondary"
                    size="md"
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lấy...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Lấy Lịch Sử
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  label="Ngày Snapshot"
                  type="date"
                  value={snapshotDate}
                  onChange={(e) => setSnapshotDate(e.target.value)}
                  disabled={isLoading || isFetching}
                  required
                />
              </div>
              {fetchError && (
                <p className="mt-2 text-sm text-danger-600">{fetchError}</p>
              )}
            </CardContent>
          </Card>

          {/* Transaction Table */}
          <TransactionTable
            transactions={transactions}
            onChange={setTransactions}
            disabled={isLoading}
          />

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleReset}
              disabled={isLoading || isFetching}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Xóa Form
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || isFetching}
              isLoading={isLoading}
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Dự Đoán Mua Lại
            </Button>
          </div>
        </div>

        {/* Right Column - Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SystemStatus />
          <PredictResult result={result} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
