/**
微博影响力排行
**/
define('mods/view/blogInflance', function (require, exports, module){


	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $rankLise = require('mods/trans/rankList');
	var $templateMess = require('mods/tpl/blogInflance');
	var $easyTemplate = require('lib/kit/str/easyTemplate');
	var $errMess = require('mods/tpl/errMess');
	var $win = $(window);

	//获取影响力接口数据 





	/*$rankLise.request('getBlogInfluence',{
		data:{
			type:1,
			week:45,
			moth:1,
			media_type:1,
			year:'2015'
		}
	});*/

	var inflanceList = $view.extend({
		defaults : {
			node: document.body,
			weekNumber : '',
			month : '',
			year : '',
			oDate : null,
			now : 1,
			media : 1,
			dataSpace : null,
			pageNow : 1,
			getTimeYet : false
		},
		events : {
			'[node="reload"] click': 'reload',
			'[node="list-button"] li click' : 'channel',
			'[node="week-button"] click' : 'getWeek',
			'[node="month-button"] click' : 'getMonth',
			'[node="page_one"] click' : 'pageOne',
			'[node="page_two"] click' : 'pageTwo',
			'[node="prev"] click' : 'pagePrev',
			'[node="next"] click' : 'pageNext',
			'[node="share-suda"] click' : 'shareSuda'
		},
		myBrowser: function (){
		    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
		    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
		    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
		    var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
		    if (isIE) {
		        var IE5 = IE55 = IE6 = IE7 = IE8 = false;
		        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		        reIE.test(userAgent);
		        var fIEVersion = parseFloat(RegExp["$1"]);
		        IE55 = fIEVersion == 5.5;
		        IE6 = fIEVersion == 6.0;
		        IE7 = fIEVersion == 7.0;
		        IE8 = fIEVersion == 8.0;
		        if (IE55) {
		            return "IE55";
		        }
		        if (IE6) {
		            return "IE6";
		        }
		        if (IE7) {
		            return "IE7";
		        }
		        if (IE8) {
		            return "IE8";
		        }
		    }//isIE end
		    if (isFF) {
		        return "FF";
		    }
		    if (isOpera) {
		        return "Opera";
		    }
		},
		shareSuda : function(ev){
			var self = this;
			self.v7sendLog($(ev.target).data('suda'));
		},
		setEvents : function(action){
			$win[action]('scroll', this.proxy('check'));
		},
		check : function(){
			var brows = this.myBrowser();
			if(brows === "IE55"||brows === "IE6"||brows === "IE7"){
				return
			}else{
				if($win.scrollTop()>47){
					
					$('[node="bmediaList"]').addClass('Bmedialist1');
				}else{
					
					$('[node="bmediaList"]').removeClass('Bmedialist1');
				}
			}
			
		},
		pageOne : function(ev){
			ev.preventDefault();
			var self = this;
			self.pageNow = 1;
			
			self.contentBox = $easyTemplate($templateMess, self.arr.arr1).toString();
			$('[node="list-box"]').html(this.contentBox);
			$('[node="page_one"]').addClass('cur');
			$('[node="page_two"]').removeClass('cur');

		},
		pageTwo : function(ev){
			ev.preventDefault();
			var self = this;
			self.pageNow = 2;
			
			self.contentBox = $easyTemplate($templateMess, self.arr.arr2).toString();
			$('[node="list-box"]').html(this.contentBox);
			$('[node="page_two"]').addClass('cur');
			$('[node="page_one"]').removeClass('cur');
		},
		pagePrev : function(ev){
			ev.preventDefault();
			var self = this;
			if(self.pageNow<=1){
				return
			}else{
				self.pageNow--;
			}
			self.contentBox = $easyTemplate($templateMess, self.arr.arr1).toString();
			$('[node="list-box"]').html(this.contentBox);
			$('[node="page_one"]').addClass('cur');
			$('[node="page_two"]').removeClass('cur');

		},
		pageNext : function(ev){
			ev.preventDefault();
			var self = this;
			if(self.pageNow>1){
				return
			}else{
				self.pageNow++;
			}
			self.contentBox = $easyTemplate($templateMess, self.arr.arr2).toString();
			$('[node="list-box"]').html(this.contentBox);
			$('[node="page_two"]').addClass('cur');
			$('[node="page_one"]').removeClass('cur');

		},
		reload : function(ev){
			ev.preventDefault();
			window.location.reload();
		},
		build : function(){
			
			this.getWeek();

			
		},
		render : function(arr){
			var self = this;
			self.contentBox = $easyTemplate($templateMess, arr).toString();
			$('[node="list-box"]').html(this.contentBox);
		},
		renderErr:function(){
			$('[node="list-box"]').html('');
			$('[node="list-box"]').html($errMess);
			
		},
		getTime : function(dataSend,fn){
			var self = this;
			$.ajax({
				url : 'http://msg.video.sina.com.cn/getSystemTime.php',
				type : 'GET',
				dataType:'jsonp',
				success : function(data){
					function datetime_to_unix(datetime){
					    var tmp_datetime = datetime.replace(/:/g,'-');
					    tmp_datetime = tmp_datetime.replace(/ /g,'-');
					    var arr = tmp_datetime.split("-");
					    var now = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
					    return parseInt(now.getTime()/1000);
					}
					 
					
					 
					var datetime = data.data;
					var unix = datetime_to_unix(datetime);
					
					 

					self.oDate = new Date();
					self.oDate.setTime(unix*1000+(86400*0*1000));

					var weekNumber = self.weekofyear(self.oDate.getFullYear(),self.oDate.getMonth()+1,self.oDate.getDate());

					console.log(weekNumber);

					if(self.oDate.getDate()>1){
						self.month = self.oDate.getMonth();
					}else{
						self.month = self.oDate.getMonth()-1;
					}

					var dayData = self.oDate.getDay();
					if(dayData>0&&dayData<=2){
						
						self.weekNumber = weekNumber-2;
					}else if(dayData>2){
						
						self.weekNumber = weekNumber-1;
					}

					self.year = ''+self.oDate.getFullYear();

					var dataNow = {};

					self.getTimeYet = true;
					if(self.now === 1){
						dataNow = {week:self.weekNumber,year:self.year};
					}else if(self.now === 2){
						dataNow = {month:self.month,year:self.year};
					}
					dataNow = $.extend(dataSend,dataNow);
					
					fn(dataNow,self);
				},
				err : function(){
					self.oDate = new Date();
					self.weekNumber = self.weekofyear(data.data);
					self.weekMonth = oDate.getMonth()+1;
					self.year = ''+oDate.getFullYear();
					var dataNow = {};

					self.getTimeYet = true;
					if(self.now === 1){
						dataNow = {week:self.weekNumber,year:self.year};
					}else if(self.now === 2){
						dataNow = {moth:self.moth,year:self.year};
					}
					
					dataNow = $.extend(dataSend,daraNow);
					
					fn(dataNow,self);
					
				}
			})

		},
		v7sendLog:function(type, pageid, msg){
			if(!type) {
				return false;
			}
			
			if(typeof scope == 'undefined') {
				window.scope = {};
				scope.$pageid = '';
			}
			pageid = pageid || scope.$pageid;
			msg = msg || '';
		   

		    $.ajax({
		    	url: "http://hits.sinajs.cn/A2/b.html",
		    	data:{
		    		type:type
		    	},
		    	dataType:'jsonp',
		    	success : function(){

		    	}

		    })
		},
		channel : function(ev){
			var self = this;

			ev.preventDefault();
			self.conf.media = $(ev.target).data('media');
			$('[node="list-button"] li a').removeClass('cur');
			$(ev.target).addClass('cur');
			var dataNow = {};
			if(self.now === 1){
				dataNow = {week:self.weekNumber,year:self.year};
			}else if(self.now === 2){
				dataNow = {month:self.month,year:self.year};
			}
			
			var data = {type:self.now,media_type:self.conf.media}
			dataNow = $.extend(data,dataNow);
			if(self.getTimeYet){
				self.getData(dataNow,self)
			}else{
				self.getTime(data,self.getData);
			}
			self.v7sendLog($(ev.target).data('suda'));
		},
		getMonth : function(){
			
			var self = this;
			self.now = 2;
			$('[node="week-button"] a').removeClass('cur');
			$('[node="month-button"] a').addClass('cur');
			var data = {type:2,media_type:self.conf.media,month:self.month,year:self.year}
			if(self.getTimeYet){
				self.getData(data,self)
			}else{
				self.getTime(data,self.getData);
			}
		},
		getWeek : function(){
			var self = this;

			self.now = 1;
			$('[node="month-button"] a').removeClass('cur');
			$('[node="week-button"] a').addClass('cur');
			var data = {type:1,media_type:self.conf.media,week:self.weekNumber,year:self.year}
			if(self.getTimeYet){
				self.getData(data,self)
			}else{
				self.getTime(data,self.getData);
			}
			
		},
		weekofyear : function(y,m,d){
			function isLeapYear(year) {
    			return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
			};

			function getMonthDays(year, month) {
			    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
			};

			var now = new Date(y, m - 1, d),
			    year = now.getFullYear(),
			    month = now.getMonth(),
			    days = now.getDate();
			//那一天是那一年中的第多少天
			for (var i = 0; i < month; i++) {
			    days += getMonthDays(year, i);
			}

			//那一年第一天是星期几
			var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

			var week = null;
			if (yearFirstDay == 1) {
			    week = Math.ceil(days / yearFirstDay);
			} else {
			    days -= (7 - yearFirstDay + 1);
			    week = Math.ceil(days / 7) + 1;
			}

			return week;
		},
		getData : function(data,self){
			$.ajax({
				url : 'http://interface.blog.sina.com.cn/riaapi/mediaInfluence/getMediaInfluence.php',
				type : 'GET',
				dataType:'jsonp',
				data:data,
				cache : false,
				success:function(data){
					self.render(self.makeArr(data,self));
				},
				err : function(){
					self.renderErr();
					
				}
			});
			
		},
		makeArr : function(inflanceData,self){
			self.arr = [];
			var arr = [];
			for(x in inflanceData.result.data){
				
				arr.push(inflanceData.result.data[x]);
			}
			for(var i=0;i<arr.length;i++){
				arr[i].influenceChange = arr[i].lastweekrank - arr[i].outputrank;
				
				arr[i].changeNumber = Math.abs(arr[i].influenceChange,10);
				arr[i].weibopower = this.influenceFn(arr[i].weiboinfluence);
				arr[i].blogpower = this.influenceFn(arr[i].bloginfluence);
				arr[i].weixinpower = this.influenceFn(arr[i].weixininfluence);

				arr[i].meidanewname = this.setNameLength(arr[i].medianame);
				arr[i].meidanewid = this.setIdLength(arr[i].weixinid);
				arr[i].indexNum = i+1;
			}
			if(arr.length>50){
				arr.arr1=[];
				arr.arr1.firstDate = true;
				for(var i=0;i<50;i++){
					arr.arr1.push(arr.shift());
				}
				self.arr.arr1 = arr.arr1;
				self.arr.arr1.more = true;
				for(var i=0;i<arr.length;i++){
					arr[i].indexNum = i+51;
				}
				arr.arr2 = arr;
				self.arr.arr2 = arr.arr2;
				self.arr.arr2.firstDate = false;
				self.arr.arr2.more = true;
				return arr.arr1;
				
			}
			arr.firstDate = true;
			arr.more = false;
			return arr;
		},
		setNameLength : function(str){
			if(str.length>6){
				var str = str.substring(0,6);
				return str+'...';
			}else{
				return str;
			}

			
		},
		setIdLength : function(str){
			if(str.length>8){
				var str = str.substring(0,8);
				
				return str+'...';
			}else{
				return str;
			}

			
		},
		influenceFn : function(num){
			if(100>=num&&num>=91){
				return 1
			}else if(90>=num&&num>=81){
				return 2
			}else if(80>=num&&num>=71){
				return 3
			}else if(70>=num&&num>=61){
				return 4
			}else if(60>=num&&num>=51){
				return 5
			}else if(50>=num&&num>=41){
				return 6
			}else if(40>=num&&num>=31){
				return 7
			}else if(30>=num&&num>=21){
				return 8
			}else if(20>=num&&num>=11){
				return 9
			}else if(10>=num&&num>=1){
				return 10
			}
		}

	});

	new inflanceList();

	

});