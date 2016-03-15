/** 
 * @fileoverview 展开博文
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-14
 */
$import('sina/Evter.js');
$import('sina/core/dom/parent.js');
$import('sina/core/dom/byClass.js');
$import('sina/core/dom/getXY.js');

Evter.add('closeBlog', function(elem){
    var _dom = Core.Dom;
    var li = _dom.parent(elem, 'li');
    var edata = Evter.data(li)
    var feedTexts = _dom.byClass('feedText', 'div', li);
    if (edata && edata.type === 5) {
        var feedTextCdr = feedTexts[0].children;
        feedTextCdr[0].style.display = '';
        feedTextCdr[4].style.display = '';
        feedTextCdr[1].style.display = 'none';
        feedTextCdr[3].style.display = 'none';
    }else{
        feedTexts[0].style.display = ''; //small
        feedTexts[1].style.display = 'none'; //big
        if(edata&&edata.type===4){ //移除视频
            var videobox = _dom.byClass('feedPic_video', 'div', feedTexts[1]);
            videobox[0].innerHTML = '';
        }
    }
    
//    var edata = Evter.data(li), showing = true;
//    if(edata&&edata.type===5){ //移动音乐播放器
//        showing = false;
//        var btns = _dom.byClass('btn_music', 'div', li);
//        btns[0].appendChild(btns[1].children[0]); trace('backedddd')
//        //btns[0].style.zoom = 1;
//        feedTexts[1].style.display = 'none';
//    }else if(edata&&edata.type===4){ //移除视频
//        var videobox = _dom.byClass('feedPic_video', 'div', feedTexts[1]);
//        videobox[0].innerHTML = '';
//    }
//    showing && (feedTexts[1].style.display = 'none');
    
    //如果是从详细切换到预览 那么将此条信息显示在窗口可视区域内
    var pos = _dom.getXY(li),
        currentScrollTop = document.body.scrollTop||document.documentElement.scrollTop;
    if(pos[1]<currentScrollTop){
        document.body.scrollTop = document.documentElement.scrollTop = pos[1];
    }
});
