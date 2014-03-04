var bcrypt   = require('bcrypt-nodejs');
var model  = require('./../lib/model'),
	schema = model.Schema;

var _ = require('underscore');

var userSchema = schema({
	email             : {type : String},
	password          : {type : String},
	nickname          : {type : String, required : true},
	nicknameLowercase : {type : String, required : true, unique:true},
	role              : {type : String, required : true, default: 'user'},
	createdDate       : {type : Date, default: Date.now }
});

var User = model.model('user', userSchema);

User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.prototype.validPassword = function(password) {
	console.log(password)
	console.log(this.password)
    return bcrypt.compareSync(password, this.password);
};

User.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/user/login');
}

var permisions = {};
User.setPermisions = function(role, config){
	if(!permisions[role]) permisions[role] = {};

	permisions[role] = _.extend(permisions[role],config);
};

User.prototype.can = function(resourse, action) {
	if(
		permisions[this.role] &&
		permisions[this.role][resourse] &&
		permisions[this.role][resourse][action]
	){
		// console.log('returning true for ', this.role, resourse, action );
		return true;
	}else{
		// console.log('returning false for ', this.role, resourse, action );
		return false;
	}
};

User.setPermisions('admin', {
	users : {
		'edit' : true,
	},
	sections : {
		'edit' : true,
	},
	startups : {
		'edit' : true
	}
});

User.setPermisions('user', {});

module.exports = User;
