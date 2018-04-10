var express = require("express")
var router  = express.Router()
var Survey  = require("../models/survey")
var middleware = require("../middleware/index") // "../middleware" is fine coz of index.js has a special value for node 

// Display - Route for Surveys
router.get("/", middleware.isLoggedIn,function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name
    var description = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username,
        firstName: req.user.firstName
    }
    
    
    var newSurvey = {name: name, description: description, author: author}
    
    
    
    // newSurvey.author.id = req.user._id
    // newSurvey.author.username = req.user.username
    // newSurvey.author.firstName = req.user.firstName
    
    
    
    // Create a new survey and save
    Survey.create(newSurvey, function(error, newSurveyCreated) {
        if (error) {
            console.log(error)
        } else {
            // redirecting to surveys
            console.log(newSurveyCreated)
            res.redirect("/surveys")
        }
    })
    
})

// Survey Form - Route for Survey form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("surveys/new")
})

// Show Survey - Route for displaying a individual Survey
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Survey.findById(req.params.id).populate("questions").exec( function(error, foundSurvey) {
        if (error) {
            console.log(error)
        } else {
            res.render("surveys/show", {survey: foundSurvey})
        }
    })
    
})

// EDIT - Survey Edit Route
router.get("/:id/edit", middleware.checkSurveyOwnership, function(req, res) {

    Survey.findById(req.params.id, function(err, foundSurvey) {
        res.render("surveys/edit", {survey: foundSurvey})
    })
})

// UPDATE - Survey Update Route
router.put("/:id", middleware.checkSurveyOwnership, function(req, res) {
    // find and update survey
    
    Survey.findByIdAndUpdate(req.params.id, req.body.survey, function(err, updatedSurvey){
        if(err) {
            
            res.redirect("/surveys");
        } else {
            res.redirect("/surveys/" + req.params.id); // we can use updatedSurvey._id
        }
    })
})

// DELETE - Survye Delete Route
router.delete("/:id", middleware.checkSurveyOwnership, function(req, res) {
    Survey.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err)
            res.redirect("/surveys")
        } else {
            res.redirect("/surveys")
        }
    })
})




module.exports = router