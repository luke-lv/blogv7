
$import("nickactivity/_NickAc.js");
$import("lib/util/hoverJq.js");
$import("sina/ui/tween/tweenStrategy.js");

NickAc.medalTween = function(){
	var getNickEl = $E("getNickEl");
	var medal = $E("getNickEl").children[0];
	var s,t;
	Lib.util.hoverJq({
        'elm': medal,
        'mouseenter': function(evt, el, index) {
			medal.style.top = 70 + "px";
        },
        'mouseleave': function(evt, el, index) {
			medal.style.top = 100 + "px";
        },
        'delay': 50
    });
};
