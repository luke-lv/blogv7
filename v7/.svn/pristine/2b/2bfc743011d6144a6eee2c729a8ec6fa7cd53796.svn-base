/**
 * @fileoverview
 *	转载
 * @author dg.liu | dongguang@staff.sina.com.cn
 *
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/checkAuthor.js");
$import("msg/articleQuoteMSG.js");
$import("article/quote_success.js");
$import("lib/openBlog.js");
$import("lib/sendLog.js");

var Quote = Core.Class.create();
Quote.prototype = {
	quoteSuccess:null,
	saving:false,
	articleID:"",
	initialize:function(ele_id){
		this.quoteSuccess=new QuoteSuccess();
		this.initInterface();
		this.bindEvent(ele_id);
		this.articleID=scope.$articleid;
	},
	bindEvent:function(ele_id){
		var me=this;
		if (ele_id) {
			Core.Events.addEvent($E(ele_id), function(){
				me.check();
			});
		}
	},
	/**
	 * 建立interface
	 */
    initInterface: function(){
        this._interface = new Interface("http://control.blog.sina.com.cn/admin/article/article_quote.php", "ijax");
    },
	check:function(articleID,commentText,isComment,moreCallBack){
		//功能先屏蔽掉，领导说开放才能开放。。。耶。。。
		//领导又说了，可以开放
		//winDialog.alert("系统维护，该功能暂不可用");
		//return;
		
		this.articleID=articleID || scope.$articleid;
		moreCallBack = moreCallBack || function(){}
		Lib.checkAuthor();
		var me = this;
        if (!$isLogin) {
        	v7sendLog('48_01_33');
            new Lib.Login.Ui().login(function(){
				scope.blogOpener.showDialog(function() {
					me.save.bind2(me)();
					moreCallBack();
				});
			});
        }else{
			var me = this;
			scope.blogOpener.showDialog(function() {
				me.save(commentText,isComment);
				moreCallBack();
			});
			//this.save(commentText,isComment);
		}
	},
	save:function(commentText,isComment){
		var me=this;
		if(this.saving){
			return;
		}
		this.saving=true;
		 var param = {
		 	 version:7,
   			 blog_id:me.articleID,
			 comment:isComment || "",
			 reship:commentText || ""
        };
        this._interface.request({
            POST: param,
            onSuccess: function(_data){
				this.numAdd();
				this.saving=false;
				var aID=_data.url.split("/").pop().split("_")[1].split(".")[0];
				
				if (!commentText) {
					this.quoteSuccess.onSuccess=function(){
						winDialog.alert("博文已成功转载！<br/><span style='font-weight: 100; font-size: 12px;'><a target='_blank' href='"+_data.url+"'>查看转载博文>></a></span>", {
					        icon:"03"
	//						funcOk: function(){
	//					        window.location.reload();
	//					    }
					    });
					};
					this.quoteSuccess.show(aID);
				}
				this.onSuccess(aID,_data.url || "");
				
            }.bind2(this),
            onError: function(_data){
				this.saving=false;
				if(_data.code=="B119007" || _data.code=="B119008") {
					winDialog.alert($SYSMSG[_data.code] , {
				        icon:"01",
						funcOk: function(){
					        //window.location.reload();
							window.location.href = window.location.href.replace(/#.*$/,'');
					    }
				    },"alert1");
					Core.Events.addEvent(winDialog.getDialog("alert1").getNodes().btnClose,function(){
						//window.location.reload();
						window.location.href = window.location.href.replace(/#.*$/,'');
					},"click");
					this.onError();
					return;
				}
				if(_data.code=="B119002"){
					winDialog.alert($SYSMSG[_data.code] , {
				        icon:"01",
						funcOk: function(){
					        window.location.href="http://control.blog.sina.com.cn/upgrade/upgrade_show.php?version=7";
					    }
				    });
				}else{
					winDialog.alert($SYSMSG[_data.code] , {
				        icon:"02",
						funcOk: function(){
					        //window.location.reload();
							window.location.href = window.location.href.replace(/#.*$/,'');
					    }
				    },"alert1");
					Core.Events.addEvent(winDialog.getDialog("alert1").getNodes().btnClose,function(){
						//window.location.reload();
						window.location.href = window.location.href.replace(/#.*$/,'');
					},"click");
				}
				
                this.onError();
				
            }.bind2(this),
            onFail: function(){
				this.saving=false;
            }.bind2(this)
        });
	},
	numAdd:function(){
		var ele=$E("quote_sign") || $E("quote_sign_"+this.articleID) || $E("z_" + this.articleID);
		if (!ele) {
			return;
		}
		var text=ele.innerHTML;
		var num;
		text.replace(/(\d+)/,function(a,b){num=b});
		ele.innerHTML="("+(parseInt(num)+1)+")";
	},
	
	onSuccess:function(aID){},
	onError:function(){}
	
};