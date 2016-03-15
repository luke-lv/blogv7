/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * @desc for 图片上传成功以后对图片的相关信息的修改
 * @ title,desc,tag
 */


$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/trim.js");
$import('sina/utils/limitLength.js');
$import("lib/interface.js");

$import("sina/utils/io/ajax.js");
$import("msg/transcode.js");
$import("common/BF.js");


$registJob("photoInfo",function(){
	for (i = 0; i < $E('picCount').value; i++) {
		Core.Events.addEvent($E('txtTitle_' + i), function(e){
			var self = e.srcElement || e.target;
			self.select();
		}, 'focus', false);
		Core.Events.addEvent($E('txtTitle_' + i), function(e){
			var self = e.srcElement || e.target;
		    Utils.limitLength(self,50);
		
		}, 'paste', false);
		Core.Events.addEvent($E('txtTitle_' + i), function(e){
			var self = e.srcElement || e.target;
		    Utils.limitLength(self,50);

		}, 'keyup', false);
		Core.Events.addEvent($E('txtDesc_' + i), function(e){
			var self = e.srcElement || e.target;
			self.select();
		}, 'focus', false);
		Core.Events.addEvent($E('txtDesc_' + i), function(e){
			var self = e.srcElement || e.target;
		    Utils.limitLength(self,500);
		
		}, 'paste', false);
		Core.Events.addEvent($E('txtDesc_' + i), function(e){
			var self = e.srcElement || e.target;
		    Utils.limitLength(self,500);
		}, 'keyup', false);
		Core.Events.addEvent($E('txtTag_' + i), function(e){
			var self = e.srcElement || e.target;
			self.select();
		}, 'focus', false);
		Core.Events.addEvent($E('txtTag_' + i), function(e){
			var self = e.srcElement || e.target;
			get_tagLen(self);
		}, 'keyup', false);
	}
	
	ChangePhotoInfo = {
		su: function(){
			var i;
			var str = '';
			var picIds = [];
			var photo_id = Core.Dom.getElementsByClass(document, "div", "pic");

			for(var j = 0;j<photo_id.length;j++){
				var currentA = photo_id[j].getElementsByTagName('a');
				var currentId = currentA[0].href.split('/')[2];
				picIds.push(currentId);
			}
			
			this.supdate();
		},
		
		supdate: function(){
			
			var op = {
				onSuccess: function(res){
					document.location.href = DOMAIN+'/u/' + scope.visitor.uid;
				},
				onError: function(res){
					callErr(res.code);
				}
			};
			op.POST = {};
			for (i = 0; i < $E('picCount').value; i++) {
				op.POST['txtTitle_' + i] = $E('txtTitle_' + i).value.replace(/(^ *| *$)/g,'');
				op.POST['txtDesc_' + i] = $E('txtDesc_' + i).value.replace(/(^ *| *$)/g,'');
				op.POST['txtTag_' + i] = $E('txtTag_' + i).value.replace(/(^ *| *$)/g,'');
				op.POST['picid_'+i] = $E('picid_'+i).value.replace(/(^ *| *$)/g,'');
				
			}
			
			phpENTRY["changeInfo"].request(op);
		}
	};	

	Core.Events.addEvent($E('saveChange'),
		function(e){
			ChangePhotoInfo.su();
		},
		'click',
		false
	);
});
