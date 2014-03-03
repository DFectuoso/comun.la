var controller = require('stackers');
var url = require('url');

var User = require('../models/user');
var Section = require('../models/section');
var Post = require('../models/post');
var Comment = require('../models/comment');

var currentController = controller({
  path : 'comment',
  child : true
});


currentController.get('/:commentId', User.isLoggedIn, function (req, res) {
  res.render('comment/info', req);
});

currentController.post('/:commentId', User.isLoggedIn, function (req, res) {
  var comment = new Comment({
    content      : req.body.commentContent,
    user         : req.user,
    post         : req.comment.post,
    userId       : req.user.id,
    userFullName : req.user.fullname,
    parentComment: req.comment
  });

  comment.save(function(err,data){
    if(err)
      return res.send(500, err);

      req.comment.post.comments.push(data);

      req.comment.post.save(function (e) {
        if(e)
          return res.send(500, e);

        res.redirect('/' + req.comment.post.sectionSlug + '/post/' + req.comment.post.id);
      })
  });

  res.render('comment/info', req);
});




module.exports = currentController;
