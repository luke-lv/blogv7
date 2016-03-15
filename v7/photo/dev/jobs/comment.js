/*
 * @author Jay Chan | chenjie@staff.sina.com.cn
 * @description 图片评论
 */

 $import("sina/core/string/format.js");
 $import("sina/core/string/encodeHTML.js");
 $import("sina/core/string/decodeHTML.js");
 $import("sina/core/dom/getElementsByClass.js");
$import('sina/utils/limitLength.js');
 $import("sina/core/system/br.js");
 $import("sina/ui/pagination.js");

 $import("msg/transcode.js");
 $import("action/cmnt_counter.js");
 $import("common/BF.js");

 $registJob("comment", function(){
     function clearCommentPanel(){
	 $E("CP_list").innerHTML = "";
	 $E("CP_pagingPanel").innerHTML = "";
     }
     
     function insertMessage(message){
	 var t = document.createElement("div");
	 var nk_name = Core.String.encodeHTML(message.m_content).replace(/^(.*)0xfe0816?(.*)$/g, "$1").replace("##网友", "新浪网友").replace(/\&nbsp\;/g, '');
	 if(nk_name.replace(/(^\s*|\s*$)/g, '') == "&nbsp;" 
	    || nk_name.replace(/(^\s*|\s*$)/g, '').length < 1){
	     nk_name = message.m_user.replace(/(^\s*|\s*$)/g, '').length > 0 ? message.m_user.replace(/(^\s*|\s*$)/g, '') : "";
	 }

	 if(message.m_user.replace(/(^\s*|\s*$)/g, "") == 0){
	     t.innerHTML = ('<li class="SG_j_linedot1" id="comment_{7}">'+
			    '<table class="SG_revert_Left"><tbody><tr><td>'+
			    '<img src="http://portrait{4}.sinaimg.cn/{3}/blog/50" class="CP_avt_a" alt="{9}" title="{9}" />'
			    +'</td></tr></tbody></table>' +
			    '<div class="SG_revert_Cont"><p><span class="SG_revert_Tit">{9}：</span><span class="SG_revert_Time"><em class="SG_txtc">{5}'+
			    '</em><a class="CP_a_fuc" href="javascript:void(deleteComment(\'{8}\', \'{7}\'));">[<cite>删除</cite>]</a></span></p>'+
			    '<div class="SG_revert_Inner">{6}</div></div></li>').format(
				message.n_url,/*0 photo id */
				Math.floor(Math.random() * 16 + 1),/*1 static server NO. */
				message.n_title,/*2 photo title */
				0,/*3 user id*/
				1,/*4 portrait server NO. */
				message.m_datetime,/*5 comment publish date */
				Core.String.encodeHTML(message.m_content.replace(/\n/g,'{!br}')).replace(/{!br}/g,'<br/>').replace(/^(.*)0xfe0816?(.*)$/g, "$2"),/*6 comment content */
				message.m_id,/*7 comment id */
				message.m_newsid.replace(/(^\s*|\s*$)/g, ""),
				nk_name /*9 user nickname */
			    );
	 }else{
	     t.innerHTML = ('<li class="SG_j_linedot1" id="comment_{7}">'+
			    '<table class="SG_revert_Left"><tbody><tr><td>'+
			    '<a href="http://blog.sina.com.cn/u/{3}" target="_blank" class="CP_avt_a"><img src="http://portrait{4}.sinaimg.cn/{3}/blog/50" class="CP_brd" alt="{9}" title="{9}"/></a>'
			    +'</td></tr></tbody></table>'+
			    '<div class="SG_revert_Cont"><p><span class="SG_revert_Tit"><a href="http://blog.sina.com.cn/u/{3}" id="uic_{3}" target="_blank">{9}</a>：</span><span class="SG_revert_Time"><em class="SG_txtc">{5}'+
			    '</em><a class="CP_a_fuc" href="javascript:void(deleteComment(\'{8}\', \'{7}\'));">[<cite>删除</cite>]</a></span></p>'+
			    '<div class="SG_revert_Inner">{6}</div></div></li>').format(
				message.n_url,/*0 photo id */
				Math.floor(Math.random() * 16 + 1),/*1 static server NO. */
				message.n_title,/*2 photo title */
				message.m_user.replace(/(^\s*|\s*$)/g, ''),/*3 user id*/
				message.m_user.replace(/(^\s*|\s*$)/g, '') * 1 % 8 + 1,/*4 portrait server NO. */
				message.m_datetime,/*5 comment publish date */
				Core.String.encodeHTML(message.m_content.replace(/\n/g,'{!br}')).replace(/{!br}/g,'<br/>').replace(/^(.*)0xfe0816?(.*)$/g, "$2"),/*6 comment content */
				message.m_id,/*7 comment id */
				message.m_newsid.replace(/(^\s*|\s*$)/g, ""),
				nk_name /*9 user nickname */
			    );
	 }

	 $E("CP_list").appendChild(t.firstChild);

	 var dels = Core.Dom.getElementsByClass($E('CP_list'), "a", "CP_a_fuc");
	 if(scope.login && scope.myself){
	     for(var i = 0;i<dels.length;i++){
		 dels[i].style.display = '';
	     }
	 } else{
	     for(var i = 0;i<dels.length;i++){
		 dels[i].style.display = 'none';
	     }
	 }
	 
     }

     
     window.deleteComment = function(newsid, mid){
	 phpENTRY["delCmnt"].request({
	     GET : {
		 newsid : newsid,
		 mid : mid
	     },
	     onSuccess : function(res){
		 document.getElementById("comment_" + mid).style.display = "none";
		 var g_nlist = get_elements_by_tagname( "span", "cmnt_count" );
		 g_nlist[0].innerHTML = g_nlist[0].innerHTML.replace(/\((\d+)\)/,function(a,b){
		     return "("+(b*1-1)+")";
		 }) ;
		 
		 winDialog.alert("提交成功！ ",{
		     textOk :'确定',
		     icon : '03',
		     subText : '所选评论将被删除，如有延迟，请稍后查看。'
		 });
		 
		 
	     },
	     onError : function(res){
		 callErr(res.code);
	     }
	 });
	 
     };
     
     window.restoreCommentPanel = function(){
	 document.forms["form_pl"].reset();
	 if(!scope.login){
	     document.forms["form_pl"].password.value = '';
	     $E("beforeLogin").style.display = "";
	     $E("anony").style.display = "none";
	 }

	 getAuthCode("authimage");
     };

     
     var commentPanel = document.forms["form_pl"];
     commentPanel.action = "javascript:;";
     commentPanel.target = "_self";
     
     $E("authimage").onclick = function(){getAuthCode('authimage');}
     Utils.limitLength(commentPanel.cmsg_content,2000);
     Utils.limitLength(commentPanel.visitor_nick,16);
         
     window.postCommentPanel = function(){
	 var postData = {};
	 if(scope.login){
	     postData = {
		 pic_id: commentPanel.pic_id.value,
		 pic_title: commentPanel.pic_title.value,
		 cmsg_content:commentPanel.cmsg_content.value,
		 authcode:commentPanel.authcode.value
	     };
	 }
	 else{
	     postData = {
		 pic_id: commentPanel.pic_id.value,
		 pic_title: commentPanel.pic_title.value,
		 visitor_nick: commentPanel.visitor_nick.value,
		 anonymous: commentPanel.anonymous.checked,
		 cmsg_content:commentPanel.cmsg_content.value,
		 username:commentPanel.username.value,
		 password :commentPanel.password.value,
		 authcode:commentPanel.authcode.value
	     };
	 }

	 phpENTRY["sendCmnt"].request({
	     POST : postData,
	     onSuccess : function(res){
		 if($E('nodata') && $E('nodata').style.display != 'none'){
		     $E('nodata').style.display = 'none';
		 }
		 $E("CP_list").style.display = '';
		 if(typeof res != 'undefined' 
		    && typeof res.uid != 'undefined'){
		     scope.login = true;
		     scope.visitor = {uid : res.uid,
				      nk_name : res.nk_name};
		     $E("login_check").tabIndex = 2;
		     $tray.renderLogin();				
		 }
		 var cmnt_page = cmnt_page || 1;
		 var t = document.createElement("div");
		 if (scope.login){
		     var portaitPath = scope.visitor.uid.replace(/(^\s*|\s*$)/g, '')*1 % 8 + 1 ;
		     if($E("beforeLogin")){
			 $E("beforeLogin").style.display = "none";
			 $E("anonymous").parentNode.style.display = 'none';
		     }
		     if($E("afterLogin")){
			 $E("afterLogin").innerHTML = '<span id="cmntNick">'+scope.visitor.nk_name+':</span>';
			 $E("afterLogin").parentNode.style.display = "";
		     }
		     
		     t.innerHTML = '<li class="SG_j_linedot1">' +
			 '<table class="SG_revert_Left"><tbody><tr><td><img src="http://portrait' +
			 portaitPath+'.sinaimg.cn/' +scope.visitor.uid.replace(/(^\s*|\s*$)/g, "") +
			 '/blog/50" class="CP_brd" alt="'+scope.visitor.nk_name+'" title="'
                         +scope.visitor.nk_name+'" /></td></tr></tbody></table>' +
			 '<div class="SG_revert_Cont"><p><span class="SG_revert_Tit">'+
			 '<a target="_blank" href="http://blog.sina.com.cn/u/' +
			 scope.visitor.uid +'" id="uic_' +scope.visitor.uid.replace(/(^\s*|\s*$)/g, "") +'"> ' +
			 scope.visitor.nk_name +
			 '</a></span>' +
			 '<span class="SG_revert_Time"><em class="SG_txtc">'+getTimestamp("yyyy-MM-dd hh:mm:ss")+' </em></span></p>'+
			 '<div class="SG_revert_Inner">' +
			 Core.String.encodeHTML(postData.cmsg_content.replace(/\n/g,'{!br}')).replace(/{!br}/g,'<br/>') +
			 '</div></div></li>';
		 }					
		 else {
		     if (commentPanel.anonymous.checked){
			 var username;
			 if(Core.String.trim(commentPanel.visitor_nick.value).length<1){
			     username = '新浪网友';
			 }else{
			     username = Core.String.encodeHTML(commentPanel.visitor_nick.value);
			 }
		     }else{
			 username = commentPanel.username.value;
		     }
		     t.innerHTML = '<li class="SG_j_linedot1">' +
			 '<table class="SG_revert_Left"><tbody><tr><td>'+
			 '<img src="http://portrait1.sinaimg.cn/0/blog/50" class="CP_brd" alt="" />'+
			 '</td></tr></tbody></table>' +			
			 '<div class="SG_revert_Cont"><p><span class="SG_revert_Tit">'+
			 '<strong>' +username +'</strong></span><span class="SG_revert_Time"><em class="SG_txtc">'+
			 getTimestamp("yyyy-MM-dd hh:mm:ss")+'</em></span></p>' +
			 '<div class="SG_revert_Inner">' +
			 Core.String.encodeHTML(postData.cmsg_content.replace(/\n/g,'{!br}')).replace(/{!br}/g,'<br/>') +
			 '</div></div></li>';
		 }
		 $E("CP_list").insertBefore(t.firstChild,$E("CP_list").firstChild);
		 var g_nlist =  get_elements_by_tagname( "span", "cmnt_count");
		 g_nlist[0].innerHTML = g_nlist[0][$IE ? "innerText" : "textContent"].replace(/(\d+)/,function(a,b){
		     
		     return (b*1+1);
		 });
		 
		 restoreCommentPanel();
	     },
	     onError : function(res){
	     	if(res.code == "P00005" || res.code == "P00004"){
				winDialog.alert($SYSMSG[res.code],{
				funcOk : function(){
				$E("login_check").value = "";
				$E("login_check").focus();
				}
				});
	     	}else{
				callErr(res.code);
	     	}
			getAuthCode("authimage");
	     }
	 });
	 return false;
     };
     if(!scope.login){

	 Core.Events.addEvent("anonymous",function(){
	     var firstUl = $E('beforeLogin');
	     var seconedUl = $E('anony');
	     if(commentPanel.anonymous.checked){
		 firstUl.style.display = 'none' ;
		 seconedUl.style.display = '';
		 commentPanel["visitor_nick"].tabIndex = 2;
		 $E("login_check").tabIndex = 3;
	     } else{
		 firstUl.style.display = '' ;
		 seconedUl.style.display = 'none';
		 commentPanel["username"].tabIndex = 2;
		 commentPanel["password"].tabIndex = 3;
		 $E("login_check").tabIndex = 4;
	     }
	 },'click',false);

     }
     
     window.jumpPage = function(pindex){
	 cmnt_page = pindex;
	 cmnt_reload(cmnt_channel, cmnt_newsid, cmnt_group);
     };
     window.cmnt_print = function(){
	 clearCommentPanel();
	 if($E('cmt_loading').style.display != 'none'){
	     $E('cmt_loading').style.display = 'none';
	 }
	 if(CmsgList.length<1){
	     cmnt_notfound();
	     return;
	 }
	 $E("CP_list").style.display = '';
//	 $E('CP_list').style.display = 'none';
	  $E("cmt_loading").style.display = 'none'
	 $E("nodata").style.display = 'none';
	 for(var i = 0, l = CmsgList.length; i < l; i ++){
	     insertMessage(CmsgList[i]);
	 }

	 if(Count.c_pages < 2){
	     $E("CP_pagingPanel").style.display = "none";
	 } else {
	     $E("CP_pagingPanel").style.display = '';
	     Ui.Pagination.init({
		 "nodeClassNamePrefix" :"SG",
		 "pageNode" : "CP_pagingPanel",
		 "curPage" : cmnt_page,		
		 "maxPage" : Count.c_pages,
		 "pageTpl" : function(pageNum){jumpPage(pageNum);},
		 "type"    : 1
	     }).show();		

	 }
	 
     };
     window.cmnt_notfound = function(){

	 clearCommentPanel();
	 if(typeof MSGS_PERPAGE == 'undefined'){
	     window.MSGS_PERPAGE = 0;
	 }
	
	 $E("cmt_loading").style.display = 'none'
	 $E("nodata").style.display = 'block';
	 $E("CP_list").style.display = 'none';
	 $E("CP_pagingPanel").style.display = 'none';
     };

     window.initStatus = function(){
	 $E("nodata").style.display = 'none';
	 $E("CP_list").style.display = 'none';
	 $E("CP_pagingPanel").style.display = 'none';

     };

     if($IE){
	 var ieDataLand = document.createElement("script");
	 ieDataLand.setAttribute("charset", "gbk");
	 ieDataLand.id = "COMMENT_DATAISLAND_FORIE";
	 ieDataLand.setAttribute("type", "text/javascript");
	 document.body.appendChild(ieDataLand);
     }
     function loadCmthelper2(){
	 var cmthelper2 = document.createElement("script");
	 cmthelper2.setAttribute("type", "text/javascript");
	 cmthelper2.setAttribute("charset", "gbk");

	 cmthelper2.src = "http://comment.photo.sina.com.cn/comment/cmnt_embed.js";
	 if($IE){
	     cmthelper2.onreadystatechange = function(){
		 if(/^(loaded|complete)$/i.test(cmthelper2.readyState)){
		     cmnt_reload(cmnt_channel, cmnt_newsid, cmnt_group);
		 }
	     };
	 }else{
	     cmthelper2.onload = function(){
		 cmnt_reload(cmnt_channel, cmnt_newsid, cmnt_group);
	     };
	 }  //此程序会在刘丽的接口中调用
	 document.body.appendChild(cmthelper2);
     }   
     var cmthelper1 = document.createElement("script");
     cmthelper1.setAttribute("type", "text/javascript");
     cmthelper1.setAttribute("charset", "gbk");

     cmthelper1.src = "http://comment.photo.sina.com.cn/comment/cmnt_xml.js";
     if($IE){
	 cmthelper1.onreadystatechange = function(){
	     if(/^(loaded|complete)$/i.test(cmthelper1.readyState)){
		 loadCmthelper2();
		 window.g_nlist = get_elements_by_tagname("span", "cmnt_count" );
		 if ( ON && g_nlist.length>0 ) {
		     load_countAAA();
		 }
	     }
	 };
     }else{
	 cmthelper1.onload = function(){
	     loadCmthelper2();
	     window.g_nlist =  get_elements_by_tagname("span", "cmnt_count" );
	     if ( ON && g_nlist.length>0 ) {
		 load_countAAA();
	     }
	 };

     }
     //setTimeout(cmnt_notfound,50);
     initStatus();
     document.body.appendChild(cmthelper1);

 });