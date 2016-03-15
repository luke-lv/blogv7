/**
 * @fileoverview
 *  文章页 组件渲染序列
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("component/comp_901.js");
$import("component/comp_903.js");
$import("component/comp_904.js");
$import("component/comp_909.js");
$import("component/comp_47.js");
$import("component/comp_102.js");
$import("component/comp_122.js");
$import("lib/component/renderControl/renderByList.js");

$registJob('articleComp1', function(){

  var list = [901, 102, 122];
  if (Lib.Component.getInitCompSize() === null) {
    Debug.error("无法获得页面内组件的尺寸，请检查页面内输出的组件配置信息是否存在。。。");
    return;
  }
  trace("文章页组件渲染列表: " + list.toString());
  Lib.Component.renderByList(list);
});


$registJob('articleComp2', function(){

  var list = [903, 904, 909, 47];
  if (Lib.Component.getInitCompSize() === null) {
    Debug.error("无法获得页面内组件的尺寸，请检查页面内输出的组件配置信息是否存在。。。");
    return;
  }
  trace("文章页组件渲染列表: " + list.toString());
  Lib.Component.lazyRenderByList(list);
});
