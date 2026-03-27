'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fetchCustomerHistory } from '@/services/customer';
import { Transaction } from '@/types';
import { Search, Loader2 } from 'lucide-react';

interface QuickFillButtonProps {
  onFill: (transactions: Transaction[]) => void;
  disabled?: boolean;
}

export function QuickFillButton({ onFill, disabled }: QuickFillButtonProps) {
  const [customerId, setCustomerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    if (!customerId.trim()) {
      setError('Please enter a Customer ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetchCustomerHistory(customerId.trim());
      if (response.success && response.count > 0) {
        // Transform raw transactions to Transaction type
        const transactions: Transaction[] = response.transactions.map((raw) => ({
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
        onFill(transactions);
        setError('');
      } else {
        setError('No history found for this customer ID');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
      <div className="flex-1 w-full sm:w-auto">
        <Input
          label="Customer ID"
          placeholder="Enter customer_unique_id..."
          value={customerId}
          onChange={(e) => {
            setCustomerId(e.target.value);
            setError('');
          }}
          disabled={disabled || isLoading}
          error={error}
          className="min-w-[280px]"
        />
      </div>
      <Button
        onClick={handleFetch}
        disabled={disabled || isLoading || !customerId.trim()}
        variant="secondary"
        size="md"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Fetching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Fetch History
          </>
        )}
      </Button>
    </div>
  );
}
