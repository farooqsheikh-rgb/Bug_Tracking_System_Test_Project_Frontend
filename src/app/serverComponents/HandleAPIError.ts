import { NextResponse } from 'next/server';
import type { APIError } from '../../type/Error';

interface HandleApiErrorOptions {
  error: unknown;
  fallbackMessage: string;
}

export function handleApiError({ error, fallbackMessage }: HandleApiErrorOptions) {
  const err = error as APIError;

  console.error('Handled API Error:', {
    message: err.message,
    status: err.response?.status,
    data: err.response?.data,
    fullError: error,
  });

  const errorMessage =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    fallbackMessage;

  const statusCode = err.response?.status || 500;

  return NextResponse.json(
    { success: false, error: errorMessage },
    { status: statusCode }
  );
}
