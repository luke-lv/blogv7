$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/system/br.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("sina/utils/io/iframeupload.js");
$import("msg/transcode.js");
$import("msg/interfaceCode.js");


var SinaPhotoUploader = {
    "interface1" :	"http://photo.blog.sina.com.cn/upload/upload_receive.php",
    "interface2" : "http://photo.blog.sina.com.cn/upload/a/upload_receive.php",
    "_availChars": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
    "_amount": 0,
    "_uploaded": 0,
    "_disabled": false,
    "_size": {
	"total": 0,
	"current": 0
    },
    "_beginningUTS": 0,
    "_progressID": "",
    "previewPic": function PU_PreviewPic(_self){
	if(!$E(_self).previewed){
	    Core.Dom.setStyle($E(_self + "cleaner"), 'visibility', 'visible');
	    if(typeof($E(_self + "cleaner").isBound) == 'undefined'){
		Core.Events.addEvent($E(_self + "cleaner"), function(e){
		    var clearTarget = e.target || e.srcElement;
		    clearTarget.isBound = true;
		    SinaPhotoUploader.clearPreview(clearTarget.id);
		},'click',false);
	    }
	    
	}
	
	var thisValue = $E(_self).value;
	var currentImg = _self + "preview";
	if ($IE) {
	    var myDiv = document.createElement("div");
	    var mySize = this.getScaleImgSize(thisValue, {
		width : 75,
		height : 75
	    });
	    try {
		if($E(_self).previewed){
		    $E(currentImg).parentNode.replaceChild(myDiv, $E(currentImg).previousSibling);
		}else{
		    $E(currentImg).parentNode.insertBefore(myDiv, $E(currentImg));
		    Core.Dom.setStyle($E(currentImg), "display", "none");
		}
		if (mySize.width != 0 || mySize.height != 0) {
		    Core.Dom.setStyle(myDiv, 'width', mySize.width);
		    Core.Dom.setStyle(myDiv, 'height', mySize.height);
		    Core.Dom.setStyle(myDiv, 'overflow', 'hidden');
		    Core.Dom.setStyle(myDiv, "filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);");
		    try{
			if($IE6){
			    myDiv.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = thisValue;
			}else{
			    $E(_self).select();  
			    var imgSrc = document.selection.createRange().text;  
			    myDiv.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
			}
		    }catch(e){}
		}
		$E(_self).previewed = true;
	    } 
	    catch (e) {
	    }
	}
    },
    
    "getScaleImgSize": function PU_GetScaleImgSize(imgPath, targetSize){
	var img = new Image();
	img.src = imgPath;
	if($E('preloaderImg')){
	    $E('preloaderImg').innerHTML = '';
	}else{
	    var preloaderImg = document.createElement('div');
	    document.body.appendChild(preloaderImg);
	    preloaderImg.id = 'preloaderImg';
	    Core.Dom.setStyle2(preloaderImg,
			       {'position':'absolute',
				'z-index':'-200',
				'visibility':'hidden',
				'left':'0px',
				'top':'0px',
				'width':'1px',
				'height':'1px',
				'overflow':'hidden'
			       });				
	    
	}
	
	$E('preloaderImg').appendChild(img);
	var imgHeight = $E('preloaderImg').clientHeight ;
	var imgWidth = $E('preloaderImg').clientWidth;
	var or = imgHeight/imgWidth ;
	var nr = targetSize.height / targetSize.width;
	imgWidth = (or > nr ? targetSize.height / or : targetSize.width) + "px";
	imgHeight = (or > nr ? targetSize.height : targetSize.width * or) + "px";
	img.onload = null;
	document.body.removeChild($E('preloaderImg'));
	return {
	    width: imgWidth,
	    height: imgHeight
	};
    },
    
    "clearPreview": function PU_ClearPreview(thisObj){
	if($E('preloaderImg'))
	    document.body.removeChild($E('preloaderImg'));
	
	var baseId = thisObj.split('cleaner')[0];
	var thisFile = $E(baseId);
	var oInput = document.createElement("input");
	oInput.setAttribute("type", "file");
	var sName = thisFile.getAttribute("name");
	oInput.setAttribute("name", baseId);
	oInput.setAttribute("id", baseId);
	oInput.setAttribute("value", "");
	thisFile.parentNode.appendChild(oInput);
	oInput.parentNode.removeChild(thisFile);
	oInput.className = "SG_input upfile_input";
	oInput.size = 48;	
	oInput.onkeydown = function PU_RemoveQueuedFile_keydown () {
	    return false;
	};
	oInput.onpaste = function PU_RemoveQueuedFile_paste () {
	    return false;
	};
	oInput.oncontextmenu = function(){
	    return false;
	}
	Core.Events.addEvent($E(baseId),
			     function(e){
				 var _self = e.srcElement || e.target;
				 SinaPhotoUploader.previewPic(baseId);
			     },
			     'change',
			     false
			    );
	
	if($IE){
	    var thisPreview = baseId + "preview";
	    Core.Dom.setStyle($E(thisPreview), "display", "inline");
	    $E(thisPreview).parentNode.removeChild($E(thisPreview).previousSibling);
	}
	$E(thisObj).style.visibility = 'hidden';
    },
    
    "Start": function PU_Start(){		
	/*	if($E("ctgid").style.display == 'none'){
			winDialog.alert('请选择或新建一个专辑。',{icon:'03'});
			return false;
		}*/
	if (this._disabled || !this._validateQueue()) {
	    return false;
	}
	
	if (/^\w{10}_\w{32}$/.test(this._progressID)) {		 
	    this._doUpload();
	    return this;
	}
	
	this._generateID()._doUpload();

	return false;
    },

    
    "UpdatePlan": function PU_UpdatePlan(json){
	if (!json.error) {
	    this._size.total = json.total;
	    this._size.current = json.current;
	    var iPercent = Math.round(json.current * 100 / json.total);
	    var iSpeedInKB = (Math.round(10 * json.current / (new Date().getTime() - this._beginningUTS)) / 10).toString();
	    $E("l").style.width = iPercent.toString() + "%";
	    $E("r").style.width = (100 - iPercent).toString() + "%";
	    $E("schedule").innerHTML = "共 " + this._amount + " 张图片，已上传 " + iPercent + "%，网速 " + iSpeedInKB + "KB/秒";
	}
	
	var eleScripts = document.getElementsByTagName("head")[0].getElementsByTagName("script");
	var last_eleScripts = eleScripts[eleScripts.length - 1];
	if (!last_eleScripts.getAttribute("src").indexOf("http://upload.photo.sina.com.cn/upload2.0/progress.php?")) {
	    last_eleScripts.parentNode.removeChild(last_eleScripts);
	}
	if (this._size.total && this._size.total == this._size.current) {
	    return this._finish();
	}
/*	if (!json.total && parseInt(json.total) > 0 || json.total != json.current) {
	    return this._observeProgress();
	}
*/
	return this;
    },
    
    "_disableUpload": function PU__disableUpload(){
//	$E("bt_upload").className = "SG_aBtn SG_aBtn_dis";
	this._disabled = true;
	return this;
    },
    
    "_enableUpload": function SPU__enableUpload(){
	$E("bt_upload").className = "SG_aBtn SG_aBtnB SG_aBtn14";		
	this._disabled = false;
	$E("tag").setAttribute("todo",'1');
	return this;
    },
    
    "_disableAllElements": function PU__disableAllElements(){
	for (var i = 1; i < 11; i++) {
	    $E("pic" + i).onfocus = null;
	   // $E("pic" + i).disabled = true;
	}
	$E("tag").disabled = true;
	$E("ctgid").disabled = true;
	return this._disableUpload();
    },
    
    "_enableAllElements": function SPU__enableAllElements(){
	for (var i = 1; i < 11; i++) {
	  
	    if ($E("pic" + i).value && $E("pic" + i + "cleaner")) 
		$E("pic" + i + "cleaner").style.visibility = "visible";
	}
//	$E("plan").style.display = "none";
	try {
	    $E("tag").disabled = false;
	} 
	catch (ex) {
	}
	$E("ctgid").disabled = false;
	//	$E("checkbox").disabled = false;
	return this._enableUpload();
    },
    
    "_validateQueue": function PU__validateQueue(){
	this._amount = 0;

	for (var i = 1; i <11; i++) {
	    if ($E("pic"  + i).value.length) {
		this._amount++;
	    }
	}
	if (!this._amount) {
	    winDialog.alert('请选择图片。',{icon:'03'});
	    $E("pic1").focus();
	}
	return 0 < this._amount;
    },
    
    
    "_generateID": function PU__generateID(){
	
	if (/^\w{10}_\w{32}$/.test(this._progressID)) {
	    return this;
	}
	this._progressID = scope.$uid + "_";
	for (var i = 0; i < 32; i++) {
	    this._progressID += SinaPhotoUploader._availChars[Math.round(Math.random() * 15)];
	}
	
	$E("apc_progress_id").value = this._progressID;
	return this;
    },
    
    "_doUpload": function SPU__doUpload(){
	
	try {
	  
	    new Utils.Io.iframeUpload('putData').post(
	 	'uploadForm',
	 	'http://upload.photo.sina.com.cn/interface/pic_upload.php',
	 	function(txt){				
		    var self = this;
		    self.pic_result = eval('(' + txt + ')');
		    if(this.pic_result.code == "A00006"){
			var interfaceURL = (typeof activity != 'undefined' ? SinaPhotoUploader.interface2
					    : SinaPhotoUploader.interface1);
			$E("uploadForm").picdata.value = this.pic_result.data.data;	
			new Interface(interfaceURL,'ijax').request({
			    POST:{
				token   : $E("uploadForm").token.value,
				ctgid   : $E("ctgid").value,
				picdata : $E("uploadForm").picdata.value,
				tag     : $E("tag").value,
				uid     : $E("uploadForm").uid.value,
				appname : $E("uploadForm").appname.value,
				route   : $E("uploadForm").route.value,
				actselect : $E("actselect") ? $E("actselect").value : ""
			    },
			    onSuccess : function(res){
				window.location.href = "http://photo.blog.sina.com.cn/upload/photo_succ.php";
			    },
			    onError : function(res){
				winDialog.alert($SYSMSG[res.code],{icon:'01'});	
			//	$E("plan").style.display = 'none';
				SinaPhotoUploader._enableUpload();
			    }
			    
			});
			
		    } else{							 			
			if(this.pic_result.data.count == -1){
			    var errMsg =
				$SYSMSG[this.pic_result.data.count.toString()];
			}else
			    var errMsg = $SYSMSG[this.pic_result.code];
			winDialog.alert(errMsg, {icon:'01'});	
		//	$E("plan").style.display = 'none';				
			SinaPhotoUploader._enableAllElements();
			
		    }					 
	 	}
	    );
	    
	}catch (ex) {
	    winDialog.alert(ex.description,{icon:'01'});
	}
	//$E("plan").style.display = "";

	return this._disableUpload();
	//._observeProgress();
    },
    
    "_observeProgress": function PU__observeProgress(flag){
	if (!flag) {
	    var func = arguments.callee;
	    window.setTimeout("SinaPhotoUploader._observeProgress(true);", 200);
	    return SinaPhotoUploader;
	}
	
	this.eleScript = document.createElement("script");
	document.getElementsByTagName("HEAD")[0].appendChild(this.eleScript);
	this.eleScript.charset = "gb2312";
	this.eleScript.language = "javascript";
	this.eleScript.src = "http://upload.photo.sina.com.cn/upload2.0/progress.php?id=" + SinaPhotoUploader["_progressID"] + "&qts=" + new Date().getTime();
	return this;
    },
    
    "_finish": function PU__finish(){
	$E('schedule').innerHTML = "(共" + this._amount + "张)图片已上传成功。";
//	$E('plan').style.display = 'none';
    },
    
    "checkPicTag4Blur": function PU__checkPicTag4Blur(){
	if ('0' == thisObj.getAttribute('todo')) 
	    $E('RecommendedTagsPanel').style.display = 'none';
    },
    
    "fnAddRecommendedTag": function PU__fnAddRecommendedTag(text){

	var aList = $E("tag").value.replace(/[;；，　 ,]{1,}/g," ").split(" ");

	if (aList.length > 14) {
	    winDialog.alert('标签个数必须是15个以内，请重新输入。',{icon:'01'});
	    return;
	}

	if (1 == aList.length && "" == aList[0]) {
	    aList[0] = text;
	}
	else {
	    aList[aList.length] = text;
	}

	$E("tag").value = aList.join(" ");
	$E("tag").focus();
    },
    
    "checkPicTag": function SPU__checkPicTag(obj){
	var aList = $E("tag").value.replace(/,/g, " ").replace(/ {2,}/g, " ").split(" ");
	if (aList.length > 15) {
	    var aTag = aList.splice(0, 15);
	    $E("tag").value = aTag.join(" ");
	    winDialog.alert('标签个数必须是15个以内，请重新输入。',{icon:'01'});
	    return;
	}
    }
};