angular.module('flapperNews', ['ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
            resolve: {
                postPromise: ['posts', function (posts) {
                    return posts.getAll();
                }]
            }
        })
        .state('posts', {
            url: '/posts/{id}',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                post: ['$stateParams', 'posts', function ($stateParams, posts) {
                    return posts.get($stateParams.id);
                }]
            }
        });
    $urlRouterProvider.otherwise('home');
}])
.factory('posts', ['$http', function ($http) {
    var o = {
        collection: [],
        getAll: function () {
            return $http.get('/posts').success(function (data) {
                angular.copy(data, o.collection);
            });
        },
        create: function (post) {
            return $http.post('/posts', post).success(function (data) {
                o.collection.push(data);
            });
        },
        get: function (id) {
            return $http.get('/posts/' + id).then(function (res) {
                return res.data;
            });
        },
        upvote: function (post) {
            return $http.put('/posts/' + post._id + '/upvote').success(function (data) {
                post.upvotes += 1;
            });
        },
        downvote: function (post) {
            return $http.put('/posts/' + post._id + '/downvote').success(function (data) {
                post.upvotes -= 1;
            });
        },
        addComment: function (id, comment) {
            return $http.post('/posts/' + id + '/comments', comment);
        },
        upvoteComment: function (post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote').success(function (data) {
                comment.upvotes += 1;
            });
        },
        downvoteComment: function (post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote').success(function (data) {
                comment.upvotes -= 1;
            });
        }
    };
    return o;
}])
.controller('MainCtrl', ['$scope', 'posts', function ($scope, posts) {
    $scope.posts = posts.collection;
    $scope.isAddingPost = false;
    $scope.addingPost = function () {
        $scope.isAddingPost = true;
    };
    $scope.addPost = function () {
        if (!$scope.title || $scope.title === '') {
            return;
        }
        posts.create({
            title: $scope.title,
            link: $scope.link
        });
        $scope.title = '';
        $scope.link = '';
        $scope.isAddingPost = false;
    };
    $scope.upvote = function (post) {
        posts.upvote(post);
    };
    $scope.downvote = function (post) {
        posts.downvote(post);
    };
}])
.controller('PostsCtrl', ['$scope', 'posts', 'post', function ($scope, posts, post) {
    $scope.post = post;
    $scope.isAddingComment = false;
    $scope.addingComment = function () {
        $scope.isAddingComment = true;
    };
    $scope.addComment = function () {
        if ($scope.body === '') {
            return;
        }
        posts.addComment(post._id, {
            body: $scope.body,
            author: 'user'
        }).success(function (comment) {
            $scope.post.comments.push(comment);
        });
        $scope.body = '';
        $scope.isAddingComment = false;
    };
    $scope.upvote = function (comment) {
        posts.upvoteComment(post, comment);
    };
    $scope.downvote = function (comment) {
        posts.downvoteComment(post, comment);
    };
}]);
