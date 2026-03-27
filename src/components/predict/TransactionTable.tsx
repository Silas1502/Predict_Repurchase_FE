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

export function TransactionTable({ transactions, onChange, disabled }: TransactionTableProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to get order status display
  const getOrderStatus = (t: Transaction) => {
    if (t.is_canceled === 1) {
      return { label: 'Đã hủy', color: 'bg-danger-100 text-danger-800' };
    }
    if (t.canceled_value > 0) {
      return { label: 'Có hủy một phần', color: 'bg-warning-100 text-warning-800' };
    }
    return { label: 'Hoàn thành', color: 'bg-success-100 text-success-800' };
  };

  const calculateLogItems = (totalItems: number) => {
    return Math.log(totalItems);
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
    
    if (field === 'total_items') {
      const totalItems = typeof value === 'string' ? parseInt(value) || 1 : value;
      newTransactions[index].log_items = calculateLogItems(totalItems);
    }
    
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
    if (field === 'order_date' && !value) return 'Ngày đặt hàng bắt buộc';
    if (field === 'country' && !value) return 'Quốc gia bắt buộc';
    if (field === 'total_items') {
      const num = parseInt(value as string);
      if (isNaN(num) || num < 1) return 'Phải >= 1';
    }
    if (field === 'order_value') {
      const num = parseFloat(value as string);
      if (isNaN(num)) return 'Phải là số';
    }
    if (field === 'canceled_value') {
      const num = parseFloat(value as string);
      if (isNaN(num) || num < 0) return 'Phải >= 0';
    }
    if (field === 'order_n_categories') {
      const num = parseInt(value as string);
      if (isNaN(num) || num < 1) return 'Phải >= 1';
    }
    if (field === 'order_n_lines') {
      const num = parseInt(value as string);
      if (isNaN(num) || num < 1) return 'Phải >= 1';
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
            Nhập lịch sử đơn hàng của khách hàng (tối thiểu 5 tháng để dự đoán chính xác)
          </p>
        </div>
        <Button onClick={addRow} disabled={disabled} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Thêm Đơn
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Mã Đơn
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                  Số lượng
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                  Log(Items)
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                  Số danh mục
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                  Số dòng
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-28">
                  Giá trị ($)
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-28">
                  Tiền hủy ($)
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                  Hủy đơn
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-32">
                  Trạng thái
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-28">
                  Quốc gia
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-36">
                  Ngày đặt
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16">
                  Xóa
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
                  <td className="px-2 py-2 w-24">
                    <Input
                      type="number"
                      min={1}
                      value={transaction.total_items}
                      onChange={(e) => updateRow(index, 'total_items', parseInt(e.target.value) || 1)}
                      onBlur={(e) => handleBlur(index, 'total_items', e.target.value)}
                      error={errors[`${index}-total_items`]}
                      disabled={disabled}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <Input
                      type="number"
                      step="0.0001"
                      value={transaction.log_items.toFixed(4)}
                      disabled={true}
                      className="text-sm bg-gray-100"
                      title="Tự động tính từ Số lượng"
                    />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <Input
                      type="number"
                      min={1}
                      value={transaction.order_n_categories}
                      onChange={(e) => updateRow(index, 'order_n_categories', parseInt(e.target.value) || 1)}
                      onBlur={(e) => handleBlur(index, 'order_n_categories', e.target.value)}
                      error={errors[`${index}-order_n_categories`]}
                      disabled={disabled}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <Input
                      type="number"
                      min={1}
                      value={transaction.order_n_lines}
                      onChange={(e) => updateRow(index, 'order_n_lines', parseInt(e.target.value) || 1)}
                      onBlur={(e) => handleBlur(index, 'order_n_lines', e.target.value)}
                      error={errors[`${index}-order_n_lines`]}
                      disabled={disabled}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 w-28">
                    <Input
                      type="number"
                      step="0.01"
                      value={transaction.order_value}
                      onChange={(e) => updateRow(index, 'order_value', parseFloat(e.target.value) || 0)}
                      onBlur={(e) => handleBlur(index, 'order_value', e.target.value)}
                      error={errors[`${index}-order_value`]}
                      disabled={disabled}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 w-28">
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={transaction.canceled_value}
                      onChange={(e) => updateRow(index, 'canceled_value', parseFloat(e.target.value) || 0)}
                      onBlur={(e) => handleBlur(index, 'canceled_value', e.target.value)}
                      error={errors[`${index}-canceled_value`]}
                      disabled={disabled}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <select
                      value={transaction.is_canceled}
                      onChange={(e) => updateRow(index, 'is_canceled', parseInt(e.target.value))}
                      disabled={disabled}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                    >
                      <option value={0}>Không</option>
                      <option value={1}>Có</option>
                    </select>
                  </td>
                  <td className="px-2 py-2 w-32">
                    {(() => {
                      const status = getOrderStatus(transaction);
                      return (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-2 py-2 w-28">
                    <Input
                      value={transaction.country}
                      onChange={(e) => updateRow(index, 'country', e.target.value)}
                      onBlur={(e) => handleBlur(index, 'country', e.target.value)}
                      error={errors[`${index}-country`]}
                      disabled={disabled}
                      placeholder="VD: United Kingdom"
                      className="text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 w-36">
                    <Input
                      type="datetime-local"
                      value={transaction.order_date ? transaction.order_date.slice(0, 16) : ''}
                      onChange={(e) => updateRow(index, 'order_date', e.target.value)}
                      onBlur={(e) => handleBlur(index, 'order_date', e.target.value)}
                      error={errors[`${index}-order_date`]}
                      disabled={disabled}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 text-center w-16">
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
                  <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                    Chưa có giao dịch. Nhấn &quot;Thêm Đơn&quot; để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
