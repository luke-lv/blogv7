/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片上传
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/math/getRandomNumber.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/string/j2o.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/setXY.js");
$import("sina/utils/flash/swf.js");
$import("editor/tools/uploadimage/LoadingList.js");
$import("editor/tools/uploadimage/WaterCopyright.js");
$import("other/getImgStaticPath.js");
$import("msg/uploadImageMSG.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/json.js");
$import("lib/apply.js");
$import("lib/ticket.js");
$import("lib/checkAuthor.js");

/**
 * 图片上传类
 * @class
 */
var UploadImage = Core.Class.create();

UploadImage.prototype = {
	width              : 310,
	height             : 30,
	view               : "select",
	// add by wangqiang1
	// 新版编辑器html结构有变化，因此重新定义节点id
	nodes              : {
		relatedId        : "upload_file_li",
		waterMarkId      : "watermark",
		waterMarkNoticeId: "waternotice"
	},
	FLASH_ID           : "uploadimageflash_",
	EMBED_ID           : "uploadimage_",
	initialize         : function (container, dialogName, opts) {
		// Modified by wangqiang1 2014-08-13
		// 为新版编辑器上传图片需要，添加参数opts覆盖原来的一些属性
		opts = opts || {};
		Lib.apply(this.nodes, opts.nodes, {}, true);
		this.width = opts.width || this.width;
		this.height = opts.height || this.height;
		this.opts = opts;

		this.initFlashContainer(container);
		this.dialogName = dialogName || "imageDialog";
		this.initUploadFlash();
		if (false !== this.nodes.relatedId) {
			this.initFlashPosition();
		}
		window.loadingList = new LoadingList();
		if (!opts.noMarker) {
			//expression
			Core.Events.addEvent($E(this.nodes.waterMarkId), this.waterMark.bind2(this));
			this.waterCopyright = new WaterCopyright(this.nodes.waterMarkNoticeId);
			this.initWaterMarkSelect();
		}

		this.initGetPicSizeFla();
		// --------END---------
	},
	initUploadFlash    : function () {
		var params = 'uploadImage.setparams|uploadImage.error';
		var swf_url = $_GLOBAL.flashBasicURL + (!this.opts.flashFile ? "fileuploadv6.swf?" : this.opts.flashFile + '?') + Core.Math.getUniqueId();
		var x = Utils.Flash.swfView.Add(swf_url, this.FLASH_ID + this.id, this.EMBED_ID + this.id, this.width, this.height, "11.8", "#000", {
			setparams: "uploadImage.setParams",
			isready  : "uploadImageIsRead"

		}, {
			scale            : "showall",
			loop             : "true",
			play             : "true",
			pluginspage      : "http://www.macromedia.com/go/getflashplayer",
			allowScriptAccess: "always",
			wmode            : "transparent",
			allowFullScreen  : 'false',
			wmode            : "transparent"
		});
	},
	initFlashContainer : function (container) {
		this.id = Core.Math.getUniqueId();
		var flashContainer = $C("div");
		flashContainer.style.width = this.width + "px";
		flashContainer.style.height = this.height + "px";
		flashContainer.style.position = "absolute";
		flashContainer.style.overflow = "hidden";
		if (this.opts.zIndex) {
			flashContainer.style.zIndex = this.opts.zIndex;
		}

		flashContainer.id = this.FLASH_ID + this.id;
		Core.Dom.opacity(flashContainer, 0);
		$E(container).appendChild(flashContainer);

	},
	initFlashPosition  : function () {
		//trace("UploadImage.initFlashPosition")
		//this.setFlashPosition(102,65);
		this.moveFlash();
	},
	uploadFinish       : function (fileName, data, flashInfo) {

		data = data.replace(/(<meta[\.\w\s\S\d]*\/><script[\.\w\s\S\d]*>[\.\w\s\S\d]*<\/script>)/gi, '');
		data = Core.String.j2o(data);
		// console.log('uploadFinish: ', fileName, 'data', data);
		// Modifed by wangqiang1 2014-08-14
		// 新版的上传结束
		if (this.opts.uploadFinish) {
			this.opts.uploadFinish(fileName, data);
		} else if (data.code == "A00006") {
			trace(fileName + ":sucsess");
			//window.loadingList.setOperate(fileName,"finish");
			var imageData = data.data.pics.pic_1;
			//console.log("[UploadImage->uploadFinish] fileName:"+fileName+" imageData:"+JSON.stringify(imageData));

			this.setAllTip("finish");

			var isAdd = imageList.add(getImgStaticPath(imageData.pid, "square"), "upload");
			//console.log(">>imageList.at:"+imageList.at);
			//console.log(">>isAdd:"+isAdd);
			if (isAdd) {
				window.loadingList.setPid(imageData.name, imageData.pid);
				window.loadingList.setRange(imageData.name, 100);
			} else {
				window.loadingList.error(imageData.name, true, "图片已满");
			}

		} else {
			imageList.at++;
			var count = data.data.count.toString();
			//console.log("[UploadImage->uploadFinish] upload failure fileName:"+fileName);
			//console.log(">>imageList.at:"+imageList.at);
			switch (count) {
				case "1":
					var imageData = data.data.pics.pic_1;
					var str = imageData.ret.toString();
					var name = imageData.name;

					switch (str) {
						case "-11":
							window.loadingList.error(name, true, $SYSMSG["A77772"]);
							break;
						default:
							window.loadingList.error(name, true);
					}
					break;
				default:
					window.loadingList.error(fileName, true, $SYSMSG["A77772"]);
			}
			this.setAllTip();

		}
		this.moveFlash();
	},
	error : function (code, name) {
		try {
			// Modified by wangqiang1
			// 添加新版编辑图片上传出错提示处理
			var self = this, opts = self.opts, msg;

			// console.log("[UploadImage->error] code:"+code+" name"+name);
			switch (code) {
				case "A06004":
					msg = $SYSMSG["A77771"];
					break;
				case "A06003":// 上传IO出错
					msg = $SYSMSG["A77773"];
					break;
				default:
					msg = $SYSMSG["A77774"];
			}
			if (opts.error) {
				opts.error(code, name, msg);
			} else if (name) {
				self.setAllTip();
				window.loadingList.error(name, true, msg);
			} else if (code !== 'A00650'){
				self.setAllTip();
				window.loadingList.allError();
			}
			//积分消费 非图片博主图片上传超限时添加兑换提示
			if (!opts.allFinish && "A06004" === code) {
				this.redeemPoints();
			}
		} catch (e) {
			console.error(e.message, e.stack);
		}
	},
	redeemPoints    : function () {
		var self = this;
		if (!parent.scope.$is_photo_vip && parent.scope.$redeemImgBloggerDialog) {
			parent.scope.$redeemImgBloggerDialog(function (data) {
				var id = imageList.getIdByIndex(imageList.at);
				window.uploadMain.removeImage(id);
				scope.$token = data.token;
				scope.$vipsign = data.vipsign;
				scope.$pic_encrypt = data.pic_encrypt;
				self.setParams();
			});
		}

	}
	// 图片上传出错后增加错误日志功能
	, errorLog         : function (msg) {
		try {
			//Debug.log("usedTickets:"+usedTickets);
			var createInput = function (name, value) {
				var el = $C('input');
				el.setAttribute('name', name);
				el.setAttribute('value', value);
				el.setAttribute('type', 'hidden');
				return el;
			};
			var err_log_url = 'http://control.blog.sina.com.cn/admin/article/ria_debug.php?timestamp=' + (+new Date());

			var postIframe = $C('iframe'), postForm = $C('form');

			postIframe.id = postIframe.name = '__flash_error_log' + (+new Date) + parseInt(1000 * Math.random());
			postIframe.style.display = 'none';
			postForm.target = postIframe.name;
			postForm.method = 'POST';
			postForm.setAttribute('action', err_log_url);

			var typeEl = createInput('type', 'flash_err_log'), pageEl = createInput('page', scope.$PRODUCT_NAME + '_' + scope.$pageid), codeEl = createInput('code', 500), descEl = createInput('desc', 'getTickets=' + Lib.Ticket.requestTickets.join(',') + '||' + msg);

			postForm.appendChild(typeEl);
			postForm.appendChild(pageEl);
			postForm.appendChild(codeEl);
			postForm.appendChild(descEl);

			document.body.appendChild(postForm);
			document.body.appendChild(postIframe);

			postForm.submit();

			setTimeout(function () {
				document.body.removeChild(postForm);
				document.body.removeChild(postIframe);
			}, 50);

		} catch (e) {
		}
	}, selectFile      : function (names) {
		// console.log("[UploadImage->selectFile] names:", names);
		var loadFiles = names.split("|");
		var opts = this.opts;
		if (opts && opts.selectFile) {
			opts.selectFile(loadFiles);
		} else {
			for (var i = 0; i < loadFiles.length; i++) {
				if (imageList.eleMax - imageList.at - i > 0) {
					window.loadingList.add(imageList.getIdByIndex(imageList.at + i), loadFiles[i]);

					if (!imageList.isAddRemvoeFunc) {
						imageList.addDelCallback(window.loadingList.remove.bind2(window.loadingList));
						imageList.isAddRemvoeFunc = true;
					}

				} else {
					this.setAllTip("error");
					this.stopUpload(loadFiles[i]);
					//window.loadingList.add(loadFiles[i]);
				}
			}
		}

		this.setSize();
		this.moveFlash();
	},
	progress           : function (name, num) {
		// console.log("[UploadImage->progress] name:"+name+"  num:"+num);
		if (num < 100) {
			window.loadingList.setRange(name, num);
		}
	},
	// 设置flash参数
	setParams          : function () {
		//    var params='multi|blog|json|1|||'+encodeURIComponent(__SINAPRO__)+'|2M|http://upload.photo.sina.com.cn/interface/pic_upload.php?' + Core.Math.getUniqueId() + '|Images(jpg,gif,png):*.jpg;*.gif;*.png|uploadImage.selectFile|uploadImage.progress|uploadImage.uploadFinish|uploadImage.error';
		//trace("flash_callback:uploadImage.setParams");
		try {
			var type = "multi";
			if (window.imageList && imageList.eleMax < 2) {
				type = "single";
			}

			var url = "http://upload.photo.sina.com.cn/interface/pic_upload.php?app=blog&s=json";
			if (scope.$token) {
				url += "&token=" + scope.$token;
			}
			if (scope.$vipsign) {
				url += "&vipsign=" + scope.$vipsign;
			}
			if (scope.$pic_encrypt) {
				url += "&pic_encrypt=" + scope.$pic_encrypt;
			}

			var size = "5M";
			if (parent.scope.$is_photo_vip) {
				size = "10M"
			}
			var params = {
				phpurl   : url,
				mode     : type,
				maxsize  : size,
				filterStr: 'Images(jpg,jpeg,gif,png):*.jpg;*.jpeg;*.gif;*.png',
				begin    : 'uploadImage.selectFile',
				progress : 'uploadImage.progress',
				end      : 'uploadImage.uploadFinish',
				error    : 'uploadImage.error',
				getTicket: 'uploadImage.getTicket',
				overdue  : 'redo',
				errorLog : 'uploadImage.errorLog',
				clickCb  : 'uploadImage.flashClick',
				allFinish: 'uploadImage.allFinish',
				imageInfo: (this.opts.imageInfo ? 'uploadImage.imageInfo' : '')
			}
//      url + '|'+type+'|'+size
//      +'|Images(jpg,jpeg,gif,png):*.jpg;*.jpeg;*.gif;*.png'
//      +'|uploadImage.selectFile|uploadImage.progress'
//      +'|uploadImage.uploadFinish|uploadImage.error'
//      +'|uploadImage.getTicket|redo|uploadImage.errorLog'
			var paramsStr = Utils.Json.obj2json(params);
			// console.log(paramsStr);
			$E(this.EMBED_ID + this.id).setParams(paramsStr);
		} catch (e) {
			console.error(e.message, e.stack);
		}

	},
	/**
	 * 图片信息加载完成后，flash回调函数
	 * @param {string} name 图片名称
	 * @param {string}  width 宽度
	 * @param {string}  height 搞度
	 */
	imageInfo          : function (name, width, height) {
		this.opts.imageInfo(name, width, height);
	},
	/**
	 * 点击上传flash按钮时的回调，图片上传中不回调
	 */
	flashClick         : function () {
		var opts = this.opts;
		opts.click && this.opts.click();
	},
	allFinish          : function (total, finishFiles, cancelFiles, errorFiles) {
		var JSON = Utils.Json;
		this.opts && this.opts.allFinish(total, JSON.parse(finishFiles), JSON.parse(cancelFiles), JSON.parse(errorFiles));

	},
	waterDisabled      : function (disabled) {
		var id = this.nodes.waterMarkId;
		if (disabled) {
			$E(id).disabled = true;

		} else {
			$E(id).disabled = false
		}
	},
	setFlashSize       : function (size) {
		var ele = $E(this.FLASH_ID + this.id);
		var size = size || "small";
		switch (size) {
			case "small":
				ele.style.width = 60 + "px";
				ele.style.height = 25 + "px";
				break;
			case "hidden":
				ele.style.width = 1 + "px";
				ele.style.height = 1 + "px";
				break;
			default:
				ele.style.width = this.width + "px";
				ele.style.height = this.height + "px";
		}

	},
	setSize            : function () {
		top[this.dialogName].setSize(660, document.body.offsetHeight);
	},
	setAllTip          : function (type) {
		var html = ""
		switch (type) {
			case "error":
				html = '<span class="cRed">' + imageList.eleMax + '张以后的图片已自动忽略</span>';
				break;
			case "wait":
				html = '<span class="cGreen">添加中，请等待...</span>';
				break;
			case "finish":
				html = '<span class="cGreen">图片已经添加完成</span>';
				break;
			default:
				html = '';

		}
		$E("upload_image_note").innerHTML = html;
		this.moveFlash();
	},
	moveFlash          : function () {
		var xy = Core.Dom.getXY($E(this.nodes.relatedId));
		this.setFlashPosition(xy[0] + 100, xy[1]);
	},
	/**
	 * 取得票据
	 */
	getTicket          : function () {
		Lib.checkAuthor();
		if (!$isLogin && "editor" === top.scope.$pageid) {
			top.winDialog.alert("您已退出登录，请先登录！");
			return;
		}
		Lib.Ticket.get(this.ticketCallback.bind2(this), 20);
	},
	/**
	 * 向flash添加票据
	 */
	ticketCallback     : function (json) {
		var ele = $E(this.EMBED_ID + this.id);
		// http://wiki.intra.sina.com.cn/pages/viewpage.action?pageId=7147925
		if (!json || 6103 === parseInt(json.retcode)) {
			top.winDialog.alert("您已退出登录，请先登录！");
			return;
		}
		var jsonStr = Utils.Json.obj2json(json);
		// console.log('ticketCallback', jsonStr);
		ele.addTicket(jsonStr);
	},
	setFlashPosition   : function (x, y) {
		//trace("UploadImage.setFlashPosition");
		var flashEle = $E(this.FLASH_ID + this.id);
		Core.Dom.setXY(flashEle, [x, y]);
	},
	stopUpload         : function (name) {
		$E(this.EMBED_ID + this.id).cancel(name);
	},
	swapGoto           : function (type) {
		var type = type || "show";
		if (typeof(this.gotoType) == "undefined") {
			this.gotoType = "show";
		}
		if (type == "show" && this.gotoType != "show") {
			$E("upload_go_on").parentNode.style.display = "";
			this.gotoType = "show";
			this.moveFlash();
		}
		if (type == "hidden" && this.gotoType != "hidden") {
			$E("upload_go_on").parentNode.style.display = "none";
			this.setFlashSize("hidden");
			this.gotoType = "hidden";
		}
	},
	initWaterMarkSelect: function () {
		var id = this.nodes.waterMarkId;
		var ele = $E(id);
		var cookieValue = Utils.Cookie.getCookie("water_mark_" + scope.$uid);
		//trace("initWaterMarkSelect.cookieValue:"+cookieValue);
		if (cookieValue == "1") {
			ele.checked = true;
			this.waterMark();
		} else {
			ele.checked = false;
		}
	},
	waterMark          : function () {
		var id = this.nodes.waterMarkId;
		var ele = $E(id);
		var url;
		var flashEle = $E(this.EMBED_ID + this.id);
		if (typeof flashEle.setMask != "undefined") {
			if (ele.checked) {
				//trace("设置水印");
				if (top.scope.$uhost && top.scope.$uhost != "") {
					url = "blog.sina.com.cn/" + top.scope.$uhost;
				} else {
					url = "blog.sina.com.cn/u/" + top.scope.$uid;
				}
				flashEle.setMask(1, url);
				Utils.Cookie.setCookie("water_mark_" + scope.$uid, "1", 999);
			} else {
				//trace("取消设置水印");
				flashEle.setMask(0);
				Utils.Cookie.setCookie("water_mark_" + scope.$uid, "0", 999);
			}
		} else {
			setTimeout(this.waterMark.bind2(this), 50);
		}

	},
	initGetPicSizeFla  : function () {
		try {
			var fNode = $C("div");
			fNode.id = "GetPicSize";
			$E("headerTab").appendChild(fNode);
			var tStr = "";
			if ($TT || $360 || $Maxthon) {
				tStr = "?t=" + Core.Math.getRandomNumber(1, 99999);//针对360、遨游、tt 防止恶意缓存
			}
			Utils.Flash.swfView.Add($_GLOBAL.flashBasicURL + "getPicSize.swf" + tStr, "GetPicSize", "getPicSizeSWF", "1", "1", "8", "#ffffff", {}, {
				allowScriptAccess: "always",
				wmode            : "transparent"
			});
			Utils.Flash.swfView.Init();
			this._getPicSizeSWF = $E("getPicSizeSWF");
			parent.trace("获取图片大小flash加载成功！！！！！");
		} catch (ex) {
			parent.trace("获取图片大小flash加载失败");
		}
	},
	getFlashReady      : function () {
		parent.trace("flash回调");
		top.isPicFlaReady = true;

	},
	getSizeStart       : function () {
		try {
			//this._getPicSizeSWF.getStart();
			$E("getPicSizeSWF").getStart();
		} catch (e) {
			parent.trace("flash getStart函数不可用");
		}

	},
	getSize            : function (url) {
		try {
			this._getPicSizeSWF.getPicSize(url);
		} catch (e) {
			parent.trace("flash getPicSize函数不可用");
		}
		//getAlbumPicSize
	},
	ImgSizeRet         : function (url, obj) {
		//if (url.indexOf("photo.sina") != -1) {
		//Modified by W.Qiang , pictures's domain changes to sinaimg.cn, 2011-03-15
		if (url.indexOf("photo.sina") != -1 || url.indexOf("sinaimg.cn") != -1) {
			var pId = url.substring(url.lastIndexOf('/') + 1);
			pId = pId.replace(/&\d{3}/, "");
			parent.top.ArticleIMGFuncs.picSizeObj[pId] = obj;

		} else {
			parent.top.ArticleIMGFuncs.picSizeObj[url] = obj;

		}
	}
};
