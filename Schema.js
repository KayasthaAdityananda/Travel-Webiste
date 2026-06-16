const Niggajoi = require('joi');

let listingSchema = Niggajoi.object({
    listing : Niggajoi.object({
        title: Niggajoi.string().required(),
        description: Niggajoi.string().required(),
        price: Niggajoi.number().required().min(0),
        location: Niggajoi.string().required(),
        country: Niggajoi.string().required(),
        image: Niggajoi.string().allow("", null)
    }).required()
}); 

module.exports = listingSchema;