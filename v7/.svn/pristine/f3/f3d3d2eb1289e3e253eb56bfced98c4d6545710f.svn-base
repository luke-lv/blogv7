/*
* author : meichun1@staff.sina.com.cn 
* 育儿博客注册 选择状态
* 17:38 2010/8/5
*/
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/array/findit.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/getElementsByClass.js");

$registJob("baby_open", function() {

		/* 切换状态添加事件*/

		var babyli = $T($E('baby_state'), 'li'),
		baby_checkstate = Core.Dom.byClz(document, "div", "baby_checkstate"),
		babyStateElem = $E('baby_state').parentNode,
		prev = Core.Dom.byClz(document, "a", "prev");

		Core.Array.foreach(babyli,
		function(elem, i) {

				/*鼠标 移进 某种状态的图标时触发*/
				Core.Events.addEvent(elem,
				function() {
						elem.style.position = "relative"; // 使position = "relative"使弹出信息位置参考该元素, 去掉.baby_state li{ ***position : "relative"****** }
						elem.className += " hover";
				},
				'mouseover');

				/*鼠标 移出 某种状态的图标时触发*/
				Core.Events.addEvent(elem,
				function() {
						elem.style.position = "static"; //position = "static"使透明度继承
						elem.className = elem.className.replace(' hover', "");
				},
				'mouseout');

				/*鼠标 点击 某种状态的图标时触发*/
				Core.Events.addEvent(elem,
				function() {
						elem.className = elem.className.replace(' hover', ""); //点击时去掉hover状态
						elem.style.position = "static"; //position = "static"使透明度继承
						slide(i, 0); //渐进渐出效果
						return false;
				});
		});

		/* 点击"返回重新选择"时回到初始状态 */

		Core.Array.foreach(prev,
		function(elem, i) {
				elem.onclick = function() {
						slide(i, 1);
						return false;
				};
		});
		
		
		var main = Core.Dom.byClz(document.body, 'div', 'main')[0];
		
		var top = $IE6||$IE7?"102px":"103px";
		scope.baby=scope.baby||{};
		scope.baby.main=main;

		/*渐进渐出效果*/

		function slide(i, turnback) {
				var babyArr = scope.baby.babyArr;
				var a = babyStateElem;
				var b = baby_checkstate[i];
				var c;
				if (turnback) {
						c = a;
						a = b;
						b = c;
				}

				if ($IE) {
						/*IE对于position为非static的子元素，透明度不能继承。并且在设置了style.filter后，会截掉该子元素超出高度的部分。因此对该子元素单独设置透明渐变效果*/
						var por = Core.Dom.byClz(baby_checkstate[i], 'span', 'baby_statetit')[0];
						porcopy = por.cloneNode(true);
						por.style.visibility = "hidden";

						main.appendChild(porcopy);
						porcopy.style.left = "78px";
						porcopy.style.top = top;
						Core.Dom.setStyle(porcopy, 'opacity', turnback ? 1 : 0);

				}
				var endFun = {
						end: function() {
								por.style.visibility = "visible";
								porcopy.parentNode.removeChild(porcopy);
						}
				};
				Ui.tween(a, 'opacity', 0, .2, 'simple', {
						end: function() {

								/*渐进效果结束后 ， 表单重置，并且删除可能添加的多个宝宝的节点  */
								
								document.babyinfo.reset();
								if (i == 2 && turnback) {
										while (babyArr[1]) {
												var o = babyArr.pop().elem;
												o.parentNode.removeChild(o);
										}
										
										Core.Dom.byClz(babyArr[0].elem, "span", "del")[0].style.display = "none";
										
										scope.baby.incomplete=null;
										
										$E("addbaby").style.display="block";
											
										/*隐藏可能出现的错误提示信息*/
										Core.Array.foreach(Core.Dom.byClz(a, 'p', 'err'),
										function(elem) {
												elem.style.display = "none";
										});
								}

								//在其透明度为0时 使 其不占位置，设置.display "none";
								a.style.display = "none";

								Core.Dom.setStyle(b, 'opacity', 0);
								b.style.display = "block";
								if ($IE && !turnback) {

										Ui.tween(porcopy, 'opacity', 1, .4, 'simple', endFun); //IE中使得clone元素同步透明渐变
								}
								Ui.tween(b, 'opacity', 1, .4, 'simple', {
										end: function() {
												b.style.filter = ""; //IE中设置后不会截掉超出容器的内容
										}
								});
						}
				});
				if ($IE && turnback) {
						Ui.tween(porcopy, 'opacity', 0, .2, 'simple', endFun); //IE中使得其下的非position = "absolute"元素同步透明渐变
				}
		}

});