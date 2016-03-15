/**
 * @fileInfo   消息系统提醒消息处理中心
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-04-10
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/createElement.js");
$import("sina/ui/template.js");
$import("lib/checkAuthor.js");
$import("sina/core/system/queryToJson.js");
Lib.sysmsg = Lib.sysmsg || {};
Lib.sysmsg.RemindSource = Core.Class.create();
Lib.sysmsg.RemindSource.prototype = {
    initialize:function(ele) {
        this._box = ele;
        this._bindEvent();
        this._firstmsgtype = null;
    },
    tpl:{//模版
        //关注
        attention:['<li class="#{liclass}">',
                    '<div class="mInfo">',
                      '<div class="pic">#{upic}</div>',
                      '<div class="txt"><a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}关注了你的博客<span class="time">#{time}</span></div>',
                      '#{follow_state}',
                    '</div>',
                  '</li>'].join(""),
        //纸条
        slip:['<li class="#{liclass}">',
                '<div class="mInfo">',
                  '<div class="pic">#{upic}</div>',
                  '<div class="txt">',
                    '<a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}发来纸条<span class="time">#{time}</span>',
                  '</div>',
                '</div>',
                '<div class="mCon" style="#{hidecont}">',
                  '<div class="cor"></div>',
                  '<div class="txt">#{content}<a href="###" onclick="v7sendLog(\'40_01_34\');return false;" id="j-reply-link-#{random}" action-type="show-reply-tarea" action-data=\'{id:\"#{random}\"}\'>回复</a></div>',
                '</div>',
                '<div class="mCmt" style="display:none;" id="j-reply-#{random}">',
                  '<textarea id="j-reply-tarea-#{random}"></textarea>',
                  '<a href="###" onclick="v7sendLog(\'40_01_34\');return false;" title="发送" action-type="send-reply-btn" action-data=\'{id:\"#{random}\",uid:\"#{uid}\",msg_type:\"#{msg_type}\"}\'>发送</a>',
                '</div>',
              '</li>'].join(""),
        //留言
        leave:['<li class="#{liclass}">',
                '<div class="mInfo">',
                  '<div class="pic">#{upic}</div>',
                  '<div class="txt">',
                    '<a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}给你留言<span class="time">#{time}</span>',
                  '</div>',
                '</div>',
                '<div class="mCon" style="#{hidecont}">',
                  '<div class="cor"></div>',
                  '<div class="txt">#{content}<a href="###" onclick="v7sendLog(\'40_01_34\');return false;" onclick="javascript:return false;" id="j-reply-link-#{random}" action-type="show-reply-tarea" action-data=\'{id:\"#{random}\"}\'>回复</a></div>',
                '</div>',
                '<div class="mCmt" style="display:none;" id="j-reply-#{random}">',
                  '<textarea id="j-reply-tarea-#{random}"></textarea>',
                  '<a href="###" onclick="v7sendLog(\'40_01_34\');return false;" title="发送" action-type="send-reply-btn" action-data=\'{id:\"#{random}\",uid:\"#{uid}\",msg_type:\"#{msg_type}\"}\'>发送</a>',
                '</div>',
              '</li>'].join(""),
        //接受好友申请
        accept:['<li id="j-inviteli-#{invite_id}" class="#{liclass}">\n',
                    '<div class="mInfo">\n',
                      '<div class="pic">#{upic}</div>\n',
                      '<div class="txt">\n',
                        '<a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}接受了你的好友邀请<span class="time">#{time}</span>',
                      '</div>\n',
                    '</div>\n',
                '</li>\n'].join(""),
        //好友申请
        invite:['<li id="j-inviteli-#{invite_id}" class="#{liclass}">\n',
                    '<div class="mInfo">\n',
                      '<div class="pic">#{upic}</div>\n',
                      '<div class="txt">\n',
                        '<a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}请求加你为好友',
                        '<p class="addInfo"><span style="#{hidecont}">验证消息：#{content}</span><span class="time">#{time}</span></p>\n',
                      '</div>\n',
                      '<div class="addBtn" style="clear:both;"><a href="###" onclick="v7sendLog(\'40_01_34\');return false;" action-type="invite-accept-btn" action-data=\'{id:\"#{invite_id}\",uid:\"#{uid}\"}\'>接受</a><a href="#" action-type="invite-ignore-btn" action-data=\'{id:\"#{invite_id}\",uid:\"#{uid}\"}\'>拒绝</a></div>\n',
                    '</div>\n',
                '</li>\n'].join(""),
        //通知
        notice:['<li class="#{liclass}">',
                '<div class="mInfo">',
                  '<div class="pic">#{upic}</div>',
                  '<div class="txt">',
                    '<strong>[通知]</strong>亲爱的新浪博友',
                    '<p class="addInfo">#{content}</p>',
                  '</div>',
                '</div>',
               '</li>'].join(""),
        nodata:['<li class="nobd">',
                    '<div class="mSts">',
                      '<span class="none">没有新消息</span>',
                    '</div>',
                  '</li>'].join("")
    },
    //更新界面
    // 3：好友邀请
    // 4：留言
    // 5：纸条
    // 23：关注
    // 100以上都是系统消息
    updateView:function(opt,fun) {
        var _this = this;
        // this._getData(opt,function(data) {
        //     var html = _this._formatTpl(data);
        //     _this._box.innerHTML = html;
        //     fun && fun(data);
        // });
        this._getData(opt,
        function(data){//成功
            var html = _this._formatTpl(data);
            _this._box.innerHTML = html;
            data = data || {};
            data._firstmsgtype = _this._firstmsgtype;
            data.num = 1;
            fun && fun(data);
        },
        function(data) {//失败
            var html = _this.tpl.nodata;
            _this._box.innerHTML = html;
            data = data || {};
            data._firstmsgtype = _this._firstmsgtype;
            fun && fun(data);
        })
    },
    //数据转换，接口和事先约定有变化
    // 3：好友邀请
    // 4：留言
    // 5：纸条
    // 23：关注
    // 100以上都是系统消息
    // 9 : 接受了好友请求
    _transformData:function(result) {
        var type = {3:"invite",4:"leave",5:"slip",9:"accept",23:"attention"};
        var data = result.msg;
        var len = data.length;
        if(len > 0){
            for(var i = 0; i<len;i++){
                var key = data[i]["msg_type"];
                data[i]["msg_type"] = type[key] || "notice";
                if(i == 0){
                    this._firstmsgtype = type[key] || "notice";//第一条消息的类型,用来查看全部的跳转
                }
            }
        }
        return result;
    },
    //获取数据
    _getData:function(opt,funsuc,funerr) {
        funsuc = funsuc || function(){};
        funerr = funerr || function(){};
        if(opt.num<=0){//消息数为0时不请求接口[todo]
            funerr({num:0});
            return;
        }
        var _this = this;
        Lib.checkAuthor();
        var inter = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/notelist.php", "jsload");
        inter.request({
            GET: {uid:$UID},
            onSuccess: function(result){
              result = _this._transformData(result);
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
        // var data = {code:"A00006",
        //             data:[
        //                 {//关注
        //                     msg_type:"attention",
        //                     uid:2565370291,
        //                     name:"天天向上了没",
        //                     user_type:0,
        //                     time:"2013-04-08",
        //                     follow_state:0
        //                 },
        //                 {//纸条
        //                     msg_type:"slip",
        //                     uid:2979458810,
        //                     name:"天天向上了没",
        //                     user_type:0,
        //                     time:"2013-04-08",
        //                     slip_cont:"饿了,该吃饭去了!"
        //                 },
        //                 {//留言(只需对方的uid和msg内容就可以了)
        //                     msg_type:"leave",
        //                     uid:1951657750,
        //                     name:"天天向上了没",
        //                     user_type:0,
        //                     time:"2013-04-08",
        //                     leave_cont:"我来过了"
        //                 },
        //                 {//好友申请
        //                     msg_type:"invite",
        //                     uid:1740611531,
        //                     name:"等待女神",
        //                     user_type:1,
        //                     time:"2013-04-08",
        //                     invite_cont:"加我啊",
        //                     invite_id:132627259
        //                 },
        //                 {//通知
        //                     msg_type:"notice",
        //                     notice_cont:'博客365活动开始啦！博文目录页新增365栏目，让博客变身日历版式，还有贴心的预置功能，让你能够提前记录，所以，别忘了每天一篇博文哦！<span class="link">活动地址：<a href="#">http://t.cn/zdDFJDK</a></span>',
        //                     time:"2012-09-08 13:33:30"
        //                 }]
        //             };
        // var data = {
        //           "code": "A00006",
        //           "data": {
        //                 "msg": [{
        //                       "user_type": 0,
        //                       "name": "wangzheng",
        //                       "uid": "2376799101",
        //                       "msg_type": "23",
        //                       "follow_state": "",
        //                       "time": "2013-04-17 16:52:19"
        //                 }, {
        //                       "user_type": 0,
        //                       "name": "wangzheng",
        //                       "uid": "2376799101",
        //                       "msg_type": "5",
        //                       "slip_cont": "",
        //                       "time": "2013-04-17 15:49:22"
        //                 }, {
        //                       "user_type": 0,
        //                       "name": "wangzheng",
        //                       "uid": "2376799101",
        //                       "msg_type": "4",
        //                       "leave_cont": "",
        //                       "time": "2013-04-17 15:38:40"
        //                 }]
        //           }
        //     };
        // fun(data);
    },

    //格式化单条消息的模版
    _formatItemTpl:function(itemdata) {
        var tpl = this.tpl[itemdata.msg_type];
        if(tpl){
            var itemsTemplate = new Ui.Template(tpl);
            var itemhtml = itemsTemplate.evaluateMulti([itemdata]);
            return itemhtml;
        }else{
            return "";
        }
    },
    //格式化模版
    _formatTpl:function(data) {
        data = data.msg;
        var tpl = [];
        var len = data.length>3 ? 3 : data.length;
        for(var i=0; i<len; i++){
            var islast = (i == (len - 1)) ? 1 : 0;//是否是最后一条
            var itemdata = this._formatData(data[i],islast);//格式化数据
            tpl.push(this._formatItemTpl(itemdata));
        }
        return tpl.join("");
    },
    //格式化数据[todo]根据不同消息类型格式化数据以匹配模版
    _formatData:function(data,islast) {
        var _data = {};
        switch(data.msg_type){
            case "attention":
                _data = this._formatAttentionData(data,islast);
                break;
            case "invite":
                _data = this._formatInviteData(data,islast);
                break;
            case "leave":
                _data = this._formatLeaveData(data,islast);
                break;
            case "slip":
                _data = this._formatSlipData(data,islast);
                break;
            case "accept":
                _data = this._formatAcceptData(data,islast);
                break;
            case "notice":
                _data = this._formatNoticeData(data,islast);
                break;
            default : 
                _data = data;
        }
        return _data;
    },
    //关注数据格式化
    _formatAttentionData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uname"] = name;
        _data["vip"]   = (data.user_type == 1 || data.user_type == 2) ? Lib.sysmsg.utils.getVipIcon(data.user_type) : "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["follow_state"] = data.follow_state == 1 ? '<a href="#" onclick="javascript:return false;" class="followed">已关注</a>' : '<a href="#" onclick="javascript:return false;" action-type="add-attention" action-data=\'{uid:"'+uid+'"}\' class="follow">关注Ta</a>';
        _data["time"] = data.time;
        return _data;
    },
    //好友邀请
    _formatInviteData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uname"] = name;
        _data['uid'] = uid;
        _data["vip"]   = (data.user_type == 1 || data.user_type == 2) ? Lib.sysmsg.utils.getVipIcon(data.user_type) : "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["content"] = data.invite_cont;
        _data["hidecont"] = _data["content"] ? "" : "display:none";
        _data["invite_id"] = data.invite_id;
        _data["time"] = data.time;
        return _data;
    },
    //纸条
    _formatSlipData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data['uid'] = uid;
        _data["uname"] = name;
        _data["vip"]   = (data.user_type == 1 || data.user_type == 2) ? Lib.sysmsg.utils.getVipIcon(data.user_type) : "";
        _data["random"] = Lib.sysmsg.utils.getRandom();
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["content"] = data.slip_cont;
        _data["hidecont"] = _data["content"] ? "" : "display:none";
        _data["time"] = data.time;
        return _data;
    },
    //接受好友邀请
    _formatAcceptData:function(data,islast) {
        var name = data.notice_cont.fnickName;
        var uid  = data.notice_cont.fuid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data['uid'] = uid;
        _data["uname"] = name;
        _data["vip"]   = (data.user_type == 1 || data.user_type == 2) ? Lib.sysmsg.utils.getVipIcon(data.user_type) : "";
        _data["random"] = Lib.sysmsg.utils.getRandom();
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["content"] = data.slip_cont;
        _data["hidecont"] = _data["content"] ? "" : "display:none";
        _data["time"] = data.time;
        return _data;
    },
    //留言
    _formatLeaveData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data['uid'] = uid;
        _data["uname"] = name;
        _data["vip"]   = (data.user_type == 1 || data.user_type == 2) ? Lib.sysmsg.utils.getVipIcon(data.user_type) : "";
        _data["random"] = Lib.sysmsg.utils.getRandom();
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["content"] = data.leave_cont;
        _data["hidecont"] = _data["content"] ? "" : "display:none";
        _data["time"] = data.time;
        return _data;
    },
    //通知
    _formatNoticeData:function(data,islast) {
        var name = "新浪博客";
        var uid  = 1259295385;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["content"] = data.notice_cont;
        return _data;
    },
    //事件绑定关注等操作
    _bindEvent:function() {
        var _this = this;
        Core.Events.addEvent(this._box, function(e){
            _this._theReplyEvent(e);
            _this._theInviteAcceptEvent(e);
            _this._theInviteIgnoreEvent(e);
            _this._theAttentionEvent(e);
        }, "click");
    },
    //显示回复模块
    _showReplyTarea:function(e) {
        var targetdatas = Lib.util.getActionData(e, "show-reply-tarea");
            if(!targetdatas) {
                return;
            }else{
                var target = targetdatas.targetEl;
                var tdata = eval("("+targetdatas.data+")");
                var id = tdata.id;
                var state = target.getAttribute("_open");
                if($E("j-reply-"+id)){
                    if(state == 1){
                        $E("j-reply-"+id).style.display = "none";
                        target.setAttribute("_open",0);
                        target.innerHTML = "回复";
                    }else{
                        $E("j-reply-"+id).style.display = "";
                        target.setAttribute("_open",1);
                        target.innerHTML = "收起";
                    }
            }
        }
    },
    //回复事件处理
    _theReplyEvent:function(e) {
        this._showReplyTarea(e);
        var _this = this;
        var targetdatas = Lib.util.getActionData(e, "send-reply-btn");
        if(!targetdatas) {
            return;
        }else{
            var target = targetdatas.targetEl;
            var tdata = eval("("+targetdatas.data+")");
            var type = tdata.msg_type;
            if(type == "leave"){
                this._replyLeave(tdata);
            }
            if(type == "slip"){
                this._replySlip(tdata);
            }
        }
    },
    //回复留言
    _replyLeave:function(tdata) {
        var _this = this;
        var id = tdata.id;
        var uid = tdata.uid;
        var content = $E("j-reply-tarea-"+id).value;
        // if(!this._checkContent(content,id)){
        //     $E("j-reply-tarea-"+id).focus();
        //     return;
        // }
        var inter = new Interface("http://wall.cws.api.sina.com.cn/reply.php?version=7", "ijax");
        var data = {};
            data.rid = uid;
            data.msg= content
        inter.request({
            POST: data,
            onSuccess: function(result){
              _this._showSuccess(id);
            }.bind2(this),
            onError: function(result){
              _this._showFail(id);
            }.bind2(this),
            onFail: function(){
              _this._showFail(id);
            }.bind2(this)
        });
    },
    //回复纸条
    _replySlip:function(tdata) {
        var _this = this;
        Lib.checkAuthor();
        var id = tdata.id;
        var uid = tdata.uid;
        var content = $E("j-reply-tarea-"+id).value;
        // if(!this._checkContent(content,id)){
        //     $E("j-reply-tarea-"+id).focus();
        //     return;
        // }
        var inter = new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagesend.php?version=7", "ijax");
        var data = {};
            data.tuid = uid;
            data.fuid = $UID;
            data.content = content
        inter.request({
            POST: data,
            onSuccess: function(result){
              _this._showSuccess(id);
            }.bind2(this),
            onError: function(result){
              _this._showFail(id);
            }.bind2(this),
            onFail: function(){
              _this._showFail(id);
            }.bind2(this)
        });
    },
    //好友邀请接受事件处理
    _theInviteAcceptEvent:function(e) {
        var _this = this;
        var targetdatas = Lib.util.getActionData(e, "invite-accept-btn");
        if(!targetdatas) {
            return;
        }else{
            var target = targetdatas.targetEl;
            var tdata = eval("("+targetdatas.data+")");
            var id = tdata.id;
            var uid = tdata.uid;
            //var content = $E("j-reply-tarea-"+id).value;
            var inter = new Interface("http://control.blog.sina.com.cn/riaapi/profile/AddFriend.php?version=7", "jsload");
            var data = {};
                data.friend_uid=uid;
                data.inviteid=id;
                data.uname=scope.nickname;
            inter.request({
                GET: data,
                onSuccess: function(result){
                    _this._hideInviteMsg(id);
                }.bind2(this),
                onError: function(result){
                    _this._hideInviteMsg(id);
                }.bind2(this),
                onFail: function(){
                    _this._hideInviteMsg(id);
                }.bind2(this)
            });
        }
    },
    //好友邀请拒绝事件处理
    _theInviteIgnoreEvent:function(e) {
        var _this = this;
        var targetdatas = Lib.util.getActionData(e, "invite-ignore-btn");
        if(!targetdatas) {
            return;
        }else{
            var target = targetdatas.targetEl;
            var tdata = eval("("+targetdatas.data+")");
            var id = tdata.id;
            var uid = tdata.uid;
            Lib.checkAuthor();
            //var content = $E("j-reply-tarea-"+id).value;
            var inter = new Interface("http://control.blog.sina.com.cn/riaapi/profile/invitedel.php?version=7", "jsload");
            var data = {};
                data.uid=$UID;
                data.id=id;
            inter.request({
                GET: data,
                onSuccess: function(result){
                  _this._hideInviteMsg(id);
                }.bind2(this),
                onError: function(result){
                   _this._hideInviteMsg(id);
                }.bind2(this),
                onFail: function(){
                  _this._hideInviteMsg(id);
                }.bind2(this)
            });
        }
    },
    //隐藏邀请消息
    _hideInviteMsg:function(id){
        $E("j-inviteli-"+id).style.display = "none";
        var feed = parseInt($E("j-msg-feed-num").innerHTML);
        var mine = parseInt($E("j-msg-mine-num").innerHTML);
        var like = parseInt($E("j-msg-like-num").innerHTML);
        mine = mine>0 ? mine - 1 : 0; 
        //对外发送事件更新当前tab内容状态
        Lib.Listener.notify('the-msgnumber-update', {
             feed : feed
            ,mine : mine
            ,like : like
        });
    },
    //关注事件处理
    _theAttentionEvent:function(e) {
        var _this = this;
        Lib.checkAuthor();
        var targetdatas = Lib.util.getActionData(e, "add-attention");
        if(!targetdatas) {
            return;
        }else{
            var target = targetdatas.targetEl;
            var tdata = eval("("+targetdatas.data+")");
            var uid = tdata.uid;
            //var content = $E("j-reply-tarea-"+id).value;
            var inter = new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php", "ijax");
            var data = {};
                data.aid = uid;
                data.uid = $UID;
            inter.request({
                POST: data,
                onSuccess: function(result){
                    _this._disAttention(target);
                }.bind2(this),
                onError: function(result){
                    _this._disAttention(target);
                }.bind2(this),
                onFail: function(){
                    _this._disAttention(target);
                }.bind2(this)
            });
        }
    },
    //改变关注按钮状态
    _disAttention:function(target) {
        target.setAttribute("action-type","dis");
        target.className = "followed";
        target.innerHTML = "已关注";
    },
    //检查内容
    _checkContent:function(content,cid) {
        if(Core.String.trim(content) == ""){
            var reply =  $E("j-replytip-"+cid);
            if(reply){
                reply.style.display = "";
                setTimeout(function() {
                    reply.style.display = "none";
                },1000)
            }else{
                Core.Dom.insertHTML($E("j-reply-"+cid),'<div class="mSts" id="j-replytip-'+cid+'"><span class="fail">请输入回复内容</span></div>','afterend');
                reply =  $E("j-replytip-"+cid);
                setTimeout(function() {
                    reply.style.display = "none";
                },1000)
            }
            return false;
        }else{
            return true;
        }
    },
    //回复成功
    _showSuccess:function(id){
        //$E("j-reply-tarea-"+id).value = "";//情况textarea
        $E("j-reply-"+id).innerHTML = '<span class="suss">回复成功</span>';
        $E("j-reply-"+id).className = "mSts";
        $E("j-reply-link-"+id).className = "dis";
        $E("j-reply-link-"+id).setAttribute("action-type","dis");
        setTimeout(function() {
          $E("j-reply-"+id).style.display = "none";
          $E("j-reply-link-"+id).innerHTML = "已回复";
        },2000);
    },
    //回复失败
    _showFail:function(id){
        $E("j-reply-"+id).innerHTML = '<span class="fail">回复失败</span>';
        $E("j-reply-"+id).className = "mSts";
        $E("j-reply-link-"+id).className = "dis";
        $E("j-reply-link-"+id).setAttribute("action-type","dis");
        setTimeout(function() {
          $E("j-reply-"+id).style.display = "none";
          $E("j-reply-link-"+id).innerHTML = "已回复";
        },2000);
    }
}

    


