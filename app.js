var express = require("express")
var app = express()
var bodyParser = require("body-parser")

// Setting up ejs folder access
app.set("view engine", "ejs")

// Use of Body Parser 
app.use(bodyParser.urlencoded({extended: true}))

// Setting public directory
app.use(express.static(__dirname + "/public"));

// Array data
var surveys = [
            {name: "Survey 1", description: "Description of Survey 1"},
            {name: "Survey 2", description: "Description of Survey 2"},
            {name: "Survey 3", description: "Description of Survey 3"},
        ]

// Routes

// Route for Index page
app.get("/", function(req, res) {
    res.render("index", {surveys: surveys})
})

// Route for Surveys
app.get("/surveys", function(req, res) {
        
    res.render("surveys", {surveys: surveys})
})

// Route for Creating Surveys
app.post("/surveys", function(req, res) {
    var name = req.body.name
    var description = req.body.description
    var newSurvey = {name: name, description: description}
    
    surveys.push(newSurvey)
    res.redirect("/surveys")
})

// Route for Survey form
app.get("/surveys/new", function(req, res) {
    res.render("new")
})

// Route for About
app.get("/about", function(req, res) {
    res.render("about")
})



// For starting a node client server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Surveyfy Server Started")
})