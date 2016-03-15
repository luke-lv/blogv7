/**
 * author:changchuan
 * 博客搬家上传文件
 */

$import("sina/sina.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/system/br.js");

$import("lib/checkAuthor.js");
$import("lib/login/ui.js");

$registJob("blogMoveUpfile", function(){
    //上传按钮id
    var btn_upfile_id = "clientfile";
    //发送按钮
    var btn_send_id = "clientfilesubmit";
    
	//兼容老页面
	if(!$E(btn_upfile_id) || !$E(btn_send_id))
	{
		return;
	}
	
    var btn_iframe_filebtnname = "clientfile";
    
    var t = Core.Dom.getElementsByClass(document, 'div', "uploadingBanner")[0];
    var sendBarobj = new sendBar(t, t.parentNode.getElementsByTagName('em')[0]);
    
    var iframeisok = false;
    
    var iframe = null;
    this.fileInputObj = null;
    var filename = '.zip';
   // var src = "http://upload.move.blog.sina.com.cn/msnspace/upload.php?uid=" + ($UID ? $UID : "");
    var src = "http://upload.move.blog.sina.com.cn/msnspace/upload.php";
    var upfileObj = new IframeUpFile(src, btn_upfile_id, uploadendcallback);
	
	 $E("clientfilename").value="";
    
    scope.upfileselect = function(){
        var value = $E(btn_upfile_id).value;
		
        
        if (value == "") {
            alert("请先选择要上传的文件");
            return false;
        }
		
		 if (! /.+\.zip$/.test(value)) {
            alert("选择的文件必须是zip文件");
            return false;
        }      
        $E("clientfilename").value = value;
        upfileObj.checkIsOk = true;       
    };
    
    Core.Events.addEvent($E(btn_upfile_id),function(e){
		Lib.checkAuthor();
		 if (!$isLogin) {
		 	new Lib.Login.Ui().login(function(){});
			e = e || window.event;
			Core.Events.stopEvent(e);
		 }		
	},'click');
    
    $E(btn_upfile_id).onchange = scope.upfileselect;
    
    $E(btn_send_id).onclick = function(){
		Lib.checkAuthor();
		 if (!$isLogin) {
		 	new Lib.Login.Ui().login(function(){});
			return;
		 }

        if (upfileObj.checkIsOk) {
            uploadingAnimotion();
            upfileObj.submit(function(){
            });
        }
        else {
            alert("请先选择要上传的文件");
        }
    };
    
    /**
     * 正在上传的动画
     */
    function uploadingAnimotion(){
        sendBarobj.start();
        $E("divMoveUpload").style.display = "none";
        $E("divUploding").style.display = "";
        
    }
    
    function fileNameCheck(value){
        if (value == "") {
            alert("请先选择要上传的文件");
            return false;
        }
	

        if (! /.+\.zip$/.test(value)) {
            alert("选择的文件必须是zip文件");
            return false;
        }
        return true;
    }
    function uploadendcallback(err){
    	$E("clientfilename").value="";
        sendBarobj.end(function(){
            $E("divUploding").style.display = "none";
			if (err.toLowerCase() == '已经在为您搬家，请耐心等待') {
					window.location.href ="http://move.blog.sina.com.cn/admin/blogmove/result_msn.php?error_num=12";
					return;
			}
            if (err.toLowerCase() == 'ok') {
                $E("divUploadSuccessed").style.display = "";
            }
            else {
                try {
                    $E("divMoveUpload").style.display = "";
                    $E("divMoveUploadstart").style.display = "none";
                    $E("divMoveUploaderr").style.display = "";
                    $E("errtext").innerHTML = err;
                } 
                catch (e) {
                }
            }
        });
    }
    
    /**
     *
     * @param {Object} src	iframe 地址
     * @param {Object} fileInputName	文件字段的name
     * @param {Object} fnCheck 所选文件名的校验函数
     * @param {Object} opt	其他form表单
     * @param {Object} autoSubmit	是否在选择完文件后自动提交
     */
    function IframeUpFile(src, fileInputId, callback){
        this.formeElement = $E(fileInputId);
        this.checkIsOk = false;
        
        this.callback = callback ||
        function(){
        };
        
        this.iframeName = "Post_Frame";
        if ($IE) {
            this.iframe = document.createElement("<iframe name=\"" + this.iframeName + "\">");
        }
        else {
            this.iframe = document.createElement("iframe");
            this.iframe.name = this.iframeName;
        }
        this.iframe.id = this.iframeName;
		this.iframe.style.display="none";
        this.state = 0;
        var _m = this;
        document.body.appendChild(this.iframe);
        if (this.iframe.readyState) {
            this.iframe.onreadystatechange = function(){
                if (_m.iframe.readyState.match(/complete|loaded/gi)) {
                    _m.stateChange(_m.state + 1);
                }
            };
        }
        else {
            this.iframe.onload = function(){
                _m.stateChange(_m.state + 1);
            };
        }
        // this.iframe.src = src;
        
        this.form = document.createElement('form');
        
        this.form.method = "post";
        this.form.action = src;
        this.form.target = this.iframeName;
        try {
            this.form.enctype = "multipart/form-data";
        } 
        catch (e) {
        }
        try {
            this.form.encoding = "multipart/form-data";
        } 
        catch (e) {
        }
        
        this.formeElement.parentNode.insertBefore(this.form, this.formeElement);
        this.form.appendChild(this.formeElement);
        
        
    }
    
    IframeUpFile.prototype.submit = function(){
        this.stateChange(2);		
		this.form.action = "http://upload.move.blog.sina.com.cn/msnspace/upload.php?uid=" + ($UID ? $UID : "");
        this.form.submit();
    };
    IframeUpFile.prototype.stateChange = function(iState){
        switch (iState) {
            case 0:
                break;
            case 1:
                break;
                
            case 2: /**开始发送**/
                break;
            case 3: //发送成功
            	this.form.reset();				
    			this.checkIsOk=false;
                var err = this.iframe.contentWindow.err;
                this.callback(err);
                break;
        }
        this.state = iState;
    };
    
    
    
    
    function sendBar(p, c){
        this.obj = p;
        this.text = c;
        this.percent = 1;
        this.h = null;
    }
    sendBar.prototype.start = function(){
        var _m = this;
        _m.percent = 0;
        _m.obj.style.width = (++_m.percent) + "%";
        _m.text.innerHTML = (_m.percent) + "%";
        
        this.h = setInterval(function(){
            if (_m.percent < 99) {
                _m.obj.style.width = (++_m.percent) + "%";
                _m.text.innerHTML = (_m.percent) + "%";
            }
            else {
                clearInterval(_m.h);
            }
        }, 500);
    };
    sendBar.prototype.end = function(fun){
        var _m = this;
        clearInterval(this.h);
        this.h = setInterval(function(){
            if (_m.percent < 95) {
                _m.percent += 5;
                _m.obj.style.width = (_m.percent) + "%";
                _m.text.innerHTML = (_m.percent) + "%";
            }
            else {
                _m.percent = 100;
                _m.obj.style.width = (_m.percent) + "%";
                _m.text.innerHTML = (_m.percent) + "%";
                clearInterval(_m.h);
                fun();
            }
        }, 10);
    };
    
	var emailform = $E("emailform");
	if(!emailform)return;
	emailform.onsubmit = function()
	{
		var v = emailform.elements['email'].value;
		v = v.trim();
		if(!v)
		{
			alert("请输入您常用的email地址，方便我们在搬家完成后及时发邮件通知您");
			return false;
		}
		var g = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		
		if(g.test(v))
		{
			return true;
		}else
		{
			alert("email地址错误，请重新输入");
		}
		
		return false;
	};
	
    
});

