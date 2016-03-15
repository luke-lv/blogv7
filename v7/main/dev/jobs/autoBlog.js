/**
 * @fileoverview 汽车博客
 * @author Luo Rui | luorui1@staff.sina.com.cn
 * @created 2010-4-7
 * @others 已经没有项目用该job  gaolei
 */

$import('sina/sina.js');
$import('sina/utils/io/jsload.js');
$import('lib/checkAuthor.js');
$import('lib/getTplNum.js');

$registJob('autoBlog', function(){

	Lib.checkAuthor();
	if ($isAdmin){ //如果是博主直接渲染，scope.tpl是可靠的。
		renderAutoBlog();
	}else{ //否则先获得可靠的scope.tpl再渲染
		Lib.getTplNum(renderAutoBlog);
	}
	
	function renderAutoBlog(){
		if (scope.tpl == '10_71'){
			var newsNode = $E('auto_news');
			var focusNode = $E('auto_focus');
			if (newsNode && focusNode){
				var timer2; //新闻滚动用
				var timer3; //焦点图用
				var dataUrl = 'http://auto.sina.com.cn/338/20100408/16.js';
				var dataPool = { //防止接口失败用的假数据
						"items":[
							{
								"title":"2010北京车展30万元以上可购新车推荐",
								"link":"http://auto.sina.com.cn/news/2010-04-13/0134588586.shtml"
							},
							{
								"title":"奔腾抽奖签售日优惠",
								"link":"http://auto.sina.com.cn/news/2010-04-13/0953588819.shtml"
							},
							{
								"title":"凯美瑞混合动力上市",
								"link":"&nbsp;http://bbs.auto.sina.com.cn/24/190/thread-1588420-1-1.html"
							},
							{
								"title":"奔驰将携旗下四大品牌38款车型现身北京车展",
								"link":"http://auto.sina.com.cn/car/2010-04-12/1048588366.shtml"
							},
							{
								"title":"雷诺七款车将亮相北京车展新风景亚洲首发",
								"link":"http://auto.sina.com.cn/car/2010-04-12/0913588266.shtml"
							},
							{
								"title":"江淮概念车愿景IV实车将亮相",
								"link":"http://auto.sina.com.cn/car/2010-04-12/2126588549.shtml"
							},
							{
								"title":"江淮悦悦参数曝光",
								"link":"http://auto.sina.com.cn/car/2010-04-12/1043588364.shtml"
							},
							{
								"title":"上海大众新POLO谍拍曝光",
								"link":"http://auto.sina.com.cn/news/2010-04-06/2315586104.shtml"
							},
							{
								"title":"吉利北京车展揭秘",
								"link":"http://auto.sina.com.cn/news/2010-04-09/1537587705.shtml"
							},
							{
								"title":"奥迪A3推1.8T和1.4T引擎",
								"link":"http://auto.sina.com.cn/news/2010-04-06/2224586101.shtml"
							},
							{
								"title":"Honda携最新环保车参展",
								"link":"http://auto.sina.com.cn/news/2010-04-12/1346588430.shtml"
							},
							{
								"title":"华晨参展车模大揭秘美女如云",
								"link":"http://bbs.auto.sina.com.cn/61/69/thread-1588658-1-1.html"
							},
							{
								"title":"丰田将携多款主力车型亮相4月北京车展",
								"link":"http://auto.sina.com.cn/news/2010-04-12/1116588386.shtml"
							},
							{
								"title":"贴身实拍三厢英朗GT车型参数配置抢先曝光",
								"link":"http://auto.sina.com.cn/news/2010-04-06/2335586109.shtml"
							},
							{
								"title":"2010款新花冠终于出炉售价或将维持不变",
								"link":"http://auto.sina.com.cn/car/2010-04-06/2303586103.shtml"
							},
							{
								"title":"北京车展十大猜想车市拐点还是兴奋点？",
								"link":"http://auto.sina.com.cn/news/2010-04-06/0902585747.shtml"
							},
							{
								"title":"全新宾利旗舰车型Mulsanne即将亮相北京车展",
								"link":"http://auto.sina.com.cn/news/2010-03-31/1023584042.shtml"
							},
							{
								"title":"法拉利599GTO",
								"link":"http://auto.sina.com.cn/news/2010-04-12/0820588198.shtml"
							},
							{
								"title":"法拉利458Italia北京车展发布",
								"link":"http://auto.sina.com.cn/car/2010-04-07/1822586714.shtml"
							},
							{
								"title":"比亚迪SUV无伪实拍谍照曝光北京车展将推出",
								"link":"http://auto.sina.com.cn/news/2010-04-01/0845584463.shtml"
							},
							{
								"title":"布嘉迪威航16.4GrandSport将亮相车展",
								"link":"http://auto.sina.com.cn/car/2010-03-19/0958579422.shtml"
							}
						],
						"focus":[
							{
								"title":"凯迪拉克XTS、Converj将首映北京车展",
								"link":"http://auto.sina.com.cn/photo/highpix/jlqczppdh.shtml",
								"img":"http://i3.sinaimg.cn/qc/buy/U2050P33T133D14368F2028DT20100413103911.jpg"
							},
							{
								"title":"奔驰将携旗下四大品牌38款车现身北京车展",
								"link":"http://auto.sina.com.cn/car/2010-04-12/1048588366.shtml",
								"img":"http://i1.sinaimg.cn/qc/buy/U2050P33T133D14345F2023DT20100412113003.jpg"
							},
							{
								"title":"丰田将携多款主力车型亮相4月北京车展",
								"link":"http://auto.sina.com.cn/news/2010-04-12/1116588386.shtml",
								"img":"http://i0.sinaimg.cn/qc/buy/U2050P33T133D14345F2022DT20100412113003.jpg"
							},
							{
								"title":"江淮概念车愿景IV草图曝光实车将亮相北京",
								"link":"http://auto.sina.com.cn/car/2010-04-12/2126588549.shtml",
								"img":"http://i0.sinaimg.cn/qc/buy/U2050P33T133D14368F2029DT20100413103911.jpg"
							},
							{
								"title":"专业看展团正在招募",
								"link":"http://bbs.auto.sina.com.cn/63/126/thread-1555452-1-1.html",
								"img":"http://i0.sinaimg.cn/qc/2010/0318/201031812152.jpg"
							}
						]};

				focusNode.style.width = '144px';
				focusNode.style.height = '95px';
				focusNode.style.overflow = 'hidden';

				/**
				 * 载入汽车频道数据
				 */
				function loadAutoData(cbFunc){
					Utils.Io.JsLoad.request(dataUrl, {
						onComplete: function(){
							if (typeof cbFunc == 'function'){
								if (window._DATA_SINA_CARS) {
									dataPool = window._DATA_SINA_CARS;
								};
								cbFunc();
							}
						},
						onException: function(){
						},
						timeout: 15000
                        ,isRemove : false
					});
				}

				/**
				 * 渲染并滚动汽车新闻
				 */
				function renderInfo(){
					var listStr = '';
					var focusIndex = 0;
					listStr += '<ul id="auto_newslist" style="height:100px;overflow:hidden">';
					for (var n = 0, m = (dataPool.items.length); n < m; n++){
						listStr += '<li><a href="' + dataPool.items[n].link + '" target="_blank" title="' + dataPool.items[n].title + '">' + dataPool.items[n].title + '</a></li>'
					}
					listStr += '</ul>';
					newsNode.innerHTML = listStr;
					
					//汽车新闻滚动
					clearInterval(timer2);
					clearTimeout(timer2);
					(function(){
						var spd = 2; //滚动速度
						var rows = 5; //一次滚动几行
						var waiting = 10; //滚动间歇时间
						var pause = false;
						var node = $E('auto_newslist');
						setTimeout(function(){
							timer2 = setInterval(function upnews(){
								if (pause) return;
								node.scrollTop += spd;
								if (node.scrollTop >= 20 * rows){
									clearInterval(timer2);
									for (var n = 0; n < rows; n++)
										node.appendChild($T(node, 'li')[0]);
									node.scrollTop = 0;
									timer2 = setTimeout(function(){
										timer2 = setInterval(upnews, 13);
									}, waiting * 1000);
								}
							}, 13);
						}, waiting * 1000)
						node.onmouseover = function(){pause = true;}
						node.onmouseout = function(){pause = false;}
					})();

					//焦点图切换
					clearTimeout(timer3);
					(function(){
						var waiting = 10; //切换时间间隔
						focusNode.innerHTML = '<a href="' + dataPool.focus[focusIndex]['link'] + '" target="_blank" title="' + dataPool.focus[focusIndex]['title'] + '"><img style="width:144px;height:95px" src="' + dataPool.focus[focusIndex]['img']+ '"/></a>';
						focusIndex++;
						if (focusIndex >= dataPool.focus.length){
							focusIndex = 0;
						}
						timer3 = setTimeout(arguments.callee, waiting * 1000);
					})();
				}
				
				//提供的公共方法
				scope.$startAutoNews = function(){
					loadAutoData(function(){
						renderInfo();
					});
				};
				scope.$stopAutoNews = function(){clearInterval(timer2);clearTimeout(timer2);}

				//开始新闻
				scope.$startAutoNews();
			}
		}
	}

});