/**
 * @fileoverview 博客365博文详情页——分享按钮
 * @author gaolei | gaolei2@
 * @date 2012-11-12
 */

$import("lib/jobs.js");

$registJob("blog365share",function(){
	
	var _p_share_title ="博客365活动";
    var _p_share_pic = "http://www.sinaimg.cn/blog/qing/image/jiahui/365/500_336.jpg";
    var _p_share_url = "http://t.cn/zjMUpUO";
    var _p_share_text = "新浪博客（blog.sina.com.cn）活动#365#每天一篇博文，用心写出时光的精彩开始喽！每天发一篇图片博文，记录生活的点滴，让我们从这一刻开始，一起把这些时间定格，定格成生命中永远不会忘记的故事！ 活动地址 http://t.cn/zjMUpUO（分享自 @Qing官方活动）";
    var _p_share_textWeibo = "新浪博客（blog.sina.com.cn）活动#365#每天一篇博文，用心写出时光的精彩开始喽！每天发一篇图片博文，记录生活的点滴，让我们从这一刻开始，一起把这些时间定格，定格成生命中永远不会忘记的故事！活动地址";

    
    if ($E('share_db')) {
        $E('share_db').href = "javascript:void((function(){var%20u='http://shuo.douban.com/!service/share?image=&href=" + encodeURIComponent(_p_share_url) + "&name=" + encodeURIComponent(_p_share_title) +"';window.open(u,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330');return%200;})());";
    }
    if ($E('share_kx')) {
        $E('share_kx').href = "javascript:void(kaixin=window.open('http://www.kaixin001.com/~repaste/share.php?&rurl="+escape(_p_share_url)+"&rtitle="+escape(_p_share_title)+"&rcontent="+escape(_p_share_text)+"','kaixin'));kaixin.focus();";
    }
    // 根据不同的杂志社显示不同的文案
    var x = "javascript:void((function(s,d,e,r,l,p,t,z,c){var%20f='http://v.t.sina.com.cn/share/share.php?appkey=2264489285&ralateUid=2264489285"
    +(scope.$ralateUid?"&ralateUid="+scope.$ralateUid:"")+"',u=z||d.location,p=['&url=',e(u),'&title=',e(t||d.title),'&content=',c||'gb2312','&pic=',e(p||'')].join('');function%20a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(s.width-440)/2,',top=',(s.height-430)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();scope.weiboLog();})(screen,document,encodeURIComponent,'','','"+_p_share_pic+"','"+_p_share_textWeibo+"','"+_p_share_url+"','utf-8'));";
    //x = encodeURIComponent(x);
    if ($E('share_weibo')) {
        $E('share_weibo').href = x;

    }
    scope.weiboLog = function() {
        v7sendLog("50_01_07");
    }
	
    if ($E('share_rr')) {
        $E('share_rr').href = "javascript:void(function(){var renren=window.open('http://share.renren.com/share/buttonshare.do?link="+encodeURIComponent(_p_share_url)+"&title="+encodeURIComponent(_p_share_title)+"&content="+encodeURIComponent(_p_share_text)+"');}())";
    }
});