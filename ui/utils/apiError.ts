import type { AxiosError } from "axios";
import { isAxiosError } from "axios";

type ApiError = {
  error: string;
  message?: string;
  statusCode: number;
};

export const getErrorMessage = (error: Error | AxiosError<ApiError> | null, message?: string): string | null => {
  if (!error) {
    return null;
  }

  if (isAxiosError<ApiError>(error)) {
    return error.response?.data.message ?? message ?? error.message;
  }

  return message ?? error.message;
};
