/**
 * @fileoverview 全局公共接口
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/trans/global',function(require,exports,module){
	var $transmission = require('lib/common/transmission');

	//以下面的方式注册接口
	var trans = new $transmission();
	var g = trans.register.bind(trans);
	var prefix = '/dpool/blog/newblog/riaapi/mblog';

	//登出
	g('logout', {url:'/api/auth/logout'});

	/**
	 * 布码接口
	 * 参数
	 * key: tracecode + _ + uid
	 * pageid: scope.$pageid
	 */
	g('traceAPI',{ url: 'http://hits.sinajs.cn/A2/b.html'});

	/**
	 * 其他统计杂项
	 * 参数: 任意
	 */
	g('traceStat', {url : 'http://blog.sina.cn/dpool/blog/newblog/riaapi/mblog/stat.php', type : 'GET'});

	/**
	 * 未读动态接口
	 * 参数
	 * uid: 登录用户ID
	 * varname: requestId_{8位随机整数}
	 */
	g('unread',{ url: prefix + '/notice.php'});

	/**
	 * 未读消息数清零
	 * 参数
	 * fields: 要清除未读数的标识字段，多个标识,分割
	 * (unread_msg_num:总未读数, wall_num:留言数, article_comment_num:评论数, article_reply_num:回复数, remind_num:通知数)
	 */
	g('clearUnread',{ url: prefix + '/unread_clear.php'});

	/**
	 * 积分兑换接口
	 * 参数
	 * uid: 登录用户uid
	 * type: 兑换项目  3 图片vip 4 私密博文 5 兑换勋章
	 */
	g('openVip',{ url: prefix + '/points_redeem.php'});

	/**
	 * 验证是否开通接口
	 * 参数
	 * type: 兑换项目  3 图片vip 4 私密博文 5 兑换勋章
	 */
	g('checkVip',{ url: prefix + '/check_vip.php'});

	/**
	 * 获取用户积分数接口
	 * 参数
	 * uid: 登录用户uid
	 */
	g('getUserPoint',{ url: prefix + '/get_user_point.php'});

	/**
	 * 判断用户是否签到接口(get)
	 * 用户签到接口(post)
	 * 参数
	 * 无
	 */
	g('qiandao',{ url: prefix + '/qiandao.php'});

	/**
	 * 手浪广告接口
	 * 参数
	 * uid: 登录用户uid
	 */
	g('saxAPI',{ url: 'http://sax.sina.cn/wap/impress'});

	/**
	原生广告接口
	@param adunit_id 广告位ID，多个用,分隔
	@param timestamp 时间戳，网站页面的打开时间，用于广告去重
	@param page_url 页面URL
	@param callback JSONP回调函数
	**/
	g('saxNative', {
		dataType : 'jsonp',
		processData : false,
		url : 'http://sax.sina.cn/native/impress'
	});

	/**
	 * 判断是否启用打赏功能
	 * @param seller 博主uid
	 */
	g('get_reward', {url: prefix + '/get_reward.php', type: 'GET'});

	module.exports = trans;

});


