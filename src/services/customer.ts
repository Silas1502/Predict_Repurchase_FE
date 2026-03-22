import axios, { AxiosError } from 'axios';
import { CustomerHistoryResponse, RawTransaction } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    const message = (error.response.data as { message?: string })?.message || `Error: ${error.response.status}`;
    throw new Error(message);
  } else if (error.request) {
    throw new Error('Network error. Please check your connection.');
  } else {
    throw new Error(error.message || 'An unexpected error occurred.');
  }
};

/** GET /customers/{id}/history - Lấy lịch sử giao dịch của khách hàng từ Supabase */
export const fetchCustomerHistory = async (
  customerId: string
): Promise<CustomerHistoryResponse> => {
  try {
    const response = await apiClient.get(`/customers/${customerId}/history`);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};
