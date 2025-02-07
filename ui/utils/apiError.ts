import type { AxiosError } from "axios";
import { isAxiosError } from "axios";

export type ApiError = {
  error: string;
  message?: string;
  statusCode: number;
};

export const getErrorMessage = <T extends ApiError = ApiError>
  (error: Error | AxiosError<T> | null, message?: string): string | null => {
  if (!error) {
    return null;
  }

  if (isAxiosError<T>(error)) {
    return error.response?.data.message ?? message ?? error.message;
  }

  return error.message ?? message;
};



export type ErrorData = {
  errors: Record<string, string>;
};

export type DetailedApiError = ApiError & {
  name: string;
  data?: ErrorData;
};

export function getDetailedErrorMessage<T extends DetailedApiError = DetailedApiError>(
  error: Error | AxiosError<T> | null,
  defaultMessage = "Une erreur est survenue"
): Record<string, string> | null {
  if (error === null) {
    return null;
  }

  if (isAxiosError<T>(error)) {
    const responseData = error.response?.data;

    if (responseData?.data?.errors) {
      return responseData.data.errors;
    }

    return { message: responseData?.message ?? defaultMessage };
  }

  return  { message: error.message ?? defaultMessage};
}
