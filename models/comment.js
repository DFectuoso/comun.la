var model  = require('./../lib/model'),
    schema = model.Schema;

var _ = require('underscore');

var commentSchema = schema({
  createdDate   : {type : Date, default: Date.now },

  content       : {type : String},
  user		      : { type: schema.Types.ObjectId, ref: 'user' },
  post		      : { type: schema.Types.ObjectId, ref: 'post' },
  userId        : {type : String},
  userFullName  : {type : String},
  parentComment : { type: schema.Types.ObjectId, ref: 'parentComment' },

});

var Comment = model.model('comment', commentSchema);

module.exports = Comment;
