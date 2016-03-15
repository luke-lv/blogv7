/**
 * @fileoverview 版本升级或降级的job
 * @author xy xinyu@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import('lib/interface.js');
$import('lib/dialogConfig.js');
$import('lib/msg/systemMSG.js');

$import('sina/core/dom/getChildrenByClass.js');
$import('sina/core/dom/getElementsByClass.js');
$import('sina/core/events/addEvent.js');
$import('sina/core/math/getRandomNumber.js');
$import('sina/core/system/getParam.js');

$registJob("gradeswap", function(){
    if ($E('isOver')) {
    }
    else {
        setTimeout(function(){
            try {
                window.location.href = window.location.href + "&" + new Date().getTime();
            } 
            catch (e) {
                //trace(e.message);
            }
        }, 120 * 1000);
    }
	
    var name = $T(Core.Dom.getChildrenByClass($E('upgrade_id'), 'content')[0], 'div')[0].innerHTML;
//    var upgradetpl = ['<div class="content"><div class="title">' + name + '</div>'
//                	, '<div class="yellow marginTop10">'
//                	, '<div class="loading"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"/><strong>升级中…</strong></div>'
//                	, '<div class="para">升级过程需要一段时间。升级成功后，会在此页面通知你。</div>'
//                	, '</div>'
//					, '<div class="tip marginTop15">如果你是第一次升级，升级后你将有一次回退到6.0的机会。如果你是第二次升级，升级将永久生效，不能再回退到6.0。</div></div>'].join("");
//    var downtpl = ['<div class="content"><div class="title">' + name + '</div>'
//                	, '<div class="yellow marginTop10">'
//                	, '<div class="loading"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"/><strong>回退中…</strong></div>'
//                	, '<div class="para">回退过程需要一段时间。回退成功后，会在此页面通知你。</div>'
//                	, '</div>'
//					, '<div class="tip marginTop15">在回退后你将还有一次机会重新升级到7.0。但第二次升级后，升级将永久生效，不可再回退到6.0。</div></div>'].join("");
//    
//	trace(Core.System.getParam('code')+"____");
	
    var upgrade = function(){
		
		// 涵涵修改 2009-10-29 16:58
		var url = "";
		if(Core.System.getParam('code')) {
			url = "http://control.blog.sina.com.cn/upgrade/upgrade_sel.php?version=7&code="+Core.System.getParam('code')+"&" + new Date().getTime();
		}
		else {
			url = "http://control.blog.sina.com.cn/upgrade/upgrade_sel.php?version=7&" + new Date().getTime();
		}
		
        var upgrade = new Interface(url, "ajax");
        upgrade.request({
            onSuccess: function(data){
                $E('upgrade_id').innerHTML = data;
//                $E('upgradelink').href = 'http://blog.sina.com.cn/u/' + data;
                
            },
            onError: function(data){
                if (data.code == 'A00004') {
                    window.location.href = "http://login.sina.com.cn/hd/signin.php?entry=blog&r=" + window.location.href;
                }
				else if(data.code=='A00010'){
					window.location.reload();
				}
                else {
                    winDialog.alert($SYSMSG[data.code], {
                        icon: "02",
                        funcOk: function(){
                            window.location.reload();
                        }
                    }, "tips");
                }
            }
        });
        
    };
    
    var downrade = function(){
        //trace("donwrade");
        var downrade = new Interface("http://control.blog.sina.com.cn/upgrade/down_sel.php?version=7&" + new Date().getTime(), "ajax");
        downrade.request({
            onSuccess: function(data){
                $E('upgrade_id').innerHTML = data;
//                $E('upgradelink').href = 'http://blog.sina.com.cn/u/' + data;
                setTimeout(function(){
                    try {
                        window.location.href = window.location.href + "&" + new Date().getTime();
                    } 
                    catch (e) {
                        //trace(e.message);
                    }
                    
                }, 120 * 1000);
            },
            onError: function(data){
                if (data.code == 'A00004') {
                    window.location.href = "http://login.sina.com.cn/hd/signin.php?entry=blog&r=" + window.location.href;
                }else if(data.code=='A00010'){
					window.location.reload();
				}
                else {
                    winDialog.alert($SYSMSG[data.code], {
                        icon: "02",
                        funcOk: function(){
                            window.location.reload();
                        }
                    }, "tips");
                }
            }
        });
    };
    
    
    if ($E('upgradebtn')) {
        Core.Events.addEvent($E('upgradebtn'), upgrade);
    }
    else 
        if ($E('okbtn')) {
            Core.Events.addEvent($E('okbtn'), downrade);
        }
		
	var updatedDom = Core.Dom.getElementsByClass(document, 'span', 'update_list_count')[0];
	updatedDom.innerHTML = "还有"+Core.Math.getRandomNumber(50, 500)+"位博友在陆续升级中";
});
