$import("sina/core/class/oop.js");
$import("sina/core/events/eventDispatcher.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/flash/swfObject.js");
$import("sina/core/math/getUniqueId.js");

$import("lib/lib.js");
$import("lib/register.js");
$import("lib/listener.js");
$import("lib/apply.js");
/**
 * @fileoverview 托盘新消息加载数据类
 发送消息：
 tray-newmsg-loaded 用户新消息
 article-msg-loaded 文章是否被评论
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-17
 */
Lib.register("tray.MsgLoader", function(lib){
    var addFlash = function($flash){
        var $wrapper = $C('div');
        $wrapper.style.cssText = 'position:absolute;top:-1000px;left:-1000px;';
    document.body.appendChild($wrapper);
    $flash.write($wrapper);
  }
  var random="", FlaDom;
    
    if(window.$Maxthon||window.$360||window.$TT){
        random="?t="+Core.Math.getUniqueId();
    }

    var msgLoader = function(cfg){
        lib.apply(this, cfg);
        if (!FlaDom) {// flash已经加载 使用同一个flash
            try{
                var FlashPlayer = new Utils.Flash.swfObject($_GLOBAL.flashBasicURL
                         + "blogMessageReminding.swf"+random, 
                         "__msgTipsPlayer", "1px", "1px", "9", "#00ff00");
            
                FlashPlayer.addParam("quality", "high");
                FlashPlayer.addParam("wmode", "transparent");
                FlashPlayer.addParam("allowScriptAccess", "always");
                FlashPlayer.addParam("freeTime", 27 * 1000);
                //FlashPlayer.addVariable("readyFun", readyFun);
                if ('complete' === document.readyState) {
                    addFlash(FlashPlayer);
                    FlaDom = $E("__msgTipsPlayer");
                } else {
                    _addEvt(window, function(){
                        addFlash(FlashPlayer);
                        FlaDom = $E("__msgTipsPlayer");
                    }, 'load');
                }
            } catch(e) {
                //console.log('tray.MsgLoader:', e);
            }
            
        }
    }.$define({
        time : 30,

        // url : 'http://comet.blog.sina.com.cn/notice',
        url : 'http://comet.blog.sina.com.cn/api?maintype=notice',
        
        getFlaDom : function(){
            return FlaDom;
        },

        play : function(){
            
            if ($_GLOBAL.msgPlaySound && FlaDom && FlaDom.PlaySound) {
                try {
                    FlaDom.PlaySound();
                } catch(e) {
                    //console.log(e);
                }
            }
        },

        load : function(uid, cb){
            
            var $this = this;
            var blogid = scope.$articleid || '';
            if (!uid) {
                return;
            }
            
            Utils.Io.JsLoad.request(this.url, {
                GET : {
                    uid : uid || '',
                    blogid : blogid
                },
                onComplete  : function(r){
                    if (r && 'A00006' == r.code) {

                        var d, articleMsg;

                        if (uid && (d = r.data[uid])){
                            //TODO 上线去掉
                            //gbook、message、invite、unreadsys
                            /*d = {
                                // feedNum
                                "feed":0,

                                // popleNum
                                "gbook":0,
                                "message":1,
                                "invite":0,
                                "unreadnotices":0,
                                "notice":0,

                                //likeNum
                                "blogcomment":0,
                                "photocomment":0,
                                "like":0,
                                "notice_favourite":0,
                                "notice_quote":0
                            }*/
                            // var mineNum = d.gbook + d.message + d.invite + d.unreadnotices + d.notice;
                            // var likeNum = d.like + d.notice_quote + d.notice_favourite + d.blogcomment + d.photocomment;
                            var userMsg = {};
                            userMsg.sum = 0;
                            for(var k in d){//总数
                                userMsg[k] = d[k];
                                userMsg.sum += d[k];
                            }
                            userMsg.blogrecomment = userMsg.blogrecomment ? userMsg.blogrecomment : 0;
                            
                            // {
                            //     "feed" : d.feed, 
                            //     "mine" : mineNum,
                            //     "like" : d.like,
                            //     "blogcomment":d.blogcomment,
                            //     "photocomment":d.photocomment,
                            //     "notice":d.notice,
                            //     "message":d.message,
                            //     "gbook":d.gbook
                            // };
                            lib.Listener.notify('tray-newmsg-loaded', userMsg);
                        }
                        
                        if (blogid && (articleMsg = r.data[blogid])) {
                            // {"uid":"3207809801","nick_name":"\u658c\u79d1\u6d4b\u8bd531","cms_id":3146746,"time":1366251178}
                            lib.Listener.notify('article-msg-loaded', articleMsg);
                        }
                        
                    }
                    //$this.dispatchEvent('complete', r);
                },
                onException : function(){},
                timeout : 10000
            });
        }
    });

    return msgLoader;
});
