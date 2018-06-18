var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  // `title` is required and of type String
  userText: {
    type: String
  },
 
  ArticleID: {
    type: Schema.Types.ObjectId,
    ref: "ArticleID"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Article model
module.exports = Note;