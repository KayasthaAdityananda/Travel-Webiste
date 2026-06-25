const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const WrapAsync = require('../utils/Wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
});

router.post("/signup", WrapAsync(async (req, res) => {
        try{
            let { username, email, password } = req.body;
            const newUser = new User({email, username});
            let RegisteredUser = await User.register(newUser, password);
            console.log(RegisteredUser);

            //Login after signUp
            req.login(RegisteredUser, (err) => {
                if(err) {
                    return next(err); 
                }
                req.flash("success", "Welcome to Wanderlust");
                res.redirect("/listings");
            })
            
        } catch(e) {
            req.flash("error", e.message);
            res.redirect("/user/signup");
        }
    })
);

router.get("/login", (req, res) =>{
    res.render("users/login.ejs")
});

router.post(
    "/login", 
    saveRedirectUrl,
    passport.authenticate("local", { 
        failureRedirect: "/user/login", 
        failureFlash: true,
    }),
    async (req, res) =>{
        req.flash("success", "Welcome to Wanderlust!   You are logged in!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

// logout
router.get("/logout", (req, res, next) => {
    req.logout((err) =>{
        if(err) {
            return next(err)
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
});

module.exports = router;