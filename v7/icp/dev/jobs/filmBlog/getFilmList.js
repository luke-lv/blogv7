/**
 * @fileoverview 获取（全部）影评列表 主要是左侧pic 右侧标题 摘要格式
 * @author wujian wujian@staff.sina.com.cn
 * @create 2010-12-27
 */
$import("sina/ui/pagination.js");
$registJob("getFilmList", function(){
	var url="http://control.blog.sina.com.cn/riaapi/feed/feed_film.php";
	var feedNum=5;
	var filmListInterFace=new Interface(url, "jsload");
	/**
	 * 注册一个全局函数 调用接口 用于分页输出渲染 在分页的a标签中 执行
	 * @param {Object} pageNum 页面
	 * @param {Object} type  0、最新影评（首页）2、好友影评动态（好友的电影）//
	 */
	scope.getFilmList=function(stype,page){
		page=page||1;//默认
		filmListInterFace.request({
			GET: {
				'pagesize': feedNum,
				'type': stype,
				'page': page
			},
			onSuccess:function(data){				
				/*if (isPageNumber) {
					$E("feed_center_span").scrollIntoView(true);
				}*/
				renderFilmList(data);				
			},
			onError:function(res) {
				//showError(res.code);
			}
		}
		);
	};	
	/**
	 * 渲染数据
	 * @param {Object} d [{},{},{}]类似格式的
	 */		  
	function renderFilmList(d){
				
		var page=d.page;
		var maxPage=Math.ceil(d.cnt/feedNum);
		$E("listCon").innerHTML=d.html;
		$E("newFilmFeedList").scrollIntoView(true);
		
		/*if(page==maxPage&&d.cnt%feedNum>0){
			$E("go2Top").style.display="none";
		}else{
			$E("go2Top").style.display="";
		}*/
		
		//页面 渲染完毕 准备分页
			Ui.Pagination.init({
			"pageNode" : "pageCon",							// 用于写入分页的节点,class="XX_page"的div
			"nodeClassNamePrefix":"SG",
			"maxPage" : maxPage,										// 最大页码数
			"pageTpl" : function (nPage){
	 								scope.getFilmList('0',nPage);
	 							return false;
	 							},	   // 跳转的页面规则
			"curPage" :page 
			}).show();
	}
	
	//scope.getFilmList('0',1);//上线后  次行需要注释掉
});