/**
 * @fileoverview
 *	增加 SUDA 统计布码
 	1、先载入 http://www.sinaimg.cn/unipro/pub/suda_s_v911c.js
 	2、载入后执行
 	var _s_tpl="";try{_s_tpl=scope.tpl}catch(e){_s_tpl="";}
	try{
	GB_SUDA._S_pSt("",_s_tpl);
	}catch(e){}
	
	注意两点：	
		页面上仍然需要 noscript 布码
		需要判断页面上是否有老的布码，如果有，则不执行新的 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *	2010.07.01 启用新的 SUDA 布码
 * @added by gaolei | gaolei2@staff.sina.com.cn
 *  2015.02.12 在suda代码里面增加修改博客名称的功能。
 *  项目概述：国家政策要求对互联网各种名称进行审核，对于博客名称，没有审核过，而监控不想做审核，所以把博客名称全部改为 昵称+的博客 形式，php有缓存，也不愿意做修改，只能js懒加载，
 *  理论上应该新建一个job，在每个conf页面引入该功能，但是考虑到目前blog一共有60个入口文件，blog7icp有77个入口文件，blog7photo有19个入口文件，blog7activity有23个入口文件。
 *  该项目工作量太大且无意义，因而将此代码放到suda文件中，只需要修改4个项目中的4个suda.js，并将suda代码加到没有引入过suda的入口文件即可。
 *  项目具体wiki详见：http://wiki.intra.sina.com.cn/pages/viewpage.action?pageId=56788167
 */
$import("sina/utils/io/loadCss.js");
$import("sina/utils/io/jsload.js");

$import("lib/jobs.js");
$import("lib/checkAuthor.js");
$import("lib/sendSuda.js");
$import("lib/sendLog.js");
$import("lib/uic.js");
$import("sina/core/string/leftB.js");

$registJob("suda", function (){
	var pageId = scope && scope.$pageid;
	var wlh = window.location.href;
	var isTj = wlh.indexOf("tj=1") > -1;
	var suda_flag =  pageId && (pageId === 'articletj' || pageId === 'index' ||  pageId === 'indexM' ||  pageId === 'editor' || isTj );
	function addSudaPage(pageId,parm1,parm2,parm3,parm4){
        if(isTj){
            v7sendLog(parm4);
        }
        switch(pageId) {
            case "index":
            case "indexM":
                v7sendLog(parm1);
                break;
            case "editor":
                v7sendLog(parm2);
                break;
            case "articletj":
                v7sendLog(parm3);
                break;
        } 
    }

	if(suda_flag){
		var url = encodeURIComponent(wlh);
		var refer = encodeURIComponent(document.referrer);
	}
	if(typeof _S_pSt == "function"){
		if (suda_flag) {
			v7sendLog('42_01_03_' + new Date().getTime() + "_" + url + "_" + refer);
		}
		return;
	}
	if (suda_flag) {
		if (!$isLogin) {
			var tj = '42_01_01_' + new Date().getTime() + "_" + url + "_" + refer;	
 		}else{
 			var tj = '42_01_01_' + $UID + '_' + new Date().getTime() + "_" + url + "_" + refer;
 		}
		addSudaPage(pageId,'42_01_08','42_01_14', tj,'42_01_05');
	}
    
    Lib.sendSuda(function () {
        try{
            _S_pSt("");  
        }catch(e){
        }
        
        if(suda_flag){
            if (!$isLogin) {
                var succTj = '42_01_02_' + new Date().getTime() + "_" + url + "_" + refer;  
            }else{
                var succTj = '42_01_02_' + $UID + '_' + new Date().getTime() + "_" + url + "_" + refer;
            }
            
            addSudaPage(pageId,'42_01_09','42_01_15',succTj, '42_01_06');
        }
        
    });

    // 修改博客名称的job 禁止修改博客名称 名称全部改为昵称+‘的博客’
    var ele = $E('blognamespan');
    if (!ele){ // 没找到节点，说明没有博客名称位置，退出
        return;
    }
    Lib.checkAuthor();
    Lib.Uic.getNickName([scope.$uid], function(oResult) {
        var nickName = oResult[scope.$uid];
        // 判断是昵称末尾是否有 “的博客” 三个字,先去掉
        nickName = nickName.replace(/\u7684\u535a\u5ba2$/, '');
        // 再截取昵称，15个汉字30个英文字符
        nickName = Core.String.leftB(nickName, 30);
        // 加后缀
        nickName = nickName + '的博客';          
        ele.innerHTML = nickName;
    });

    
    (function(d, s, id) {
        var n = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        s = d.createElement(s);
        s.id = id;
        s.setAttribute('charset', 'utf-8');
        s.src = '//d' + Math.floor(0 + Math.random() * (8 - 0 + 1)) + '.sina.com.cn/litong/zhitou/sinaads/src/spec/sinaads_ck.js';
        n.parentNode.insertBefore(s, n);
    })(document, 'script', 'sinaads-ck-script');
});

/*
 * 页面直接输出 SUDA 布码的范例
<!-- SUDA_CODE_START -->
<script type="text/javascript" src="http://www.sinaimg.cn/unipro/pub/suda_s_v911c.js"></script>
<script type="text/javascript" >
//<!--
var _s_tpl="";try{_s_tpl=scope.tpl}catch(e){_s_tpl="";}
try{
GB_SUDA._S_pSt("",_s_tpl);
}catch(e){}
//-->
</script> 
<noScript> 
 <div style='position:absolute;top:0;left:0;width:0;height:0;visibility:hidden'><img width=0 height=0 src='http://beacon.sina.com.cn/a.gif?noScript' border='0' alt='' /></div> 
</noScript> 
<!-- SUDA_CODE_END -->
 */
