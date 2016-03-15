/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 页面样式的修正
 * @author xy xinyu@staff.sina.com.cn
 * @author fuqiang3 fuqiang3@staff.sina.com.cn
 */
$import('sina/utils/flash/swfObject.js');
$import('sina/core/events/addEvent.js');
$registJob("stylefix", function () {
  //针对ie6下用户定义了自定义导航图后，有的模板的滤镜效果没有清除进行处理
  if($IE6&&scope.UserPic&&scope.UserPic[1]&&scope.UserPic[1].apply=="1"){
    $E('blognavBg').style.filter = "none";
  }
  //fuqiang3 没有安装flash的用户提示无法查看视频和收听音乐
  var body = $E('sina_keyword_ad_area2');
  if(body){
    var embeds = body.getElementsByTagName('embed');
    var objects = body.getElementsByTagName('object');
    if(embeds || objects){
      //检查flash
      if(deconcept.SWFObjectUtil.getPlayerVersion().major === 0){
        var htmlmsg = '我们的产品需要安装flashplayer 10或更高版本，请 <a href="http://get.adobe.com/flashplayer">点击此处</a> 免费下载';
        var msg = '我们的产品需要安装flashplayer 10或更高版本，请前往 http://get.adobe.com/flashplayer 免费下载';
        if(winDialog){
          winDialog.alert(htmlmsg); 
        }else{
          alert(msg); 
        }
      }
    }
  }

  var style = document.createElement('style'); 
  style.type = 'text/css'; 
  style.id = 'stylefix';
  var css = "#bsPanelHolder,#sinaads_pdps54771{display:none;}";
  try {
      style.appendChild(document.createTextNode(css));
  } catch (ex) {
      style.styleSheet.cssText=css; 
  }
  document.getElementsByTagName('head')[0].appendChild(style);
});

