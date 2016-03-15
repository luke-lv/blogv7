var Promise = require('promise');

var p = new Promise(function(resolve, reject){
	setTimeout(function(){
		resolve();
	});
}).then(function(){

		console.log(arguments);
	}, function(resolve, reject){

	}).then(function(){
		console.log(3);
	});