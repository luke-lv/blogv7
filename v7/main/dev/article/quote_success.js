/**
 * @fileoverview 转载成功提示对话框
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-03-08
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/byteLength.js");

$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("component/include/getArticlesSort.js");

$import("component/cateDialog.js");

var QuoteSuccess = Core.Class.create();
QuoteSuccess.prototype = {
	
	/**
	 * 保存数据的接口
	 */
	interfaceSave:null,
	
	/**
	 * 对话框是否已经初始化
	 */
	_isDialogInit:false,
	
	/**
	 * 对话框
	 */
	_dialog:null,
	
	/**
	 * 转载备注为空时的文案
	 */
	memoNullText:"说点什么...",
	
	/**
	 * 转载后的文章ID
	 */
	articleID:"",
	
	/**
	 * 文章分类名列表
	 */
	_cateList:[],
	
	/**
	 * 初始化
	 */
	initialize:function(){
		Lib.checkAuthor();
		this.interfaceSave=new Interface("http://control.blog.sina.com.cn/riaapi/article/edit_cat.php","ijax");
		!window.CateDialog && (window.CateDialog=new cateDialog());
	},
	
	/**
	 * 显示对话框
	 */
	show:function(articleID){
		!this._isDialogInit && this._initDialog();
		this.articleID=articleID || "";
		this._dialog.show();
		this._dialog.setFixed(true);
		this._dialog.setMiddle();
		this._dialog.setAreaLocked(true);
	},
	
	/**
	 * 保存数据
	 */
	save:function(){
		var me=this,
			nodes=this._dialog.nodes;
		this.interfaceSave.request({
			POST : {
				new_cat:nodes.selCate.value,
				blog_id:me.articleID,
				reship:nodes.txtMemo.value===me.memoNullText?"":nodes.txtMemo.value
			},
			onSuccess : function (data) {
				me.onSuccess(data);
				me.close();
			},
			onError : function (err) {
				me.onError(err);
			},
			onFail : function (){
			}
		});
	},
	
	/**
	 * 关闭对话框
	 */
	close:function(){
		this._dialog.hidden();
		this.clear();
	},
	
	/**
	 * 初始化对话框
	 */
	_initDialog:function(){
		var me=this;
		this._dialog=winDialog.createCustomsDialog({
			content:['<div class="CP_layercon6">',		
						'<div class="turnBox">',
							'<p class="turnTxt">',
								'<img class="SG_icon SG_icon203" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle"/>',
								'<span class="txt1">转载成功！</span>你还可以写评论...',
							'</p>',
							'<ul>',
								'<li><span class="a">评论：</span><span class="b"><textarea id="#{txtMemo}" style="color:#c8c8c8;max-width:400px;" cols="" rows="3" class="SG_textarea">'+this.memoNullText+'</textarea></span></li>',
								'<li>',
									'<span class="a">分类：</span>',
									'<span class="b"><select id="#{selCate}" name=""><option value="00">默认文章分类</option></select>&nbsp;&nbsp;<a id="#{btnShowCate}" href="#" onclick="return false;">创建分类</a></span>',
								'</li>',
							'</ul>',
							'<div class="clearit"></div>',
							'<div class="butt">',
								'<a href="#" id="#{btnSave}" onclick="return false;" class="SG_aBtn SG_aBtnB"><cite>保存</cite></a>&nbsp;&nbsp;<a id="#{btnCancel}" onclick="return false;" href="#" class="SG_aBtn SG_aBtnB "><cite>关闭</cite></a>',
								'<a style="visibility:hidden" target="_blank" href="http://blog.sina.com.cn/admin/advice/advice_list.php" class="link">改进建议</a>',
							'</div>',
						'</div>',
						'<div class="clearit"></div>',
					'</div>'].join("")});
		
		//事件绑定
		Core.Events.addEvent(this._dialog.nodes.btnSave,function(){
			if(me._dialog.nodes.txtMemo.value===me.memoNullText
			&& me._dialog.nodes.selCate.selectedIndex===0){
				me.close();
			}else{
				me.verified() && me.save();
			}
		},"click");
		Core.Events.addEvent(this._dialog.nodes.btnCancel,function(){
			me.close();
		},"click");
		Core.Events.addEvent(this._dialog.nodes.btnShowCate,function(){
			
			window.CateDialog.onSuccess=function(res){
				me._dialog.nodes.selCate.length=1;
				var list=res || [],
					i,
					len=list.length;
				for (i = 0; i <len; i++) {
					me.addCate(list[i].value,list[i].label);
				}
				me.addCate("0","私密博文");
			};
			Lib.checkAuthor();
			window.CateDialog.show($UID);
			
		},"click");
		
		this._dialog.addEventListener("hidden",function(){
			me.clear();
			me.onClose();
		});
		
		//头像
//		Lib.checkAuthor();
//		this._dialog.nodes.imgFace.src=this._getFaceURL($UID);
		
		//转载备注
		this._dialog.nodes.txtMemo.onblur=function(){
			if(this.value.replace(/\s/g,"")===""){
				this.style.color="#c8c8c8";
				this.value=me.memoNullText;
			}
		};
		this._dialog.nodes.txtMemo.onfocus=function(){
			if(this.value===me.memoNullText){
				this.style.color="#000000";
				this.value="";
			}
		};
		
		this._initCateList();
		
		this._isDialogInit=true;
	},
	
	/**
	 * 提交前的验证
	 */
	verified:function(){
		var nodes=this._dialog.nodes;
		if(Core.String.byteLength(nodes.txtMemo.value)>2000){
			winDialog.alert("评论内容必须是1000中文或2000字符以内，请重新输入。");
			return false;
		}
		return true;
	},
	
	/**
	 * 初始化文章分类名称列表
	 */
	_initCateList:function(){
		var nodes=this._dialog.nodes,
			me=this;
		nodes.selCate.length=1;
		Lib.checkAuthor();
		App.getArticlesSort(function(){
			var list=x.data,
				i,
				len=list.length;
			for(i=0;i<len;i++){
				me.addCate(list[i].id,list[i].name);
			}
			me.addCate("0","私密博文");
		},$UID);
		
	},
	
	/**
	 * 根据用户昵称获取头像地址
	 * @param {String} uid
	 */
	_getFaceURL:function(uid){
		var n=parseInt(uid) % 8 + 1;
		return "http://portrait"+n+".sinaimg.cn/"+uid+"/blog/50";
	},
	
	/**
	 * 添加分类名称
	 * @param {String} id
	 * @param {String} name
	 */
	addCate:function(id,name){
		var sel=this._dialog.nodes.selCate;
		var op=$C("option");
		op.value=id;
		op.innerHTML=name;
		sel.appendChild(op);
	},
	
	/**
	 * 清除对话框内容
	 */
	clear:function(){
		var nodes=this._dialog.nodes;
		//nodes.selCate.length=1;
		nodes.txtMemo.style.color="#c8c8c8";
		nodes.txtMemo.value=this.memoNullText;
	},
	
	/**
	 * 保存成功时触发
	 */
	onSuccess:function(data){},
	
	/**
	 * 保存失败时触发
	 * @param {Object} err
	 */
	onError:function(err){},
	
	/**
	 * 关闭时触发
	 */
	onClose:function(){}
};