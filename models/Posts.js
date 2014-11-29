var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

PostSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

PostSchema.methods.downvote = function (cb) {
    this.upvotes -= 1;
    this.save(cb);
};

module.exports = mongoose.model('Post', PostSchema);
