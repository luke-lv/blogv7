var async = require('async');
/**
 * Created file.
 * @author wangqiang
 * @date 15/1/13
 */
var Iterator = function(objs){
	this.objs = objs;
	this.length = objs.length;
	this.currentIndex = 0;
};
Iterator.prototype.next = function() {
	if (this.hasNext()) {
		return this.objs[this.currentIndex++];
	}
};
Iterator.prototype.prev = function() {
	if (this.hasPrev()) {
		return this.objs[this.currentIndex--];
	}
};
Iterator.prototype.hasNext = function() {
	return this.currentIndex < this.length && this.currentIndex >= 0;
};
Iterator.prototype.hasPrev = function() {
	return this.currentIndex >= 0 && this.length >= this.currentIndex;
}


var AsyncTask = function(){
};
AsyncTask.prototype = {
	constructor: AsyncTask,
	waterfall: function(arr, tasks, finish){
		var self = this;
		self.tasks = tasks;
		self.proccessIteratorObj = new Iterator(arr);
		self.finalCallback = finish;
		self.result = [];
		self.tasks.unshift(function(callback){
			var currentObj = self.proccessIteratorObj.next();
			callback(null, currentObj);
		});
		self.nextTicket();
	},
	nextTicket: function(){
		var self = this;
		if (self.proccessIteratorObj.hasNext()) {
			async.waterfall(self.tasks, function(err, result){
				self.result.push(result);
				if (err) {
					self.finalCallback(err, self.result);
				} else {
					self.nextTicket();
				}
			});
		} else {
			self.finalCallback(null, self.result);
		}

	}
};

module.exports = {
	waterfall: function(arr, tasks, finish){
		var task = new AsyncTask();
		task.waterfall(arr, tasks, finish);
	}
};