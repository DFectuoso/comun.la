var conf = require('./../conf'),
	mongoose = require('mongoose');

console.log('connect with db', conf.mongoDb.db);
mongoose.connect('mongodb://localhost/' + conf.mongoDb.db);

module.exports = mongoose;
