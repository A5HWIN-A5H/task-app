export class ApiError extends Error {
  public statusCode: number;
  public errors?: Array<{ field: string; message: string }>;

  constructor(statusCode: number, message: string, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg: string, errors?: Array<{ field: string; message: string }>) {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg: string = 'Unauthorized') {
    return new ApiError(401, msg);
  }

  static forbidden(msg: string = 'Forbidden') {
    return new ApiError(403, msg);
  }

  static notFound(msg: string = 'Resource not found') {
    return new ApiError(404, msg);
  }

  static conflict(msg: string) {
    return new ApiError(409, msg);
  }

  static internal(msg: string = 'Internal Server Error') {
    return new ApiError(500, msg);
  }
}