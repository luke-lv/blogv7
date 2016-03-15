/** 
 * @fileoverview 转载博文
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-16
 */
$import('sina/Evter.js');
$import('sina/core/dom/parent.js');
$import('sina/core/dom/byClass.js');
$import('sina/core/dom/getXY.js');
$import('sina/utils/io/jsload.js');
$import('sina/utils/template.js');
$import("feed/ReblogSuccess.js");
$import("sina/core/dom/getXY.js");
$import('mojie/slideShow.js');

Evter.add('reblog', function(elem){
    var _dom = Core.Dom;
    var li = _dom.parent(elem, 'li');
    var edata = Evter.data(li);
    var txtlist = _dom.byClass('blog_txtlist', 'div', li);
    var txtlist0 = txtlist[0];
    if(Evter.data(txtlist0)===1){ //已经展开，需要收起层；转载1 评论2 喜欢3
        //txtlist0.style.display = 'none';
        Mojie.slideShow(txtlist0, 150, 0);
        Evter.data(txtlist0,'');
        if(txtlist.length>1){txtlist[1].style.display=''}
        return;
    }

    // if (li.rebloging) {return}
    // li.rebloging = true;
    //获取转载框箭头指向的位置
    var w = Core.Dom.getXY(li);
    var w1 = Core.Dom.getXY(elem);

    showCmsInput();
    //展示评论输入框
    function showCmsInput(){
        var rs = new ReblogSuccess();
        rs.show(elem.getAttribute("sblogid")||edata.blogid, txtlist, function(){
            var em = $T(elem, 'em')[0];
            var m = em.innerHTML.match(/(\d+)/);
            var num = m ? parseInt(m[1]) : 0;
            em.innerHTML = '('+(num+1)+')';
            txtlist0.style.display = 'none';
            Evter.data(txtlist0, '');
            if(txtlist.length>1){txtlist[1].style.display=''}
            $E("feedWrap").style.zoom = 1;
        });
        var arrow = _dom.byClass('arrow', 'div', li);
        arrow[0].style.right = 600 - (w1[0]-w[0]) + "px";
        
        // txtlist0.innerHTML = '正在提交请求...';
        //txtlist0.style.display = '';
        Evter.data(txtlist0, 1);
        if(txtlist.length>1){txtlist[1].style.display='none'}
        Mojie.slideShow(txtlist0, 0, 150);
    }
    $E("feedWrap").style.zoom = 1;
});
