var User = require('../models/user');

var helpers = function(swig){
	/*
	swig.setFilter('has', function(array, item){
		return array.indexOf(item) !== -1 ? true : false;
	});

*/
	swig.setFilter('add', function (input,other) {
		return Number(input) + Number(other);
	});


	swig.setFilter('toString', function (input) {
		if(input && input.toString){
			return input.toString();
		}else{
			return '';
		}
	});

};


module.exports = helpers;
