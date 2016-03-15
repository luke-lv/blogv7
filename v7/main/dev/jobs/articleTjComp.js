$import("component/comp_903.js");
$import("component/comp_904.js");
$import("component/comp_909.js");
$import("component/comp_910.js");
$import("component/comp_911.js");
$import("component/comp_940.js");
$import("lib/component/renderControl/renderByList.js");

/**
 * @fileoverview 博客夹页tj=2，组件
 *
 * @create ${date} ${time}
 * @author Qiangyee
 */
$registJob('articleTjComp', function(){
    scope.component_lists = {
        "1":{
            "size":730,"list":[921, 950]
        },
        "2":{
            "size":300,"list":[910, 911, 909,940, 903, 904]
        }
    };
	var list = [910, 911, 909];

	if (Lib.Component.getInitCompSize() == null) {
		Debug.error("无法获得页面内组件的尺寸，请检查页面内输出的组件配置信息是否存在。。。");
		return;
	}
    Lib.Component.renderByList(list);

    var lazylist =  [940, 903, 904];

	Lib.Component.lazyRenderByList(lazylist);
});

