const express = require("express");
const Listing = require('../models/listing.js');
const WrapAsync = require('../utils/Wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require("../Schema.js");
const router = express.Router();

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
};

//Index Route
router.get("/", WrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}));

//New Route
//kept above 
router.get('/new', (req, res) => {
    res.render('listings/new.ejs'); 
});

//Show Route 
router.get('/:id', WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render('listings/show.ejs', { listing });
}));

//Create Route
router.post("/", validateListing, WrapAsync(async (req, res, next) =>
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
router.get("/:id/edit", WrapAsync(async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route 
router.put("/:id", validateListing, WrapAsync(async (req, res) => {
    let { id } = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

//Delete
router.get("/:id", WrapAsync(async (req, res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;