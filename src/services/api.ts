import axios, { AxiosError } from 'axios';
import {
  ApiResponse,
  PredictRequest,
  PredictResponse,
  ApplicationsListResponse,
  ApplicationLog,
  PaginationParams,
  HealthCheckResponse,
  ModelInfoResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Error handler helper
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

// Health check - Backend trả về HealthCheckResponse trực tiếp
export const checkHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

/** POST /predict - Dự báo khả năng mua lại và lưu vào Supabase */
export const predictRepurchase = async (
  data: PredictRequest
): Promise<PredictResponse> => {
  try {
    const response = await apiClient.post('/predict', data);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

/** GET /applications - Lấy lịch sử dự báo với pagination */
export const getPredictionHistory = async (
  params?: PaginationParams
): Promise<ApplicationsListResponse> => {
  try {
    const response = await apiClient.get('/applications', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

/** GET /applications/{id} - Lấy chi tiết một lượt dự báo */
export const getPredictionById = async (
  id: string
): Promise<ApiResponse<ApplicationLog>> => {
  try {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

/** GET /model-info - Thông tin về model */
export const getModelInfo = async (): Promise<ModelInfoResponse> => {
  try {
    const response = await apiClient.get('/model-info');
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};
