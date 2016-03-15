/**
 * @fileoverview 百合心理测试
 */
$import("sina/sina.js");
$import("sina/core/array/each.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/interface.js");

$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");


$registJob("runTest", function(){
	var undefined,
		addEvt = Core.Events.addEvent,
		stopEvt = Core.Events.stopEvent,
		_interface = 'http://control.blog.sina.com.cn/baihe/interface.php?action={action}&data={data}';
	
	var goToLucky = function(){
		window.location.href = 'http://control.blog.sina.com.cn/baihe/lottery.php';
	};

	/**
	 * 简单模板
	 * @from Mootools
	 * @param {String} str 需要替换模板的字符串
	 * @param {Object} object 对应模板的实际数据
	 * @param {Regexp} regexp 用于寻找模板的正则表达式
	 * @return {String} 模板替换完成的字符串
	 * @author Liangdong | liangdong2@staff.sina.com.cn
	 * @example
	 * 		var result = substitute('abc{key}def',{key:'_value_'});
	 * 		alert(result);	//"abc_value_def"
	 */
	var substitute = function(str,object,regexp){
		return str.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != undefined) ? object[name] : '';
		});
	};
	
	//限制数字在某个范围内
	var limit = function(num,min,max){
		return Math.min(max, Math.max(min, num));
	};
	

	/**
	 * @class clsExam	构建测验
	 * @options 
	 *	{String} url 		获取测验数据的地址
	 *	{Object} elements	操作的DOM元素对应的ID hash
	 *	{String} tplitem	测验题目单项的HTML模板
	 *	{Array} labels		测验题目单项的标志
	 * @example
	 *		var exam = new clsExam();
	 *		exam.init().start();
	 */
	var clsExam = function(options){
		this.setOptions(options);
	};

	clsExam.prototype = {
		options:{
			url:_interface,
			elements:{
				examarea:'exam_area',			//测试区域
				title:'exam_title',				//测验主题
				qtitle:'exam_question_title',	//题目标题
				qitem:'exam_question_item',		//题目选项
				prgbar:'exam_progress_bar',		//测验进度条
				prgnum:'exam_progress_num',		//测验进度数字
				btnResult:'exam_btnResult',		//结果按钮
				
				answerarea:'answer_area',		//结果区域
				qtext:'question_text',			//隐藏input
				ystyle:'your_style',			//你的类型容器
				ytype:'your_type',				//你的类型
				answer:'answer_content'			//结果容器
			},
			tplitem:'<li><input type="radio" name="name1" id="question{label}" /><label for="question{label}">{label}. {text}</label></li>',
			labels:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
		},
		//设置选项
		setOptions:function(ops){
			ops = ops || {};
			for(var key in ops){
				this.options[key] = ops[key];
			}
			return this;
		},
		//初始化
		init:function(){
			var ops = this.options
			for(var key in ops.elements){
				this[key] = $E(ops.elements[key]);
			}
			if(this.btnResult){ this.contResult = this.btnResult.parentNode; }
			if(this.prgbar){ this.contPrg = this.prgbar.parentNode.parentNode; }
			
			this.attach('btnResult','getLastResult');
			
			addEvt(this.qitem,this.checkResult.bind2(this),'click');
			
			this.set('contPrg','display','none');
			return this;
		},
		//绑定事件
		attach:function(el,method){
			addEvt(this[el],function(ev){
				stopEvt(ev);
				this[method]();
			}.bind2(this),'click');
		},
		//获取考试题
		start:function(){
			new Interface(substitute(this.options.url,{action:'get_question_json'}), "jsload").request({
				Get:{},
				onSuccess:function(rs){
					this.data = rs;
					this.dataqitems = rs.q_list;
					this.set('qtext','value',rs.title);
					this.build(this.data);
				}.bind2(this)
			});
		},
		//构建考试题
		build:function(data){
			if(!data)return;
			this.set('title','html',data.title);
			this.results = [];
			this.qindex = 0;
			this.showItem(this.qindex);
			this.set('contPrg','display','');
		},
		
		//显示题目
		showItem:function(index){
			if(Baihe.userChangeDetected()) return;			// 登录组件已引本类
			
			var len = this.dataqitems.length;
			index = limit(index,0,len - 1);
			var nowq = this.dataqitems[index];
			this.set('qtitle','html',(index+1)+'. '+nowq.q_text);
			var html = [];
			for(var key in nowq.a_text){
				html.push(substitute(this.options.tplitem,{
					text:nowq.a_text[key],
					label:key
				}));
			}
			this.set('qitem','html',html.join(''));
			index++;
			index = limit(index,1,len);
			var percent = Math.floor( index/len * 100 )+'%'; 
			this.set('prgnum','html',index + ' / ' + len);
			this.set('prgbar','width',percent);
		},
		//获取答案
		getResult:function(){
			var els = this.qitem.getElementsByTagName('input');
			var result = -1;
			Core.Array.each(els,function(el,index){
				if(el.checked){result = index;}
			});
			return this.options.labels[result];
		},
		//检查答案
		checkResult:function(){
			var result = this.getResult();
			if(result){
				if(this.qindex < this.dataqitems.length - 1){
					this.results.push(result);
					setTimeout(function(){
						this.qindex++;
						this.showItem(this.qindex);
					}.bind2(this),250);
				}else{
					this.set('contResult','display','');
				}
			}
		},
		//获取最终答案
		getLastResult:function(){
			if(!this.resultGetted){
				var result = this.getResult();
				if(result){
					this.results.push(result);
					this.resultGetted = true;
				}
			}
			if(this.resultGetted){
				var data = this.data.id +'|' + this.results.join('|');
				this.getAnswer(data);
				this.set('examarea','display','none');
				this.set('answerarea','display','');
				this.set('title','html','测试结果');
			}
		},
		
		//获取测试答案
		getAnswer:function(data){
			if(Baihe.userChangeDetected()) return;			// 登录组件已引本类
			
			new Interface(substitute(this.options.url,{action:'post_answer',data:data}), "jsload").request({
				Get:{},
				onSuccess:function(rs){
					var numel = $E('happyTimes');
					if(numel){
						var spans = numel.getElementsByTagName('span');
						var currentNum = 0;
						if(spans.length){
							currentNum = +spans[0].innerHTML;
						}
						Baihe.luckyTimes.init().update(currentNum+1);
					}
					this.buildAnswer(rs);
					window.baiheShareJob();
					winDialog.alert("恭喜完成测试^_^，参与测试就能获得 +1 抽奖机会", {
						icon:"03"
					});
				}.bind2(this),
				onError:function(rs){
					if(rs.code=='A80005'){
						winDialog.alert(rs.data,{
							funcOk:goToLucky,
							funcClose:goToLucky
						});
					}
				}
			});
		},
		//构建答案
		buildAnswer:function(data){
			this.set('answer','html',data.content);
			if(data.type){
				this.set('ystyle','display','');
				this.set('ytype','html',data.type);
			}
		},
		//重置
		reset:function(){
			this.resultGetted = false;
			this.build(this.data);
			this.set('contResult','display','none');
		},
		//先判断元素和值是否存在，然后设置元素内容或者样式
		set:function(el,prop,val){
			if(this[el] && val!=undefined){
				if(prop=='html'){ this[el].innerHTML = val; }
				else if(prop=='value'){ this[el].value = val; }
				else { this[el].style[prop] = val; }
			}
		}
	};
	
	new Interface(substitute(_interface,{action:'exam_ready'}), "jsload").request({
		Get:{},
		onSuccess:function(){
			var exam = new clsExam();
			exam.init().start();
		},
		onError:function(rs){
			winDialog.alert("每天只能参加1次测试，现在去抽奖吧！",{
				funcOk:goToLucky,
				funcClose:goToLucky
			});
		}
	});
	
});