const express = require("express");
const router = express.Router({mergeParams: true});

const WrapAsync = require('../utils/Wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const Review = require("../models/Review.js");
const reviewController = require("../controllers/review.js");

const { Isloggedin, validateReview, saveRedirectUrl, isAuthor } = require("../middleware.js");

//Post Route
router.post("/", Isloggedin, saveRedirectUrl, validateReview, WrapAsync(reviewController.Post));

//Delete Route
//$Pull operator removes from an existing array all instances of a value or values that match a specified condition
router.delete("/:reviewId", Isloggedin, isAuthor, saveRedirectUrl, WrapAsync(reviewController.Delete));

module.exports = router;