$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/array/ArrayWithout.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/string/j2o.js");
$import("sina/ui/template.js");
$import("lib/interface.js");
$import("sina/ui/pagination.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/json.js");

/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 淘博会发商品
 * @author Qiangyee | wangqiang1@staff
 * @modified xiaoyue3 20140116  淘博会发商品下线
 */
// Editor.Plugins.ReleaseWares = Core.Class.create();
// Editor.Plugins.ReleaseWares.prototype = {

//     /**
//      * 状态 operate(编辑操作状态)||view(预览状态)
//      */
//     state : "",
//     /**
//      * 商品信息
//      */
//     _wareInfo : null,
    
//     initialize: function(containerId, status){
//         this.containerId = containerId;
//         this.initHtml();
//         this.waresTpl = new Ui.Template(this.waresTplHtml);
//         this.initInterface();
//         this.initEvent();
//         this.addToTag("购喜欢", !1);
        
//     },
//     /**
//      * 建立读取文章数据的interface
//      */
//     initInterface: function(){
//         var url = "http://control.blog.sina.com.cn/riaapi/taobohui/get_item_info.php";
//         this.waresInfoInterface = new Interface(url, "ajax");
//     },
//     initEvent : function(){
//         var _this = this;
//         var addEvent = Core.Events.addEvent;
//         addEvent($E("add-wares"), function(){
//             var link = $E("wares-link");
//             var url  = link.value;
//             $E("wares-link-error").style.display = "none";
//             if (_this.checkUrl(url)) {
//                 _this.waitStart();
//                 _this.loadWares(url, function(data){
//                     _this.processData(data);
//                 });
//             } else {
//                 _this.showError('wares-link-error', '<span class="red">链接无法辨识，请确认输入有效的商品链接</span>');
//             }
//         },"click");

//         addEvent($E("tbh_item_type01").parentNode, function(e){
//             var el = e.target || e.srcElement;
//             var nodeName = el.nodeName.toUpperCase();
//             var typeNum = el.getAttribute("value");
//             var tagName = ["服装","配饰","杂货","孕婴"];
//             if (_this._currentTagName) {
//                 _this.removeTag(_this._currentTagName, !0);
//             }
            
//             if (typeNum) {
//                 var _currentTagName = tagName[parseInt(typeNum, 10) - 1];
//                 _this.addToTag(_currentTagName, !1);
//                 _this._currentTagName = _currentTagName;
//             } else {
//                 _this._currentTagName = "";
//             }
//         });
//     },
//     /**
//      * 添加标签
//      */
//     addToTag : function(tagName, deleteAble){
//         var tagInput = scope._tagsMng;
//         if (tagInput) {
//             tagInput.addTag(tagName, {deleteAble : deleteAble});
//         }
//     },
//     /**
//      * 删除标签
//      * @param {String}  tagName 标签名称
//      * @param {Boolean} deleteAble  删除的标签是否为可删除标签
//      */
//     removeTag : function(tagName, deleteAble){
//         var tagInput = scope._tagsMng;
//         if (tagInput) {
//             tagInput.removeTag(tagName, deleteAble);
//         }
//     },
//     /**
//      * 显示等待框
//      */
//     waitStart : function(){
//         $E("tbh_item_loading").style.display = "";
//         $E("wares-pic-tao").style.display = "none";
//     },
//     /**
//      * 隐藏等待框
//      */
//     waitEnd : function(){
//         $E("tbh_item_loading").style.display = "none";
//     },
//     /**
//      * 校验URL合法性
//      *
//      */
//     checkUrl : function(url){
//         var reg = /^(?:http:\/\/)*(?:[^\/])+\.(?:taobao|tmall)\.com\/([\S]+)/i;
//         if (reg.test(url)) {
//             return true;
//         } else {
//             return false;
//         }
//     },
//     // 显示错误信息
//     showError : function(id, msg){
//         $E(id).innerHTML = msg;
//         $E(id).style.display = "";

