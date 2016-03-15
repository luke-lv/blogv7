$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
/**
 * 博客托盘系统公告
 * @author 未知
 *
 */
$registJob("errorTips", function(){
    Lib.checkAuthor();
    function createNode(html){
        var elem = $C("div");
        elem.innerHTML = html;
        return elem.firstChild;
    }
    if($isLogin){
        Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/riaapi/warning.php", {
            GET:{
                uid: $UID
            },
            onComplete:function(result){
                
                if(result && result.iswarning == 1){
                    
                    var isShow = Utils.Cookie.getCookie('i8t9c'+$UID) !== result.date ? 'block' : 'none';
                    
                    var html = '<div id="err_i8t9c" class="tb_layer_Y tb_layer_w6" style="display:'+isShow+';z-index:500;position:absolute;top:-300px;">' +
                        '<div class="tb_layer_arrow" style="margin:0 0;left:219px"></div>' +
                        '<div class="tb_layer_Y_main">' +
                            '<div class="tb_mas">' +
                                '<span style="float:right;"><a class="conn" href="javascript:;" onclick="scope.i8t9c()">×</a></span>' +
                            '</div>' +
                            '<div class="tb_mas">' +
                                result.msg + '<p style="text-align:center;padding:6px;"><input type="button" value="知道了" onclick="scope.i8t9c()" /></p></div>' +
                                //'sdfew进口商进可攻四大皆空的空间飞呃精加工efe<p style="text-align:center"><input type="button" value="知道了" onclick="$E(\'err_i8t9c\').style.display=\'none\'" /></p></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                    scope.i8t9c = function(){
                        $E('err_i8t9c').style.display = 'none';
                        Utils.Cookie.setCookie('i8t9c'+$UID, result.date, 8760, '/'); //为防止其他页面使用此保存cookie代码,时间为一年
                        Utils.Cookie.setCookie('i8t9c'+$UID, result.date, 8760, '/', 'blog.sina.com.cn'); //为与博文也共享cookie,时间为一年
                    };
                    scope.i8t9c.show = function(){
                        $E('err_i8t9c').style.display = '';
                        updatePos();
                    }
                    var errorTips = createNode(html);
                    document.body.appendChild(errorTips);
                    
                    var act = $E('loginBarActivity'), txt;
                    var target = createNode('<div class="topbar_activity"><a href="javascript:;" onclick="scope.i8t9c&&scope.i8t9c.show();">[公告]</a></div>');
                    act.parentNode.insertBefore(target, act);
                    //顶托广告通过广告后台管理
                    // txt = act.innerText||act.textContent||'';
                    // if(txt.length>10){
                    //     act.children[0].innerHTML = txt.substr(0,9)+'...';
                    // }
                    
                    setTimeout(updatePos,10);
                    
                    Core.Events.addEvent(window, function(){
                        updatePos();
                    },"resize");
                    Core.Events.addEvent(window, function(){
                        setTimeout(function(){
                            var currentTop = document.documentElement.scrollTop + document.body.scrollTop;
                            if (oldSrcollTop == currentTop) {
                                updatePos();
                            } else {
                                oldSrcollTop = currentTop;
                            }
                        }, 30)
                        
                    }, "scroll");
                    var oldSrcollTop = document.documentElement.scrollTop + document.body.scrollTop;

                    function updatePos(){
                        var pos=Core.Dom.getXY(target);
                        var width = errorTips.offsetWidth;
                        errorTips.style.visibility = "inherit";
                        errorTips.style.top=pos[1]+23+"px";
                        errorTips.style.left=pos[0]-width+41+"px";
                    }
                }
                
            }
        });
    }
    
});
