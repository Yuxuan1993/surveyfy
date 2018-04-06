var mongoose = require("mongoose")

var questionSchema = mongoose.Schema({
    text: String,
    author: String
})

module.exports = mongoose.model("Question", questionSchema)