/**
 * @fileoverview
 *	临时的job，用于绑定个人中心下'推荐活动'的一些事件
 * @author ZhihanHe | zhihan@staff.sina.com.cn
 * @version 1.0
 */
 
$registJob("moduleBind", function (){
	var link = $E('module_109_link');
	var img = $E('module_109_img');
	if(link) {
		link.onclick = function() {
			$CloneComp(109);
			Utils.Io.JsLoad.request('http://sina.allyes.com/main/adfclick?db=sina&bid=181511,226697,231717&cid=0,0,0&sid=220693&advid=3406&camid=32667&show=ignore', {
				onComplete: function(){
				}
			});
		}
	}
	if(img) {
		img.onclick = function() {
			$CloneComp(109);
			Utils.Io.JsLoad.request('http://sina.allyes.com/main/adfclick?db=sina&bid=181511,226697,231717&cid=0,0,0&sid=220693&advid=3406&camid=32667&show=ignore', {
				onComplete: function(){
				}
			});
		}
	}
});