/**
 * @fileoverview 群博客推广，加关注
 * @author W.Qiang | wangqiang1@staff.sina.com.cn
 * @created 2009-08-24
 */
$import("sina/core/string/format.js");
$import("product/promote/loadPromoteCrowds.js");
$import("product/promote/updatePromoteCrowdsEl.js");
$registJob('promoteBlog7Crowd', function(){
    var changeCrowdsLink = $E('next_group_button');
	var crowdShowEl = $E('grp_attention_content');
	if(!changeCrowdsLink || !crowdShowEl){ //PHP未上线
		return;
	}
	//var attentionUrl = 'http://control.blog.sina.com.cn/riaapi/profile/attention_add.php?uid=2014483223&aid=1902524950&varname=requestId_68245403';
	//var ewr={"code":"A00006",data:[{"crowdId":"1902524660","crowdName":"\u5149\u7535\u7cbe\u5bc6\u4eea\u5668","crowdImgUrl":"http:\/\/portrait5.sinaimg.cn\/1902524660\/blog\/50","attentionNum":"6"},{"crowdId":"1902524950","crowdName":"\u6742\u8c08","crowdImgUrl":"http:\/\/portrait7.sinaimg.cn\/1902524950\/blog\/50","attentionNum":"2"},{"crowdId":"1902524940","crowdName":"\u519b\u4e8b\u535a\u5ba2","crowdImgUrl":"http:\/\/portrait5.sinaimg.cn\/1902524940\/blog\/50","attentionNum":"1"}]}
	var el = new scope.UpdatePromoteCrowdsEl(crowdShowEl,changeCrowdsLink);
	var loader = new scope.LoadPromoteCrowds();
	loader.load(scope.$uid, el);
	
	
    
});