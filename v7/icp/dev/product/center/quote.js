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
$import("product/center/quote_success.js");

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
        this._interface = new Interface("http://control.blog.sina.com.cn/admin/article/article_quote.php", "jsload");
    },
	check:function(articleID){
		//功能先屏蔽掉，领导说开放才能开放。。。耶。。。
		//领导说了，ok！
		//winDialog.alert("系统维护，该功能暂不可用");
		//return;
		
		this.articleID=articleID || scope.$articleid;
		Lib.checkAuthor();
        if (!$isLogin) {
            new Lib.Login.Ui().login(this.save.bind2(this));
        }else{
			this.save();
		}
	},
	save:function(){
		var me=this;
		if(this.saving){
			return;
		}
		this.saving=true;
		 var param = {
		 	 version:7,
   			 blog_id:me.articleID
        };
        this._interface.request({
            GET: param,
            onSuccess: function(_data){
				this.numAdd();
				this.saving=false;
				var aID=_data.url.split("/").pop().split("_")[1].split(".")[0];
				this.quoteSuccess.onSuccess=function(){
					winDialog.alert("博文已成功转载！<br/><span style='font-weight: 100; font-size: 12px;'><a target='_blank' href='"+_data.url+"'>查看转载博文>></a></span>", {
				        icon:"03"
				    });
				};
				this.quoteSuccess.show(aID);
				
				
            }.bind2(this)            ,
            onError: function(_data){
				this.saving=false;
				if(_data.code=="B119002"){
					winDialog.alert($SYSMSG[_data.code] , {
				        icon:"01",
						funcOk: function(){
					        window.location.href="http://control.blog.sina.com.cn/upgrade/upgrade_show.php?version=7";
					    }
				    });
				}else{
					winDialog.alert($SYSMSG[_data.code] , {
				        icon:"01",
						funcOk: function(){
//					        window.location.reload();
					    }
				    },"alert1");
//					Core.Events.addEvent(winDialog.getDialog("alert1").getNodes().btnClose,function(){
//						window.location.reload();
//					},"click");
				}
                
            }.bind2(this),
            onFail: function(){
				this.saving=false;
            }.bind2(this)
        });
	},numAdd:function(){
		var ele=$E("quote_sign") || $E("quote_sign_"+this.articleID);
		if (!ele) {
			return;
		}
		var text=ele.innerHTML;
		var num;
		text.replace(/(\d+)/,function(a,b){num=b});
		ele.innerHTML="("+(parseInt(num)+1)+")";
	}
	
};