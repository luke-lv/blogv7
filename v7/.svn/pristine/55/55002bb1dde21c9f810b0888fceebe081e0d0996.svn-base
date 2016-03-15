/** 
 * @fileoverview 评论系统V2 - 改进版 用于新编辑器发布页
 * @author fuqiang3@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("lib/lazyload.js");
$import("lib/listener.js");
$import("lib/commentv2/commentList.js");
$import("sina/core/dom/getTop.js");
$import("tempLib/magicFace/magicFace.js");
$import("sina/ui/tween/tweenStrategy.js");

$registJob("articleCommentV2_new", function(){                

  var replyNewTpl = '<p class="com_content">'+
                       '<a href="#{ria_index_url}" class="reply_name first" target="_blank">#{uname}</a>#{vimg}&nbsp;<span class="BNE_txtC">回复</span>'+
                       '#{soure_user_info}'+
                       '#{cms_body}'+
                    '</p>'+
                    '<div class="com_reply">'+
                       '<span class="time">#{cms_pubdate}</span>'+
                       '<div class="reply_opera">'+
                       '<a href="javascript:;" action-type="reply_del" action-data="#{action_data}" style="display:#{show_del}" class="reply_del">删除</a>'+
                       '<a href="javascript:;" action-type="reply_report" action-data="#{action_data}" style="display:#{show_report}" class="reply_report">举报</a>'+
                       '<a href="javascript:;" action-type="reply_reply" action-data="#{action_data}" style="display:#{show_reply}" class="reply_a">回复</a>'+
                       '</div>'+
                    '</div>';

  var commentNewTpl = '<a href="#{ulink}" class="com_name">#{uname}</a>'+
                      '<p class="com_content" id="body_cmt_#{id}">#{cms_body}'+
                          '<a href="javascript:void(0);" class="more" style="display:#{show_more}" action-type="comment_more" node-type="more" action-data="#{action_data}">查看更多<i class="icon i27_arr_down"></i></a>'+
                      '</p>'+
                      '#{moreInfo}'+
                      '<div class="com_reply">'+
                          '<span class="time">#{cms_pubdate}</span>'+
                          '<div class="reply_opera">'+
                          '<a href="javascript:;" action-type="comment_del" action-data="#{action_data}" style="display:#{show_del}" class="reply_del">删除</a>'+
                          '<a href="javascript:;" action-type="comment_report" action-data="#{action_data}" style="display:#{show_report}" class="reply_report">举报</a>'+
                          '<a href="javascript:;" action-type="comment_reply" action-data="#{action_data}" style="display:#{show_reply}" class="reply_a"><span class="BNE_txtC"> #{cms_reply_num} </span> 回复</a>'+
                          '</div>'+
                       '</div>'+
                       '<div class="commentary_window clearfix reply2 #{show_exp}" id="comment_#{id}" style="display:none;"></div>'+
                       '<a href="javascript:;" action-data="#{action_data}" class="up_contraction" action-type="comment_reply" style="display:none;">收起<i class="icon i28_arr_up"></i></a>';
   //重写UI组件
   Ui.Pagination.show = function(oNode,nCurPage){
     nCurPage = nCurPage * 1;
     var hash = this._cache_node;
     if(oNode != null) {
       this._cache_node = hash = Ui.Pagination._list[oNode.id];
       hash.curPage = nCurPage;
     }
     var ambit = [];
     if(hash.viewSize * 2 + 1 >= hash.maxPage){
       ambit[1] = hash.minPage;
       ambit[2] = hash.maxPage;
     }
     else if(hash.curPage <= hash.minPage + hash.viewSize){
       ambit[1] = hash.minPage;
       ambit[2] = hash.minPage + (hash.viewSize * 2 - 1);
       ambit[3] = hash.maxPage;
     }
     else if(hash.curPage >= hash.maxPage - hash.viewSize){
       ambit[0] = hash.minPage;
       ambit[1] = hash.maxPage - (hash.viewSize * 2 - 1);
       ambit[2] = hash.maxPage;
     }
     else{
       ambit[0] = hash.minPage;
       ambit[1] = hash.curPage - (hash.viewSize - 1);
       ambit[2] = hash.curPage + (hash.viewSize - 1);
       ambit[3] = hash.maxPage;
     }

     var result = [];
     // 分页起始部分的统计信息
     if(hash.countTpl != null){
       result.push(this._createPage("", "", "", "", hash.countTpl));
     }
     // 上一页按钮
     if(hash.type != 2 && hash.curPage != hash.minPage){
       if(hash.type == 3)
         result.push(this._createPage(hash.nodeClassNamePrefix+" lik_p", hash.curPage - 1, 3, hash.curPage - 1, "上页"));
       else
       result.push(this._createPage(hash.nodeClassNamePrefix+" lik_p", hash.curPage - 1, 3, hash.curPage - 1, "< 上一页"));
     }
     
     // 中部的分页信息
     if(hash.type != 3){
       if(ambit[0] != null){
         var str = (ambit[0] == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix+ ' lik_cur', 1, 6, hash.curPage, ambit[0])
           : this._createPage(hash.nodeClassNamePrefix, 1, 1, ambit[0], ambit[0]);
         result.push(str);
       }

       if(hash.type == 1 && ambit[0] != null){
         result.push(this._createPage(hash.nodeClassNamePrefix, "", "", "", "..."));
       }

       for(var i = ambit[1]; i <= ambit[2]; i ++){
         if(i == ambit[1] && i != hash.minPage && hash.type == 2){
           var LS = hash.curPage - hash.dotRate;
           LS = LS < hash.minPage ? hash.minPage : LS;
           result.push(this._createPage(hash.nodeClassNamePrefix, hash.viewSize + 1, 2, hash.curPage - hash.viewSize - 1, "..."));
         }
         else if(i == ambit[2] && i != hash.maxPage && hash.type == 2){
           var RS = hash.curPage + hash.dotRate;
           RS = RS > hash.maxPage ? hash.maxPage : RS;
           result.push(this._createPage(hash.nodeClassNamePrefix, hash.viewSize + 1, 4, hash.curPage + hash.viewSize + 1, "..."));
         }
         else{
           str = (i == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix + ' lik_cur', 1, 6, hash.curPage, i)
             : this._createPage(hash.nodeClassNamePrefix,i, 3, i, i);
           result.push(str);
         }
       }
       if(hash.type == 1 && ambit[3] != null){
         result.push(this._createPage(hash.nodeClassNamePrefix, "", "", "", "..."));
       }
       if(ambit[3] != null && hash.showLastPage){
         str = (ambit[3] == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix+' lik_cur', hash.curPage - 1, 3, hash.curPage, ambit[3])
             : this._createPage(hash.nodeClassNamePrefix, 1, 5, ambit[3], ambit[3]);
         result.push(str);
       }
     }
     else{
       result.push(this._createPage(hash.nodeClassNamePrefix, "", "", "", hash.curPage + hash.maxPage));
     }
     // 下一页按钮
     if(hash.type != 2 && hash.curPage != hash.maxPage){
       if(hash.type == 3)
         result.push(this._createPage(hash.nodeClassNamePrefix+" lik_n", hash.curPage + 1, 3, hash.curPage + 1, "下页"));
       else
         result.push(this._createPage(hash.nodeClassNamePrefix+" lik_n", hash.curPage + 1, 3, hash.curPage + 1, "下一页 >"));
     }
     // 总页数
     if (hash.showTotal == true){
       result.push(this._createPage(hash.nodeClassNamePrefix, "", "", "", "共" + hash.maxPage + "页"));
     }
     $E(hash.pageNode).innerHTML = '<div class="pageBox">' + result.join("") + '</div>';
   };
   Ui.Pagination._createPage = function(sClass, sTipPage, nTipIndex, nHrefPage, sHrefText){
     if(sHrefText == ""){ return "";}
     var sTitle = (sTipPage === "" || nTipIndex == "") ? "" : this._getTips(sTipPage, nTipIndex);
     var sLink = '<a title="'+sTitle+'" class="'+sClass+'"' + this._getUrl(nHrefPage) + '>' + sHrefText + '</a>';
     return sLink;
   };
  //重写分页
  CommentV2.ReplyList.prototype.paging = function(){
     var __this = this;
     var paging = $E('comment_'+this.data.commentid+'_pages');
     if (paging){
         var perpage = 20, pages = 0;
         if (this.total % perpage == 0){
             pages = Math.ceil(this.total / perpage);
         }else{
             pages = Math.floor(this.total / perpage) + 1;
         }
         if (this.total > perpage) {
             paging.parentNode.style.display = "block";
             paging.style.display='block';
             Ui.Pagination.init({
                 "pageNode": "comment_"+__this.data.commentid+"_pages",
                 "nodeClassNamePrefix": "lik_a",
                 "curPage": this.page, // 当前所在页码
                 "maxPage": pages, //最大页数
                 "pageTpl": function(page){
                     // scope.$reply_page = page;
                     __this.load(page);
                     location.hash = "";
                 }
             }).show();
         }else{
             paging.parentNode.style.display = "none";
         }
     }
  };
  CommentV2.CommentList.prototype.more = function(opt){
    trace("CommentV2.CommentList.more");
    var id = opt.data.commentid;
    var partCmsNode = $E("body_cmt_"+id);
    var fullCmsNode = $E("body_cmt_full_"+id);
    if (opt.node.getAttribute('node-type') == "more"){// 收起状态，点击展开
      v7sendLog('32_01_03');
      partCmsNode && (partCmsNode.style.display = "none");
      fullCmsNode && (fullCmsNode.style.display = "");
    }else if (opt.node.getAttribute('node-type') == "up"){// 展开状态，点击收起
      v7sendLog('32_01_04');
      partCmsNode && (partCmsNode.style.display = "");
      fullCmsNode && (fullCmsNode.style.display = "none");
    }
  };
  CommentV2.CommentList.prototype.renderNoComment = function(){
    this.containerNode.innerHTML = '<li class="com_nolist"><i class="icon i44_rev"></i><p class="txt">你是第一个评论者呦！</p></li>';
  };
  
  CommentV2.CommentList.prototype.paging = function(){
    var __this = this;
    var paging = $E("commentPaging");
    if (paging){
      var perpage = 50, pages = 0;
      if (this.total % perpage == 0){
        pages = Math.ceil(this.total / perpage);
      }else{
        pages = Math.floor(this.total / perpage) + 1;
      }
      // scope.$totle_comment = this.total;
      // scope.$comment_page = this.page;
      if (this.total > perpage) {
        paging.parentNode.style.display = "block";
        var commentList = $E('article_comment_list');
        if (commentList && commentList.style.display !== 'none'){
        $E('commentPaging').style.display='block';
        }
        Ui.Pagination.init({
          "pageNode": "commentPaging",
          "nodeClassNamePrefix": "lik_a",
          "curPage": this.page, // 当前所在页码
          "maxPage": pages, //最大页数
          "pageTpl": function(page){
            // scope.$comment_page = page;
            __this.load(page);
          }
        }).show();
        paging.onclick = this.sudaClick;
      }else{
        paging.style.display = "none";
      }
    }
  };

  //复写隐藏显示reply
  CommentV2.List.prototype.show = function(){
    this.containerNode.style.display = '';
    this.containerNode.nextSibling.style.display = '';
  };
  CommentV2.List.prototype.hide = function(){
    this.containerNode.style.display = 'none';
    this.containerNode.nextSibling.style.display = 'none';
  };
  //复写reply
  CommentV2.ReplyList.prototype.reply = function(opt){
        var __this = this;
        // trace("CommentV2.ReplyList.reply");
        // trace(opt.node);
        if (!opt.containerNode.isInited){
            v7sendLog('32_01_05');
            opt.node.innerHTML = "<cite>取消回复</cite>";
            var str = '<div id="reply_'+opt.data.replyid+'_textarea"></div>';
            var div = document.createElement("div");
            div.className = "reply_reply clearfix";
            div.innerHTML = str;
            div.id = "reply_"+opt.data.replyid+"_textcon";
            opt.containerNode.appendChild(div);
            opt.containerNode.isInited = true;
            var replyArea = $E("reply_"+opt.data.replyid+"_textarea");
            var item = opt.data;
            this._openAreas[opt.data.replyid] = new CommentV2.CommentArea({
                container: replyArea, 
                autolineheight:"yes",
                sid:new Date().getTime(),
                shownum: 'no',
                okhandler:function() {
                    var replyCon = $E("reply_"+opt.data.replyid+"_textcon");
                    if(replyCon){
                        replyCon.style.display = "none";
                        opt.node.innerHTML = "<cite>回复</cite>";
                    }
                }
            });
            $E("reply_"+opt.data.replyid+"_textcon").getElementsByTagName('i')[0].className = 'icon i43_toparr';
             
            this._openAreas[opt.data.replyid].setReplyData(__this, {
                article_id: opt.articleid,                                // 博文ID
                reply_cmsid: item.replyid,                                // 二级评论ID
                stair_cmsid: item.commentid,                            // 一级评论ID
                src_uname: this.ownerNickName,                            // 博主昵称
                blog_title: $E("t_"+opt.articleid).innerHTML,        // 博文标题
                uid: $UID,                                                    // 发二级评论人的UID/当前登录用户的UID
                // uname: scope.$loginNick,                            // 发二级评论人的昵称/当前登录用户的昵称
                source_uid: item.comm_uid,                            // 被回复的一级评论人的UID/被回复的二级评论的UID
                source_uname: item.uname,                            // 被回复的一级评论人的昵称/被回复的二级评论的昵称
                // reply_content: item.cms_body,                        // 一级评论或二级评论的内容
                login_name: scope.$loginNick,                        // 同uname
                is_t: 0,                                                        // 是否分享到微博
                source_ulink: item.source_ulink                       // 评论人的链接
            });
            this.setSrcComment(item.replyid,item.src_uid,this._openAreas[opt.data.replyid]);
        }else{
            var replyCon = $E("reply_"+opt.data.replyid+"_textcon");
            if (replyCon.style.display == "none"){
                v7sendLog('32_01_05');
                replyCon.style.display = "";
                if(this._openAreas[opt.data.replyid].getValue() == ""){
                    this.setSrcComment(opt.data.replyid,opt.data.src_uid,this._openAreas[opt.data.replyid]);
                }
                opt.node.innerHTML = "<cite>取消回复</cite>";
            }else{
                replyCon.style.display = "none";
                opt.node.innerHTML = "<cite>回复</cite>";
            }
        }
  };
  //复写子评论容器
  CommentV2.ReplyList.prototype.initContainerAndTextArea = function(){
        if(this.containerIsReady){
            return;
        }
        var str = '<div id="comment_'+this.data.commentid+'_textarea"></div>'+
                  '<ul class="com_list" id="comment_'+this.data.commentid+'_replylist" style="display:none;"></ul>'+
                  '<div id="loading_'+this.data.commentid+'" style="display:none">'+
                       '<p>正在加载，请稍后...</p>'+
                   '</div>'+
                   '<div class="BNE_page" style="display:none;">'+
                        '<div class="pageBox" id="comment_'+this.data.commentid+'_pages"></div>'+
                   '</div>';
        this.containerNode.innerHTML = str;
        this.renderTextArea();
        this.containerIsReady = 1;
  };
  //复写评论回复成功函数
  CommentV2.CommentArea.prototype.successFun = function(){
    this._tarea.value = "";
    this._checkNum();
    var _this = this;
    if(this._alertnotice){
      winDialog.alert("发布成功" , {
        icon:"03",
          funcOk: function(){
            _this._plugs.sucOkFun && _this._plugs.sucOkFun();//发布成功点击ok确定后的回调
          }
      });
    }
    this._okhandler();

    // 新版 评论回复成功后+1
    var str = $E('blog_comments_num').innerHTML;
    var num = parseInt(str, 10);
    num = (num++) > 999 ? '999+' : num;
    $E('blog_comments_num').innerHTML = num;
  };
  //复写textareaTpl;
  CommentV2.CommentArea.prototype._setTpl = function(){
    this.tpl = '<div id="tare'+this._sid+'"><textarea class="textarea_com" node-type="textEl"></textarea>'+
               '<div class="reply_button">'+
                  '<span class="txt_num" node-type="num">您还能输入'+(this._maxtext / 2)+'字</span>'+
                  '<a href="#" class="submit_a" node-type="subtnEl">回复</a>'+
                  '<input node-type="shareIpt" type="checkbox" style="display:none;">'+
               '</div>'+
               '<i class="icon i29_arr_down"></i></div>';
  };
  CommentV2.CommentArea.prototype._initDom = function(){
    var container = this._selfcontainer;
    if (!container) {
      return;
    }
    this._tarea = Core.Dom.getElementsByAttr(container, "node-type", "textEl")[0];
    this._num = Core.Dom.getElementsByAttr(container, "node-type", "num")[0];
    this._subtn = Core.Dom.getElementsByAttr(container, "node-type", "subtnEl")[0];
    //this._facebtn = Core.Dom.getElementsByAttr(container, "node-type", "faceBtn")[0];
    this._facebtn = null;
    this._shareitp = Core.Dom.getElementsByAttr(container, "node-type", "shareIpt")[0];
    this._shareitp.checked = Utils.Cookie.getCookie("acp_bb") == "1" ? false : true;
    if (!this._shownum) {
      this._num.style.display = "none";
    }
  };

  //复写render方法
  CommentV2.Add.prototype.render = function(item,index,len){
    // window.onerror = null;
    var li = $C("li");
    
    li.className = 'com_item';
    item.cms_body = decodeURIComponent(item.cms_body);//转码
    item.vimg = item.vimg ? item.vimg : "";
    item.source_vimg = item.source_vimg ? item.source_vimg : "";

    item.from = '';
    item.cms_reply_num = item.cms_reply_num ? '('+item.cms_reply_num+')' : '';
    item.show_more = "none";
    item.moreInfo = "";
    // debugger
    if (this.type === "comment"){
      li.id = "cmt_"+item.id;
      // user_image_place:  '<a href="#{ria_index_url}" target="_blank"><img src="#{user_image}"></a>'+
      // user_nick_place:  '<a href="#{ria_index_url}">#{uname}</a>'
      // user_from_place: '<a target="_blank" href="#{ulink}">#{from}#{uname}</a>'
      if (item.comm_uid === 0){
        // item.user_image = "http://blogimg.sinajs.cn/v5images/default.gif";
        item.user_image_place = '<img src="'+item.user_image+'">';
        // item.user_from_place = item.uname;
        item.user_nick_place = item.uname;
      }else{
        item.user_image_place = '<a href="'+item.ria_index_url+'" target="_blank"><img src="'+item.user_image+'"></a>';
        item.user_nick_place = '<a href="'+item.ria_index_url+'">'+item.uname+'</a>';
        // item.user_from_place = '<a target="_blank" href="'+item.ulink+'">'+item.from+item.uname+'</a>';
      }

      //修改cms_body里的a标签class
      item.cms_body = item.cms_body.replace(/<a\s(.*?)>(.*?)<\/a>/ig,function($1,$2,$3){
         return '<a class="reply_name" '+$2+'>'+$3+'</a>'; 
      });

      //是否有子评论
      item.show_exp = '';
      if(item.cms_reply_num.replace(/\(|\)/gi,'') > 0){
        item.show_exp = 'expansion';
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
          item.moreInfo = '<p class="com_content" id="body_cmt_full_'+item.id+'" style="display:none;">'+item.cms_body+
                      '<a href="javascript:void(0);" class="more" style="display:" action-type="comment_more" node-type="up" action-data="'+item.action_data+'">收起评论<i class="icon i28_arr_up"></i></a>'+
                    '</p>';
          item.cms_body = this.cutHtmlString(item.cms_body, 280);
        }
      }
      
    }else if(this.type === "reply"){
      li.id = "reply_"+item.id;
      if (len >= 1 && index === (len-1)){// 如果已经有很多回复了，只有最后一个评论需要虚线
        li.className = 'com_item last';
      }
      if (item.source_uid === 0){
        item.soure_user_info = '&nbsp;'+item.source_uname+'&nbsp;：';
      }else{
        item.soure_user_info =  '&nbsp;<a class="reply_name secound" href="'+item.source_ria_index_url+'" target="_blank">'+item.source_uname+'</a>'+item.source_vimg+'：';
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
  };
  CommentV2.Post.prototype.isNoCotent = function(){
    var outContainer = $E('article_comment_list');
    var li = outContainer.getElementsByTagName('li');
    for(var i=0; li[i]; i++) {
      if(li[i].className.toUpperCase().indexOf('COM_NOLIST')!= -1) {
          return li[i];
      }
    }
    return null;
  };
  CommentV2.Post.prototype.renderLogin = function(){
    //发评论前未登陆，输入用户名密码正确登陆后发评论，需要将登陆状态刷新到页面上
    $tray.renderLogin();
  };

  CommentV2.Post.prototype.commentTween = function(li){
    var me = this;
    var commentContent = $E('article_comment_list');
    commentContent.appendChild(li);
    // 新版增加相关文章组件，评论被隐藏，因而不需要定位评论位置了，定位放到评论成功后了
    // var posY = Core.Dom.getXY(li)[1];
    // console.log('info:'+posY);
    // me.setScollTop(posY);
  };

  //重写删除回复

  CommentV2.Delete.prototype.deleteReply = function(opt, delSucc){
    trace("CommentV2.CommentDel.deleteReply");
    // trace(opt);
    
    var __this = this;
    var data = opt.data;
    var styleState = "", subText = "", title = "确认需要删除此条回复？<br/>删除后不可恢复。";
    
    if($UID==data.comm_uid){
      styleState=' style="display:none" ';
    }
    
    if (data.fromProduct !== "qing"){//来自qing的评论删除的时候不能加入黑名单
      subText = '<span '+styleState+'><input id="cbAddToBlock_'+data.commentid+'" type="checkbox"/><label for="cbAddToBlock_'+data.commentid+'">将此人加入黑名单</label></span>'
    }
    
    this.del_url = new Interface("http://control.blog.sina.com.cn/admin/comment_new/cms_del_usereply_post.php", "ijax");
    
    winDialog.confirm(title,{
      subText: subText,
      textOk:'删除',
      funcOk:function(){
        var deleteOption = {
          POST:{
            "article_id": data.articleid,       // 文章ID
            "cms_id": data.replyid,         // 回复ID
            "cms_uid": data.comm_uid,           // 回复发布者UID
            "login_uid": $UID,              // 当前登录用户
            "source_uid": data.source_uid,    // 被回复人的UID
            "stair_cmsid": data.commentid,    // 一级评论ID
            "inblack": $E("cbAddToBlock_"+data.commentid).checked ? "1" : "0" // 是否加入黑名单
          },
          onSuccess: function(result){
            var node = $E("reply_"+data.replyid);
            var slide = new Ui.Slide(node);
            slide.onSlideOut = function(){
              Core.Dom.removeNode(node);
            }
            slide.slideOut();
            if (delSucc && typeof delSucc === "function"){
              delSucc(result);
            }

            // 新版 评论回复删除成功后-1
            var str = $E('blog_comments_num').innerHTML;
            var num = parseInt(str, 10);
            num = (num--) > 999 ? '999+' : num;
            num = (num < 0) ? 0 : num;
            $E('blog_comments_num').innerHTML = num;
          },
          onError: function(result){
            __this.showError(result);
          },
          onFail: function(result){
            __this.showError(result);
          }
        }
        __this.del_url.request(deleteOption);
      }
    });
  
  };
  
  //重写删除
  CommentV2.Delete.prototype.deleteComment = function(opt, delSucc){
    trace("CommentV2.CommentDel.deleteComment");
    var __this = this;
    var data = opt.data;
    var styleState = "", subText = "", title = "确认需要删除此条评论？<br/>删除后不可恢复。";
    
    if($UID==data.comm_uid||data.comm_uid==0){// 如果删除自己的评论，或者删除匿名评论，不显示拉黑subText
      styleState=' style="display:none" ';
    }

    if (data.fromProduct !== "qing"){//来自qing的评论删除的时候不能加入黑名单
      subText = '<span '+styleState+'><input id="cbAddToBlock_'+data.commentid+'" type="checkbox"/><label for="cbAddToBlock_'+data.commentid+'">将此人加入黑名单</label></span>'
    }
    
    this.del_url = new Interface("http://control.blog.sina.com.cn/admin/comment_new/cms_del_post.php", "ijax");

    winDialog.confirm(title,{
      subText: subText,
      textOk:'删除',
      funcOk:function(){
        var deleteOption = {
          POST:{
            "article_id": data.articleid,   // 文章ID
            "cms_id": data.commentid,   // 评论ID
            "cms_uid": data.comm_uid, // 评论发布者UID
            "login_uid": $UID          // 当前登录用户
          },
          onSuccess: function(result){
            var node = $E("cmt_"+data.commentid);
            var slide = new Ui.Slide(node);
            slide.onSlideOut = function(){
              Core.Dom.removeNode(node);
            }
            slide.slideOut();
            if (delSucc && typeof delSucc === "function"){
              delSucc(result);
            }

            // 新版 评论删除成功后-1
            var str = $E('blog_comments_num').innerHTML;
            var num = parseInt(str, 10);
            num = (num--) > 999 ? '999+' : num;
            num = (num < 0) ? 0 : num;
            $E('blog_comments_num').innerHTML = num;
          },
          onError: function(result){
            __this.showError(result);
          },
          onFail: function(result){
            __this.showError(result);
          }
        };
  if($E('cbAddToBlock_'+data.commentid)){
    deleteOption.POST.inblack = $E("cbAddToBlock_"+data.commentid).checked ? 1 : 0 // 是否加入黑名单
  }
        __this.del_url.request(deleteOption);
      }
    });
  };

  Lib.LazyLoad([$E("commonComment")], {
    callback  : function () {
      if (!scope.$comment_is_load_page_1 && scope.$private.cms != 1 && scope.$isCommentAllow != 1) {
        var myComment = new CommentV2.CommentList({
          purl: 'http://blog.sina.com.cn/s/comment_'+scope.$articleid,
          containerNode: $E('article_comment_list'),
          commentTpl: commentNewTpl,
          replyTpl: replyNewTpl
        });
      }
    }
  });

  // Lib.Listener.on({
  //   name: 'commentlist-isready',
  //   callBack: function(data){
  //       var num = data.comment_total_num;
  //       num = (num>999) ? '999+' : num;
  //       $E('blog_comments_num').innerHTML = num;


  //         // 取出评论列表的高度
  //         // var height = 0;
  //         // $E('article_comment_list').style.top = -1111 + 'px';
  //         // $E('article_comment_list').style.left = -1111 + 'px';
  //         // $E('article_comment_list').style.position = 'absolute';
  //         // $E('article_comment_list').style.display = '';

  //         // height = $E('article_comment_list').offsetHeight;

  //         // $E('article_comment_list').style.top = '';
  //         // $E('article_comment_list').style.left = '';
  //         // $E('article_comment_list').style.position = '';
  //         // $E('article_comment_list').style.display = 'none';

  //         // var twn;
  //   },
  //   scope: this
  // });


  if ($E('show_blog_comments')){
    // <span class="com_btn_a" id="show_blog_comments">展开<i class="com_btn_ico1"></i></span>
    Core.Events.addEvent($E('show_blog_comments'), function(){
      var iNode = $E('show_blog_comments').getElementsByTagName('i')[0];
      if (iNode && iNode.className.indexOf('com_btn_ico1')>=0){
        $E('hide_blog_comments').style.display = '';
        // $E('article_comment_list').style.height = '0px';
        $E('article_comment_list').style.display = '';

        if ($E('commentPaging').innerHTML.indexOf('showPage') >= 0){
          $E('commentPaging').style.display = 'block';
        }
        // twn && twn.stop();
        // twn = new Ui.TweenStrategy(0, height, 1, Ui.Transition.strongEaseOut);
        // twn.onTween = function(value){
        //   $E('article_comment_list').style.height = value + 'px';
        // };
        // twn.onEnd = function(){
          
        // };
        // twn.start();

        // iNode.className = 'com_btn_ico2';
        $E('show_blog_comments').innerHTML = '收起<i class="com_btn_ico2"></i>';
      }else{
        $E('article_comment_list').style.display = 'none';
        $E('hide_blog_comments').style.display = 'none';
        if ($E('commentPaging').innerHTML.indexOf('showPage') >= 0){
          $E('commentPaging').style.display = 'none';
        }
        // twn && twn.stop();
        // var twn = new Ui.TweenStrategy(height, 0, 1, Ui.Transition.strongEaseOut);
        // twn.onTween = function(value){
        //   $E('article_comment_list').style.height = value + 'px';
        // };
        // twn.onEnd = function(){
        //   $E('article_comment_list').style.display = 'none';
        // };
        // twn.start();
        // iNode.className = 'com_btn_ico1';
        $E('show_blog_comments').innerHTML = '展开<i class="com_btn_ico1"></i>';
      }
    });
  }




  if ($E('hide_blog_comments')){
    Core.Events.addEvent($E('hide_blog_comments'), function(){
      var iNode = $E('show_blog_comments').getElementsByTagName('i')[0];
      if (iNode){
        $E('hide_blog_comments').style.display = 'none';
        $E('article_comment_list').style.display = 'none';
        // twn && twn.stop();
        // var twn = new Ui.TweenStrategy(height, 0, 1, Ui.Transition.strongEaseOut);
        // twn.onTween = function(value){
        //   $E('article_comment_list').style.height = value + 'px';
        // };
        // twn.onEnd = function(){
        //   $E('article_comment_list').style.display = 'none';
        // };
        // twn.start();

        // iNode.className = 'com_btn_ico1';
        $E('show_blog_comments').innerHTML = '展开<i class="com_btn_ico1"></i>';
        // 分页情况下  隐藏页码
        if ($E('commentPaging').innerHTML.indexOf('showPage') >= 0){
          $E('commentPaging').style.display = 'none';
        }
        
        // 重新定位相关阅读列表位置
        var pNode = $E('blog_relatefeed').parentNode;
        if (pNode){
          var top = Core.Dom.getTop(pNode);
          top -= 200;
          if (document.documentElement.scrollTop){
            document.documentElement.scrollTop = top;
          }else{
            document.body.scrollTop = top;
          }
        }
      }
    })
  }

});
