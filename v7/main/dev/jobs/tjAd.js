/**
 * @fileInfo	广告天梯套装！！除顶部广告外，其他广告在普通文章也显示
 * @author		dcw1123 | chengwei1@staff.sina.com.cn
 * @modified   Qiangyee | wangqiang1@staff 
 *	@modified  包窗广告修改 Modified by gaolei2@ 2013-12-10
 */

$import("lib/jobs.js");
$import("sina/utils/io/jsload.js");
$import("article/ad/commAd.js");
$import("article/ad/insertIns.js");
$import("lib/checkAuthor.js");
$import("lib/execZhitou.js");
$import("lib/listener.js");
$import("lib/sendLog.js");
//如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe
$import("jobs/searchToQing.js");
$import("jobs/680.js");
$import("other/SinaEx.js");
$import("sina/utils/insertTemplate.js");

$registJob("tjAd", function() {
	// 随时行：scroll
	// 评论：comment
	// 博文推荐包框：video
	// 左侧商讯：leftsx
	// 顶通：topbanner
	// console = {};
	// console.log = trace;
	scope.isFromSearchEngine = Article.getSearchReferrer(); //判断是否来自搜索引擎
	var isTj = window.location.href.indexOf("tj=1") > - 1;

	var isMid = scope.$pageid.indexOf("articletj") > - 1;

	new blogAd.CommAd();

	var cdn = ~~ (Math.random() * 100) % 10;

	var adJsDomain = 'http://d' + cdn + '.sina.com.cn'
	Lib.util.loadScript(adJsDomain + '/litong/zhitou/sinaads/release/spec/getSinaadsExParamsForBlog.js', function() {});
	(function() {
		if (!isMid) {
			// 博客推荐博文页与博客推荐博文夹页打通顶部两轮播950*90通栏
			Lib.execZhitou(function(res) {
				var listener = Lib.Listener;
				var $adEl = blogAd.insertIns('PDPS000000049439', $E("trayFlashConnetion").parentNode, 'beforebegin');
				listener.notify('topad680-show-start', {});
				function end() {
					var $blogbody = $E('sinabloga');
					if ($blogbody) {
						var $rndv = $E('ramdomVisitDiv');
						$rndv && ($rndv.style.top = $blogbody.offsetTop + 'px');
					}

				} (window.sinaads || []).push({
					element: $adEl,
					params: {
						sinaads_success_handler: function() {
							end();
							// trace('topad680-show-end: sinaads_success_handler');
							listener.notify('topad680-show-end', {
								show: ! 0
							});
						},
						sinaads_fail_handler: function() {
							end();
							// trace('topad680-show-end: sinaads_fail_handler');
							listener.notify('topad680-show-end', {
								show: ! 1
							});
						}
					}
				});
			});
		} else {
			// 新增博客推荐博文夹页两轮播广告
			// Modified by zhihang1@ 2015-01-21
			var m904 = $E('module_904');
			var tj2Tpl = '<div class="right_fixed_area"  id="rightFixedArea"></div>';
			Utils.insertTemplate(m904, tj2Tpl, 'beforebegin');
			//插入需要的样式
			var tj2Style = document.createElement('style');
			var cssText = ['.right_fixed_area{margin-bottom:10px;}',
				'.right_fixed{position: fixed;top: 0;width: 300px;}'].join('\n');
			tj2Style.setAttribute('type', 'text/css');
			if(tj2Style.styleSheet){ //IE
				tj2Style.styleSheet.cssText = tj2Style.innerHTML + cssText;
			}else {
				tj2Style.appendChild(document.createTextNode(cssText));
			}
			$T(document, 'head')[0].appendChild(tj2Style);

			Lib.execZhitou(function(res){
				
				var $adEl = blogAd.insertIns('PDPS000000055753', $E('rightFixedArea'), 'afterbegin');
				(window.sinaads || []).push({
					element : $adEl,
					params : {
						sinaads_success_handler : function() {
							// $adEl.style.marginBottom = '10px';
							//画中画悬停
						    var reIE = /MSIE\s([^;]*)/;
						    var browser = {
						        ie: 0,
						        loaded: false
						    };
						 
						    (function (browser) {
						        function toNumber(str) {
						            var count = 0;
						            return parseFloat(str.replace(/\./g, function () {
						                count++;
						                return (count === 1) ? '.' : '';
						            }));
						        }
						 
						        var ua = (navigator && navigator.userAgent) || '';
						        var temp = ua.match(reIE);
						        if (temp && temp[1]) {
						            browser.ie = toNumber(temp[1]);
						        }
						    })(browser);
						 
						    (function () {
						        var utils = {
						            byId: function (id) {
						                if (typeof id !== 'string') {
						                    return id;
						                } else {
						                    return document.getElementById(id);
						                }
						            },
						            getByClassName: function (str, root, tag) {
						                if (root) {
						                    root = typeof root == "string" ? document.getElementById(root) : root
						                } else {
						                    root = document.body
						                }
						                tag = tag || "*";
						                var els = root.getElementsByTagName(tag), arr = [];
						                for (var i = 0, n = els.length; i < n; i++) {
						                    for (var j = 0, k = els[i].className.split(" "), l = k.length; j < l; j++) {
						                        if (k[j] == str) {
						                            arr.push(els[i]);
						                            break;
						                        }
						                    }
						                }
						                return arr;
						            },
						            hasClass: function (elem, cls) {
						                var reg = new RegExp('(^|\\s)' + cls + '($|\\s)');
						                return reg.test(elem.className);
						            },
						            removeClass: function (elem, cls) {
						                var reg = new RegExp('(^|\\s)' + cls + '($|\\s)', 'g');
						                elem.className = elem.className.replace(reg, ' ');
						            },
						            addClass: function (elem, cls) {
						                if (!utils.hasClass(elem, cls)) {
						                    elem.className += ' ' + cls;
						                }
						            },
						            viewData: function () {
						                var e = 0, l = 0, i = 0, g = 0, f = 0, m = 0;
						                var j = window, h = document, k = h.documentElement;
						                e = k.clientWidth || h.body.clientWidth || 0;
						                l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
						                g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
						                i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
						                f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
						                m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
						                return {scrollTop: g, scrollLeft: i, documentWidth: f, documentHeight: m, viewWidth: e, viewHeight: l};
						            }
						        };
						 
						        function getPosition(a) {
						            for (var b = {x: 0, y: 0}; a.offsetParent;)
						                b.x += a.offsetLeft, b.y += a.offsetTop, a = a.offsetParent;
						            return b
						        }
						 
						        function addEvent(obj, eventType, func) {
						            if (obj.attachEvent) {
						                obj.attachEvent("on" + eventType, func);
						            } else {
						                obj.addEventListener(eventType, func, false)
						            }
						        };
						 
						        if (browser.ie != 6) {
						            var container = utils.byId('rightFixedArea');
						            var sidebar = utils.byId('column_2');
						 
						            var theY = getPosition(sidebar).y + sidebar.offsetHeight;
						            setTimeout(function () {
						                theY = getPosition(sidebar).y + sidebar.offsetHeight;
						            }, 1000);
						            function adjustADPosition(bottomHeight) {
						                var adY = getPosition(sidebar).y + sidebar.offsetHeight;
						                if (adY != 0) {
						                    if (utils.hasClass('container', 'right_fixed')) {
						                        theY = adY + container.offsetHeight;
						                    } else {
						                        theY = adY;
						                    }
						                }
						                var adH = container.offsetHeight;
						                var vD = utils.viewData();
						                if (vD.documentHeight - bottomHeight - vD.scrollTop >= adH) {
						                    if (vD.scrollTop >= theY) {
						                        utils.addClass(container, 'right_fixed');
						                    } else {
						                        utils.removeClass(container, 'right_fixed');
						                    }
						                } else {
						                    utils.removeClass(container, 'right_fixed');
						                }
						            }
						 
						            var scrollTimeout = null;
						            var scrollCallback = function () {
						                adjustADPosition(160);
						            };
						            var resizeTimeout = null;
						            addEvent(window, 'scroll', function () {
						                if (scrollTimeout) window.clearTimeout(scrollTimeout);
						                scrollTimeout = window.setTimeout(scrollCallback, 10);
						            });
						            addEvent(window, 'resize', function () {
						                if (resizeTimeout) window.clearTimeout(resizeTimeout);
						                resizeTimeout = window.setTimeout(scrollCallback, 10);
						            });
						        }
						    })();
						}
					}
				})
			});
		}

		Lib.execZhitou(function(res) {
			// 包窗广告修改
			// Modified by gaolei2@ 2013-12-10
			var $adEl = blogAd.insertIns('PDPS000000051781');
			$adEl.style.display = "none";
			var popAd = blogAd.popAd();
			(window.sinaads || []).push({
				element: $adEl,
				params: {
					sinaads_success_handler: function(elem, data) {
						elem.style.display = "none";
						var result;
						function sinaadsAdapter(saxData) {
							var result = {};
							if (data.content[0].src[0].replace(/(^\s*)|(\s*$)/g, "").length === 0) {
								result.isAD = false;
							} else {
								result = {
									isAD: true,
									flashURL: adJsDomain + "/litong/kuaijieweibo/yafeng/boke/sc/bk.swf",
									flashWidth: 293,
									flashHeight: 60,
									picURL: saxData.content[0].src[0],
									clickUrl: saxData.content[0].link[0],
									borderImg: adJsDomain + "/litong/kuaijieweibo/yafeng/boke/images/imgbgnn.gif",
									btnImg: adJsDomain + "/201007/09/237719_btn.gif",
									logurls: saxData.content[0].monitor
								};
							}
							return result;
						};

						result = sinaadsAdapter(data);
						popAd.renderPopAd(result);

					},
					sinaads_fail_handler: function(elem, data) {
						elem.style.display = "none";
						popAd.renderPopAd({
							isAD: false
						})
					}
				}
			});
		});

		if (!isMid) {
			Lib.checkAuthor();
			var isShow = !$isAdmin;
			if (!isShow) return;
			// 左侧商讯广告，不需要我们来维护了，终于解脱了！
			Lib.execZhitou(function(res) {
				//营运说要放在qing组件前面 2012年6月26日@liming9
				//精彩图文组件下线 910 911没有了
				// var beforeNode, m911 = $E("module_910") || $E("module_911");
				// m911 && (beforeNode = SinaEx.prev(m911));
				var beforeNode;
				if (!beforeNode) {
					var n = $E("module_904") || $E("module_903");
					var c = n.parentNode.children;
					if (3 > c.length) {
						beforeNode = n.parentNode.lastChild;
					} else {
						beforeNode = c[2];
					}
				}
				// var adEl = blogAd.insertIns('PDPS000000033239', beforeNode, 'afterend');
				// (window.sinaads || []).push({
				// 	element: adEl,
				// 	params: {
				// 		sinaads_success_handler: function() {
				// 			adEl.style.marginBottom = '10px';
				// 			adEl.setAttribute('suda-uatrack', 'key=blog_article&value=h_article52');
				// 		}
				// 	}
				// });
				// 
				// 用55124广告替换掉33239广告，以后下掉淘宝广告后再改回来  added  by  gaolei2@  2014-10-29
				// var newEl = blogAd.insertIns('PDPS000000055124', adEl, 'afterend');
				var newEl = blogAd.insertIns('PDPS000000055124', beforeNode, 'afterend');
				(window.sinaads || []).push({
					element: newEl,
					params: {
						sinaads_success_handler: function() {
							newEl.style.marginBottom = '10px';						}
					}
				});
			});
		}
	})();
	(function() {
		// 博文页底部通栏广告
		Lib.Listener.on({
			name: 'blogRecommendAfter',
			callBack: function(isHidden) {
				Lib.execZhitou(function(res) {
					var url = adJsDomain + '/litong/zhitou/zhangfei/blog/blog_bottom_float.js';
					Lib.util.loadScript(url, function() {
						(sinaads = window.sinaads || []).push({
							element: adEl,
							params: {}
						});
					});
					var adEl = blogAd.insertIns('PDPS000000052950', document.body);
				});
			}
		});
	})();
	(function() {
		// 博文内广告埋点
		function articleWrapperAd(data) {
			// 检查是否为分成广告博主
			if (!data.shareAdBloger || ! data.shareAdBloger.result) {
				return;
			}
			var main = $E('sina_keyword_ad_area2');
			var reblog = Core.Dom.byClz(main, 'div', 'blogzz_acon')[0];
			if (reblog) {
				main = reblog;
			}
			var child, adnode, offset = 0,
			size = 0,
			afterNode, txt, specOffset = 280; // 指定文本高度超出280在次节点的前边插入广告节点
			function text(node) {
				return ('textContent' in node) ? node.textContent: node.innerText;
			}

			function isImg(img) {
				var src = img.getAttribute('real_src') || "";
				if (src.indexOf('http://www.sinaimg.cn/uc/') === 0) {
					return false;
				} else if (0 == src.indexOf('http://simg.sinajs.cn/blog7style/')) {
					return false;
				}
				return true;
			}
			function containsImg(node) {
				var imgs = node.getElementsByTagName('img');
				for (var i = 0, len = imgs.length; i < len; i++) {
					if (isImg(imgs[i])) {
						return true;
					}
				}
				return false;
			}

			// 从后往前查找
			for (var i = main.children.length - 1; i >= 0; i--) {
				child = main.children[i];
				if (!containsImg(child)) {
					txt = text(child);
					size += txt.length
					offset += child.offsetHeight;
				} else {
					offset = 0;
					size = 0;
				}
				if (i > 1 && (offset > specOffset)) {
					afterNode = child;
					break;
				}
			}
			adnode = $C('div');
			adnode.style.cssText = 'display: none; width: 200px; height: 300px; margin: 10px 20px 10px 0px; float: left; overflow: hidden; clear: both; padding: 4px; border: 1px solid rgb(205, 205, 205);';
			//TODO 需要删除此节点
			// adnode.innerHTML = '<a href="http://www.baidu.com" target="_blank"><img src="http://d7.sina.com.cn/pfpghc/f61e001e2e014ba98f1da475fa662d61.jpg" width="200" height="300"/></a>'
			if (!afterNode) {
				main.appendChild(adnode);
			} else {
				main.insertBefore(adnode, afterNode);
			}
			Lib.execZhitou(function(res) {
				// 广告分成博文内广告
				var adEl = blogAd.insertIns('PDPS000000053083', adnode);
				(sinaads = window.sinaads || []).push({
					element: adEl,
					params: {
						sinaads_success_handler: function() {
							adnode.style.display = 'block';
						},
						sinaads_fail_handler: function() {}
					}
				});
			});

		}
		// 下线博主分成广告 @zhihang1 20150303
		// if (!scope.$channel) {
		// 	Lib.Listener.on({
		// 		name: 'ad_show_hide_conditions',
		// 		callBack: function(data) {
		// 			articleWrapperAd(data);
		// 		}
		// 	});
		// } else {
		// 	articleWrapperAd(scope.$channel);
		// }
	})();

});