//     },
//     /**
//      * 读取商品信息并回调
//      */
//     loadWares : function(href, cb){
//         Lib.Listener.notify("editor-ware-before-load",{url:href});
//         var _this = this;
//         this.waresInfoInterface.request({
//             POST: {
//                 href : href
//             },
//             returnType : "json",
//             onSuccess: function(data){
// 				if (data) {
//                     _this._wareInfo = data;
//                     cb(data);
//                 } else {
//                     _this._wareInfo = null;
//                     _this.waitEnd();
//                     _this.showError('wares-link-error', '<span class="red">链接无法辨识，请确认输入有效的商品链接</span>');
//                 }
//                 Lib.Listener.notify("editor-ware-loaded",{url:href});
// 			}.bind2(this),
//             onError: function(_data){
//                 _this.waitEnd();
//                 _this._wareInfo = null;
//                 Lib.Listener.notify("editor-ware-loaded",{url:href});
//                 if (_data) {
//                     _this.showError('wares-link-error', '<span class="red">链接无法辨识，请确认输入有效的商品链接</span>');
//                 }
//             },
//             onFail: function(){
//                 _this.showError('wares-link-error', '<span class="red">链接无法辨识，请确认输入有效的商品链接</span>');
//                 _this.waitEnd();
//                 _this._wareInfo = null;
//                 Lib.Listener.notify("editor-ware-loaded",{url:href});
//             }
//         });
//     },
//     /**
//      * 处理商品数据信息，显示预览图片与商品信息
//      * @param {JSON} data 商品数据信息
//      */
//     processData : function(data){
//         //var reg = /^http:\/\/([^\.]+)\.(taobao|tmall)\.com\S+/i;
//         //data.from = data.click_item_url.replace(reg,"$2");
//         data.fromClass = this.wareTypeClass[data.from || "taobao"];
//         var _this = this;
//         _this._setWarePic(data["pic_url"], function(size){
//             _this.waitEnd();
//             var html = _this.waresTpl.evaluate(data);
//             var panel = $E("wares-pic-tao");
//             panel.innerHTML = html;
//             panel.style.display = "";
//             var type = data["item_type"];
//             if (!isNaN(type)) {
//                 var typeEls = $N("tbh_item_type");
//                 var el;
//                 for (var i = 0, len = typeEls.length; i < len; i++) {
//                     el = typeEls[i];
//                     if (el.value == type) {
//                         el.checked = !0;
//                         break;
//                     }
//                 }
//             }
//             // ie真的是无语了，这个tag标签浮层不移动
//             var tagListEl = $E("articleTagList");
//             if (tagListEl) {
//                 tagListEl.parentNode.style.position = "relative";
//                 setTimeout(function(){
//                     tagListEl.parentNode.style.position = "";
//                 }, 10);
//             }
//             // setTimeout兼容ie
            
//             var picEl = $E("tbh_pic_url_show");
//             if ($IE) {
//                 picEl.parentNode.style.position = "relative";
//                 picEl.style.position = "absolute";
//                 var left = (148 - size.width)/2;
//                 var top  = (148 - size.height)/2;
//                 picEl.width = size.width;
//                 picEl.height = size.height;
//                 picEl.style.top  = top;
//                 picEl.style.left = left;
//             }
//             picEl.src = data["pic_url"];
//             data = null;
//         });
//     },
    
//     // 设置预览图片
//     // @param {String}   src 预览商品图片链接
//     // @param {Function} cb  图片尺寸加载完成后的回调函数
//     _setWarePic : function(src, cb){
//         var itemUrlEl = $E("wares-link"); 
//         var img = new Image();
//         itemUrlEl.setAttribute("curl", encodeURIComponent(src));
//         // 获取缩放后的图片尺寸
//         var getSize = function(image, mw, mh){
//             var iw = image.width;
//             var ih = image.height;
//             var width  = iw;
//             var height = ih;
//             if (iw > mw || ih > mh) {
//                 var rate = iw / ih;
//                 if (rate > 1) {
//                     height = (mw / iw) * ih;
//                     width  = mw;
//                 } else {
//                     width = (mh / ih) * iw;
//                     height  = mw;
//                 }
//             }
//             return {
//                 width  : width,
//                 height : height
//             }
//         }

//         img.src = src;
        
