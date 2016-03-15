$import("sina/core/date/_date.js");
/**
 *
 *@desc get timestamp in foramt style
   the separated line can be "-" ,'/' or '.'
 *@exmaple
  var myDate = new Date();
  var a = myDate.getTimestamp("yyyy/MM/dd hh:mm:ss");
  alert(a);
 *@author shaomin|shaomin@staff.sina.com.cn
 */
Date.prototype.getTimestamp = function(strFormat){

    var currentTime = this;
    var thisYear = currentTime.getFullYear();
    
    var thisMonth = currentTime.getMonth() + 1 ;
    thisMonth = thisMonth > 9 ? thisMonth : ("0" +thisMonth);
    
    var date = currentTime.getDate();
    var today = date > 9 ? date : ("0" +date);
    
    var hh = currentTime.getHours();
    
    var minutes = currentTime.getMinutes();
    var mm = minutes > 9 ? minutes : ("0" + minutes);
    
    var seconds = currentTime.getSeconds();
    var ss = seconds > 9 ? currentTime.getSeconds() : ("0" + seconds);
    
    return (strFormat.replace(/(y{2,4})/, thisYear).replace('MM', thisMonth).replace('dd', today).replace('hh', hh).replace('mm', mm).replace('ss', ss));
};

  
