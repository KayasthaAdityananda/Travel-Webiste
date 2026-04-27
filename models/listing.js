const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
            "https://imgs.search.brave.com/ZXhCXAGR0ZVyzYXyfz4cZDKdRf09f_kytK8vi3VCevE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9saWdo/dGhvdXNlLW5hc3Nh/dS1iYWhhbWFzLTE3/MTY5NjM0LmpwZw",
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
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;