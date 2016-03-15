
$import("mojie/_mojie.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getXY.js");

Mojie.Calendar = function(option) {
	var __addEvent=Core.Events.addEvent;
	var __byClz=Core.Dom.getElementsByClass;
	var that = this;
	//初始化
	this.init= function(option) {
		var today = new Date();
		if(!option.container){
            throw new Error("日期的容器必须定义");
        }

		this.container=option.container;
		this.timeInput=option.timeInput;
		this.lastDate=option.lastDate;
		this.lastSelectedDay = option.selectedDate || today;
		//整个日历的容器
		this.body=option.body;
		this.yearInput=option.yearInput;
		this.monthInput=option.monthInput;
		this.days=[];
		this.year=option.year ||today.getFullYear();
		this.month=option.month || today.getMonth();
		//this.day=option.day || today.getMonth();
		this.date=option.date || today.getDate();
		this.dateInput=option.dateInput;
		this.selectDay = option.selectDay ? new Date(option.selectDay) : null;
		this.firstShow();

		//鼠标在容器内点击某一天时
		__addEvent(this.container, function(e) {
			//debugger;
			e = e || window.event;
			var t=e.target || e.srcElement;
			if(!(t.tagName.toLowerCase()=='a' || t.tagName.toLowerCase()=='td'))
				return;
			if(t.tagName.toLowerCase()=='a') {
				if(t.className=="disabled" ||t.innerHTML=="&nbsp;")
					return;
				if(__byClz(this.container,'a','selected')[0])
					__byClz(this.container,'a','selected')[0].className="";
				that.date=t.innerHTML;
				t.className="selected";
				that.renderTimeInput();
			} else if(t.tagName.toLowerCase()=='td') {
				if(t.children[0].innerTHML=="&nbsp;" || t.children[0].className=="disabled")
					return;
				if(__byClz(this.container,'a','selected')[0])
					__byClz(this.container,'a','selected')[0].className="";
				that.date=t.children[0].innerHTML;
				t.children[0].className="selected";
				that.renderTimeInput();
			}
			that.toDateString();
			//if(that.body.style.display=='')
			//	that.body.style.display='none';
		});
        //*
		__addEvent(this.yearInput, function() {
			//console.log("changed"+new Date().getFullYear());
			var val=parseInt(that.yearInput.value);
			var todayYear=new Date().getFullYear();
			if(isNaN(val) || val<todayYear) {
				val=todayYear;
			//} else if(val<todayYear) {
			//	val=todayYear;
			} else if(val>2035) {
				val=2035
			}
			that.yearInput.value=val;
			that.year=val;
			that.setDraw(new Date(val, that.month-1,that.date));
		},'change');
		__addEvent(this.monthInput, function() {
			//console.log("changed"+new Date().getFullYear());
			var val=parseInt(that.monthInput.value);
			var todayMonth=new Date().getMonth()+1;
			if(isNaN(val) || val<1) {
				val=todayMonth;
			//} else if(val<todayMonth) {
			//	val=todayMonth;
			} else if(val>12) {
				val=12;
			}
			that.month=val;
			that.setDraw(new Date(that.year,val-1,that.date));
			//if(val<10)
			//	val="0"+val;
			that.monthInput.value=val;
		},'change');
		// */
		/*
       __addEvent(this.dateInput, function() {
            //console.log("changed"+new Date().getFullYear());
            var date = that.dateInput.value;
            if(!/^20\d{2}-\d{2}-\d{2}$/.test(date)){
                winDialog.alert('日期格式错误',{icon:'01'});
                return;
            }
            date = date.split('-');
            var newD = new Date();
            newD.setFullYear(parseInt(date[0],10)||2012);
            newD.setMonth((parseInt(date[1],10)||1)-1);
            newD.setDate(parseInt(date[2],10)||1);
            var yy = parseInt(dates);
            var todayMonth=new Date().getMonth()+1;
            if(isNaN(val)) {
                val=todayMonth;
            } else if(val<todayMonth) {
                val=todayMonth;
            } else if(val>12) {
                val=12;
            }
            that.month=val;
            that.setDraw(new Date(that.year,val-1,that.date));
            if(val<10)
                val="0"+val;
            that.monthInput.value=val;
        },'change');*/
		if(option.preMonthBtn) {
			__addEvent(option.preMonthBtn, function() {
                var d = new Date();
                if(that.month==1 && that.year-1<d.getFullYear() ||
                    that.month-1===d.getMonth() && that.year===d.getFullYear()){
                    return;
                }
				that.goPreMonth()
			});
		};
		if(option.nextMonthBtn) {
			__addEvent(option.nextMonthBtn, function() {
				if(that.month==12 && that.year+1>2035)
				return;
				that.goNextMonth()
			});
		};
		if(option.preYearBtn) {
			__addEvent(option.preYearBtn, function() {
				if(that.year-1<new Date().getFullYear() )
				return;
				
				that.goPreYear()
			});
		};
		if(option.nextYearBtn) {
			__addEvent(option.nextYearBtn, function() {
				if( that.year+1>2035)
				return;
				
				that.goNextYear()
			});
		};
	};
	//用日历的日期时间数据填充timeInput框。timeInput是提交时的时间戳数据
	this.renderTimeInput= function() {
		//lastSelectedDay用于在日历上显示上次选择的日期
		this.lastSelectedDay=new Date(this.yearInput.value,this.monthInput.value-1,this.date);
		this.timeInput.value=this.lastSelectedDay.getTime();
	};
	//用日历的日期时间数据渲染dateInput这个input框
	this.toDateString= function() {
		var xYear=this.year;
		var xMonth=this.month;
		if(xMonth<10) {
			xMonth="0"+xMonth;
		}
		var xDay=this.date;
		if(xDay<10) {
			xDay="0"+xDay;
		}
		this.dateInput.value=xYear+"-"+xMonth+"-"+xDay;
        $E('txt_date').innerHTML = xYear+'年'+xMonth+'月'+xDay+'日';
	};
	//从timeInput框获取时间并显示当前日期
	this.firstShow= function() {
		var t=new Date(parseInt(this.timeInput.value,10));
		//t.setTime(parseInt(this.timeInput.value));
        //console.log(this.timeInput.value);
        //console.log(t);
		this.setDraw(t);
		this.year=t.getFullYear();
		this.month=t.getMonth()+1;
		this.date=t.getDate();
		this.minute=t.getMinutes();
		this.hour=t.getHours();
		this.toDateString();
	};
	//上一月
	this.goPreMonth= function() {
		this.setDraw(new Date(this.year, this.month - 2, 1));
	};
	//下一月
	this.goNextMonth= function() {
		this.setDraw(new Date(this.year, this.month, 1));
	};
	//上一年
	this.goPreYear= function() {
		this.setDraw(new Date(this.year - 1, this.month - 1, 1));
	};
	//下一年
	this.goNextYear= function() {
		this.setDraw(new Date(this.year + 1, this.month - 1, 1));
	};
	this.setDraw= function(date) {
		this.year = date.getFullYear();
		this.month = date.getMonth() + 1;
		//重新画日历
		that.draw();
		//this.toDateString();
	};
	//画日历
	that.draw= function() {
		//console.log(this)
		//用来保存日期列表
		var arr = [];
		//当月第一天在一周中的日期值作为当月离第一天的天数
		for(var i = 1, firstDay = new Date(this.year, this.month - 1, 1).getDay(); i <= firstDay; i++) {
			arr.push(0);
		}
		//用当月最后一天在一个月中的日期值作为当月的天数
		for(var i = 1, monthDay = new Date(this.year, this.month, 0).getDate(); i <= monthDay; i++) {
			arr.push(i);
		}
		//清空原来的日期对象列表
		this.days = [];

		//插入日期
		var frag = document.createDocumentFragment();
		var thisMonth=false;
		var today = new Date();
        var on = new Date(this.year, this.month-1, 1, 23, 59, 59);
        var lastDay = this.lastDate;
        if( !lastDay ){
            lastDay = new Date();
            lastDay.setFullYear(today.getFullYear()+5);
        }
		while(arr.length) {
			//每个星期插入一个tr
			var row = document.createElement("tr");
			//每个星期有7天
			for(var i = 1; i <= 7; i++) {
                var cell = document.createElement("td");
				var cSpan=document.createElement("a");
				cSpan.href="javascript:void(0);"
				if(i==1 || i==7) {
					cSpan.className="weekend"
				}
				cSpan.innerHTML = "&nbsp;";
				cSpan.className="disabled";
				cell.appendChild(cSpan);
				if(arr.length) {
					var d = arr.shift();
					if(d) {
						cSpan.innerHTML = d;
						this.days[d] = cSpan;
						on.setDate(d);
						if(on>=today && on<lastDay) {
							cSpan.className="";
						}
						if(this.isSame(on,this.lastSelectedDay)) {
							if(__byClz(this.container,'a','selected')[0]){
								__byClz(this.container,'a','selected')[0].className="";
                            }
							cSpan.className = "selected";
						}
					}
				}
				row.appendChild(cell);
			}
			frag.appendChild(row);
		}
		//先清空内容再插入(ie的table不能用innerHTML)
		while(this.container.hasChildNodes()) {
			this.container.removeChild(this.container.firstChild);
		}
		this.container.appendChild(frag);
		//alert(this.onFinish)
		//附加程序
		this.onFinish();
	};
	this.isSame= function(d1,d2) {

        return (d1.getDate() == d2.getDate() && d1.getMonth() == d2.getMonth() && d1.getFullYear() == d2.getFullYear() );

    };
	this.onFinish = function () {
		//$E('txt_Year').innerHTML = this.yearInput.value = this.year;
		//$E('txt_Month').innerHTML = this.monthInput.value = this.month;
		this.yearInput.value = this.year;
		this.monthInput.value = this.month;
	};
};
