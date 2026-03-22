'use client';

import { useState } from 'react';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Plus, Trash2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onChange: (transactions: Transaction[]) => void;
  disabled?: boolean;
}

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

export function TransactionTable({ transactions, onChange, disabled }: TransactionTableProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to get order status display
  const getOrderStatus = (t: Transaction) => {
    if (t.is_valid_order === 1) {
      return { label: 'Đơn hợp lệ', color: 'bg-success-100 text-success-800' };
    }
    if (t.is_valid_order === 0 && t.is_total_order === 0) {
      return { label: 'Sản phẩm phụ', color: 'bg-gray-100 text-gray-600' };
    }
    if (t.is_valid_order === 0 && t.valid_spend_capped === 0) {
      return { label: 'Đã hủy/Không giá trị', color: 'bg-danger-100 text-danger-800' };
    }
    // Default case for invalid order that doesn't match above conditions
    return { label: 'Không hợp lệ', color: 'bg-gray-100 text-gray-600' };
  };

  const addRow = () => {
    onChange([...transactions, { ...emptyTransaction }]);
  };

  const removeRow = (index: number) => {
    const newTransactions = transactions.filter((_, i) => i !== index);
    onChange(newTransactions);
  };

  const updateRow = (index: number, field: keyof Transaction, value: string | number) => {
    const newTransactions = [...transactions];
    newTransactions[index] = { ...newTransactions[index], [field]: value };
    onChange(newTransactions);

    // Clear error for this field
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  const validateField = (index: number, field: keyof Transaction, value: string | number): string => {
    if (field === 'order_id' && !value) return 'Mã đơn hàng bắt buộc';
    if (field === 'product_id' && !value) return 'Mã sản phẩm bắt buộc';
    if (field === 'order_purchase_timestamp' && !value) return 'Thời gian bắt buộc';
    if (field === 'valid_spend_capped') {
      const num = parseFloat(value as string);
      if (isNaN(num) || num < 0) return 'Phải là số dương';
    }
    if (field === 'review_score') {
      const num = parseInt(value as string);
      if (isNaN(num) || num < 1 || num > 5) return 'Phải từ 1-5';
    }
    return '';
  };

  const handleBlur = (index: number, field: keyof Transaction, value: string | number) => {
    const error = validateField(index, field, value);
    if (error) {
      setErrors({ ...errors, [`${index}-${field}`]: error });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lịch Sử Giao Dịch</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Nhập lịch sử đơn hàng của khách hàng trong 6 tháng qua
          </p>
        </div>
        <Button onClick={addRow} disabled={disabled} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Thêm Đơn
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Mã Đơn
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Mã SP
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Danh mục
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Bang
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Đánh giá
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Chi tiêu ($)
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Tổng
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Hợp lệ
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Trạng thái
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Thời gian
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-2 py-2">
                  <Input
                    value={transaction.order_id}
                    onChange={(e) => updateRow(index, 'order_id', e.target.value)}
                    onBlur={(e) => handleBlur(index, 'order_id', e.target.value)}
                    error={errors[`${index}-order_id`]}
                    disabled={disabled}
                    placeholder="Mã đơn"
                    className="text-sm"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    value={transaction.product_id}
                    onChange={(e) => updateRow(index, 'product_id', e.target.value)}
                    onBlur={(e) => handleBlur(index, 'product_id', e.target.value)}
                    error={errors[`${index}-product_id`]}
                    disabled={disabled}
                    placeholder="Mã SP"
                    className="text-sm"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    value={transaction.category_en}
                    onChange={(e) => updateRow(index, 'category_en', e.target.value)}
                    disabled={disabled}
                    placeholder="vd: bed_bath_table"
                    className="text-sm"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    value={transaction.customer_state}
                    onChange={(e) => updateRow(index, 'customer_state', e.target.value.toUpperCase())}
                    disabled={disabled}
                    placeholder="SP"
                    maxLength={2}
                    className="text-sm"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={transaction.review_score}
                    onChange={(e) => updateRow(index, 'review_score', parseInt(e.target.value) || 5)}
                    onBlur={(e) => handleBlur(index, 'review_score', parseInt(e.target.value))}
                    error={errors[`${index}-review_score`]}
                    disabled={disabled}
                    className="text-sm"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    value={transaction.valid_spend_capped}
                    onChange={(e) => updateRow(index, 'valid_spend_capped', parseFloat(e.target.value) || 0)}
                    onBlur={(e) => handleBlur(index, 'valid_spend_capped', e.target.value)}
                    error={errors[`${index}-valid_spend_capped`]}
                    disabled={disabled}
                    className="text-sm"
                  />
                </td>
                <td className="px-2 py-2">
                  <select
                    value={transaction.is_total_order}
                    onChange={(e) => updateRow(index, 'is_total_order', parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  >
                    <option value={1}>Có</option>
                    <option value={0}>Không</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select
                    value={transaction.is_valid_order}
                    onChange={(e) => updateRow(index, 'is_valid_order', parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  >
                    <option value={1}>Có</option>
                    <option value={0}>Không</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  {(() => {
                    const status = getOrderStatus(transaction);
                    return (
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-2 py-2">
                  <Input
                    type="datetime-local"
                    value={transaction.order_purchase_timestamp.slice(0, 16)}
                    onChange={(e) => updateRow(index, 'order_purchase_timestamp', e.target.value)}
                    onBlur={(e) => handleBlur(index, 'order_purchase_timestamp', e.target.value)}
                    error={errors[`${index}-order_purchase_timestamp`]}
                    disabled={disabled}
                    className="text-sm"
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(index)}
                    disabled={disabled || transactions.length === 1}
                    className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                  Chưa có giao dịch. Nhấn &quot;Thêm Đơn&quot; để bắt đầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
