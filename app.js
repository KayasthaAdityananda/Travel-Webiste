const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

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
    res.send('Hello, World!');
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

//Index Route
app.get("/listings", async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
});

//New Route
//kept above 
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

//Show Route 
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
});

//Create Route
app.post("/listings", async (req, res) =>{
    // method 1 - let { .,.,.,.,.,} = req.body;
    console.log(req.body);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update Route 
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});

//Delete
app.get("/listing/:id", async (req, res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//Error Handler
app.use((err, req, res ,next) => {
    console.error(err.stack)
    res.status(500).send("Invalid")
})

app.use((req, res) => {
    res.status(404).send("Page not found!");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});