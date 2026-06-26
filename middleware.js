const Listing = require("./models/listing.js"); 
const Review = require("./models/Review.js");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, ReviewSchema } = require("./Schema.js");

let Isloggedin  =  (req, res, next) => {
    if(!req.isAuthenticated()){
        // console.log(req.user);

        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must log in to create a listing");
        return res.redirect("/user/login");
    }
    next();
}

let saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

let isOwner = async(req, res, next) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);

    let currUser = req.user;

    if(currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

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

let isAuthor = async(req, res, next) =>{
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = { Isloggedin, saveRedirectUrl, isOwner, validateListing, validateReview, isAuthor };