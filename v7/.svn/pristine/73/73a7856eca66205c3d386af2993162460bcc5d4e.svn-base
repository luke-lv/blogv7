/**
 * @fileoverview 影视博客 搜索文章函数 供最新影评组件使用
 * @author wujian wujian@staff.sina.com.cn
 */
$import("sina/sina.js")
/**
 * 搜索文章
 * @param {Object} a 搜索文字
 */
scope.searchFilm = function (a) {
    //获取dom节点
    var loginBarSearchForm = $E("loginBarSearchForm");
    var url = loginBarSearchForm.action;
    var loginBarSearchT = $E("loginBarSearchT");
    var loginBarSearchS = $E("loginBarSearchS");
    var loginBarSearchTS = $E("loginBarSearchTS");
    var loginBarSearchType = $E("loginBarSearchType");
    var loginBarSearchSType = $E("loginBarSearchSType");
    var loginBarSearchInput = $E("loginBarSearchInput");

    //先保存 所有值 借用form 提交到搜索页面 然后 在恢复原值 哈哈 ！！！又偷懒了^_^.
    var tObj = {
        "url": url,
        "loginBarSearchT": loginBarSearchT.value,
        "loginBarSearchS": loginBarSearchS.value,
        "loginBarSearchS": loginBarSearchS.value,
        "loginBarSearchType": loginBarSearchType.value,
        "loginBarSearchSType": loginBarSearchSType.value,
        "loginBarSearchInput": loginBarSearchInput.value
    }
    //设置表单 值 然后提交
    //$E("loginBarSearchForm") form节点
    loginBarSearchInput.value = "影评 " + a;
    loginBarSearchT.value = "blog";
    loginBarSearchSType.value = "tag";
    loginBarSearchForm.action = "http://uni.sina.com.cn/c.php";
    loginBarSearchForm.submit();
    //恢复原始表单的值
    loginBarSearchForm.action = tObj["url"];
    loginBarSearchT.value = tObj["loginBarSearchT"];
    loginBarSearchS.value = tObj["loginBarSearchS"];
    loginBarSearchS.value = tObj["loginBarSearchS"];
    loginBarSearchType.value = tObj["loginBarSearchType"];
    loginBarSearchSType.value = tObj["loginBarSearchSType"];
    loginBarSearchInput.value = tObj["loginBarSearchInput"];
}