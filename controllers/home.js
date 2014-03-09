// ToDo: move image uploader to a pipe, avoid to have the image in the heap.
var controller = require('stackers'),
	_ = require('underscore');

var async = require('async');
var User = require('../models/user');
var Section = require('../models/section');
var Post = require('../models/post');
var Vote = require('../models/vote');
var Comment = require('../models/comment');

var homeController = controller({
	path : ''
});

// Fetch user middle ware
homeController.beforeEach(function(req, res, next){
	if(req.session && req.session.passport && req.session.passport.user)
		var query = User.findOne({_id : req.session.passport.user }).populate({path:"notifications",options:{sort:"-createdDate",limit:10}}).exec(function(err, user){
			if(err) return res.send(500);

			if(user){
				req.user = user;
			}

			next();
		});
	else
		next();
});

homeController.beforeEach(function(req, res, next){
	var query = Section.find({},function(err, sections){
		if(err) return res.send(500, err);

		req.sections = sections;
		req.citySections = [];
		req.topicSections = [];

		for(var i = 0; i < sections.length; i++){
			if(sections[i].city)
				req.citySections.push(sections[i]);
			else
				req.topicSections.push(sections[i]);
		}

		next();
	});
});

// This is the main log in, no reason to have anything else
homeController.get('', function (req, res) {
	/// TODO CHANGE THIS TO MAKE IT THE DEFAULT SECCION CONTENT
	Section.findOne({main:true}, function (err,section) {
		if (err || !section) {
				res.render('home/home', req);
		} else {
			res.redirect("/" + section.slug);
		}
	})

});

// This is the main dashboard
homeController.get('/dashboard', User.isLoggedIn, function (req, res) {
	var queries = {};

	queries.totalUsers = function(done){
		User.count({}).exec(function(err, totalUsers){
			done(err, totalUsers);
		});
	};
	queries.totalPosts = function(done){
		Post.count({}).exec(function(err, totalPosts){
			done(err, totalPosts);
		});
	};
	queries.totalVotes = function(done){
		Vote.count({}).exec(function(err, totalVotes){
			done(err, totalVotes);
		});
	};
	queries.totalComments = function(done){
		Comment.count({}).exec(function(err, totalComments){
			done(err, totalComments);
		});
	};

	async.parallel(queries, function(err, data){
		req.totalUsers = data.totalUsers;
		req.totalPosts = data.totalPosts;
		req.totalVotes = data.totalVotes;
		req.totalComments = data.totalComments;

		res.render('home/dashboard', req);
	});

});

// attach all other controllers
homeController.attach(require('./user'));
homeController.attach(require('./admin/users.js'));
homeController.attach(require('./admin/sections.js'));
homeController.attach(require('./notification.js'));
homeController.attach(require('./comment.js'));
homeController.attach(require('./vote.js'));
homeController.attach(require('./section.js')); //// <---- SIEMPRE TIENE QUE IR AL FINAL

module.exports = homeController;
