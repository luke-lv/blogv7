/**
 * @fileoverview 页面设置中页签自动初始化的事件
 * @author xinyu@staff.sina.com.cn
 */
$registJob('pagesetTabJob', function(){
    if (!__pageSetVar.tabs[1]) 
        __pageSetVar.tabs[1] = new customStyleSettingTabs($E('customStyleUl'));   
    if (!__pageSetVar.tabs[2]) 
        __pageSetVar.tabs[2] = new setFormat();
    if (!__pageSetVar.tabs[3]) 
        __pageSetVar.tabs[3] = new modulesTab($E('moduleSettingVtabs'));
    if (!__pageSetVar.tabs[4]) 
        __pageSetVar.tabs[4] = new customComponents();
//	  先去掉用户向导
//    if (!__pageSetVar.tabs[5]) 
//        __pageSetVar.tabs[5] = new customGuide();
    
});
