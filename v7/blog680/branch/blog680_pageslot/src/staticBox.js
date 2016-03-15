/*
 * @fileoverview 生成固定广告位
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

//广告资源接口返回数据
var resdata = {};

//广告资源id缓存
SinaBlog680.sourceArrCache = [];
//广告获取接口
// SinaBlog680.sourceurl = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php';
SinaBlog680.sourceurl = 'http://comet.blog.sina.com.cn/api?maintype=pageslot';
var requesting = 0;


/*** 固定广告，底部调用模式 ***/
/*  调用方法
    //广告位id
    var slotArr = ['div1', 'div2', 'div3'];
    //广告资源id，一个广告位可以对应多个资源
    var sourceArr = ['SLOT_40', 'SLOT_42,SLOT_44', 'SLOT_49'];
    SinaBlog680.staticBox(slotArr, sourceArr);
*/
SinaBlog680.staticBox = function(slotArr, sourceArr) {
    //一个广告位有多个资源
    var sourceLen = sourceArr.length;
    var reqSourceArr = [];
    var cookieUtil = SinaBlog680.cookie;
    var reqdata = {
        id : reqSourceArr
    };
    
    var articleclass = '';
    if(typeof scope != 'undefined') {
        articleclass = scope.$private.articleclass;
    }

    for(var i=0;i<sourceLen;i++) {
        var subSourceArr = sourceArr[i].split(',');
        var subSourceLen = subSourceArr.length;
        if(subSourceLen > 1) {
            // var index = parseInt(cookieUtil.getCookie(slotArr[i] + '_' + 'adindex') || 0);
            // if (subSourceLen <= index) {
            //     index = 0;
            // }
            // cookieUtil.setCookie(slotArr[i] + '_' + 'adindex', 1+index, 24, "/", ".blog.sina.com.cn");
            var index = SinaBlog680.utils.getRandomInt(0, subSourceLen-1);
            reqSourceArr.push(subSourceArr[index]);
        }else if(subSourceLen == 1) {
            reqSourceArr.push(subSourceArr[0]);
        }
    }

    if(sourceArr.join().indexOf('SLOT_41') != -1 || sourceArr.join().indexOf('SLOT_42') != -1) {
        reqdata = {
            id : reqSourceArr,
            articleclass : articleclass
        };
    }else {
        reqdata = {
            id : reqSourceArr
        };
    }

    if(typeof scope != 'undefined') {
        reqdata.blogeruid = scope.$uid;
    }
    
    var SUPCookie = decodeURIComponent(cookieUtil.getCookie('SUP'));
    if(SUPCookie) {
        var matchCookie = SUPCookie.match(/uid=([\x20-\x7e]+?)&user/);
        var loginuid = matchCookie.length && matchCookie[1];
        reqdata.loginuid = loginuid;
    }
    

	var domInterval = window.setInterval(function() {
        if(document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'loaded') {
            
            if(typeof SUDA != 'undefined') {
                clearInterval(domInterval);
                domInterval = null;

                // 本地存储
                var lsTool = SinaBlog680.utils.localStorage;

                var slotTime = lsTool.get('slotTime');
                var timestamp = new Date().getTime();
                
                var localData = {};

                if(slotTime) {
                    // 时间差
                    var secondNum = parseInt((timestamp - slotTime)/1000, 10);
                    if(secondNum >= 600) {
                        localData = {};
                        lsTool.remove('slotData');
                        lsTool.set('slotTime', timestamp);
                    }else {
                        localData = lsTool.get('slotData') ? JSON.parse(lsTool.get('slotData')) : {};
                    }
                }else {
                    localData = {};
                    lsTool.remove('slotData');
                    lsTool.set('slotTime', timestamp);
                }
                
                var titleMatch = document.location.href.match(/(\?|&)title_key=(.+?)(?=&|$)/);
                if(titleMatch && titleMatch[2]) {
                    reqdata.title_key = decodeURIComponent(decodeURIComponent(titleMatch[2]));
                    SinaBlog680.jsload.request(SinaBlog680.sourceurl, {
                        GET : reqdata,
                        onComplete: function(res) {
                            if(res) {
                                SinaBlog680.renderBox(slotArr, reqSourceArr, res);
                                //localData[reqSourceArr] = res;
                                //lsTool.set('slotData', JSON.stringify(localData));
                            }
                        },
                        onException: function(res) {
                        }
                    });
                } else {
                    if(!localData[reqSourceArr]) {
                        SinaBlog680.jsload.request(SinaBlog680.sourceurl, {
                            GET : reqdata,
                            onComplete: function(res) {
                                if(res) {
                                    SinaBlog680.renderBox(slotArr, reqSourceArr, res);
                                    localData[reqSourceArr] = res;
                                    lsTool.set('slotData', JSON.stringify(localData));
                                }
                            },
                            onException: function(res) {
                            }
                        });
                    }else {
                        SinaBlog680.renderBox(slotArr, reqSourceArr, localData[reqSourceArr]);
                    }
                }
                
                
            }
        }else {
            console.log(document.readyState);
        }
    }, 500);

    // 超时
    window.setTimeout(function() {
        if(domInterval) {
            clearInterval(domInterval);
            domInterval = null;
        }
    }, 1000*10);

};
SinaBlog680.renderBox = function(slotArr, sourceArr, adData) {
    var len = slotArr.length;
    var cookieUtil = SinaBlog680.cookie;

    for(var i=0;i<len;i++) {
        var sourceid = sourceArr[i];

        //固定类型
        if(adData[sourceid] && adData[sourceid].slottype == 1) {
            var slotdom = document.getElementById(slotArr[i]);

            //判断tips广告，顶托位置
            if (typeof BLOG_AD_TIPS != 'undefined' && BLOG_AD_TIPS != null && slotArr[i] === 'loginBarActivity') {
                continue;
            }

            if(slotdom) {
                var resarr = adData[sourceid].res;
                
                if(resarr.length) {
                    var box = new PPTBox();
                    box.width = adData[sourceid].width;
                    box.height = adData[sourceid].height;
                    box.sourceid = sourceid;
                    box.materialtype = adData[sourceid].materialtype;
                    box.autoplayer = 0;
                    box.slot = slotdom;
                    
                    //一个广告资源多个物料信息
                    if(resarr.length === 1) {
                        box.add(resarr[0]);
                        box.sudakey = resarr[0].a_v_suda_key;
                        box.sudavalue = resarr[0].a_v_suda_value;
                        box.show();
                        
                    }else if(resarr.length > 1) {
                        var randomIndex = SinaBlog680.utils.getRandomInt(0, resarr.length-1);
                        box.add(resarr[randomIndex]);
                        box.sudakey = resarr[randomIndex].a_v_suda_key;
                        box.sudavalue = resarr[randomIndex].a_v_suda_value;
                        box.show();
                    }

                    // 对相关博文的两个广告做特殊处理
                    // if(sourceid === 'SLOT_41' || sourceid === 'SLOT_42') {
                    //     if(slotdom.parentNode.style.display == 'none') {
                    //         slotdom.parentNode.style.display = '';
                    //     }
                    // }
                    if(slotdom.style.display == 'none') {
                        slotdom.style.display = '';
                    }
                }
            }
        }
        // else {
        //     console.log('slottype error');
        // }
    }
};

