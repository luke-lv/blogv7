/**
 * @fileoverview 在线编辑相片
 * @author luorui | luorui1@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("lib/ticket.js");

$registJob('photoEditFlash', function() {
	var sa = window.setArgs;
	window.setArgs = function(ticket){
		if (!ticket){
			ticket = 'Failed';
		}
		//alert('get ticket: '+ticket);
		sa(ticket);
	};
	window.$getTicket = function(func) {
		Lib.Ticket.get({
			success: function(result) {
				if (!result){
					func('Failed');
					return;
				}
				func(result.ticket[0]);
			},
			fail: function() {
				func('Failed');
			}
		}, 1);
	};
});
