/**
 * @fileoverview 影视app 电影库\电视库的搜索
 * @author wujian wujian@staff.sina.com.cn
 * @create 2010-12-27
 */
$import('jobs/filmBlog/filmDataLoad.js');

$registJob("filmSearch", function(){
	//搜索对象参数
	var searchObj={
		
	};
	//1、初始化 select a 选择功能
	//2、显示 当前搜索选择
	//3、渲染 1、列表2、分页	
	var liArr=$T($E('searchUl'),"li"),aArr=null,selectArr=$T($E('searchUl'),"select");
	/**
	 * 初始化绑定事件
	 */
	function bindEvent(){
		//循环 按块初始化 select a 选择功能		
		for (var i=0,len=liArr.length; i<len; i++) {
			//循环绑定a 
			aArr=null;
			aArr=$T(liArr[i],"a");//获取a 集合
			//绑定a 使a与select联动
			for (var j=0,alen=aArr.length; j<alen; j++) {
				
				(	function(a,select){						
						var index=a.getAttribute("findex");//,type=a.type,value=a.value;
						Core.Events.addEvent(a,function(){							
							select.selectedIndex=index;//修改选择框  搜索框的值 变了应该就会触发 onchange事件吧 然后 调接口
							scope.myFilmSearchStart(1);	
							return false;						
						},"click");
						a=null;//应该可以防止内存泄露了吧
					}
				)(aArr[j],selectArr[i]);				
				
			}			
			//绑定select
			Core.Events.addEvent(selectArr[i],function(){
				//alert(2134)
				scope.myFilmSearchStart(1);//默认取第一页
								
			},"change");
		}		
	}
	bindEvent();
	
	//显示搜索 关键词 
	//var keyWordEle=null;
	scope.showCurrentSearchWord=function (num){
		//显示 当前搜索选择
		//<p>共<em>1872</em>部<em>动作</em>电影</p>
		if(!num){
			return;
		}
		var type=scope.$pageid=="profile_moviesearch"?"电影":"连续剧";
		var key=[];
		for (var i=0,len=selectArr.length; i<len; i++) {
			var s=selectArr[i];
			if(s.value!="00"){
				//trace(s.getAttribute("type")+"=="+s.value)
				key.push("<em>"+s.value+"</em>");
			}			
		}
		$E("searchInfo").innerHTML="<p>共<em>"+num+"</em>部"+key.join("<em>/</em>")+type;
		
	};
	
	/**
	 * 获取当前 参数
	 */
	function getLastKeyWord(){
		searchObj={};//重置搜索参数
		for (var i=0,len=selectArr.length; i<len; i++) {
			var s=selectArr[i];
			if(s.value!="00"){
				//trace(s.getAttribute("type")+"=="+s.value)
				searchObj[s.getAttribute("type")]=s.value;
			}			
		}
	}
	/**
	 * 添加运营参数
	 */
	function addParam(){
		searchObj['auth_type']="uuid";
		searchObj['auth_value']='4c4a98cd-0d6c-478c-8873-14449fde689a';
		searchObj['type']=scope.$pageid=="profile_moviesearch"?"movie":"tv";
		searchObj['pagesize']=10;
		/*searchObj['']=
		searchObj['']=
		searchObj['']=*/
	}
	
	var dataload=new scope.filmDataLoad(scope.renderSearch,scope.searchError);
	
	
	//一下是调用接口 部分
	var url="http://data.ent.sina.com.cn/interface/movieapi.php";
	
	/**
	 * 注册一个全局函数 调用接口 用于分页输出渲染 在分页的a标签中 执行
	 * @param {Object} pageNum 页面
	 */
	scope.myFilmSearchStart=function(pageNum){//调用接口
		getLastKeyWord();
		addParam();//添加运营规定的参数 执行此函数即可
		pageNum=pageNum||1;
		searchObj["page"]=pageNum;
		//trace(searchObj)	
		dataload.load(url,searchObj,30*1000);
	};
	scope.myFilmSearchStart();//调用一次 显示默认页面 要不然页面是空的
});