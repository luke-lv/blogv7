/**
 * @Fileoverview 博客app推广页面广告 | 个人博客首页,列表页,博文详情页,个人中心,相册首页,相册详情页
 * @author fuqiang@staff.sina.com.cn
 * @date 2014/04/24
 */

$import("lib/lib.js");
$import("lib/register.js");
$import("lib/panel.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import('sina/core/events/stopDefaultEvent.js');
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/getElementsByClass.js");
$import("lib/execZhitou.js");

Lib.register('blogAppAd', function (lib) {
    /**start*/ 
    //投放广告代码 投放后该位置广告那边可控制其投放内容，而且他们投放时将屏蔽原旧广告(新阅天下)由这边脚本渲染的
    //jiangwei5 2014-09-18
    function scrollAdLeft (){
        Core.Dom.insertHTML(document.body, '<div id="sinaads_pdps54771"></div>', 'beforeend');
        
        var cookieKeyName = "sinaads_blogAppAd_" + scope.$PRODUCT_NAME + scope.$pageid;
        if (document.cookie.indexOf(cookieKeyName) === -1) {
            var insdiv = document.getElementById("sinaads_pdps54771");
            insdiv.innerHTML = ' <ins class="sinaads" data-ad-pdps="PDPS000000054771"></ins>  ';
            (sinaads = window.sinaads || []).push({
                params: {
                    sinaads_ls_root: 'sinablogbody',
                    sinaads_ls_cookieKey: cookieKeyName

                }
            });
            // 设置cookie屏蔽旧广告
            var expires = new Date();
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
            document.cookie = "blogAppAd_" + scope.$PRODUCT_NAME + scope.$pageid + '=1; expires=' + expires.toGMTString();
        }
    }
    lib.execZhitou(function (){
        scrollAdLeft();
    });
    /**end*/
    
    var Panel = lib.Panel;
    var ad = new Panel();
    ad.init = function (root) {
        var cookieName = 'blogAppAd_' + scope.$PRODUCT_NAME + scope.$pageid;
        var blogappCookie = Utils.Cookie.getCookie(cookieName);
        if (blogappCookie == '1') {
            return;
        }
        var self = this;
        var baseUrl = 'http://comet.blog.sina.com.cn/qr?';
        var urlmap = {
            blog7indexM : 'http://blog.sina.com.cn/main_v5/ria/app_515_7.html',
            blog7index : 'http://blog.sina.com.cn/main_v5/ria/app_515_7.html',
            blog7articleM : 'http://blog.sina.com.cn/main_v5/ria/app_515_8.html',
            blog7article : 'http://blog.sina.com.cn/main_v5/ria/app_515_8.html',
            blog7articletj : 'http://blog.sina.com.cn/main_v5/ria/app_515_8.html',
            blog7articletjTech : 'http://blog.sina.com.cn/main_v5/ria/app_515_8.html',
            blog7icpprofile_index : 'http://blog.sina.com.cn/main_v5/ria/app_515_9.html',
            blog7articlelistM : 'http://blog.sina.com.cn/main_v5/ria/app_515_10.html',
            blog7articlelist : 'http://blog.sina.com.cn/main_v5/ria/app_515_10.html',
            blog7photoindex : 'http://blog.sina.com.cn/main_v5/ria/app_515_11.html',
            blog7photophoto : 'http://blog.sina.com.cn/main_v5/ria/app_515_12.html'
        };
        root = Core.Dom.getElementsByClass(null, 'div', root)[0];
        var realurl = urlmap[scope.$PRODUCT_NAME + scope.$pageid];
        if (!root || !realurl)
            return;
        var url = baseUrl + realurl;
        /*
        var template = '<div style="position:absolute;width:140px;height:330px; text-align:center;z-index:999;" id="#{panel}">\
        <a href="http://blog.sina.com.cn/lm/z/app/" target="_blank" style="position:absolute;top:0;left:0;width:140px;height:330px;text-decoration:none; "><img src="http://simg.sinajs.cn/blog7style/images/activity/app_tuiguang/ewm.gif" style="display:block">\
        <img src="'+url+'" width="70" height="70" style="display:block; margin:-117px auto 0" />\
        </a>\
        <span node-action="close" style="position:absolute;z-index:99;right:0px;bottom:0px;width:15px;height:15px;text-align:center;line-height:17px; overflow:hidden;border:1px solid #cbcbcb;cursor:pointer;font-size:15px; font-family:SimSun;font-weight:700;" title="关闭">&times;</span>\
        </div>';
         */
        var template = '<div style="position:absolute;width:140px;height:330px; text-align:center;z-index:999;" id="#{panel}">\
                                <a href="http://blog.sina.com.cn/s/blog_86f95d450102uzt1.html" target="_blank" ><img src="http://simg.sinajs.cn/blog7style/images/activity/app_tuiguang/activity.png" style="display:block;border:0 none;"></a>\
                                <a href="http://blog.sina.com.cn/s/blog_86f95d450102uzt1.html" target="_blank" style="background:#fff;border:1px solid #dbdbdb; border-top:0 none; height:117px; padding-top:5px; display:block; text-decoration:none;">\
                                    <img src="http://comet.blog.sina.com.cn/qr?http://blog.sina.com.cn/lm/z/xytx22/index.html" width="70" height="70" style="display:block; border:0 none; margin:0 auto 3px;">\
                                    <span style=" display:block;line-height:1;font-size:12px;margin-bottom:5px;color:#6e6e6e;text-align:center; font-family:Helvetica,\'Microsoft YaHei\'">新阅天下客户端</span>\
                                    <span style=" display:block;line-height:1;font-size:18px;color:#5f5f5f;text-align:center;font-family:Helvetica,\'Microsoft YaHei\';"> 扫一扫下载</span>\
                                    <span node-action="close" style="position:absolute;z-index:99;right:0px;bottom:0px;width:15px;height:15px;text-align:center;line-height:17px; overflow:hidden;border:1px solid #cbcbcb;cursor:pointer;font-size:15px;color:#5f5f5f; font-family:SimSun;font-weight:700;" title="关闭">×</span>\
                                </a>\
                            </div>';

        //var template = '<div style="position:absolute;width:144px;height:330px; text-align:center;z-index:999;" id="#{panel}"><a href="http://www.wenjuan.com/s/bq673a" target="_blank" ><img src="http://simg.sinajs.cn/blog7style/images/activity/app_tuiguang/hunsha.png" style="display:block;border:0 none;"></a><span node-action="close" style="position:absolute;z-index:99;right:0px;top:0px;width:15px;height:15px;text-align:center;line-height:17px;overflow:hidden;border:1px solid #cbcbcb;cursor:pointer;font-size:15px;color:#5f5f5f;background:#fff;font-family:SimSun;font-weight:700;" title="关闭">&times;</span></div>';
        /*
        var template = '<div style="position:absolute;width:160px;height:160px;" id="#{panel}">\
        <a href="http://t.cn/RhVz0rh" target="_blank"><img src="http://simg.sinajs.cn/blog7style/images/activity/app_tuiguang/weisurvey.jpg" style="display:block;border:0 none;"></a>\
        <span style="position:absolute;z-index:99;right:0px;top:0px;width:15px;height:15px;text-align:center;line-height:17px;overflow:hidden;border:1px solid #cbcbcb;cursor:pointer;font-size:15px;color:#5f5f5f;background:#fff;font-family:SimSun;font-weight:700;" title="关闭" node-action="close" >&times;</span>\
        </div>';
         */
        self.setTemplate(template);
        var templateWidth = parseInt(Core.Dom.getStyle(self.entity, 'width'), 10);
        var paddingTop = parseInt(Core.Dom.getStyle(root, 'paddingTop'), 10);
        var panelHeight = parseInt(Core.Dom.getStyle(self.entity, 'height'), 10);
        var marginLeft = 10;
        self.setFixed(true);
        resize();
        var closeBtn = Core.Dom.getElementsByAttr(self.entity, 'node-action', 'close')[0];
        function close() {
            Core.Events.stopDefaultEvent();
            ad.close();
            Core.Events.removeEvent(closeBtn, close);
            Core.Events.removeEvent(window, resize, 'resize');
            Utils.Cookie.setCookie(cookieName, '1', 24);
        }
        function winSize() {
            var e = window,
            a = 'inner';

            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width : e[a + 'Width'],
                height : e[a + 'Height']
            };
        }
        var resizeT;

        function resize() {
            // debugger;
            if (resizeT)
                clearTimeout(resizeT);
            resizeT = setTimeout(function () {
                    var maxHeight = winSize().height;
                    var rootOffset = Core.Dom.getXY(root);
                    var left = rootOffset[0] - templateWidth - marginLeft;
                    var top = rootOffset[1] + paddingTop;
                    left = left > 0 ? left : 0;
                    top = top + panelHeight > maxHeight ? maxHeight - panelHeight - 20 : top;
                    self.setPosition(left, top);
                },
                    300);
        }

        Core.Events.addEvent(closeBtn, close);
        Core.Events.addEvent(window, resize, 'resize');
        Core.Events.addEvent(window, resize, 'scroll');
        self.show();
    };
    return ad;
});
