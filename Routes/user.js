const express = require("express");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware.js");

const WrapAsync = require('../utils/Wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const UserController = require("../controllers/user.js");

router.get("/signup", UserController.rendersignup);

router.post("/signup", WrapAsync(UserController.postsignup));

router.get("/login", saveRedirectUrl, UserController.renderlogin);

router.post("/login", saveRedirectUrl, UserController.postlogin);

// logout
router.get("/logout", UserController.renderlogout);

module.exports = router;