const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const WrapAsync = require('./utils/Wrapasync.js');
const ExpressError = require('./utils/ExpressError.js');
const listingSchema = require('./Schema.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const MongoURI = 'mongodb://localhost:27017/Just_A_DB';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(MongoURI);
}

//Logger - MiddleWare
app.use((req, res, next) =>{
    req.responseTime = new Date(Date.now()).toString();
    console.log(req.method, req.path, req.responseTime, req.hostname);
    next();
})

app.get('/', (req, res) => {
    res.render("listings/Home.ejs");
});

// Validation for scheme (middleware) - moved to Mongoose Schema

const validateListing = (req, res, next) => {
        // Validation of schema (Using Joi) 
        
        let { error } = listingSchema.validate(req.body);
        if(error) {
            let errorMessage = error.details.map((el) => el.message).join(", ");
            throw new ExpressError(errorMessage, 400);
        } else {
            next();
        }
}

// app.get('/testListings', async (req, res) => {

//     let sampleListing = new Listing({
//         title: 'Sample Listing',
//         description: 'This is a sample listing for testing purposes.',
//         image: '', // This will trigger the default image URL
//         price: 100,
//         location: 'Sample Location',
//         country: 'Sample Country'
//     });

//     await sampleListing.save();
//     res.send('Sample listing created and saved to the database!');
    
// });

//Index Route
app.get("/listings", WrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}));

//New Route
//kept above 
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs'); 
});

//Show Route 
app.get('/listings/:id', WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
}));

//Create Route
app.post("/listings", validateListing, WrapAsync(async (req, res, next) =>
    {
        // Validations - Moved to Mongoose Schema
        // if(!req.body.listing) {
        //     throw new ExpressError("Invalid Listing Data!", 400);
        // }

        const newListing = new Listing(req.body.listing);

        // // Validations - Moved to Mongoose Schema
        // if(!newListing.title ) {
        //     throw new ExpressError("Please fill in the title!", 400);
        // }
        // if(!newListing.description ) {
        //     throw new ExpressError("Please fill in the description!", 400);
        // }
        // if(!newListing.price ) {
        //     throw new ExpressError("Please fill in the price!", 400);
        // }
        // if(!newListing.location ) {
        //     throw new ExpressError("Please fill in the location!", 400);
        // }
        // if(!newListing.country ) {
        //     throw new ExpressError("Please fill in the country!", 400);
        // }

        await newListing.save();
        res.redirect("/listings");
    }));

