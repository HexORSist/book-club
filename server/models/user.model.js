var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect(process.env.MONGOLAB_URI);

var userSchema = new Schema({
  username: String,
  password: String,
  books: [{type: Schema.Types.ObjectId, ref: 'Book'}]
  }
);

var bookSchema = new Schema({
  bookid: {type:String, unique:true, required:true},
  imgURL: String,
  fortrade: Boolean
});

module.exports.user = mongoose.model('User', userSchema);
module.exports.book = mongoose.model('Book', bookSchema);