/**
 * @fileoverview 留言
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-14
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/function/bind2.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/login/info.js");

$import("product/guestBook/writeField.js");
$import("product/guestBook/guestBookList.js");
$import("product/guestBook/privacySet.js");


/**
 * 留言
 */
scope.GuestBook=Core.Class.create();
scope.GuestBook.prototype={
	
	/**
	 * 留言列表对象
	 */
	guestBookList:null,
	
	/**
	 * 留言总数
	 */
	totalCount:0,
	
	/**
	 * 每页显示的留言条数
	 */
	eachPageCount:20,
	
	/**
	 * 当前页数
	 */
	currentPage:1,
	
	/**
	 * 留言总数的接口
	 */
	interfaceTotalCount:null,
	
	/**
	 * 发留言对象
	 */
	writeField:null,

	
	/**
	 * 初始化
	 */
	initialize:function(){
		var _this=this;
		//不再请求留言总数
		this.interfaceTotalCount=new Interface("http://wall.cws.api.sina.com.cn/count_all.php","jsload");
		this.requestTotalCount(function(){
			_this.updatePagination(_this.currentPage);
		});
		this.initWriteField();
		this.initGuestBookList();
		this.initPrivacySet();
		
		this.initSaveCaution();
		this.reloadName();
		
		if(location.hash){
			var _hash = $E(location.hash.replace(/^./, ""));
			if(_hash){
				_hash.scrollIntoView(true);
			}
		}
	},
	
	/**
	 * 请示留言总数
	 * @param {Function} callBack
	 */
	requestTotalCount:function(callBack){
		if(callBack != null){
			callBack();
		}
		return;	// 临时措施，不读取留言总数就显示分页 2010.06.07
		var _this=this;
		this.interfaceTotalCount.request({
			GET: {
				uid: scope.$uid
			},
			onSuccess: function(data){
				_this.totalCount = data["num"];
				if (callBack) {
					callBack();
				}
			},
			onError: function(data){
			},
			onFail: function(){
			}
		});
	},

	/**
	 * 未登录时的网吧、公用电脑警示tip
	 */
	initSaveCaution : function(){
		var cautionCheck = $E("saveOnline_guest");
		var cautionTip = $E("saveCaution_guest");
		if(!cautionCheck) return;
		cautionCheck.checked = true;
		if(!$isLogin) cautionCheck[$IE?"onclick":"onchange"] = validChecked;
		//validChecked();
        var cancelStatus = 1;
		function validChecked(){
			if (cautionCheck.checked) {
                cautionTip.style.display = "";
            } else {
                cautionTip.style.display = "none";
            }
            
            if (cancelStatus) {
                var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/padblog/padInfo.php?ck_login=A00004&rnd="+Math.random();
                Utils.Io.JsLoad.request(url,{
                    onComplete : function(){}
                    ,onException : function(){}
                });
                cancelStatus = null; 
            }
		}
	},
	reloadName : function() {
        //总是记住登录名
        var userInfo = Lib.Login.info();
        
        var defaultName = userInfo.ln;
        if(defaultName){
            $E("txtMessageUserName").value = defaultName;
        }
	},

	/**
	 * 初始化留言显示列表
	 */
	initGuestBookList:function(){
		var _this=this;
		this.guestBookList=new scope.GuestBookList();
		
		scope.guestBookList = this.guestBookList;
		
		//博主设置了留言为隐私时显示提示信息
		this.guestBookList.onPermissionDenied=function(){
			$E("privateDiv").style.display = "";
			Core.Dom.insertHTML($E('module_942'), '<a name="write"></a>', 'AfterBegin');
			$E("normalDiv").innerHTML = "";
		};
		
		this.guestBookList.display(1, this.getCurrentPageStatus);
		this.guestBookList.onRemoved=function(){
			_this.requestTotalCount(function(){
//				if(Math.ceil(_this.totalCount / _this.eachPageCount)<_this.currentPage){
//					_this.currentPage--;
//				}
				_this.guestBookList.display(_this.currentPage, this.getCurrentPageStatus);
				_this.updatePagination(_this.currentPage);
			});
		};
	},
	getCurrentPageStatus	: function (nNumber) {
		this.hasNext = (nNumber == 20);
	},
	
	/**
	 * 初始化发留言区域
	 */
	initWriteField:function(){
		var _this=this;
		this.writeField=new scope.WriteField();
		this.writeField.load();
		
		//成功发送留言后更新留言显示列表
		this.writeField.onSubmitSuccessed=function(){
			this.clear();
			_this.guestBookList.display(1, _this.getCurrentPageStatus);
			
			_this.requestTotalCount(function(){
				_this.updatePagination(1);
			});
			window.location = window.location.toString().replace(/#.*/, "") + "#divMessageList";
		};
		var setNick = function () {
            var vHTML = Lib.blogv.getVHTML(scope.loginUserWtype);
            var _nickname = $E("nickname");
            _nickname.innerHTML = $nick + "&nbsp;" + vHTML +"：";
            _nickname.style.display = "";
        }
		//提交留言时登录状态有改变
		this.writeField.onLoginStateChagedSubmit=function(){
			if($isAdmin){
				window.location.reload();
			}else{
                setNick();
			}
		};
		
		//提交留言失败并且登录状态有改变
		this.writeField.onLoginStateChagedSubmitError=function(){
			if($isAdmin){
				window.location.reload();
			}else{
				setNick();
			}
		};
	},
	
	/**
	 * 初始化留言板隐私设置
	 */
	initPrivacySet:function(){
		Lib.checkAuthor();
		if ($isAdmin && $E("btnPrivacySet")) {
			var privacySet = new scope.PrivacySet();
			Core.Events.addEvent($E("btnPrivacySet"),function(){
				privacySet.show();
				privacySet.updateData();
			},"click");
		}
	},
	
	/**
	 * 更新分页
	 * @param {Number} pageID 当前页ID
	 */
	updatePagination:function(pageID){
		pageID = pageID || 1;
		this.currentPage = pageID;
		var _this=this;
//		var maxPage=Math.ceil(_this.totalCount / _this.eachPageCount);
//		Ui.Pagination.init({
//			"pageNode": "pageMessage",
//			"nodeClassNamePrefix":"SG",
//			"curPage": pageID,
//			"maxPage": maxPage,
//			"pageTpl": function(nPage){
//				
//				//传入更新数据的回调函数
//				_this.guestBookList.display(nPage,function(){
//					_this.updatePagination(nPage);
//					window.location=window.location.toString().replace(/#.*/,"")+"#divMessageList";
//				});
//				_this.currentPage=nPage;
//				return false;
//			}
//		}).show();
		
//		$E("pageMessage").style.display=maxPage <= 1?"none":"";

//		$E("divMessageList").scrollIntoView(true);
		var prevPageId = Math.max(1, pageID - 1);
		var nextPageId = Math.max(1, pageID + 1);
		
		//当没有留言时，不显示分页
		var pageTimmer = setInterval(function(){
			if(scope.guestBookHasDatas && scope.guestBookHasNext) {
				$E("pageMessage").innerHTML = '<ul class="SG_pages">'
					+ (_this.currentPage == 1 ? '' : '<li title="跳转至第 '+ prevPageId +' 页" class="SG_pgprev"><a href="javascript:scope.guestBookList.display(' + prevPageId + ', scope.guestBookCtrl.getCurrentPageStatus.bind2(scope.guestBookCtrl));scope.guestBookCtrl.updatePagination(' + prevPageId + ');">&lt; 上一页</a></li>')
					+ (scope.guestBookHasNext === 'no' ? '' : '<li title="跳转至第 '+ nextPageId +' 页" class="SG_pgnext"><a href="javascript:scope.guestBookList.display(' + nextPageId + ', scope.guestBookCtrl.getCurrentPageStatus.bind2(scope.guestBookCtrl));scope.guestBookCtrl.updatePagination(' + nextPageId + ');">下一页 &gt;</a></li>')
					+ '</ul>';
				clearInterval(pageTimmer);
				delete scope.guestBookHasDatas;
				delete scope.guestBookHasNext;
			}
		},100);
		$E("pageMessage").style.display = "";
	}
};

$registJob("guestBook", function(){
	var guestBook=new scope.GuestBook();
	scope.guestBookCtrl = guestBook;
});