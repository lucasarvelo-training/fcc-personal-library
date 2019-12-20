const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {type: String, required: true},
  comments: {type:Array, default: []},
  commentcount: {type: Number, default: 0}
})

module.exports = mongoose.model('Book', bookSchema);

