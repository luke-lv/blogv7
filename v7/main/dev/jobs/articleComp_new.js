/**
 * @fileoverview
 *  文章页 组件渲染序列
 * @author stan | fuqiang3@staff.sina.com.cn
 */
$import("component/comp_901_new.js");
$import("component/comp_903_new.js");
$import("component/comp_904.js");
$import("component/comp_911.js");
$import("lib/component/renderControl/renderByList.js");

$registJob('articleComp_new', function() {
  var list = [901, 903, 904,911];
  if (Lib.Component.getInitCompSize() === null) {
    Debug.error("无法获得页面内组件的尺寸，请检查页面内输出的组件配置信息是否存在。。。");
    return;
  }
  trace("文章页组件渲染列表: " + list.toString());
  Lib.Component.lazyRenderByList(list);
});

