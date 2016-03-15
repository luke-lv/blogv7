/**
 * @fileInfo   消息系统内容消息处理中心
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
Lib.sysmsg.ContentSource = Core.Class.create();
Lib.sysmsg.ContentSource.prototype = {
    initialize:function(ele) {
        this._box = ele;
        this._firstmsgtype = null;
        this._bindEvent();
    },
    tpl:{//模版
        //发布博文
        article:['<li class="#{liclass}">',
                    '<div class="mInfo">',
                      '<div class="pic">#{upic}</div>',
                      '<div class="txt">',
                        '<a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}&nbsp;发表了<span class="cata">博文</span><a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a><span class="time">#{time}</span>',
                        '<p>#{summary}</p>',
                        '<div class="count"><span class="read">阅读(#{re_num})</span><a href="###" onclick="v7sendLog(\'40_01_34\');return false;" title="#{link_title}" class="#{like_class}" action-type="#{like_action}" action-data=\'{uid:\"#{uid}\",like_num:\"#{like_num}\",article_id:\"#{article_id}\",title:\"#{ti_title}\",type:\"1\",sid:\"#{sid}\"}\'>喜欢(#{like_num})</a></div>',
                      '</div>',
                    '</div>',
                    '<div class="mSts" id="j-editinfo-#{sid}" style="display:none"><span class="fail">操作失败，请稍后再试</span></div>',
                  '</li>'].join(""),
        //转载博文    
        reprinted:['<li class="#{liclass}">',
                    '<div class="mInfo">',
                      '<div class="pic">#{upic}</div>',
                      '<div class="txt">',
                        '<a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}&nbsp;#{action}&nbsp;#{action_src}<a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a><span class="time">#{time}</span>',
                        '<p>#{summary}</p>',
                        '<div class="count"><span class="read">阅读(#{re_num})</span><a href="###" onclick="v7sendLog(\'40_01_34\');return false;" title="#{link_title}" class="#{like_class}" action-type="#{like_action}" action-data=\'{uid:\"#{uid}\",like_num:\"#{like_num}\",article_id:\"#{article_id}\",title:\"#{ti_title}\",type:\"1\",sid:\"#{sid}\"}\'>喜欢(#{like_num})</a></div>',
                      '</div>',
                    '</div>',
                    '<div class="mSts" id="j-editinfo-#{sid}" style="display:none"><span class="fail">操作失败，请稍后再试</span></div>',
                  '</li>'].join(""),
        //上传图片
        photo:['<li class="#{liclass}">',
                    '<div class="mInfo">',
                      '<div class="pic">#{upic}</div>',
                      '<div class="txt">',
                        '<a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}&nbsp;#{action}#{action_src}<span class="time">#{time}</span>',
                        '<p>#{summary}</p>',//图片专辑id接口取不到，暂时隐藏图片的喜欢操作
                        '<div class="count" style="display:none"><span class="read">阅读(#{re_num})</span><a style="display:none;" href="###" onclick="v7sendLog(\'40_01_34\');return false;" class="#{like_class}" action-type="#{like_action}" action-data=\'{uid:\"#{uid}\",like_num:\"#{like_num}\",article_id:\"#{article_id}\",type:\"3\"}\' >喜欢(#{like_num})</a></div>',
                      '</div>',
                    '</div>',
                  '</li>'].join(""),
        like:['<li class="#{liclass}">',
                    '<div class="mInfo">',
                      '<div class="pic">#{upic}</div>',
                      '<div class="txt">',
                        '<a href="#{ublog}" onclick="v7sendLog(\'40_01_34\')" class="nickname" target="_blank">#{uname}</a>#{vip}&nbsp;#{action}&nbsp;#{action_src}<a href="#{blog_url}" onclick="v7sendLog(\'40_01_34\')" class="link" target="_blank">《#{title}》</a><span class="time">#{time}</span>',
                        //'<p>#{summary}</p>',//喜欢操作需要知道原博主的uid
                        //'<div class="count"><span class="read">阅读(#{re_num})</span><a href="#" onclick="javascript:return false;" title="#{link_title}" class="#{like_class}" action-type="#{like_action}" action-data=\'{uid:\"#{uid}\",like_num:\"#{like_num}\",article_id:\"#{article_id}\",title:\"#{ti_title}\",type:\"1\"}\'>喜欢(#{like_num})</a></div>',
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
    updateView:function(opt,fun) {
        var _this = this;
        this._getData(opt,
            function(data) {//成功
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
            });
    },
    //数据转换，接口和事先约定有变化
    // 1：普通博文 
    // 10：喜欢
    // 3：图片博文
    // 9：转载
    _transformData:function(result) {
        var type = {1:"article",3:"photo",10:"like",9:"reprinted"};
        var data = result.msg;
        var len = data.length;
        if(len > 0){
            for(var i = 0; i<len;i++){
                var key = data[i]["msg_type"];
                data[i]["msg_type"] = type[key];
                if(!this._firstmsgtype){
                    this._firstmsgtype = type[key];//第一条消息的类型,用来查看全部的跳转
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
        var inter = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/feedlist.php", "jsload");
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
        //                 {//发布博文
        //                     msg_type:"article",
        //                     name:"郭德纲",
        //                     uid:"1663148275",
        //                     time:"2012-09-08 13:33:30",
        //                     user_type:0,//[todo]确定取值类型
        //                     title:"美抱怨奥运制服“中国造”——久违了 落后于全球化时代的声音",
        //                     article_id:"6321a0f30102e6vp",
        //                     like_state:0,
        //                     like_num:1002,
        //                     re_num:9877,
        //                     summary:"我是摘要",
        //                     pics:["http://t.cn/1.jpg","http://t.cn/2.jpg"]
        //                 },
        //                 {//图片上传
        //                     msg_type:"photo",
        //                     name:"郭德纲",
        //                     uid:"1374834850",
        //                     user_type:0,//[todo]确定取值类型
        //                     title:"于大爷的幸福生活",
        //                     article_id:"xxxxdf12313",
        //                     like_state:0,
        //                     like_num:1002,
        //                     re_num:9877,
        //                     pics:["http://t.cn/1.jpg","http://t.cn/2.jpg"]
        //                 }]
        //             };
        //funsuc(data);
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
    //格式化数据
    _formatData:function(data,islast) {
        var _data = {};
        switch(data.msg_type){
            case "photo":
                _data = this._formatPhotoData(data,islast);
                break;
            case "article":
                _data = this._formatArticleData(data,islast);
                break;
            case "like":
                //喜欢又分为博文和图片
                if(data.dig_type == 1){
                    _data = this._formatLikeData(data,islast);
                }else{
                    _data = this._formatLikePhotoData(data,islast);
                }
                break;
            case "reprinted":
                _data = this._formatReprintedData(data,islast);
                break;
            default : 
                _data = data;
        }
        return _data;
    },
    //博文数据格式化
    _formatArticleData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uid"] = uid;
        _data["uname"] = name.split("<a")[0];
        _data["vip"]   = name.split("<a")[1] ? "<a"+name.split("<a")[1] : "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["blog_url"] = Lib.sysmsg.utils.getAticleUrl(data.article_id);
        _data["article_id"] = data.article_id;
        var title = data.title; 
        _data["summary"] = Lib.sysmsg.utils.strTruncate(data.summary,74);
        _data["title"] = Lib.sysmsg.utils.strTruncate(title,20);
        _data["ti_title"] = data.title;
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        _data["re_num"] = data.re_num || "0";
        _data["like_num"] = data.like_num || "0";
        _data["like_action"] = data.like_state == 1 ? "dis" : "add-like";
        _data["like_class"] = data.like_state == 1 ? "liked" : "like";
        _data["link_title"] = data.like_state == 1 ? "" : "+1";
        _data["sid"] = this._setSid(_data);
        return _data;
    },
    //生成sid
    _setSid:function(_data) {
        var s = [];
        s.push(_data["uid"]);
        s.push(_data["article_id"]);
        s.push((new Date()).getTime());
        return s.join("");
    },
    //图片格式化[todo]图片模块处理
    _formatPhotoData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uid"] = uid;
        _data["uname"] = name.split("<a")[0];
        _data["vip"]   = name.split("<a")[1] ? "<a"+name.split("<a")[1] : "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["blog_url"] = Lib.sysmsg.utils.getPhotosUrl(data.article_id,uid);
        _data["article_id"] = data.article_id;
        var title = data.title; 
        _data["action"] = data.action;
        _data["action_src"] = data.action_src;
        _data["title"] = Lib.sysmsg.utils.strTruncate(title,20);
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        _data["re_num"] = data.re_num || "0";
        _data["like_num"] = data.like_num || "0";
        _data["like_action"] = data.like_state == 1 ? "dis" : "add-like";
        _data["like_class"] = data.like_state == 1 ? "liked" : "like";
        return _data;
    },
    //喜欢格式化
    _formatLikeData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uid"] = uid;
        _data["uname"] = name.split("<a")[0];
        _data["vip"]   = name.split("<a")[1] ? "<a"+name.split("<a")[1] : "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,"",30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["action"] = data.action;
        _data["action_src"] = data.action_src;
        _data["blog_url"] = Lib.sysmsg.utils.getAticleUrl(data.article_id,uid);
        _data["article_id"] = data.article_id;
        var title = data.title; 
        _data["summary"] = Lib.sysmsg.utils.strTruncate(data.summary,74);
        _data["title"] = Lib.sysmsg.utils.strTruncate(title,20);
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        _data["re_num"] = data.re_num || "0";
        _data["like_num"] = data.like_num || "0";
        _data["like_action"] = data.like_state == 1 ? "dis" : "add-like";
        _data["like_class"] = data.like_state == 1 ? "liked" : "like";
        _data["link_title"] = data.like_state == 1 ? "" : "+1";
        return _data;
    },
    //喜欢图片格式化
    _formatLikePhotoData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uid"] = uid;
        _data["uname"] = name.split("<a")[0];
        _data["vip"]   = name.split("<a")[1] ? "<a"+name.split("<a")[1] : "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,"",30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["action"] = data.action;
        _data["action_src"] = data.action_src;
        _data["blog_url"] = data.like_photo_url;
        _data["article_id"] = data.article_id;
        var title = data.title; 
        _data["summary"] = Lib.sysmsg.utils.strTruncate(data.summary,74);
        _data["title"] = Lib.sysmsg.utils.strTruncate(title,20);
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        _data["re_num"] = data.re_num || "0";
        _data["like_num"] = data.like_num || "0";
        return _data;
    },
    //转载
    _formatReprintedData:function(data,islast) {
        var name = data.name;
        var uid  = data.uid;
        var _data = {};
        _data['msg_type'] = data.msg_type;
        _data['liclass'] = islast == 1 ? "nobd" : "";
        _data["uid"] = uid;
        _data["uname"] = name.split("<a")[0];
        _data["vip"]   = name.split("<a")[1] ? "<a"+name.split("<a")[1] : "";
        _data["upic"]  = Lib.sysmsg.utils.getUserPic(uid,name,30);
        _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
        _data["action"] = data.action;
        _data["action_src"] = data.action_src;
        _data["blog_url"] = Lib.sysmsg.utils.getAticleUrl(data.article_id);
        _data["article_id"] = data.article_id;
        var title = data.title; 
        _data["summary"] = Lib.sysmsg.utils.strTruncate(data.summary,74);
        _data["title"] = Lib.sysmsg.utils.strTruncate(title,20);
        _data["ti_title"] = data.title;
        _data["time"] = Lib.sysmsg.utils.getTime(data.time);
        _data["re_num"] = data.re_num || "0";
        _data["like_num"] = data.like_num || "0";
        _data["like_action"] = data.like_state == 1 ? "dis" : "add-like";
        _data["like_class"] = data.like_state == 1 ? "liked" : "like";
        _data["link_title"] = data.like_state == 1 ? "" : "+1";
        _data["sid"] = this._setSid(_data);
        return _data;
    },
    //事件绑定关注等操作
    _bindEvent:function() {
        var _this = this;
        Core.Events.addEvent(this._box, function(e){
            _this._addLike(e);
        }, "click");
    },
    //喜欢操作
    _addLike:function(e) {
        var _this = this;
        var targetdatas = Lib.util.getActionData(e, "add-like");
        if(!targetdatas) {
            return;
        }else{
            var target = targetdatas.targetEl;
            var tdata = eval("("+targetdatas.data+")");
            var sid = tdata.sid;
            var like_num = tdata.like_num;
            target.innerHTML = "喜欢(+1)";
            var inter = new Interface("http://control.blog.sina.com.cn/admin/digg/post_digg.php", "jsload");
            var data  = {};
            data.res_id   = tdata.article_id;
            data.res_uid  = tdata.uid;
            data.action   = "0";
            data.res_type = tdata.type || "1";
            data.ti_title = encodeURIComponent(tdata.title || "");
            // res_id:资源编号,比如是博文编号
            // res_uid:资源号博主uid
            // action:0(代表顶)/1(代表踩)
            // res_type:1(代表博文)/2(代表图片)/3(代表专辑)
            inter.request({
                GET: data,
                onSuccess: function(result){
                  _this._showSucc(target,like_num);
                  // like_num++;
                  // target.innerHTML = "喜欢("+ like_num +")";
                  // target.className = "liked";
                  // target.setAttribute("action-type","dis");
                  // target.setAttribute("title","");
                }.bind2(this),
                onError: function(data){
                  // target.innerHTML = "喜欢("+ like_num +")";
                  // target.className = "liked";
                  // target.setAttribute("action-type","dis");
                  if(data.code == 'B00801'){//已经喜欢过
                    _this._showSucc(target,like_num);
                  }else{
                    _this._showFail(sid,target,like_num);
                  }
                }.bind2(this),
                onFail: function(){
                  // target.innerHTML = "喜欢("+ like_num +")";
                  // target.className = "liked";
                  // target.setAttribute("action-type","dis");
                  _this._showFail(sid,target,like_num);
                }.bind2(this)
            });
        }
        
    },
    //显示成功
    _showSucc:function(target,like_num) {
        like_num++;
        target.innerHTML = "喜欢("+ like_num +")";
        target.className = "liked";
        target.setAttribute("action-type","dis");
        target.setAttribute("title","");
    },
    //操作失败
    _showFail:function(sid,target,like_num){
        if($E("j-editinfo-"+sid)){
            target.innerHTML = "喜欢("+ like_num +")";
            $E("j-editinfo-"+sid).style.display = "";
            setTimeout(function(){
                $E("j-editinfo-"+sid).style.display = "none";
            },2000)
        }
        //'<div class="mSts" id="j-replytip-62411" style="display: none;"><span class="fail">请输入回复内容</span></div>'
    }
}

    


