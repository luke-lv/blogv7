/**
 * @author Jay Chan | chenjie@staff.sina.com.cn
 */

$registJob("loadCollectionCount", function(){
	function fillCollectionData(colls){
		for(var i = 0, l = editInPlace.title.length; i < l; i ++){
			if(document.getElementById("collection_" + editInPlace.title[i])){
				document.getElementById("collection_" + editInPlace.title[i]).innerHTML = "(" + (colls['8_url_'+editInPlace.md5key[i]]?colls['8_url_'+editInPlace.md5key[i]]:0) + ")";
			}
			
		}
	}
	var keys = [];
	for(var i =0;i< editInPlace.title.length;i++){
		keys.push('8_url'+'_'+editInPlace.md5key[i]);
	}
	var colls = document.createElement("script");
	colls.src= "http://collect.sinajs.cn/collect?key=" + keys.join(",") + "&var=collections";
	colls.setAttribute("type", "text/javascript");
	colls.setAttribute("charset", "utf-8");
	if($IE){
		colls.onreadystatechange = function(){
			if(/^(loaded|complete)$/i.test(colls.readyState)){
				fillCollectionData(collections);
			}
		};
	}
	else{
		colls.onload = function(){
			fillCollectionData(collections);
		};
	}
	document.body.appendChild(colls);
});