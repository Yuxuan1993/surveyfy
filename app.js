var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    Survey          = require("./models/survey"),
    Question        = require("./models/question"),
    seedDB          = require("./seeds")
    
// Routes access
var questionRoutes   = require("./routes/questions"),
    surveyRoutes     = require("./routes/surveys"),
    indexRoutes       = require("./routes/index")
    

// Setting and Connecting Database
mongoose.connect("mongodb://localhost/surveyfy_db")

// Providing or adding saved data.
// seedDB()

// Setting up ejs folder access
app.set("view engine", "ejs")

// Use of Body Parser 
app.use(bodyParser.urlencoded({extended: true}))

// Setting public directory
app.use(express.static(__dirname + "/public"));

// Setting method override for EDIT and UPDATE
app.use(methodOverride("_method"))

// Passport configuration for the web app
app.use(require("express-session")({
    secret: "This is a adapatable survey web app.", 
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // comes form passport-local-mongoose
passport.serializeUser(User.serializeUser()) // comes form passport-local-mongoose
passport.deserializeUser(User.deserializeUser()) // comes form passport-local-mongoose

// currentUser to app.js
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.use("/", indexRoutes)
app.use("/surveys", surveyRoutes)
app.use("/surveys/:id/questions", questionRoutes)



// For starting a node client server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Surveyfy Server Started")
})