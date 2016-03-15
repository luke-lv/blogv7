/** 
 * @fileoverview feed功能
 * @author Book | liming9@staff.sina.com.cn
 * @date 2012-08-11
 */
$import('lib/jobs.js');
$import('sina/core/events/addEvent.js');
$import('sina/core/dom/byClass.js');
$import('other/SinaEx.js');
$import('other/enterLeave.js');
$import('sina/Evter.js');
$import('mojie/loadImgCallback.js');
$import('mojie/checkImageSize.js');

$import('feed/openBlog.js');
$import('feed/closeBlog.js');
//$import('feed/showHideAlbum.js');
$import('feed/playMusic.js');
$import('feed/like.js');
$import('feed/reblog.js');
$import('feed/comment.js');
$import('feed/delete.js');

$registJob('feed', function(){
    
    var _byClass = Core.Dom.byClass;
    //鼠标悬停
    SinaEx.enterLeave($E('feedWrap'), function(li){
        var fdate = _byClass('feeddate', 'span', li);
        if(!fdate){return}
        fdate[0].style.display = ''; //时间
        fdate.length>1 && (fdate[1].style.display=''); //删除和编辑
//        fdate[0].style.visibility = 'visible'; //时间
//        fdate.length>1 && (fdate[1].style.visibility='visible'); //删除和编辑
    }, function(li){
        var fdate = _byClass('feeddate', 'span', li);
        if(!fdate){return}
        fdate[0].style.display = 'none'; 
        fdate.length>1 && (fdate[1].style.display='none');
//        fdate[0].style.visibility = 'hidden'; 
//        fdate.length>1 && (fdate[1].style.visibility='hidden');
    }, 200);
    
    //检查feed图片宽度
    Mojie.checkImageSize(_byClass('for_check_size', 'img', $E('feedWrap')), Mojie.loadImgCallback);
    //视频feed图片icon高度设置
    Evter.add('videoIconHeight',function(){
        var videoWrap = _byClass('videoMicro', 'div', $E('feedWrap'));
        var arr = [], h;
        for(var i = 0; i < videoWrap.length; i++){
            var img = videoWrap[i].children[1];
            arr.push(img); 
        }
        Mojie.checkImageSize(arr,function(el){
            h = parseInt(el.height);
            //若不设置高度，直接设置图片宽度，高度会显示不正常。
            el.oriImg.style.height = h + "px";
            el.oriImg.previousSibling.style.top = Math.floor(h/2 - 8) + "px";
        });   
    });
    Evter.fire('videoIconHeight');
});
