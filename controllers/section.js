var controller = require('stackers');
var url = require('url');

var User = require('../models/user');
var Section = require('../models/section');
var Post = require('../models/post');
var Comment = require('../models/comment');

var currentController = controller({
  path : '',
  child : true
});


currentController.get(':sectionSlug', function (req, res) {
  var query = Post.find({section:req.section});
  query.populate("user")
  query.populate("section")
  query.exec(function (err, posts) {
    if(err)
      return res.send(500, err);

    req.posts = posts;
    res.render('section/home', req);
  })
});

//// CREATE NEW POST //// THIS MIGHT GO IN A POST CONTROLLER? NOT SURE.
currentController.get(':sectionSlug/post', User.isLoggedIn, function (req, res) {
  res.render('post/new', req);
});

currentController.get(':sectionSlug/post/:postIdWithComments', function (req, res) {

  function findComment(comments, id){
    for(var i = 0; i < comments.length; i++){
      var comment = comments[i];
      if(comment.id == id)
        return comment;
    }
  }

  function orderComments(comments){
    var orderedComments = [];

    for(var i = 0; i < comments.length; i++){
      var comment = comments[i];
      if(comment.parentComment === undefined){
        orderedComments.push(comment);
      } else {
        var parentComment = findComment(comments, comment.parentComment);
        if(parentComment.childComments === undefined)
          parentComment.childComments = [];
        parentComment.childComments.push(comment);
      }
    }

    return orderedComments;
  }


  req.orderedComments = orderComments(req.post.comments);

  res.render('post/info', req);
});

/// CREATE NEW COMMENT // THIS MIGHT GO IN THE COMMENT CONTROLLER? NOT SURE
currentController.post(':sectionSlug/post/:postId', User.isLoggedIn, function (req, res) {
  var comment = new Comment({
    content      : req.body.commentContent,
    user         : req.user,
    post         : req.post,
    userId       : req.user.id,
    userFullName : req.user.fullname,
  });

  comment.save(function(err,data){
    if(err)
      return res.send(500, err);

      req.post.comments.push(data);

      req.post.save(function (e) {
        if(e)
          return res.send(500, e);

        res.redirect('/' + req.section.slug + '/post/' + req.post.id);
      })
  });
});

currentController.get(':sectionSlug/post', User.isLoggedIn, function (req, res) {
  res.render('post/new', req);
});

currentController.post(':sectionSlug/post', User.isLoggedIn, function (req, res) {
  var parsedUrl = url.parse(req.body.url);
  var host;
  var postUrl;

  if (parsedUrl.host != null) {
    host = parsedUrl.hostname;
    postUrl = parsedUrl.href;
  }

  var post = new Post({
    title	     : req.body.title,
    description : req.body.description,
    url         : postUrl,
    host        : host,
    sectionSlug : req.section.slug,
    section     : req.section,
    user        : req.user,
    karma       : 0,
  });

  post.save(function(err){
    if(err)
      return res.send(500, err);
    res.redirect('/' + req.section.slug + '/post/' + post.id);
  });
});


module.exports = currentController;
