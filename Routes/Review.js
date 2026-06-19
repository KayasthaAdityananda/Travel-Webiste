const express = require("express");
const router = express.Router({mergeParams: true});

const WrapAsync = require('../utils/Wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');

const Listing = require('../models/listing.js');
const Review = require("../models/Review.js")

const { ReviewSchema } = require("../Schema.js");

const validateReview = (req, res, next) => {
        // Validation of schema (Using Joi) 
        
        let {error} = ReviewSchema.validate(req.body);
        if(error) {
            let errorMessage = error.details.map((el) => el.message).join(", ");
            throw new ExpressError(errorMessage, 400);
        } else {
            next();
        }
};

//Post Route
router.post("/", validateReview, WrapAsync(async(req,res) =>{
    
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.Review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
//$Pull operator removes from an existing array all instances of a value or values that match a specified condition
router.delete("/:reviewId", WrapAsync(async (req, res) =>{
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;