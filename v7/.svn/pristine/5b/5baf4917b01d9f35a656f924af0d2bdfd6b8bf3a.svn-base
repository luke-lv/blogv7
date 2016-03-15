/**
@module lib/kit/util/fx
@see http://mootools.net/
@see module:lib/kit/util/transitions
@example
var $fx = require('lib/kit/util/fx');
var fx = new $fx({
	duration : 1000
});
fx.set = function(now){
	$(node).css({
		'margin-left' : now + 'px'
	});
};
fx.on('complete', function(){
	console.info('animation end');
});
fx.start(0, 600);  //1秒内数字从0增加到600
**/
define('lib/kit/util/fx',function(require,exports,module){

	var $ = require('lib');
	var $class = require('lib/more/class');
	var $events = require('lib/more/events');
	var $erase = require('lib/kit/arr/erase');
	var $contains = require('lib/kit/arr/contains');
	var $timer = require('lib/kit/util/timer');

	// global timers
	// 使用公共定时器可以减少浏览器资源消耗

	var instances = {}, timers = {};

	var loop = function(){
		var now = Date.now();
		for (var i = this.length; i--;){
			var instance = this[i];
			if (instance){
				instance.step(now);
			}
		}
	};

	var pushInstance = function(fps){
		var list = instances[fps] || (instances[fps] = []);
		list.push(this);
		if (!timers[fps]){
			timers[fps] = $timer.setInterval(loop.bind(list), Math.round(1000 / fps) );
		}
	};

	var pullInstance = function(fps){
		var list = instances[fps];
		if (list){
			$erase(list, this);
			if (!list.length && timers[fps]){
				delete instances[fps];
				timers[fps] = $timer.clearInterval(timers[fps]);
			}
		}
	};

	var Fx = $class({
		/**
		动画类 - 用于处理不适合使用transition的场景
		@constructor module:lib/kit/util/fx
		@param {object} [options] 动画选项
		@param {number} [options.fps=1000] 帧速率(f/s)，实际上动画运行的最高帧速率不会高于 requestAnimationFrame 提供的帧速率
		@param {number} [options.duration=500] 动画持续时间(ms)
		@param {string|function} [options.transition] 动画执行方式，参见 kit/util/transitions
		@param {number} [options.frames] 从哪一帧开始执行
		@param {boolean} [options.frameSkip=true] 是否跳帧
		@param {string} [options.link='ignore'] 动画衔接方式，可选：['ignore', 'cancel']
		**/
		initialize : function(options){
			this.options = $.extend({
				fps: 1000,
				duration: 500,
				transition : null,
				frames: null,
				frameSkip: true,
				link: 'ignore'
			}, options);
		},

		setOptions : function(options){
			this.conf = $.extend(true, {}, this.options, options);
		},

		getTransition: function(){
			return function(p){
				return -(Math.cos(Math.PI * p) - 1) / 2;
			};
		},

		step: function(now){
			if (this.options.frameSkip){
				var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
				this.time = now;
				this.frame += frames;
			} else {
				this.frame++;
			}

			if (this.frame < this.frames){
				var delta = this.transition(this.frame / this.frames);
				this.set(this.compute(this.from, this.to, delta));
			} else {
				this.frame = this.frames;
				this.set(this.compute(this.from, this.to, 1));
				this.stop();
			}
		},
		/**
		设置当前动画帧的过渡数值
		@interface
		@param {number} now 当前动画帧的过渡数值
		**/
		set: function(now){
			return now;
		},

		compute: function(from, to, delta){
			return Fx.compute(from, to, delta);
		},

		check: function(){
			if (!this.isRunning()){
				return true;
			}
			switch (this.options.link){
				case 'cancel': this.cancel(); return true;
			}
			return false;
		},

		/**
		开始执行动画
		@param {number} from 动画开始数值
		@param {number} to 动画结束数值
		@return this
		@fires module:lib/kit/util/fx#start
		**/
		start: function(from, to){
			if (!this.check(from, to)){
				return this;
			}
			this.from = from;
			this.to = to;
			this.frame = (this.options.frameSkip) ? 0 : -1;
			this.time = null;
			this.transition = this.getTransition();
			var frames = this.options.frames, fps = this.options.fps, duration = this.options.duration;
			this.duration = Fx.Durations[duration] || parseInt(duration, 10) || 0;
			this.frameInterval = 1000 / fps;
			this.frames = frames || Math.round(this.duration / this.frameInterval);
			/**
			动画开始
			@event module:lib/kit/util/fx#start
			**/
			this.trigger('start');
			pushInstance.call(this, fps);
			return this;
		},

		/**
		停止动画
		@return this
		@fires module:lib/kit/util/fx#complete
		@fires module:lib/kit/util/fx#stop
		**/
		stop: function(){
			if (this.isRunning()){
				this.time = null;
				pullInstance.call(this, this.options.fps);
				if (this.frames === this.frame){
					/**
					动画已完成
					@event module:lib/kit/util/fx#complete
					**/
					this.trigger('complete');
				} else {
					/**
					动画尚未完成就被中断
					@event module:lib/kit/util/fx#stop
					**/
					this.trigger('stop');
				}
			}
			return this;
		},

		/**
		取消动画
		@return this
		@fires module:lib/kit/util/fx#cancel
		**/
		cancel: function(){
			if (this.isRunning()){
				this.time = null;
				pullInstance.call(this, this.options.fps);
				this.frame = this.frames;
				/**
				动画被取消
				@event module:lib/kit/util/fx#cancel
				**/
				this.trigger('cancel');
			}
			return this;
		},

		/**
		暂停动画
		@return this
		**/
		pause: function(){
			if (this.isRunning()){
				this.time = null;
				pullInstance.call(this, this.options.fps);
			}
			return this;
		},

		/**
		继续执行动画
		@return this
		**/
		resume: function(){
			if ((this.frame < this.frames) && !this.isRunning()){
				pushInstance.call(this, this.options.fps);
			}
			return this;
		},

		/**
		判断动画是否正在运行
		@return {boolean} true/false
		**/
		isRunning: function(){
			var list = instances[this.options.fps];
			return list && $contains(list, this);
		}
	});

	$events.mixTo(Fx);

	Fx.compute = function(from, to, delta){
		return (to - from) * delta + from;
	};

	Fx.Durations = {'short': 250, 'normal': 500, 'long': 1000};

	module.exports = Fx;

});


