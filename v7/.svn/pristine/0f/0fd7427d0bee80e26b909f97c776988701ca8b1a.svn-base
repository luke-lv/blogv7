/**
 * @fileoverview
 *  FEED 中的评论功能，点击的评论(X)时候展开
 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/string/trim.js");
$import("lib/app.js");
$import("lib/showError.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");
$import("lib/interface.js");
$import("product/center/insertSmile.js");
$import("product/center/textareaAutoHeight.js");
$import("msg/blogComment.js");
$import("product/center/comment2TSina.js");
$import("tempLib/insertSmiles/insertSmileFormInit.js");
$import("lib/sendLog.js");
$import("sina/utils/template.js");
$import("sina/Evter.js");

$import('lib/commentv2/geetest.js');

var FeedComment = Core.Class.create();

FeedComment.prototype = {
    contentLength: 2000,
    Interface: new Interface("http://control.blog.sina.com.cn/riaapi/profile/comment_new.php", "jsload"),
    initialize: function(sArticleID, sCount, box){
        /*判断登陆状态*/
        Lib.checkAuthor();
        if(!$isAdmin){
            new Lib.Login.Ui().login(function() {
                location.reload();
            });
            return;
        }
        
        this.aid = sArticleID;
        this.count = +sCount;
        //this.onClose = onClose||function(){};
        this.box = box;
        this.geetest = null;
        
        this.initHTML();
    },
    initHTML: function (){
        var html = '' +
            '<div class="arrow"></div>' +
            '<h6 class="noline">' +
                '<a href="javascript:;"><img id="cms_smile_#{aid}" title="插入表情" src="http://simg.sinajs.cn/blog7style/images/center/newversion/ico_small.jpg"' +
                    ' class="img_yzm" align="absmiddle" height="16" width="17"></a>发评论' +
            '</h6>' +
            //'<div class="commentbox"><textarea name="" cols="" rows=""></textarea></div>' +
            '<div class="commentbox">' +
                '<textarea style="display:none;" id="cms_content_#{aid}" fakeClass="fake_textarea"></textarea>' +
                '<iframe id="cms_frame_#{aid}" onclick="this.contentWindow.focus();" frameBorder="0" scrolling="no" style="height:60px; background-color: #FFFFFF; border: 1px solid #C7C7C7; width:542px;*width:544px;" src="http://blog.sina.com.cn/main_v5/ria/blank.html"></iframe>' +
            '</div>' +
            '<div class="ct_float">' +
                '<div class="ct_floatL" style="width:auto;">分享<a href="javascript:;"><img id="cms_share_#{aid}" title="点击将取消评论分享至微博" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon51" align="absmiddle" height="17" width="17"></a></div>' +
                '<input type="hidden" id="bb_share_#{aid}" value="1" />' +
                '<div class="ct_floatR" style="width:auto;">' +
                    '<a id="cms_pub_#{aid}" href="javascript:;" onclick="return false;" class="SG_aBtn SG_aBtn_ico"><cite>发布</cite></a>' +
                    '<span id="geetest-box-#{aid}" style="padding-right: 40px;"></span>' +
                '</div>' +
            '</div>' +
            '<div class="clearit"></div>' +
            //'<p class="commentnum">评论<a href="javascript:;" target="_blank">共0条</a></p>' +
            '<p class="commentnum" id="tip_#{aid}">还没有评论，快抢沙发吧！</p>' +
            '<ul class="revertlist" id="list_#{aid}" onmouseover="Core.Events.stopEvent(event);" onmouseout="Core.Events.stopEvent(event);"></ul>' +
            '<div class="more_r" id="more_#{aid}"></div>';
            //'<div class="more_r"><a href="javascript:;" target="_blank">查看更多&gt;&gt;</a></div>';
        this.box[0].innerHTML = html.replace(/#\{aid\}/g, this.aid);
        if(this.count>0){
            $E("tip_"+this.aid).innerHTML = '评论<a href="http://blog.sina.com.cn/s/blog_'+this.aid+'.html#comment" target="_blank">共'+this.count+'条</a>';
            if(this.count>4){
                $E("more_"+this.aid).innerHTML = '<a href="http://blog.sina.com.cn/s/blog_'+this.aid+'.html#comment" target="_blank">查看更多&gt;&gt;</a></div>';
            }
        }
        this.getComment();
        this.initGeetest();
        this.initUserEvent();
        return false;
    },
    getComment: function (){
        var __this = this;
        this.Interface.request({
            GET : {
                cms_id: this.aid
            },
            onSuccess : function (oData) {
                var tpl = '<li>' +
                    '<div class="ct_revert_cont">' +
                        '<p>' +
                            '<span class="revert_tit"><a href="http://blog.sina.com.cn/u/{uid}" target="_blank">{uname}:</a></span>' +
                            '<span class="revert_time">{cms_pubdate}</span>' +
                        '</p>' +
                        '<div class="revert_inner">{cms_body}</div>' +
                    '</div>' +
                '</li>';
                $E("list_"+__this.aid).innerHTML = Utils.template(tpl, oData);
            },
            onError : function(oData) {
                showError(oData.code);
            },
            onFail: function(){}
        });
    },
    // 加载geetest验证码
    initGeetest: function(){
        var __this = this;
        // 引入geetest验证码
        __this.geetest = new CommentV2.Geetest('#geetest-box-' + __this.aid);
    },
    initUserEvent: function(){
        var __this = this;
        var __addEvent = Core.Events.addEvent;
        //$E("cms_content_" + this.aid).focus();

        // // 插入验证码图片
        // Core.Dom.insertHTML($E("cms_check_" + this.aid), '<img id="cms_checkimg_' + this.aid 
        //  + '" class="img_yzm" src="http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?' + Math.random()
        //  + '" align="absmiddle" title="点击刷新验证码" />', "BeforeBegin"); //width="51" height="16" BeforeBegin AfterEnd

        // 分享到微博按钮
        // 初始化按钮状态
        var bb_share = $E("bb_share_"+this.aid),
            cms_share = $E("cms_share_"+this.aid);;
        if( Utils.Cookie.getCookie("acp_bb") == "1" ){
            bb_share.value = 0;
            cms_share.className= "SG_icon SG_icon86";
            cms_share.title = "点击将评论分享至微博";
        }
        __addEvent($E("cms_share_" + this.aid), function (event){
            Core.Events.stopEvent(event);
            if( bb_share.value=="1" ){
                bb_share.value = 0;
                cms_share.className= "SG_icon SG_icon86";
                cms_share.title = "点击将评论分享至微博";
            }else{
                bb_share.value =1;
                cms_share.className= "SG_icon SG_icon51";
                cms_share.title = "点击将取消评论分享至微博";
            }
        });
        
        // 发评论按钮
        __addEvent($E("cms_pub_" + this.aid), function (event){
            Core.Events.stopEvent(event);
            __this.postComment();
            v7sendLog('94_01_03_'+scope.$uid,scope.$pageid,'');
        });
        
        // // 验证码输入框获得焦点刷新验证码图片
        // __addEvent("cms_check_" + this.aid, function (event) {
        //  Core.Events.stopEvent(event);
        //  __this.refreshCheck();
        // }, "focus");

        // // 验证码输入框回车提交评论
        // __addEvent("cms_check_" + this.aid, function (event) {
        //  var evt = Core.Events.getEvent(event);
        //  var key = evt.which || evt.keyCode;
        //  if(key == 13){
        //      __this.postComment();
        //  }
        // }, "keyup");
        // // 点击验证码图片刷新
        // __addEvent("cms_checkimg_" + this.aid, function (event) {
        //  Core.Events.stopEvent(event);
        //  __this.refreshCheck();
        // });
        
        // 插入表情按钮
        if(scope.smile == null){
            scope.smile = new App.insertSmile("cms_content_" + this.aid, "cms_smile_" + this.aid, function(){});
        }
        var me = this;
        var events = {
            'interval' : {
                'after' : function(frameId, area) {
                    scope.commEditor.handleChange(frameId);
                    var doc = $E(frameId).contentWindow.document;
                    if (doc.body.scrollHeight > doc.body.offsetHeight) {
                        if(doc.body.scrollHeight > 410) {
                            return;
                        }
                        $E(frameId).style.height = doc.body.scrollHeight+'px';
                    }
                }
            },
            'cssStr' : 'padding:0px;overflow-y:auto;font-size: 12px;'
        };
        //因为使用了动画展开评论框，所以要延迟初始化。。。
        setTimeout(function(){
            if(!scope.commEditor) {
                scope.commEditor = new commEditor();
            }
            scope.commEditor.append("cms_frame_"+me.aid,"cms_content_" + me.aid,events);
            __addEvent("cms_smile_" + me.aid, function () {
                Core.Events.stopEvent();
                var arrPix = [-325, 14 + ($IE ? -2 : 0)];
                App.insertSmilesDialog3("cms_content_" + me.aid, null, null, null, "cms_smile_" + me.aid, arrPix,"cms_frame_"+me.aid,events);
            });
        }, 800);
    },
    // // 检查用户输入
    // refreshCheck: function(){
    //  $E("cms_checkimg_"+this.aid).src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + Math.random();
    // },
    // 发表评论
    postComment: function(){
        Core.Events.stopEvent();
        var __this = this;
        var _cms_content = Core.String.trim($E("cms_content_" + __this.aid).value);
        // geetest验证码结果
        var geetestValidate = __this.geetest.geetestObj.getValidate();

        if(_cms_content == ""){
            showError($SYSMSG.B36105);return;
        }
        if(!geetestValidate) {
            // 判断验证码为空
            showError('请拖动滑块完成验证。');return;
        }
        var post = new Interface("http://control.blog.sina.com.cn/admin/comment_new/cms_post.php?domain=1", "ijax");
        var data = {
            // 验证码参数
            "geetest_challenge": geetestValidate.geetest_challenge,
            "geetest_validate": geetestValidate.geetest_validate,
            "geetest_seccode": geetestValidate.geetest_seccode,
            "article_id"    : this.aid,
            "comment"       : _cms_content,
            "uid"           : scope.$uid,
            // "check"         : $E("cms_check_" + this.aid).value,
            "login_name"    : $nick,
            "is_photo"      : "0",
            "t"             : 1,
            "is_t": 0,
            "fromicp"       : 1
        };

        if($E("bb_share_"+this.aid)){
            if( $E("bb_share_"+this.aid).value=="1" ){
                data.is_t = 1; //分享到微博
                //为减少cookie大小，不分享到微博时不记录cookie，因为读不到cookie时则不选中选框
                if( Utils.Cookie.getCookie("acp_bb") == "1" ){
                    Utils.Cookie.setCookie("acp_bb","",-1,"/",".blog.sina.com.cn");
                }
            }
            else {
                if( Utils.Cookie.getCookie("acp_bb") != "1" ){
                    Utils.Cookie.setCookie("acp_bb","1",2400,"/",".blog.sina.com.cn");
                }
            }
        }
        //参数好多啊。
        if($E(this.aid+"_v2")){ data.v2 = $E(this.aid+"_v2").value; }
        if($E(this.aid+"_v1")){ data.v1 = $E(this.aid+"_v1").value; }
        data.v3 = 2;
        
        post.request({
            POST : data,
            onSuccess : function (result) {
                // __this.refreshCheck();
                __this.fakeRender($E("cms_content_" + __this.aid).value);
                //$E("cms_content_" + __this.aid).value = "";
                //$E("cms_content_" + __this.aid).focus();
                // $E("cms_check_" + __this.aid).value = "";
                scope.commEditor.clearHTML('cms_frame_' + __this.aid);
                $E("cms_content_" + __this.aid).value = "";
                $E('cms_frame_' + __this.aid).style.height = '60px';
//              if($E("cmscount_" + __this.aid) != null){
//                  var newcount = $E("cmscount_" + __this.aid).innerHTML * 1 + 1;
//                  $E("cmscount_" + __this.aid).innerHTML = newcount;
//                  $E("cms_" + __this.aid).innerHTML = "评论(" + newcount + ")";
//                  if(newcount <= 1){
//                      $E("cms_detail_" + __this.aid).innerHTML += '<br />……';
//                  }
//              }else{
//                  $E("cms_detail_" + __this.aid).innerHTML = ['共<span id="cmscount_' + __this.aid + '">1</span>条评论，'
//                      , '<a href="http://blog.sina.com.cn/s/blog_' + __this.aid + '.html#comment" onclick="v7sendLog(\'94_01_02_'+scope.$uid+'\',\'profile_index\',\'\');" target="_blank">'
//                      , '点击查看&gt;&gt;</a>'].join("");
//                  $E("cms_" + __this.aid).innerHTML = "评论(1)";
//              }
                __this.count = __this.count+1; //更新评论数
                $E("tip_"+__this.aid).innerHTML = '评论<a href="http://blog.sina.com.cn/s/blog_'+__this.aid+'.html#comment" target="_blank">共'+__this.count+'条</a>';
                Evter.fire('updataCmsNum'+__this.aid, __this.count);
                
                //评论同步到微博
                var c2s = new Comment2TSina(__this.aid, result);
                c2s.writeCommTips();

                // 刷新geetest验证码
                __this.geetest.geetestObj.refresh();
            },
            onError: function (oData){
                // __this.refreshCheck();
                // $E("cms_check_" + __this.aid).value = "";
                showError($SYSMSG[oData.code]);

                // 刷新geetest验证码
                __this.geetest.geetestObj.refresh();
            },
            onFail: function () {
                showError($SYSMSG.A00001);

                // 刷新geetest验证码
                __this.geetest.geetestObj.refresh();
            }
        });
    },
    // 渲染假数据
    fakeRender: function (sData) {
        if(sData == null || sData == ""){return;}
        // UBB 2 smiles     
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
        
        if(sData.length > 0){
            var li = '<li>' +
                    '<div class="ct_revert_cont">' +
                        '<p>' +
                            '<span class="revert_tit"><a href="http://blog.sina.com.cn/u/'+scope.$uid+'" target="_blank">'+$nick+':</a></span>' +
                            '<span class="revert_time">1分钟前</span>' +
                        '</p>' +
                        '<div class="revert_inner">'+sData+'</div>' +
                    '</div>' +
                '</li>';
            Core.Dom.insertHTML($E("list_" + this.aid), li, "AfterBegin");
        }
    }
};
