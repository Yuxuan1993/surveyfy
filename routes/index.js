var express = require("express")
var router  = express.Router()
var passport = require("passport")
var User    = require("../models/user")
var Survey  = require("../models/survey")

// Routes

// Index - Route for Index page
router.get("/", function(req, res) {
    // Get all features surveys from database
    Survey.find({}, function(error, allSurveys) {
        if (error) {
            console.log(error)
        } else {
            res.render("home", {surveys: allSurveys})
        }
    })
})



// About - Route for About
router.get("/about", function(req, res) {
    res.render("about")
})



// AUTHENTICATION - Routes

// Registration Form
router.get("/register", function(req, res) {
    res.render("register")
})

router.post("/register", function(req, res) {
    var newUser = new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            
            req.flash("error", err.message);
            return res.redirect("/register");
        } else { // authentication of the user
            passport.authenticate("local") (req, res, function(){
                req.flash("success", "Welcome to Surveyfy, " + user.firstName + ".")
                res.redirect("/surveys")
            })
        }
    })
})

// Login Form
router.get("/login", function(req, res) {
    res.render("login")
})

// POST - Login
// passport.authenticate() - is the middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/surveys",
    failureRedirect: "/login"
}),function(req, res) {
})

// Logout - route
router.get("/logout", function(req, res) {
    req.logout()
    req.flash("success", "Logged Out")
    res.redirect("/")
})



module.exports = router