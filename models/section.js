var model  = require('./../lib/model'),
    schema = model.Schema;

var _ = require('underscore');

var sectionSchema = schema({
  createdDate    : {type : Date, default: Date.now },
  name           : {type : String},
  slug           : {type : String},
	city      		 : {type : Boolean, default: false },
	main		       : {type : Boolean, default: false },
  moderators		 : [{ type: schema.Types.ObjectId, ref: 'moderator' }],
  sectionGravity : { type: Number, default: 1.8 },

});

var Section = model.model('section', sectionSchema);

module.exports = Section;
