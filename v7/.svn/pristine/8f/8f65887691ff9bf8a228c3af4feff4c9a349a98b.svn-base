/**
 * @fileoverview 即拥有围脖又拥有博客的用户，提示他们增加组件
 * @author xinyu@staff.sina.com.cn
 * @created 2010-02-10
 */
$import("sina/sina.js");
$import("sina/core/array/findit.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/insertAfter.js");
$registJob("addWeibo", function(){
    if (MbloguM && MbloguM == "1") {
    
        var parent = $E('feed_center_span');
        var tmpl = ['<div class="centerLayer">', '<p class="centerLayer_txt">“立刻添加微博组件，让你的博客与微博更紧密！”</p>', '<p class="centerLayer_btn"><a href="#" onclick="return false;" id="addWebo1"><img alt="" src="http://simg.sinajs.cn/blog7style/images/center/layerbtn.gif"></a></p>', '<a title="关闭" class="centerLayer_close" href="#" onclick="return false;" id="addWebo2"><img alt="" src="http://simg.sinajs.cn/blog7style/images/center/layerclose.gif"></a>', '</div>'];
        Core.Dom.insertHTML(parent, tmpl.join(""), "AfterBegin");
        
        Core.Events.addEvent($E('addWebo1'), function(){
            var upgrade = new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_clone.php?productid=0x00000001&suid=1259295385&uid=" + scope.$uid + "&moduleid=93&cwidth=21&version=7", "jsload");
            upgrade.request({
                onSuccess: function(){
					window.location.href="http://blog.sina.com.cn/u/"+scope.$uid;
                },
                onError: function(){
                }
            });
            $E('addWebo2').parentNode.style.display = "none";
        });
        
        Core.Events.addEvent($E('addWebo2'), function(){
            $E('addWebo2').parentNode.style.display = "none";
        });
    }
});
