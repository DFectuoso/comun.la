var model  = require('./../lib/model'),
	schema = model.Schema;

var voteSchema = schema({
	user        : { type: schema.Types.ObjectId, ref: 'user', required : true },
	post        : { type: schema.Types.ObjectId, ref: 'post', required : true },
	createdDate : { type : Date, default: Date.now },
});

var Vote = model.model('vote', voteSchema);

module.exports = Vote;
