/*
 * @author shaomin |shaomin@staff.sina.com.cn
 * @desc define dialogs for photo object
 *       include delete、setCover、rotate、movetoAnotherAlbum、collect.
 */

$import("sina/sina.js");
//$import("sina/module/login/init_loginUI.js");

$import("lib/login/ui.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("sina/core/function/bind2.js");
$import("sina/core/system/br.js");
$import("sina/core/events/stopEvent.js");

$import("sina/core/dom/setStyle.js");
$import("sina/core/string/format.js");
$import("msg/transcode.js");
$import('sina/utils/limitLength.js');
$import("common/BF.js");



(function(_) {
    _.getCtg = function(k) {
        var currentCate = movelist[k];
        var btnDom = moveDialog.nodes;
        btnDom["btn1"].className = "SG_aBtn SG_aBtnB";
        btnDom['btn1'].onclick = function() {
            if (typeof currentCate == 'undefined' || currentCate == null)
                return;
            movePhoto(picId, currentCate);
        };

    };


    _.movePhoto = function(pid, oCate) {

        if (typeof moveDialog != 'undefined') {
            moveDialog.close();
        }
        winDialog.confirm('确实要转移此图片吗？', {
            subText: '此图片将被转移至<span style="color:red;">' + (oCate.encrypt == 'public' ? '公开' : '密码') + '</span>专辑：<br/><a href="' + DOMAIN + '/category/u/' + scope.$uid + '/s/' + oCate.ctg_id + '" target="_blank">' + oCate.category + '</a>',
            icon: "04",
            textOk: '是',
            textCancel: '否',
            funcOk: function() {
                phpENTRY["move"].request({
                    GET: {
                        uid: scope.$uid,
                        pic_id: pid,
                        ctg_id: oCate.ctg_id
                    },
                    onSuccess: function(res) {
                        document.location.reload();
                    },
                    onError: function(res) {
                        callErr(res.code);
                    }
                });
            }
        });

    };


    _.collectMe = function(visitorId, picId) {
        phpENTRY["collect"].request({
            GET: {
                ouid: visitorId,
                pic_id: picId,
                uid: scope.$uid
            },
            onSuccess: function(res) {
                winDialog.alert("图片已收藏成功。", {
                    title: "提示",
                    funcOk: function() {
                        document.location.reload();
                    },
                    icon: '03'
                });



            },
            onError: function(res) {
                if (res.code == 'P00006') {
                    // Lib.checkAuthor();
                    document.location.href = DOMAIN + '/falsepage/u/' + $UID;
                } else {
                    callErr(res.code);
                }
            }

        });

    };

    _.createAlbum = function() {
        try {
            Core.Events.stopEvent();
        } catch (e) {}

        if (typeof window.myclicked != 'undefined' && window.myclicked) {
            return;
        } else {
            window.myclicked = true;
        }
        Core.Dom.setStyle($E("title_err"), "display", "none");
        Core.Dom.setStyle($E("content_err"), "display", "none");
        Core.Dom.setStyle($E("encrypt_err"), "display", "none");

        var AlbumConfig = {
            uid: scope.$uid,
            category: $E("AlbumForm").albumtitle.value,
            memo: $E("AlbumForm").albumdesc.value,
            is_pw: $E("AlbumForm").is_pw.value,
            pic_id: $E("AlbumForm").picId.value,
            ctg_id: $E("AlbumForm").ctgId.value
        };
        if ($E("AlbumForm").albumtitle.disabled == true) {
            AlbumConfig.is_def = true;
            AlbumConfig.category = '';
        }
        // 验证标题不能为空
        Utils.limitLength($E("AlbumForm").albumtitle, 50);
        Utils.limitLength($E("AlbumForm").albumdesc, 500);

        if ($E("AlbumForm").albumtitle.value.replace(/(^\s*|\s*$)/g, '') == "" ||
            $E("AlbumForm").albumtitle.value == "请输入专辑标题") {
            $E("title_err").innerHTML = $SYSMSG.P02101;
            Core.Dom.setStyle($E("title_err"), "display", "block");
            myclicked = false;
            return;
        }

        if ($E("AlbumForm").is_pw.value == "1") {
            // 验证加密专辑的密码不能为空
            if ($E("encrypt_pwd").value.replace(/(^\s*|\s*$)/g, '') == "") {
                $E("encrypt_err").innerHTML = $SYSMSG.P05013;
                Core.Dom.setStyle($E("encrypt_err"), "display", "block");
                Core.Dom.setStyle($E("tip"), "display", "none");
                myclicked = false;
                return;
            } else {
                AlbumConfig["password"] = $E("encrypt_pwd").value;
            }
        }

        phpENTRY['handleAlbum'].request({
            POST: AlbumConfig,
            onSuccess: function(res) {
                if (!scope.$pageid.match(/upload/g)) {
                    document.location.reload();
                } else {
                    var OptionText = ($E("AlbumForm").is_pw.value == "1" ? "[加密]" : "") + Core.String.decodeHTML(res.ctg_name);
                    var myOption = new Option(OptionText, res.ctg_id.toString());
                    $E("ctgid").style.display = '';
                    $E("ctgid").options.add(myOption, 0);
                    $E("ctgid").options.selectedIndex = 0;
                    if ($E("counter"))
                        $E("counter").innerHTML = parseInt($E("counter").innerHTML) + 1;
                    if ($E("noCtgSpan")) {
                        $E("noCtgSpan").style.display = 'none';
                    }
                }
                myclicked = false;
                moveDialog.close();

            },
            onError: function(res) {
                myclicked = false;
                var location = 'title';
                if (typeof res.data != "undefined")
                    location = res.data.errFrom;
                if (location == 'encrypt')
                    $E("tip").style.display = 'none';
                $E(location + "_err").style.display = '';
                $E("AlbumForm").focus();
                $E(location + "_err").innerHTML = $SYSMSG[res.code];
            }
        });
    };


    _.rotateImage = function(p, angle, whence) {
        if (whence) {
            p.angle = ((p.angle == undefined ? 0 : p.angle) + angle) % 360;
        } else {
            p.angle = angle;
        }

        if (p.angle >= 0) {
            var rotation = Math.PI * p.angle / 180;
        } else {
            var rotation = Math.PI * (360 + p.angle) / 180;
        }
        var costheta = Math.cos(rotation);
        var sintheta = Math.sin(rotation);
        if (document.all && !$OPERA) {
            var canvas = document.createElement("img");
            canvas.src = p.src;
            canvas.height = p.height;
            canvas.width = p.width;
            canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta + ",M12=" + -sintheta + ",M21=" + sintheta + ",M22=" + costheta + ",SizingMethod='auto expand')";
        } else {
            var canvas = document.createElement("canvas");

            if (!p.oImage) {
                canvas.oImage = new Image;
                canvas.oImage.src = p.src;
                canvas.oImage.onload = function() {
                    loadImg(canvas, costheta, sintheta, rotation);
                }
            } else {
                canvas.oImage = p.oImage;
                loadImg(canvas, costheta, sintheta, rotation);
            }
        }
        canvas.id = p.id;
        canvas.angle = p.angle;
        canvas.angle = canvas.angle < 0 ? 360 + canvas.angle : canvas.angle;
        p.parentNode.replaceChild(canvas, p);
    };

    _.loadImg = function(canvas, costheta, sintheta, rotation) {
        canvas.style.width = canvas.width = Math.abs(costheta * canvas.oImage.width) + Math.abs(sintheta * canvas.oImage.height);
        canvas.style.height = canvas.height = Math.abs(costheta * canvas.oImage.height) + Math.abs(sintheta * canvas.oImage.width);
        var context = canvas.getContext("2d");
        context.save();
        if (rotation <= Math.PI / 2) {
            context.translate(sintheta * canvas.oImage.height, 0);
        } else if (rotation <= Math.PI) {
            context.translate(canvas.width, -costheta * canvas.oImage.height);
        } else if (rotation <= 1.5 * Math.PI) {
            context.translate(-costheta * canvas.oImage.width, canvas.height);
        } else {
            context.translate(0, -sintheta * canvas.oImage.width);
        }
        try {
            context.rotate(rotation);
            context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
            context.restore();
        } catch (e) {
            console.log(e.message);
        }
    };
    _.collectThisPic = function(self, picID) {

        if (scope.login) {
            collectMe(scope.visitor.uid, picID);
        } else {
            var Login = new Lib.Login.Ui();
            Login.login(function() {
                Lib.checkAuthor();
                collectMe($UID, picID);

            });
        }

    };

    _.impeachPic = function() {

        setTimeout("createDialog()", 3);
        window.createDialog = function() {

            if (typeof reportDialog != 'undefined') {
                reportDialog.setContent(PhotoDom["impeach"].format(picInfo.title));
            } else {
                window.reportDialog = winDialog.createCustomsDialog({
                    content: PhotoDom["impeach"].format(picInfo.title),
                    title: "举报"
                });

            }
            reportDialog.setMiddle();
            reportDialog.show();
            Core.Events.addEvent($E('reportForm_post'), function(e) {
                var radioValue = "其它";
                for (var i = 0; i < $E("reportForm").impeachType.length; i++) {
                    var thisRadio = $E("reportForm").impeachType[i];
                    if (thisRadio.checked)
                        radioValue = thisRadio.value;
                }

                phpENTRY['impeach'].request({
                    GET: {
                        pic_id: picInfo.pic_id,
                        type: radioValue,
                        authcode: $E("reportForm").authcode.value,
                        contact: $E("reportForm").contact.value,
                        memo: $E("reportForm").desc.value,
                        uid: scope.$uid

                    },
                    onSuccess: function(res) {
                        reportDialog.hidden();
                        winDialog.alert("举报成功", {
                            subText: '我们将尽快处理。',
                            title: '举报成功',
                            icon: '03'
                        });
                        getAuthCode("authimage");

                    },
                    onError: function(res) {
                        $E('wrongInfo').parentNode.style.display = '';
                        $E('wrongInfo').innerHTML = $SYSMSG[res.code];
                        getAuthCode("authImg");
                    }

                });
            }, 'click', false);


        };
    };


})(window);
