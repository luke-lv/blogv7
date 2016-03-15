$import("sina/sina.js");
$import("lib/jobs.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/url.js");
$import("lib/checkAuthor.js");
$registJob("dashang", function() {
    function getPic(uid, type) {
        uid = parseInt(uid, 10) || 0;
        type = type || 180;
        if (uid) {
            return [
                'http://portrait', (uid % 8 + 1),
                '.sinaimg.cn/',
                uid,
                '/blog/',
                type
            ].join('');
        } else {
            return '';
        }
    }
    
    var dashang = $E("dashang");
    if(!dashang) {
        return;
    }
    Lib.checkAuthor();
    if (!$UID || $UID == scope.$uid) {
        return;
    }
    //取title
    var title = '';
    try {
        var titledom = Core.Dom.byClz(document.body, 'h2', 'titName')[0] || Core.Dom.byClz(document.body, 'h1', 'h1_tit')[0] || Core.Dom.byClz(document.body, 'h1', 'h1_tit')[0];
        if(!titledom)  {
            var _titfather = Core.Dom.byClz(document.body, 'div', 'atcbox')[0]; //tjtech

            if(_titfather && _titfather.id == 'module_3001_SG_connBody') {
                titledom = _titfather.getElementsByTagName('h1')[0];
            }
        }   
        
        title = titledom && titledom.innerText || titledom.textContent;
    } catch (e) {}

    var pic = getPic(scope.$uid);
    var opts = {
        seller: scope.$uid,
        params: {
            seller: scope.$uid,
            buyer: $UID,
            bid: 1000270845,
            oid: scope.$articleid,
            display: 'costum',
            dis_title: title || '',
            dis_desc: scope.$summary,
            dis_pic: pic
        },
        queryUrl: 'http://control.blog.sina.com.cn/riaapi/reward.php'
    };
    var url = new Utils.Url(opts.queryUrl);
    url.setParams(opts.params);
    Utils.Io.JsLoad.request(url.toString(), {
        onComplete: function() {
            if (window.requestId_70718459 && window.requestId_70718459.data && parseInt(window.requestId_70718459.data.enable) === 1) {
                renderIframe(window.requestId_70718459.data);
            }
        },
        noreturn: true,
        isRemove: false
    });



    function renderIframe(data) {
        var iframe = document.createElement('iframe');
        iframe.src = data.url;
        iframe.setAttribute('frameborder', 'no', 0);
        iframe.setAttribute('scrolling', 'no', 0);
        iframe.setAttribute('border', '0', 0);
        //params = {
        //    seller : scope.$uid,
        //    buyer : $UID,
        //    bid : 1000270845,
        //    oid : scope.$articleid,
        //    sign : data.sign
        //};

        //var url = new Utils.Url(url);
        //url.setParams(params);
        //url = url.toString();
        //iframe.src = url;
        //window.setTimeout(function(){
        //    console.clear();
        //    console.info(url);
        //},8000);
         
        iframe.style.cssText = 'height:150px;border:0;margin:0;padding:0;overflow:hidden;z-index:332';
        if (window.scope && window.scope.$pageid == 'articletj' ||   window.scope.$pageid == 'article_new' || window.scope.$pageid == 'articleM_new') {
            iframe.style.cssText += ';width:100%;';
        } else {
            dashang.style.cssText += ';overflow:hidden;position:relative;z-index:333';
            //iframe.style.cssText += ';width:630px;margin-left:-35px'
        }
        if (dashang) {
            dashang.appendChild(iframe);
        }
    }
});
