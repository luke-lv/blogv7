 /*
 * @fileoverview 樱花页面feed加载及切换
 * @author gaolei | gaolei2@
 * @date   2015-3-9
 */
$import("lib/jobs.js");
$import("sina/core/string/shorten.js");
$import("sina/ui/template.js");
$import("comps/idTabs.js");

$registJob('articleFeed', function(){
    var time1 = (new Date()).getTime();
    var dataObj = {
        'hot': [],
        'tokyo': [],
        'kyoto': [],
        'hokkaido': [],
        'okinawa': [],
        'osaka': [],
        'hakone': [],
        'nara': [],
        'nagoya': []
    };
    var lastTabId = 'hot';

    // 请求Feed
    $.ajax({
        url: 'http://cre.mix.sina.com.cn/blog/tour/cherry',
        data: {
            offset: 0,
            length: 500
        },
        success: renderData,
        dataType: 'jsonp'
    });

    // 增加经典切换
    $("#feedContainer ul").idTabs({
        start: 0,
        selected:"cur",
        click: function (id, arr, container){
            $('.blog_feed_more').show();
            // console.log('click',id,arr,container,arguments[3])
            renderTemplate(dataObj, id.replace('#',''));
            changeAsides(id.replace('#', ''));
            return true;
        }
    });

    var feedTemp =  '<li tags="#{tags}"><a href="#{blogger_url}" target="_blank" class="feed_pp" onclick="v7sendLog&&v7sendLog(\'10_01_20\')"><img src="#{thumb}" class="feed_ppic" alt=""></a>'+
                '<div class="feed_content">'+
                    '<div class="feed_t">'+
                        '<a href="#{blogger_url}" target="_blank" class="feed_name" onclick="v7sendLog&&v7sendLog(\'10_01_21\')">#{nick}</a>'+
                        '<a href="javascript:void(0);" class="addV" style="display:none;"><i class="icon i25_addV"></i></a>'+
                        '<a href="#{article_url}" target="_blank" class="feed_tit" onclick="v7sendLog&&v7sendLog(\'10_01_22\')">#{title}</a>'+
                    '</div>'+
                    '<p class="feed_digest">'+
                        '<a href="#{article_url}" target="_blank" class="feed_cont" onclick="v7sendLog&&v7sendLog(\'10_01_23\')">#{feed_content}</a>'+
                        '<a href="#{article_url}" target="_blank" class="feed_detail" onclick="v7sendLog&&v7sendLog(\'10_01_24\')">[<span>详细</span>]</a>'+
                        '<a href="javascript:void(0);" class="feed_imgcount" style="display:none;" onclick="v7sendLog&&v7sendLog(\'10_01_25\')"><span class="feed_icon"></span>0张图</a>'+
                    '</p>'+
                    '#{imgs}'+
                    '<a href="javascript:void(0);" class="feed_meta">#{ctime}</a>'+
                '</div></li>';

    function renderData (res) {
        // console.log('renderData:', res);

        var data = res.result.data, tags, tempData, hotCount = 0, urlObj = {}, url, rnd;
        if (data.length == 0){ // 如果没有数据，退出
            $('.blog_feed_none').show();
            $('.blog_feed_more').hide();
            return;
        }

        for (var i=0; i<data.length; i++){
            
            tempData = {};
            tempData.blogger_url = data[i].bloggerUrl;
            tempData.article_url = data[i].url;
            tempData.feed_content = data[i].intro;
            tempData.thumb = renderThumb(data[i].uid);
            tempData.nick = renderNick(data[i].nick);
            tempData.title = shortenContent(data[i].title, 50);
            tempData.ctime = renderDate(data[i].ctime);
            tempData.imgs = renderImgs(data[i].thumbs, data[i].url);
            tempData.tags = data[i].tags;

            tags = data[i].tags && data[i].tags.split(' ');
            
            for (var j = tags.length - 1; j >= 0; j--) {
                switch (tags[j]){
                    case '东京': dataObj.tokyo.push(tempData); break;
                    case '京都': dataObj.kyoto.push(tempData);    break;
                    case '北海道': dataObj.hokkaido.push(tempData); break;
                    case '冲绳': dataObj.okinawa.push(tempData);  break;
                    case '大阪': dataObj.osaka.push(tempData);    break;
                    case '箱根': dataObj.hakone.push(tempData);   break;
                    case '奈良': dataObj.nara.push(tempData);     break;
                    case '名古屋': dataObj.nagoya.push(tempData);  break;
                    default: break;
                }
            }
            url = tempData.blogger_url;
            rnd = Math.floor(Math.random()*data.length);
            if (hotCount < 50){
                if (rnd < Math.ceil(data.length/2)){
                    if (!urlObj[url]){// 没有被添加过的文章
                        dataObj.hot.push(tempData);  // 加到热门分类中
                        urlObj[url] = 1;
                        hotCount++;
                    }
                }
            }
        }

        // var tempArr = ['tokyo', 'kyoto', 'hokkaido', 'okinawa', 'osaka', 'hakone', 'nara'];
        // var urlObj = {}, index = 0;
        // while(index < 50){
            // var rndType = Math.floor(Math.random()*tempArr.length);         // 随机选择一个类型
            // var rndIdx = Math.floor(Math.random()*tempArr[rndType].length); // 随机选择某一类型的文章
            // var tempObj = dataObj[tempArr[rndType]][rndIdx];
            // var url = tempObj.blogger_url;
            // if (!urlObj[url]){// 没有被添加过的文章
            //     dataObj.hot.push(tempObj);  // 加到热门分类中
            //     urlObj[url] = 1;
            //     index++;
            // }
        //     var rnd = Math.floor(Math.random()*data.length);
        //     var url = data[rnd].bloggerUrl;
        //     console.log('loop')
        //     if (!urlObj[url]){
        //         tempData = {};
        //         tempData.blogger_url = data[rnd].bloggerUrl;
        //         tempData.article_url = data[rnd].url;
        //         tempData.feed_content = data[rnd].intro;
        //         tempData.thumb = renderThumb(data[rnd].uid);
        //         tempData.nick = renderNick(data[rnd].nick);
        //         tempData.title = shortenContent(data[rnd].title, 50);
        //         tempData.ctime = renderDate(data[rnd].ctime);
        //         tempData.imgs = renderImgs(data[rnd].thumbs, data[rnd].url);
        //         tempData.tags = data[rnd].tags;

        //         dataObj.hot.push(tempData);
        //         urlObj[url] = 1;
        //         index++;
        //     }
        // }
        // var time2 = (new Date()).getTime();
        // console.log('render time:', time2 - time1);
        renderTemplate(dataObj, 'hot');
    }

    function renderTemplate (dataObj, id) {
        // console.log('renderTemplate:', dataObj);
        if (dataObj.hot.length === 0){// 如果数据是空的，暂时不加载，因为tab标签会首先默认执行click回调函数
            return;
        }
        $('.blog_feed_more').hide();
        if ($('#'+id).attr('isrendered') == '1'){
            // console.log('isrendered');
            return;
        }        
        var template = new Ui.Template(feedTemp), html;
        html = template.evaluateMulti(dataObj[id]);
        // console.log(dataObj[id])
        // console.log(html)
        $('#'+id).html(html);
        $('#'+id).attr('isrendered', '1');
        // var time3 = (new Date()).getTime();
        // console.log('render template:', time3 - time1)
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
            temp = '<a href="'+url+'" class="'+cls+'" target="_blank" onclick="v7sendLog&&v7sendLog(\'10_01_26\')"><img src="'+src+'" alt=""></a>';
            html += temp;
        }
        html += '</div>';
        return html;
    }

    function shortenContent(cnt, num){
        return Core.String.shorten(cnt, num);
    }

    function changeAsides (id) {
        $('#'+lastTabId+'_hotels').hide();
        $('#'+lastTabId+'_views').hide();
        $('#'+lastTabId+'_foods').hide();

        if ($('#'+id+'_hotels li').length != 0){
            $('#'+id+'_hotels').show();
        }
        if ($('#'+id+'_views li').length != 0){
            $('#'+id+'_views').show();
        }
        if ($('#'+id+'_foods li').length != 0){
            $('#'+id+'_foods').show();
        }

        lastTabId = id;
    }

});