/** 
 * @fileoverview 展开博文
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-14
 */
$import('sina/Evter.js');
$import("sina/utils/io/timeoutJsLoad.js");
$import('sina/core/dom/parent.js');
$import('sina/core/dom/byClass.js');
$import('sina/core/dom/getXY.js');
$import('sina/core/dom/nextNode.js');

Evter.add('playMusic', function(elem, event){
    Core.Events.stopEvent(event);
    //var _dom = Core.Dom;
    var edata = Evter.data(elem);
    
    if(edata.shorturl){
        var playbox = elem.parentNode.parentNode;
        var oldhtml = playbox.innerHTML;
        playbox.innerHTML = '正在打开音乐...';
        var err = function(){
            playbox.innerHTML = oldhtml;
            winDialog.alert('打开失败，请稍候再试', {icon:'01'});
        };
        
        new Utils.Io.TimeoutJsLoad('http://api.t.sina.com.cn/widget/show.jsonp?source=1617465124', {
            GET:{
                short_url: edata.shorturl,
                lang: 'zh_cn',
                template_name: $IE?'qingobj':'qingebd',
                vers: 3
            },
            type: "jsonp",
            jsonpParamName: "jsonp",
            onComplete: function(res){
                //trace(res);
                if (res && res.result) {
                    playbox.innerHTML = res.result;//.replace(/<div>/, '').replace(/<\/div>/, '');
                }else{
                    err();
                }
            },
            onException: err
        });
    }
    
});
