class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err); // Prevent sending multiple responses
    }
  
    // Default values
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
    // Debug log
    console.error("❌ Error Middleware Triggered:", {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
    });
  
    // Handle specific MongoDB, JWT, etc. errors
    if (err.code === 11000) {
      err = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue)} Entered`, 400);
    }
  
    if (err.name === "JsonWebTokenError") {
      err = new ErrorHandler("JSON Web Token is invalid. Try again!", 400);
    }
  
    if (err.name === "TokenExpiredError") {
      err = new ErrorHandler("JSON Web Token has expired. Try again!", 400);
    }
  
    if (err.name === "CastError") {
      err = new ErrorHandler(`Invalid ${err.path}`, 400);
    }
  
    // Handle validation errors from Mongoose
    const errorMessage = err.errors
      ? Object.values(err.errors)
          .map((error) => error.message)
          .join(" ")
      : err.message;
  
    return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
    });
  };
  
  export default ErrorHandler;
  