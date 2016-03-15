/**
 * @fileInfo   消息系统态度消息处理中心
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
$import("lib/component/sysmsg/utils.js");
$import("lib/util/getActionData.js");
$import("lib/interface.js");
$import("sina/core/string/encodeHTML.js");
$import("tempLib/magicFace/magicFace.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/insertHTML.js");
Lib.sysmsg = Lib.sysmsg || {};
Lib.sysmsg.AttitudeSource = Core.Class.create();
Lib.sysmsg.AttitudeSource.prototype = {
    initialize:function(ele) {
        this._box = ele;
        this._firstmsgtype = null;
        this._bindEvent();
    },
    tpl:{//模版
        //喜欢
        like:['<li class="#{liclass}">',
                '<div class="mInfo">',
                  '<div class="pic">#{upic}</div>',
                  '<div class="txt"><a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{unick_name}</a>#{vip}喜欢了你的博文<a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a><span class="time">#{time}</span></div>',
                '</div>',
                '</li>'].join(""),
        //评论
        comment:['<li class="#{liclass}">',
                    '<div class="mInfo">',
                      '<div class="pic">#{upic}</div>',
                      '<div class="txt"><a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{unick_name}</a>#{vip}评论了你的博文<a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a><span class="time">#{time}</span></div>',
                    '</div>',
                    '<div class="mCon" style="#{hidecont}">',
                      '<div class="cor"></div>',
                      '<div class="txt">#{cms_body}<a href="###" onclick="v7sendLog(\'40_01_34\');return false;" class="#{reply_css}" id="j-reply-link-#{cms_id}" action-type="#{reply_act}" action-data=\'{cid:\"#{cms_id}\",blog_id:\"#{blog_id}\"}\'>#{reply_txt}</a></div>',
                    '</div>',
                    '<div class="mCmt" style="display:none;" id="j-reply-#{cms_id}">',
                      '<textarea id="j-reply-tarea-#{cms_id}"></textarea>',
                      '<a href="###" onclick="v7sendLog(\'40_01_34\');return false;" title="发送" action-type="send-reply-btn" action-data=\'{cid:\"#{cms_id}\",blog_id:\"#{blog_id}\"}\'>发送</a>',
                    '</div>',
                  '</li>'].join(""),
        //图片评论
        photocomment:['<li class="#{liclass}">',
                    '<div class="mInfo">',
                      '<div class="pic">#{upic}</div>',
                      '<div class="txt"><a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{unick_name}</a>#{vip}评论了你的图片<a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a><span class="time">#{time}</span></div>',
                    '</div>',
                    '<div class="mCon" style="#{hidecont}">',
                      '<div class="cor"></div>',
                      '<div class="txt">#{cms_body}<a href="###" onclick="v7sendLog(\'40_01_34\');return false;" class="#{reply_css}" id="j-reply-link-#{cms_id}" action-type="#{reply_act}" action-data=\'{cid:\"#{cms_id}\",blog_id:\"#{blog_id}\"}\'>#{reply_txt}</a></div>',
                    '</div>',
                    '<div class="mCmt" style="display:none;" id="j-reply-#{cms_id}">',
                      '<textarea id="j-reply-tarea-#{cms_id}"></textarea>',
                      '<a href="###" onclick="v7sendLog(\'40_01_34\');return false;" title="发送" action-type="send-reply-btn" action-data=\'{cid:\"#{cms_id}\",blog_id:\"#{blog_id}\"}\'>发送</a>',
                    '</div>',
                  '</li>'].join(""),
        //回复
        reply:['<li class="#{liclass}">',
                    '<div class="mInfo">',
                      '<div class="pic">#{upic}</div>',
                      '<div class="txt"><a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{unick_name}</a>#{vip}&nbsp;在<a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a>&nbsp;中回复了你的评论&nbsp;<span class="time">#{time}</span></div>',
                    '</div>',
                  '</li>'].join(""),
        //转载
        reprinted:['<li class="#{liclass}">',
                '<div class="mInfo">',
                  '<div class="pic">#{upic}</div>',
                  '<div class="txt"><a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{unick_name}</a>#{vip}转载了你的博文<a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a><span class="time">#{time}</span></div>',
                '</div>',
                '</li>'].join(""),
        //收藏
        collect:['<li class="#{liclass}">',
                '<div class="mInfo">',
                  '<div class="pic">#{upic}</div>',
                  '<div class="txt"><a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{unick_name}</a>#{vip}收藏了你的博文<a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a><span class="time">#{time}</span></div>',
                '</div>',
                '</li>'].join(""),
        nodata:['<li class="nobd">',
                    '<div class="mSts">',
                      '<span class="none">没有新消息</span>',
                    '</div>',
                  '</li>'].join("")
    },
    //更新界面
    updateView:function(opt,fun) {
        var _this = this;
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
    _transformData:function(result) {
        var type = {1:"comment",2:"photocomment",7:"collect",8:"reprinted",13:"like",6:"reply"};
        var data = result.data;
        var len = data.length;
        if(len > 0){
            for(var i = 0; i<len;i++){
                var key = data[i]["msg_type"];
                data[i]["msg_type"] = type[key];
                if(i == 0){
                    this._firstmsgtype = type[key];//第一条消息的类型,用来查看全部的跳转
                }
            }
        }
        return result;
    },
    //获取数据
    _getData:function(opt,funsuc,funerr) {
        // var data = {//demo数据
        //     "data": [{
        //         "msg_type": "13",
        //         "uid": "1560840867",
        //         "nick_name": "王斌科",
        //         "time": "2012-03-12 13:22:05",
        //         "blog_id": "bf334b090101knvb",
        //         "blog_title": "[转载]新年答朋友问（1）",
        //         "vimg": ""
        //     }, {
        //         "msg_type": "8",
        //         "uid": "1560840867",
        //         "nick_name": "王斌科",
        //         "time": "1365760597",
        //         "blog_id": "bf334b090101ktwb",
        //         "blog_title": "佛学啊佛学啊佛学啊佛学啊",
        //         "vimg": ""
        //     }, {
        //         "msg_type": "7",
        //         "uid": "1560840867",
        //         "nick_name": "王斌科",
        //         "time": "1365760594",
        //         "blog_id": "bf334b090101ktwb",
        //         "blog_title": "佛学啊佛学啊佛学啊佛学啊",
        //         "vimg": ""
        //     }, {
        //         "msg_type": "2",
        //         "uid": "1560840867",
        //         "nick_name": "王斌科",
        //         "time": "1365760578",
        //         "img_title": "111",
        //         "img_id": "bf334b09tda24368e78ac",
        //         "cms_id": 82040,
        //         "vimg": "",
        //         "cms_body": "hahahahaha"
        //     }, {
        //         "msg_type": "1",
        //         "uid": "1560840867",
        //         "nick_name": "王斌科",
        //         "time": "1365748486",
        //         "blog_id": "bf334b090101igxd",
        //         "blog_title": "测试啊",
        //         "vimg": "",
        //         "cms_body": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        //     }],
        //     "count": "18"
        // }
        funsuc = funsuc || function(){};
        funerr = funerr || function(){};
        if(opt.num <= 0){//消息数为0时不请求接口
            funerr({num:0});
            return;
        }
        var _this = this;
        var inter = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/likeNote.php", "jsload");
        inter.request({
            get: {},
            onSuccess: function(result){
              if(result.data){//修复数据为空时显示问题
                  result = _this._transformData(result);
                  funsuc(result)
              }else{
                  funerr({num:0});
              }
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
        //                 {//喜欢
        //                     msg_type:"like",
        //                     uid:1286841033,
        //                     nick_name:"天天向上了没",
        //                     user_type:0,//[todo]确定取值类型
        //                     time:"1365760594",
        //                     attention_state:0,
        //                     blog_title:"博文标题",
        //                     blog_url:"http://www.blog.sina.com.cn",
        //                     blog_id:"xxxxdf12313"
        //                 },
        //                 {//评论
        //                     msg_type:"comment",
        //                     uid:1286841033,
        //                     nick_name:"天天向上了没",
        //                     user_type:1,//[todo]确定取值类型
        //                     time:"1365760594",
        //                     blog_title:"博文标题",
        //                     blog_url:"http://www.blog.sina.com.cn",
        //                     cms_body:"这篇博文真不错",
        //                     cms_id:2365858,
        //                     blog_id:"4cb3a2c90101hwx5"
        //                 },
        //                 {//转载
        //                     msg_type:"reprinted",
        //                     uid:1286841033,
        //                     nick_name:"天天向上了没",
        //                     user_type:0,//[todo]确定取值类型
        //                     blog_title:"博文标题",
        //                     blog_url:"http://www.blog.sina.com.cn",
        //                     blog_id:"xxxxdf12313",
        //                     time:"1365760594"
        //                 },
        //                 {//收藏
        //                     msg_type:"collect",
        //                     uid:1286841033,
        //                     nick_name:"天天向上了没",
        //                     user_type:1,//[todo]确定取值类型
        //                     blog_title:"博文标题",
        //                     blog_url:"http://www.blog.sina.com.cn",
        //                     blog_id:"xxxxdf12313",
        //                     time:"1365760594"
        //                 }]
        //             };
        //fun(data);
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
        var _data = data.data;
        var tpl = [];
        var len = _data.length>3 ? 3 : _data.length;
        if(len>0){
            for(var i=0; i<len; i++){
                var islast = (i == (len - 1)) ? 1 : 0;//是否是最后一条
                var itemdata = this._formatData(_data[i],islast);//格式化数据
                tpl.push(this._formatItemTpl(itemdata));
            }
        }else{
            tpl.push(this.tpl.nodata);
        }
        return tpl.join("");
    },
    //格式化数据[todo]根据不同消息类型格式化数据以匹配模版
    _formatData:function(data,islast) {
        var _data = {};
        switch(data.msg_type){
            case "like":
            case "reprinted":
            case "collect":
                _data = this._formatOtherData(data,islast);
                break;
            case "comment":
                _data = this._formatCommentData(data,islast);
                break;
            case "photocomment":
                _data = this._formatPhotoCommentData(data,islast);
                break;
            case "reply":
                 _data = this._formatReplyData(data,islast);
                break;
            default : 
                _data = data;
        }
        return _data;
    },
    //图片评论数据格式化
    _formatPhotoCommentData:function(data,islast) {
        var nick_name = data.nick_name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uid"] = uid;
        _data["unick_name"] = nick_name;
        _data["vip"]   = data.vimg || "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,nick_name,30,"40_01_34");
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["blog_url"] = Lib.sysmsg.utils.getImgUrl(data.img_id);
        _data["blog_id"] = data.img_id;
        var title =  data.img_title; 
        _data["title"] = Lib.sysmsg.utils.strTruncate(title,20);
        _data["cms_body"] = this._formatFace(Lib.sysmsg.utils.strTruncate(data.cms_body,74));
        _data["hidecont"] = _data["cms_body"] ? "" : "display:none";
        _data["reply_txt"] = data.reply_status == 1 ? "已回复" : "回复";
        _data["reply_act"] = data.reply_status == 1 ? "dis" : "show-reply-tarea";
        _data["reply_css"] = data.reply_status == 1 ? "dis" : "";
        _data["cms_id"] = data.cms_id;
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        return _data;
    },
    //回复数据格式化
    _formatReplyData:function(data,islast) {
        var nick_name = data.nick_name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uid"] = uid;
        _data["unick_name"] = nick_name;
        _data["vip"]   = data.vimg || "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,nick_name,30,"40_01_34");
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["blog_url"] = data.blog_id ? Lib.sysmsg.utils.getAticleUrl(data.blog_id) : Lib.sysmsg.utils.getImgUrl(data.img_id);
        var title = data.blog_title || data.img_title; 
        _data["title"] = Lib.sysmsg.utils.strTruncate(title,20);
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        return _data;
    },
    //评论数据格式化
    _formatCommentData:function(data,islast) {
        var nick_name = data.nick_name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uid"] = uid;
        _data["unick_name"] = nick_name;
        _data["vip"]   = data.vimg || "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,nick_name,30,"40_01_34");
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["blog_url"] = Lib.sysmsg.utils.getAticleUrl(data.blog_id);
        _data["blog_id"] = data.blog_id || data.img_id;
        var title = data.blog_title || data.img_title; 
        _data["title"] = Lib.sysmsg.utils.strTruncate(title,20);
        _data["cms_body"] = this._formatFace(Lib.sysmsg.utils.strTruncate(data.cms_body,74));
        _data["hidecont"] = _data["cms_body"] ? "" : "display:none";
        _data["reply_txt"] = data.reply_status == 1 ? "已回复" : "回复";
        _data["reply_act"] = data.reply_status == 1 ? "dis" : "show-reply-tarea";
        _data["reply_css"] = data.reply_status == 1 ? "dis" : "";
        _data["cms_id"] = data.cms_id;
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        return _data;
    },
    //数据格式化
    _formatOtherData:function(data,islast) {
        var nick_name = data.nick_name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["unick_name"] = nick_name;
        _data["vip"]   = data.vimg || "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,nick_name,30,"40_01_34");
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["blog_url"] = Lib.sysmsg.utils.getAticleUrl(data.blog_id);
        _data["title"] = Lib.sysmsg.utils.strTruncate(data.blog_title,20);
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        return _data;
    },
    //表情格式化
    _formatFace:function(sData) {
        var re = /\[emoticons=(E___\w*)\]([^\[]*)\[\/emoticons\]/gi;
        sData = Core.String.encodeHTML(sData);
        sData = sData.replace(re, function(a, b, c){
            return '<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + b + 'T.gif" style="margin:1px;cursor:pointer;"'
                + ' onclick="window.open(\'http://control.blog.sina.com.cn/admin/myshow/myshow.php?code=' + b +'\')" '
                    + 'border="0" title="' + c +'" />';
        });
        //处理魔法表情        
        var _magicReg=/\[magicemoticons=([E|W]___\w*)\&nbsp\;swfname=(\w+\.swf)\]([^[]*)\[\/magicemoticons\]/gi;
        var _magichtml =['<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/$1T.gif" style="margin:1px;',
                'cursor:pointer;" onclick="window.$magicFacePlay(\'$2\');return false;"',
                ' border="0" title="$3" width="50" height="50"/>'].join("");
        sData = sData.replace(_magicReg, _magichtml);
        return sData;
    },
    //事件绑定关注等操作
    _bindEvent:function(){
        var _this = this;
        Core.Events.addEvent(this._box, function(e){
            _this._showCommentTarea(e);
            _this._sendComment(e);
        }, "click");
    },
    //显示评论模块
    _showCommentTarea:function(e) {
        var targetdatas = Lib.util.getActionData(e, "show-reply-tarea");
            if(!targetdatas) {
                return;
            }else{
                var target = targetdatas.targetEl;
                var tdata = eval("("+targetdatas.data+")");
                var cid = tdata.cid;
                var state = target.getAttribute("_open");
                if($E("j-reply-"+cid)){
                    if(state == 1){
                        $E("j-reply-"+cid).style.display = "none";
                        target.setAttribute("_open",0);
                        target.innerHTML = "回复";
                    }else{
                        $E("j-reply-"+cid).style.display = "";
                        target.setAttribute("_open",1);
                        target.innerHTML = "收起";
                    }
            }
        }
    },
    //发评论
    _sendComment:function(e) {
        var _this = this;
        var targetdatas = Lib.util.getActionData(e, "send-reply-btn");
        if(!targetdatas) {
            return;
        }else{
            var target = targetdatas.targetEl;
            var tdata = eval("("+targetdatas.data+")");
            var cid = tdata.cid;
            var blog_id = tdata.blog_id;
            var content = $E("j-reply-tarea-"+cid).value;
            var inter = new Interface("http://control.blog.sina.com.cn/admin/comment/comment_reply_post.php", "ijax");
            var data = {};
            data.comment_id = cid;
            data.reply_content = content;
            if(!this._checkContent(content,cid)){//内容为空不提交
                $E("j-reply-tarea-"+cid).focus();
                return;
            }
            // if(Core.String.trim(content) == ""){
            //     var reply =  $E("j-replytip-"+cid);
            //     if(reply){
            //         reply.style.display = "";
            //         setTimeout(function() {
            //             reply.style.display = "none";
            //         },1000)
            //     }else{
            //         Core.Dom.insertHTML($E("j-reply-"+cid),'<div class="mSts" id="j-replytip-'+cid+'"><span class="fail">请输入回复内容</span></div>','afterend');
            //         reply =  $E("j-replytip-"+cid);
            //         setTimeout(function() {
            //             reply.style.display = "none";
            //         },1000)
            //     }
            //     return;
            // }
            data.article_id = blog_id;
            inter.request({
                POST: data,
                onSuccess: function(result){
                  _this._showSuccess(cid);
                }.bind2(this),
                onError: function(result){
                  _this._showFail(cid);
                }.bind2(this),
                onFail: function(){
                  _this._showFail(cid);
                }.bind2(this)
            });
        }
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

    


