/** 
 * @fileoverview 展开博文
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-14
 */
$import('sina/Evter.js');
$import('sina/utils/io/jsload.js');
$import('sina/core/dom/parent.js');
$import('sina/core/dom/byClass.js');
$import('sina/core/dom/createElement.js');
$import("sina/utils/flash/swfObject.js");
$import('mojie/checkImageSize.js');
$import('lib/commonLog.js');
$import("lib/sendSuda.js");

Evter.add('openBlog', function(elem, event){
    //ie6下不阻止默认事件，会无法展开多图
    Core.Events.stopEvent(event);
    var _dom = Core.Dom, _byClass = _dom.byClass;
    var li = _dom.parent(elem, 'li');
    var edata = Evter.data(li);
    if(edata&&edata.type){
        var feedTexts = _byClass('feedText', 'div', li);
        if (edata.type === 5) {
            showMusic(feedTexts[0].children);
            return;
        }
        feedTexts[0].style.display = 'none'; //small
        feedTexts[1].style.display = ''; //big
        if(edata.type===4){
            playVideo(feedTexts[1]);
        }
        return;
    }

    if (li.opening) {return}
    li.opening = true;
    
    var btnHtml = '<a class="btn_ico btn_sq" e-name="closeBlog" href="javascript:;">' +
            '<img e-name="b" width="49" height="20" align="absmiddle" title="收起" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"></a>' +
        (edata.dig_id?'':'<a class="btn_ico btn_alltxt" href="'+(edata.bhref||'javascript:;')+'" target="_blank">' +
            '<img width="64" height="20" align="absmiddle" title="阅读全文" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"></a>');// +
        //'<div class="clearit"></div>';

    /*suda布玛统计*/
    Lib.sendSuda(function(){
        try{
            //2013.4.12 suda代码修改
            //S_pSt()函数不再使用, 如果需要统计动态加载等调用SUDA.log()
           SUDA.log("","getfeedarticle");
        }catch(e){
        }
    });
    Utils.Io.JsLoad.request('http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/feed/getFeedArticle.php', {
        GET:{
            blog_id: edata.blogid
        },
        onComplete:function(res){
            //trace(res);
            if(res && res.data){
                dataCenter(res.data);
            }
            li.opening = false;
        },
        onException: function(){
            winDialog.alert('展开内容失败，请稍候再试', {icon:'01'});
            li.opening = false;
        }
    });

    //针对博文类型增加浏览计数
    edata.bhref.indexOf('/s/')>0&&commonLog('http://comet.blog.sina.com.cn/api?maintype=hits&act=4&ref=http%3A%2F%2Fi.blog.sina.com.cn&aid='+edata.blogid);
    
    function dataCenter(data){
        var type = parseInt(data.type)||-1;
        if(type<2||type>5)return;
        //Evter.data(li, "{blogid:'"+edata.blogid+"',type:"+type+"}");
        Evter.data(li, {type:type});
        var html = '';
        switch(type){
            case 3: html=data.body+btnHtml; break; //博文 blog(data)
            case 2: html=photo(data); break; //图片
            case 4: html=video(data); break; //视频
            //case 5: html=music(data); break; //音乐 单独处理
        }
        
        var small = _byClass('feedText', 'div', li)[0];
        if(type===5){
            openMusic(small.children, data); //音乐 单独处理
            return;
        }
        var big = _dom.createElement('<div class="feedText"></div>');
        big.innerHTML = html;
        small.style.display = 'none';
        small.parentNode.insertBefore(big, small.nextSibling);
        
        if(type===3){
            big.onclick = function(event){
                event =event || window.event;
                var t = event.srcElement || event.target;
                if(t.nodeName.toUpperCase()==='IMG' && t.className === "imgZoomOut"){
                    Evter.fire('closeBlog', li);
                }
            };
            if($IE6){
                Mojie.checkImageSize(_byClass('imgZoomOut', 'img', big), function(el){
                    if(el.width>588){
                        el.oriImg.width = 588;
                    }
                    el = null;
                });
            }
        }else if(type===4){
            playVideo(big);
        }
    }
    
    function photo(data){
        var html = '', datai;
        for(var i=0,len=data.body.length; i<len; i++){
            datai = data.body[i];
            html += '<p class="feedPic_b"><img src="'+datai.article_pic+'" e-name="closeBlog" class="imgZoomOut" /></p>'+datai.description; //+'<br/>';
        }
        return html + data.descrp + btnHtml;
    }
    
    function video(data){
        var html = '' +
            '<div class="feedPic_video" e-data="\''+data.swf_url.replace(/[<>'"]/g,'')+'\'">正在打开视频...</div>' + //XSS直接过滤<>"
            //<img width="500" height="365" src="http://simg.sinajs.cn/blog7style/images/center/newversion/video.jpg">
            '<div class="feedPic_text"><p>'+data.body.replace(/<p>/ig,'').replace(/<\/p>/ig,'')+btnHtml+'</p></div>' +
            '<div class="clearit"></div>';
            
        return html;
    }
    //音乐
//    function music(data){
//        //var musicbtn = _byClass('btn_music', 'div', li)[0];
//        var albumSrc = _byClass('musicAlbum', 'img', li)[0].src||'';
//        var html = '' +
//            '<div class="feedPic_b"><img class="imgZoomOut" width="420" src="'+albumSrc.replace('_150150', '_420420')+'" alt="" e-name="closeBlog" /></div>' +
//            //'<div class="btn_music">'+musicbtn.innerHTML+'</div>' +
//            '<div class="btn_music"></div>' +
//            '<div class="feedPic_text"><p>'+data.body.replace(/<p.*?>/ig,'').replace(/<\/p>/ig,'')+btnHtml+'</p></div>' +
//            '<div class="clearit"></div>';
//        
//        return html;
//    }
//    //移动音乐播放器
//    function moveMusicBtn(lili){
//        var btns = _byClass('btn_music', 'div', lili);
//        btns[1].appendChild(btns[0].children[0]);
//        btns[1].style.zoom = 1;
//    }
    function openMusic(feedTextCdr, data){
        feedTextCdr[1].innerHTML = '<img class="imgZoomOut" width="420" src="' +
            (feedTextCdr[0].children[0].src||'').replace('_150150', '_420420')+'" alt="" e-name="closeBlog" />';
        feedTextCdr[3].innerHTML = '<p>'+data.body.replace(/<p.*?>/ig,'').replace(/<\/p>/ig,'')+btnHtml+'</p>';
        showMusic(feedTextCdr);
    }
    function showMusic(feedTextCdr){
        feedTextCdr[0].style.display = 'none';
        feedTextCdr[4].style.display = 'none';
        feedTextCdr[1].style.display = '';
        feedTextCdr[3].style.display = '';
    }
    
    //播放视频
    function playVideo(big){
        var videobox = _byClass('feedPic_video','div',big)[0];
        var url = Evter.data(videobox);
        var player = new Utils.Flash.swfObject(url, 'video', 500, 365, '9', '#00ff00');
        player.addParam('quality','high');
        player.addParam('wmode','transparent');
        player.addParam('allowScriptAccess','never');
        //新浪播客、优酷网、土豆网、酷6网、56网
        //autoPlay=1 新浪视频
        //isAutoPlay=true 优酷网
        //autoPlay=true 土豆网
        //auto=1    酷6网
        player.addParam('flashvars','isAutoPlay=true&auto=1&autoPlay='+(url.indexOf('sina.com.cn')>-1?'1':'true'));
        player.write(videobox);
    }
});
