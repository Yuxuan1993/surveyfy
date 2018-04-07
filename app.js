var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    Survey          = require("./models/survey"),
    Question        = require("./models/question"),
    seedDB          = require("./seeds")

// Setting and Connecting Database
mongoose.connect("mongodb://localhost/surveyfy_db")

// Providing or adding saved data.
seedDB()

// Setting up ejs folder access
app.set("view engine", "ejs")

// Use of Body Parser 
app.use(bodyParser.urlencoded({extended: true}))

// Setting public directory
app.use(express.static(__dirname + "/public"));

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
app.get("/surveys", isLoggedIn,function(req, res) {
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
app.post("/surveys", isLoggedIn, function(req, res) {
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
app.get("/surveys/new", isLoggedIn, function(req, res) {
    res.render("surveys/new")
})

// Show Survey - Route for displaying a individual Survey
app.get("/surveys/:id", isLoggedIn, function(req, res) {
    Survey.findById(req.params.id).populate("questions").exec( function(error, foundSurvey) {
        if (error) {
            console.log(error)
        } else {
            res.render("surveys/show", {survey: foundSurvey})
        }
    })
    
})

// About - Route for About
app.get("/about", function(req, res) {
    res.render("about")
})


// QUESTION ROUTES

// Show Form to create questions
app.get("/surveys/:id/questions/new", isLoggedIn,function(req, res) {
    Survey.findById(req.params.id, function(err, survey) {
        if (err) {
            console.log(err)
        } else {
            res.render("questions/new", {survey, survey})
        }
    })
})

// Create - add new question to survey
app.post("/surveys/:id/questions", isLoggedIn, function(req, res) {
    Survey.findById(req.params.id, function(err, survey) {
        if (err) {
            console.log(err)
            res.redirect("/surveys")
        } else {
            // create new question
            Question.create(req.body.question, function(err, question) {
                if (err) {
                    console.log(err)
                } else {
                    // add new question to survey
                    survey.questions.push(question)
                    survey.save()
                    // redirect to surveys page
                    res.redirect("/surveys/" + survey._id)
                }
            })
        }
    })
})

// AUTHENTICATION - Routes

// Registration Form
app.get("/register", function(req, res) {
    res.render("register")
})

app.post("/register", function(req, res) {
    var newUser = new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            return res.render("register")
        } else { // authentication of the user
            passport.authenticate("local") (req, res, function(){
                res.redirect("/surveys")
            })
        }
    })
})

// Login Form
app.get("/login", function(req, res) {
    res.render("login")
})

// POST - Login
// passport.authenticate() - is the middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/surveys",
    failureRedirect: "/login"
}),function(req, res) {
})

app.get("/logout", function(req, res) {
    req.logout()
    res.redirect("/")
})

// Middleware

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
}


// For starting a node client server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Surveyfy Server Started")
})