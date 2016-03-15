$import("sina/utils/io/jsload.js");
$import("sina/utils/insertTemplate.js");
$import("sina/core/dom/getElementsByClass.js");
$import("lib/sendLog.js");

/**
 * @fileoverview 博客专栏体育页面 新增五个广告位
 *
 * @create ${date} ${time}
 * @author xiaoyue3@staff.sina.com.cn
 */
$registJob('articleTjTiYuAd', function(){
	var tjtiyu = window.location.search.indexOf("tj=tiyu");
	if(tjtiyu !== -1 ){
		Utils.Io.JsLoad.request("http://game.sports.sina.com.cn/4/2013/1107/1.js", {
	        onComplete: function(result){
	        	if(result.code === "A00006"){
	        		var data = result.data;
	        		var wrapper = $E("sina_keyword_ad_area2");
		            var ad4 = Core.Dom.getElementsByClass(wrapper,"div","shareUp");
	        		var module_tj_ad2 = $E("module_tj_ad2"),module_tj_ad1 = $E("module_tj_ad1");
		           	var module_3007 = $E("module_3007");
		           	//广告位置3
		           	// if(data.adv3){
		           	// 	var tpl1 = '<div class="SG_conn" id="module_tj_tiyuad1">'+
			           //  				'<div class="SG_connBody" id="tiyuAdCon1">'+
			           //  					'<a href="'+ data.adv3.link +'" target="_blank" title="'+ data.adv3.title +'" onclick="v7sendLog(\'103_01_01\')"><img src="'+ data.adv3.img +'" width="'+ data.adv3.width +'" height="'+ data.adv3.height +'" alt="'+ data.adv3.title +'"></a>'+
			           //  				'</div>'+
			           //  			'</div>';
			           //  Utils.insertTemplate(module_tj_ad2,tpl1,'AfterEnd');
		           	// }
		          
		           	//广告位置4
		           	if(data.adv4){
		           		var tpl2 = '<div class="SG_conn" id="module_tj_tiyuad2">'+
		            				'<div class="SG_connBody" id="tiyuAdCon2">'+
		            					'<a href="'+ data.adv4.link +'" target="_blank" title="'+ data.adv4.title +'" onclick="v7sendLog(\'103_01_01\')"><img src="'+ data.adv4.img +'" width="'+ data.adv4.width +'" height="'+ data.adv4.height +'" alt="'+ data.adv4.title +'"></a>'+
		            				'</div>'+
		            			'</div>';
		            	Utils.insertTemplate(module_tj_ad1,tpl2,'AfterEnd');
		           	}

		           	//广告位置5  注意：4和5的代码位置不允许调整
		           	if(data.adv5){
		           		var tpl3 = '<div class="SG_conn" id="module_tj_tiyuad3">'+
		            				'<div class="SG_connBody" id="tiyuAdCon3">'+
		            					'<a href="'+ data.adv5.link +'" target="_blank" title="'+ data.adv5.title +'" onclick="v7sendLog(\'103_01_01\')"><img src="'+ data.adv5.img +'" width="'+ data.adv5.width +'" height="'+ data.adv5.height +'" alt="'+ data.adv5.title +'"></a>'+
		            				'</div>'+
		            			'</div>';
		            	Utils.insertTemplate(module_3007,tpl3,'BeforeBegin');
		           	}

		           	//广告位置1
		           	if(data.adv1){
		           		var tpl4 = '<div class="adv_txtPic" id="module_tj_tiyuad4">' +
	                           		'<strong>猜你喜欢</strong>'+
	                           		'<ul>'+
	                             		'<li class="mgr"><a href="'+ data.adv1[0].link +'" title="'+ data.adv1[0].title+'" target="_blank">'+ data.adv1[0].title+'</a></li>'+
	                             		'<li><a href="'+ data.adv1[1].link +'" title="'+ data.adv1[1].title+'" target="_blank">'+ data.adv1[1].title +'</a></li>'+
	                             		'<li class="mgr"><a href="'+data.adv1[2].link+'" title="'+ data.adv1[2].title+'" target="_blank">'+ data.adv1[2].title +'</a></li>'+
	                             		'<li><a href="'+data.adv1[3].link+'" title="'+ data.adv1[3].title+'" target="_blank">'+data.adv1[3].title+'</a></li>'+
	                           		'</ul>'+
	                           '</div>';
		                Utils.insertTemplate(ad4[0],tpl4,'BeforeEnd');
		           	}
		           	//广告位置2
		           	if(data.adv2){
	           			var tpl5 = '<div class="adv_txtPic" id="module_tj_tiyuad5">' +
                           			'<div class="flashMod"><iframe width="100%" scrolling="no" frameborder="0" src="'+ data.adv2.link +'"></iframe></div>'+
                           		'</div>';
                    	Utils.insertTemplate(ad4[0],tpl5,'BeforeEnd'); 
		           	}   
	        	}
	        },
	        GET:{
				varname:'requestId',
					rnd: parseInt((+new Date())/(60 * 1000))
	        },
			charset: 'gb2312',
	        onException: function(){
	           
	        }
	    });
	} 
    
});

