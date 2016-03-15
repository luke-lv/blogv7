/**
 * @fileoverview 转载到Qing博客
 * @author Qiangyee | wangqiang@staff
 * @date   2011-11-21
 *
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/io/ajax.js");
$import("lib/checkAuthor.js");
$import("lib/openBlog.js");

var ReblogToQing = Core.Class.create();
ReblogToQing.prototype = {
    // 是否正在转载
	saving : false,
    // 博文ID
	blogId : "",
    // 
	initialize:function(){
	},
    reblog : function(blogId){
        this.blogId = blogId;
        if (!this.blogId){
            throw new Error("转载博文ID未定义");
        }
        this.checkUser(this.blogId);
    },
    /**
     * 检查用户是否开通博客和是否登录
     */
	checkUser : function(blogId){
		this.blogId = blogId || scope.$blogId;
		Lib.checkAuthor();
		var me = this;
        if (!$isLogin) {
            v7sendLog('48_01_32');
            new Lib.Login.Ui().login(function(){
				scope.blogOpener.showDialog(function() {
					me.save.bind2(me)();
				});
			});
        }else{
			var me = this;
			scope.blogOpener.showDialog(function() {
				me.save();
			});
			//this.save(commentText,isComment);
		}
	},
	save : function(){
		var me=this;
		if(this.saving){
			return;
		}
		this.saving=true;
		 var param = {
		 	 version:7,
   			 blogId : me.blogId,
             rnd : (+new Date)
        };
        var showUnkownError = function(){
            winDialog.alert("对不起，系统繁忙请稍后！" , {
                icon:"01",
                funcOk: function(){
                }
            });
        }
        var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/share2qing.php?rnd="+(+new Date);
        Utils.Io.Ijax.request(url, {
            POST : param,
            returnType : 'json',
            onComplete : function(result){
				this.saving=false;
                // A00001 文章未能成功读取
                // B119005 博主为私密，不允许转载
                // A00007 非法用户，或者未登录
                // A00420 为开通qing
                // A00421 转载失败
                if(!result){
                    showUnkownError();
                    return;
                }
                try{
                    result = (new Function("return "+result))();
                }catch(e){
                    showUnkownError();
                }
				if ("A00006" == result.code){
                    winDialog.alert(["已成功转载到Qing博客！<br/><span style='font-weight: 100; font-size: 12px;'>",
                            result.data.qingId?"<a target='_blank' href='"+$_GLOBAL.qingURL+result.data.userId+"/"+result.data.qingId+".html'>去查看已转载的文章>></a>":"",
                            "</span>"].join(""), {
                            icon:"03"
                        });
                    me.onSuccess(result, param)
                } else if ("A00420" == result.code){
                    me.showOpenQingWnd();
                } else if ("A00421" == result.code){
                     me.showShareToQingFailure();
                } else {
                    showUnkownError();
                }
            }.bind2(this),
            onException: function(data){
				this.saving=false;
				if (!data){
                    showUnkownError();
                    return;
                }
				
            }.bind2(this)
        });
	},
    /**
     * 显示开通Qing博客提示浮层
     */
	showOpenQingWnd : function(){
        var dialog = winDialog.createCustomsDialog({
                content : ['<div class="CP_layercon2 unilayer">',
                        '<div class="CP_prompt toQing">',
                        '<table class="CP_w_ttl"><tbody><tr><td>您的新浪博客账号未开通Qing。开通后可转载到Qing中。</td></tr></tbody></table>',
                        '<p class="CP_w_btns_Mid"><a id="#{openQing}" class="SG_aBtn SG_aBtnB" href="'+$_GLOBAL.qingURL+'home" target="_blank"><cite>开通Qing</cite></a>',
                        '&nbsp;&nbsp;<a id="#{cancel}" class="SG_aBtn SG_aBtnB" href="javascript:void(0);"><cite>取消</cite></a></p>',
                        '</div>',
                    '</div>'].join(""),
                shadow: 1
            },'openQing');
        dialog.setMiddle();
        dialog.show();
        dialog.nodes['openQing'].onclick = function() {
            setTimeout(function(){
                dialog.close();
                dialog.onclick = null;
                dialog = null;
            },200);
        };
        dialog.nodes['cancel'].onclick = function() {
            setTimeout(function(){
                dialog.close();
                dialog.onclick = null;
                dialog = null;
            },200);
        };
    },
    showShareToQingFailure : function(){
        var msg = "对不起，转载至Qing博客失败。";
        winDialog.alert(msg , {
            icon:"01",
            funcOk: function(){
            }
        });
    },
	onSuccess:function(aId){},
	onError:function(){}
};