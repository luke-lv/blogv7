$import("lib/register.js");
/**
 * @fileoverview 文件说明
 *
 * @create ${date} ${time}
 * @author Qiangyee
 */
Lib.register("blogv.getVHTML", function(){

    return function(wtype, isLinked){
        var title, className;
        if (isNaN(wtype)) {
            wtype = -1;
        } else {
            wtype = parseInt(wtype, 10);
        }
        if (0 == wtype) {
            title = "新浪个人认证";
            className = " SG_icon146";
        } else if (0 < wtype && 8 > wtype) {
            title = "新浪机构认证";
            className = " SG_icon147";
        }
        var str;
        if (!1 !== isLinked) {
            isLinked = !0;
        }
        if (title) {
            str = '<img class="SG_icon '
                + className + '" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="'
                + title + '" alt="'
                + title + '" align="absmiddle" />';

        } else {
            str = '';
        }
        if (str && isLinked) {
            str = '<a target="_blank" href="http://blog.sina.com.cn/v/verify">'
                + str + '</a>';
        }
        return str;
    };
});
