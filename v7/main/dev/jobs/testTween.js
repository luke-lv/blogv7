/**
 * @author Administrator
 */
$import("sina/core/function/bind2.js");
$import("sina/core/events/addEvent.js");
$import("sina/ui/tween.js");
$import("sina/ui/slide.js");





$registJob('testTween', function(){
    //	new Ui.tween($E("module_10001"), "marginTop", -$E("module_10001").offsetHeight, 2, "backEaseIn" , {
    //		end : function(){
    //			//alert(1);
    //		}
    //	});
    $E("sinablogHead").innerHTML = '\
		<a id="slide_in">in</a> \
		<a id="slide_out">out</a> \
		<a id="slide_show">show</a> \
		<a id="slide_hide">hide</a>\
		<div id="slide_cont" style="width:200px; ">\
			<div id="slid_node" style="background:#00F; height:100px;">1<br>2<br>3<br>4<br></div>\
		</div>\
		<div>Aptana</div>\
	';
    try {
        var sl = new Ui.Slide("slid_node", {
            duration: 0.5
        });
        sl.onSlideOut = function(){
            trace(1);
        };
        sl.hide();
        Core.Events.addEvent("slide_in", function(){
            sl.slideIn();
        });
        Core.Events.addEvent("slide_out", function(){
            sl.slideOut();
        });
        Core.Events.addEvent("slide_show", function(){
            sl.show();
        });
        Core.Events.addEvent("slide_hide", function(){
            sl.hide();
        });
    } 
    catch (e) {
        trace(e);
    }
    
});
