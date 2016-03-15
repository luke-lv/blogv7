/**
 * @fileoverview
 *	图片延迟加载的 Job
	要求所有需要延迟加载的图片的 IMG 标签，都带有一个 real_src 自定义属性
	用来存放真实图片地址，src 都采用一个共同的小图即可。
 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("lib/lazyload.js");
// 图片延迟加载
$registJob("imageLazyLoad", function() {
  // 扫描页面内所有图片，找出带有 real_src 的
  var imgs = document.getElementsByTagName("IMG");
  var list = [];

  for (var i = 0, len = imgs.length; i < len; i++) {
    if (imgs[i].getAttribute("real_src") != null) {
      list.push(imgs[i]);
    }
  }
  // 如果这样的图片超过一张，就放入延迟加载列表
  if (list.length > 0) {
    Lib.LazyLoad(list, {
      callback: function(o) {
        scope.sharePhoto && scope.sharePhoto.bindFn && scope.sharePhoto.bindFn(o, 'real_src');
        var src = o.getAttribute("real_src");
        if (scope.showPicSlide) {
          scope.showPicSlide(o, src);
        };

        o.src = src;
        // 专栏页面特殊处理
        if (scope.$pageid === "articletjTech"){
          if (o.complete && o.width > 550){
            o.width = 550;
          } else {
            o.onload = function(){
              if (o.width > 550){
                o.width = 550;
              }
            }
          }
          
        }
      }
    });
  }
});
