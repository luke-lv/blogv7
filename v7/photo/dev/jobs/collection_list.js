/**
 * @author shaomin | shaomin@staff.sina.com.cn
 */
$import("sina/core/events/addEvent.js");
$import("lib/interface.js");
$import("sina/utils/io/ajax.js");
//$import("sina/utils/paging.js");
$import("lib/dialogConfig.js");
//$import("sina/utils/uic.js");

$registJob("collectionList",function(){
	new Interface("http://photo.blog.sina.com.cn/services/ajax_collection_list.php","ijax").request({
		POST: {
			uid : scope.$uid,
			page : page
		},
		
		onSuccess : function(res){
			var recordsColumnCount=6;
			var recordsRowCount=4;
			window._amount = res.total;
			$E("total").innerHTML = "("+res.total+")";
			if(res.total < 1){
				$E("componentContent").innerHTML = '<div class="nodata">尚未收藏图片。</div>';
				return;
			}
			var j;
			var currentPage = parseInt(page);
			var totalPages = Math.ceil(res.total / (recordsColumnCount * recordsRowCount));
			var totalNum = res.total;
				
			var pageURL = "http://photo.blog.sina.com.cn/favorite/u/"+ scope.$uid +"/page@page@";
		
			var _myString = new StringBuffer();
			_myString.append('<table class="newPhoto"><tbody id="collectList">');
			var uids = [], _uidtable = {},ids = [];
			for(var i=0;i<res.record.length;i++){
				var thisRecord = res.record[i];
				if(i % recordsColumnCount == 0){
					_myString.append('<tr>');
					j = 0;
				}
				j++;
				uids.push(thisRecord.uid);
				ids.push(thisRecord.id);
				thisRecord.title = thisRecord.title.replace(/["\"]/g,'\\');
				_uidtable["_uid_" + i] = thisRecord.uid;
				_myString.append('<td class="photoCell"><div class="pic">');
				_myString.append('<a href="http://photo.blog.sina.com.cn/photo/'+thisRecord.url+'" target="_blank"><img class="CP_brd" alt="'+thisRecord.title+'" src="http://static' + (Math.floor(Math.random() * 16 + 1)) + '.photo.sina.com.cn/thumbnail/'+thisRecord.url+'"/>');
				if(thisRecord.extinfo.toLowerCase() == 'no'){
					_myString.append('<div class="mobileIcon"><img src="http://simg.sinajs.cn/photo/images/z_icon_trans.gif" alt="彩信图片，通过手机编辑彩信上传图片" class="icon_photoMobile" /></div>');
				}
				_myString.append('</a></div>');
				_myString.append('<p>上传者：<a id="_uid_'+i+'" href="http://photo.blog.sina.com.cn/u/'+thisRecord.uid+'" target="_blank"></a></p>');
				if(scope.myself){
					_myString.append('<p class="nofav"><a class="CP_a_fuc"  href="#" onclick="return false;">[<cite onclick="delCollection(\''+thisRecord.id+'\');">取消收藏</cite>]</a></p>');
				}
			    _myString.append('</td>');
				if(j==recordsColumnCount){
					_myString.append('</tr>');
				}
			}
			_myString.append('</tbody></table>');
			$E("favListContent").innerHTML = _myString.toString();
			
			Utils.Uic.getNickName(uids,function(oResult){
				for(var key in _uidtable){
					var _key = _uidtable[key];
					$E(key).innerHTML = oResult[_key];
				}
			});
			var paging = PagingLine.Create(currentPage, totalPages, pageURL,totalNum,"收藏");
			if ($E("paging")) { 
 				paging.Render("zh-cn", $E("paging"));
 		    }
			cancelCollect = { html :
					'取消收藏成功！此图片从收藏列表消失。',
				opt: {
					title : "提示"
				} 
			};

			window.delCollection = function (thisId){
				windowDialog.alert("确实要取消此收藏吗？",	{
					    textOk : '是',
						textCancel : '否',
						icon : '04',
						funcOk : function(){
							new Interface("http://photo.blog.sina.com.cn/services/ajax_collection_del.php", "ijax").request({
								POST : {
									uid : scope.$uid,
									id : thisId
								},
								onSuccess:function(res){
									//windowDialog.alert(cancelCollect.html,cancelCollect.opt);
									if(_amount - 1 > (page - 1) * (recordsColumnCount * recordsRowCount)){
										document.location.reload();
									}
									else{
										document.location.href = "http://photo.blog.sina.com.cn/favorite/u/"+ scope.$uid +"/page"+(page-1);
									}
								},
								onError:function(res){
									windowDialog.alert($SYSMSG[res.code]);
								}
							});
						}
				});
			};
		},			
		onError : function(res){
			windowDialog.alert($SYSMSG[res.code]);
		}
	});
	
	
	function StringBuffer() { 
	    this.buffer = []; 
	}
	
	StringBuffer.prototype.append = function(str) {
	    this.buffer.push(str);
	    return this;
	};
	
	StringBuffer.prototype.toString = function() {
	    return this.buffer.join("");
	};
	
	StringBuffer.prototype.getLength = function() {
	    return this.buffer.length;
	};
});
