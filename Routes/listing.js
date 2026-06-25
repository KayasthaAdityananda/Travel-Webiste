const express = require("express");
const Listing = require('../models/listing.js');
const WrapAsync = require('../utils/Wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const router = express.Router();
const { Isloggedin, isOwner, validateListing } = require("../middleware.js")

//Index Route
router.get("/", WrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}));

//New Route
//kept above 
router.get('/new', Isloggedin, (req, res) => {
    res.render('listings/new.ejs');
});

//Show Route 
router.get('/:id', WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Does not exist");
        return res.redirect("/listings");
    }

    res.render('listings/show.ejs', { listing });
}));

//Create Route
router.post("/", Isloggedin, validateListing, WrapAsync(async (req, res, next) =>
    {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing added!");
        res.redirect("/listings");
    }));

//Edit Route
router.get("/:id/edit", Isloggedin, isOwner, WrapAsync(async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Update Route 
router.put("/:id", isOwner, validateListing, WrapAsync(async (req, res) => {
    let { id } = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

//Delete
router.delete("/:id", Isloggedin, isOwner, WrapAsync(async (req, res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted", "Deleted a listing");
    res.redirect("/listings");
}));

module.exports = router;