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
	createdDate       : {type : Date, default: Date.now },

	notifications       : [{type: schema.Types.ObjectId, ref:"notification"}],
	unreadNotifications : {type: Number}
});

var User = model.model('user', userSchema);

var Notification = require('./notification');
var Comment      = require('./comment');
var Post         = require('./post');

User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.prototype.validPassword = function(password) {
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

User.prototype.countUnreadNotifications = function(){
	var currentUser = this;

	Notification.count({toUser:currentUser,read:false}, function(err, c){
		if (err){
			console.log("Failed to count unread notifications:" + err);
		} else {
			currentUser.unreadNotifications = c;
			currentUser.save(function(err){
				if (err) {
					console.log("Failed to save user after generating a notification");
				}
			})
		}
	})
}

User.prototype.createNotificationFromComment = function(newComment, parentPost, parentComment){
	var currentUser = this;
	var text = newComment.content.substring(0,250);
	var sectionSlug = newComment.post.sectionSlug;

	var toUser;
	if (newComment.parentComment) {
		/// We need the full parentComment to get the user
		toUser = parentComment.user;
	} else {
		// We need the full post to get the user
		toUser = parentPost.user;
	}

	console.log("To user:" + toUser);

	var notification = new Notification({
		fromUser : currentUser,
		fromUserNickname : currentUser.nickname,
		toUser: toUser,
		parentComment: newComment.parentComment,
		parentPost: newComment.post,
		text: text,
	});

	notification.save(function(err, data){
		if (err) {
			console.log("Failed to save notification:" + err);
		}
		toUser.notifications.push(notification);
		toUser.save(function(err){
			if (err)
				console.log("Failed to save user after generating a notification");
			toUser.countUnreadNotifications();
		});
	});
};

User.prototype.getNotifications = function(){

}

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
