var mongoose = require("mongoose")

// Setting a Schema and Model
var surveySchema = new mongoose.Schema({
    name: String,
    description: String,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
})

module.exports = mongoose.model("Survey", surveySchema)