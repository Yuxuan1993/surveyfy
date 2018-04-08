var mongoose = require("mongoose")

// Setting a Schema and Model
var surveySchema = new mongoose.Schema({
    name: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, 
        username: String,
        firstName: String
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
})

module.exports = mongoose.model("Survey", surveySchema)