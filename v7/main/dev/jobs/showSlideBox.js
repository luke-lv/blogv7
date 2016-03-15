$import("lib/util/getActionData.js");
$import("lib/sendSuda.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopDefaultEvent.js");
$import("article/multipleImgLayer.js");
$import("lib/diYuanXinLog.js");
/**
 * @fileoverview 博客文章详情页显示幻灯片按钮
 *
 * @author Qiangyee | wangqiang1@staff
 * @create 2012-08-20
 * 
 */
$registJob("showSlideBox", function(sandBox){
    var __getActionData = Lib.util.getActionData
        , __addEvent = Core.Events.addEvent
        , regex = /([^\/]+)$/;

    // 显示幻灯片
    var showSlideBox = function(imgUrls, blogLinkEl, title, isLiked, articleid, publishTime){
        Lib.sendSuda(function () {
            try{
                //2013.4.12 suda代码修改
                //S_pSt()函数不再使用, 如果需要统计动态加载等调用SUDA.log()
                SUDA.log("","blog_slide_page"); 
            }catch(e){
            }
        });
        Lib.diYuanXinLog(function () {
            try{
                vjEventTrack(""); 
            }catch(e){
            }        
        }); 

        var layer = new Article.MultipleImgLayer();
        layer.show(imgUrls, blogLinkEl, title, isLiked, articleid, publishTime);
    }
    // 判断图片是否为表情
    var isFacePic = function (src){
        if (-1 !== src.indexOf("sinaimg.cn/uc/myshow")) {
            return true;
        }
        if (-1 !== src.indexOf("img.t.sinajs.cn")) {
            return true;
        }
        if (-1 !== src.indexOf("simg.sinajs.cn")) {
            return true;
        }
        if (-1 !== src.indexOf("sinaimg.cn/small")) {
            return true;
        }
        if (-1 !== src.indexOf("sinaimg.cn/square")) {
            return true;
        }
        return false;
    }
    // 转换图片对象，改为json格式
    var getImgObj = function(src, currentHref, picName){

        var isBlank = src === currentHref,
            obj = null;
        var isFace = isFacePic(src);

        if (-1 === src.indexOf("\/blog7style") && -1 === src.indexOf("sg_trans.gif") && !isBlank && !isFace){
            obj = { 
                url    : src,
                loaded : 0,
                click  : (picName === src.match(regex)[1].replace(/\&amp;690/,'&690'))
            };
        }

        return obj;
    }

    __addEvent(document.body, function(e){

        var datas = __getActionData(e, "show-slide");
        if (!datas) {
            return;
        }
        Core.Events.stopDefaultEvent(e);
        var articleid = scope.$articleid
            , currentHref = location.protocol+"//"+location.host+location.pathname
            , imgUrls = []
            , realSrc
            , src
            , img
            , blogLinkEl
            , title
            , isLiked
            , articleid
            , publishTime
            , picName
            , pageId = scope.$pageid;
        
        if (typeof SUDA != 'undefined') {
            SUDA.uaTrack('blog_article', 'h_article19');
        }
        if ('article' === pageId || 'articleM' === pageId || 'article_new' == pageId ||'articleM_new' == pageId ){
            var likeEl = $E("dbox_" + articleid);

            var blogLinkEl = location.href;

            var titleEl = $E("t_" + articleid),
                title   = titleEl.innerText || titleEl.textContent;

            var isLiked = (/\bupBox_dis\b/.test(likeEl.className));

            //图片所在栏目
            var wrap = $E('sina_keyword_ad_area2');
            var imgs = $T(wrap, "img");
            
            var clickPicSrc = decodeURIComponent(datas.data);

            picName = clickPicSrc.match(regex)[1];


            for (i = 0, l = imgs.length; i < l ; i++){
                img = imgs[i];
                realSrc = img.getAttribute("real_src");
                src = img.getAttribute("src");
                
                var isLoaded = realSrc === src;
                if (isLoaded) {
                    var badWidth = img.width > 1 && img.width < 200;
                    var badHeight = img.height > 1 && img.height < 200;
                    if (badWidth && badHeight) {
                        continue;
                    }
                };
                src = realSrc || src;
                var obj = getImgObj(src, currentHref, picName);
                if (obj){
                    imgUrls.push(obj);
                }
            }

            var spanEls = $T(document.body, "span"),
                timeEl,
                publishTime = scope.$publishTime;
            // 为缓存做兼容
            if (!publishTime) {
                for (var i = spanEls.length - 1; i >= 0; i--) {
                    timeEl = spanEls[i];
                    if ("time SG_txtc" === timeEl.className){
                        publishTime = timeEl.innerText || timeEl.textContent;
                        break;
                    }
                }
                publishTime = publishTime.replace("(", "").replace(")", "");
            }
            showSlideBox(imgUrls, blogLinkEl, title, isLiked, scope.$articleid, publishTime);

        } else {

            var params = datas.data.split('&');
            var src       = decodeURIComponent(params[0])
                , blogId  = decodeURIComponent(params[1])
                , link    = decodeURIComponent(params[2])
                , title   = decodeURIComponent(params[3])
                , publishTime = decodeURIComponent(params[4]);

            Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/riaapi/article/getArticlePic.php?rnd="+Math.random(),{
                GET : {
                    blog_id : blogId,
                    blog_pubdate : publishTime,
                    uid    : $UID || ""
                },
                onComplete : function(result) {
                    if ('A00006' === result.code){
                        var data = result.data;
                        var imgs = data.images;

                        picName = src.match(regex)[1];

                        for (i = 0, l = imgs.length; i < l ; i++){
                            src = imgs[i];
                            var obj = getImgObj(src, currentHref, picName);
                            if (obj){
                                imgUrls.push(obj);
                            }
                        }
                        showSlideBox(imgUrls, link, title, data.isLiked, blogId, data.publishTime);
                    }
                    
                },
                onException: function() {
                }
            });
        }
        


    });

});
