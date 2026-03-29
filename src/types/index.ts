// TypeScript types matching 100% with Backend JSON Response
// Backend: backend/app/schemas.py

// ==========================================
// 1. TRANSACTION TYPES - Input Data (Online Retail Format)
// ==========================================

/** Một dòng giao dịch (order) - Online Retail data format */
export interface Transaction {
  order_id: string;
  total_items: number;
  log_items: number;
  order_date: string;
  order_value: number;
  canceled_value: number;
  order_n_categories: number;
  order_n_lines: number;
  is_canceled: number;
  country: string;
}

/** Request cho POST /predict */
export interface PredictRequest {
  customer_info: {
    customer_id: string;
    snapshot_date: string;
  };
  transactions: Transaction[];
}

/** Raw transaction từ GET /customers/{id}/history */
export interface RawTransaction {
  order_id: string;
  total_items: number;
  log_items: number;
  order_date: string;
  order_value: number;
  canceled_value: number;
  order_n_categories: number;
  order_n_lines: number;
  is_canceled: number;
  country: string;
}

// ==========================================
// 2. RESPONSE TYPES - API Outputs (khớp với Backend schemas.py)
// ==========================================

/** Top reason ảnh hưởng đến kết quả */
export interface TopReason {
  feature: string;
  importance_percent: number;
  value: number;
  impact?: 'positive' | 'negative';
}

/** Response từ POST /predict - PredictResponse */
export interface PredictResponse {
  success: boolean;
  customer_id: string;
  snapshot_date: string;
  probability: number;           // 0-1
  probability_percent: number;     // 0-100
  is_repurchase: boolean;
  potential_level: 'Nhóm Khách hàng Tự hành' | 'Nhóm Trọng tâm Tăng trưởng' | 'Nhóm Tối ưu Hóa Chi phí';
  threshold_used: number;
  top_reasons: TopReason[];
  prediction_id?: string;
  created_at?: string;
}

/** Response từ GET /customers/{id}/history - CustomerHistoryResponse */
export interface CustomerHistoryResponse {
  success: boolean;
  customer_id: string;
  count: number;
  transactions: RawTransaction[];
}

/** Một record trong lịch sử dự báo - ApplicationLog */
export interface ApplicationLog {
  id: string;
  customer_id: string;
  probability: number;
  is_repurchase: boolean;
  potential_level: 'Nhóm Khách hàng Tự hành' | 'Nhóm Trọng tâm Tăng trưởng' | 'Nhóm Tối ưu Hóa Chi phí';
  created_at: string;
}

/** Response từ GET /applications - ApplicationsListResponse */
export interface ApplicationsListResponse {
  success: boolean;
  count: number;
  page: number;
  page_size: number;
  data: ApplicationLog[];
}

/** Response từ GET /model-info - ModelInfoResponse */
export interface ModelInfoResponse {
  model_type: string;
  model_version: string;
  training_date?: string;
  threshold: number;
  total_features: number;
  feature_list: string[];
}

/** Response từ GET /health - HealthCheckResponse */
export interface HealthCheckResponse {
  status: string;
  model_loaded: boolean;
  preprocessor_loaded: boolean;
  database_connected: boolean;
  model_version?: string;
  threshold?: number;
}

// ==========================================
// 3. PAGINATION & API WRAPPERS
// ==========================================

/** Generic API Response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Pagination params */
export interface PaginationParams {
  page?: number;
  page_size?: number;  // Backend dùng 'page_size' không phải 'limit'
}

// ==========================================
// 4. LEGACY/DERIVED TYPES (for components)
// ==========================================

/** Input data structure (để hiển thị chi tiết) */
export interface InputData {
  transactions: Transaction[];
  snapshot_date: string;
}

/** Dữ liệu dự báo đầy đủ (cho component PredictResult) */
export interface PredictionData {
  id?: string;
  customer_id: string;
  input_data?: InputData;
  probability: number;
  probability_percent?: number;
  is_repurchase: boolean;
  potential_level: 'Nhóm Khách hàng Tự hành' | 'Nhóm Trọng tâm Tăng trưởng' | 'Nhóm Tối ưu Hóa Chi phí';
  top_reasons?: TopReason[];
  threshold_used?: number;
  prediction_id?: string;
  created_at?: string;
}

/** Log cho history page (alias của ApplicationLog) */
export interface PredictionLog extends ApplicationLog {}

/** Pagination response (frontend format) */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
