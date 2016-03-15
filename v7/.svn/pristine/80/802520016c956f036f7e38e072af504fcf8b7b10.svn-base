/**
 * @fileInfo   未读消息提示浮层
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-06-18
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/getXY.js");
$import("lib/panel.js");
Lib.register('tray.unReadMsgPanel', function(lib){
    var unReadMsgPanel = Core.Class.define(function(ele) {
        lib.Panel.prototype.initialize();
        if(scope.$pageid == "editor"){
            return;
        }
        this._lockstate = 0;//锁定状态用户点击关闭以后锁死，不会再次显示
        this._scrolling = 0;//托盘是否处于滚动状态，默认为否
        this._srcPot = ele;//参照点即托盘消息节点
        var template = ['<div class="cor"></div>',
                          '<div class="bd">',
                            '<a href="#" id="j-unread-msg-close" class="close" title="关闭">×</a>',
                            '<ul id="j-unre-list">',
                            '</ul>',
                          '</div>'].join("");                         
        this.setTemplate('<div class="messageTips" id="#{panel}" style="left:850px; top:10px;">'+template+'</div>');
        this.entity.style.zIndex = 500;
        this._bindEvent();
    }, lib.Panel, {
        show:function() {
            if(this.isShow){
                return;
            }
            v7sendLog("40_02_01");
            this.entity.style.display="";
            this._srcPot&&this._srcPot.setAttribute("unread-show-state",1);
            this.isHidden = !1;
            this.isShow = !0;
            if (this.backIframe) {
                this._updateBackIframe();
                this.backIframe.style.display="";
            }
            lib.Listener.notify('tray-unread-panel-show',{});//显示时对外发广播
        },
        //隐藏后需要告诉外界当前展开状态
        hide:function() {
            lib.Panel.prototype.hide.call(this);
            this._srcPot&&this._srcPot.setAttribute("unread-show-state",0);
            lib.Listener.notify('tray-unread-panel-hide',{});//隐藏时对外发广播
            // body...
        },
        _updatePanelIframe:function() {
            if (this.backIframe) {
                this._updateBackIframe();
            }
        },
        //更新tab内容
        _updateCont:function(data){
            var _list = [];
            if((data.comment + data.message + data.notice + data.gbook) == 0){
                this.hide();
                return;
            }
            if(data.comment>0){
                _list.push('<li>'+ data.comment +'条新评论，<a onclick="v7sendLog(\'40_02_02\')" href="http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1">查看评论</a></li>');
            }
            if(data.message>0){
                _list.push('<li>'+ data.message +'条新纸条，<a onclick="v7sendLog(\'40_02_03\')" href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1">查看纸条</a></li>');
            }
            
            if(data.gbook>0){
                _list.push('<li>'+ data.gbook +'条新留言，<a onclick="v7sendLog(\'40_02_04\')" href="http://i.blog.sina.com.cn/blogprofile/wall.php">查看留言</a></li>');
            }
            if(data.notice>0){
                var sysurl = {
                    "notice":"http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote",
                    "like":"http://i.blog.sina.com.cn/profilelist/profilelikelist.php",
                    "notice_favourite":"http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice",//收藏
                    "notice_quote":"http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice",//转载
                    "invite":"http://control.blog.sina.com.cn/blogprofile/profileinvitelist.php",//好友邀请消息数
                    "unreadnotices":"http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice",//未读消息数（包含邀请反馈、关注等）
                    "point":"http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_note.php"//未读消息数（积分）
                }
                var url = sysurl.notice;
                for(var key in data.notices){
                    if(data.notices[key] > 0){
                        url = sysurl[key] || url;
                        break;
                    }
                }
                _list.push('<li>'+ data.notice +'条新通知，<a onclick="v7sendLog(\'40_02_05\')" href="'+ url +'">查看通知</a></li>');
            }
            $E("j-unre-list").innerHTML = _list.join("");
            this.show();
            this._setThePos();
        },
        //设定位置
        _setThePos:function() {
            //this.show();
            var pop = Core.Dom.getXY(this._srcPot);
            var sv = this._srcPot.className == "link" ? -2 : 0 ;//class不一样位置有偏差
            var width = ($IE7 || $IE6) ? this.entity.offsetWidth : this.entity.clientWidth;
            if(pop[0]){
                var x = pop[0] + this._srcPot.clientWidth - width + sv;
                var _y = 0;
                if(this._srcPot.getAttribute("adshow") == 1 && this._scrolling == 0){
                    _y = pop[1];
                }
                var y = this._srcPot.clientHeight + _y + 10;
                this.setPosition(x,y);
            }
        },
        //绑定事件
        _bindEvent:function() {
            var _this = this;
            Lib.Listener.on({
                name : "tray-newmsg-loaded",
                callBack : function(data){
                    if(_this._lockstate){//锁定状态为1时不执行显示操作
                        return;
                    }
                    //var _top = Core.Dom.getTop(_this._srcPot);
                    _this._eventHandle(data);
                    _this._setThePos();
                }
            });
            Lib.Listener.on({//托盘开启fix状态
                name : "tray-scrolling-fix",
                callBack : function(data){
                    _this._scrolling = 1;
                    if(_this._lockstate){//锁定状态为1时不执行显示操作
                        return;
                    }
                    _this.setFixed(1);
                    _this._setThePos();
                }
            });
            Lib.Listener.on({//托盘解除fix状态
                name : "tray-scrolling-nofix",
                callBack : function(data){
                    _this._scrolling = 0;
                    if(_this._lockstate){//锁定状态为1时不执行显示操作
                        return;
                    }
                    _this.setFixed(0);
                    _this._setThePos();
                }
            });
            Lib.Listener.on({//顶部广告出现时更新位置
                name : "topad680-show-end",
                callBack : function(data){
                    _this._srcPot.setAttribute("adshow",1);
                    if(_this.isShow){
                        _this._setThePos();
                    }
                }
            });
            Core.Events.addEvent($E("j-unread-msg-close"),function(e) {
                var evt = e || window.event;
                if(evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue=false;
                };
                _this.hide();
                _this._lockstate = 1;
            },"click");
            Core.Events.addEvent(window,function() {
                if(_this.isShow){
                    _this._setThePos();
                }
                // body...
            },"resize")
        },
        //事件句柄
        _eventHandle:function(data) {
            // body...
            var _data = {};
            _data.comment = (data.blogcomment-0) + (data.photocomment-0) + data.blogrecomment;//评论
            _data.notice  = data.notice + data.like + data.notice_favourite + data.notice_quote + data.invite + data.unreadnotices + data.point;//通知(包含喜欢、收藏、转载、关注、好友邀请、好友邀请的处理结果)
            _data.notices = {"notice":data.notice,"like":data.like,"notice_favourite":data.notice_favourite,"notice_quote":data.notice_quote,"invite":data.invite,"unreadnotices":data.unreadnotices,"point": data.point};//用于判断输出什么连接
            _data.message = data.message;//纸条数
            _data.gbook   = data.gbook;//留言
            this._updateCont(_data);

        }
    });
    return unReadMsgPanel;
});

    
