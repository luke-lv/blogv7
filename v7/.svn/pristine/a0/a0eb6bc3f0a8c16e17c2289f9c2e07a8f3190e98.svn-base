/*


cfg={
  dict:['year','month','day','hh','mm','ss'],
  from : "1910-01-01 12" || new Date(),
  to   : " 02-00-00" || "05-00-00"
}


  if from is undefined,it means now;
  if expire is undefined,it means 5 years later;
  Tip : expire time only support date;

*/

$import("sina/sina.js");
$import("sina/ui/template.js");
$import("sina/core/events/addEvent.js");

  var renderItem = function(counter,timer,item){
      $E(item).options.length = 0;
      while(counter > 0){	
		  if(timer < 10) timer = "0" + parseInt(timer,10);
		  var opt = new Option(timer,timer);   
		  $E(item).options.add(opt,timer);
		  counter --;
		  timer ++;
      }
  };

var dayNum = function(y,m){
	var isLeap = function(y){
	    return y % 400 ? (y % 100 ? (y % 4 ? 0 : 1):0) : 1;
	};
	if(!(y*m)){return 0;}
	var d = 31;
	switch(m){
	case 4:
	case 6:
	case 9:
	case 11:
	    d = 30;
	    break;
	case 2:
	    d = isLeap(y) ? 29 : 28;
	    break;
	}
	return d;
    };
 
 var changeMonth = function(flag){
     var counter=12,timer=1;
     var yy = $E("year").value;
	 if(typeof flag == 'undefined'){
		 if( yy== from['year']){
			 timer = from['month']
			 counter = 12- timer + 1;
			
		 } else if(yy == to['year']){
			 counter = 12- (12 - from['month']);
		 } 
	 }else{
		 timer = $E("month").value;
		 counter = 12-(12-timer)
	 }  
     renderItem(counter,timer,'month');
 };
 var changeDay = function(){
     var counter=30,timer=1;
     var yy = $E('year').value;
     var mm = parseInt($E('month').value,10);
     if( yy== from['year'] && mm == from['month']){
		 counter = dayNum(from['year'],from['month']) - from['day'] + 1;
		 timer = from['day'];
     } else if(yy == to['year'] && mm == from['month']){
		 counter =  from['day'] ;
     } else{
		 counter = dayNum(yy,mm) ;
     } 
     renderItem(counter,timer,'day'); 
 }

 var changeHh = function(){
     var counter=23,timer=1;
     var yy = $E('year').options[$E('year').options.selectedIndex].value;
     var mm = parseInt($E('month').value,10);
     var dd = parseInt($E("day").value,10);
   
     if( yy== from['year'] && mm == from['month'] && dd == from['day']){
		 counter = 24 - from['hh'];
		 timer = from['hh'];
     } else if(yy == to['year'] && mm == from['month'] && dd == from["day"]){
		 counter =  23- (23 -from['hh']) ;
     } 
     renderItem(counter,timer,'hh');
 }

var DateSelector = function(cfg){

    this.dom ={
		year  : $E("year"),
		month : $E("month"),
		day   : $E("day"),
		hh    : $E("hh")

    };
 
    this.init = function(){
	window.from={};
	window.to={};
	var date,time;
	if(typeof cfg.from != "undefined"){
	    date = cfg.from.split(' ')[0].split("-");
	    time = cfg.from.split(' ')[1];

	    from['year']  = date[0];
	    from['month'] = date[1];
	    from['day']   = date[2];
	    from['hh']    = time;
		
		trace(from['year']+" "+from['month']+" "+from['day']+" "+from['hh']+"----DATE GIVE");
	}else{
	    var currentTime = new Date();
	    from['year']  = currentTime.getFullYear();
	    var month     = currentTime.getMonth() + 1 ;
	    from['month'] = month > 9 ? month : ("0" + month);
	    from['day']   = currentTime.getDate() > 9 ? currentTime.getDate() :("0" + currentTime.getDate());
	    from['hh']    = currentTime.getHours();
		
		trace(from['yeat']+" "+from['month']+" "+from['day']+" "+from['hh']+"----DATE MAKE");
	}
		if(typeof(cfg.to) != undefined){
			
  			for(var j=2;j>=0;j--){
				to[cfg.dict[j]] = parseInt(cfg.to.split("-")[j],10)+parseInt(from[cfg.dict[j]],10); 
				if(j == 2 && to['day'] > 30)
					to['month'] += Math.floor(to['day'] / 30);			
				if(j == 1 && to['month'] > 12)
					to['year'] += Math.floor(to['month'] / 12);		
			}
			
			trace(to['year']+" "+to['month']+" "+to['day']+" "+to['hh']+"----AFTER COMPARE");
			
			for(var i=0;i<cfg.dict.length;i++){
				var counter,timer,item = cfg.dict[i];
				to[item] = to[item] || 0;
				if(to[item] > from[item]){
					counter =  parseInt(to[item] - from[item]) + 1 ;
				}else if(i == 1){
					counter = 12 - from[item] + 1;
				}else if(i == 2){		
					counter = dayNum(from['year'],from['month']) - from[item] + 1;
				}else{
			
					counter = 24 - from[item] ;
				}
				
				timer = parseInt(from[item],10);
		
				renderItem(counter,timer,item);
				//if(typeof cfg.from == "undefined" && $E("year").value == from['year']){
				if($E("year").value == from['year']){
					if(from['month']*1 < 11){
						if(from["day"] * 1 - dayNum(from['year'],from['month']*1+2) >0){
							$E("month").value = from["month"] * 1 + 3;
							changeDay();
						}else
							$E("month").value = from["month"] * 1 + 2;
					}
				}
			
			}
			
	}

	Core.Events.addEvent($E("year"), function(){
	    changeMonth();
	    changeDay();
	    changeHh();
	},'change');
	
	Core.Events.addEvent($E("month"), function(){
	    changeDay();
	    changeHh();
	    
	},'change');
	
	Core.Events.addEvent($E("day"), function(){
	    changeHh();
	},'change');
	
    };
      	
};