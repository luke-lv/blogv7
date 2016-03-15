/**
 * @fileoverview
 *	个人信息组件
 		——基础组件，仅包括接口读取部分
 		  
 		各产品中的访客组件需要继承此组件来实现具体的呈现
 		继承中必须实现的参数和方法如下：
		$registComp(12, {
				"requestParam"	: { // 调用接口的参数
						"uid"		: scope.$uid		// 当前博主 UID
						,"pagesize"	: "18"				// 查询多少个访客
						,"pid"		: 1					// 产品 ID
														//	博客:1
														//  播客:2
														//  圈子:4
														//  相册:8
														//  魔方:16
														//  邮箱:32
														//  论坛:64
														//  Space:128
														//  贴吧:256
														//  音乐 1024
						,"varname"	: "requestId_blog_index_visit_list"  // 接口返回的变量名，可任意指定
					}
				,"render_210"	: function (oData) { // 210宽度下的渲染
					
				}
				,"render_510"	: function (oData) { // 510宽度下的渲染
					
				}
				,"render_730"	: function (oData) { // 730宽度下的渲染
					
				}
			},
			12);
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009.08.11
 * @history
 *
 */
$import("sina/core/function/bind2.js");
$import("sina/core/array/foreach.js");
$import("sina/core/string/a2u.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/encodeHTML.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/msg/componentMSG.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/blogv/getVHTML.js");
$import("lib/util/cutNickName.js");

$registComp("12", {
//	http://footprint.cws.api.sina.com.cn/list.php?uid=1406758883&pagesize=18&pid=1&varname=requestId_79064086

	// 访客列表读取接口
	"Interface"	: new Interface("http://footprint.cws.api.sina.com.cn/list.php", "jsload")

	/*
	 * BEGIN:  modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14
	 * 新增营销推广地址
	 */
	,"PromoteUserBlogInterface" : new Interface("http://control.blog.sina.com.cn/riaapi/profile/AdTaskTools.php", "jsload")
	/*END: modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14*/
	
	,"isDisabled": function(){
		var disabledStr = $_GLOBAL.disableVisitor;
        if (disabledStr && disabledStr.indexOf('|' + this.requestParam.uid + '|') > -1) {
			this.showDisabled();
			return true;
		}
		return false;
	},
	/**
	 * 请求留言更新留言数据--add by wangqiang1
	 * @param {Function} callBack 回调方法
	 * @param {Object} promoteUid 需要营销推广的用户ID
	 */
	_getMessage : function(promoteUid)
	{
		if(!promoteUid){
			promoteUid = {};
		}
        
        var _getVHTML = Lib.blogv.getVHTML;
        var _cutNickName = Lib.util.cutNickName;
		this.Interface.request({
				GET			: this.requestParam
				,onSuccess	: Core.Function.bind2(function (oData) {
					// 把访问时间转换为 ?分钟前 这样的格式，昵称截取
					Core.Array.foreach(oData.record, Core.Function.bind2(function(oItem){
						oItem.vString = this.formatTime(oItem.vtime, oData.stime);
						var nickname = Core.String.a2u(oItem.name);
                        if (isNaN(oItem.wtype)) {
                            oItem.wtype = -1;
                        }
                        // 用户加V类型
                        oItem.wtype = parseInt(oItem.wtype, 13);//因访客组件临时变更html修改 原值为：10
                        // 截断访客昵称
						oItem.shortName = _cutNickName(nickname, oItem.wtype,9);//因访客组件临时变更html修改 原值为默认值：6

						if(promoteUid[oItem.uid]){
							oItem.isPromote = true;
						}
                        
                        oItem.userV = _getVHTML(oItem.wtype);
                        oItem.shortName = Core.String.encodeHTML(oItem.shortName);
					}, this));
					// 缓存当前的数据
					this.cacheData = oData.record;
					this.total = oData.total;
					this["render_" + this.size](this.cacheData);
					promoteUid = null;
				}, this)
				,onError	:  Core.Function.bind2(function (oData) {
					this.showError($SYSMSG[oData.code]);
				}, this)
				,onFail		:  Core.Function.bind2(function () {
					this.showError($SYSMSG.A80101);
				}, this)
			});
	}
	// 载入访客组件的数据
	,"load"		: function () {
		//先下线访客组件 @modified xiaoyue3 20140430
		//this.showDisabled();
		//return;
		if(this.requestParam == null){
			this.show("请提供访客组件的接口参数");
		}else{
            Lib.checkAuthor();
            if (!$isLogin) {
                this.requestParam.varname = "requestId_visitor_list";
            }
            if (scope.unreadMsg && scope.unreadMsg.foot == 0) {
                this.requestParam.add = 1;
            }
            if (this.isDisabled()) {
                return;
            }
            
            
            /*
             * BEGIN:  modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14
             * 新增营销推广地址
             */
            var _this = this;
            _this._getMessage({
				//测试uid
				//"2109381223":true,
				//测试uid
				//"1929393407":true,
                //轻博客uid
                //"1951657750": true
				//by liming9
                "1259295385": true
				
            });
            /*END: modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14*/
		}
	}
	/*
	 *	格式化时间
		模块中的时间规则
			1-59分钟的，显示为确切的“几分钟前”，如：“5分钟前”
			今天1小时以上的，只标明确切时间，如：“今天12:55”
			昨天以前的（包括昨天），只显示“确切日期”，如：“6月9日 ”
	 * @param {Number} nVisitTime
	 * @param {Number} nSystemTime
	 */
	,"formatTime" : function (nVisitTime, nSystemTime) {
		var result = "";
		var nSystemDay = new Date(nSystemTime * 1000);
		var nVisitDay = new Date(nVisitTime * 1000);
		// 先判断是否同一天
		if(nSystemDay.getFullYear() == nVisitDay.getFullYear()
				&& nSystemDay.getMonth() == nVisitDay.getMonth()
				&& nSystemDay.getDate() == nVisitDay.getDate()){
//			Debug.info("今天来访");
			// 同一天内，判断是否是 1小时内访问
			var diffTime = Math.max(0, nSystemTime - nVisitTime);
			Debug.warning("diffTime : " + diffTime);
			if(diffTime < 60 * 60){
				result = Math.ceil(diffTime / 60) + "分钟前";
			}else{
				var visitTime = new Date(nVisitTime * 1000);
				result =  ("今天0" + visitTime.getHours() + ":0" + visitTime.getMinutes()).replace(/(\d{3,3})/g, function(a, b){
									return b.substr(1);
							});
			}
		}else{
			var visitDate = new Date(nVisitTime * 1000);
			result =  (visitDate.getMonth() + 1 ) + "月" + visitDate.getDate() + "日";
		}
		return result;
	}
	/*
	 * 重载访客组件
	 * @param {Number}	sSize			重载后，被渲染的尺寸
	 * @param {Boolean}	bAddManage		重载后，是否添加管理链接
	 * @param {Boolean}	bForceRequest	重载后，是否强制请求新数据，
	 * 											删除访客的时候需要重新读接口，拖动组件的时候只需重渲染数据即可
	 */
	,reload		: function (sSize, bAddManage, bForceRequest) {
		var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
		if(!sizeCorrect){
			Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
			return;
		}
		this.size = sSize || this.size;
		this.getContent().innerHTML = '<div class="wdtLoading"><img src="http://simg.sinajs.cn/blog7style/'
					+ 'images/common/loading.gif" />加载中…</div>';
		if(bForceRequest == true || this.cacheData == null){
			this.load();
		}else{			
			this["render_" + this.size]();	
		}
	}
}, "dynamic");
