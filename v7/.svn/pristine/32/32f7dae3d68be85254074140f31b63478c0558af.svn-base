/**
 * @author darkty2009
 */
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/system/br.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/utils/limitLength.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/showError.js");
//$import("lib/insertSmiles/insertSmileFormInit.js");
$import("tempLib/insertSmiles/insertSmileFormInit.js");
$import("tempLib/magicFace/magicFace.js");
$import("jobs/resource.js");
$import("msg/blogComment.js");
$import("other/SinaEx.js");


//获取值
function getFrameValue(FrameNode){
    var d = $E(FrameNode).contentWindow.document;
    //如果返回结果中有textarea标签则返回其值 
    //add by xs @ 080219
    var tArea = Core.Dom.getElementsByClass(d, 'textarea', '')[0];
    var text = '';
    if (tArea) {
        text = Core.String.trim(tArea.value);
    }
    else {
        var body = d.body;
        text = body.innerHTML;
    }
    return text;
    
}

//执行回调(并防止空回调)
function tagFunc(FrameNode, oFunc){
    try {
        var htmlStr = getFrameValue(FrameNode);
        if (htmlStr != null) {
            if (oFunc) {
                oFunc(htmlStr);
            }
        }
    } 
    catch (e) {
    }
}

//创建iframe
var cIFM = function(sFrameName){
    if ($E(sFrameName)){
		Core.Dom.removeNode($E(sFrameName));
	} 
    Core.Dom.addHTML(document.body, "<iframe name='" + sFrameName + "' id='" + sFrameName + "' class='hidden'></iframe>");
};

