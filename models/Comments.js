var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    post: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});

CommentSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

CommentSchema.methods.downvote = function (cb) {
    this.upvotes -= 1;
    this.save(cb);
};

module.exports = mongoose.model('Comment', CommentSchema);
