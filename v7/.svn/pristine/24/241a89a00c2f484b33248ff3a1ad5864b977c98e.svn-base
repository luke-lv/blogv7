/**
 * 弱化个人中心的tab页签
 */
$registJob('createHideTab',function(){
	//触发显示页签panel的元素id
	var sBtn = 'tags';
	var rBtn = 'refurbish';
	if(!$E(sBtn) || !$E(rBtn))
	{
		return;
	}
	if(typeof scope.ccTab == 'undefined')
	{
		scope.ccTab = new Lib.Panel();
		var html = '<div id="#{panel}" class="feed_addlist feedTop_addlist" style="background:#fff;z-index:1000">\
							<div style="display: block;" class="list">\
                                <ul>\
                                	<li class="SG_j_linedot1"><a title=""  href="javascript:void(0)" onclick="scope.ccTab.showNowTab(this);		scope.ccTab.showWaiting();scope.feedView(0,0,1);scope.ccTab.fresh = function(){	scope.feedView(0,0,1);};v7sendLog(\'97_03_01_'+scope.$uid+'\',\'profile_index\',\'\');void(0);"><img width="15" style="border:none;" height="15" align="absmiddle" title="全部" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"><span><strong>全部</strong></span></a></li>\
                                    <li class="SG_j_linedot1"><a title=""  href="javascript:void(0)" onclick="scope.ccTab.showNowTab(this); 		scope.ccTab.showWaiting();scope.feedView(0,1,1);scope.ccTab.fresh = function(){	scope.feedView(0,1,1);};v7sendLog(\'97_03_02_'+scope.$uid+'\',\'profile_index\',\'\');void(0);"><img width="15" style="border:none;" height="15" align="absmiddle" title="博文" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon15"><span>博文</span></a></li>\
                                    <li class="SG_j_linedot1"><a title=""  href="javascript:void(0)" onclick="scope.ccTab.showNowTab(this); 		scope.ccTab.showWaiting();scope.feedView(0,3,1);scope.ccTab.fresh = function(){	scope.feedView(0,3,1);};void(0);v7sendLog(\'97_03_03_'+scope.$uid+'\',\'profile_index\',\'\');"><img width="15" style="border:none;" height="15" align="absmiddle" title="图片" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon18"><span>图片</span></a></li>\
                                    <li class="SG_j_linedot1"><a title=""  href="javascript:void(0)" onclick="scope.ccTab.showNowTab(this);		scope.ccTab.showWaiting();scope.feedView(0,9,1);scope.ccTab.fresh = function(){	scope.feedView(0,9,1);};v7sendLog(\'97_03_04_'+scope.$uid+'\',\'profile_index\',\'\');void(0);"><img width="15" style="border:none;" height="15" align="absmiddle" title="转载" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon20"><span>转载</span></a></li>\
                                    <li class="SG_j_linedot1"><a title=""  href="javascript:void(0)" onclick="scope.ccTab.showNowTab(this);		scope.ccTab.showWaiting();scope.feedView(0,6,1);scope.ccTab.fresh = function(){	scope.feedView(0,6,1);};v7sendLog(\'97_03_05_'+scope.$uid+'\',\'profile_index\',\'\');void(0);"><img width="15" style="border:none;" height="15" align="absmiddle" title="投票" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon33"><span>投票</span></a></li>\
									<li class="SG_j_linedot1"><a title=""  href="javascript:void(0)" onclick="scope.ccTab.showNowTab(this);		scope.ccTab.showWaiting();scope.groupView('+scope.$uid+', 1);scope.ccTab.fresh = function(){	scope.groupView('+scope.$uid+', 1);};v7sendLog(\'97_03_08_'+scope.$uid+'\',\'profile_index\',\'\');void(0);"><img width="15" style="border:none;" height="15" align="absmiddle" title="圈子" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon13"><span>圈子</span></a></li>\
                                    <li class="SG_j_linedot1"><a title=""  href="javascript:void(0)" onclick="scope.ccTab.showNowTab(this); 		scope.ccTab.showWaiting();scope.feedView(0,\'2;4;7;12\',1);scope.ccTab.fresh = function(){	scope.feedView(0,\'2;4;7;12\',1);};v7sendLog(\'97_03_06_'+scope.$uid+'\',\'profile_index\',\'\');void(0);"><img width="15" style="border:none;" height="15" align="absmiddle" title="其他" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon55"><span>其他</span></a></li>\
                                    <li class="SG_j_linedot1 last"><a title=""  href="javascript:void(0)" onclick="scope.ccTab.showNowTab(this);	scope.ccTab.showWaiting();scope.feedView(\'0\',\'10\',1);scope.ccTab.fresh = function(){	scope.feedView(\'0\',\'10\',1);};v7sendLog(\'99_03_01_'+scope.$uid+'\',\'profile_index\',\'\');void(0);"><img width="15" style="border:none;" height="15" align="absmiddle" title="名人" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon1"><span>名人</span></a></li>\
                                </ul>\
                            </div>\
						</div>';
		scope.ccTab.setTemplate(html);
		
		
		Core.Events.addEvent(scope.ccTab.entity,function(){
			scope.ccTab.behidden = false;
		},'mouseover');
		Core.Events.addEvent(scope.ccTab.entity,function(){
			scope.ccTab.behidden = true;
			setTimeout(function(){
				if(scope.ccTab.behidden)
				{
					scope.ccTab.hidden();
				}
			},1000);
		},'mouseout');	
		
		scope.ccTab.showNowTab = function(_m){
			var li_arr = scope.ccTab.entity.getElementsByTagName('li');
			for(var i=0;i<li_arr.length;i++)
			{
				try {
					p = li_arr[i].getElementsByTagName('span')[0];
					p.innerHTML = p.innerHTML.replace(/<.+?>/gim,'');
				}catch(e){}				
			}		
			var s =  _m.innerHTML.replace(/<.+?>/gim,'');
			$E(sBtn).innerHTML = s+ "<em>▼</em>";	
				
			scope.ccTab.hidden();			
		};
		scope.ccTab.myinit= function()
		{
			Core.Events.addEvent($E(sBtn),function(){
				scope.ccTab.behidden = false;
				scope.ccTab.setPosition(Core.Dom.getLeft($E(sBtn))-26, Core.Dom.getTop($E(sBtn)) + $E(sBtn).offsetHeight);
				scope.ccTab.show();
			},'mouseover');
			Core.Events.addEvent($E(sBtn),function(){
				scope.ccTab.behidden = true;
				setTimeout(function(){
					if(scope.ccTab.behidden)
					{
						scope.ccTab.hidden();
					}
				},1000);
			},'mouseout');
			
			Core.Events.addEvent($E(rBtn),function(){
				scope.ccTab.fresh();
			},'click');
			
			var p = $E(sBtn);
			var s =  p.innerHTML.replace(/<.+?>/gim,'');
			s = s.replace(/▼/gim,'');			
			var li_arr = scope.ccTab.entity.getElementsByTagName('li');
			for(var i=0;i<li_arr.length;i++)
			{
				try {
					var q = li_arr[i].getElementsByTagName('span')[0];
					var str = q.innerHTML.replace(/<.+?>/gim,'');
					if(s == str)
					{
						q.innerHTML = "<strong>" + q.innerHTML.replace(/<.+?>/gim,'') + "</strong>";
					}else
					{
						q.innerHTML = q.innerHTML.replace(/<.+?>/gim,'');
					}
				}catch(e){}				
			}			
			
		}
		scope.ccTab.myinit();
		//刷新当前页签
		scope.ccTab.fresh = function(){	scope.feedView(0,0,1);};
		//显示等待图标
		scope.ccTab.showWaiting = function()
		{
			scope.ccTab.hidden();
			if($E('scopeccTabshowWaiting'))return;
			function getMyChildNode(parent,index)
			{
			    s = [];
			    i=0;
			    j=0;
			    while(p = parent.childNodes[i])
			    {			        
			        if(j == index)
			        {
			            return p;
			        }
			        i++;
			        if(p.nodeType == 1)
			        {
			            j++;
			        }
			    }
				return null;
			}
					
			var x=0;
			for(var i=0;i<$E('feed_center_span').childNodes.length;i++)
			{                               
				if($E('feed_center_span').childNodes[i].tagName  && $E('feed_center_span').childNodes[i].tagName=='DIV')
				{
                                        x++;
                                        if(x>1)
					$E('feed_center_span').childNodes[i].style.display = "none";
				}
			}
			
			var html ='<div id="scopeccTabshowWaiting" style="text-align: center; margin: auto; line-height: 100px;height:100px;float:left;padding-left:180px; clear: both;"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif">&nbsp;&nbsp;加载中…                 </div>';
			var p =  getMyChildNode( $E('feed_center_span'),1);			
			var c = document.createElement('div');
			c.innerHTML = html;
			c.style.height="100px";
			p.parentNode.insertBefore(c,p);
		};
	}
	
});

