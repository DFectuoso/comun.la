var controller = require('stackers');
var url = require('url');

var User = require('../models/user');
var Post = require('../models/post');
var Vote = require('../models/vote');

var currentController = controller({
  path : 'post',
  child : true
});


currentController.post('/:postId/vote', User.isLoggedIn, function (req, res) {
  Vote.findOne({post:req.post, user:req.user}, function (e, vote){
    if (e) return res.send(500, e);
    if (vote) return res.send({success:true});
    // We don't have a like, so let's create one!
    var vote = new Vote({
      user  : req.user,
      post  : req.post,
    });

    vote.save(function(err, data){
      if(err) return res.send(500, err);

      req.post.votes.push(data);
      req.post.userIdVotes.push(req.user);
      req.post.calculateKarma();
      req.post.save(function(err){
        if(err) return res.send(500, err);

        res.send({success:true});
      });
    });
  });
});

currentController.post('/:postId/unvote', User.isLoggedIn, function (req, res) {
  Vote.find({
		user  : req.user,
		post  : req.post
	}, function(err, data){
		if(err) return res.send(500, err);

		data.forEach(function(vote){
      req.post.votes.remove(vote);
      req.post.userIdVotes.remove(req.user);
			vote.remove();
		});

    req.post.calculateKarma();
		req.post.save(function(err){
			if(err) return res.send(500, err);
			res.send({success:true});
		});
	});
});




module.exports = currentController;
