/**
 * @fileoverview 新版编辑器引导浮层
 * @author gaolei ｜ gaolei2@staff.sina.com.cn
 */
$import('sina/ui/panel.js');
$import('sina/core/dom/getXY.js');
$import('sina/core/events/addEvent.js');
$import('sina/utils/cookie/getCookie.js');
$import('sina/utils/cookie/setCookie.js');

$import('lib/onlyShadow.js');
$import("lib/sendLog.js");

$registJob("new_editor_guidelayer", function(){

    var noCookie = Utils.Cookie.getCookie('new_editor_guidelayer_'+scope.$uid) != 1,
        hasChangeNode = $E('new_editor');
        // ua = (scope.$UA && scope.$UA.toLowerCase()) || '',
        // isHigerIE = (/msie 10.0/.test(ua)) || /trident\/7.0/.test(ua),
        // canSupportBr = isHigerIE || $CHROME;

    if (!hasChangeNode){ // 没有节点，说明不再白名单，返回
        return;
    }

    if (noCookie){ // 没有cookie，且是支持的浏览器 显示浮层
        
        var panel = new Ui.Panel(),
            shadow = new Lib.OnlyShadow(0.2, document.body, '', {backgroundColor: '#000', zIndex: 0}),
            layerHTML = '<div id="#{entity}" class="b_old_cont">'+
                        '<a id="#{change_new}" class="b_old_change" href="javascript:;" title="切换新版"></a>'+
                        '<div class="b_old_box">'+
                            '<a id="#{btn_close}" class="b_close" href="javascript:;" title="关闭"></a>'+
                            '<a id="#{try_it_now}" class="b_btn" href="javascript:;" title="">马上试用</a>'+
                        '</div>'+
                    '</div>',
            layer = panel.setTemplate(layerHTML),
            pos = Core.Dom.getXY($E('SinaBlog_SLOT_44')),
            addEvent = Core.Events.addEvent;
        v7sendLog('11_01_01');
        shadow.show();
        layer.setPosition({
            x: pos[0] - 549,
            y: pos[1] - 30
        });
        layer.show();

        if (layer.nodes.btn_close){// 关闭按钮
            
            addEvent(layer.nodes.btn_close, function(){ 
                v7sendLog('11_01_03');
                layer.hide();
                shadow.close();
                Utils.Cookie.setCookie('new_editor_guidelayer_'+scope.$uid, 1, 24*30);
            });
        }

        if (layer.nodes.try_it_now){// 马上试用
            addEvent(layer.nodes.try_it_now, function(){
                v7sendLog('11_01_02');
                layer.hide();
                shadow.close();
                Utils.Cookie.setCookie('new_editor_guidelayer_'+scope.$uid, 1, 24*30);
                location.href = 'http://control.blog.sina.com.cn/admin/article/article_add.php?is_new_editor=1';
            });
        }

        if (layer.nodes.change_new){// 切换新版

            addEvent(layer.nodes.change_new, function(){
                layer.hide();
                shadow.close();
                Utils.Cookie.setCookie('new_editor_guidelayer_'+scope.$uid, 1, 24*30);
                location.href = 'http://control.blog.sina.com.cn/admin/article/article_add.php?is_new_editor=1';
            })
        }
    }

});

