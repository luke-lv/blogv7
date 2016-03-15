/**
 * @fileoverview 页面设置用户自定义风格
 * @author xinyu@staff.sina.com.cn
 * @date 2008-08-08
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getStyle.js");
$import("pageSet/tabs.js");
$import("pageSet/setColor.js");
$import("pageSet/singleFunc/funcUploadPic.js");
$import("pageSet/singleFunc/funcGetImgStaticPath.js");
$import("pageSet/singleFunc/funcCustomStyle.js");


var customStyleSettingTabs = Core.Class.create();
customStyleSettingTabs.prototype = {

    /**
     * 初始化自定义风格的入口
     * @param {Object} obj
     */
    initialize: function(obj){
        var _this = this;
        var tabs = new Tabs2(obj, {});
        var tempobj = {
            "1": "配色方案",
            "2": "修改大背景图",
            "3": "修改导航图",
            "4": "修改头图"
        };
        for (var k in tempobj) {
            var op = {
                className: "cur",
                onabort: Core.Function.bind3(_this.hiddenTag, _this, [k]),
                onfocus: Core.Function.bind3(_this.showTag, _this, [k])
            };
            if (k == "1") {
                op.isFocus = true;
                this.initItems(k);
            }
            var title = '<a href="javascript:;" onclick="return false;">' + tempobj[k] + '</a>';
            this[k + "_tab"] = new Tab2(title, op);
            tabs.add(this[k + "_tab"]);
        }
		
		
		
		
		
		
		//----------------------------- 设置背景图是否为fixed状态 -------------------------------
		//by Random | YangHao@staff.sina.com.cn
		
		
		var sinablogb=$E("sinablogb");
//		__pageSetVar.originalBackgroundAttachment=Core.Dom.getStyle(document.body,"backgroundAttachment");
//		sinablogb.className=__pageSetVar.originalBackgroundAttachment=="fixed"?"":sinablogb.className;
//		
		//设置背景图不随滚动条滚动
		window.setBgFixed=function(){
			sinablogb.className = "";
			sinablogb.style.backgroundImage = "";
			document.body.style.backgroundImage = __pageSetVar.uploadedBgImage;
			document.body.style.backgroundAttachment = "fixed";
		};
//		
		//设置背景图随滚动条滚动
		window.setBgScroll=function(){
			$E("cbFixedBG") && ($E("cbFixedBG").checked=false);
			sinablogb.className="sinablogb";
			sinablogb.style.backgroundImage=__pageSetVar.originalBgImage;
			document.body.style.backgroundImage="";
			document.body.style.backgroundAttachment="scroll";
		};

		window.updateFixedBgStyle=function(){
			var st=document.body.style;
//				rpt=$E("repeat_2"),
//				hrt=$E("horizontal_2"),
//				vtc=$E("vertical_2");
//				
//			if(rpt && hrt && vtc){
//				st.backgroundPosition=hrt.value+" "+vtc.value;
//				st.backgroundRepeat=rpt.value;
//			}
			
			st.backgroundPosition=__pageSetVar["customPic_2"]["align-h"]+" "+__pageSetVar["customPic_2"]["align-v"];
			st.backgroundRepeat=__pageSetVar["customPic_2"]["repeat"];
		};
		
		__pageSetVar.isBgFixed=scope.$isBgFixed;
		__pageSetVar.originalBgImage=Core.Dom.getStyle(sinablogb,"backgroundImage");
		__pageSetVar.uploadedBgImage=Core.Dom.getStyle(sinablogb,"backgroundImage");
		
		window.pageSetUploadPic.onUploadFinished=function(){
			__pageSetVar.uploadedBgImage=sinablogb.style.backgroundImage;
			__pageSetVar.originalBgImage=sinablogb.style.backgroundImage;
//			window.setBgScroll();
		};
		
		//------------------------------------------------------------------------
		
    },
    /**
     * 初始化
     * @param {Object} id
     */
    initItems: function(id){
		
		var me=this;
        var _this = this;
        var items = $E('customstylesetting_' + id + '_tab');
        if (!items) {
            if (id == "1") {//选择配色方案的tab
                var div = $C('div');
                div.id = 'customstylesetting_' + id + '_tab';
                div.className = "stylePosition";
                
                var div2 = $C('div');
                div2.id = 'customstylesetting_' + id + '_tab_nouse';
                div2.className = "customBg";
                div2.style.display = 'none';
                div2.innerHTML = '抱歉，您当前使用的模板暂时不支持自定义样式。请更换风格再进行自定义设置。';
                
                $E('customStyleSetting').insertBefore(div, $E('customTips'));
                $E('customStyleSetting').insertBefore(div2, $E('customTips'));
                for (var k in scope.colorSort) {
                    var tempdiv = $C('div');
                    tempdiv.className = "colorClassSel";
                    tempdiv.innerHTML = '<div class="CCShead"><div class="CCSheadtxt">' + scope.colorSort[k].name.split("").join("<br />") + '</div></div>' +
                    '<div class="CCSContants"><ul id="colorSort_' +
                    k +
                    '"></ul></div>';
                    div.appendChild(tempdiv);
                    
                    for (var i = 0; i < scope.colorSort[k].data.length; i++) {
                        var li = $C('li');
                        li.id = 'color|' + scope.colorSort[k].data[i];
                        if (__pageSetVar.selectedTpl == scope.colorSort[k].data[i]) {
                            li.className = "selected";
                        }
                        li.innerHTML = '<div class="frame"><a href="#" title="' + scope.colorSort[k].data[i] + '"><img src="http://simg.sinajs.cn/blog7style/images/common/topsetting/' + scope.colorSort[k].base + '/' + scope.colorSort[k].pic[i] + '.jpg" class="thumb" /></a><img class="selectedIco SG_icon SG_icon106" width="18" height="18" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"  /></div>';
                        $E('colorSort_' + k).appendChild(li);
                        Core.Events.addEvent(li, Core.Function.bind3(_this.colorEvent, _this, [li, scope.colorSort[k].data[i]]), 'click');
                    }
                }
            }
            else {//各个图的tab
                var _this = this;
                var div = $C('div');
                div.id = 'customstylesetting_' + id + '_tab';
                div.className = "customBg";
                $E('customStyleSetting').insertBefore(div, $E('customTips'));
                var div2 = $C('div');
                div2.id = 'customstylesetting_' + id + '_tab_nouse';
                div2.className = "customBg";
                div2.style.display = 'none';
                div2.innerHTML = '抱歉，您当前使用的模板暂时不支持自定义样式。请更换风格再进行自定义设置。';
                $E('customStyleSetting').insertBefore(div2, $E('customTips'));
                
                if (__pageSetVar.selectedTpl && __pageSetVar.selectedTpl.split('_')[0] == '13') {
                    div.style.display = 'none';
                    div2.style.display = '';
                }
                
                //默认的灰色的图片，用来显示没有上传任何图片时的那个图
                var imgpreview = "http://simg.sinajs.cn/blog7style/images/common/topsetting/bgreview2.jpg";
                
                //若有图，则替换那个灰色的图片
                if (__pageSetVar["customPic_" + id].pid != "no") {
                    //trace("pic=" + __pageSetVar["customPic_" + id].pid);
                    imgpreview = getImgStaticPath(__pageSetVar["customPic_" + id].pid, 'small');
                }
                
                var str = '<div class="imgReview" style="position:relative;">';
                str += '<div class="frame" id="imgReview_' + id + '" style="cursor:pointer;"><div class="customImgBor"><img  src="' + imgpreview + '" id="customimgpreview_' + id + '"/></div><img width="18" height="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="selectedIco SG_icon SG_icon106"/></div>';
                
				if(!$_GLOBAL.noPicUpload) {
					//关闭上传修改图片等注释下句。。。。2010-12-13
					str += '<p id="uploadbtn_' + id + '" style="display:none;"><a href="javascript:;" onclick="return false;" class="CP_a_fuc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<cite id="reUpload_' + id + '">上传图片</cite>]</a></p>';
					//关闭上传修改图片等注释下句。。。。2010-12-13
					str += '<div id="uploadflash_' + id + '" style="position:absolute;top:110px;width:170px;opacity:0;filter:alpha(opacity=0);"></div>';
				}
				
				str += '<p id="backbtn_' + id + '" style="display:none;"><a href="javascript:;" onclick="return false;" class="CP_a_fuc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<cite id="backedit_' + id + '">返回编辑状态</cite>]</a></p>';
				str += '</div>';
                str += '<div class="customContants">';
                str += '<div class="mutiUploadBar" id="uploaderror_' + id + '" style="display:none;"><p ><img class="uploadErr" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"/><span class="uloaderrt" id="errortips_' + id + '">图片上传失败</span></p></div>';
                str += '<div class="mutiUploadBar" id="uploading_' + id + '" style="display:none;"><p>图片上传中</p><div class="mutiUpload"><div class="SG_floatL"><div class="uploaddegb"><div style="width: 45%;" class="uploaddegs" id="uploadingprogress_' + id + '" ></div></div><span class="SG_floatL deg" id="uploadingtext_' + id + '">45%</span></div><span class="SG_floatL"><a style="margin-right: 10px;" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="upLoadCancel_' + id + '">取消</cite></a></span></div></div>';
                if (id == "2") {
                    str += '<div class="mutiUploadBar" id="uploadfinish_' + id + '" style="display:none;"><div class="param"><p>图片显示：<select id="repeat_' + id + '"><option value="no-repeat">不平铺</option><option value="repeat">平铺</option><option value="repeat-x">横向</option><option value="repeat-y">纵向</option></select>  左右对齐：<select id="horizontal_' + id + '"><option value="left">居左</option><option value="center">居中</option><option value="right">居右</option></select>  上下对齐：<select id="vertical_' + id + '"><option value="top">居顶</option><option value="center">居中</option><option value="bottom">居底</option></select></p><p>设定页面底色：<img id="custom_bg_color" align="absmiddle" style="background-color: ' + __pageSetVar.selectedBgColor + ';" class="colorPicker" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"/>'+
							'<input style="margin-left:20px;" id="cbFixedBG" type="checkbox"/><label for="cbFixedBG">锁定背景图(保存后可见效果)</label></p></div></div>';
                }
				else if (id == "4") {
                    str += '<div class="mutiUploadBar" id="uploadfinish_' + id + '" style="display:none;"><div class="param"><p>图片显示：<select id="repeat_' + id + '"><option value="no-repeat">不平铺</option><option value="repeat">平铺</option><option value="repeat-x">横向</option><option value="repeat-y">纵向</option></select>  左右对齐：<select id="horizontal_' + id + '"><option value="left">居左</option><option value="center">居中</option><option value="right">居右</option></select>  上下对齐：<select id="vertical_' + id + '"><option value="top">居顶</option><option value="center">居中</option><option value="bottom">居底</option></select></p><p>头部高度：<input id="headAltitude" type="text" style="width: 67px;" maxLength=3 class="inpbase"/></p></div></div>';
                    //'<input type="checkbox" id="headAltitudeCheck" checked value="0"/><label for="headAltitudeCheck">不使用头图</label>'
				}
				else {
					str += '<div class="mutiUploadBar" id="uploadfinish_' + id + '" style="display:none;"><div class="param"><p>图片显示：<select id="repeat_' + id + '"><option value="no-repeat">不平铺</option><option value="repeat">平铺</option><option value="repeat-x">横向</option><option value="repeat-y">纵向</option></select>  左右对齐：<select id="horizontal_' + id + '"><option value="left">居左</option><option value="center">居中</option><option value="right">居右</option></select>  上下对齐：<select id="vertical_' + id + '"><option value="top">居顶</option><option value="center">居中</option><option value="bottom">居底</option></select></p></div></div>';
				}
				switch (id) {
					case '2':
					str += '<div style="padding:0 0 8px 0; color:#333"><input type="checkbox" value="1" id="useNothing_' + id + '" name="" style="margin-left:0;"/><label for="useNothing_' + id + '">不使用大背景图。</label></div>';
					break;
					case '3':
					str += '<div style="padding:0 0 8px 0; color:#333"><input type="checkbox" value="1" id="useNothing_' + id + '" name="" style="margin-left:0;"/><label for="useNothing_' + id + '">不使用导航图。</label></div>';
					break;
					case '4':
					str += '<div style="padding:0 0 8px 0; color:#333"><input type="checkbox" value="1" id="useNothing_' + id + '" name="" style="margin-left:0;"/><label for="useNothing_' + id + '">不使用头图。</label></div>';
				}
                str += '<div class="customContantsTips" id="customContantsTips_' + id + '">支持大小不超过500k的jpg、gif、png图片上传</div>';
                str += '</div><div class="clearit"></div>';
                
                str += '<div class="useDeafaultImg" id="useDefaultDiv_' + id + '"><input type="checkbox" name="" id="useDefaultImg_' + id + '" value="1"><label for="useDefaultImg_' + id + '">使用模板默认图。</label>&nbsp;(您可以自己上传图片，支持大小不超过500k的jpg、gif、png图片上传)</div>';
                div.innerHTML = str;

				//如果用户上传了图片，不管使用与否，都显示的上传完成页面
                __pageSetVar.funcshowFinish(id);
                //如果图片未使用，则所有选择不可用-------------------------------
                if (__pageSetVar["customPic_" + id].apply == "0") {
                    __pageSetVar.funcNoUsePic(id);
                }
                else if (__pageSetVar["customPic_" + id].apply == "1"){
                    __pageSetVar.funcSetUsePic(id);
                }else {
                	__pageSetVar.funcUseNothing(id);
                }
                //------------------------------------------------------------
				 
                __pageSetVar["customPic_" + id].triger = false;//用户是否点击上传选择文件按钮的标志 BLOGBUG-5238 
                pageSetUploadPic.upload(id);
                
                if (id == "2") {//大背景图那里有多余的选择,给那些绑定事件
                    $E('custom_bg_color').style.backgroundColor = scope.backgroundcolor;
                    Core.Events.addEvent($E('custom_bg_color'), this.bgColorEvent, 'click');
                }
                
				if (id == '4') {
                    //限制头图高度输入框只能输入数字------------------------
                Utils.limitLength($E('headAltitude'), 3);
                Utils.limitReg($E('headAltitude'), /[^\d]/gi);
                
                Core.Events.addEvent($E('headAltitude'), function(){
                    if (Core.String.trim($E('headAltitude').value) == "" || $E('headAltitude').value < 150) {
                        $E('headAltitude').value = 150;
                    }
                    else 
                        if ($E('headAltitude').value > 450) {
                            $E('headAltitude').value = 450;
                        }
						
                    $E('sinablogHead').style.height = $E('headAltitude').value + 'px';
                    $E('headarea').style.height = $E('headAltitude').value + 'px';
					
                    if ((parseInt(Core.Dom.getStyle($E('blogTitle'), "top")) + $E('blogTitle').offsetHeight) > $E('headAltitude').value) {
                        $E('blogTitle').style.top = ($E('headAltitude').value - $E('blogTitle').offsetHeight) + 'px';
                    }
					
					//改变头部高度时 重置blogTitle,blognav top值
					var titleHeight = ($E('headAltitude').value - $E('blogTitle').offsetHeight - $E('blognav').offsetHeight) / 2;
					$E('blogTitle').style.top = titleHeight + 'px';
					$E('blognav').style.top = titleHeight + $E('blogTitle').offsetHeight + 10 + 'px';
				
                }, 'blur');
                
                $E('headAltitude').value = $E('sinablogHead').offsetHeight;
                //------------------------------------------------------
/*
                if (__pageSetVar["customPic_4"].apply == "1") 
                    $E('headAltitudeCheck').checked = false;
                
                Core.Events.addEvent($E('headAltitudeCheck'), function(){
                    if ($E('headAltitudeCheck').checked == true) {
                        this.usePic("4");
                        __pageSetVar["customPic_4"].apply = "0";
                    }
                    else {
                        //将不使用头图checkbox上的对号点掉，意思就是使用头图，如果用户原来有头图，只是没有使用，则执行以下操作----------
                        if (__pageSetVar["customPic_4"].pid != 'no') {
                            this.usePic("4");
                            __pageSetVar["customPic_4"].apply = "1";
                        }
                        //------------------------------------------------------------------------
                    }
                }
.bind2(this), 'click');		
*/		    
				}	
				
                
                //返回编辑按钮事件
                Core.Events.addEvent($E('backedit_' + id), function(){
                    //trace("返回编辑状态");
                    __pageSetVar.funcshowFinish(id);
                  
                        this.cancelUpload(id);

                }
.bind2(this), 'click');
                
                //上传中取消事件
                Core.Events.addEvent($E('upLoadCancel_' + id), function(){
                    //trace("上传中取消");
                    __pageSetVar.funcshowFinish(id);
					 this.cancelUpload(id);

                }
.bind2(this), 'click');
                
                //select内选中预定内容-----------------------------------------------------------
                for (var i = 0; i < $E('repeat_' + id).options.length; i++) {
                    var op = $E('repeat_' + id).options[i];
                    if (op.value == __pageSetVar["customPic_" + id]["repeat"]) {
                        //trace(op.value + ";" + __pageSetVar["customPic_" + id].repeat)
                        op.selected = true;
                        break;
                    }
                }
                for (var i = 0; i < $E('horizontal_' + id).options.length; i++) {
                    var op = $E('horizontal_' + id).options[i];
                    if (op.value == __pageSetVar["customPic_" + id]["align-h"]) {
                        op.selected = true;
                        break;
                    }
                }
                
                for (var i = 0; i < $E('vertical_' + id).options.length; i++) {
                    var op = $E('vertical_' + id).options[i];
                    if (op.value == __pageSetVar["customPic_" + id]["align-v"]) {
                        op.selected = true;
                        break;
                    }
                }
                //---------------------------------------------------------------------------
                
                Core.Events.addEvent($E('useDefaultImg_' + id), Core.Function.bind3(_this.usePic, _this, [id, 0]), 'click');
                Core.Events.addEvent($E('imgReview_' + id), Core.Function.bind3(_this.usePic, _this, [id, 1]), 'click');
                Core.Events.addEvent($E('useNothing_' + id), Core.Function.bind3(_this.usePic, _this, [id, 2]), 'click');
                
                //各个select内容变化的事件-----------------------------------------------------------------
                Core.Events.addEvent($E('repeat_' + id), Core.Function.bind3(_this.selectEvent, _this, [id, "bgrepeat", $E('repeat_' + id)]), 'change');
                Core.Events.addEvent($E('horizontal_' + id), Core.Function.bind3(_this.selectEvent, _this, [id, "horizontal", $E('horizontal_' + id)]), 'change');
                Core.Events.addEvent($E('vertical_' + id), Core.Function.bind3(_this.selectEvent, _this, [id, "vertical", $E('vertical_' + id)]), 'change');
                //---------------------------------------------------------------------------------------
				
				
				
				
				//------------------设置背景图是否为fixed状态-------------------------
				//by Random | YangHao@staff.sina.com.cn
				
				
				
				var cbFixedBG=$E("cbFixedBG"),
					sinablogb=$E("sinablogb");
				
				cbFixedBG && (cbFixedBG.checked=!!__pageSetVar.isBgFixed);
//				cbFixedBG.checked=__pageSetVar.originalBackgroundAttachment=="fixed";
//				if (cbFixedBG.checked) {
//					window.setBgFixed();
//					window.updateFixedBgStyle();
//				}
//				
				Core.Events.addEvent(cbFixedBG,function(){
					__pageSetVar.isBgFixed=cbFixedBG.checked?"1":"0";
				});
				
				//-------------------------------------------------------------
				
				
            }
            
        }
    },
    /**
     * 取消上传的函数
     * @param {Object} id
     */
    cancelUpload: function(id){
        __pageSetVar["customPic_" + id].cancel = true;
        __pageSetVar["customPic_" + id].triger = false;
        //trace('id=' + id + ";flag=" + __pageSetVar["customPic_" + id].cancel);
        $E('uploaderror_' + id).style.display = "none";
        $E('uploading_' + id).style.display = 'none';
        
        __pageSetVar.funcshowFinish(id);
        
        //flash父窗口宽度以及自己宽度
		
		if(!$_GLOBAL.noPicUpload) {
			//关闭上传修改图片等注释下句。。。。2010-12-13
			$E('uploadflash_' + id).style.width= "170px";
		}
		
		
		$E('upload_' + id).width = "170";
		pageSetUploadPic.progressflag=false;
		
        $E('backbtn_' + id).style.display = "none";
        $E('uploadingprogress_' + id).style.width = "0%";
        $E('uploadingtext_' + id).innerHTML = "0%";
        if (id == "4") {
            $E('customContantsTips_' + id).style.display = "";
            $E('customContantsTips_' + id).innerHTML = "头部高度在150像素至450像素之间";
        }
    },
    /**
     * 点击色系后的事件
     * @param {Object} li
     * @param {Object} id
     */
    colorEvent: function(li, id){
        if (id == __pageSetVar.selectedTpl) {
            this.setSelect(__pageSetVar.selectedTpl, 'selected');
            return;
        }
        
        __pageSetVar.tempid = id;
        if (Core.Array.findit(scope.overdue_theme_cnf, __pageSetVar.selectedTpl) > -1) {
            winDialog.confirm("你目前使用的商业模板已经过期，如果更换将无法恢复。是否更换？", {
                funcOk: function(){
                    this.changeBg();
                }.bind2(this)
            });
        }
        else {
            this.changeBg();
        }
        
        
    },
    changeBg: function(){
        if (__pageSetVar.selectedTpl != "") {
            if (__pageSetVar.selectedTpl.split('_')[0] == '13') {
                $E('headflash').innerHTML = '';
            }
            this.setSelect(__pageSetVar.selectedTpl, '');
        }
        
        __pageSetVar.selectedTpl = __pageSetVar.tempid;
        __pageSetVar.tempid = null;
        this.setSelect(__pageSetVar.selectedTpl, 'selected');
        dwThemeCss(__pageSetVar.selectedTpl, 'color');
        //博客标题位置使用默认
        $E('blogTitle').style.cssText = '';
		$E('blognav').style.cssText='';
        if ($IE6) {
            if (__pageSetVar["customPic_3"].apply == "1" || scope.ie6filter.indexOf(__pageSetVar.selectedTpl) < 0) {
                $E('blognavBg').style.filter = "none";
            }
            else {
                $E('blognavBg').style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='http://simg.sinajs.cn/blog7newtpl/image/" + __pageSetVar.selectedTpl.split('_')[0] + "/" + __pageSetVar.selectedTpl + "/images/blognavbg.png')";
            }
        }
    },
    /**
     * 根据传入的id以及样式名，修改对应的模板、色系的选择样式
     * @param {Object} id
     * @param {Object} classname
     */
    setSelect: function(id, classname){
        if ($E('color|' + id)) 
            $E('color|' + id).className = classname;
        if ($E('theme|0|' + id)) {
            $E('theme|0|' + id).className = classname;
        }
        if ($E('theme|' + id)) {
            $E('theme|' + id).className = classname;
        }
    },
    /**
     * 选择背景平铺、对齐方式
     * @param {Object} id 大背景图或导航图或头图
     * @param {Object} type2 背景图平铺、左右对齐方式、上下对齐方式
     */
    selectEvent: function(id, type2, obj){
        var value = obj[obj.selectedIndex].value;
        var oarr = ['', '', $E('sinablogb'), $E('blognavBg'), $E('sinablogHead')];
        if (type2 == "bgrepeat") {
            __pageSetVar["customPic_" + id]["repeat"] = value;
            oarr[id].style.backgroundRepeat = value;
        }
        else 
            if (type2 == "horizontal") {
                __pageSetVar["customPic_" + id]["align-h"] = value;
                oarr[id].style.backgroundPosition = value + " " + __pageSetVar["customPic_" + id]["align-v"];
            }
            else {
                __pageSetVar["customPic_" + id]["align-v"] = value;
                oarr[id].style.backgroundPosition = value + " " + __pageSetVar["customPic_" + id]["align-h"];
            }
			
		window.updateFixedBgStyle();
    },
    /**
     * 点击图片后的事件
     * @param {Object} id
     */
    usePic: function(id, index){
//        if (__pageSetVar["customPic_" + id].pid == "no") {
//            return;
//        }
        //trace('__pageSetVar["customPic_" + id].apply=' + __pageSetVar["customPic_" + id].apply);
		if (index == __pageSetVar.now) {
			switch (index) {
				case 0:
					if (__pageSetVar["customPic_" + id].pid == "no") {
						index = 2;
					}
					else {
						index = 1;
					}
					break;
				case 1:
					index = 0;
					break;
				case 2:
					if (__pageSetVar["customPic_" + id].pid == "no") {
						index = 0;
					}
					else {
						index = 1;
					}
			}
		}
		switch (index) {
			case 0:
				window.setBgScroll();
				__pageSetVar.funcNoUsePic(id);
				//不使用自定义头部图片 恢复blogTitle,blognav top位置
				$E('blogTitle').style.top ="";
				$E('blognav').style.top = "";
				
				break;
			case 1:
				__pageSetVar.funcSetUsePic(id);
				__pageSetVar.uploadedBgImage=$E("sinablogb").style.backgroundImage;
				__pageSetVar.originalBgImage=$E("sinablogb").style.backgroundImage;
				break;
			case 2:
				window.setBgScroll();
				__pageSetVar.funcUseNothing(id);
				//不使用自定义头部图片 恢复blogTitle,blognav top位置
				$E('blogTitle').style.top ="";
				$E('blognav').style.top = "";
		}
		__pageSetVar["customPic_" + id].apply = index + '';
        __pageSetVar.funcshowFinish(id);
    },
    /**
     * 切换
     * @param {String} id 模板分类号
     */
    hiddenTag: function(id){
        var items = $E('customstylesetting_' + id + '_tab');
        var items2 = $E('customstylesetting_' + id + '_tab_nouse');
        if (items) {
            items.style.display = "none";
        }
        if (items2) {
            items2.style.display = 'none';
        }
        if (id != "1") {
            //BLOGBUG-5238 
            if ($E('upLoadCancel_' + id) && $E('uploading_' + id).style.display == '') {
                this.cancelUpload(id);
            }
            __pageSetVar["customPic_" + id].triger = false;
            $E('customTips').style.display = "none";
        }
    },
    /**
     * 切换
     * @param {String} id
     */
    showTag: function(id){
        var items = $E('customstylesetting_' + id + '_tab');
        if (!items) {
            this.initItems(id);
            items = $E('customstylesetting_' + id + '_tab');
        }else{
			if(id!=1&&($360||$TT||$Maxthon)){
				pageSetUploadPic.upload(id);
			}
		}
        if (__pageSetVar.selectedTpl.split('_')[0] == '13' || $_GLOBAL.flashtemplate[__pageSetVar.selectedTpl] || __pageSetVar.selectedTpl.split('_')[0] == '10' || Core.Array.findit(scope.cannot_users, __pageSetVar.selectedTpl) > -1) {
            items2 = $E('customstylesetting_' + id + '_tab_nouse');
            items.style.display = "none";
            items2.style.display = "block";
            if ($E('customTips')) {
                $E('customTips').style.display = "none";
            }
        }
        else {
            items2 = $E('customstylesetting_' + id + '_tab_nouse');
            items.style.display = "block";
            items2.style.display = "none";
            if (id != 1) {
                __pageSetVar["customPic_" + id].triger = false;
				__pageSetVar.funcshowFinish(id);
				this.cancelUpload(id);

				$E('customTips').style.display = "block";
                if ($E('customRightPic')) {
                    $E('customRightPic').src = "http://simg.sinajs.cn/blog7style/images/common/topsetting/custom" + id + ".jpg";
                }

                if ($E('customimgpreview_' + id)) {
                    if (__pageSetVar["customPic_" + id].pid == "no") {
                        $E('customimgpreview_' + id).src = "http://simg.sinajs.cn/blog7style/images/common/topsetting/bgreview" + id + ".jpg";
                    }else {
						$E('customimgpreview_' + id).title = '点击使用此图';
					}
                }
				
            }
        }
        
        this.bColor(id);
    },
    /**
     * 切换页签时背景闪动的效果
     * @param {Object} id
     */
    bColor: function(id){
        var testdiv = $E('testdiv');
        if (!testdiv) {
            testdiv = $C('div');
            testdiv.id = 'testdiv';
            testdiv.style.display = "none";
            testdiv.style.cssText = "position:absolute;width:0px;height:0px;z-index:9;top:400px;left:300px;background-Color:white;";
            document.body.appendChild(testdiv);
        }
        window.bcinv = setInterval(function(){}, 10000);
        var bccount = 1;
        switch (id) {
            case "1":
                clearInterval(window.bcinv);
                $E('testdiv').style.display = "none";
                break;
            case "2":
                clearInterval(window.bcinv);
                $E('testdiv').style.cssText = "position:absolute;z-index:101;";
                $E('testdiv').style.left = Core.Dom.getLeft($E('sinablogb')) + "px";
                $E('testdiv').style.top = Core.Dom.getTop($E('sinablogb')) + "px";
                $E('testdiv').style.width = ($E('sinablogb').offsetWidth - 6) + "px";
                $E('testdiv').style.height = ($E('sinablogb').offsetHeight - 6) + "px";
                bccount = 1;
                window.bcinv = setInterval(function(){
                    if (bccount % 2 == 0) {
                        $E('testdiv').style.border = "3px dashed red";
                    }
                    else {
                        $E('testdiv').style.border = "3px dashed white";
                    }
                    bccount++;
                    if (bccount > 7) {
                        clearInterval(window.bcinv);
                        $E('testdiv').style.display = "none";
                    }
                    setTimeout(function(){
                        $E('testdiv').style.border = "";
                    }, 150);
                }, 300);
                break;
            case "3":
                clearInterval(window.bcinv);
                $E('testdiv').style.cssText = "position:absolute;z-index:101;";
                $E('testdiv').style.left = Core.Dom.getLeft($E('blognav')) + "px";
                $E('testdiv').style.top = Core.Dom.getTop($E('blognav')) + "px";
                $E('testdiv').style.width = ($E('blognav').offsetWidth - 6) + "px";
                $E('testdiv').style.height = ($E('blognav').offsetHeight - 6) + "px";
                
                bccount = 1;
                window.bcinv = setInterval(function(){
                    if (bccount % 2 == 0) {
                        $E('testdiv').style.border = "3px dashed red";
                    }
                    else {
                        $E('testdiv').style.border = "3px dashed white";
                    }
                    bccount++;
                    if (bccount > 7) {
                        clearInterval(window.bcinv);
                        $E('testdiv').style.display = "none";
                    }
                    setTimeout(function(){
                        $E('testdiv').style.border = "";
                    }, 150);
                }, 300);
                break;
            case "4":
                clearInterval(bcinv);
                $E('testdiv').style.cssText = "position:absolute;z-index:101;";
                $E('testdiv').style.width = ($E('sinablogHead').offsetWidth - 6) + "px";
                $E('testdiv').style.height = ($E('sinablogHead').offsetHeight - 6) + "px";
                $E('testdiv').style.left = Core.Dom.getLeft($E('sinablogHead')) + "px";
                $E('testdiv').style.top = Core.Dom.getTop($E('sinablogHead')) + "px";
                bccount = 1;
                window.bcinv = setInterval(function(){
                    if (bccount % 2 == 0) {
                        $E('testdiv').style.border = "3px dashed red";
                    }
                    else {
                        $E('testdiv').style.border = "3px dashed white";
                    }
                    bccount++;
                    if (bccount > 7) {
                        clearInterval(window.bcinv);
                        $E('testdiv').style.display = "none";
                    }
                    setTimeout(function(){
                        $E('testdiv').style.border = "";
                    }, 150);
                }, 300);
                break;
            default:
				clearInterval(bcinv);
                break;
        }
    },
    showTabs: function(id){
        this[id + "_tab"].setFocus();
    },
    /**
     * 选择背景色的事件
     */
    bgColorEvent: function(){
        if (__pageSetVar["customPic_2"].apply == "0") {
            return;
        }
        if (!__pageSetVar.setBgColor) {
            __pageSetVar.setBgColor = {};
            __pageSetVar.setBgColor = new SetColor2($E('custom_bg_color'), '<div id="#{entity}" class="colorItemContent"><div id="#{content}" class="colorItemTitle">颜色选取</div></div>', '__pageSetVar.setBgColor.setBackgroundColor');
            __pageSetVar.setBgColor.show();
        }
        else {
            __pageSetVar.setBgColor.show();
        }
    }
};

