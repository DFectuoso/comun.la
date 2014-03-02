var User = require('../models/user');

var helpers = function(swig){
	/*
	swig.setFilter('has', function(array, item){
		return array.indexOf(item) !== -1 ? true : false;
	});

*/


	swig.setFilter('toString', function (input) {
		if(input && input.toString){
			return input.toString();
		}else{
			return '';
		}
	});

};


module.exports = helpers;