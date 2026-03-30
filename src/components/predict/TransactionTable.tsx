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
  total_items: 0,
  log_items: 0,
  order_date: '',
  order_value: 0,
  canceled_value: 0,
  order_n_categories: 0,
  order_n_lines: 0,
  is_canceled: 0,
  country: '',
};

export function TransactionTable({ transactions, onChange, disabled }: TransactionTableProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Tính log_items tự động khi gửi dữ liệu đi
  const calculateLogItems = (totalItems: number) => {
    if (!totalItems || totalItems <= 0) return 0;
    return Math.log(totalItems);
  };

  const addRow = () => {
    setErrors({}); // Xóa tất cả lỗi validation khi thêm dòng mới
    onChange([...transactions, { ...emptyTransaction }]);
  };

  const removeRow = (index: number) => {
    const newTransactions = transactions.filter((_, i) => i !== index);
    // Nếu xóa hết thì thêm 1 dòng trống
    if (newTransactions.length === 0) {
      onChange([{ ...emptyTransaction }]);
    } else {
      onChange(newTransactions);
    }
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
      <CardHeader className="flex flex-row items-end justify-between">
        <div>
          <CardTitle>Lịch Sử Giao Dịch</CardTitle>
          <p className="text-sm text-secondary-500 mt-1">
            Nhập lịch sử đơn hàng của khách hàng (tối thiểu 5 tháng để dự đoán chính xác)
          </p>
        </div>
        <Button onClick={addRow} disabled={disabled} size="sm" className="mb-1">
          <Plus className="w-4 h-4 mr-1" />
          Thêm Đơn
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed min-w-[600px]">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-24" title="Order ID">
                  Order_ID
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-16" title="Total Items">
                  Items
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-14" title="Number of Categories">
                  Categ.
                </th>
                <th className="pl-3 pr-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-14" title="Number of Lines">
                  Lines
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-20" title="Order Value">
                  Value
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-20" title="Is Canceled (0/1)">
                  Hủy
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-20" title="Canceled Value">
                  Tiền Hủy
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-20" title="Country">
                  Country
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-28" title="Order Date">
                  Date
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider whitespace-nowrap w-10">
                  Xóa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-secondary-50/50 transition-colors">
                  <td className="px-2 py-2 w-24">
                    <Input
                      value={transaction.order_id}
                      onChange={(e) => updateRow(index, 'order_id', e.target.value)}
                      onBlur={(e) => handleBlur(index, 'order_id', e.target.value)}
                      error={errors[`${index}-order_id`]}
                      disabled={disabled}
                      placeholder="Mã đơn"
                      className="text-sm min-w-0"
                    />
                  </td>
                  <td className="px-2 py-2 w-14">
                    <Input
                      type="number"
                      min={1}
                      value={transaction.total_items || ''}
                      onChange={(e) => updateRow(index, 'total_items', e.target.value === '' ? 0 : parseInt(e.target.value))}
                      onBlur={(e) => handleBlur(index, 'total_items', e.target.value)}
                      error={errors[`${index}-total_items`]}
                      disabled={disabled}
                      className="text-sm min-w-0"
                    />
                  </td>
                  <td className="px-2 py-2 w-14">
                    <Input
                      type="number"
                      min={1}
                      value={transaction.order_n_categories || ''}
                      onChange={(e) => updateRow(index, 'order_n_categories', e.target.value === '' ? 0 : parseInt(e.target.value))}
                      onBlur={(e) => handleBlur(index, 'order_n_categories', e.target.value)}
                      error={errors[`${index}-order_n_categories`]}
                      disabled={disabled}
                      className="text-sm min-w-0"
                    />
                  </td>
                  <td className="pl-3 pr-2 py-2 w-14">
                    <Input
                      type="number"
                      min={1}
                      value={transaction.order_n_lines || ''}
                      onChange={(e) => updateRow(index, 'order_n_lines', e.target.value === '' ? 0 : parseInt(e.target.value))}
                      onBlur={(e) => handleBlur(index, 'order_n_lines', e.target.value)}
                      error={errors[`${index}-order_n_lines`]}
                      disabled={disabled}
                      className="text-sm min-w-0"
                    />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <Input
                      type="number"
                      step="0.01"
                      value={transaction.order_value || ''}
                      onChange={(e) => updateRow(index, 'order_value', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                      onBlur={(e) => handleBlur(index, 'order_value', e.target.value)}
                      error={errors[`${index}-order_value`]}
                      disabled={disabled}
                      className="text-sm min-w-0"
                    />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <select
                      value={transaction.is_canceled}
                      onChange={(e) => updateRow(index, 'is_canceled', parseInt(e.target.value))}
                      disabled={disabled}
                      className="w-full h-9 px-2 text-sm border border-secondary-200 rounded-lg bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    >
                      <option value={0}>0 - Không</option>
                      <option value={1}>1 - Có</option>
                    </select>
                  </td>
                  <td className="px-2 py-2 w-20">
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={transaction.canceled_value || ''}
                      onChange={(e) => updateRow(index, 'canceled_value', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                      disabled={disabled}
                      placeholder="0.00"
                      className="text-sm min-w-0"
                    />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <Input
                      value={transaction.country}
                      onChange={(e) => updateRow(index, 'country', e.target.value)}
                      onBlur={(e) => handleBlur(index, 'country', e.target.value)}
                      error={errors[`${index}-country`]}
                      disabled={disabled}
                      placeholder="VD: UK"
                      className="text-sm min-w-0"
                    />
                  </td>
                  <td className="px-2 py-2 w-28">
                    <Input
                      type="date"
                      value={transaction.order_date ? transaction.order_date.split('T')[0] : ''}
                      onChange={(e) => updateRow(index, 'order_date', e.target.value)}
                      onBlur={(e) => handleBlur(index, 'order_date', e.target.value)}
                      error={errors[`${index}-order_date`]}
                      disabled={disabled}
                      className="text-sm min-w-0"
                    />
                  </td>
                  <td className="px-2 py-2 text-center w-10">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!disabled) {
                          removeRow(index);
                        }
                      }}
                      className="inline-flex p-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                      style={{ pointerEvents: 'all' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-secondary-500">
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
