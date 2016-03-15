/**
 * @fileoverview 搜索渲染页面 列表+分页
 */
//3、渲染 1、列表2、分页	
$import("sina/core/array/foreach.js");
$import("sina/ui/pagination.js");
$import("sina/core/string/expand.js");
$import("sina/core/string/collapse.js");
/**
 * {"id":"11549","title":"\u725b\u4ed4\u548c\u5916\u661f\u4eba","entitle":"Cowboys and Aliens",
 * "moreentitle":"\u725b\u4ed4\u4e0e\u5f02\u5f62 \r\n\u725b\u4ed4\u4e0e\u5916\u661f\u4eba",
 * "uniquemovie":"cowboys","initial":"C","initial2":"N",
 * "tags":"\u52a8\u4f5c \u5947\u5e7b \u79d1\u5e7b \u897f\u90e8 \u6218\u4e89","director":"","producer":"","writer":"",
 * "directorcontent":"\u4e54\u6069\u00b7\u8d39\u5112 Jon Favreau",
 * "producercontent":"Daniel Forcey ....co-producer\r\n\u797\u5fb7\u6d1b\u\u4f2f\683c Stevcutive producer",
 * "writercontent":"\u8fbe\u8499\00b7r\n\u970d\uberg ....comic book",
 * "actorcontent":"\u4e39\uPaew credited)",
 * "publish":"2010","lang":"\u82f1\u8bed",
 * "class":"\u52a8\u4f5c,\u5947\u5e7b,\u79d1\u5e7b,\u6218\u4e89,\u897f\u90e8",
 * "moviegroup":"\u70ed\u95e8\u65b0\u7247","level":"","area":"\u6b27\u7f8e",
 * "nationality":"\u7f8e\u56fd","length":"","rating":"3","rankable":"",
 * "company":"\u73af\u7403\u5f71\u4e1a",
 * "picture":"\/moviepic\/pics\/29\/moviepic_aad8fdef73128b3d5a301b97dc8e689b.jpg",
 * "picsubject":"http:\/\/data.ent.sina.com.cn\/roll\/picture.php?image=images&type=movie&pictureindex=0&id=11549&dpc=1","clerk":"

\u3000\u3000Marvin Williamcond assistant director<\/p>","shortcomment":"",
"premiere":"2011-07-29","premierearea":"\u7f8e\u56fd",
"premierecontent":"\u7f8e\u56fd USA 2011\u5e747\u670829\u65748\u670825\u65e5","official":"","blog":"","video":"",
"prevideo":"http:\/\/video.sina.com.cn\/p\/ent\/m\/f\/2010-11-18\/155461187119.html",
"content":"","url":"","browse":"8356","browserank":"1181","favorite":"1","good":"4.22860","commentid":"data-movie-11549","related":""}
 * @param {Object} ""
 */

$registJob("reanderSearch",function(){
	//图片出错地址、图片a url、过多的转向页面
	var tpl=['<li class="#{isLeft}">',
                    '<div class="pic"><a href="http://i.blog.sina.com.cn/blogprofile/profiledetailfilm.php?film_type=#{type}&film_id=#{id}"  title="#{fulltitle}"><img class="poster" alt="" width="94" height="131" src="http://cache.mars.sina.com.cn/nd/dataent#{picture}" onerror="this.src=\'http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif\'"></a></div>',
                    '<ul class="info">',
                      '<li>片&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：<a href="http://i.blog.sina.com.cn/blogprofile/profiledetailfilm.php?film_type=#{type}&film_id=#{id}"  title="#{fulltitle}">#{title}</a></li>',
                      '<li>英文片名：#{entitle}</li>',
                      '<li>主演：#{actorcontent}</li>',
                      '<li>类型：#{class}</li>',
                      '<li>地区：#{area}</li>',
                      '<li>上映时间：#{premiere}</li>',
                      '<li class="btn"><a class="SG_aBtn SG_aBtn_ico" target="_blank" href="http://control.blog.sina.com.cn/admin/article/article_add.php?film_id=#{id}&type=#{type}">',
					  '<cite><img height="15" align="absmiddle" width="15" title="我也看过" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon77">我也看过</cite></a></li>',
                    '</ul>',
                  '</li>'].join("");	
	
	scope.renderSearch=function(data){
		
		$E("loading").style.display="none";
		
		trace("-----render----");
		//trace(data);
		var rows=data.result.data.rows;
		if(data.result.status.code=="0"&&parseInt(rows,10)>0){
			var currPage=data.result.data.curr_page;
			var maxPage=data.result.data.pages;
			
			var d=data.result.data.record,html="",htmlArr=[];
			
			Core.Array.foreach(d,function(item,index){
				//alert("dd"+findex);
				item.fulltitle=item.title;
				//item.title=checkStrLen(item.title,22);
				item.entitle=checkStrLen(item.entitle,14);
				
				item.type=scope.$pageid=="profile_moviesearch"?"movie":"tv";//trace(item)
				item.actorcontent=checkStrLen(item.actorcontent, 12,'…<a href="http://i.blog.sina.com.cn/blogprofile/profiledetailfilm.php?film_type='+item.type+'&film_id='+item.id+'" >更多&gt;&gt;</a>');
				
				item.isLeft=index%2==0?"mgr68":"";	
							
			});
			
			var template = new Ui.Template(tpl);
			var $html=template.evaluateMulti(d);
			//alert($1)
			$E("noneFilm").style.display="none";
			$E("filmContain").innerHTML=$html;
			
			if(d.length>=5){
				$E("go2Top").style.display="";
			}else{
				$E("go2Top").style.display="none";
			}
			
			//页面 渲染完毕 准备分页
			Ui.Pagination.init({
			"pageNode" : "pageCon",							// 用于写入分页的节点,class="XX_page"的div
			"nodeClassNamePrefix":"SG",
			"maxPage" : maxPage,										// 最大页码数
			"pageTpl" : function (nPage){
	 								scope.myFilmSearchStart(nPage);
									$E("searchUl").scrollIntoView(true);
	 							return false;
	 							},	   // 跳转的页面规则
			"curPage" :currPage 
			}).show();
		
			
			
			
		}else{
			$E("filmContain").innerHTML="";
			$E("noneFilm").style.display="";
			$E("pageCon").innerHTML="";
			$E("go2Top").style.display="";
		}
		scope.showCurrentSearchWord(rows);
	};
	/**
         * 检查字符串长度
         * @param {Object} str
         * @param {Object} max
         */
        function checkStrLen(str, max,more){
            //str="test";
            //alert(str)
            var temp = Core.String.expand(str),tail="";
            if (temp.length > max) {
                temp = temp.substr(0, max);
				tail=more||"";
            }
            temp = Core.String.collapse(temp)+tail;
            return temp;
        }
		/**
		 * 娱乐接口调用出错
		 */	
	scope.searchError=function(){
		winDialog.alert("因网络问题，暂时不能获取数据。", {
       			 icon: "01"//ico  "01":叹号；"02":错误；"03":正确；"04":问号；
       			 ,funcOk:function(){
				 	input.focus();
				 }
    		});			
			return false;
	};
	
});



