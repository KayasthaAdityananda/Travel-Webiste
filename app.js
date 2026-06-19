const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const listings = require("./Routes/listing.js")
const reviews = require("./Routes/Review.js")

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

// //Logger - MiddleWare
// app.use((req, res, next) =>{
//     req.responseTime = new Date(Date.now()).toString();
//     console.log(req.method, req.path, req.responseTime, req.hostname);
//     next();
// })

app.get('/', (req, res) => {
    res.render("listings/Home.ejs");
});

app.use("/listings", listings);

//id stays in app.js  to extend to Review.js we use merge parameters
app.use("/listings/:id/reviews", reviews);

//Non existing routes | 404 Error
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
});

//Error Handler | for ex - Listings/poke | Other errors too
app.use((err, req, res ,next) => {
    let { message, statusCode = 500} = err;
    res.status(statusCode).render("error.ejs", { message }); // Render the error page with error details
    console.log(err.stack); // Log the error stack trace for debugging

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
 

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