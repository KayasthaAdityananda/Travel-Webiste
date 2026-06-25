const Listing = require("../models/listing");

module.exports.Index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
};

module.exports.Show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Does not exist");
        return res.redirect("/listings");
    }

    res.render('listings/show.ejs', { listing });
};

module.exports.Create = async (req, res, next) =>
    {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing added!");
        res.redirect("/listings");
    };

module.exports.Edit = async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.Update = async (req, res) => {
    let { id } = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
};

module.exports.Delete = async (req, res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted", "Deleted a listing");
    res.redirect("/listings");
};

module.exports.New = (req, res) => {
    res.render('listings/new.ejs');
};