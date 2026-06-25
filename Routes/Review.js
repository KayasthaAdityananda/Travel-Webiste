const express = require("express");
const router = express.Router({mergeParams: true});

const WrapAsync = require('../utils/Wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');

const Listing = require('../models/listing.js');
const Review = require("../models/Review.js");

const { Isloggedin, validateReview, saveRedirectUrl, isAuthor } = require("../middleware.js");

//Post Route
router.post("/", Isloggedin, saveRedirectUrl, validateReview, WrapAsync(async(req,res) =>{
    
    let id = req.params.id;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
    .populate("owner");
    
    let newReview = new Review(req.body.Review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
//$Pull operator removes from an existing array all instances of a value or values that match a specified condition
router.delete("/:reviewId", Isloggedin, isAuthor, saveRedirectUrl, WrapAsync(async (req, res) =>{
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;