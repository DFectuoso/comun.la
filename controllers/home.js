// ToDo: move image uploader to a pipe, avoid to have the image in the heap.
var controller = require('stackers'),
	_ = require('underscore');

var User = require('../models/user');
var Section = require('../models/section');

var homeController = controller({
	path : ''
});

// attach all other controllers
homeController.attach(require('./user'));
homeController.attach(require('./admin/users.js'));
homeController.attach(require('./admin/sections.js'));

// Fetch user middle ware
homeController.beforeEach(function(req, res, next){
	if(req.session && req.session.passport && req.session.passport.user)
		var query = User.findOne({email : req.session.passport.user.email },function(err, user){
			if(err) return res.send(500);

			if(user){
				req.body.user = _.pick(user.toJSON(), 'username', 'avatar', 'role');
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
	res.render('home/home', req);
});

// This is the main dashboard
homeController.get('/dashboard', User.isLoggedIn, function (req, res) {
	res.render('home/dashboard', req);
});

module.exports = homeController;
