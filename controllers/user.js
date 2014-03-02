// ToDo: move image uploader to a pipe, avoid to have the image in the heap.
var controller = require('stackers'),
	passport = require('passport');

var User = require('../models/user');

var userController = controller({
	path : 'user',
	child: true
});

userController.post('/login', passport.authenticate('local-login', {
	successRedirect : '/dashboard', // redirect to the secure profile section
	failureRedirect : '/', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

userController.post('/signup',passport.authenticate('local-signup', {
	successRedirect : '/dashboard', // redirect to the secure profile section
	failureRedirect : '/', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

userController.get('/logout', function (req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

userController.get('/profile', User.isLoggedIn, function (req, res) {
	res.render('user/profile');
});

module.exports = userController;