$import("lib/lib.js");
$import("sina/sina.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/removeClassName.js");

/**
 * 处理常见的tab切换显示
 * tabClass,    定义一组tab的css类名，程序通过这个class名找到所有属于该组的导航标签
 * curClass,    定义为当前激活的tab 使用的class
 * eventType,   tab切换被触发的事件
 * callback     切换完成后要执行的函数
 * 
 *      //tab id和div id的对应规则               "tabid"  => "tabid_div"
 * @example：
 *         <ul>
 *              <li id="tab_1" class="mytab cur">第一个导航页签</li>
 *              <li id="tab_2" class="mytab">第二个导航页签</li>
 *              <<li id="tab_3 class="mytab"">第三个导航页签</li>
 *         </ul>
 *         <div id="tab_1_div" style="">第一个导航页签内容</div>
 *         <div id="tab_2_div" style="display:none;">第二个导航页签内容</div>
 *         <div id="tab_3_div" style="display:none;">第三个导航页签内容</div>
 *        <script>
 *           Lib.tabToggether('mytab','cur','click');
 *        </script>
 */
Lib.tabToggether =  function (tabClass,curClass,eventType,callback)
  {
    eventType = eventType || "click";
    callback = callback || function(){};
    var arr = Core.Dom.getElementsByClass(document, '*', tabClass);
    for(var i=0;i<arr.length;i++)
    {
      var tab = arr[i];
      tab.curClass = curClass;
      tab.tabClass = tabClass;
      tab.callback = callback;
      Core.Events.addEvent(tab,(function(e){
                                              var preTab = null;
                                              var nowTab = this;
                                              var ar_r = Core.Dom.getElementsByClass(document, '*', nowTab.tabClass);
                                              for(var j=0;j<ar_r.length;j++)
                                              {
                                                var p = ar_r[j];                                                
                                                var g = "\\b"+nowTab.curClass+"\\b";
                                                g = new RegExp(g);
                                                var c = p.className;                                                
                                                if(c.match(g))
                                                {
                                                  preTab = p;
                                                  break;
                                                }                                                                                                
                                              }
                                              Lib.tabToggether.changFun(preTab,nowTab);                                              
                                              tab.callback();
                                            }).bind2(tab),eventType);
    }
  };
  /**
   * 定义如何切换，可以被覆盖
   */
  Lib.tabToggether.changFun= function(preTab,nowTab)
  {    
    var divid = nowTab.id+"_div";
    if(!$E(divid))return;
    var id = preTab.id+"_div";
    Core.Dom.removeClassName(preTab,preTab.curClass);
    nowTab.className+=" "+preTab.curClass;
    $E(id).style.display="none";
    $E(divid).style.display="";
  }