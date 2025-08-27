/**
 * API utility functions for handling API responses and errors
 */
import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * Standard API response interface
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  success: boolean;
}

/**
 * Format an API error into a standardized error message
 * @param error - The error object from an API call
 * @returns Formatted error message
 */
export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Handle specific status codes
    if (axiosError.response) {
      const status = axiosError.response.status;
      
      // Get error message from response if available
      const errorMessage = axiosError.response.data && 
        typeof axiosError.response.data === 'object' && 
        'message' in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : null;
      
      if (status === 401) {
        return errorMessage || 'You are not authorized to perform this action. Please log in again.';
      } else if (status === 403) {
        return errorMessage || 'You do not have permission to access this resource.';
      } else if (status === 404) {
        return errorMessage || 'The requested resource was not found.';
      } else if (status === 422) {
        return errorMessage || 'The provided data is invalid.';
      } else if (status >= 500) {
        return errorMessage || 'A server error occurred. Please try again later.';
      }
      
      return errorMessage || axiosError.message || 'An error occurred while processing your request.';
    }
    
    // Network errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'The request timed out. Please check your internet connection and try again.';
    }
    
    if (axiosError.code === 'ERR_NETWORK') {
      return 'A network error occurred. Please check your internet connection and try again.';
    }
    
    return axiosError.message || 'An error occurred while processing your request.';
  }
  
  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred.';
};

/**
 * Process an API response into a standardized format
 * @param response - The response object from an API call
 * @returns Standardized API response
 */
export const processApiResponse = <T>(response: AxiosResponse<T>): ApiResponse<T> => {
  return {
    data: response.data,
    error: null,
    status: response.status,
    success: true
  };
};

/**
 * Process an API error into a standardized format
 * @param error - The error object from an API call
 * @returns Standardized API response with error information
 */
export const processApiError = <T>(error: unknown): ApiResponse<T> => {
  const errorMessage = formatApiError(error);
  let status = 500;
  
  if (axios.isAxiosError(error) && error.response) {
    status = error.response.status;
  }
  
  return {
    data: null,
    error: errorMessage,
    status,
    success: false
  };
};

/**
 * Handle an API call and return a standardized response
 * @param apiCall - Promise from an API call
 * @returns Standardized API response
 */
export const handleApiCall = async <T>(apiCall: Promise<AxiosResponse<T>>): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall;
    return processApiResponse(response);
  } catch (error) {
    return processApiError<T>(error);
  }
};