/**
 * @author sinadmin
 */
$import("lib/jobs.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/events/addEvent.js");
//Modified by W.Qiang ,pictures's domain ,2011-03-15
var conf = {
    "img1": "http://s11.sinaimg.cn/middle/5a35c7fct770ca202dd2a&690&690",
    "img2": "http://s16.sinaimg.cn/middle/5a35c7fct7349e9ab5c7f&690&690",
    "img3": "http://s8.sinaimg.cn/middle/5a35c7fct7346d10384a7&690&690",
    "img4": "http://s1.sinaimg.cn/middle/5a35c7fct7346d1039a70&690&690",
    "img5": "http://s16.sinaimg.cn/middle/5a35c7fct7346d113096f&690&690",
    "img6": "http://s9.sinaimg.cn/middle/5a35c7fct7334da68d228&690&690",
    "img7": "http://s2.sinaimg.cn/middle/5a35c7fct7334da68ac11&690&690",
    "img8": "http://s9.sinaimg.cn/middle/5a35c7fct7334da6867a8&690&690",
    "img9": "http://s5.sinaimg.cn/middle/5a35c7fct7334da783f84&690&690",
    "img10": "http://s4.sinaimg.cn/middle/5a35c7fct7334da786603&690&690",
    "img11": "http://s10.sinaimg.cn/middle/5a35c7fct7334da87afb9&690&690",
    "img12": "http://s11.sinaimg.cn/middle/5a35c7fct7334da87d88a&690&690",
    "img13": "http://s9.sinaimg.cn/middle/5a35c7fct7334da975838&690&690",
    "img14": "http://s4.sinaimg.cn/middle/5a35c7fct7334d72c1643&690&690",
    "img15": "http://s16.sinaimg.cn/middle/5a35c7fct7334d72c3e3f&690&690",
    "img16": "http://s8.sinaimg.cn/middle/5a35c7fct7334d72c5397&690&690",
    "img17": "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif",
    "img18": "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif",
    "img19": "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"
}
$registJob("testPos", function(){
    trace("testPos");
    var articlebody = $E('articlebody');
    var imgs = $T(articlebody, 'img');
    
    var str = '';
    
    for (var i = 0; i < imgs.length; i++) {
        str += '"img' + i + '":"' + imgs[i].src + '",';
    }
    alert(str);
    var psize = Core.System.pageSize();
    var scroll = Core.System.getScrollPos();
    var img1 = $E('img1');
    var img2 = $E('img2');
    var arr = [];
    arr.push(img1);
    arr.push(img2);
    trace("页面大小，高：" + psize[1] + "px;<br>窗口大小：高：" + psize[3]);
    trace("滚动条：垂直：" + scroll[0]);
    trace("img1距离顶部的距离：" + Core.Dom.getTop(img1));
    trace("img2距离顶部的距离：" + Core.Dom.getTop(img2));
    Core.Events.addEvent(window, function(){
        var scroll2 = Core.System.getScrollPos();
        var psize2 = Core.System.pageSize();
        if (arr.length > 0) {
            if ((scroll2[0] + psize2[3]) < Core.Dom.getTop(arr[0])) {
                trace("底线距离顶部距离" + (scroll2[0] + psize2[3]) + ".<br>img1距离页面顶部距离：" + Core.Dom.getTop(arr[0]));
                
            }
            else {
                arr[0].innerHTML = "123123123";
                arr.shift();
            }
        }
        
    }, 'scroll');
});
