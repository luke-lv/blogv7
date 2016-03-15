/**
 * @fileoverview 由于编辑标题那里写成了独立函数，因此只需要引入文件即可，
 * 				 但为了符合开发规则，所以将此文件定义在job中，使得conf中引入的都是jobs目录下的文件
 * @author xinyu@staff.sina.com.cn
 */

$import('other/modifyTitle.js');
$import('sina/core/events/stopEvent.js');

$registJob('modifytitle',function(){
	if($E('modifytitle')){
		Core.Events.addEvent($E('modifytitle'), function(evt){
			Core.Events.stopEvent(evt);
			Lib.modifyTitle();
		});
    }
});
