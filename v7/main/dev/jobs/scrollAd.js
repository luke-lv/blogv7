$import("lib/execZhitou.js");
$import("lib/680/insertIns.js");
$import("sina/core/system/getParam.js");
/**
 * 鼠标随时行广告
 * 此广告与zhitou对接博客不再接管--2013-08-22--wangqiang1
 * @author 邹武建 | wujian@staff.sina.com.cn
 * @author dcw1123 | chengwei1@staff
 * @author Qiangyee | wangqiang1@staff 
 */
$registJob("scrollAd", function(){
    // blogAd.insertIns('PDPS000000025949');
    // 博文右侧弹出闪烁的广告，以前是只有推荐页面有，突然又说博文页也有，去掉下面的判断
    // if(Core.System.getParam('tj') != 1) return;
    // 用新判断，博文页 articleM article 都显示该广告
    if(scope.$pageid == 'articleM' || scope.$pageid == 'article' || scope.$pageid == 'articleM_new' || scope.$pageid == 'article_new'){
        // console.log('scrollAd');
        blogAd.insertIns('PDPS000000054727');
        Lib.execZhitou(function(data){
            (window.sinaads || []).push({
                params: {
                    // sinaads_ad_pdps: 'PDPS000000025949',
                    sinaads_follow_top: 30,
                    sinaads_follow_mini_top: 200
                }
            });
        });   
    }

});
