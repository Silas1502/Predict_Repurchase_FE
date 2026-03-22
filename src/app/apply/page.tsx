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
  product_id: '',
  category_en: '',
  review_score: 5,
  customer_state: '',
  is_total_order: 1,
  is_valid_order: 1,
  valid_spend_capped: 0,
  order_purchase_timestamp: '',
};

export default function ApplyPage() {
  const [customerId, setCustomerId] = useState('');
  const [snapshotDate, setSnapshotDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      if (!t.order_id || !t.product_id || !t.order_purchase_timestamp) {
        setError(`Giao dịch ${i + 1} thiếu thông tin bắt buộc`);
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

    try {
      const response = await predictRepurchase({
        customer_info: {
          customer_unique_id: customerId,
          snapshot_date: snapshotDate,
        },
        transactions: transactions,
      });

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
          product_id: raw.product_id,
          category_en: raw.category_en,
          review_score: raw.review_score,
          customer_state: raw.customer_state,
          is_total_order: raw.is_total_order,
          is_valid_order: raw.is_valid_order,
          valid_spend_capped: raw.valid_spend_capped,
          order_purchase_timestamp: raw.order_purchase_timestamp,
        }));

        // Filter transactions within 6 months before snapshot date
        const snapshot = new Date(snapshotDate);
        const startDate = new Date(snapshot);
        startDate.setMonth(startDate.getMonth() - 6);

        const filteredTransactions = fetchedTransactions.filter((t) => {
          const transactionDate = new Date(t.order_purchase_timestamp);
          return transactionDate <= snapshot && transactionDate >= startDate;
        });

        setTransactions(filteredTransactions);

        if (filteredTransactions.length < fetchedTransactions.length) {
          const hiddenCount = fetchedTransactions.length - filteredTransactions.length;
          console.log(`${hiddenCount} giao dịch bị ẩn (ngoài cửa sổ 6 tháng)`);
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
