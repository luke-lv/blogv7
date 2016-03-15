$import('lib/jobs.js');
$import('sina/utils/io/jsload.js');
$import("sina/core/dom/byClass.js");
/**
 * @fileoverview 猜你喜欢数据收集，如果是普通博文页面,
   则读取scope.cate_id属性，发送用户兴趣信息

 * @author Book | liming9@staff.sina.com.cn
 * @created 2012-09-24
 * @modified by wangqiang1/2013-04-10 
 */
$registJob('xingqu', function(){
    // 此分类id为运营部提供
    var cateIdHash = {
        171: '娱乐博客',
        172: '财经博客',
        173: '股票博客',
        174: '体育博客',
        175: 'IT博客',
        176: '博客首页', //首页博客
        177: '文化博客',
        178: '教育博客',
        179: '军事博客',
        180: '女性博客',
        181: '育儿博客',
        182: '健康博客',
        183: '星座博客',
        184: '游戏博客',
        185: '美食博客',
        186: '旅游博客',
        187: '杂谈博客',
        191: '汽车博客', 
        192: '房产博客', 
        193: '佛学博客', 
        194: '宠物博客'
    };
    // 发送用户兴趣
    // @param {Numeber} id 分类id
    var sendCateId = function(id){
        window._cateIdForThisPage_ = id;
        // 此js为博客专门做的，为第一版收集的是博客频道信息
        Utils.Io.JsLoad.request('http://news.sina.com.cn/js/694/2013/0220/guess.boot.blog.js', {
            charset: 'gb2312',
            isRemove : false,
            onComplete: function(){
            }
        });
    };
    var cateId;
    var href = window.location.href;
    if( href.indexOf('tj=')!==-1 ){
        // 找到推荐图标读取title，从title获取
        var jian = Core.Dom.byClass('SG_icon107', 'img', $E('articlebody')),
        txt, k;
        if( jian ){
            txt = jian[0].title;
        }
        if( txt ){
            for(k in cateIdHash){
                if( txt.indexOf(cateIdHash[k])>-1 ){
                    cateId = k;
                    break;
                }
            }
        }
        sendCateId(cateId);
    }else if (cateId = scope.$cate_id) { 
        // 添加博文时会计算博文的分类，博文属于哪个频道
        // 由窦顺利同学提供的分类系统算出
        sendCateId(cateId);
    }
    // @modified xiaoyue3  2013-06-25
    // 此处直接执行 topic收集及个性化2.5收集代码 即是猜你喜欢代码的升级版，两者分开，主要是前一版还有可能再用，并且此版修复了一些超时问题。
    Utils.Io.JsLoad.request('http://ent.sina.com.cn/js/470/2013/0506/collect.js', {
        charset: 'gb2312',
        isRemove : false,
        onComplete: function(){
        }
    });
});
