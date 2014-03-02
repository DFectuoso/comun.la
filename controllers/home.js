// ToDo: move image uploader to a pipe, avoid to have the image in the heap.
var controller = require('stackers'),
	_ = require('underscore');

var User = require('../models/user');

var homeController = controller({
	path : ''
});

// attach all other controllers
homeController.attach(require('./user'));
homeController.attach(require('./admin/users.js'));

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

// This is the main log in, no reason to have anything else
homeController.get('', function (req, res) {
	if (req.user) {
		res.redirect("/dashboard")
	} else {
		res.render('home/home',{ messageLogin: req.flash('loginMessage') });		
	}
});

// This is the main dashboard
homeController.get('/dashboard', User.isLoggedIn, function (req, res) {
	res.render('home/dashboard', req);
});

module.exports = homeController;