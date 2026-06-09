module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// ### WrapAsync
// module.exports = (fn) => {
//     return (req,res,next)=>{
//         fn(req,res,next).catch(next);
//     };
// };
// Purpose

// Automatically catches async errors.

// Without it:

// try{
//    ...
// }
// catch(err){
//    next(err);
// }

// must be written everywhere.

// Problem It Solves

// Async routes return Promises.

// await Listing.findById(id)

// can fail.

// Without handling:

// Promise Rejection
// Flow
// Async Route
//       ↓
// Error occurs
//       ↓
// Promise rejects
//       ↓
// .catch(next)
//       ↓
// Error Middleware
// Usage
// app.get(
//    "/listings",
//    WrapAsync(async(req,res)=>{
//       ...
//    })
// );
// Key Idea
// WrapAsync
//       ↓
// Automatic try/catch