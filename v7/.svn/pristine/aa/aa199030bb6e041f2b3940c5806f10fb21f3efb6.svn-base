/**
 * @fileoverview 独立方法，上传图片
 * @author xinyu@staff.sina.com.cn
 *
 */
$import("msg/uploadPicMSG.js");

$import("sina/utils/flash/swf.js");
$import("sina/core/string/j2o.js");
$import("lib/ticket.js");
$import("sina/utils/json.js");
$import("pageSet/singleFunc/funcGetImgStaticPath.js");
$import("pageSet/uidlist.js");

(function (_s) {
    var _ua = navigator.userAgent.toLowerCase();
    _s.$TT = /tencenttraveler/.test(_ua);
    _s.$360 = /360se/.test(_ua);
    _s.$Maxthon = false;
    try {
        var t = window.external;
        _s.$Maxthon = t.max_version ? true : false;
    } catch (e) {
    }
})(window);

(function () {

    var func = {
        id: 0,
        isready: [false, false, true, true, true],
        progressflag: false,//是否在上传进行中，false代表不在上传中，true代表上传中
        upload: function (id) {
            //trace('...............................................');
            var swf_url = $_GLOBAL.flashBasicURL + "fileuploadv5.swf";
            if ($360 || $TT || $Maxthon) {
                swf_url += '?t=' + new Date().getTime();
            }

            if (!$_GLOBAL.noPicUpload) {
                //关闭上传修改图片等注释下句。。。。2010-12-13
                var x = Utils.Flash.swfView.Add(swf_url, 'uploadflash_' + id, "upload_" + id, "170", "30", "9.0.0.0", "#000", {
                    setparams: "pageSetUploadPic.setParams",
                    isready: "pageSetUploadPic.isReady"
                }, {
                    scale: "showall",
                    loop: "true",
                    play: "true",
                    pluginspage: "http://www.macromedia.com/go/getflashplayer",
                    allowScriptAccess: "always",
                    wmode: "transparent",
                    allowFullScreen: 'false'
                });
            }
        },
        isReady: function () {
            this.whichId();
            return this.isready[this.id];
        },
        ready: function () {
            this.whichId();
            return true;
//            this.isready[this.id] = true;
        },
        setParams: function () {
            this.whichId();
            var url = "http://upload.photo.sina.com.cn/interface/pic_upload.php?app=theme&s=json";
//			if(scope.$pic_encrypt) {
//				url = 'http://upload.photo.sina.com.cn/interface/pic_upload.php?app=theme&s=json&loginstr=' + encodeURIComponent(scope.$pic_encrypt);
//			}
//			else if(__SINAPRO__ != "" && __SINAPRO__ != null) {
//				url = 'http://upload.photo.sina.com.cn/interface/pic_upload.php?app=theme&s=json&sess=' + __SINAPRO__;
//			}

            if ($E("upload_" + this.id)) {
                $E('upload_' + this.id).setParams(url + '|single|500K|Images(jpg,jpeg,gif,png):*.jpg;*.jpeg;*.gif;*.png|pageSetUploadPic.selectFile|pageSetUploadPic.progress|pageSetUploadPic.uploadFinish|pageSetUploadPic.error|pageSetUploadPic.getTicket|redo');
            } else {
                setTimeout(null, 30);
                $E('upload_' + this.id).setParams(url + '|single|500K|Images(jpg,jpeg,gif,png):*.jpg;*.jpeg;*.gif;*.png|pageSetUploadPic.selectFile|pageSetUploadPic.progress|pageSetUploadPic.uploadFinish|pageSetUploadPic.error|pageSetUploadPic.getTicket|redo');
            }

        },
        selectFile: function (name) {
            this.whichId();
            __pageSetVar["customPic_" + this.id].triger = true;//用来判断用户是否点击了选择文件的按钮
            __pageSetVar["customPic_" + this.id].cancel = false;
            $E('uploadingprogress_' + this.id).style.width = "0%";
            $E('uploadingtext_' + this.id).innerHTML = "0%";
            //flash父窗口宽度以及自己宽度

            if (!$_GLOBAL.noPicUpload) {
                //关闭上传修改图片等注释下句。。。。2010-12-13
                $E('uploadflash_' + this.id).style.width = "1px";
            }

            $E('upload_' + this.id).width = "1";

            $E('uploading_' + this.id).style.display = "";
            $E('customContantsTips_' + this.id).style.display = "none";
            $E('uploaderror_' + this.id).style.display = "none";

            if (!$_GLOBAL.noPicUpload) {
                //关闭上传修改图片等注释下句。。。。2010-12-13
                $E('uploadbtn_' + this.id).style.display = "none";
            }

            $E('uploadfinish_' + this.id).style.display = "none";
            $E('backbtn_' + this.id).style.display = "";
            $E('useDefaultDiv_' + this.id).style.display = "none";
            $E('uploading_' + this.id).style.display = "";
            $E('customContantsTips_' + this.id).style.display = "";
            $E('customContantsTips_' + this.id).innerHTML = "支持大小不超过500k的jpg、gif、png图片上传";
            //trace("begin.........");
        },
        uploadFinish: function (name, data, code) {
            this.whichId();
            //说明用户没有点击该页签的选择文件按钮，执行到此有可能是从别的页签快速切换而来，因此阻止执行
            if (__pageSetVar["customPic_" + this.id].triger == false) {
//				trace('说明用户没有点击该页签的选择文件按钮，执行到此有可能是从别的页签快速切换而来，因此阻止执行');
                return;
            }
            //点击了取消后-------------------------------------------------
            if (__pageSetVar["customPic_" + this.id].cancel == true) {
                return;
            }
            //---------------------------------------------------------------
            //trace("return : " + data);
            this.progressflag = false;
            data = data.replace(/(<meta[\.\w\s\S\d]*\/><script[\.\w\s\S\d]*>[\.\w\s\S\d]*<\/script>)/gi, '');
            data = Core.String.j2o(data);

            //flash父窗口宽度以及自己宽度

            if (!$_GLOBAL.noPicUpload) {
                //关闭上传修改图片等注释下句。。。。2010-12-13
                $E('uploadflash_' + this.id).style.width = "170px";
            }

            $E('upload_' + this.id).width = "170";

            if (!$_GLOBAL.noPicUpload) {
                //关闭上传修改图片等注释下句。。。。2010-12-13
                $E('uploadbtn_' + this.id).style.display = "";
            }

            //trace(data.code);
            if (data.code == "A00006") {

                $E('uploadfinish_' + this.id).style.display = "";

                $E('uploading_' + this.id).style.display = "none";
                $E('useDefaultDiv_' + this.id).style.display = "";
                $E('backbtn_' + this.id).style.display = "none";

                var pid = getImgStaticPath(data.data.pics.pic_1.pid, 'small');

                //trace("上传完成后=" + pid+";id="+this.id);
                //上传完后需要将图片使用设置为1--------------------------
                $T($E('imgReview_' + this.id), 'IMG')[0].src = pid;

                __pageSetVar["customPic_" + this.id].pid = data.data.pics.pic_1.pid;
                __pageSetVar["customPic_" + this.id].apply = "1";

                __pageSetVar.funcSetUsePic(this.id);

                // 暂时注销此判断
                if (0 && famous[scope.$uid] == 1) {
                    winDialog.alert("<span style='font-size:12px; font-weight:normal;'>\
					您对头图、背景图的修改需要通过审核后方可生效。审核结果会以系统消息的方式通知您。\
					<br/><br/>如有疑问请咨询：<br/>电话:4008812813<br/>邮箱:ads@staff.sina.com.cn</span>", {
                        icon: "01"
                    }, "tips");
                }
                //-----------------------------------------------------
            } else {
                //trace('error upload code='+data.code);
                $E('uploading_' + this.id).style.display = "none";
                $E('errortips_' + this.id).innerHTML = $SYSMSG[data.code];
                $E('uploaderror_' + this.id).style.display = "";
                $E('backbtn_' + this.id).style.display = "none";
            }
            $E('customContantsTips_' + this.id).style.display = "";
            this.onUploadFinished && this.onUploadFinished();

        },
        progress: function (name, num) {
            $E('uploadingprogress_' + this.id).style.width = Math.floor(num) + "%";
            $E('uploadingtext_' + this.id).innerHTML = Math.floor(num) + "%";
            this.progressflag = true;
        },
        error: function (code) {
            this.whichId();
            //说明用户没有点击该页签的选择文件按钮，执行到此有可能是从别的页签快速切换而来，因此阻止执行
            if (__pageSetVar["customPic_" + this.id].triger == false) {
//				trace('说明用户没有点击该页签的选择文件按钮，执行到此有可能是从别的页签快速切换而来，因此阻止执行');
                return;
            }
            //点击了取消后----------------------------------------------
            if (__pageSetVar["customPic_" + this.id].cancel == true) {
                return;
            }
            //----------------------------------------------------
            this.progressflag = false;
            //trace("error code=" + $SYSMSG[code]);

            if (!$_GLOBAL.noPicUpload) {
                //关闭上传修改图片等注释下句。。。。2010-12-13
                $E('uploadflash_' + this.id).style.width = "170px";
            }

            $E('upload_' + this.id).width = "170";

            $E('backbtn_' + this.id).style.display = "none";
            $E('uploading_' + this.id).style.display = "none";
            $E('errortips_' + this.id).innerHTML = $SYSMSG[code];
            $E('uploaderror_' + this.id).style.display = "";

            if (!$_GLOBAL.noPicUpload) {
                //关闭上传修改图片等注释下句。。。。2010-12-13
                $E('uploadbtn_' + this.id).style.display = "";
            }

            $E('backbtn_' + this.id).style.display = "none";
        },
        whichId: function () {
            if ($E('customstylesetting_2_tab') && $E('customstylesetting_2_tab').style.display == "block") {
                this.id = "2";
            } else if ($E('customstylesetting_3_tab') && $E('customstylesetting_3_tab').style.display == "block") {
                this.id = "3";
            } else {
                this.id = "4";
            }
        },
        /**
         * 取得票据
         */
        getTicket: function () {
            Lib.Ticket.get(this.ticketCallback.bind2(this), 2);
        },
        /**
         * 向flash添加票据
         */
        ticketCallback: function (result) {
            var ele = $E("upload_" + this.id);
            ele.addTicket(Utils.Json.obj2json(result));
        },

        onUploadFinished: function () {
        }
    };

    window.pageSetUploadPic = func;
})();

