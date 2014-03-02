var controller = require('stackers');
var url = require('url');

var User = require('../models/user');
var Section = require('../models/section');
var Post = require('../models/post');

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

currentController.get(':sectionSlug/post/:postId', User.isLoggedIn, function (req, res) {
  res.render('post/info', req);
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
