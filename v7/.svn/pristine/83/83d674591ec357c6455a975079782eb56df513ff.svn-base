/**
 * @author xs
 * @requires prototype/prototype.js 
 * arranged by xy xinyu@staff.sina.com.cn 2008.09.18
 */


$import("sina/sina.js");
$import("msg/blogSystemMSG.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/utils/io/iframeupload.js");
$import("sina/ui/pagination.js");
$import("sina/core/class/extend.js");
//$import("prototype/prototype_src.js");
$import("sina/utils/io/jsload.js");
//$import("prototype/dom.builder.js");
$import("sina/core/class/create.js");
$import("sina/core/string/shorten.js");
$import("lib/checkAuthor.js");
//本页取出prototype框架
$import("sina/core/dom/createNode.js");
$import('sina/core/events/addEvent.js');
$import("sina/core/events/getEventTarget.js");
$import("sina/core/array/foreach.js");
$import("sina/core/function/bind2.js");

(function () {
	
	$registJob("initClass", function(){
		/**
		 * <pre>
		 *  创建插入视频页面管理类
		 * </pre>
		 * @constructor
		 * @author xs
		 * @
		 */	
		//$G("$WV", Class.create());
		$WV=Core.Class.create();
		Core.Class.extend($WV.prototype, {
			/**
			 *  初始化
			 * @author xs
			 */			
			"isPaginInited" : false,
		    initialize: function(){
				this.currSelect = null;
				this.currVid = null;
				this.videoList = {};
		    },
			/**
			 *  将视频信息添加到列表
			 * @author xs
			 */				
		    addVideo : function (id, vObj) {
				this.videoList[id] = vObj;
		    },
			/**
			 *  选择列表中的视频
			 * @author xs
			 */				
		    selectVideo : function (e) {
				if(this.currSelect) this.currSelect.className = '';
				/**wujian**/
				//var el = $(Event.element(e));
				var el=Core.Events.getEventTarget(e);
				//var li = Event.findElement(e,'li');
				var li=el.parentNode;
				li.className = 'current';
				if(el.tagName.toLowerCase() == 'img'){
					//el = el.next('input');
					el=el.nextSibling;
					el.checked = true;					
				} 
				this.currSelect = li;
				this.currVid = el.value;
				top.trace("select!!!");
				var bIns = $E('button_insert');
				bIns.disabled = false;
				//bIns.className = '';
		    },
			/**
			 *  返回当前选择的视频信息
			 * @author xs
			 */				
		    getCurrVideo : function () {
				var cur = this.videoList[this.currVid];
				if(!cur) return {};
				return cur;
		    },
		    
			//分页程序 
		    initPagination : function(count){
		    	var self = this;
				var maxPage = Math.ceil(count/10, 10);
				if(maxPage > 1){
					Ui.Pagination.init({
						"pageNode" : "vPageMsg",
						"nodeClassNamePrefix" : "SG",
						"maxPage" : maxPage,
						pageTpl : function(nPage){
							self.goVideoPage(nPage);
						}
					}).show();
				}
		    },
			/**
			 * 视频分页
			 * @param {Number} nPageNum 请求视频分页数据
			 * @author FlashSoft | fangchao@staff.sina.com.cn
			 * xiugai  wujian 第一页 ok
			 */
			goVideoPage: function (nPageNum) {
				//读取播客接口，显示视频列表
				Lib.checkAuthor();
				
				var url='http://you.video.sina.com.cn/interface/user/userVideoByBlog.php?uid='+$UID+'&page='+nPageNum+'&size=10&varname=yourVideoList';
				var self = this;
				top.trace("url="+url)
				Utils.Io.JsLoad.request(url, {
					isCached : true,
					onComplete:function(response){
						
						var pannel = $E('boke_videos');
						pannel.innerHTML = "";
						var list = response.list;
						top.trace(response.count);
						if(!list.length) {
							pannel.innerHTML = '您的新浪播客暂无视频！';
							return;
						}
						Core.Array.foreach(list,function(cur){
							
							var img =  Core.Dom.createNode('img',{"width":80,"height":60,src:cur.imgurl});
							img["height"]=60;
							img["width"]=80;
							var rdo;
							if (!$IE) {
								rdo = Core.Dom.createNode('input', {
									type: 'radio',
									name: 'vId',
									id: cur.vid,
									className: 'left',
									style: 'margin:0;padding:0;',
									value: cur.vid
								});
							}else{
								var tempInputStr='<input type="radio" name="vId" id="{vid}" class="left" style="margin:0px;padding:0px;" value="{vid}" >';
								tempInputStr = tempInputStr.replace(/{vid}/gi, cur.vid);
                                rdo = document.createElement(tempInputStr);
							}
							
							var label  =  Core.Dom.createNode('label',{className:'left', title: cur.title,  'for':cur.vid }, Core.String.shorten(cur.title,4));
							
							//var li =  Core.Dom.createNode('li','',[img, rdo, label]);
							var li =  Core.Dom.createNode('li');
							li.appendChild(img);							
							li.appendChild(rdo);
							li.appendChild(label);
							top.trace("url=="+cur.imgurl)
							//Core.Dom.children(pannel,[li]);
							pannel.appendChild(li);
							top.trace("9");
							var evtSel = Core.Function.bind2(oVideo.selectVideo,oVideo);
							Core.Events.addEvent(img,evtSel,"click");
							Core.Events.addEvent(rdo,evtSel,"click");
							//$(img).observe('click', evtSel);	
							//$(rdo).observe('click', evtSel);
							//将视频信息添加到列表以便管理
							top.trace("10");
							oVideo.addVideo(cur.vid, cur);
							
						})
						//list.each();
						if(!self.isPaginInited) {
							self.initPagination(response.count);
							self.isPaginInited = true;
						}
						$E('button_insert').disabled = true;
					}
				});	
			}
		});

	});

	$registJob("initElements", function(){
		//trace("traced by job[initElements]");
		//**** 初始化页面元素 *****	
		//var showTrace = 1;
		//$E("SinaTrace").style.display = !showTrace?'none':'block';
		//Sina.debug.Trace.move(600, 0);

	});

	$registJob("initEvents", function(){
		//trace("traced by job[initEvents]");	

		/**
		 *  全局实例
		 * @author xs
		 */		
		//$G("oVideo", new $WV());
		oVideo=new $WV();
		
		oVideo.goVideoPage(1);
		top.trace("goVideoPage")
		//插入按钮	
		Core.Events.addEvent($E('button_insert'),function(){
			top.trace("insert ")
			var s = '当前选择的视频id是：'+ oVideo.getCurrVideo().vid+'\n当前选择的视频title是：'+ oVideo.getCurrVideo().title+'\n当前选择的视频url是：'+ oVideo.getCurrVideo().imgurl;
			//trace(s);
			try{			
				top.ArticleVIDEOFuncs.addVIDEOList(oVideo.getCurrVideo().imgurl, oVideo.getCurrVideo().vid);
			}catch(e){
				//trace('找不到视频插入回调函数……');
			}
		},"click")
		//$('button_insert').observe('click', );
			
	});
})();
