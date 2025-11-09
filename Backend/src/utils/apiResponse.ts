import { Response } from 'express';

export class ApiResponse<T = any> {
  public statusCode: number;
  public success: boolean;
  public message: string;
  public data: T | null;

  constructor(statusCode: number, data: T | null = null, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static success<T>(res: Response, data: T = null as T, message: string = "Success", statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data
    });
  }

  static error(res: Response, message: string = "Error", statusCode: number = 500, errors: any[] = []) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors
    });
  }

  static paginated<T>(res: Response, data: T, pagination: any, message: string = "Success") {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
      pagination
    });
  }
}
