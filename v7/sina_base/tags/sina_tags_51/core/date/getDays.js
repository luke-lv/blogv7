/*
   shaomin|shaomin@staff.sina.com.cn;
   get how many days in  month of the year;
   
  alert(Core.Date.getDays(2009,2));

*/

$import("sina/core/date/_date.js");

Core.Date.getDays = function(y,m){
    if (!(y*m)) {
        return 0;
    }
    var d = 31;
    switch (m) {
        case 4:
        case 6:
        case 9:
        case 11:
            d = 30;
            break;
        case 2:
            d = Core.Date.isLeap(y) ? 29 : 28;
            break;
    }
    return d;
};
