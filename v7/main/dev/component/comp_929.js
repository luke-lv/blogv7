/**
 * @fileoverview
 *    博客首页（非页面设置）、博文列表搜博主文章组件 id=929
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/utils/form/inputListen.js");

$import("lib/component/class/registComp.js");

$import("component/comp_63.js");
$registComp(929, {
        "load": function () {
            Utils.Form.inputListen($E("keyword"), 50);
        }
    }, '63');