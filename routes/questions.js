var express = require("express")
var router  = express.Router({mergeParams: true}) // mergeParams used to merge questions together. so that ID can be accessed.
var Survey  = require("../models/survey")
var Question = require("../models/question")
var middleware = require("../middleware/index")

// QUESTION ROUTES

// QUESTION - Show Form to create questions
router.get("/new", middleware.isLoggedIn,function(req, res) {
    Survey.findById(req.params.id, function(err, survey) {
        if (err) {
            console.log(err)
        } else {
            res.render("questions/new", {survey, survey})
        }
    })
})

// QUESTION - Create add new question to survey
router.post("/", middleware.isLoggedIn, function(req, res) {
    Survey.findById(req.params.id, function(err, survey) {
        if (err) {
            console.log(err)
            res.redirect("/surveys")
        } else {
            // create new question
            Question.create(req.body.question, function(err, question) {
                if (err) {
                    req.flash("error", "The Create Operation not Successful.")
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
                    req.flash("success", "Successfully Saved.")
                    res.redirect("/surveys/" + survey._id)
                }
            })
        }
    })
})

// EDIT - Question Route Edit
router.get("/:question_id/edit", middleware.checkQuestionOwnership, function(req, res){
    Question.findById(req.params.question_id, function(err, foundQuestion) {
        if (err) {
            res.redirect("back")
        } else {
            res.render("questions/edit", {survey_id: req.params.id, question: foundQuestion})
        }
    })
   
});

// UPDATE - Question Route Update
router.put("/:question_id", middleware.checkQuestionOwnership, function(req, res) {
    Question.findByIdAndUpdate(req.params.question_id, req.body.question, function(err, updatedQuestion){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/surveys/" + req.params.id );
      }
   });
})

// DELETE - Question Route Delete
router.delete("/:question_id", middleware.checkQuestionOwnership, function(req, res) {
    // Find ID and Delete the question_id
    Question.findByIdAndRemove(req.params.question_id, function(err){
        if (err) {
            res.redirect("back")
        } else {
            req.flash("success", "Question Successfully Deleted")
            res.redirect("/surveys/" + req.params.id)
        }
    })
})






module.exports = router