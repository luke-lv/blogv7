/** 
 * @fileoverview 页码
 * @author Book | liming9@staff.sina.com.cn
 * @date 2012-08-11
 */
$import("lib/jobs.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("lib/sendSuda.js");
$import("sina/core/events/addEvent.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");
$import('sina/core/dom/byClass.js');

$import('mojie/loadImgCallback.js');
$import('mojie/checkImageSize.js');

$registJob('pages', function(){
    
    //modified by Luo Rui allView,classView,feedClassView三个接口统一为一个接口,保留原有接口兼容客户端缓存。
    //var _feedtj = '';

    scope.feedView = function(_class, _type, _page, isPageNumber){
        /*suda布玛统计*/
        Lib.sendSuda(function(){
            try{
                //2013.4.12 suda代码修改
                //S_pSt()函数不再使用, 如果需要统计动态加载等调用SUDA.log()
               SUDA.log("","blog_iblogfeed_page");
            }catch(e){
            }
        });
        /*判断登陆状态*/
        Lib.checkAuthor();
        if(!$isAdmin){
            new Lib.Login.Ui().login(function(){
                location.reload();
            });
            return;
        }
        //全新的接口
        new Interface('http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/feed/getFeedByPage.php', 'jsload').request({
            GET: {
                tj: $E('tj').value,
                'class': _class||'0', //jsload传不了数字0...
                'type': _type||'0',
                page: _page
            },
            onSuccess:function(data){
                //trace(data);
                var feedwrap = $E('feedWrap');
                //html 数据。并修正后端返回的没有带引号的参数。
                //$E("feed_center_span").innerHTML = data.html.replace(/v7sendLog\(([\d_]+),/g, 'v7sendLog(\'$1\',');
                feedwrap.innerHTML = data.html;
                //修正IE6下，渲染出现错位的情况。IE6比日和漫画更有创造力！
                feedwrap.style.zoom = 1;
                if (isPageNumber) {
                    //如果是通过分页器触发。。。
                    feedwrap.parentNode.parentNode.scrollIntoView(true);
                }
                // console.log(data.pager);
                $E('pagerWrap').innerHTML = data.pager||'';
                
                $E('tj').value = data.tj || '';
                if(_page===1){
                    $E('lastTime').value = data.lastTime;
                    Evter.free($E('newFeedTips'), 'getNewFeed');
                    $E('newFeedTips').style.display = 'none';
                    $E('guanbofeedout').style.marginBottom = '21px';
                }
                
                //检查feed图片宽度
                Mojie.checkImageSize(Core.Dom.byClass('for_check_size', 'img', feedwrap), Mojie.loadImgCallback);
                //设置视频icon居中
                Evter.fire('videoIconHeight');
            },
            onError:function(res) {
                showError(res.code);
            }
        });
    };
    
});
