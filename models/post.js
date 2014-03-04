var model  = require('./../lib/model'),
    schema = model.Schema;

var _ = require('underscore');

var postSchema = schema({
  createdDate   : {type : Date, default: Date.now },

  title          : {type : String},
  description    : {type : String},
  sectionSlug    : {type : String},
  url       		 : {type : String},
  host       	  : {type : String},

  section   		 : { type: schema.Types.ObjectId, ref: 'section' },
  user		       : { type: schema.Types.ObjectId, ref: 'user' },
  karma 	       : { type: Number },
  sectionGravity : { type: Number },
  comments       : [{ type: schema.Types.ObjectId, ref: 'comment' }],

  votes          : [{ type: schema.Types.ObjectId, ref: 'vote' }],
  userIdVotes    : [{ type: schema.Types.ObjectId, ref: 'userId' }],


});

var Post = model.model('post', postSchema);

Post.prototype.calculateKarma = function() {
  // We are checking in case legacy sections that don't have gravity, might remove from here later
  if (this.sectionGravity === undefined) {
    this.sectionGravity = 1.8;
  }

  var hours = Math.floor((new Date() - this.createdDate)/(1000*60*60));
  var votes = this.votes.length;
  var calculatedKarma = (votes)/Math.pow((hours + 2), this.sectionGravity);
  this.karma = calculatedKarma;
};

module.exports = Post;
