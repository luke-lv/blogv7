/** 
 * @fileoverview 喜欢博文
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-14
 */
$import('sina/Evter.js');
$import('sina/core/dom/parent.js');
$import('sina/core/dom/byClass.js');
$import('sina/core/dom/getXY.js');
$import('sina/utils/io/jsload.js');
$import('sina/utils/template.js');
$import('mojie/slideShow.js');

Evter.add('like', function(elem, event){
    Core.Events.stopEvent(event);
    elem.blur();
    var _dom = Core.Dom;
    var li = _dom.parent(elem, 'li');
    var edata = Evter.data(li);
    //var uid = scope.$uid;
    var txtlist = _dom.byClass('blog_txtlist', 'div', li);
    var txtlist0 = txtlist[0];
    if(Evter.data(txtlist0)===3){ //已经展开，需要收起层；转载1 评论2 喜欢3
        //txtlist0.style.display = 'none';
        Mojie.slideShow(txtlist0, 80, 0, 0.4);
        Evter.data(txtlist0,'');
        if(txtlist.length>1){txtlist[1].style.display=''}
        return;
    }
    
    if(elem.className.indexOf('loveon')>-1){ //已喜欢过
        getLikeList();
    }else{
        if (li.liking) {return}
        li.liking = true;
        Utils.Io.JsLoad.request('http://control.blog.sina.com.cn/admin/digg/post_digg.php', {
            GET:{
                action: '0',
                res_type: 1,
                //ti_title: '',
                //res_uid: edata.uid||'', //应该是博主id
                res_id: edata.blogid //edata.uid?edata.dig_id:edata.blogid
            },
            onComplete:function(res){
                if(res && res.code==='A00006'){
                    elem.className = 'love loveon';
                    var em = $T(elem, 'em')[0];
                    var m = em.innerHTML.match(/(\d+)/);
                    var num = m ? parseInt(m[1]) : 0;
                    em.innerHTML = '('+(num+1)+')';
                } else if ('A00800' === res.code) {
                    var msg = '对不起，您短时间点击喜欢过多，请多休息，注意身体！感谢您对新浪博客的支持和关注！';
                    winDialog.alert(msg, {
                        icon  : "01",
                        width : 400
                    });
                }
                getLikeList();
                li.liking = false;
            },
            onException: function(){
                getLikeList();
                li.liking = false;
            }
        });
    }
    
    function getLikeList(){
        Utils.Io.JsLoad.request('http://control.blog.sina.com.cn/riaapi/digg/get_digg.php', {
            GET:{
                //res_uid: uid, //应该是博主id
                res_id: edata.blogid
            },
            onComplete:function(res){
                //trace(res);
                if(res && res.data){
                    //debugger;
                    renderList(res.data);
                }
            },
            onException: function(){
                //winDialog.alert('展开内容失败，请稍候再试', {icon:'01'});
            }
        });
    }
    
    function renderList(data){
        if(!data.length)return;
        var html = '' +
            '<div class="arrow"></div>' +
            '<h6>他们喜欢此内容</h6>' +
            '<div class="piclist">' +
                //'<a href=""><img src="../../images/center/newversion/user.png" alt="" height="40" width="40"></a>' +
                Utils.template('<a href="http://blog.sina.com.cn/u/{action_uid}" title="{action_uname}" target="_blank">' 
                    +'<img src="{action_img}" alt="" height="40" width="40" /></a>', data) +
            '</div>' +
            '<div class="clearit"></div>';
        txtlist0.innerHTML = html;
        //txtlist0.style.display = '';
        Evter.data(txtlist0, 3);
        if(txtlist.length>1){txtlist[1].style.display='none'}
        Mojie.slideShow(txtlist0, 0, 80, 0.4);
    }
});
