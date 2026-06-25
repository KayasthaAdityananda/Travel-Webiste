const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./Review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
    url: {
        type: String,
        default:
            "https://imgs.search.brave.com/GV--ugAjGsLkNb5--0WZrkZpMoyimbN27bcm9ebGq-E/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDEwMzk4/NDg4LmpwZw",
        set: (v) =>
            v === ""
                ? "https://imgs.search.brave.com/ZXhCXAGR0ZVyzYXyfz4cZDKdRf09f_kytK8vi3VCevE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9saWdo/dGhvdXNlLW5hc3Nh/dS1iYWhhbWFzLTE3/MTY5NjM0LmpwZw"
                : v,
    },
},
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing) {
    await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;