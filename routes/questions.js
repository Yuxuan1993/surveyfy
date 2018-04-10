var express = require("express")
var router  = express.Router({mergeParams: true}) // mergeParams used to merge questions together. so that ID can be accessed.
var Survey  = require("../models/survey")
var Question = require("../models/question")

// QUESTION ROUTES

// QUESTION - Show Form to create questions
router.get("/new", isLoggedIn,function(req, res) {
    Survey.findById(req.params.id, function(err, survey) {
        if (err) {
            console.log(err)
        } else {
            res.render("questions/new", {survey, survey})
        }
    })
})

// QUESTION - Create add new question to survey
router.post("/", isLoggedIn, function(req, res) {
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
                    // ADD - USERNAME & ID TO QUESTION
                    question.author.id = req.user._id
                    question.author.username = req.user.username
                    question.author.firstName = req.user.firstName
                     
                    // SAVE - question
                    question.save()
                    
                    survey.questions.push(question)
                    survey.save()
                    // redirect to surveys page
                    res.redirect("/surveys/" + survey._id)
                }
            })
        }
    })
})

// EDIT - Question Route
router.get("/:question_id/edit", function(req, res){
    Question.findById(req.params.question_id, function(err, foundQuestion) {
        if (err) {
            res.redirect("back")
        } else {
            res.render("questions/edit", {survey_id: req.params.id, question: foundQuestion})
        }
    })
   
});

// UPDATE - Questin Route
router.put("/:question_id", function(req, res) {
    Question.findByIdAndUpdate(req.params.question_id, req.body.question, function(err, updatedQuestion){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/surveys/" + req.params.id );
      }
   });
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