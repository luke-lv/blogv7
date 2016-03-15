

$import("comps/5years/myFriends.js");
$import("jobs/5years/gameLogic.js");

(function(){
	var inst = Comps.myFriends({
		box:			$E("invite_friends"),
		activityName:	"festival",
		paginalHeads:	27,
		
		callback:		function(res){
			var _len = inst.getSelectedNum();
			res.friends_qty = _len;
			
			Comps.gameLogic("myFriends", res);
			
		}
	});
	
})();


