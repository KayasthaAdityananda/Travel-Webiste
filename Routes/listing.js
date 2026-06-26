const express = require("express");
const Listing = require('../models/listing.js');
const WrapAsync = require('../utils/Wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const router = express.Router();
const { Isloggedin, isOwner, validateListing } = require("../middleware.js")
const ListingController = require("../controllers/listing.js");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router
    .route("/")
    .get(WrapAsync(ListingController.Index)) //Index
    // .post(
    //     Isloggedin,
    //     validateListing, 
    //     WrapAsync(ListingController.Create)
    // ); //Create
    .post( upload.single('listing[image][url]'), (req, res) => {
        res.send(req.file); 
    });

//New Route
//kept above 
router.get('/new', Isloggedin, ListingController.New);

router
.route("/:id")
.get(WrapAsync(ListingController.Show)) //Show
.put(isOwner, validateListing, WrapAsync(ListingController.Update)) //Update
.delete(Isloggedin, isOwner, WrapAsync(ListingController.Delete)); //Delete

//Edit Route
router.get("/:id/edit", Isloggedin, isOwner, WrapAsync(ListingController.Edit));

//Delete
router
module.exports = router;