/**
 * @fileoverview 用户向导job
 * @author xy xinyu@staff.sina.com.cn
 * @date 2009-10-19
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import('sina/utils/excBeforeCloseWin.js');
$import("lib/jobs.js");
$import("lib/sysmsg.js");
$import("lib/msg/systemMSG.js");
$import("pageSet/initialVars.js");
$import('pageSet/singleFunc/funcMoveUpDown.js');
$import('pageSet/singleFunc/funcChangeFormat.js');
$import('pageSet/singleFunc/funcEditCustomComp.js');
$import("pageSet/singleFunc/funcSave.js");
$import("pageSet/singleFunc/funcCancel.js");
$import("pageSet/guide/guideJump.js");
$import("pageSet/guide/guide.js");

$registJob('guideM', function(){
    $E('topSettingBlkTmp').style.display = 'none';
    $E('topSettingBlk').style.display = '';
//    $E('topSetting').style.marginTop = '0px';
    window.guideTabs=new guideTabs($E('userGuideUL'));
    if($E('adps_person')){
		$E('adps_person').parentNode.removeChild($E('adps_person'));
	}
    funcChangeFormat.addNoneDiv();
    
    Core.Events.addEvent($E('savaPageSet'), funcSave, 'click');
    Core.Events.addEvent($E('cancelPageSet'), funcCancel, 'click');
    Core.Events.addEvent($E('morePageSet'), guideJump, 'click');
    
    
    var hiddendiv = $E('hiddendiv');
    if (!hiddendiv) {
        hiddendiv = $C('div');
        hiddendiv.id = 'hiddendiv';
        hiddendiv.style.display = "none";
        document.body.appendChild(hiddendiv);
    }
    
    var funcs = function(){
        window.getVars();
        var _default = new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_template_manager.php", "ajax");
        _default.request({
            POST: window.postdata,
            onSuccess: function(){
            },
            onError: function(data){
            }
        });
    };
    
    Utils.excBeforeCloseWin('离开页面导致数据丢失！', '将要离开页面，是否保存？', funcs);
});
