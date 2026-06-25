const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("./user")

const ReviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model('Review', ReviewSchema); 