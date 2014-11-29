var mongoose = require('mongoose');
var Post = require('../models/Posts');
var Comment = require('../models/Comments');

module.exports = function (app) {
    app.get('/posts', function (req, res, next) {
        Post.find(function (err, posts) {
            if (err) {
                return next(err);
            }
            res.json(posts);
        });
    });
    app.post('/posts', function (req, res, next) {
        console.log(req.body)
        var post = new Post(req.body);
        post.save(function (err, post) {
            if (err) {
                return next(err);
            }
            res.json(post);
        });
    });
};