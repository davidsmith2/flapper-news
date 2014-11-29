var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    post: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});

mongoose.model('Comment', CommentSchema);
