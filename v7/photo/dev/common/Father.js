/*
 @ author shaomin | shaomin@staff.sina.com.cn
 @ desc the class named BF(short for base function) to define the properties for both photo and album,
 @      which has the same function to modify title,demo,and trigger the button for recommanding to album circle,
 @      move to another album,delete,etc.

 @ DICT is a dictionay object to get the value from key.
 @ phpENTRY defines interfaces for getting all circles ,recommandding to albumcircle,moving to another category,deleting the photo and rotate the photo
*/

$import("sina/sina.js");
$import("sina/core/function/bind3.js");
$import("sina/core/events/addEvent.js");

 var Father = function(myid,fatherId){     
     this.id = myid;
     if(typeof fatherId != 'undefined')
	 this.fatherID = fatherId;
     this.btnPanel = "btn_panel_"+myid;  
     this.tags = {};
 };



 