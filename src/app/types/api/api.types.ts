export interface Pagination {
  page: number;
  limit: number;
  totalItems?: number;
  total?: number;
  totalPages: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface SuccessResponse {
  message: string;
  count?: number;
}

export interface ErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ErrorResponse {
  error: ErrorDetail;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
