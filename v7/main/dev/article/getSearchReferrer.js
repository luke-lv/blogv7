/**
* @author ANTZ
*/
$import("sina/utils/url.js");
$import("article/_article.js");

//取得关键字和编码类型
Article.getSearchReferrer = function(){
	var o = {};
	var docURL = document.URL;
	//http://blog.sina.com.cn/s/blog_4980964e0100dlrc.html?k=food&t=GBK
	if(docURL.indexOf("blog.sina.com.cn") != -1 && docURL.indexOf("k=") != -1){
		var u = new Utils.Url(docURL);
		o.key = u.getParam("k");
		o.type = u.getParam("t");
		return o;
	}
	//alert(document.referrer);
	//http://www.google.cn/search?hl=zh-CN&client=firefox&rls=org.mozilla%3Azh-CN%3Aofficial&hs=Ri1&newwindow=1&q=keyword&btnG=Google+%E6%90%9C%E7%B4%A2&meta=&aq=f&oq=
	//http://www.baidu.com/s?wd=keyword
	//http://www.soso.com/q?pid=s.idx&w=food
//	var refer = 'http://www.google.cn/search?hl=zh-CN&client=firefox&rls=org.mozilla%3Azh-CN%3Aofficial&hs=Ri1&newwindow=1&q=keywordss&btnG=Google+%E6%90%9C%E7%B4%A2&meta=&aq=f&oq=';
	var refer = document.referrer;
	if (!refer || refer === "") {
		return false;
	}
	
	var searchParam = {
			"www.google.co.jp" : {
				param : "q",
				type : "utf-8"
			},
			"www.google.com.hk" : {
				param : "q",
				type : "utf-8"
			},
			"www.baidu.com": {
				param : "wd",
				type : "GBK",
				needTrans : true
			},
			"www.soso.com" : {
				param : "query",
				type : "GBK",
				needTrans : true
			},			
			"search.yahoo.com" :{
				param: "p",
				type:"utf-8"
			},
			"cn.bing.com": {
				param : "q",
				type : "utf-8"
			},
			"www.youdao.com": {
				param : "q",
				type : "utf-8"
			},
			"www.sogou.com": {
				param : "query",
				type : "GBK",
				needTrans : true
			},
			"www.so.com": { //增加360搜索--by zhihang1@staff
				param : "q",
				type : "utf-8"
			}
            // , 运营的要求去掉uni搜索浮层--by wangqiang1@staff
			// "uni.sina.com.cn": {
				// param : "k",
				// type : "gbk",
				// needTrans : true
			// }
	};
	for(var k in searchParam){
		var url = new Utils.Url(refer);
		
		// if(refer.indexOf("uni.sina.com.cn") != -1 && refer.indexOf("ie=") != -1){
				// o.key = url.getParam("k");
				// o.type = url.getParam("ie");
				// break;
		// }
		
		if (refer.indexOf(k) != -1) {
			o.key = url.getParam(searchParam[k]["param"]);
			o.type = searchParam[k]["type"];
			o.needTrans = searchParam[k]["needTrans"];			//is new
			break;
		}
	}
	
	if (!o.key || o.key === "") {
		return false;
	} else {
		return o;
	}
};