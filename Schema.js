const Niggajoi = require('joi');

let listingSchema = Niggajoi.object({
    listing : Niggajoi.object({
        title: Niggajoi.string().required(),
        description: Niggajoi.string().required(),
        price: Niggajoi.number().required().min(0),
        location: Niggajoi.string().required(),
        country: Niggajoi.string().required(),
        image: Niggajoi.object({
                url: Niggajoi.string().allow("", null)
            })
    }).required()
}); 

let ReviewSchema = Niggajoi.object({
    Review: Niggajoi.object({
        rating: Niggajoi.number().required(),
        comment: Niggajoi.string().required()
    }).required()
})

module.exports = {
    listingSchema, 
    ReviewSchema
};