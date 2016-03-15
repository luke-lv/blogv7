/*
 * @author Jay Chan | chenjie@staff.sina.com.cn
 * @description 键盘控制页面跳转
 * @example
 * 
 * 
 */

$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");

$registJob("jumpPage", function(){
    
        Core.Events.addEvent(
                document.documentElement,
                function(e){
                        var obj = e.target || e.srcElement;
                        if(/^(input|textarea|select)$/i.test(obj.nodeName)){

                        }
                        else{
                                switch(e.keyCode){
                                        case 37 :
				    if(picInfo.prevPhoto)
				                document.location.href = picInfo.prevPhoto;
                                                break;
                                        case 39 :
				    if(picInfo.nextPhoto)
                                                document.location.href = picInfo.nextPhoto;
                                                break;
                                        default:
                                }
                        }
                },
                "keydown",
                false
        )
});

