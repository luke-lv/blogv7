/**
 * @个人中心评论回复功能
 */
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/removeNode.js");
//$import("sina/core/system/br.js");
$import("sina/core/string/trim.js");
//$import("sina/core/string/byteLength.js");
//$import("sina/utils/limitLength.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/showError.js");
//$import("lib/insertSmiles/insertSmileFormInit.js");
//$import("tempLib/insertSmiles/insertSmileFormInit.js");
//$import("tempLib/magicFace/magicFace.js");
$import("jobs/resource.js");
$import("msg/blogComment.js");
$import("other/SinaEx.js");
$import("sina/utils/url.js");
$import("lib/uic.js");
$import("lib/commentv2/commentArea.js");


$registJob("commentReply", function() {
    //回复
    window.commentReply = function(dom, url) {
        v7sendLog("32_01_24");
        var url = "http://control.blog.sina.com.cn" + url;
        var urlobj = new Utils.Url(url);
        //body_
        var param = urlobj.query;
        var comm_id = param.id;
        if((dom.getAttribute("isready") == 1) && $E("cmt_rebox_"+param.id)){//如果评论回复框已经展开
            $E("cmt_rebox_"+param.id).style.display = "none";
            dom.innerHTML = "[回复]";
            dom.setAttribute("isready",0);
            return;
        }else{
            if($E("cmt_rebox_"+param.id)){
                $E("cmt_rebox_"+param.id).style.display = "";
                dom.setAttribute("isready",1);
                dom.innerHTML = "[取消回复]";
                return;
            }
        }
        function Adder() {
            this.loader = new Interface('http://control.blog.sina.com.cn/admin/comment_new/cms_usereply_post.php?domain=2', 'ijax');
        }
        Adder.prototype = {
            add : function(data,sucFn,errFn) {
                this.loader.request({
                    POST: data,
                    returnType: 'json',
                    onSuccess: function(res){
                        if (sucFn && typeof sucFn === "function"){
                            sucFn(res);
                        }
                    },
                    onError: function(res){
                        if (errFn && typeof errFn === "function"){
                            errFn(res);
                        }
                    },
                    onFail: function(res){
                        if (errFn && typeof errFn === "function"){
                            errFn(res);
                        }
                    }
                });
            },
            //发布成功后点击确定按钮
            sucOkFun:function(argument){
                window.location.reload();
            },
            //发布成功有点击确定按钮
            errOkFun:function(argument){
                
            }
        }
        creatBox(comm_id);
        function creatBox(id) {
            
            var tpl =['<dd class="SG_reply_dd" id="cmt_rebox_'+ id +'">',
                        '    <div class="SG_reply">',
                        '      <div class="cor"></div>',
                        '      <div class="SG_reply_con">',
                        '        <div class="hd"></div>',
                        '        <div class="bd" id="cmt_retarea_'+ id +'"></div>',
                        '        <div class="ft"></div>',
                        '      </div>',
                        '    </div>',
                        '</dd>'].join("");
            if($E("body_"+id)){
                Core.Dom.insertHTML($E("body_"+id),tpl,"AfterEnd");
                dom.setAttribute("isready",1);
                createTarea($E("cmt_retarea_"+id),param);
                dom.innerHTML = "[取消回复]";
            }
        }
        //生成Tarea框
        function createTarea(container,param) {
            Lib.checkAuthor();
            var commentArea = new CommentV2.CommentArea({
                container: container,
                sid:param.reply_cmsid
            });
            var item = param;
            getCommText(param,commentArea);
            var adder = new Adder();
            Lib.Uic.getNickName([$UID], function(oResult){
                var login_name = oResult[$UID];
                commentArea.setReplyData(adder, {
                    article_id: item.article_id,                                // 博文ID
                    reply_cmsid: item.reply_cmsid,                            // 二级评论ID
                    stair_cmsid: item.stair_cmsid,                            // 一级评论ID
                    src_uname: item.source_uname,                            // 博主昵称
                    blog_title:decodeURIComponent(item.blog_title),        // 博文标题
                    uid: $UID,                                                    // 发二级评论人的UID/当前登录用户的UID
                    //uname: scope.$loginNick,                                // 发二级评论人的昵称/当前登录用户的昵称
                    source_uid: item.source_uid,                            // 被回复的一级评论人的UID/被回复的二级评论的UID
                    source_uname: item.source_uname,                            // 被回复的一级评论人的昵称/被回复的二级评论的昵称
                    reply_content: "",                        // 一级评论或二级评论的内容
                    login_name: login_name,                        // 发二级评论人的昵称/当前登录用户的昵称,同uname
                    is_t: 0,                                             // 是否分享到微博
                    source_ulink: "http://blog.sina.com.cn/u/"+item.uid  // 评论人的链接
                });
            });   
        }
        //获取评论内容
        function getCommText(param,commentArea){
            if(param.cms_type == 2){//id对应的是回复表的id，reply_cmsid对应的cms表的id，getcms要从评论表取数据
                var _param =  {cms_id:param.reply_cmsid,uid:param.src_uid,origin:1};
                var getInterface = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/getCms.php", "jsload");
                getInterface.request({
                    GET: _param,
                    onSuccess: function(_data){
                        var cms_body = _data.cms_body;
                        var nick_name = _data.nick_name;
                        var source_uname = _data.source_uname;
                        var comment = "//@"+ nick_name + " 回复 @" + source_uname +" :" + cms_body;
                        commentArea.setValues({comment:comment});
                    }.bind2(this),
                    onError: function(res){
                        if(res&&res.code){
                            winDialog.alert($SYSMSG[res.code],{
                                funcOk: function(){
                                }
                            });
                        }
                    },
                    onFail: function(res){
                        if(res&&res.code){
                            winDialog.alert($SYSMSG[res.code],{
                                funcOk: function(){
                                }
                            });
                        }
                    }
                });
            }
        }
    };
});