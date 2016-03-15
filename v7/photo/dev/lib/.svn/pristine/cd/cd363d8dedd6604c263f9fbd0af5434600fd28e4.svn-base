/**
 * @fileInfo   消息概要提示面板
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-04-19
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/getXY.js");
$import('lib/util/json.js');
$import("lib/panel.js");
Lib.register('tray.msgSummaryPanel', function(lib){
    var JSON = lib.util.JSON;
    var nolist = [
            '<li><a onclick="v7sendLog(\'40_02_12\')" href="http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1"><span class="icoms_comment"></span>查看评论</a></li>',
            '<li><a onclick="v7sendLog(\'40_02_13\')" href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1"><span class="icoms_tips"></span>查看纸条</a></li>',
            '<li><a onclick="v7sendLog(\'40_02_14\')" href="http://i.blog.sina.com.cn/blogprofile/wall.php"><span class="icoms_message"></span>查看留言</a></li>',
            '<li><a onclick="v7sendLog(\'40_02_15\')" href="http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice"><span class="icoms_notice"></span>查看通知</a></li>'
        ];
    var msgSummaryPanel = Core.Class.define(function(ele) {
        lib.Panel.prototype.initialize();
        this._srcPot = ele;//参照点即托盘消息节点
        this._lock = 1;//第一次显示标识
        this._scrolling = 0;//托盘是否处于滚动状态，默认为否
        this._requirestate = 1;//是否请求notelist接口标识，默认为1
        this._nums = {};//保存消息数
        var template = ['<div class="bd">',
                            '<ul id="j-summary-list">',
                                nolist.join(""),
                            '</ul>',
                          '</div>'].join("");                         
        this.setTemplate('<div class="messageBox" id="#{panel}">'+template+'</div>');
        this.entity.style.zIndex = 500;
        this._bindEvent();
        this._initNums();
    }, lib.Panel, {
        show:function() {
            // if(this.isShow){
            //     return;
            // }
            var _this = this;
            if(this._checkNumChange()){
                this._updateCont();
            }else{
                this._showAction();
            }
            
        },
        //显示
        _showAction:function(){
            if(this.isHidden){
                this._srcPot&&this._srcPot.setAttribute("msg-panel-show-state",1);
                this.entity.style.display="";
                this.isHidden = !1;
                this.isShow = !0;
                if (this.backIframe) {
                    this._updateBackIframe();
                    this.backIframe.style.display="";
                }
                this._setThePos();
            }else{
                this._setThePos();
            }
        },
        //检查数据有没有更新过
        _checkNumChange:function(){
            var oldnum = this._srcPot.getAttribute("msg-count");
            var newnum = this._srcPot.getAttribute("old-msg-count");
            if(oldnum == newnum){
                return false;
            }else{
                return true;
            }
            // body...
        },
        //隐藏后需要告诉外界当前展开状态
        hide:function() {
            lib.Panel.prototype.hide.call(this);
            this._srcPot&&this._srcPot.setAttribute("msg-panel-show-state",0);
            lib.Listener.notify('tray-msg-panel-hide',{});//隐藏时对外发广播
        },
        _initNums:function(){
            var data = JSON.parse(this._srcPot.getAttribute("msg-count"));
            this._formatData(data);
        },
        //设定位置
        _setThePos:function() {
            if ($IE6 || $IE7 || $IE8){
                this.entity.style.width = "auto";
            }
            var pop = Core.Dom.getXY(this._srcPot);
            var sv = this._srcPot.className == "link" ? -2 : 0 ;//class不一样位置有偏差
            var width = ($IE7 || $IE6) ? this.entity.offsetWidth : this.entity.clientWidth;
            var x = pop[0] + this._srcPot.clientWidth - width + sv;
            var _y = 0;
            if(this._srcPot.getAttribute("adshow") == 1 && this._scrolling == 0){
                if ($IE6 || $IE7 || $IE8){
					_y = pop[1] - 2;
				}else{
					_y = pop[1];
				}
            }
            var y = this._srcPot.clientHeight + _y + 1;
            if ($IE6 || $IE7 || $IE8){//ie变态bug 宽度设置两次才生效
                this.entity.style.width = this.entity.clientWidth + 1 + "px";
                this.entity.style.width = this.entity.clientWidth - 1 + "px";
            }
            this.setPosition(x,y);
            
        },
        _updatePanelIframe:function() {
            if (this.backIframe) {
                this._updateBackIframe();
            }
        },
        //更新tab内容
        _updateCont:function(fun){//[todo]数字没变化时不更新
            var _list = [];
            var _this = this;
            // if(this.isHidden && this._lock == 0){
            //     return;
            // }
            this._lock = 0;
            if(this._requirestate){
                this._getDate(
                    {},
                    function(_data){
                        _list.push(_this._getComment(_data));
                        _list.push(_this._getMessage(_data));
                        _list.push(_this._getGbook(_data));
                        _list.push(_this._getNotice(_data));
                        //_this._setThePos();
                        $E("j-summary-list").innerHTML = _list.join("");
                        _this._srcPot.setAttribute("old-msg-count",_this._srcPot.getAttribute("msg-count"));
                        if($IE6){
                            $E("j-summary-list").style.width = "270px";
                        }
                        _this._showAction();
                        //_this._setThePos();
                    },
                    function(_data){
                        
                    }
                )
                this._requirestate = 0;//置为不请求新接口
            }
            
        },
        //获取接口数据
        _getDate:function(opt,funsuc,funerr) {
            funsuc = funsuc || function(){};
            funerr = funerr || function(){};
            // if(opt.num<=0){//消息数为0时不请求接口[todo]
            //     funerr({num:0});
            //     return;
            // }

            var _this = this;
            Lib.checkAuthor();
            var inter = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/notelist.php", "jsload");
            inter.request({
                GET: {uid:$UID},
                onSuccess: function(result){
                  //result = _this._transformData(result);
                  funsuc(result)
                  //alert(JSON.stringify(result))
                }.bind2(this),
                onError: function(result){
                  funerr({num:0});
                }.bind2(this),
                onFail: function(){
                  funerr({num:0});
                }.bind2(this)
            });

        },
        //获取用户头像地址，uid用户uid，size图片尺寸，默认为50
        _getUserPicUrl: function(uid, size) {
            var size = size || 50;
            var n = parseInt(uid) % 8 + 1;
            return "http://portrait" + n + ".sinaimg.cn/" + uid + "/blog/" + size;
        },
        //获取字符长度
        getLen: function(a) {
            if (!a){ 
                return 0;
            }
            var b = a.match(/[^\x00-\xff]/g);
            return a.length + (b ? b.length : 0);
        },
        //字符截断+...
        strTruncate: function(str, len, suffix) {
            str = str || "";
            if (typeof suffix == 'undefined') {
                suffix = "...";
            };
            return (this.getLen(str) > len) ? (this.truncete(str,len) + suffix) : str;

        },
        //字符截断
        truncete:function (b, c) {
            var d = b.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
                b = b.slice(0, d.slice(0, c).replace(/\*\*/g, " ").replace(/\*/g, "").length);
                this.getLen(b) > c && c > 0 && (b = b.slice(0, b.length - 1));
                return b
        },
        //获取vip图标
        getVipIcon: function(index) {
            if(!index){
                return "";
            }
            var vipicon = {
                1: {
                    icon: "SG_icon146",
                    info: "新浪个人认证"
                },
                2: {
                    icon: "SG_icon147",
                    info: "新浪机构认证"
                }
            };
            var index = index || 1;
            var pic = '<img class="SG_icon ' + vipicon[index].icon + '" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="13" title="' + vipicon[index].info + '" alt="' + vipicon[index].info + '" align="absmiddle" />'
            return pic;
        },
        //ie6下截断name
        _setNameforIE6:function(name) {
            if($IE6){
                return this.strTruncate(name,4);
            }else{
                return name;
            }
            // body...
        },
        //获取评论数据
        _getComment:function(_data) {
            var str = '';
            if(this._nums._comment>0){
                var data = _data.msg.cms;
                if(data.length>0){//cms不为空时
                var typemsg = {1:"评论了你的博文",2:"评论了你的图片",6:"回复了你的评论"}
                var typeurl = {
                            1:"http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1",
                            2:"http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=2",
                            6:"http://i.blog.sina.com.cn/blogprofile/profilereplylist.php"
                };
                var types = [];
                for(var i=0,len=data.length;i<len;i++){
                    var item = data[i];
                    var name = item.nick_name || item.name;
                    name = this._setNameforIE6(name);
                    var img = this._getUserPicUrl(item.uid,30);
                    var type = item.msg_type;
                    types.push(type);
                    var index = item.user_type || 0;
                    var time = item.time;
                    str += '<li><a onclick="v7sendLog(\'40_02_06\')" href="'+ typeurl[type] +'"><img src="'+ img + '"><em class="nl">'+ name + '</em>'+ this.getVipIcon(index) +'<em class="tm">'+ time +'</em>'+typemsg[type]+'</a></li>';
                }
                types.sort();
                if(this._nums._comment>3){
                    str += '<li class="lcount"><a onclick="v7sendLog(\'40_02_07\')" href="'+ typeurl[types[0]] +'">总共'+ this._nums._comment +'条新评论</a></li>';
                }else{
                    //[todo]是否做清空评论数相关操作
                    }
                }else{
                     str = nolist[0];
                }
            }else{
                str = nolist[0];//'<li><a href="http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1"><span class="icoms_comment"></span>查看评论</a></li>';
            }
            return str;
        },
        //获取纸条数据
        _getMessage:function(_data) {
            var str = '';
            if(this._nums._message>0){
                var data = _data.msg.note[0];
                var name = data.name || data.nick_name;
                name = this._setNameforIE6(name);
                var numstr = this._nums._message>1 ? '等'+this._nums._message+'人' : "";
                var index = data.user_type || 0;
                str += '<li class="bgc"><a onclick="v7sendLog(\'40_02_08\')" href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1"><span class="icoms_tips"></span><em class="nl">'+ name +'</em>'+ this.getVipIcon(index) + numstr +'发来纸条<em class="nr">查看纸条</em></a></li>';
            }else{
                str = nolist[1];//'<li><a href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1"><span class="icoms_tips"></span>查看纸条</a></li>';
            }
            return str;
        },
        //获取留言数据
        _getGbook:function(_data) {
            var str = '';
            if(this._nums._gbook>0){
                var data = _data.msg.note[1];
                var name = data.name || data.nick_name;
                if(name){
                    name = this._setNameforIE6(name);
                    var numstr = this._nums._gbook>1 ? '等'+this._nums._gbook+'人' : "给你";
                    var index = data.user_type || 0;
                    str += '<li class="bgc"><a onclick="v7sendLog(\'40_02_09\')" href="http://i.blog.sina.com.cn/blogprofile/wall.php"><span class="icoms_message"></span><em class="nl">'+ name +'</em>' + this.getVipIcon(index) + numstr +'留言<em class="nr">查看留言</em></a></li>'
                }
            }else{
                str = nolist[2];//'<li><a href="http://i.blog.sina.com.cn/blogprofile/wall.php"><span class="icoms_message"></span>查看留言</a></li>';
            }
            return str;
        },
        //获取通知数据//通知(包含喜欢13、收藏7、转载8、关注23、好友邀请3、好友邀请的处理结果9)
        _getNotice:function(_data) {
            var str = '';
            var _pronotice = 'http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice';
            var _sysnotice = "http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote";
            var typeurl = {
                        3:"http://control.blog.sina.com.cn/blogprofile/profileinvitelist.php",
                        7:_pronotice,
                        8:_pronotice,
                        9:_pronotice,
                        23:_pronotice,
                        55: "http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_note.php",
                        13:"http://i.blog.sina.com.cn/profilelist/profilelikelist.php",
                        100:_sysnotice,
                        101:_sysnotice,
                        102:_sysnotice,
                        103:_sysnotice,
                        104:_sysnotice,
                        105:_sysnotice,
                        106:_sysnotice,
                        107:_sysnotice,
                        108:_sysnotice,
                        109:_sysnotice,
                        110:_sysnotice,
                        111:_sysnotice,
                        112:_sysnotice
                    };
            if(this._nums._notice>0){
                var data = _data.msg.note[2];
                var type = data.msg_type||23;
                str +='<li class="bgc last"><a onclick="v7sendLog(\'40_02_10\')" href="'+ typeurl[type] +'"><span class="icoms_notice"></span>'+this._nums._notice+'条新通知<em class="nr">查看通知</em></a></li>';
            }else{
                str = nolist[3];//'<li><a href="http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote"><span class="icoms_notice"></span>查看通知</a></li>';
            }
            return str;
        },
        _bindEvent:function() {
            var _this = this;
            Lib.Listener.on({
                name : "tray-newmsg-loaded",
                callBack : function(data){
                    //var _top = Core.Dom.getTop(_this._srcPot);
                    _this._requirestate = 1;//消息数更新了,需要更新浮动层内容
                    _this._eventHandle(data);
                    //_this._setThePos();
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
            Lib.Listener.on({//顶部广告出现时更新位置
                name : "topad680-show-end",
                callBack : function(data){
                    if(_this.isShow){
                        _this._setThePos();
                    }
                }
            });
        },
        //事件句柄
        _eventHandle:function(data) {
            // body...
            this._formatData(data);
            if(this.isShow){
                this._updateCont();
            }
        },
        //数据格式化
        _formatData:function(data) {
            var _data = {};
            _data._comment = (data.blogcomment-0) + (data.photocomment-0) + data.blogrecomment;//评论
            _data._notice  = data.notice + data.like + data.notice_favourite + data.notice_quote + data.invite + data.unreadnotices + data.point;//通知(包含喜欢13、收藏7、转载8、关注23、好友邀请3、好友邀请的处理结果9)
            _data._message = data.message;//纸条数
            _data._gbook   = data.gbook;//留言
            this._cacheNums(data,_data);
        },
        //缓存数据
        _cacheNums:function(data,_data) {
            for(var k in data){//缓存原始数据
                this._nums[k] = data[k];
            }
            for(var key in _data){//缓存加工数据
                this._nums[key] = _data[key];
            }
            // body...
        }
    });
    return msgSummaryPanel;
});

    
