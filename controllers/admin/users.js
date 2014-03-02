var controller = require('stackers');

var User = require('../../models/user');

var userAdminController = controller({
	path : 'admin/users',
	child : true
});

userAdminController.beforeEach(User.isLoggedIn);
userAdminController.beforeEach(function(req, res, next){
	if( req.user.can('users', 'edit')) next(); else res.send('403');
});

userAdminController.get('', function (req, res) {
	var query = User.find({},function(err, users){
		if(err) return res.send(500, err);

		res.data.users = users;
		res.render('admin/users/list', req);
	});
});

userAdminController.get('/:userId', function (req, res) {
	res.render('admin/users/info', req);
});

userAdminController.post('/:userId', function (req, res) {
	req.requestUser.role = req.body.role;
	req.requestUser.fullname = req.body.fullname;
	req.requestUser.email = req.body.email;

	req.requestUser.save(function(err){
		if(err){
			return res.send(500, err);
		}

		res.redirect('/admin/users');
	});
});

module.exports = userAdminController;