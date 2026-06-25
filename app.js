const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./Routes/listing.js")
const reviewsRouter = require("./Routes/Review.js")
const userRouter = require("./Routes/user.js")

const MongoURI = 'mongodb://localhost:27017/Just_A_DB';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(MongoURI);
}

app.use(cookieParser("secret"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    
    //cookies Options
    cookie: {
        expires:new Date(Date.now() + 7*24*60*60*1000),
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req, res) =>{
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let userr = await User.register(fakeuser, "helloworld");
//     res.send(userr);
// })


// Logger - MiddleWare
app.use((req, res, next) =>{
    req.responseTime = new Date(Date.now()).toString();
    console.log(req.method, req.path, req.responseTime, req.hostname);
    next();
})


app.get(
  "/.well-known/appspecific/com.chrome.devtools.json",
  (req,res)=>{
      res.status(204).end();
  }
);

// //Cookies
// app.get("/setcookies", (req, res) => {
//     res.cookie("greet", "hello");
//     res.cookie("mode", "dark");
//     res.send("Cookies sent!");
// });


//Signed cookies
app.get("/getsignedcookie", (req, res ) =>{
    res.cookie("color", "red", { signed: true });
    res.send("done!");
});

app.get("/verify", (req, res) =>{
    // console.log(req.cookies);
    console.log(req.signedCookies);
    res.send("Verified")
} )

app.get('/', (req, res) => {
    res.render("listings/Home.ejs");
});

app.use("/listings", listingsRouter);

//id stays in app.js  to extend to Review.js we use merge parameters
app.use("/listings/:id/reviews", reviewsRouter);

app.use("/user", userRouter);

//Non existing routes | 404 Error
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
});

//Error Handler | for ex - Listings/poke | Other errors too
app.use((err, req, res ,next) => {
    let { message, statusCode = 500} = err;
    res.status(statusCode).render("error.ejs", { message }); // Render the error page with error details
    console.log(err.stack); // Log the error stack trace for debugging

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});