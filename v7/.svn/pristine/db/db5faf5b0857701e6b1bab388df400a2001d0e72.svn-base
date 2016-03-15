/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 插入股票
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/function/bind3.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/addHTML.js");
$import("sina/ui/renderer/simpleRenderer.js");
$import("lib/ticket.js");

Editor.Plugins.InsertStock = Core.Class.create();
Editor.Plugins.InsertStock.prototype = {
    initialize: function(containerId){
        //trace("InsertStock:initialize");
        this.id = Core.Math.getUniqueId();
		this.f_isReady=true;
        this.initDialog();
        this.initData();
        Core.Events.addEvent($E("stock_save_" + this.id), this.uploadImage.bind2(this));
        this.initUploadFlash();
    },
    initData: function(){
        var url = "http://www.sinaimg.cn/cj/financewidget/js/SuggestServer_3_0_17.js";
        //var url="http://sjs.sinajs.cn/blog7/editor/SuggestServer_3_0_17_encode.js";
        Utils.Io.JsLoad.request(url, {
            onComplete: function(){
                //trace("InsertStock.initData.onComplete");
                this.initSuggest();
                Core.Events.addEvent($E("stock_search_" + this.id), function(){
                    //trace("stock_search_");
					
                    $E("stock_submit_" + this.id).click();
                }.bind2(this), "click");
            }.bind2(this),
            onException: function(){
            },
            charset: "gb2312"
            ,isRemove : false
        });
    },
    initDialog: function(){
        var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span/></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
        this.dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "插入股票走势",
            content: this.initHtml(),
			renderer:Ui.SimpleRenderer,
            width: 500
        }, "tips");
		this.dialog
			.setAreaLocked(true)
			.show()
			.addEventListener("beforeShow",function(){
				 this.setMiddle();
			});
    },
    setTip: function(type){
        var ele = $E("stock_tip_" + this.id);
        switch (type) {
            case "error":
                ele.innerHTML = '<span class="SG_clewtxta">没找到符合结果的股票，请确认其在沪深A股中</span>';
                break;
            case "init":
                ele.innerHTML = '<span class="SG_txtc">轻松两步，日K、周k与分时尽呈现。目前支持沪深A股股票。</span>';
                break;
        }
    },
    initSuggest: function(){
        this.suggestServer = new SuggestServer();
        this.suggestServer.bind({
            // 除"input"必须设置外 其他均为可选
            "input": "inputSuggest", //*(必选) 指定suggest绑定的对象 [string|HTMLElement.input]
            //~  "loader": "suggest_loader", // 可指定js读取用的公共容器 [string|HTMLElement]
            //~  "default": "拼音/代码/名称", // 可指定input默认值 [string] 默认空
            "value": "@2@", // 填充内容，使用@n@标识各项 {0: 无染色选项, 1: 类型代码详见type, 2: 代码, 3: 全称, 4: 中文名称, 5:拼音} [string] 默认规则请详见代码内部
            "type": "11", // 类型 [string] 例如"stock"、"23"、"11,12"
            /*
             type值详解
             为空时即全选
             "stock": "11,12,13,14,15"
             "fund": "21,22,23,24,25,26"
             "hkstock": "31"
             "hk": "31,32"
             "usstock": "41"
             "us": "41,42"
             [
             "11": "A 股", "12": "B 股", "13": "权证", "14": "期货", "15": "债券",
             "21": "开基", "22": "ETF", "23": "LOF", "24": "货基", "25": "QDII", "26": "封基",
             "31": "港股", "32": "窝轮",
             "41": "美股", "42": "外期"
             ]
             */
            "max": 8, // 备选项个数，<=10 [number] 默认 10
            "width": 267, // 指定宽度 [number] 默认220
            //"link": "http://biz.finance.sina.com.cn/suggest/lookup_n.php?country=@type@&q=@2@", // 备选项点击的url 不设置则不可点击 [string]
            "head": ["选项", "代码", "中文名称"], // 表头 为null时无表头 [object.array|null] 默认["选项", "代码", "名称"]
            "body": [-1, 2, 4], // 表格内容列 {-1: 选项, -2: 类型, 0: 无染色选项, 1: 类型代码详见type, 2: 代码, 3: 全称, 4: 中文名称, 5:拼音} [object.array|null] 默认[-1, 2, 4]
            "callback": this.callback.bind2(this) // 选定提示行时的回调方法，回调该方法时传入当前input内value [function|null]
        });
    },
    fillCode: function(__objectResult){
        //trace("InsertStock.fillCode" + __objectResult);
        $E("divGetCodeResult").innerHTML = 'type:' + (typeof __objectResult) + '<br />' + (__objectResult == "" ? "[空串]" : __objectResult);
    },
    submitCallback: function(data){
        //trace("InsertStock.submitCallback" + data);
        if (data != "") {
            insertStock.parseData(data.split(";")[0]);
        }else{
			insertStock.setTopView();
			insertStock.setTip("error");
		}
        return false;
    },
    callback: function(param1){
        //trace("callback:" + param1);
        insertStock.suggestServer.getCode(param1, this.parseData.bind2(this));
    },
    parseData: function(data){
        var array = data.split(",");
        //trace("parseData:array:" + array);
        this.code = array[3];
        this.setStockImage();
        this.setNextView();
        if (!this.initEvent) {
            this.bindOperateEvent();
            this.initEvent = true;
        }
    },
    
    bindOperateEvent: function(){
        Core.Events.addEvent($E("stock_min_" + this.id), Core.Function.bind3(this.setStockImage, this, ["min"]));
        Core.Events.addEvent($E("stock_daily_" + this.id), Core.Function.bind3(this.setStockImage, this, ["daily"]));
        Core.Events.addEvent($E("stock_weekly_" + this.id), Core.Function.bind3(this.setStockImage, this, ["weekly"]));
        Core.Events.addEvent($E("stock_monthly_" + this.id), Core.Function.bind3(this.setStockImage, this, ["monthly"]));
        
    },
    setNextView: function(){
        this.setSize(500, 412);
        $E("stock_h4_" + this.id).style.display = "none";
        $E("stock_tip_" + this.id).style.display = "none";
        $E("stock_type_" + this.id).style.display = "block";
		$E("stock_image_a_" + this.id).parentNode.style.display = "block";
		this.swapButtonState();
        
    },
    setTopView: function(){
        this.setSize(500, 130);
        $E("stock_type_" + this.id).style.display = "none";
		$E("stock_image_a_" + this.id).parentNode.style.display = "none";
        $E("stock_h4_" + this.id).style.display = "block";
        $E("stock_tip_" + this.id).style.display = "block";
		this.swapButtonState(true);
    },
    setStockImage: function(type){
        var ele = $E("stock_image_a_" + this.id);
		var html;
        var type = type || "min";
        switch (type) {
            case "min":
				html="<img id='stock_image_"+this.id+"' src='http://image2.sinajs.cn/newchart/min/" + this.code + ".gif'/>";
                $E("stock_min_" + this.id).checked = true;
                break;
            case "daily":
				html="<img id='stock_image_"+this.id+"' src='http://image2.sinajs.cn/newchart/daily/" + this.code + ".gif'/>";
                break;
            case "weekly":
				html="<img id='stock_image_"+this.id+"' src='http://image2.sinajs.cn/newchart/weekly/" + this.code + ".gif'/>";
                break;
            case "monthly":
				html="<img id='stock_image_"+this.id+"' src='http://image2.sinajs.cn/newchart/monthly/" + this.code + ".gif'/>";
                break;
        }
		ele.innerHTML=html;
		ele.href="http://finance.sina.com.cn/realstock/company/" + this.code + "/nc.shtml";
        ele.parentNode.style.display = "block";
    },
    setSize: function(width, height){
        this.dialog.setSize(width, height);
    },
    show: function(){
		this.clearInput();
        this.dialog.show();
    },
	clearInput:function(){
		var ele=$E("inputSuggest");
//		if(/\d{4,6}/.test(ele.value)){
//			ele.value="";
//		}
		if(ele.value!="" && ele.value!="请输入股票代码或股票名称"){
			ele.value="";
		}
		this.setTip("init");
	},
    hidden: function(){
        this.dialog.hidden();
    },
    uploadImage: function(){
        //trace("insertStock.uploadImage");
		var _this = this;
		function uploadStcockImg(ticket){
			var ele = $E("stock_image_" + _this.id);
			if(_this.buttonState){
				return;
			}
			if(ele.src.indexOf("/min/")==-1){
				editor.insertHTML("<div style='text-align:center;'>"+$E("stock_image_a_"+_this.id).parentNode.innerHTML+"</div><br/>");
				_this.hidden();
				return;
			}
			if (!_this.uploading && ele.src != "") {
				var clearId=setInterval(function(){
					if(this.f_isReady){
						clearInterval(clearId);
						var uplaodUrl = "http://upload.photo.sina.com.cn/interface/pic_upload.php?data=1&app=blog&s=json&mime=image/jpeg&sess=" + encodeURIComponent(__SINAPRO__);
						this.getMovie("uploadstockflash_"+this.id).intoflash(ele.src, uplaodUrl, ticket);
						//$E("uploadstockflash_"+this.id).accessintoinit(ele.src, uplaodUrl);
						this.uploading = true;
						//trace("f_isReady:"+this.f_isReady);
					}
					//trace("this.f_isReady:"+this.f_isReady);
				}.bind2(_this),50);
			}
		}
		Lib.Ticket.get(function(oData){
			uploadStcockImg(oData['ticket'][0]);
		},1,'blog','tupian');
    },
    insertToEditor: function(data){
		//trace("insertStock.insertToEditor");
        var url;
        data.replace(/"pid":"(\w*)"/g, function(a, b){
            url = b;
        });
		//Modified by W.Qiang|wangqiang1 , pictures's domain changes to sinaimg.cn, 2011-03-24
		var num = parseInt("0x"+url.substring(url.length - 2))%16 + 1;
		var imgUrl = "http://s"+num+".sinaimg.cn/orignal/"+url;
		var innerHTMLTmp = ["<div style='text-align:center;'>",
								"<a title='查看股票行情' href='http://finance.sina.com.cn/realstock/company/",this.code,"/nc.shtml' target='_blank'>",
									"<img id='stock_image_",this.id,"' src='",imgUrl,"'/>",
								"</a></div><br/>"].join("");
		//this.code
        editor.insertHTML(innerHTMLTmp);
		//--END W.Qiang|wangqiang1, 2011-03-24
        this.uploading = false;
        this.hidden();
    },
    initUploadFlash: function(){
		//trace("insert flash");
		
		this.buildFlashContainer();
        var swf_url = $_GLOBAL.flashBasicURL + "uploadv2.swf?callback=insertStock.insertToEditor&isready=insertStockIsReady&flashisready=insertStock.flashIsReady";
        var x = Utils.Flash.swfView.Add(swf_url, "uploadstock_" + this.id, "uploadstockflash_" + this.id, this.width, this.height, "9.0.0.0", "#000", {
			callback:"insertStock.insertToEditor",
			isready:"insertStockIsReady",
			flashisready:"insertStock.flashIsReady"
		}, {
            scale: "showall",
            loop: "true",
            play: "true",
            pluginspage: "http://www.macromedia.com/go/getflashplayer",
            allowScriptAccess: "always",
            wmode: "transparent",
            allowFullScreen: 'false',
            wmode: "transparent"
        });
    },
	buildFlashContainer:function(){
		var html='<div id="uploadstock_'+this.id+'" style="width:1px;height:1px;overflow:hidden;position:absolute;top:'+this.dialog.getY()+'px;left:'+this.dialog.getX()+'px"></div>';
		Core.Dom.addHTML(document.body, html);
	},
	flashIsReady:function(){
		//trace("InsertStock.flashIsReady");
		this.f_isReady=true;
		return true;
	},
	swapButtonState:function(isOff){
		var isOff=isOff||false;
		this.buttonState=isOff;
		if(isOff){
			$E("stock_save_"+this.id).parentNode.className="SG_aBtn SG_aBtn_dis SG_aBtn_sub";
			$E("stock_btn_"+this.id).style.display="none";
		}else{
			$E("stock_save_"+this.id).parentNode.className="SG_aBtn SG_aBtnB SG_aBtn_sub";
			$E("stock_btn_"+this.id).style.display="block";
		}
	},
	getMovie:function(movieName) {
         if (navigator.appName.indexOf("Microsoft") != -1) {
             return window[movieName];
         } else {
             return document[movieName];
         }
     } ,
    initHtml: function(){
        var html = '\
		<div class="insetfinance">\
          <h4 id="stock_h4_#{id}">请输入股票代码或股票名称：</h4>\
          <div class="searchModule">\
		  	<form id="stock_form_#{id}" action="http://biz.finance.sina.com.cn/suggest/lookup_n.php"\
			  method="get" \
			  style="position:relative; zoom:1; z-index:100;" \
			  onreset="return function (__from) {insertStock.suggestServer.getCode(__from.q.value, insertStock.fillCode); return false;}(this);"\
          	  onsubmit="return function (__from) {insertStock.suggestServer.getCode(__from.q.value, insertStock.submitCallback); return false;}(this);">\
		    <div class="p1">\
             <input type="hidden" name="country" value="stock" />\
			  <input type="text" id="inputSuggest" name="q" class="txt" value="请输入股票代码或股票名称" />\
              <a href="javascript:;" class="SG_aBtn SG_aBtnB SG_aBtn_sub">\
			  	<cite id="stock_search_#{id}">搜索\
              		<input id="stock_submit_#{id}" type="submit" value="搜索" id="categorySave"/>\
              	</cite>\
			  </a>\
			</div>\
			 </form>\
            <p class="p2" id="stock_tip_#{id}">\
				<span class="SG_txtc">能加进股票的实时变化K线图，更有日K、周K等帮你分析讲解。</span>\
			</p>\
			<div id="divGetCodeResult" class="finList" style="display:none"></div>\
          </div>\
          <div class="fPicType" id="stock_type_#{id}" style="display:none">\
            <dl>\
              <dt>类型选择：</dt>\
              <dd>\
                <input id="stock_min_#{id}" type="radio" name="rdo"/>\
                <label for="stock_min_#{id}">分时图</label>\
                <input id="stock_daily_#{id}" type="radio" name="rdo"/>\
                <label for="stock_daily_#{id}">日K线</label>\
                <input id="stock_weekly_#{id}" type="radio" name="rdo"/>\
                <label for="stock_weekly_#{id}">周K线</label>\
                <input id="stock_monthly_#{id}" type="radio" name="rdo"/>\
                <label for="stock_monthly_#{id}">月K线</label>\
              </dd>\
            </dl>\
          </div>\
          <div class="fPic" style="display:none"><a title="查看股票行情" target="_blank" id="stock_image_a_#{id}"></a></div>\
          <div class="btn" id="stock_btn_#{id}" style="display:none">\
		  	<a href="javascript:;" onclick="return false" class="SG_aBtn SG_aBtn_dis SG_aBtn_sub">\
		  		<cite id="stock_save_#{id}">添加<input type="button" value="添加" id="categorySave"/></cite>\
			</a>\
		  </div>';
        return new Ui.Template(html).evaluate({
            id: this.id
        });
    }
};

function insertStockIsReady()
{
	//trace(111111111111111111111111111111111111111111111111111111);
	return true;
}
