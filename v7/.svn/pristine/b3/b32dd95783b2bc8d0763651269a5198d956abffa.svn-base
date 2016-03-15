/**
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @fileoverview 新编辑器发布博文下方的相关阅读组件
 */
// $import("sina/ui/tab/tabs.js");
// $import("editor/tools/uploadimage/UploadMain.js");

$import("lib/lazyload.js");
$import("lib/sendLog.js");

$import("sina/ui/template.js");
$import("sina/core/string/shorten.js");
$import("sina/utils/scrollLoad.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEventTarget.js");

$registJob("relatedBlogArticles", function(){

    var feedContent = $E('blog_relatefeed'),
        feedMore = $E('blog_relatefeed_more');
        feedNone = $E('blog_relatefeed_none');

    if (!feedContent) {
        return;
    };

    var feedData = [];
        getFeedOffset = 0,
        getFeedLength = 10,
        loadFeedTimes = 2; // 请求2次

    var scrollLoad;

    var timeStamp = (new Date()).getTime();

    
    // http://cre.mix.sina.com.cn/api/v3/get?cateid=6GT&rfunc=104&statics=1&merge=3&cre=blogpagepc&mod=f&this_page=1&
    //     offset=0&
    //     length=10&
    //     pageurl=http://blog.sina.com.cn/s/blog_53c3675b0102v9nq.html&
    //     callback=func

    var feedDataUrl = 'http://cre.mix.sina.com.cn/api/v3/get?cateid=6GT&rfunc=104&statics=1&merge=3&cre=blogpagepc&mod=f&this_page=1';
    var feedTemp =  '<a href="#{blogger_url}" target="_blank" class="feed_pp" onclick="v7sendLog&&v7sendLog(\'10_01_06\')"><img src="#{thumb}" class="feed_ppic" alt=""></a>'+
                    '<div class="feed_content">'+
                        '<div class="feed_t">'+
                            '<a href="#{blogger_url}" target="_blank" class="feed_name" onclick="v7sendLog&&v7sendLog(\'10_01_07\')">#{nick}</a>'+
                            '<a href="javascript:void(0);" class="addV" style="display:none;"><i class="icon i25_addV"></i></a>'+
                            '<a href="#{article_url}" target="_blank" class="feed_tit" onclick="v7sendLog&&v7sendLog(\'10_01_08\')">#{title}</a>'+
                        '</div>'+
                        '<p class="feed_digest">'+
                            '<a href="#{article_url}" target="_blank" class="feed_cont" onclick="v7sendLog&&v7sendLog(\'10_01_09\')">#{feed_content}</a>'+
                            '<a href="#{article_url}" target="_blank" class="feed_detail" onclick="v7sendLog&&v7sendLog(\'10_01_10\')">[<span>详细</span>]</a>'+
                            '<a href="javascript:void(0);" class="feed_imgcount" style="display:none;"><span class="feed_icon"></span>0张图</a>'+
                        '</p>'+
                        '#{imgs}'+
                        '<span href="javascript:void(0);" class="feed_meta">#{ctime}</span>'+
                    '</div>';

    // console.info('load feed start')
    v7sendLog && v7sendLog('10_01_12');
    loadFeedData();

    function loadFeedData(){
        loadFeedTimes--;
        var getFeedDataParam = {
            'offset': 0,
            'length': 50,
            'pageurl': encodeURIComponent(location.href)
        }
        feedMore.style.display = '';
        Utils.Io.JsLoad.request(feedDataUrl, {
            GET: getFeedDataParam,

            charset: "utf-8",

            returnType: 'jsonp',

            timeout: 3000,

            noencode: true,
            
            onComplete: function(result){
                // console.info('load feed data complete');
                if (feedData && feedData.length === 0){
                    feedData = result.data;
                }
                renderFeedData();
                if (!scrollLoad) {
                    scrollLoad = Utils.scrollLoad.init({
                        pixelFromBottom: 400,
                        maxLoadTime: 4,
                        action: function(scrollLoadObj){
                            v7sendLog && v7sendLog('10_01_12');
                            renderFeedData(scrollLoadObj);
                        }
                    });
                }
            },

            onException: function(){
                v7sendLog && v7sendLog('10_01_13');
                if (loadFeedTimes){ // 失败的情况下最多再多请求1次
                    loadFeedData();
                }else{
                    feedMore.style.display = 'none';
                    feedNone.style.display = '';
                }
            }
        });

    }

    function renderFeedData(scrollLoadObj){
        
        var tempData, tempLi,
            oFragment = document.createDocumentFragment();
            template = new Ui.Template(feedTemp);
        var len = ((getFeedOffset+getFeedLength) < feedData.length ) ? (getFeedOffset+getFeedLength) : feedData.length,
            start = getFeedOffset;
        // console.info("start:",start);
        // console.info("len:",len);
        for (var i = start; i < len; i++) {
            tempData = {};
            tempData.blogger_url = feedData[i].bloggerUrl;
            tempData.article_url = feedData[i].url;
            tempData.feed_content = feedData[i].intro;
            tempData.thumb = renderThumb(feedData[i].uid);
            tempData.nick = renderNick(feedData[i].nick);
            tempData.title = shortenContent(feedData[i].title, 50);
            tempData.ctime = renderDate(feedData[i].ctime);
            tempData.imgs = renderImgs(feedData[i].thumbs, feedData[i].url);

            tempLi = $C('li');
            if (i == 1 || i == 3){
                tempLi.id = 'related_article_'+i;
            }
            tempLi.innerHTML = template.evaluate(tempData);
            oFragment.appendChild(tempLi);
        }

        feedContent.appendChild(oFragment);
        feedContent.style.display = '';
        
        // 第一屏数据已显示，加载广告数据
        if (getFeedOffset === 0){
            loadAdData();
        }
        if (len === feedData.length){// 数组里面没有数据了，最后一次加载数据了
            // console.log('end');
            feedMore.style.display = 'none';
            feedNone.style.display = 'none';
        }else{// 否则继续滚动加载内容
            getFeedOffset += getFeedLength;
            // console.log('startMonitoring')
            if (scrollLoadObj && !scrollLoadObj.isReachMaxTime){
                scrollLoadObj.startMonitoring();
            }
        }
    }

    function renderNick(nick){
        return Core.String.shorten(nick, 10);
    }

    function renderThumb(uid){
        return 'http://portrait'+ (+uid%8+1) +'.sinaimg.cn/'+uid+'/blog/50';
    }

    function renderDate(ctime){
        // 2012-12-28 14:09:11
        var date = new Date(ctime*1000);
            y = date.getFullYear(),
            m = date.getMonth()+1,
            d = date.getDate(),
            hh = date.getHours(),
            mm = date.getMinutes(),
            ss = date.getSeconds();

        m = (m>9) ? m : ('0'+m);
        d = (d>9) ? d : ('0'+d);
        hh = (hh>9) ? hh : ('0'+hh);
        mm = (mm>9) ? mm : ('0'+mm);
        ss = (ss>9) ? ss : ('0'+ss);

        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss;
    }

    function renderImgs(thumbs, url){
        if (!thumbs){
            return '';
        }
        var html = '<div class="feed_img">',
            src, cls = 'feed_img_a',
            temp = '';
        // '<div class="feed_img">'+
        //     // '<a href="javascript:void(0);" class="feed_img_a"><img src="../../images/blog_editor/_temp/pic323x190.jpg" alt=""></a>'+
        //     // '<a href="javascript:void(0);" class="feed_img_a"><img src="../../images/blog_editor/_temp/pic323x190.jpg" alt=""></a>'+
        //     // '<a href="javascript:void(0);" class="feed_img_a feed_img_last"><img src="../../images/blog_editor/_temp/pic323x190.jpg" alt=""></a>'+
        // '</div>'+
        var len = (thumbs.length>=3) ? 3 : thumbs.length;
        for (var i=0; i < len; i++) {
            src = 'http://s.img.mix.sina.com.cn/auto/resize?img='+thumbs[i]+'&size=0_143';
            if (i === (thumbs.length-1)){
                cls += ' feed_img_last';
            }
            temp = '<a href="'+url+'" class="'+cls+'" target="_blank" onclick="v7sendLog&&v7sendLog(\'10_01_11\')"><img src="'+src+'" alt=""></a>';
            html += temp;
        }
        html += '</div>';
        return html;
    }

    function renderAdImgs(img, images, url){
        
        var thumbs = img ? [img] : images;
        if (!thumbs){
            return '';
        }
        var html = '<div class="feed_img">',
            src, cls = 'feed_img_a',
            temp = '';
        // '<div class="feed_img">'+
        //     // '<a href="javascript:void(0);" class="feed_img_a"><img src="../../images/blog_editor/_temp/pic323x190.jpg" alt=""></a>'+
        //     // '<a href="javascript:void(0);" class="feed_img_a"><img src="../../images/blog_editor/_temp/pic323x190.jpg" alt=""></a>'+
        //     // '<a href="javascript:void(0);" class="feed_img_a feed_img_last"><img src="../../images/blog_editor/_temp/pic323x190.jpg" alt=""></a>'+
        // '</div>'+
        var len = (thumbs.length>=3) ? 3 : thumbs.length;
        for (var i=0; i < len; i++) {
            src = thumbs[i].u;
            if (i === (thumbs.length-1)){
                cls += ' feed_img_last';
            }
            temp = '<a href="'+url+'" class="'+cls+'" target="_blank"><img src="'+src+'" alt=""></a>';
            html += temp;
        }
        html += '</div>';
        return html;
    }

    function shortenContent(cnt, num){
        return Core.String.shorten(cnt, num);
    }


    // http://sax.sina.com.cn/native/impress
    //     adunit_id   广告位ID，多个用,分隔
    //     timestamp   时间戳，网站页面的打开时间，用于广告去重
    //     page_url    页面URL
    //     callback    JSONP回调函数

    var adDataUrl = 'http://sax.sina.com.cn/native/impress';
    var adTemp = '<div class="feed_content feed_ad">'+
                    '<div class="feed_t">'+
                        '<a href="#{article_url}" target="_blank" class="feed_tit feed_ad_tit">#{title}</a>'+
                    '</div>'+
                    '<p class="feed_digest">'+
                        '<a href="#{article_url}" target="_blank" class="feed_cont">#{feed_content}</a>'+
                        '<a href="#{article_url}" target="_blank" class="feed_detail"><span>[详细</span>]</a>'+
                        '<a data="#{count_weibo_url}" href="#{weibo_url}" target="_blank" class="feed_imgcount"><span class="feed_icon feed_ad_icon"></span><span class="feed_ad_client">@#{nick}</span></a>'+
                    '</p>'+
                    '#{imgs}'+
                    '<div class="feed_ad_bottom">'+
                        '<a href="javascript:void(0);" class="feed_meta">#{ctime}</a>'+
                        '<a data="#{count_zurl}" href="#{zurl}" target="_blank" class="zanzhu">赞助</a>'+
                    '</div>'+
                '</div>';
    
    function loadAdData(){
        var id = $_GLOBAL.relatedArticlesAdCode || 'CSFEEDPC';
        var getAdDataUrlParam = {
                adunit_id: id,
                timestamp: timeStamp,
                page_url: encodeURIComponent(location.href)
            }

        Utils.Io.JsLoad.request(adDataUrl, {
            GET: getAdDataUrlParam,

            charset: "utf-8",

            returnType: "jsonp",

            timeout: "1000",

            noencode: true,

            onComplete: function(result){
                renderAdData(result);
            },

            onException: function(result){

            }
        });
    }

    function renderAdData(result){
        if (!result && !result.length) {
            return;
        }
        
        var posOneNode = $E('related_article_1'), 
            posTwoNode = $E('related_article_3');

        var tempData, tempLi,
            template = new Ui.Template(adTemp);

        for (var i = 0; i < result.length; i++) {
            tempData = {};
            tempData.article_url = result[i].url;
            tempData.feed_content = shortenContent(result[i].intro, 160);
            tempData.zurl = result[i].zurl;
            tempData.count_zurl = result[i].namonitor.zurl;
            tempData.weibo_url = result[i].weibourl;
            tempData.count_weibo_url = result[i].namonitor.weibourl;

            tempData.nick = renderNick(result[i].weiboname);
            tempData.title = shortenContent(result[i].title, 60);
            tempData.ctime = renderDate(result[i].ctime);
            tempData.imgs = renderAdImgs(result[i].img, result[i].images, result[i].url);

            tempLi = $C('li');
            tempLi.innerHTML = template.evaluate(tempData);
            if (i == 0){
                exposureStatistic(result[i].pvmonitor);
                posOneNode.parentNode.insertBefore(tempLi, posOneNode);
            }else if (i == 1){
                exposureStatistic(result[i].pvmonitor);
                posTwoNode.parentNode.insertBefore(tempLi, posTwoNode);
            }else {
                return;
            }         
        }

        Core.Events.addEvent(feedContent, function(e){
            var tar = Core.Events.getEventTarget(e);
            if (tar.tagName.toLowerCase() == 'a' || tar.parentNode.tagName.toLowerCase() == 'a'){
                // console.log('点击')
                var url = '';
                if (url = tar.getAttribute('data') || tar.parentNode.getAttribute('data')){
                    sendStatistic(url);
                }
            }
        });
    }

    function exposureStatistic(pvmonitor){// 广告曝光统计
        for (var i = pvmonitor.length - 1; i >= 0; i--) {
            // console.log('曝光')
            sendStatistic(pvmonitor[i]);
        }
    }

    function sendStatistic(url){
        if (url){
            var img = new Image();
            img.src = url + '&rnd=' + (new Date()).getTime();
        }
    }

});
