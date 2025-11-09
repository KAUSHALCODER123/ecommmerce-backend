class ApiError extends Error {
  public statusCode: number;
  public errors: any[];
  public success: boolean;
  public data: any;
    constructor(
   
    statusCode: number = 500,
     message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message); // properly call parent Error constructor

    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.data = null;

    // Ensure the message property is set (redundant but explicit)
    this.message = message;

    // Handle stack trace properly
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
