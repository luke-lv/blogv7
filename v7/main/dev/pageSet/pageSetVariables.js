/**
 * @fileoverview 页面设置中的一些变量以及常量
 * @author xinyu@staff.sina.com.cn
 * @date 2009-08-06
 */

//__pageSetOrginal 用来保存用户操作前初始化的值
if (!window.__pageSetOrginal) {
    window.__pageSetOrginal = {};
}
//__pageSetVar 用来保存用户操作后的属性的值
if (!window.__pageSetVar) {
    window.__pageSetVar = {};
}

//存放自定义组件的各种信息的数字，提前初始化，因为自定义组件的编辑可能提供给其它页面使用-------------------------
__pageSetOrginal.custom_components_info = __pageSetVar.custom_components_info = {};
//-------------------------------------------------------------------------------------------