/** 
 * @fileoverview 外链统计 - 用于index、indexM页
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-10-19
 * @modified xiaoyue3 2012-12-29 新增对自定义组件里的列表组件和文本组件进行外链统计
 */
$import("other/countOSLink.js");
$import("sina/core/dom/byClass.js");
$import("sina/core/dom/next.js");

$registJob('osl_index', function(){
    var _next = Core.Dom.next;
    var uid = scope.$uid;
    function count(contents){
        var list = [],
            i = contents.length,
            bid;

        while( i-- ){
            bid = ( _next(contents[i], 'blogzz_zzlist')||{} ).id;
            if(bid){
                list.push({
                    blogid: bid.replace('ff_', ''),
                    container: contents[i]
                });
            }else{
                list.push({
                    uid: uid,
                    container: contents[i]
                });
            }
        }
        Lib.countOSLink(list);
    }

    var contents;
    if( $E('module_10001_SG_connBody') ){
        
       contents = Core.Dom.byClass('content', 'div', $E('module_10001_SG_connBody'));
       contents.length && count(contents);
    }
    if( $E('module_10002_SG_connBody') ){
       contents = Core.Dom.byClass('content', 'div', $E('module_10002_SG_connBody'));
       contents.length && count(contents);
    }
    if( $E('module_10003_SG_connBody') ){
       contents = Core.Dom.byClass('content', 'div', $E('module_10003_SG_connBody'));
       contents.length && count(contents);
    }
    //对自定义组件拿到自定义组件的id added xiaoyue3
    var customList = scope.component_lists, customId = [];
    if(customList){
        for(list in customList){
            var arr = customList[list].list;
            var len = arr && arr.length;
            if(len){
                for(var i = 0; i<len; i++){
                    if(arr[i]>1000 && arr[i]<1100){
                        customId.push(arr[i]);
                    }
                }
            }
        }
    }
    
    if(customId.length){
        for (var i = 0; i<customId.length; i++) {
            if($E("module_" + customId[i] )){
                contents = Core.Dom.byClass('diywidget', 'div', $E("module_" + customId[i] ));
                contents.length && count(contents);
            }
        };
    }
});
