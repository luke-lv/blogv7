/**
 * 个人中心推人模块
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 */
$import("lib/component/class/comp_baseClass.js");
$import("lib/component/class/registComp.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("msg/pushcode.js");

$registComp(993, {
    load: function () {
        var that = this;
        var _entry = new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_suggest.php", "jsload");
        _entry.request({
            onSuccess: function (res) {
                that.setContent(res);
                that.bindBtn();
            },
            onError: function (res) {
                window.location.reload(true);
            }
        });
    },
    bindBtn: function () {
        var that = this;
        var changeBtn = $E("changeSuggest");
        if (changeBtn) {
            changeBtn.onclick = function () {
                that.load();
                return false;
            };
        }
    }
});
