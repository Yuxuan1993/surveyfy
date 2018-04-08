var express = require("express")
var router  = express.Router()
var Survey  = require("../models/survey")

// Display - Route for Surveys
router.get("/", isLoggedIn,function(req, res) {
    // Get all surveys from database
    Survey.find({}, function(error, allSurveys) {
        if (error) {
            console.log(error)
        } else {
            res.render("surveys/index", {surveys: allSurveys})
        }
    })
    
})

// Create - Route for Creating Surveys
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name
    var description = req.body.description
    var newSurvey = {name: name, description: description}
    
    // Create a new survey and save
    Survey.create(newSurvey, function(error, newSurveyCreated) {
        if (error) {
            console.log(error)
        } else {
            // redirecting to surveys
            res.redirect("/surveys")
        }
    })
    
})

// Survey Form - Route for Survey form
router.get("/new", isLoggedIn, function(req, res) {
    res.render("surveys/new")
})

// Show Survey - Route for displaying a individual Survey
router.get("/:id", isLoggedIn, function(req, res) {
    Survey.findById(req.params.id).populate("questions").exec( function(error, foundSurvey) {
        if (error) {
            console.log(error)
        } else {
            res.render("surveys/show", {survey: foundSurvey})
        }
    })
    
})

// Middleware

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
}

module.exports = router