/**
 * @fileoverview 百合抽奖 次数更新
 */
$import("sina/core/function/bind2.js");
$import("sina/core/array/each.js");
$import("sina/core/dom/opacity.js");
$import("comps/baihe/_baihe.js");

(function(){

	/**
	 * 创建一个动画对象，计算动画每一步的值。来源于Mootools
	 * @param {HTMLElement} options 参数对象
	 * @example
		var fx = new Fx({duration:1000});
		fx.set = function(now){
			console.log(now);
		};
		fx.start(1,0);
	 *
	 */
	var Fx = function(options){
		this.setOptions(options);
	};
	
	Fx.prototype = {
		options:{
			/*
			onStart: nil,
			onCancel: nil,
			onComplete: nil,
			*/
			fps: 50,
			duration: 500
		},
		setOptions:function(ops){
			ops = ops || {};
			for(var key in ops){ this.options[key] = ops[key]; }
		},
		//获取变换公式（二次曲线）
		getTransition: function(){
			return function(p){
				return -(Math.cos(Math.PI * p) - 1) / 2;
			};
		},
		//执行
		step: function(){
			var time = new Date() - 0;
			if (time < this.time + this.options.duration){
				var delta = this.transition((time - this.time) / this.options.duration);
				this.set(this.compute(this.from, this.to, delta));
			} else {
				this.set(this.compute(this.from, this.to, 1));
				this.complete();
			}
		},
		//设置当前值
		set: function(now){
			return now;
		},
		//计算
		compute: function(from, to, delta){
			return (to - from) * delta + from;
		},
		//开始运算动画值
		start: function(from, to){
			this.from = from;
			this.to = to;
			this.time = 0;
			this.transition = this.getTransition();
			this.startTimer();
			if( this.isfunc(this.onStart) ) {
				this.onStart();
			}
			return this;
		},
		//检查是否为函数
		isfunc:function(func){
			return typeof func == 'function';
		},
		//完成动画值计算
		complete: function(){
			if (this.stopTimer() && this.isfunc(this.onComplete) ){
				this.onComplete();
			}
			return this;
		},
		//取消动画值计算
		cancel: function(){
			if (this.stopTimer() && this.isfunc(this.onCancel) ){
				this.onCancel();
			}
			return this;
		},
		//暂停动画值计算
		pause: function(){
			this.stopTimer();
			return this;
		},
		//继续动画值的计算
		resume: function(){
			this.startTimer();
			return this;
		},
		//停止计时器
		stopTimer: function(){
			if (!this.timer) return false;
			this.time =  new Date() - this.time;
			this.timer = clearInterval(this.timer);
			return true;
		},
		//启动计时器
		startTimer: function(){
			if (this.timer) return false;
			this.time = new Date() - this.time;
			var that = this;
			this.timer = setInterval(function(){
				that.step();
			},Math.round(1000 / this.options.fps) );
			return true;
		}
	};

	//史莱姆，用来做替身动画
	var clsSlime = function(el){
		if(!el)return;
		this.el = el;
		var slime = this.slime = $C('span');
		var pre = this.pre = $C('span');
		var html = el.innerHTML;
		el.innerHTML = '';
		el.appendChild(this.slime);
		el.appendChild(this.pre);
		this.set('html',html)
		//	.set('display','none')
			.set('position','absolute');
	}.$define({
		show:function(){
			this.set('display','');
			return this;
		},
		hide:function(){
			this.set('display','none');
			return this;
		},
		set:function(key,val){
			if(!this.slime)return this;
			var el = this.slime;
			if(key=='html'){ 
				el.innerHTML = val;
				this.pre.innerHTML = val;
			}else{
				el.style[key] = val;
			}
			return this;
		}
	});
	
	//动画字体类
	var fxFont = function(options){
		this.setOptions(options);
		var ops = this.options;
		this.el = $E(ops.id);
		this.prepare();
	}.$define({
		options:{
			normal:[12,0,0,100],
			bigger:[16,-1,-4,50],
			style:['fontSize','marginLeft','marginTop','opacity'],
			fxops:{fps:30,duration:500}
		},
		setOptions:function(ops){
			ops = ops || {};
			for(var key in ops){ this.options[key] = ops[key]; }
		},
		prepare:function(){
			if(!this.el)return;
			var el = this.el,ops = this.options;
			var slime = this.slime =  new clsSlime(el);
			this.fx = new Fx(ops.fxops);
			var target = slime.slime;
			var arr1 = ops.normal;
			var arr2 = ops.bigger;
			this.fx.set = function(now){
				Core.Array.each(ops.style,function(prop,i){
					var val = arr1[i]+(arr2[i]-arr1[i])*now;
					if(prop == 'opacity'){ 
						Core.Dom.opacity(target,val);
					}else { 
						target.style[prop] = val +'px'; 
					}
				})
				return now;
			};
		},
		highsize:function(num){
			if(!this.el)return;
			this.fx.cancel();
			var slime = this.slime;
			slime.show();
			this.fx.onComplete = function(){
				this.fx.onComplete = function(){
					slime.hide();
					this.fx.onComplete = null;
				}.bind2(this);
				slime.set('html',num);
				this.fx.start(1,0);
			}.bind2(this);
			this.fx.start(0,1);
		}
	});
	
	Baihe.luckyTimes = {
		duration:250,
		targetStyle:['fontSize','marginLeft','marginTop'],
		transvalue:{
			happyTimes:{
				normal:[12,0,0,100],
				bigger:[16,-2,-4,50]
			},
			lot_num:{
				normal:[26,0,0,100],
				bigger:[40,-7,-14,50]
			}
		},
		init:function(){
			if(this.inited)return this;
			this.prepare('lot_num');
			this.prepare('happyTimes');
			this.inited = true;
			return this;
		},
		prepare:function(strid){
			this[strid+'_fxfont'] = new fxFont({
				id:strid,
				fxops:{fps:30,duration:this.duration},
				normal:this.transvalue[strid].normal,
				bigger:this.transvalue[strid].bigger
			});
		},
		update:function(num){
			this.highsize('happyTimes',num);
			this.highsize('lot_num',num);
		},
		highsize:function(strid,num){
			if(this[strid+'_fxfont']){
				this[strid+'_fxfont'].highsize(num);
			}
		}
	};

})();



