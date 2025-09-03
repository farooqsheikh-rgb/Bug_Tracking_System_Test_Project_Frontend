export interface APIErrorResponse {
  message?: string;
  error?: string;
}

export interface APIError {
  message?: string;
  response?: {
    data?: APIErrorResponse;
    status?: number;
  };
}