$registJob("commlist", function() {
	
	var all = Core.Dom.getElementsByClass(document, "div", "chbox");
	var chooses = document.getElementsByName("ids[]");
	
	if(!chooses.length)return;
	
	for(var i=0;i<all.length;i++) {
		all[i].firstChild.checked = false;
	}
	
	all[0].onclick = function() {
		for(var i=1;i<all.length;i++) {
			all[i].firstChild.checked = this.firstChild.checked;
		}
	};
	/**
	all[all.length-1].onclick = function() {
		for(var i=0;i<all.length-1;i++) {
			all[i].firstChild.checked = this.firstChild.checked;
		}
	};
	**/
	var chooLen = chooses.length;
	
	function checkAll(dom) {
		trace("check");
		
		if(!dom.checked) {
			all[0].firstChild.checked = false;
			//all[all.length-1].firstChild.checked = false;
		}else {
			var flag = true;
			for(var i=0;i<chooLen;i++) {
				if(!chooses[i].checked) {
					flag = false;
					break;
				}
			}
			
			all[0].firstChild.checked = flag;
			//all[all.length-1].firstChild.checked = flag;
		}
	}
	
	for(var j=0;j<chooLen;j++) {
		chooses[j].onclick = function() {
			checkAll(this);
		};
		chooses[j].checked=chooses[0].checked;
	}
	
	window.deleteAll = function(type) {
		var check = false;
		
		var chooses2 = document.getElementsByName("ids[]");
		
		for(var i=0;i<chooses2.length;i++) {
			if(chooses2[i].checked == true) {
				check = true;
				break;
			}
		}
		
	    if (!check) {
	        showError($RESOURCE.choose_comment);
	        return false;
	    }

	    winDialog.confirm($RESOURCE.delete_allcomment, 
		{
			textOk:'删除',
	        funcOk: function() {
				//if (!$E('BatchPostFrame')) {
	            	cIFM("BatchPostFrame");
		            var postFrame = $E('BatchPostFrame');
		            Core.Events.addEvent(postFrame, Core.Function.bind3(tagFunc, this, [postFrame, function(response){
		                var req = eval('(' + response + ')');
		                if (req.code == 'A00006') {
		                    location.reload();
		                }
		                else {
		                    showError(req.code, "02");
		                }
		            }
					]), "load");
		            $E("deleteComment").target = 'BatchPostFrame';
			        $E("deleteComment").flag = true;
			        $E("deleteComment").submit();
		        //}
		    }
		});
	    return false;;
	};
	if($E("deleteAll")){
		$E("deleteAll").onclick = window.deleteAll;
	}
	
	window.commentReply = function(dom, url) {
		
		var wrapper = dom.parentNode.parentNode;
		var sibiling = SinaEx.next(wrapper); 
		var comContent = sibiling.innerHTML;
		if(sibiling.getAttribute("isQing") === "1"){
			var div = SinaEx.createNode("<div>"+comContent+"</div>");
			var lastDiv = SinaEx.findNode(div,"previousSibling","lastChild");
			div.removeChild(lastDiv);
			var con = div.innerHTML;
			var tagQingDiv = SinaEx.firstChild(sibiling);
			var tagQingA = SinaEx.firstChild(tagQingDiv);
			var tagQingImg = SinaEx.firstChild(tagQingA);
		}
		url = "http://control.blog.sina.com.cn" + url;
	    var id = "reply_";
	    url.replace(/comment_id=(\d*)/, function(a, b){
	        id += b;
	    });
		
		if (Core.Dom.getElementsByClass(dom.parentNode.parentNode.parentNode, 'div', 'SG_revert_Answer').length != 0){
			return;
		}   
	    var form = $C("dd");
		form.id = "comm_"+id;
		form.className = "cBox_re";
		var html='';
	    html += '<div class="SG_revert_Answer">';
        html += '<div class="SG_revert_Answer_Top" style="width:490px;"><span class="SG_floatL">回复：</span><span class="faceblk SG_floatR"><div id="reply_smile_'+id+'" class="faceline1"></div></span></div>';
        html += '<div class="SG_revert_Answer_right">';
        html += '<textarea style="display:none;" id="'+id+'" class="SG_textarea"></textarea>';
		html += '<iframe id="frame_'+id+'" frameBorder="0" style="height: 74px; background-color: #FFFFFF; border: 1px solid #C7C7C7; width: 488px;*width: 486px;" src="http://blog.sina.com.cn/main_v5/ria/blank.html" id="replayIframe"></iframe>';
        html += '<div class="SG_revert_Btn"><div class="SG_revert_Btn_left"><span><a href="#" onclick="return false;" class="SG_aBtn SG_aBtnB"><cite id="reply_btn'+id+'">回复</cite></a></span><span><a id="reply_cancel'+id+'" href="#" onclick="return false;" class="SG_aBtn SG_aBtnB"><cite>取消</cite></a></span>'
				+ '</div>\
					<span style="width:150px;font-size:9pt;" class="SG_txtb SG_floatR">还可以输入<span id="txt_'+id+'_1">1000</span>个汉字</span>\
					<span style="display:none;width:150px;font-size:9pt;" class="SG_txtb SG_floatR">已超过<b id="txt_'+id+'_2" style="color:red;font-weight:bolder;">0</b>个汉字</span>\
				</div>';
        html += '</div>';
        html += '</div>';
	    
	    form.innerHTML = html;
		
		dom.parentNode.parentNode.parentNode.appendChild(form);
        //提示还可以输入几个字
		var inputTips = function(){
            var s = $E(id+"").value;
            var maxLength = 2000;
            if (Core.String.byteLength(s) > maxLength) {
                $E("txt_"+id).innerHTML = "0";
            }
            else {
                $E("txt_"+id).innerHTML = Math.floor((maxLength - Core.String.byteLength(s)) / 2);
            }
        };
		var arrPix = [($IE ? -321 : -319), 38 + ($IE ? -1 : 3)];
		//App.formInsertSmile(id+"", "reply_smile_" + id, null, inputTips, "reply_smile_" + id, arrPix);
		var events = {
			'interval' : {
				'after' : function(frameId, area) {
					scope.commEditor.handleChange(frameId);
					var maxLength = 2000;
					var str = area.value.replace(/[\n\r]/g,'');
					var len = 1000;
					if(str != '\n' && str != '\u000D\u000A') {
						len = Math.floor((maxLength - Core.String.byteLength(str)) / 2);;
					}
					if(len >= 0) {
						$E('txt_'+id+'_1').innerHTML = len;
						$E('txt_'+id+'_2').parentNode.style.display = 'none';
						$E('txt_'+id+'_1').parentNode.style.display = '';
					} else {
						$E('txt_'+id+'_2').innerHTML = (-1)*len;
						$E('txt_'+id+'_2').parentNode.style.display = '';
						$E('txt_'+id+'_1').parentNode.style.display = 'none';
					}
				}
			}
		}
		App.formInsertSmile2(id+"", "reply_smile_" + id, null, null, "reply_smile_" + id, arrPix,'frame_'+id,events);
		
		/*
		//做字数限制
        if ($IE) {
			Core.Events.addEvent($E(id+""),function(){
				var nValue = $E(id+"").value;
                var strLen = Core.String.byteLength(nValue);
                if (strLen > 2000) {
                    $E(id+"").value = Core.String.leftB(nValue, 2000);
                }
			},'blur');
        } else {
            Utils.limitLength($E(id+""), 2000);
        }
		*/

        //Core.Events.addEvent($E(id+""), inputTips, 'keyup');
		//Core.Events.addEvent($E("" + id), inputTips, 'propertychange');
        //Core.Events.addEvent($E("" + id), inputTips, 'input');
		if(tagQingImg && tagQingImg.className === "SG_icon SG_icon205"){
			Core.Events.addEvent($E("reply_btn"+id), function() {
				var value = $E(id+"").value;
				value = Core.String.trim(value);
				new Interface(url, "ijax").request({
					POST:{
						reply_content:value,
						from_commentContent:con
					},
					onSuccess:function(res) {
						location.reload();
					},
					onError:function(res) {					
							if(url.indexOf('is_photo=1')!=-1)
							{
								$SYSMSG[res.code] = $SYSMSG[res.code].replace('博文','图片');
							}
							if(url.indexOf('is_photo=0')!=-1)
							{
								$SYSMSG[res.code] = $SYSMSG[res.code].replace('图片','博文');
							}
						showError($SYSMSG[res.code]);
					}
				});
			});	
		}else{
			Core.Events.addEvent($E("reply_btn"+id), function() {
				var value = $E(id+"").value;
				value = Core.String.trim(value);
				
				new Interface(url, "ijax").request({
					POST:{
						reply_content:value
					},
					onSuccess:function(res) {
						location.reload();
					},
					onError:function(res) {					
							if(url.indexOf('is_photo=1')!=-1)
							{
								$SYSMSG[res.code] = $SYSMSG[res.code].replace('博文','图片');
							}
							if(url.indexOf('is_photo=0')!=-1)
							{
								$SYSMSG[res.code] = $SYSMSG[res.code].replace('图片','博文');
							}
						showError($SYSMSG[res.code]);
					}
				});
			});	
		}		
		
		
		Core.Events.addEvent($E("reply_cancel"+id), function() {
			try{
				Core.Dom.removeNode($E("comm_"+id));
			}catch(e){}
		});	
		
		
	};
	
	window.commentDelete = function(el,url,friendUID) {
		//来自qing的评论删除的时候不能加入黑名单
		if(el.parentNode){
			var dtWrapper = el.parentNode.parentNode;
		}
		if(dtWrapper){
			var ddWrap =  SinaEx.next(dtWrapper);
			if(dtWrapper.getAttribute("fromQing") === "1"){
				var QingFlag = 1;
			}
		}
		if(ddWrap){
			var nextDdWrap = SinaEx.next(ddWrap);
		}
		//此处做判断原因是区别评论内容的删除和评论回复的删除
		if(ddWrap){
			if(ddWrap.getAttribute("id")){
				var divWrap =  SinaEx.firstChild(ddWrap);
				if(divWrap){
					var aWrap = SinaEx.firstChild(divWrap);
					if(aWrap){
						var imgWrap = SinaEx.firstChild(aWrap);
					}	
				}		
			}
		}
		var styleState="";
		if(scope.$uid==friendUID||friendUID==0){
			styleState=' style="display:none" ';
		}				
		url = "http://control.blog.sina.com.cn" + url;
		if(imgWrap){
			if(imgWrap.className === "SG_icon SG_icon205"){
				var delflag = 1;
			}
		}

		if(!!delflag || (!nextDdWrap && !!QingFlag) ){
			winDialog.confirm($RESOURCE.delete_comment, {
				textOk:'删除',
				subText:'',
				funcOk:function() {
					new Interface(url, "ijax").request({
						GET: {
//							inblack:$E("cbAddToBlock").checked?"1":"0",
							friend_uid:friendUID || "",
							blogerid:scope.$uid || ""
						},
						onSuccess:function(res) {
							location.reload();
						},
						onError:function(res) {
							if(url.indexOf('is_photo=1')!=-1)
							{
								$SYSMSG[res.code] = $SYSMSG[res.code].replace('博文','图片');
							}
							if(url.indexOf('is_photo=0')!=-1)
							{
								$SYSMSG[res.code] = $SYSMSG[res.code].replace('图片','博文');
							}
							showError($SYSMSG[res.code]);
						}
					});
				}
			});
		}else{
			winDialog.confirm($RESOURCE.delete_comment, {
				textOk:'删除',
				subText:'<div '+styleState+'><input id="cbAddToBlock" type="checkbox"/><label for="cbAddToBlock">将此人加入黑名单</label></div>',
				funcOk:function() {
					new Interface(url, "ijax").request({
						GET: {
							inblack:$E("cbAddToBlock").checked?"1":"0",
							blogerid: scope.$uid || "",
							friend_uid:friendUID || ""
						},
						onSuccess:function(res) {
							location.reload();
						},
						onError:function(res) {
							if(url.indexOf('is_photo=1')!=-1)
							{
								$SYSMSG[res.code] = $SYSMSG[res.code].replace('博文','图片');
							}
							if(url.indexOf('is_photo=0')!=-1)
							{
								$SYSMSG[res.code] = $SYSMSG[res.code].replace('图片','博文');
							}
							showError($SYSMSG[res.code]);
						}
					});
				}
			});
		}
		
	};
});
