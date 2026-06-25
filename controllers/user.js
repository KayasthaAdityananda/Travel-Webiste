const User = require("../models/user.js");
const passport = require("passport");

module.exports.rendersignup = (req, res) => {
    res.render("users/signup.ejs")
};

module.exports.postsignup = async (req, res) => {
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
    };

module.exports.renderlogin = (req, res) =>{
    res.render("users/login.ejs")
}; 

module.exports.postlogin = [ passport.authenticate("local", { 
        failureRedirect: "/user/login", 
        failureFlash: true,
    }),
    async (req, res) =>{
        req.flash("success", "Welcome to Wanderlust!   You are logged in!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
];

module.exports.renderlogout = (req, res, next) => {
    req.logout((err) =>{
        if(err) {
            return next(err)
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};