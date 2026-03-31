'use client';

import { Transaction } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ShoppingCart } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <CardTitle>Lịch Sử Giao Dịch</CardTitle>
            <p className="text-sm text-secondary-500 mt-1">
              {transactions.length > 0 
                ? `Tìm thấy ${transactions.length} giao dịch (trong 5 tháng gần nhất)`
                : 'Chưa có dữ liệu. Nhập ID khách hàng và nhấn "Lấy Lịch Sử"'}
            </p>
          </div>
        </div>
        <div className="text-sm text-secondary-600">
          <span className="font-medium">{transactions.length}</span> đơn hàng
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed min-w-[700px]">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider w-24">
                    Order ID
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider w-16">
                    Items
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider w-16">
                    Categ.
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider w-16">
                    Lines
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-secondary-600 uppercase tracking-wider w-24">
                    Value
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-secondary-600 uppercase tracking-wider w-20">
                    Hủy
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider w-24">
                    Country
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider w-20">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {transactions.map((t, index) => (
                  <tr key={index} className="hover:bg-secondary-50/50 transition-colors">
                    <td className="px-3 py-3 text-sm font-medium text-secondary-900 truncate w-24">
                      {t.order_id}
                    </td>
                    <td className="px-3 py-3 text-sm text-center text-secondary-700 tabular-nums w-16">
                      {t.total_items}
                    </td>
                    <td className="px-3 py-3 text-sm text-center text-secondary-700 tabular-nums w-16">
                      {t.order_n_categories}
                    </td>
                    <td className="px-3 py-3 text-sm text-center text-secondary-700 tabular-nums w-16">
                      {t.order_n_lines}
                    </td>
                    <td className="px-3 py-3 text-sm text-right text-secondary-700 tabular-nums w-24">
                      {t.order_value.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-sm text-center w-20">
                      {t.is_canceled === 1 ? (
                        <span className="inline-flex items-center px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-medium">
                          Có
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                          Không
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-left text-secondary-700 w-24">
                      {t.country}
                    </td>
                    <td className="px-3 py-3 text-sm text-left text-secondary-700 tabular-nums w-20">
                      {t.order_date ? new Date(t.order_date).toLocaleDateString('vi-VN') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-secondary-400" />
            </div>
            <p className="text-secondary-500">
              Chưa có dữ liệu giao dịch
            </p>
            <p className="text-sm text-secondary-400 mt-1">
              Nhập ID khách hàng và nhấn "Lấy Lịch Sử" để tải dữ liệu
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
