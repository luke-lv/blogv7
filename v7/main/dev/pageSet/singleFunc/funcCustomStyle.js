/**
 * @fileoverview 用户自定义样式用到的两个函数
 * @author xinyu@staff.sina.com.cn
 */
$import("pageSet/singleFunc/funcGetImgStaticPath.js");
(function () {

    var funcNoUsePic = function (id) {//设置该图片为没使用状态后的页面设置内各个div，select的状态
//        trace("设置了" + id + "为未使用状态");
        __pageSetVar.now = 0;
        switch (id) {
            case "2":
                if ($E('bgcolor')) {
                    $E('bgcolor').parentNode.removeChild($E('bgcolor'));
                }
                if ($E('bgtyle')) {
                    $E('bgtyle').parentNode.removeChild($E('bgtyle'));
                }
                $E('sinablogb').style.cssText = '';
                $E('sinabloga').style.cssText = '';
                //头图高度跟着背景走，因为是在背景图那里选高度，不过我真想不通，为啥在背景图里设置头图高度呢。。。。
//				$E('headarea').style.cssText = '';
//				$E('sinablogHead').style.cssText = '';

                document.body.style.cssText = '';
                break;
            case "3":
                if ($E('navtyle')) {
                    $E('navtyle').parentNode.removeChild($E('navtyle'));
                }
                $E('blognavBg').style.cssText = '';

                if ($IE6 && scope.ie6filter.indexOf(__pageSetVar.selectedTpl) > -1) {
                    $E('blognavBg').style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='http://simg.sinajs.cn/blog7newtpl/image/" + __pageSetVar.selectedTpl.split('_')[0] + "/" + __pageSetVar.selectedTpl + "/images/blognavbg.png')";
                }
                break;
            case "4":
                if ($E('headtyle')) {
                    $E('headtyle').parentNode.removeChild($E('headtyle'));
                }
                if ($E('headAltitudeCheck')) {
                    $E('headAltitudeCheck').checked = true;
                }
                //头图高度跟着背景走，因为是在背景图那里选高度，不过我真想不通，为啥在背景图里设置头图高度呢。。。。
                $E('headarea').style.cssText = '';
                $E('sinablogHead').style.cssText = '';

                break;
            default:
                break;
        }
        if ($E('customstylesetting_' + id + '_tab')) {
            $E('useNothing_' + id).checked = false;
            $E('useDefaultImg_' + id).checked = true;
            $E('imgReview_' + id).className = $E('imgReview_' + id).className.replace(/selected/gi, '');
            $E('uploadfinish_' + id).parentNode.className = $E('uploadfinish_' + id).parentNode.className + " customDisabled";
            $E('customContantsTips_' + id).innerHTML = (id == '4' ? "头部高度在150像素至450像素之间" : "");
            var inputs = $E('uploadfinish_' + id).getElementsByTagName('input');
            for (var j = 0; j < inputs.length; j++) {
                inputs[j].disabled = true;
            }

            var sel = $E('uploadfinish_' + id).getElementsByTagName('select');
            for (j = 0; j < sel.length; j++) {
                sel[j].disabled = true;
            }

        }

    };

    var funcSetUsePic = function (id) {//设置该图片为使用状态后的页面设置内各个div，select的状态
//        trace("设置了" + id + "为使用状态");
        __pageSetVar.now = 1;
        switch (id) {
            case "2":
                var img = getImgStaticPath(__pageSetVar["customPic_" + id].pid, 'orignal');
                $E('sinablogb').style.backgroundImage = "url(" + img + ")";
                $E('sinablogb').style.backgroundRepeat = __pageSetVar["customPic_" + id]["repeat"];
                $E('sinablogb').style.backgroundPosition = __pageSetVar["customPic_" + id]["align-h"] + ' ' + __pageSetVar["customPic_" + id]["align-v"];
                $E('sinabloga').style.cssText = '';
                document.body.style.cssText = '';
                document.body.style.backgroundImage = "url()";
                break;
            case "3":
                img = getImgStaticPath(__pageSetVar["customPic_" + id].pid, 'orignal');
                $E('blognavBg').style.backgroundImage = "url(" + img + ")";
                $E('blognavBg').style.backgroundRepeat = __pageSetVar["customPic_" + id]["repeat"];
                $E('blognavBg').style.backgroundPosition = __pageSetVar["customPic_" + id]["align-h"] + ' ' + __pageSetVar["customPic_" + id]["align-v"];
                if ($IE6 && scope.ie6filter.indexOf(__pageSetVar.selectedTpl) > -1) {
                    $E('blognavBg').style.filter = "none";
                }
                break;
            case "4":
                if ($E('headAltitudeCheck')) {
                    $E('headAltitudeCheck').checked = false;
                }
                img = getImgStaticPath(__pageSetVar["customPic_" + id].pid, 'orignal');
                $E('sinablogHead').style.backgroundImage = "url(" + img + ")";
                $E('sinablogHead').style.backgroundRepeat = __pageSetVar["customPic_" + id]["repeat"];
                $E('sinablogHead').style.backgroundPosition = __pageSetVar["customPic_" + id]["align-h"] + ' ' + __pageSetVar["customPic_" + id]["align-v"];
                //头图高度跟着背景走，因为是在背景图那里选高度，不过我真想不通，为啥在背景图里设置头图高度呢。。。。
                //现在头图高度不在背景图那里选了。
                if ($E('headAltitude') && $E('headAltitude').value != '') {
                    $E('sinablogHead').style.height = $E('headAltitude').value + 'px';
                    $E('headarea').style.height = $E('headAltitude').value + 'px';
                    var titleHeight = ($E('headAltitude').value - $E('blogTitle').offsetHeight - $E('blognav').offsetHeight) / 2;
                    $E('blogTitle').style.top = titleHeight + 'px';
                    $E('blognav').style.top = titleHeight + $E('blogTitle').offsetHeight + 10 + 'px';
                }
                break;
            default:
                break;
        }

        if ($E('customstylesetting_' + id + '_tab')) {
            $E('uploadfinish_' + id).parentNode.className = $E('uploadfinish_' + id).parentNode.className.replace(/\scustomDisabled/gi, '');
            var inputs = $E('uploadfinish_' + id).getElementsByTagName('input');
            for (var j = 0; j < inputs.length; j++) {
                inputs[j].disabled = false;
            }
            var sel = $E('uploadfinish_' + id).getElementsByTagName('select');
            for (j = 0; j < sel.length; j++) {
                sel[j].disabled = false;
            }
            $E('useNothing_' + id).checked = false;
            $E('useDefaultImg_' + id).checked = false;
            $E('imgReview_' + id).className = $E('imgReview_' + id).className + " selected";
            $E('customContantsTips_' + id).innerHTML = (id == '4' ? "头部高度在150像素至450像素之间" : "");
        }

    };

    var funcUseNothing = function (id) {//设置为不使用XX图状态后的页面设置内各个div，select的状态
//        trace("设置了" + id + "为不使用任何图片");
        __pageSetVar.now = 2;
        switch (id) {
            case "2":
                if ($E('bgcolor')) {
                    $E('bgcolor').parentNode.removeChild($E('bgcolor'));
                }
                if ($E('bgtyle')) {
                    $E('bgtyle').parentNode.removeChild($E('bgtyle'));
                }
                $E('sinablogb').style.cssText = 'background-image:none';
                $E('sinabloga').style.cssText = 'background-image:none';
                document.body.style.cssText = 'background-image:none';
                break;
            case "3":
                if ($E('navtyle')) {
                    $E('navtyle').parentNode.removeChild($E('navtyle'));
                }
                $E('blognavBg').style.cssText = 'background-image:none';
                $E('blognavBg').style.filter = '';
                if ($IE6 && scope.ie6filter.indexOf(__pageSetVar.selectedTpl) > -1) {
                    $E('blognavBg').style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='http://simg.sinajs.cn/blog7newtpl/image/" + __pageSetVar.selectedTpl.split('_')[0] + "/" + __pageSetVar.selectedTpl + "/images/blognavbg.png')";
                }
                break;
            case "4":
                if ($E('headtyle')) {
                    $E('headtyle').parentNode.removeChild($E('headtyle'));
                }
                if ($E('headAltitudeCheck')) {
                    $E('headAltitudeCheck').checked = true;
                }
                $E('headarea').style.cssText = 'background-image:none;';
                $E('sinablogHead').style.cssText = 'background-image:none;';

                break;
            default:
                break;
        }
        if ($E('customstylesetting_' + id + '_tab')) {
            $E('useNothing_' + id).checked = true;
            $E('useDefaultImg_' + id).checked = false;
            $E('imgReview_' + id).className = $E('imgReview_' + id).className.replace(/selected/gi, '');
            $E('uploadfinish_' + id).parentNode.className = $E('uploadfinish_' + id).parentNode.className + " customDisabled";
            $E('customContantsTips_' + id).innerHTML = (id == '4' ? "头部高度在150像素至450像素之间" : "");
            var inputs = $E('uploadfinish_' + id).getElementsByTagName('input');
            for (var j = 0; j < inputs.length; j++) {
                inputs[j].disabled = true;
            }

            var sel = $E('uploadfinish_' + id).getElementsByTagName('select');
            for (j = 0; j < sel.length; j++) {
                sel[j].disabled = true;
            }

        }

    };

    var showFinish = function (id) {//显示上传过图片后的元素
        if ($E('customstylesetting_' + id + '_tab')) {
            $E('uploadfinish_' + id).style.display = "";
            $E('useDefaultDiv_' + id).style.display = "";

            if (!$_GLOBAL.noPicUpload) {
                //关闭上传修改图片等注释下句。。。。2010-12-13
                $E('uploadbtn_' + id).style.display = "";
            }

            $E('uploading_' + id).style.display = "none";
            $E('uploaderror_' + id).style.display = "none";
            $E('customContantsTips_' + id).innerHTML = (id == '4' ? "头部高度在150像素至450像素之间" : "");
            $E('backbtn_' + id).style.display = "none";
        }
    };

    /*目前根据设计，无用的代码，注释掉，减少打包后程序大小
     var noPic = function(id){//显示没有过图片的元素
     if ($E('customstylesetting_' + id + '_tab')) {
     $E('uploadfinish_' + id).style.display = "none";
     $E('uploadfinish_' + id).parentNode.className = $E('uploadfinish_' + id).parentNode.className.replace(" customDisabled", '');
     $E('uploadbtn_' + id).style.display = "none";
     $E('useDefaultDiv_' + id).style.display = "none";
     $E('customContantsTips_' + id).innerHTML = "支持大小不超过500k的jpg、gif、png图片上传";
     }
     };
     */

    __pageSetVar.funcNoUsePic = funcNoUsePic;
    __pageSetVar.funcSetUsePic = funcSetUsePic;
    __pageSetVar.funcUseNothing = funcUseNothing;
    __pageSetVar.funcshowFinish = showFinish;

//    __pageSetVar.noPic = noPic;
})();
