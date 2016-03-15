/*
 * @fileoverview 生成固定广告位
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */
SinaBlog680.resdata = 0;

/*** 固定广告，底部调用模式 ***/
/*  调用方法
    var slotArr = ['div1', 'div2', 'div3']; //广告位id
    var sourceArr = ['111', '222', '333'];  //广告资源id
    SinaBlog680.staticBox(slotArr, sourceArr);
*/
SinaBlog680.staticBox = function(slotArr, sourceArr) {
    var url = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php?id=' + sourceArr;
    SinaBlog680.jsload.request(url, {
        onComplete: function(res) {
            // console.log(res);
            SinaBlog680.renderBox(slotArr, sourceArr, res);
        },
        onException: function(res) {
            // console.log(res);
        }
    });
};
SinaBlog680.renderBox = function(slotArr, sourceArr, adData) {
    var len = slotArr.length;

    for(var i=0;i<len;i++) {
        var sourceid = sourceArr[i];
        //固定类型
        if(adData[sourceid].slottype == 1) {
            var box = new PPTBox();
            box.width = adData[sourceid].width;
            box.height = adData[sourceid].height;
            box.sourceid = sourceid;
            box.materialtype = adData[sourceid].materialtype;
            box.autoplayer = 0;
            box.slot = document.getElementById(slotArr[i]);

            for(var j=0;j<adData[sourceid].res.length;j++) {
                box.add(adData[sourceid].res[j]);

                box.show();
                var viewKey = adData[sourceid].res[j].a_v_suda_key;
                var viewValue = adData[sourceid].res[j].a_v_suda_value;
                SinaBlog680.sudaView(sourceid, viewKey, viewValue);
            }
        }else {
            console.log('slottype error');
        }
    }
};

/*** 顶部调用，埋点方式 start ***/
SinaBlog680.preloadSlots = function(sourceArr) {
    var url = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php?id=' + sourceArr;
    
    SinaBlog680.jsload.request(url, {
        onComplete: function(res) {
            SinaBlog680.resdata = res;
        },
        onException: function(res) {
            console.log(res);
        }
    });
};
SinaBlog680.fillSlot = function(sourceid, slotid) {
    var placeEle = '<a id="placeEle_'+sourceid+'"></a>';
    if(!slotid) {
        document.write(placeEle);
    }
    
    var checkdata = window.setInterval(function() {
        if(SinaBlog680.resdata) {
            clearInterval(checkdata);
            var adData = SinaBlog680.resdata;
            // console.log(adData);
            //没有数据的情况
            if(!adData[sourceid]) {
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
            console.log('no data');
        }
    }, 500);
    
    //超时
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