/*** 顶部调用，埋点方式 start ***/
SinaBlog680.preloadSlots = function(sourceArr) {
	for(var i=0;i<sourceArr.length;i++) {
		SinaBlog680.sourceArrCache.push(sourceArr[i]);
	}
};
SinaBlog680.reqAD = function() {
	requesting = 1;
	SinaBlog680.jsload.request(SinaBlog680.sourceurl, {
    	GET : {
            id : SinaBlog680.sourceArrCache
		},
        onComplete: function(res) {
        	for(var key in res) {
        		resdata[key] = res[key];
        	}
            requesting = 0;
        },
        onException: function(res) {
        }
    });
};
SinaBlog680.fillSlot = function(sourceid, slotid) {	
    var placeEle = '<a id="placeEle_'+sourceid+'"></a>';
    if(!slotid) {
        document.write(placeEle);
    }

    var checkdata = window.setInterval(function() {
    	//domready后执行
    	if(document.readyState ==="complete") {
	        if(!SinaBlog680.utils.isEmptyObject(resdata)) {
	            clearInterval(checkdata);
	            var adData = resdata;
	            //没有数据的情况
	            if(!adData || !adData[sourceid]) {            	
	                return;
	            }
	            var box = new PPTBox();
	            box.width = adData[sourceid].width;
	            box.height = adData[sourceid].height;
	            box.sourceid = sourceid;
	            box.materialtype = adData[sourceid].materialtype;
	            box.autoplayer = 0;
	            if(slotid) {
	                box.slot = document.getElementById(slotid);
	            }else {
	                box.slot = document.getElementById('placeEle_'+sourceid).parentNode;
	            }
	            
	            for(var j=0;j<adData[sourceid].res.length;j++) {
	                box.add(adData[sourceid].res[j]);
	                box.show();

	                var viewKey = adData[sourceid].res[j].a_v_suda_key;
	                var viewValue = adData[sourceid].res[j].a_v_suda_value;
	                SinaBlog680.sudaView(sourceid, viewKey, viewValue);
	            }

	        }else {
	        	if(requesting === 0) {
	        		SinaBlog680.reqAD();
	        	}
	        }
    	}
    }, 500);
    
    // 超时
    window.setTimeout(function() {
        if(checkdata) {
            clearInterval(checkdata);
        }
    }, 1000*10);
};

//针对顶托延迟加载
SinaBlog680.fillTopBar = function(sourceid) {
	
    var topBarInterval = window.setInterval(function() {
        var topbar_login = document.getElementById('loginBarActivity');
        var topbar_nologin = document.getElementById('divPopularize');
        if(document.readyState === "complete") {
        	if(topbar_login) {
	            //判断是否是tips广告
	            if (typeof BLOG_AD_TIPS==="undefined" || !BLOG_AD_TIPS ){
	                SinaBlog680.fillSlot(sourceid, 'loginBarActivity');
	            }
	            clearInterval(topBarInterval);
	        }
	        if(topbar_nologin) {
	            //判断是否是tips广告
	            if (typeof BLOG_AD_TIPS==="undefined" || !BLOG_AD_TIPS ){
	                SinaBlog680.fillSlot(sourceid, 'divPopularize');
	            }
	            clearInterval(topBarInterval);
	        }
        }
    }, 3000);

    //超时
    window.setTimeout(function() {
    	if(topBarInterval) {
    		clearInterval(topBarInterval);
    	}
    }, 3000*10);
};
/*** 顶部调用，埋点方式 end ***/

/*** 曝光布码 ***/
SinaBlog680.sudaView = function(sourceid, key, value) {
    window.setTimeout(function() {
        var el = document.getElementById(sourceid+'_mainbox');
        if(typeof SUDA !== 'undefined' && el) {
            SUDA.uaTrack(key, value);
        }
    }, 3000);
};
