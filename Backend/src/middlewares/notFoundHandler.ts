import ApiError from "../utils/apierror";

export const NotFoundError = (error?: Partial<ApiError>): ApiError => {
  const statusCode = error?.statusCode ?? 404;
  const message = error?.message ?? "Resource not found";

  return new ApiError(statusCode, message);
};
