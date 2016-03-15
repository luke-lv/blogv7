/** 
 * @fileoverview 评论及回复的新增
 * @author gaolei | gaolei2@staff.sina.com.cn
 */
$import("sina/utils/io/ajax.js");
$import("sina/utils/json.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/cutHtmlString.js");
$import("lib/htmlTemplate.js");
$import("lib/commentv2/_comment.js");

CommentV2.Add = function(opt){
    var opt = opt || {};
    this.tpl = opt.tpl || "";
    this.url = opt.url || "";
    this.type = opt.type || "comment";
    this.data = opt.data || "";
    this.jsonUtil = Utils.Json;
    this.leftB = Core.String.leftB;
    this.cutHtmlString= Core.String.cutHtmlString;
    this.loader = new Interface(this.url, 'ijax');
    this.init();
}.$define({
    /**
     * 初始化
      */
    init: function(){
        trace("CommentV2.Add.Init");
        if (!this.tpl){
            this.tpl = this.getTpl();
        }
    Lib.checkAuthor();
    },
    
    /**
     * 新增回复接口调用
     * @param data 接口请求数据
     * @param sucFn 接口请求成功后的回调
     * @param errFn  接口请求失败后的回调
      */
    post: function(data, sucFn, errFn){
        var __this = this;

        if(!$isLogin){
            new Lib.Login.Ui().login(function(){
                scope.blogOpener.showDialog(function() {
                    //登陆后更新信息[todo]更新删除为显示
                    data.uid = $UID;
                    data.login_name = scope.$loginNick || $nick;
                    __this.post(data, sucFn, errFn);
                });
            });
            return;
        }
        // var url = 'http://control.blog.sina.com.cn/admin/comment_new/cms_usereply_post.php';
        trace("CommentV2.Add.Post");
        trace(data);
        this.loader.request({
            POST: data,
            returnType: 'json',
            onSuccess: function(res){
                trace("reply_add_succ");
                var item = res.comment_reply_data[0];
                item.action_data = __this.obj2str({
                    articleid: scope.$articleid,
                    commentid: item.stair_cms_id,
                    replyid: item.id,
                    comm_uid: item.comm_uid,
                    uname: item.uname,
                    source_uid: item.source_uid,
                    cms_body: item.cms_body,
          ulink: item.ria_index_url,
                    source_ulink: item.source_ria_index_url,
          src_uid: item.src_uid
                });

                var li = __this.render(item, -1, data.cms_reply_num);
                __this.appendItem(li, item.stair_cms_id);
                if (sucFn && typeof sucFn === "function"){
                    sucFn(res);
                }
            },
            onError: function(res){
                trace("reply_add_error");
                if (errFn && typeof errFn === "function"){
                    errFn(res);
                }
            },
            onFail: function(res){
                trace("reply_add_fail");
                if (errFn && typeof errFn === "function"){
                    errFn(res);
                }
            }
        });
    },
    
    /**
     * 根据type值渲染一条评论或回复
     * @param item 评论或回复的信息
      */
    
    render: function(item, index, len){
    // window.onerror = null;
        var li = $C("li");
    
    li.className = 'SG_j_linedot1';
        item.cms_body = decodeURIComponent(item.cms_body);//转码
    item.vimg = item.vimg ? item.vimg : "";
    item.source_vimg = item.source_vimg ? item.source_vimg : "";

    item.from = '';
    if (item.fromProduct == "weibo"){
           var weiboImg = '<img height="15" align="absmiddle" width="15" class="SG_icon SG_icon51" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif">'
      // '来自<a target="_blank" href="#{ulink}">#{from}#{uname}</a>的评论';
      item.user_from_weibo = '来自<a target="_blank" href="'+item.ulink+'">'+weiboImg+item.weibo_uname+'</a>的评论';
        }
        item.cms_reply_num = item.cms_reply_num ? '('+item.cms_reply_num+')' : '';
    item.show_more = "none";
    item.moreInfo = "";
    // debugger
    if (this.type === "comment"){
            item.god_comment = item.god == 1 ? '<span class="god_reply">神评</span>' : '';
      li.id = "cmt_"+item.id;
      if (index === 0){
        li.className = '';
      }
      // user_image_place:  '<a href="#{ria_index_url}" target="_blank"><img src="#{user_image}"></a>'+
      // user_nick_place:  '<a href="#{ria_index_url}">#{uname}</a>'
      // user_from_place: '<a target="_blank" href="#{ulink}">#{from}#{uname}</a>'
      if (item.comm_uid == 0){
        // item.user_image = "http://blogimg.sinajs.cn/v5images/default.gif";
        item.user_image_place = '<img src="'+item.user_image+'">';
        // item.user_from_place = item.uname;
        item.user_nick_place = item.uname;
      }else{
        item.user_image_place = '<a href="'+item.ria_index_url+'" target="_blank"><img src="'+item.user_image+'"></a>';
        item.user_nick_place = '<a href="'+item.ria_index_url+'">'+item.uname+'</a>';
        // item.user_from_place = '<a target="_blank" href="'+item.ulink+'">'+item.from+item.uname+'</a>';
      }
      
      if (item.fromProduct === "blog"){// 博客评论增加查看更多功能
        /*
        var imgReg = /<img\s(?:src=[\S]*)?\s(?:style=[\S]*)?\s(?:onclick=[\S]*)?\s(?:border=[\S]*)?\stitle=[\]["]([\S]*)[\]["]\s?[/]>/ig;
        var weiboImgReg = /<img\s\S*\salt=[']([\S]*)[']\s?[/]>/ig;
        var imgMagic = /<img\s(?:height=[\S]*)?\s(?:width=[\S]*)?\s(?:border=[\S]*)?\stitle=[\]["]([\S]*)[\]["]\s(?:onclick=[\S]*)?[\S\s]*[/]>/ig;
        item.temp_cms_body = item.cms_body.replace(imgReg,'[$1]');
        item.temp_cms_body = item.temp_cms_body.replace(weiboImgReg,'$1');
        item.temp_cms_body = item.temp_cms_body.replace(imgMagic, '[$1]');
        */
        function strip(html) {
             var tmp = document.createElement("DIV");
             tmp.innerHTML = html;
             return tmp.textContent || tmp.innerText || "";
        }
        var num = this.__getLen(strip(item.cms_body));
        if (num > 280){
          item.show_more = "";
          item.moreInfo = '<div class="SG_revert_Inner SG_txtb" id="body_cmt_full_'+item.id+'" style="display:none;">'+item.cms_body+
                      '<a href="javascript:void(0);" class="btn_artsq" style="display:"";" action-type="comment_more" action-data="'+item.action_data+'"></a>'+
                    '</div>';
          //item.cms_body = this.leftB(item.temp_cms_body, 280);
          item.cms_body = this.cutHtmlString(item.cms_body, 280);
        }
      }
      
    }else if(this.type === "reply"){
      li.id = "reply_"+item.id;
      if (len >= 1 && index === (len-1)){// 如果已经有很多回复了，只有最后一个评论需要虚线
        li.className = '';
      }
      if (len == 0 && index == -1){// 如果增加的是第一个回复，不带虚线
        li.className = '';
      }
       // '<a href="#{source_ria_index_url}" target="_blank">#{source_uname}</a>：'+
      if (item.source_uid == 0){
        item.soure_user_info = '&nbsp;'+item.source_uname+'&nbsp;：';
      }else{
        item.soure_user_info =  '&nbsp;<a href="'+item.source_ria_index_url+'" target="_blank">'+item.source_uname+'</a>'+item.source_vimg+'：';
      }
    }
    
    if ($UID && (item.comm_uid == $UID || item.src_uid == $UID)){
      item.show_del = "";
    }else{
      item.show_del = "none";
    }

    if (item.fromProduct != "qing"){
      item.show_report = "";
    }else{
      item.show_report = "none";
    }

        var severtime = new Date();
        var commtime  = new Date(item.cms_pubdate.replace(/-/g,"/"));
    item.cms_pubdate = this.dateFormat(severtime,commtime);
        var htmlStr = new Lib.HtmlTemplate(this.tpl).evaluate(item);
        li.innerHTML = htmlStr;
        return li;
        // opt.containerNode.insertBefore(li, opt.containerNode.firstChild);
    },
    
    /**
     * 添加一条最新回复到当前回复列表
     * @param node 渲染成功的回复节点
     * @param id     当前回复的评论的ID
      */
    
    appendItem: function(node, id){
        var parent = $E("comment_"+id+"_replylist");
        parent.insertBefore(node, parent.firstChild);
        parent.style.display = "";
    },
    
    /**
     * 默认的评论及回复列表
      */
    
    getTpl: function(){
        if (this.type === "comment"){
            return     '<div class="SG_revert_Left">'+
              // '<a href="#{ulink}" target="_blank"><img src="#{user_image}"></a>'+
              '#{user_image_place}'+
                        '</div>'+
                        '<div class="SG_revert_Cont">'+
                            '<p><span class="SG_revert_Tit">'+
                // '<a href="#{ulink}">#{uname}</a>
                '#{user_nick_place}'+
                '#{god_comment}</span>#{vimg}'+
                            '</p>'+
                            '<div class="SG_revert_Inner SG_txtb" id="body_cmt_#{id}">#{cms_body}'+
                                '<a href="javascript:void(0);" class="btn_artzk" style="display:#{show_more}" action-type="comment_more" action-data="#{action_data}"></a>'+
                            '</div>'+
              '#{moreInfo}'+
                            '<p class="myReFrom">'+
                                // '<em class="SG_txtc">#{cms_pubdate}</em>来自<a target="_blank" href="#{ulink}">#{from}#{uname}</a>的评论'+
                '<em class="SG_txtc">#{cms_pubdate}</em>#{user_from_weibo}'+
                                '<span class="SG_revert_Func">'+
                                    '<a href="javascript:void(0);" class="SG_a_fuc" action-type="comment_report" action-data="#{action_data}" style="display:#{show_report}"><cite>举报</cite></a>'+
                                    '<a href="javascript:void(0);" class="SG_a_fuc" action-type="comment_del" action-data="#{action_data}" style="display:#{show_del}">删除</a>' +
                                    '<a href="javascript:void(0);" class="SG_a_fuc" action-type="comment_share" action-data="#{action_data}" style="display:#{show_share}"><cite>分享</cite></a>'+
                                    '<a href="javascript:void(0);" class="SG_a_fucs" action-type="comment_reply" action-data="#{action_data}" style="display:#{show_reply}"><cite>回复#{cms_reply_num}</cite></a>'+
                                '</span>'+
                            '</p>'+
                            '<div class="SG_reply" id="comment_#{id}" style="display:none;">'+
                            '</div>'+
                        '</div>';
        }else{
            return     '<div class="img"><a href="#{ria_index_url}" target="_blank"><img src="#{user_image}"></a></div>'+
                        '<div class="txt">'+
                            '<p'+ ($FF ? ' style="white-space:pre-wrap;"' : '') +'><a href="#{ria_index_url}" target="_blank">#{uname}</a>#{vimg}&nbsp;回复'+
                            // '<a href="#{source_ria_index_url}" target="_blank">#{source_uname}</a>：'+
                            '#{soure_user_info}'+
                            '#{cms_body}'+
                            '(#{cms_pubdate})</p>'+
                        '</div>'+
                        '<div class="links">'+
                            '<a href="javascript:void(0);" action-type="reply_report" action-data="#{action_data}" style="display:#{show_report}">举报</a>'+
                            '<a href="javascript:void(0);" action-type="reply_del" action-data="#{action_data}" style="display:#{show_del}">删除</a>'+
                            '<a href="javascript:void(0);" action-type="reply_share" action-data="#{action_data}" style="display:#{show_share}">分享</a>'+
                            '<a href="javascript:void(0);" class="links_s" action-type="reply_reply" action-data="#{action_data}" style="display:#{show_reply}">回复</a>'+
                        '</div>';
        }
    },
    
  
  __getLen: function(a) {
    if (!a) {
      return 0;
    }
    var b = a.match(/[^\x00-\xff]/g);
    return a.length + (b ? b.length : 0);
  },
    /**
     * 将JSON对象变成字符串，并编码
      */
    
    obj2str: function(obj){
        return encodeURIComponent(this.jsonUtil.flatten(obj));
    },
    
    /**
     * 解码字符串，并变成JSON对象
      */
     
    str2obj: function(str){
        return this.jsonUtil.eval(decodeURIComponent(str));
    },
    /**
     * 时间格式化
    **/
    dateFormat :function(dServerTime, dFeedTime){
        var MTEXT = "月";
        var DTEXT = "日";
        var TODAYTEXT = "今天";
        var BSTEXT = "秒前";
        var BMTEXT = "分钟前";
        var server_year = dServerTime.getFullYear();
        var feed_year = dFeedTime.getFullYear();
        
        var server_month = dServerTime.getMonth() + 1;
        var feed_month = dFeedTime.getMonth() + 1;
        
        var server_day = dServerTime.getDate();
        var feed_day = dFeedTime.getDate();
        
        var server_hour = dServerTime.getHours();
        var feed_hour = dFeedTime.getHours();
        if(feed_hour < 10) feed_hour = "0" + feed_hour;
    feed_hour = '&nbsp;'+feed_hour;
        var feed_minute = dFeedTime.getMinutes();
        if(feed_minute < 10) feed_minute = "0" + feed_minute;
        
        var diff_time = dServerTime - dFeedTime;
        diff_time = diff_time > 0 ? diff_time : 0;
        diff_time = diff_time/ 1000;
        
        if (server_year != feed_year) {//不在同一年显示(年-月-天 *时：*分)
            return feed_year + '-' + feed_month + '-' + feed_day + ' ' + feed_hour + ':' + feed_minute;
        } else 
            if (server_month != feed_month || server_day != feed_day) {//不在同一月或同一天显示(*月*天时:分)
                return feed_month + MTEXT + feed_day + DTEXT + feed_hour + ':' + feed_minute;
            } else if (server_hour != feed_hour && diff_time > (60 * 60)) {//不在同一小时且时差大于60分钟显示(今天*时:*分)
                    return TODAYTEXT + feed_hour + ':' + feed_minute;
                } else if(diff_time < 51){//时差小于51秒显示(10秒内显示10秒前,11-20秒20秒前，...50秒前)
                    diff_time = diff_time < 1 ? 1 : diff_time;
                    return (Math.floor((diff_time - 1) / 10) + 1) + "0" + BSTEXT;
                } else {//大于51秒时，按分钟数显示
                    return Math.floor((diff_time / 60) + 1) + BMTEXT;
                }
        return '';
    }
});
