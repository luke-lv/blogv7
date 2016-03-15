/**
 * @fileoverview feed转载成功
 * @author Book | liming9@staff.sina.com.cn
 * @created 2012-08-17
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
$import("sina/utils/insertTemplate.js");
$import("sina/ui/dialog/backShadow.js");

var ReblogSuccess = Core.Class.create();
ReblogSuccess.prototype = {
	
	/**
	 * 保存数据的接口
	 */
	interfaceSave:null,
	
    box: null,
    nodes: null,
    onClose: null,
	
	/**
	 * 转载备注为空时的文案
	 */
	memoNullText:"说点什么...",
	
	/**
	 * 转载后的文章ID
	 */
	articleID:"",
	
	/**
	 * 初始化
	 */
	initialize:function(){
		Lib.checkAuthor();
		this.interfaceSave=new Interface("http://control.blog.sina.com.cn/riaapi/article/quto_onetime.php","ijax");
		!window.CateDialog && (window.CateDialog=new cateDialog());
	},
	
	/**
	 * 显示对话框
	 */
	show:function(articleID, wrapBox, onClose){
		this.box = wrapBox;
        this.onClose = onClose;
        this._initDialog();
		this.articleID = articleID || "";
//		this._dialog.show();
//		this._dialog.setFixed(true);
//		this._dialog.setMiddle();
//		this._dialog.setAreaLocked(true);
	},
	
	/**
	 * 保存数据
	 */
	save: function(){
		var me=this,
			nodes=this.nodes;
		this.interfaceSave.request({
			POST : {
				version:7,
				new_cat:nodes.selCate.value,
				blog_id:me.articleID,
				reship:nodes.txtMemo.value===me.memoNullText?"":nodes.txtMemo.value
			},
			onSuccess : function (data) {
				me.close();
				me._initLayer();
			},
			onError : function (cep) {
				//me.close();
                winDialog.alert(cep.data);
                //me.onError(err);
			},
			onFail : function (){
			}
		});
	},
	
	/**
	 * 关闭对话框
	 */
	close:function(){
		this.onClose && this.onClose();
        //this._dialog.hidden();
		//this.clear();
	},
	
	/**
	 * 初始化对话框
	 */
	_initDialog:function(){
		var me=this;
		var template = '' +
            '<div class="arrow"></div>' +
            '<p class="reproduced"><span class="b"></span>你还可以写评论...</p>' +
            '<div class="commentbox"><textarea id="#{txtMemo}" style="color:#c8c8c8;" name="" cols="" rows="">' +
                this.memoNullText+'</textarea></div>' +
            '<div class="ct_float ct_float_no">' +
                '<div class="ct_floatL">分类' +
                    '<select id="#{selCate}">' +
                        '<option value="00">默认文章分类</option>' +
                    '</select>' +
                    '<a id="#{btnShowCate}" href="javascript:;">创建分类</a>' +
                '</div>' +
                '<div class="ct_floatR">' +
                    '<a id="#{btnSave}" href="javascript:;" class="SG_aBtn SG_aBtn_ico"><cite>转载</cite></a>' +
                '</div>' +
            '</div>' +
            '<div class="clearit"></div>';
        this.box[0].innerHTML = '';
        this.nodes = Utils.insertTemplate(this.box[0], template, 'AfterBegin');
		//事件绑定
		Core.Events.addEvent(this.nodes.btnSave,function(){
			//转载的时候什么都不说，也可以转载！
			// if(me.nodes.txtMemo.value===me.memoNullText
			//  && me.nodes.selCate.selectedIndex===0){
			// 	me.close();
			// }else{
				me.verified() && me.save();
			// }
		});
		Core.Events.addEvent(this.nodes.btnShowCate,function(){
            window.CateDialog.onSuccess=function(res,event){
            	Core.Events.stopEvent(event);
				me.nodes.selCate.length = 1;
				var list=res || [],
					i,
					len=list.length;
				for (i = 0; i <len; i++) {
					me.addCate(list[i].value,list[i].label);
				}
				me.addCate("0","私密博文");
			};
			window.CateDialog.show();
		});
		
		//转载备注
		this.nodes.txtMemo.onblur=function(){
			if(this.value.replace(/\s/g,"")===""){
				this.style.color="#c8c8c8";
				this.value=me.memoNullText;
			}
		};
		this.nodes.txtMemo.onfocus=function(){
			if(this.value===me.memoNullText){
				this.style.color="#000000";
				this.value="";
			}
		};
		
		this._initCateList();
	},
	/**
	 * 转载成功后浮层提示
	 */
	_initLayer:function(){
		var layerHtml = '<div class="pop_reserved" id="layerWrap" style="display:none;">' +
							'<img src="http://simg.sinajs.cn/blog7style/images/center/newversion/ico_reserved.jpg" width="20" height="17" alt="" />转载成功！' +
						'</div>';
		var option = {
			css: {
				'z-index': '5002',
				'position':$IE6?'absolute':'fixed' ,
				'top': '50%',
				'left': '50%'
			}
		};
		var mask = new BackShadow(0.4);
		mask.show();
		if (!$E('layerWrap')) {
	        Utils.insertTemplate(document.body, layerHtml, 'BeforeEnd');
	        var layerWrap = $E('layerWrap');
	        layerWrap.style.display = "";
	        if($IE6){
				Core.Events.addEvent(window, function(){
					setPos(layerWrap);
				}, "scroll");
			}
			setPos(layerWrap);
		}else{
			$E('layerWrap').style.display = "";
		};
		
		setTimeout(function(){
			mask.destroy();
			$E('layerWrap').style.display = "none";s
		},1000);	
		function setPos(obj){
			var w = 190, h = 110;
			obj.style.marginLeft = w / 2 * (-1) + 'px';
			if($IE6){
				obj.style.top = document.documentElement.scrollTop + parseInt(Math.abs((document.documentElement.offsetHeight - h)/2), 10);
				delete option.css.top;
			}else{
				obj.style.marginTop = h / 2 * (-1) + 'px';
			}
			Core.Dom.setStyle2(obj, option.css);
		}
	},
	/**
	 * 提交前的验证
	 */
	verified:function(){
		var nodes=this.nodes;
		if(Core.String.byteLength(nodes.txtMemo.value)>2000){
			winDialog.alert("评论内容必须是1000中文或2000字符以内，请重新输入。");
			return false;
		}
		return true;
	},
	
	/**
	 * 初始化文章分类名称列表
	 */
	_initCateList:function(event){
		Core.Events.stopEvent(event);
		var nodes=this.nodes,
			me=this;
		nodes.selCate.length=1;
		
		App.getArticlesSort(function(){
			var list=x.data,
				i,
				len=list.length;
			for(i=0;i<len;i++){
				me.addCate(list[i].id,list[i].name);
			}
			me.addCate("0","私密博文");
		});
		
	},
	
	/**
	 * 添加分类名称
	 * @param {String} id
	 * @param {String} name
	 */
	addCate:function(id,name,event){
		var sel=this.nodes.selCate;
		var op=$C("option");
		op.value=id;
		op.innerHTML=name;
		sel.appendChild(op);
	}
};