//Edit Route
app.get("/listings/:id/edit", WrapAsync(async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route 
app.put("/listings/:id", validateListing, WrapAsync(async (req, res) => {
    let { id } = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

//Delete
app.get("/listing/:id", WrapAsync(async (req, res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Non existing routes | 404 Error
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
    console.log("___________404 Error___________")
});

//Error Handler | for ex - Listings/poke | Other errors too
app.use((err, req, res ,next) => {
    let { message, statusCode = 500} = err;
    console.log("___________ERROR___________")
    res.status(statusCode).render("error.ejs", { message }); // Render the error page with error details
    // console.log(err.stack); // Log the error stack trace for debugging

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
 



// ### Middleware

// # Logger Middleware

// app.use((req,res,next)=>{

// Purpose:

// Logs requests
// Runs before routes
// Flow
// Request
//    ↓
// Logger
//    ↓
// Route
// next()
// next();

// Meaning:

// Continue to next middleware/route

// Without it:

// Request hangs forever
// 4. CRUD Routes
// Index Route
// GET /listings

// Purpose:

// Show all listings

// Database:

// Listing.find({})
// New Route
// GET /listings/new

// Purpose:

// Show form
// Show Route
// GET /listings/:id

// Purpose:

// Show one listing
// Create Route
// POST /listings

// Purpose:

// Create new listing
// Validation
// if(!req.body.listing)

// Checks:

// Did form send listing data?
// Throwing Error
// throw new ExpressError(
//     "Invalid Listing Data!",
//     400
// );

// Purpose:

// Stop execution
// Raise custom error
// Edit Route
// GET /listings/:id/edit

// Purpose:

// Show edit form
// Update Route
// PUT /listings/:id

// Purpose:

// Update existing listing

// Database:

// findByIdAndUpdate()
// Delete Route
// GET /listing/:id

// ⚠️ Not RESTful.

// Usually:

// DELETE /listings/:id
// 5. 404 Handling
// app.use((req,res,next)=>{

// Purpose:

// Catch unmatched routes

// Example:

// /listings/poke123
// /random
// /abc
// Flow
// Route Not Found
//       ↓
// ExpressError(404)
//       ↓
// Error Middleware
// Custom Error
// next(
//    new ExpressError(
//       "Page Not Found!",
//       404
//    )
// );
// 6. Error Middleware
// app.use((err,req,res,next)=>{

// Special middleware.

// Recognized because it has:

// (err, req, res, next)

// 4 parameters.

// Purpose

// Central location for all errors.

// Flow
// Error
//    ↓
// next(err)
//    ↓
// Error Middleware
//    ↓
// Response
// Destructuring
// let {
//     message,
//     statusCode = 500
// } = err;
// Meaning

// If error lacks:

// statusCode

// use:

// 500
// Rendering Error Page
// res
//  .status(statusCode)
//  .render("error.ejs", { message });

// Purpose:

// Display user-friendly error page

// instead of:

// Server crash
// 7. Error Handling Architecture
// Request
//    ↓
// Route
//    ↓
// Database
//    ↓
// Error?
//    ↓
// throw / reject
//    ↓
// WrapAsync
//    ↓
// next(err)
//    ↓
// Error Middleware
//    ↓
// error.ejs
// Important Concepts Learned
// throw
// Create and raise an error
// catch
// Handle an error
// next(err)
// Send error to Express
// WrapAsync
// Automatically forwards async errors
// ExpressError
// Custom error object
// (status code + message)
// Error Middleware
// Centralized error handling


// ---

// # 1. Why create a custom `ExpressError`?

// ### Problem

// Normal errors only contain:

// ```js
// throw new Error("Listing not found");
// ```

// Result:

// ```js
// {
//    message: "Listing not found"
// }
// ```

// No status code.

// ---

// ### Solution

// Create:

// ```js
// throw new ExpressError(
//     "Listing not found",
//     404
// );
// ```

// Result:

// ```js
// {
//    message: "Listing not found",
//    statusCode: 404
// }
// ```

// Now the error middleware knows:

// ```text
// 404 → Not Found
// 400 → Bad Request
// 500 → Server Error
// ```

// ### Key Idea

// ```text
// ExpressError
//     =
// Error + HTTP Status Code
// ```

// ---

// # 2. What problem does `WrapAsync` solve?

// ### Problem

// Async routes return Promises.

// ```js
// app.get("/", async(req,res)=>{
//    ...
// });
// ```

// If:

// ```js
// await Listing.findById("badID")
// ```

// fails,

// the Promise rejects.

// Without handling:

// ```text
// Unhandled Promise Rejection
// ```

// ---

// ### Traditional Solution

// ```js
// try{
//    ...
// }
// catch(err){
//    next(err);
// }
// ```

// inside every route.

// ---

// ### WrapAsync

// Automatically does:

// ```text
// try
//  ↓
// error
//  ↓
// next(err)
// ```

// for every route.

// ### Key Idea

// ```text
// WrapAsync
//      =
// Automatic try/catch
// ```

// ---

// # 3. What does `next(err)` do?

// ### Normal next

// ```js
// next();
// ```

// means:

// ```text
// Go to next middleware
// ```

// ---

// ### Error next

// ```js
// next(err);
// ```

// means:

// ```text
// Skip normal middleware
//       ↓
// Go directly to
// Error Middleware
// ```

// Flow:

// ```text
// Error
//   ↓
// next(err)
//   ↓
// Error Handler
// ```

// ---

// # 4. Why does error middleware require 4 parameters?

// Normal middleware:

// ```js
// (req,res,next)
// ```

// Error middleware:

// ```js
// (err,req,res,next)
// ```

// Express uses this to identify it.

// ---

// If Express sees:

// ```js
// (err, req, res, next)
// ```

// it knows:

// ```text
// This middleware handles errors
// ```

// ---

// ### Key Idea

// ```text
// 4 parameters
//       ↓
// Express recognizes
// Error Middleware
// ```

// ---

// # 5. Difference between `throw` and `next(err)`?

// They are related but not identical.

// ---

// ## throw

// Creates/Raises an error.

// ```js
// throw new ExpressError(
//    "Invalid Data",
//    400
// );
// ```

// Meaning:

// ```text
// Something went wrong
// ```

// ---

// ## next(err)

// Passes an existing error to Express.

// ```js
// next(err);
// ```

// Meaning:

// ```text
// Handle this error
// ```

// ---

// Flow:

// ```text
// throw
//    ↓
// Error Object Created
//    ↓
// next(err)
//    ↓
// Error Middleware
// ```

// ---

// ### Mental Model

// ```text
// throw
//  =
// Create Error

// next(err)
//  =
// Send Error to Express
// ```

// ---

// # 6. Why use a 404 middleware at the end?

// Suppose:

// ```text
// /listings
// ```

// matches a route.

// Good.

// ---

// Suppose:

// ```text
// /pokemon
// ```

// matches nothing.

// Without 404 middleware:

// ```text
// Request hangs
// or
// Generic Express response
// ```

// ---

// With:

// ```js
// app.use((req,res,next)=>{
//    next(
//       new ExpressError(
//          "Page Not Found",
//          404
//       )
//    );
// });
// ```

// Every unmatched request becomes:

// ```text
// 404 Page Not Found
// ```

// ---

// ### Why at the end?

// Because Express checks routes top-to-bottom.

// ```text
// Route 1
// Route 2
// Route 3
// 404 Handler
// ```

// If placed first:

// ```text
// Everything becomes 404
// ```

// ---

// # 7. Why do async routes need special error handling?

// ### Synchronous Error

// ```js
// app.get("/", (req,res)=>{
//     throw new Error("Boom");
// });
// ```

// Express catches it automatically.

// ---

// ### Async Error

// ```js
// app.get("/", async(req,res)=>{
//     await something();
// });
// ```

// If:

// ```js
// await something()
// ```

// fails,

// the Promise rejects.

// Express 4 couldn't catch that automatically.

// ---

// Hence:

// ```js
// try{
//    ...
// }
// catch(err){
//    next(err);
// }
// ```

// or

// ```js
// WrapAsync(...)
// ```

// ---

// ### Modern Note

// You're using:

// ```json
// "express": "^5.2.1"
// ```

// Express 5 catches many async errors automatically.

// But `WrapAsync` is still commonly used because:

// * Older tutorials use it
// * Many production codebases use it
// * Makes error flow explicit

// ---

// # Complete Error Flow

// ```text
// User Request
//       ↓
// Route
//       ↓
// Problem?
//       ↓
// throw Error
//       ↓
// WrapAsync
//       ↓
// next(err)
//       ↓
// Error Middleware
//       ↓
// error.ejs
//       ↓
// User sees friendly error page
// ```

// If you understand this diagram, you've basically understood Express error handling at a conceptual level.