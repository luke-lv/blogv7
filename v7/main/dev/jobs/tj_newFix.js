/**
 * @fileoverview 兼容tj页面新模版
 * @author fuqiang3@staff.sina.com.cn
 * @date 20141110
 */
$import("lib/jobs.js");
$import("sina/core/dom/getElementsByAttr.js");

$registJob("tj_newFix", function (){ 
    var getElementsByAttr = Core.Dom.getElementsByAttr;
    var body = $E('sina_keyword_ad_area2');
    var newImgWraps = getElementsByAttr(body,'se-img','wrapper');
    var h1 = body.getElementsByTagName('h1');
    var h2 = body.getElementsByTagName('h2');

    function eachNodes(nodes,cb){
      for(var i = 0; i< nodes.length; i++){
        cb(nodes[i]); 
      }
    }

    function setH(h){
      h.style.cssText = 'margin-bottom:20px;'; 
      var span = h.getElementsByTagName('span')[0]; 
      if(span) span.style.cssText= 'line-height:150%;';
    }
    
    eachNodes(newImgWraps,function(wrap){
      var span = wrap.getElementsByTagName('span')[0]; 
      var a = wrap.getElementsByTagName('a')[0]; 
      if(span) span.style.cssText= 'display:block;text-align:center;color:#999;';
      if(a) a.style.cssText = 'text-align:center;display:block;';
    });

    eachNodes(h1,setH);
    eachNodes(h2,setH);

});
