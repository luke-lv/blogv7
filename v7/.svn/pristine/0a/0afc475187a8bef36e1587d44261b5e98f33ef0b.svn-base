/** 
 * @fileoverview 展开博文
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-14
 */
$import('sina/Evter.js');
$import('sina/core/dom/parent.js');
$import('sina/core/dom/byClass.js');
$import('sina/core/dom/getXY.js');
$import('sina/core/dom/nextNode.js');
$import('sina/core/dom/previousNode.js');

Evter.add('showMusicAlbum', function(elem){
    var _dom = Core.Dom;
    //var li = _dom.parent(elem, 'li');
    var albumSrc = elem.src||'';
    elem = elem.parentNode;
    var showed = Evter.data(elem);
    if(showed){
        elem.style.display = 'none'; //small
        _dom.nextNode(elem).style.display = ''; //big
        return;
    }
    
    var big = _dom.createElement('<div class="textpic"><img width="420" alt="" src="' +
        albumSrc.replace('_150150', '_420420') + '" e-name="hideMusicAlbum"></div>');
    elem.style.display = 'none';
    elem.parentNode.insertBefore(big, elem.nextSibling);
    Evter.data(elem, "1");
});

Evter.add('hideMusicAlbum', function(elem){
    var _dom = Core.Dom;
    elem = elem.parentNode;
    var li = _dom.parent(elem, 'li');
    _dom.previousNode(elem).style.display = ''; //small
    elem.style.display = 'none'; //big
    
    //如果是从详细切换到预览 那么将此条信息显示在窗口可视区域内
    var pos = _dom.getXY(li),
        currentScrollTop = document.body.scrollTop||document.documentElement.scrollTop;
    if(pos[1]<currentScrollTop){
        document.body.scrollTop = document.documentElement.scrollTop = pos[1];
    }
});
