/**
 * @author fuqiang3 fuqiang3@staff.sina.com.cn
 * @fileoverview 正文图片宽度>容器，设置成100%
 */
$import("lib/jobs.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getStyle.js");

$registJob('articleMaxImg', function() {
  var pageid = scope.$pageid,
  getElementsByClass = Core.Dom.getElementsByClass,
  getStyle = Core.Dom.getStyle,
  maxWidth = '100%',
  content;

  function setMax(img, max, width) {
    setTimeout(function() {
      if (img.width > width) {
        if ('max-width' in img.style) {
          img.style['max-width'] = max;
        } else {
          img.style.width = max;
        }
      }
      if (img.width == 1) setMax(img, max, width);
    },
    100);
  }

  function setImgMax(contents, max) {
    if(!contents || !contents[0]) {
        return;
    }
    var width = parseInt(getStyle(contents[0], 'width'), 10);
    for (var i = 0; i < contents.length; i++) {
      var content = contents[i];
      var imgs = content.getElementsByTagName('img');
      for (var k = 0; k < imgs.length; k++) {
        var img = imgs[k];
        setMax(img, max, width);
      }
    }
  }

  if (pageid == 'indexM' || pageid == 'index') {
    content = $E('module_10001_SG_connBody');
    var contents = getElementsByClass(content,'div', 'content');
    setImgMax(contents, maxWidth);
  } else if (pageid == 'articleM' || pageid == 'article') {
    content = $E('sina_keyword_ad_area2');
    setImgMax([content], maxWidth);
  }

});

