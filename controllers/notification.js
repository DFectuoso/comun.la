var controller = require('stackers');
var url = require('url');

var User = require('../models/user');
var Section = require('../models/section');
var Post = require('../models/post');
var Comment = require('../models/comment');
var Notification = require('../models/notification');

var _ = require('underscore');

var currentController = controller({
  path : 'notification/',
  child : true
});

currentController.get('inbox', User.isLoggedIn, function (req, res) {
  Notification.find({toUser:req.user}).sort("-createdDate").exec(function(err,notifications){
    if(err)
      return res.send(500, err);

    req.notifications = notifications;
    res.render('notification/inbox', req);
  })
});

currentController.get(':notificationId', User.isLoggedIn, function (req, res) {
  req.notification.read = true;
  req.notification.save(function(err){
    if(err)
      return res.send(500, err);
    res.redirect('/' + req.notification.parentPost.sectionSlug + '/post/' + req.notification.parentPost.id);
    req.user.countUnreadNotifications();
  })

});

module.exports = currentController;
