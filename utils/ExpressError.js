class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;




// ### Custom Error Class (ExpressError)
// class ExpressError extends Error
// Purpose
// Create custom application errors.
// Attach both:
// Error message
// HTTP status code

// Instead of:

// throw new Error("Something went wrong");

// You can do:

// throw new ExpressError("Listing Not Found", 404);
// Inheritance
// class ExpressError extends Error
// Concept
// Error
//   ↑
// ExpressError

// Your class gets all built-in Error features:

// stack trace
// message
// error type
// Constructor
// constructor(message, statusCode)

// Stores:

// this.message
// this.statusCode
// Usage
// throw new ExpressError(
//     "Invalid Listing Data!",
//     400
// );

// Creates:

// {
//    message: "Invalid Listing Data!",
//    statusCode: 400
// }
// Key Idea
// ExpressError
//       ↓
// Custom Error Object
//       ↓
// Passed to Error Middleware