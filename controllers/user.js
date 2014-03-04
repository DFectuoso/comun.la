// ToDo: move image uploader to a pipe, avoid to have the image in the heap.
var controller = require('stackers'),
	passport = require('passport');

var async = require('async');
var User = require('../models/user');
var Post = require('../models/post');
var Vote = require('../models/vote');
var Comment = require('../models/comment');

var userController = controller({
	path : 'user',
	child: true
});


userController.get('/login', function (req, res) {
	req.messageLogin = req.flash('loginMessage')
	res.render('user/login', req);
});

userController.get('/signup', function (req, res) {
	req.signupMessage = req.flash('signupMessage')
	res.render('user/signup', req);
});

userController.post('/login', passport.authenticate('local-login', {
	successRedirect : '/dashboard', // redirect to the secure profile section
	failureRedirect : '/user/login', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

userController.post('/signup',passport.authenticate('local-signup', {
	successRedirect : '/dashboard', // redirect to the secure profile section
	failureRedirect : '/user/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

userController.get('/logout', function (req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

userController.get('/:userId', User.isLoggedIn, function (req, res) {
	var queries = {};

	queries.totalUsers = function(done){
		User.count({_id:req.requestUser.id}).exec(function(err, totalUsers){
			done(err, totalUsers);
		});
	};
	queries.totalPosts = function(done){
		Post.count({user:req.requestUser}).exec(function(err, totalPosts){
			done(err, totalPosts);
		});
	};
	queries.totalVotes = function(done){
		Vote.count({user:req.requestUser}).exec(function(err, totalVotes){
			done(err, totalVotes);
		});
	};
	queries.totalComments = function(done){
		Comment.count({user:req.requestUser}).exec(function(err, totalComments){
			done(err, totalComments);
		});
	};

	async.parallel(queries, function(err, data){
		req.totalUsers = data.totalUsers;
		req.totalPosts = data.totalPosts;
		req.totalVotes = data.totalVotes;
		req.totalComments = data.totalComments;

		res.render('user/profile', req);
	});

});

module.exports = userController;
