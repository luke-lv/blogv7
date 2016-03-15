/** 
 * @fileoverview 添加评论
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-16
 */
$import('sina/Evter.js');
$import('sina/core/dom/parent.js');
$import('sina/core/dom/byClass.js');
$import('sina/core/dom/getXY.js');
$import('sina/utils/io/jsload.js');
$import('sina/utils/template.js');
$import("feed/FeedComment.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/events/stopEvent.js');

Evter.add('comment', function(elem, event){
    Core.Events.stopEvent(event); //否则IE6下报错yeah
    
    var _dom = Core.Dom;
    var li = _dom.parent(elem, 'li');
    var edata = Evter.data(li);
    var txtlist = _dom.byClass('blog_txtlist', 'div', li);
    var txtlist0 = txtlist[0];
    if(Evter.data(txtlist0)===2){ //已经展开，需要收起层；转载1 评论2 喜欢3
        //txtlist0.style.display = 'none';
        Mojie.slideShow(txtlist0, 150, 0);
        Evter.data(txtlist0,'');
        if(txtlist.length>1){txtlist[1].style.display=''}
        Evter.remove('updataCmsNum'+edata.blogid);
        return;
    }
    
    var num_em = $T(elem, 'em')[0]; //评论数
    var nmatch = num_em.innerHTML.match(/(\d+)/);
    //获取评论框箭头展开的位置
    var w = Core.Dom.getXY(li);
    var w1 = Core.Dom.getXY(elem);
    //展示评论输入框
    new FeedComment(edata.blogid, nmatch?nmatch[1]:0, txtlist);
    var arrowPos = _dom.byClass('arrow', 'div', li);
    arrowPos[0].style.right = 600 - (w1[0]-w[0]) + "px";
    
    //txtlist0.style.display = '';
    Evter.data(txtlist0, 2);
    if(txtlist.length>1){txtlist[1].style.display='none'}
    Mojie.slideShow(txtlist0, 0, 150);
    
    Evter.add('updataCmsNum'+edata.blogid, function(num){
        num_em.innerHTML = '('+num+')';
    });
    
});
