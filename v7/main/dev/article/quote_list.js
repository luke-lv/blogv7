/**
 * @fileoverview
 *	转载列表
 * @author dg.liu | dongguang@staff.sina.com.cn
 *
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/pagination.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/removeNode.js");
$import("article/quote.js");

var QuoteList = Core.Class.create();
QuoteList.prototype = {
	saving:false,
	articleID:"",
	pageCount:0,
	initialize:function(target_id,container_id){
		this.container_id=container_id;
		this.articleID=scope.$articleid || "";
		this.initInterface();
		this.bindEvent(target_id);
		$E(this.container_id) && this.initHtml();
	},
	bindEvent:function(ele_id){
		var me=this;
		if ($E(ele_id)) {
			Core.Events.addEvent($E(ele_id), function(){
				me.show();
			});
		}
	},
	/**
	 * 建立interface
	 */
    initInterface: function(){
        this.addInterface = new Interface("http://control.blog.sina.com.cn/myblog/htmlsource/quotelist.php", "jsload");
		this.delInterface = new Interface("http://control.blog.sina.com.cn/admin/article/article_quote_del.php", "jsload");
    },show:function(articleID,container_id,pageCount){
		this.pageCount=pageCount || scope.$x_quote_c || 0;
		container_id && (this.container_id=container_id);
		if(!this.container_id){
			return;
		}

		this.articleID=articleID || scope.$articleid;

		container_id && (this.container_id=container_id);
		if ($E(this.container_id) && $E(this.container_id).innerHTML.replace(/\s/g, "") === "") {
			this.initHtml();
		}
		if(this.isShow){
			this.hidden();
			return;
		}
		$E(this.container_id).style.display="block";
		this.loadData();
		
		this.isShow=true;
	},
	hidden:function(){
		$E(this.container_id).style.display="none";
		this.isShow=false;
	},
	initHtml:function(){
		var ele=$E(this.container_id);
		if (ele) {
			var aID=this.articleID || "";
			var html = '<h3><a href="#" onclick="return false" title="关闭" id="ql_close'+aID+'" class="blogzz_closepic SG_floatR"></a>转载列表：</h3>\
                <ul class="ul_zzlist" id="ql_content'+aID+'">\
                </ul>\
				<ul style="display:none"><li id="ql_tip'+aID+'"></li></ul>\
                <div class="SG_clearB"></div>\
                <div class="blogzz_btn">\
					<a id="btnArticleQuote'+aID+'" href="#" onclick="scope.article_quote && scope.article_quote.check(\''+aID+'\');return false;" class="SG_aBtn SG_aBtn_ico SG_turn"><cite><img class="SG_icon SG_icon111" id="quoteList_quote'+aID+'" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" align="absmiddle" />转载</cite></a>\
					<p id="quoteDescription'+aID+'" class="SG_turntxt">转载是分享博文的一种常用方式...</p>\
				</div>\
				<div id="ql_page'+aID+'" class="blogzz_paged"></div>\
				<div class="clearit"></div>'
				
//				<div class="SG_clearB"></div>
//				<div class="blogzz_btn">
//				    <a href="#" class="SG_aBtn SG_aBtn_ico SG_turn"><cite><img class="SG_icon SG_icon111" src="../../images/common/sg_trans.gif" width="15" height="15" align="absmiddle" />转载</cite></a>
//					<!--上面的按钮和下面的文字，不同时存在
//					<p class="SG_turntxt">转载是分享博文的一种常用方式...</p>
//					-->
//				</div>
//                <div id="ql_page" class="blogzz_paged">
//                    <ul class="SG_pages">
//                        <li title="" class="SG_s_pgnum">
//                            <strong>1</strong>/3
//                        </li>
//                        <li title="跳转至第 2 页" class="SG_s_pgnext">
//                            <a href="javascript:Ui.Pagination.showPage('ql_page',2);">下页</a>
//                        </li>
//                    </ul>	
//                </div>
//				<div class="clearit"></div>
			ele.innerHTML = html;
			Lib.checkAuthor();
			$E("btnArticleQuote"+aID) && ($E("btnArticleQuote"+aID).style.display=$isAdmin?"none":"");
			$E("quoteDescription"+aID) && ($E("quoteDescription"+aID).style.display=$isAdmin?"":"none");
			Core.Events.addEvent($E("ql_close"+aID), this.hidden.bind2(this));
		}
	},
	setTip:function(type){
		var aID=this.articleID || "";
		var ele=$E("ql_tip"+aID);
		var ele_lst=$E("ql_content"+aID);
		if(type!="ok"){
			ele.innerHTML="暂无转载。";
			ele_lst.style.display="none";
			ele.parentNode.style.display="block";
		}else{
			ele.parentNode.style.display="none";
			ele_lst.style.display="block";
		}
		
	},
	 loadData: function(page){
	 	var me=this;
        var page = page || 1;
        var param = {
            blogid:me.articleID,
			version:7,
            page: page
        }
        this.addInterface.request({
            GET: param,
            onSuccess: function(_data){
				if(_data.length>0){
						this.setTip("ok");
					 this.parseData(_data);
					 
               		 this.page(page);
				}else{
					this.setTip();
				}
             
            }.bind2(this)            ,
            onError: function(_data){
                showError(_data.code);
                //trace("error:" + _data);
            },
            onFail: function(){
            }
        });
    },parseData: function(data){
		
		var aID=this.articleID || "";
		var html="";
		var len=data.length;
		for(var i=0;i<len;i++){
			html+=this.buildListHtml(data[i]);
		}
		
		//Core.Dom.addHTML($E("ql_content"),html);
		$E("ql_content"+aID).innerHTML=html;
		scope.quoteList_quote=new Quote("quoteList_quote"+aID);
	},
	/**
     * 分页
     */
    page: function(pageNum){
		var aID=this.articleID || "";
		var count=this.pageCount;
        var maxPage = Math.ceil(count / 10, 10);
        if (maxPage > 1) {
            Ui.Pagination.init({
                "pageNode": "ql_page"+aID,
                "nodeClassNamePrefix": "SG",
                "curPage": pageNum, // 当前所在页码
                "maxPage": maxPage,
                "pageTpl": this.loadData.bind2(this),
                "type": 3 // 指定类型为小区域翻页
            }).show();
        }
        else {
            $E("ql_page"+aID).innerHTML = '';
        }
    },
	buildListHtml:function(data){
			if($isAdmin){
				data.isShow="";
			}else{
				data.isShow="none";
			}
			var html=['<li id="pl_#{rp_blogid}">',
                    	'<p class="blogzz_pinfo SG_txtb SG_floatL">',
							'<a target="_blank" href="http://blog.sina.com.cn/u/#{rp_bloguid}">#{rp_bloguname}</a>',
							'<span class="zzlist_mleft zzlist_mright">等级<em class="SG_txtc">(#{rp_ugrade})</em></span>',
							'<span class="zzlist_mleft">转载了此文：</span><a target="_blank" href="http://blog.sina.com.cn/s/blog_#{rp_blogid}.html">#{rp_blogtitle}</a>',
						'</p>',
                        '<p class="SG_floatR">',
							'<em class="SG_txtc">#{rp_blogpubdate}</em>',
							'<a href="#" style="display:#{isShow}" class="CP_a_fuc" onclick="scope.article_quoteList.del(\'#{rp_blogid}\',\''+this.articleID+'\');return false;">[<cite id="pl_del_#{rp_bloguid}">删除</cite>]</a>',
						'</p>',
                    '</li>'].join("");
					
//			var html='<li id="pl_#{rp_blogid}">\
//					    <a href="#" style="display:#{isShow}" class="CP_a_fuc SG_floatR" onclick="scope.article_quoteList.del(\'#{rp_blogid}\');return false;">[<cite id="pl_del_#{rp_bloguid}">删除</cite>]</a>\
//                    	<p class="blogzz_pinfo SG_txtb SG_floatL">\
//							<a target="_blank" href="http://blog.sina.com.cn/u/#{rp_bloguid}">#{rp_bloguname}</a>\
//							<span class="zzlist_mleft zzlist_mright">等级<em class="SG_txtc">(#{rp_ugrade})</em></span>\
//							<span class="zzlist_mleft">转载了此文：</span><a target="_blank" href="http://blog.sina.com.cn/s/blog_#{rp_blogid}.html">#{rp_blogtitle}</a>\
//						</p>\
//                        <p><em class="SG_txtc">#{rp_blogpubdate}</em></p>\
//						  <div class="blogzz_clear"/>\
//                    </li>';
			
			data.rp_ugrade=data.rp_ugrade.toString();
			return  new Ui.Template(html).evaluate(data);
	},
	del:function(blogid,articleID){
		//tp://blog.sina.com.cn/admin/article/article_quote_del.php?sblog_id=&blog_id=;
		var me=this;
		var param = {
	            sblog_id:scope.$articleid || articleID,
				version:7,
	            blog_id: blogid
	        },
			me=this;
			
		$E("quote_sign_count") && ($E("quote_sign_count").innerHTML=+$E("quote_sign_count").innerHTML-1);
		
		Core.Dom.removeNode($E("pl_"+blogid));
		var aID=me.articleID || "";
		if ($E("ql_content" + aID) && $E("ql_content" + aID).getElementsByTagName("li").length == 0) {
			me.setTip();
		}
        this.delInterface.request({
            GET: param,
            onSuccess: function(_data){
				me.onDeleted();
            }.bind2(this)            ,
            onError: function(_data){
                showError(_data.code);
                //trace("error:" + _data);
            },
            onFail: function(){
            }
        });
	},
	onDeleted:function(){}
		
};