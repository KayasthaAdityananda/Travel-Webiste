const Listing = require("../models/listing");
const Review  = require("../models/Review");

module.exports.Post = async(req,res) =>{
    
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
};

module.exports.Delete = async (req, res) =>{
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    };