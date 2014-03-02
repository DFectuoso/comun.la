var model  = require('./../lib/model'),
    schema = model.Schema;

var _ = require('underscore');

var postSchema = schema({
  createdDate   : {type : Date, default: Date.now },

  title         : {type : String},
  description   : {type : String},
  url       		: {type : String},
  host       	 : {type : String},

  section   		: { type: schema.Types.ObjectId, ref: 'section' },
  user		      : { type: schema.Types.ObjectId, ref: 'user' },
  karma 	      : { type: Number },
  //comments 	      : {type : Boolean, default: false },

});

var Post = model.model('post', postSchema);

module.exports = Post;
