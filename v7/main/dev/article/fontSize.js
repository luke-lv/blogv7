/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 改变正文页文章内容的字号
 * @author stan | chaoliang@staff.sina.com.cn
 */
function changeFontSize(e){
    var fontClass, str = "字体大小：";
    var template = '<strong>#</strong>&nbsp;', i = 3, choice = ["小", "中", "大"];
    str += new Array(4).join(template);
    switch (e) {
        case 2:
            fontClass = "fontSize_L";
            break;
        case 0:
            fontClass = "fontSize_S";
            break;
        case 1:
        default:
            fontClass = "fontSize_M";
            break;
    }
    str = str.replace(/(<strong>)(#)(<\/strong>)/g, function(a, b, c, d){
        i--;
        if (i != e) {
            return '<a href="#" onclick="changeFontSize(' + i + ');return false;">' + choice[i] + '</a>';
        }
        else {
            return b + choice[e] + d;
        }
    });
    $E("articleFontManage").innerHTML = str.substring(0,str.length-6);
    
    if(typeof attentionWorldCup != 'undefined'){
    	$E("articlebody").className = "worldcup_article " + fontClass;	//世界杯
    }else{
    	$E("articlebody").className = "artical " + fontClass;			//页面构建把样式名字起成articel了
    }

    if (typeof SUDA != 'undefined') {
        SUDA.uaTrack('blog_article', 'h_article16');
    }
}
