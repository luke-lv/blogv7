/** 
 * @fileoverview 任务管理类
 */
$import("sina/sina.js");
$import("lib/debug/debug_base.js");
$import("sina/core/array/foreach.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/array/findit.js");
/**
 * @class 任务管理类，
 * 		1. 提供注册job的方法
 *		2. 延时顺序执行job的功能
 *		3. 对job的出错保护，避免影响后续job的执行
 *		4. 单个job的执行时间
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified xy xinyu@staff.sina.com.cn
 * 			 为了适应各种不同优先级的job 2009-11-26
 * 			 sampleJob.add("testabc")为原来使用方式，不变，代表最重要的需要立即执行的job
 * 			 sampleJob.add("testabc",2),代表次重要的job
 * 			 sampleJob.add("testabc",3),代表焦点移动上来才需要执行的job
 * @modified 2010.06.24 L.Ming | liming1@staff.sina.com.cn
 * 			给 Job 初始化，增加 onStart 和 onEnd 事件
 * 			onEnd 事件发生后，可以对 Job 错误投放一个日志
 * @since 2008.01.05
 * @example
 *	$registJob("testjob", function(){
 *		trace("testjob is called!");
 *	});
 *	var sampleJob = new Jobs({
 		onStart	: function (){},
 		onEnd	: function (){
 			trace(sampleJob.errorMsg);
 		}
 	});
 *	sampleJob.add("testabc",2)//这个也会在testjob后执行;
 *	sampleJob.add("testjob");
 *	sampleJob.add("test",2);//定义了可以靠后执行的job
 *	sampleJob.add("test",3);//定义了需要鼠标移动到页面内才执行的
 *	sampleJob.start();	//testjob is called!
 */
window.onerror = function(err, file, line){
	trace("Error occured:" + err + '<br/>file:' + file + '<br/>line:' + line + '<br/>');
	return true;
};
/**
 * Job 类定义
 * @param {Object} oOption	配置信息
 * 	{
 * 		onStart		: Function,
 * 		onEnd		: Function
 * 	}
 */
function Jobs(oOption){
	this.option = oOption || {};
	this._jobTable = [[], [], [], []];//三种不同优先级的job
}
Jobs.prototype = {
	_registedJobTable: {},
	errorMsg	: [],	// Job 错误信息
	_registJob: function(jobName, rel){
		this._registedJobTable[jobName] = rel;
	},
	error	: function (sMsg){	// 记录错误信息
		Debug.error(sMsg);
		this.errorMsg.push(sMsg);
	},
	/**
	 * push a job to the job queue
	 * @param {String} jobName
	 */
	add		: function (jobName, type) {
		type = type || 1;
		if (Core.Array.findit(this._jobTable[type], jobName) == -1) {
			this._jobTable[type].push(jobName);
		} else {
			this.error('Error: Job <b>' + jobName + '</b> is existed now.');
		}
	},
	start	: function () {
		if(this.option.onStart != null){ this.option.onStart(); }
		var regJobs = this._registedJobTable;
		//将第二等级需要执行的链接到第一等级后，顺序执行下去
		var jobs = this._jobTable[1].concat(this._jobTable[2]);
		
		var _this = this;
		this.fe = Core.Function.bind3(_this.focus, _this, []);
		var addFocus = function () {
			if(_this._jobTable[3].length == 0){
				if(_this.option.onEnd != null){ _this.option.onEnd(); }
				return;
			}
			Core.Events.addEvent(document.body, _this.fe, "focus");
			Core.Events.addEvent(window, _this.fe, "scroll");
			Core.Events.addEvent(document.body, _this.fe, "mousemove");
			Core.Events.addEvent(document.body, _this.fe, "mouseover");
		};
		this.queue(jobs, addFocus);
	},
	/**
	 * 焦点事件
	 * added by xy 2009-11-26
	 */
	focus	: function () {
		var _this = this;
		if (this.focusdown) {
			Core.Events.removeEvent(document.body, _this.fe, "focus");
			Core.Events.removeEvent(window, _this.fe, "scroll");
			Core.Events.removeEvent(document.body, _this.fe, "mousemove");
			Core.Events.removeEvent(document.body, _this.fe, "mouseover");
			_this.fe = null;
			return;
		}
		this.focusdown = true;
		var jobs = this._jobTable[3];
		this.queue(jobs, this.option.onEnd);
	},
	/**
	 * 依次执行队列中的任务，完成后回调
	 * @param {Object} jobs
	 * @param {Object} callback
	 */
	queue	: function (jobs, callback) {
		var _this = this;
		var getTime = function(){
			return new Date().valueOf();
		};
		var regJobs = this._registedJobTable;
		var joblen = jobs.length;
		var i = 0;
		var interNum = window.setInterval(function(){
			if (i >= joblen) {
				clearInterval(interNum);
				interNum = null;
				if(callback != null){ callback(); }
				return;
			}
			var jobName = jobs[i];
			var job = regJobs[jobName];
			i ++;
			if (typeof job == 'undefined') {
				_this.error("<b>Job[" + jobName + "] is undefiend!!!</b>");
				return;
			}
			var _try = true;
			var _start = getTime();
			try {
				job.call();
			} catch (e) {
				_this.error("<b>Job[" + jobName + "] failed!!!</b>"+e.message+"");
				if(callback != null){ callback();}	// 如果任何一个 Job 失败，立即回调 onEnd
				_try = false;
				throw e;
			}
			finally {
				if (_try) {
					var _end = getTime();
					Debug.info("<b>Job[" + jobName + "] done in " + (_end - _start) + "ms.</b>");
				}
			}
		}, 10);
	},
	/**
	 * 单独呼叫某一个job
	 */
	call: function(jobName, args){
		if (typeof this._registedJobTable[jobName] != "undefined") {
			this._registedJobTable[jobName].apply(this, args);
		}
		else {
			trace("<b>Job[" + jobName + "] is undefined!!!</b>", {
				"color": "#900",
				"bgColor": "#FFF;"
			});
		}
	}
};

/**
 * 将一个自定义的过程定义为job
 * @param {String} name	job名字
 * @param {Function} rel job的引用，
 */
$registJob = function(name, rel){
	Jobs.prototype._registJob(name, rel);
};

$callJob = function(name){
	var args = [];
	if (arguments.length > 1) {
		Core.Array.foreach(arguments, function(v, i){
			args[i] = v;
		});
		args.shift();
	}
	Jobs.prototype.call(name, args);
};