//         if (img.complete) {
//             var size = getSize(img, 148, 148);
//             cb(size);
//             img = null;
//         } else {
//             var timer = setInterval(function(){
//                 if (!img.width || !img.height) {
//                     return;
//                 }
//                 clearInterval(timer);
//                 var currentSrc = itemUrlEl.getAttribute("curl");
//                 var imgSrc = encodeURIComponent(img.src);
//                 if (currentSrc != imgSrc) {
//                     return;
//                 }
//                 var size = getSize(img, 148, 148);
//                 cb(size);
//                 img = null;
//             }, 15);
//         }
//     },
//     /**
//      * 编辑时设置商品信息
//      * @param {JSON} data 商品信息数据
//      */
//     showOldData : function(data){
//         /*
//         data =  {
//             "item_id": 1902538057,   //商品唯一ID
//             "item_url": "http://item.taobao.com/item.htm?id=4947813209", //用户输入的url
//             "click_item_url": "http://item.taobao.com/item.htm?id=4947813209",//淘宝客url
//             "title": "商品标题最多60字",
//             "desc": "商品描述",
//             "item_location":"广东 广州",
//             "nick_name": "卖家昵称",
//             "pic_url": "http://tp2.sinaimg.cn/1902538057/50/22817372040/1",
//             "price": "5.00",
//             "from": "taobao"
//         };
//         */
//         this._wareInfo = data;
//         $E("wares-link").value = data["click_item_url"];
//         this.processData(data);
//     },
//     /**
//      * 删除商品
//      */
//     del : function(){
//         winDialog.confirm("是否要删除商品？", {
//             funcOk: function(){
//                 this._wareInfo = null;
//             }.bind2(this),
//             funcCancel: function(){
//                 editorTabs.showTab("releaseWares");
//             },
//             funcClose : function(){
//                 editorTabs.showTab("releaseWares");
//             },
//             textOk: "是",
//             textCancel: "否",
//             defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
//             title: "提示",
//             icon: "04" // 可选值："01"、"02"、"03"、"04"、"05"
//         }, "releaseWarsTip");
//     },
//     /**
//      * 获取商品信息
//      */
//     getInfo : function(){
//         // 如果没有_wareInfo证明用户已删除商品
//         if (!this._wareInfo) {
//             return null;
//         }
//         var typeEls = $N("tbh_item_type");
//         var el, type = "";
//         for (var i = 0, len = typeEls.length; i < len; i++) {
//             el = typeEls[i];
//             if (el.checked) {
//                 type = el.value;
//             }
//         }
//         this._wareInfo["item_type"] = type;
//         return this._wareInfo;
//     },

//     /**
//      * 初始化html
//      */
//     initHtml: function(){
//         var html = ['<div class="state1">',
//                           '<div class="voteBox1 fairBox">',
//                             '<table border="0" cellspacing="0" cellpadding="0">',
//                               '<tbody>',
//                               '<tr>',
//                                 '<th><span>商品链接：</span></th>',
//                                 '<td>',
//                                   '<ul class="ul1">',
//                                     '<li>', //当文本框不可编辑时，style增加背景色e7e7e7
//                                       '<input id="wares-link" type="text" class="Fm_input2" style="width:365px; color:#999;" value="" placeholder="http://"/>',
//                                       '<a id="add-wares" class="SG_aBtn SG_aBtnB" href="javascript:;"><cite>添加</cite></a>',
//                                       '<a class="SG_aBtn SG_aBtnB" style="display:none;" href="javascript:;"><cite>取消</cite></a><span class="gary">目前支持网站仅限：淘宝、天猫</span></li>',
//                                     '<li id="wares-link-error" style="display:none;"></li>',
// 									'<li id="wares-pic-tao" class="pic_tao" style="display:none;"></li>',
//                                     '<li id="tbh_item_loading" style="display:none;">',
//                                         '<div class="nodate SG_txtb">',
// 			                                '<div class="loading"><img title="加载中" src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"/>&nbsp;商品信息加载中...</div>',
// 			                            '</div>',
//                                      '</li>',
//                                 '</ul></td>',
//                               '</tr>',
//                               '<tr>',
//                                 '<th><span>商品类型：</span></th>',
//                                 '<td>',
// 								'<div class="fairlist">',
// 								  '<input type="radio" value="1" id="tbh_item_type01" name="tbh_item_type">',
// 								  '<label value="1" for="tbh_item_type01">服装</label>',

// 								  '<input type="radio" value="2" id="tbh_item_type02" name="tbh_item_type">',
// 								  '<label value="2" for="tbh_item_type02">配饰</label>',

// 								  '<input type="radio" value="3" id="tbh_item_type03" name="tbh_item_type">',
// 								  '<label value="3" for="tbh_item_type03">杂货</label>',

// 								  '<input type="radio" value="4" id="tbh_item_type04" name="tbh_item_type">',
// 								  '<label value="4" for="tbh_item_type04">孕婴</label>',
// 								  '</div>',
// 								'</td>',
//                               '</tr>',
//                               '</tbody>',
//                             '</table>',
//                           '</div>',
//                           '<div class="clearit"></div>',
//                   '</div>'];
//         var str = html.join("");

//         Core.Dom.addHTML($E(this.containerId), str);
//     },
//     // 商品来源
//     wareTypeClass : {
//         "taobao" : "SG_icon149",
//         "tmall" : "SG_icon151"
//     },
//     // 商品预览html模板
//     waresTplHtml : ['<div class="picbox"><div style="width:148px;height:148px;display:table-cell;vertical-align:middle;text-align:center;"><img id="tbh_pic_url_show" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" title="图片" align="absmiddle" class="img_pic" /></div></div>',
//         '<div class="fairtext">',
//                 '<p><span>来自:</span><img width="20" height="20" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon #{fromClass}">#{title}</p>',
//                 '<p><span>价格:</span>￥#{price}</p>',
//             '</div>'].join("")
// };

