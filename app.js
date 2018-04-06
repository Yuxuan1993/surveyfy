var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Survey          = require("./models/survey"), 
    seedDB          = require("./seeds")

// Setting and Connecting Database
mongoose.connect("mongodb://localhost/surveyfy_db")

seedDB()

// Setting up ejs folder access
app.set("view engine", "ejs")

// Use of Body Parser 
app.use(bodyParser.urlencoded({extended: true}))

// Setting public directory
app.use(express.static(__dirname + "/public"));



// Routes

// Index - Route for Index page
app.get("/", function(req, res) {
    // Get all features surveys from database
    Survey.find({}, function(error, allSurveys) {
        if (error) {
            console.log(error)
        } else {
            res.render("home", {surveys: allSurveys})
        }
    })
})

// Display - Route for Surveys
app.get("/surveys", function(req, res) {
    // Get all surveys from database
    Survey.find({}, function(error, allSurveys) {
        if (error) {
            console.log(error)
        } else {
            res.render("index", {surveys: allSurveys})
        }
    })
    
})

// Create - Route for Creating Surveys
app.post("/surveys", function(req, res) {
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
app.get("/surveys/new", function(req, res) {
    res.render("new")
})

// Show Survey - Route for displaying a individual Survey
app.get("/surveys/:id", function(req, res) {
    Survey.findById(req.params.id).populate("questions").exec( function(error, foundSurvey) {
        if (error) {
            console.log(error)
        } else {
            res.render("show", {survey: foundSurvey})
        }
    })
    
})

// About - Route for About
app.get("/about", function(req, res) {
    res.render("about")
})





// For starting a node client server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Surveyfy Server Started")
})