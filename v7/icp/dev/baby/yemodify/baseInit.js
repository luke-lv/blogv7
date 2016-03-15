$import("sina/core/dom/opacity.js");

if(!scope.yemodify) {
	scope.yemodify = {};
}
(function(){
	scope.yemodify.currBBStateURL = "http://control.blog.sina.com.cn/admin/article/babybar.php";
    scope.yemodify.getDataURL = "http://control.blog.sina.com.cn/riaapi/profile/show_base_ext.php";
    scope.yemodify.modifyDataURL = "http://control.blog.sina.com.cn/riaapi/profile/edit_base_ext.php";
	
	var now = scope.$current_time.split('-');
    scope.yemodify.nowYear = parseInt(now[0]);
    scope.yemodify.nowMonth = parseInt(now[1].charAt(0) == '0' ? now[1].charAt(1) : now[1]);
	
	scope.currentBabyType = parseInt($E('babystates').getAttribute('babystates'));
	scope.currentBabyOld = scope.currentBabyType;
	scope.babyShowIsBusy = false;
	
	/**
	 * 各独立页面间的切换
	 * @param {Object} show
	 * @param {Object} hidden
	 * @param {Object} opt
	 */
	scope.yemodify.exchangeShow = function(show,hidden,opt) {
		var val = 100;
		opt = opt || {};
		if(opt.beforeChange) {
			opt.beforeChange(show,hidden);
		}
		scope.babyShowIsBusy = true;
		var timmer1;
		var timmer2;
		try {
			timmer1 = setInterval(function(){
				if (val <= 0) {
					clearInterval(timmer1);
					Core.Dom.opacity(show, 0);
					hidden.style.display = 'none';
					Core.Dom.opacity(hidden, 100);
					show.style.display = '';
					if (opt.firstHidden) {
						opt.firstHidden(show, hidden);
					}
					timmer2 = setInterval(function(){
						if (val >= 100) {
							if (opt.finalCallBack) {
								opt.finalCallBack(show, hidden);
							}
							clearInterval(timmer2);
							scope.babyShowIsBusy = false;
						}
						else {
							val += 10;
							Core.Dom.opacity(show, val);
						}
					}, 10);
				}
				else {
					val -= 10;
					Core.Dom.opacity(hidden, val);
				}
			}, 10);
		} catch(e) {
			try {
				clearInterval(timmer1);
			} catch(e){}
			try {
				clearInterval(timmer2);
			} catch(e){}
			scope.babyShowIsBusy = false;
		}
	}
	
	scope.yemodify.initChnageIcon = function(ele) {
		var modifyme = $E('modifyme');
		ele.onclick = function(){
			if(scope.babyShowIsBusy) {
				return;
			}
			var parent = ele.parentNode;
			scope.yemodify.exchangeShow($E('modifyme'),parent.parentNode,{
				beforeChange : function(){
					//parent.style.position = 'static';
					ele.style.display = 'none';
					parent.parentNode.style.width = parent.parentNode.offsetWidth+'px';
					parent.parentNode.style.height = parent.parentNode.offsetHeight+'px';
				}
				,firstHidden : function(){
					//var lis = modifyme.getElementsByTagName('li');
					//for(var i=0; lis[i]; i++) {
					//	lis[i].style.position = 'static';
					//}
					parent.parentNode.style.cssText = '';
					parent.parentNode.innerHTML = '';
				}
				,finalCallBack : function() {
					//var lis = modifyme.getElementsByTagName('li');
					//for(var i=0; lis[i]; i++) {
					//	lis[i].style.position = 'relative';
					//}
					//parent.parentNode.style.width = '';
				}
			});
			return false;
		}
	}
	
	/**
	 * 回滚到修改前
	 */
	scope.yemodify.rollBack = function() {
		//先回滚状态
		var tmp = {'t_1':$E('BYStatesM'),'t_2':$E('ZMStatesM'),'t_3':$E('BBStatesM')};
		tmp = tmp['t_'+scope.currentBabyType];
		scope.currentBabyType = scope.currentBabyOld;
		//隐藏关闭所有的显示
		$E('BYStates_show').style.display = 'none';
		$E('ZMStates_show').style.display = 'none';
		$E('BBStates_show').style.display = 'none';
		//隐藏所有的编辑
		$E('BYStatesM').parentNode.style.display = 'none';
		$E('ZMStatesM').parentNode.style.display = 'none';
		$E('BBStatesM').parentNode.style.display = 'none';
		switch(scope.currentBabyType) {
			//显示对应的编辑按钮，并执行点击。
			case 1 : {
				$E('BYStatesM').parentNode.style.display = '';
				$E('BYStates_show').style.display = '';
				break;
			}
			case 2 : {
				$E('ZMStatesM').parentNode.style.display = '';
				$E('ZMStates_show').style.display = '';
				break;
			}
			case 3 : {
				$E('BBStatesM').parentNode.style.display = '';
				$E('BBStates_show').style.display = '';
				break;
			}
			case 0 : {
				//scope.yemodify.exchangeShow(,tmp);
				//新增
				$E('newBabyAdderOut').style.display = '';
			}
		}
	}
	
	/**
	 * 最终提交成功，保存内容到页面
	 */
	scope.yemodify.commit = function() {
		//只需要保存状态
		scope.currentBabyOld = scope.currentBabyType;
		$E('babystates').setAttribute('babystates',scope.currentBabyOld);
		scope.$is_userext.family = 1;
		$E('babyInfoPercent').innerHTML = '已完成100%';
	}
    
    scope.yemodify.addEvent = function (ele, func, ev){
        //		if(ele.join) {
        //			for(var i=0; ele[i]; i++) {
        //				ele[i]['on'+ev] = func;
        //			}
        //		} else {
        ele['on' + ev] = func;
        //		}
    }
    
    scope.yemodify.onmodify = function(ele, callBack){
        ele.onclick = (function(el){
            return function(){
                var lodingImg = $C('img');
                lodingImg.src = 'http://blogimg.sinajs.cn/v5images/icon/loading.gif';
                lodingImg.style.cssText = 'margin-bottom: -3px;';
                el.parentNode.style.display = 'none';
                el.parentNode.parentNode.appendChild(lodingImg);
                callBack({
                    'ele': el,
                    'img': lodingImg
                });
            };
        })(ele);
    }
	
	var SelectAppender = function(step){
        this.step = step || 1;
    };
    SelectAppender.prototype = {
        initialize: function(selObj, startValue, endValue){
            var i, m;
            if (this.step >= 0) {
                i = Math.min(startValue, endValue);
                m = Math.max(startValue, endValue);
                for (i; i <= m; i += this.step) {
                    var op = $C("option");
                    op.innerHTML = i;
                    op.value = i;
                    selObj.appendChild(op);
                }
            }
            else {
                i = Math.max(startValue, endValue);
                m = Math.min(startValue, endValue);
                for (i; i >= m; i += this.step) {
                    var op = $C("option");
                    op.innerHTML = i;
                    op.value = i;
                    selObj.appendChild(op);
                }
            }
        }
    };
    
    var dateNum = function(y, m){
        var isLeap = function(y){
            return y % 400 ? (y % 100 ? (y % 4 ? 0 : 1) : 0) : 1;
        };
        if (!(y * m)) {
            return 0;
        }
        var d = 31;
        switch (m) {
            case 4:
            case 6:
            case 9:
            case 11:
                d = 30;
                break;
            case 2:
                d = isLeap(y) ? 29 : 28;
                break;
        }
        return d;
    };
    
    var operItem = function(dom, n){
        var ov = parseInt(dom.value) || 0;
        if (/msie/.test(navigator.userAgent.toLowerCase())) {
            setTimeout(operDom, 200);
        }
        else {
            operDom();
        }
        function operDom(){
            while (dom.options.length > 1) {
                dom.remove(1);
            }
            for (var i = 1; i <= n; i++) {
                dom.options[dom.options.length] = new Option(i, i);
            }
            dom.value = Math.min(ov, n);
        }
    };
    
    scope.yemodify.selecter = function(oYear, oMonth, oDate, value){
        var sel = function(){
            operItem(oDate, dateNum(parseInt(oYear.value), parseInt(oMonth.value)));
        };
        $E(oYear).onchange = sel;
        $E(oMonth).onchange = sel;
        sel();
		if($IE) {
			setTimeout(function(){
				oDate.value = value || "0";
			},250);
		} else {
			oDate.value = value || "0";
		}
    };
    
    scope.yemodify.selectAppender = new SelectAppender();
})();