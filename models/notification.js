var model  = require('./../lib/model'),
    schema = model.Schema;

var notificationSchema = schema({
  createdDate   : {type : Date, default: Date.now},

  toUser		           : {type: schema.Types.ObjectId},
  fromUser        	   : {type: schema.Types.ObjectId},
  fromUserNickname	   : {type: String},
  text	               : {type: String},

  parentPost	  : {type: schema.Types.ObjectId, ref:"post"},
  parentComment : {type: schema.Types.ObjectId, ref:"comment"},

  read      		: {type : Boolean, default: false},
});

var Notification = model.model('notification', notificationSchema);

module.exports = Notification;
