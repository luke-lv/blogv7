$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/uic.js");
$import("lib/login/ui.js");
$import("lib/checkAuthor.js");
$import("lib/blogv/getVHTML.js");
$import("msg/voteMsg.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/dom/removeParentNode.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/system/br.js");
$import("vote/FusionCharts.js");

var voteValues = [];//记录投票的%比值

RenderFlash = Core.Class.create();
RenderFlash.prototype = {
	
	flashId:null,
	data:null,
	current:null,
	
	eventDom:null,
	
	_labels:null,
	selected:[],
	
	initialize:function() {
		this.eventDom = {
			tab:$E('tabDiv')?$E('tabDiv'):null,
			line:$E('lineView')?$E('lineView'):null,
			pie:$E('pieView')?$E('pieView'):null,
			column:$E('columnView')?$E('columnView'):null,
			content:$E('voteViewContent')?$E('voteViewContent'):null
		};
			
		this._refreshFlashId();
		
		this._addClickEvent(this.eventDom.line);
		this._addClickEvent(this.eventDom.pie);
		this._addClickEvent(this.eventDom.column);
		
		this.combineData();
	},
	
	showTab:function(flashType, flashId, parentId) {
		if(this.current == flashType)
			return;
		
		var flashBar = Core.Dom.getElementsByClass($E('voter'), 'div', 'vShape')[0];
		if (flashBar) {
			flashBar.style.display = "";
		}
		//trace("showTab");
			
		window.clearAllInterval();

		if (flashType == "line") {
			this.current = "line";
			$E('voteViewContent').innerHTML = window.vote_cache_content_html;
			window.renderVoteNum();
			var items = document.getElementsByName("chb1");	 
			for(var j=0;j<items.length;j++)
			{
				items[j].disabled = "true";
				try {
					items[j].parentNode.childNodes[3].style.cursor = "default";
				}catch(error) {} 
			}
		}else if(flashType == "Pie3D.swf") {
			this.current = "Pie3D.swf";
			
			var html = this._tabTemplate.chooses.join('');
			var uls = "";
			for(var i=0;i<this._labels.length;i++) {
				var itemTpl = this._tabTemplate.item.join('');
				itemTpl = itemTpl.replace("#{type}", window.vote_rc_type+"");
				itemTpl = itemTpl.replace(/([#][{]index[}])/ig, i+1);
				itemTpl = itemTpl.replace("#{text}", this._labels[i]);
				uls += itemTpl;
			}
			html = html.replace("#{uls}", uls);
			html += this._tabTemplate.flash.join('');
			this.eventDom['content'].innerHTML = html;
			var height = this._labels.length*30;
			if(height < 150)
				height = 150;
			// Render the Flash
			var xml = "<chart baseFontSize='12' baseFontColor='888888' numberSuffix='%25' showAboutMenuItem='0' decimals='2' chartTopMargin='0' chartBottomMargin='0' caption='' showValues='0' formatNumberScale='0' bgColor='99CCFF,FFFFFF' bgAlpha='0,0' startingAngle='60'>";
			for(var i=0;i<this.data.length;i++) {
				var item = this.data[i];
				if(this.selected[i] != null) {
					xml += "<set label='"+(i+1)+"' value='"+voteValues[i].replace("%", "")+"' displayValue='"+(Core.String.shorten(this._labels[i], 7, '…'))+"' toolText='"+this._labels[i]+"("+voteValues[i]+")' isSliced='1' />";
				}else {
					xml += "<set label='"+(i+1)+"' value='"+voteValues[i].replace("%", "")+"' displayValue='"+(Core.String.shorten(this._labels[i], 7, '…'))+"' toolText='"+this._labels[i]+"("+voteValues[i]+")' />";
				}
			}
			xml += "</chart>";
			var chart = new FusionCharts($_GLOBAL.flashBasicURL + "Pie3D.swf", flashId, "360", height, "0", "0");
		    chart.setDataXML(xml);	
			chart.setTransparent(true);	   
		    chart.render(parentId);
		}else if(flashType == "Column3D.swf") {
			this.current = "Column3D.swf";
			
			var html = this._tabTemplate.chooses.join('');
			var uls = "";
			for(var i=0;i<this._labels.length;i++) {
				var itemTpl = this._tabTemplate.item.join('');
				itemTpl = itemTpl.replace("#{type}", window.vote_rc_type+"");
				itemTpl = itemTpl.replace(/([#][{]index[}])/ig, i+1);
				itemTpl = itemTpl.replace("#{text}", this._labels[i]);
				uls += itemTpl;
			}
			html = html.replace("#{uls}", uls);
			html += this._tabTemplate.flash.join('');
			this.eventDom['content'].innerHTML = html;
			var height = this._labels.length*30;
			if(height < 150)
				height = 150;
			// Render the Flash
			var xml = "<chart baseFontSize='12' baseFontColor='888888' showValues='1' outCnvBaseFontColor='999999' outCnvBaseFontSize='12' numberSuffix='%25' showAboutMenuItem='0' decimals='2' yAxisMaxValue='100' palette='2' enableRotation='1' canvasBgColor='ffffff' canvasBgAlpha='0' canvasBgDepth='3' canvasBaseColor='ffffff' divLineColor='d8d8d8' numDivLines='4' bgAlpha='0' divLineColor='d8d8d8' canvasPadding='8' chartLeftMargin='0' chartRightMargin='5' chartTopMargin='5' chartBottomMargin='0' maxColWidth='70' showValues='0'><styles><definition><style name='myToolTip' type='font' size='12' color='666666' /></definition><application><apply toObject='ToolTip' styles='myToolTip' /></application></styles>";
			for(var i=0;i<this.data.length;i++) {
				var item = this.data[i];
				xml += "<set label='"+(i+1)+"' value='"+voteValues[i].replace("%", "")+"' toolText='"+this._labels[i]+"("+voteValues[i]+")' />";
			}
			xml += "</chart>";
			var chart = new FusionCharts($_GLOBAL.flashBasicURL + "Column3D.swf", flashId, "360", height, "0", "0");
		    chart.setDataXML(xml);		
			chart.setTransparent(true);   
		    chart.render(parentId);
		}
		
		if($E('flashContent'))
			$E('flashContent').style.padding = "13px 0 0 ";
	},
	
	_refreshFlashId:function() {
		this.flashId = Core.Math.getUniqueId();
	},
	
	_addClickEvent:function(dom) {
		var _this = this;
		if (dom) {
			dom.onclick = function(){
				_this._onClickHandler(this);
			}
		}
	},
	
	_onClickHandler:function(dom) {
		var _this = this;

		function updateTabStatus(type) {
			_this.eventDom['line'].parentNode.className = "";
			_this.eventDom['pie'].parentNode.className = "";
			_this.eventDom['column'].parentNode.className = "";
			
			_this.eventDom[type].parentNode.className = "cur SG_txtb";
		}
		
		if(dom != null) {
			var id = dom.id;
			if (id == "lineView") {
				this.showTab("line", "lineId", "voteViewContent");
				updateTabStatus('line');
			}else if (id == "pieView") {
				this.showTab("Pie3D.swf", "Pie3D_" + this.flashId, "flashContent");
				updateTabStatus('pie');
			}else if (id == "columnView") {
				this.showTab("Column3D.swf", "Column3D_" + this.flashId, "flashContent");
				updateTabStatus('column');
			}
		}
	},
	
	combineData:function(changeData) {
		this.data = [];
		var labels = this._getLabel();
		for(var i=0;i<labels.length;i++) {
			this.data[this.data.length] = {
                label : labels[i], 
                num : window.vote_count.detail[i]
            };
		}
	},
	
	_getLabel:function() {
		var labels = [];
		var spans = Core.Dom.getElementsByClass($E('voteViewContent'), 'span', '');
		var length = spans.length;
		for(var i=0;i<length;i++) {
			labels[labels.length] = spans[i].innerHTML;
		}
		this._labels = labels;
		return labels;
	},
	
	_tabTemplate:{
		chooses:['<div class="vContentRe">','<ul>','#{uls}','</ul>','</div>'],
		item:['<li class="clearfix">','<div class="choosed">','<input type="#{type}" disabled="disabled" id="chb#{index}"/><label for="chb#{index}" style="cursor:default"><em>#{index}.</em><span>#{text}</span></label>','</div>','</li>'],
		flash:['<div id="flashContent" class="vContentPic">','</div>']
	}
};

(function(_){
	
	_.rf = null;
	
    _.changeType = function(flag){
		$E("mutiple").style.display = flag ? '' : 'none';
		$E("voteType").value = flag ? $E('mutiple').value : 1;
	};
	
    _.checkNum = function(self,mutipleNum){
		var chks = document.getElementsByName("chb1");
		var chkedNum = 0;
		for(var i=0;i<chks.length;i++){
			var chk = chks[i];
			if(chk.checked){
				chkedNum++;
			}
		}
	
		if(chkedNum > mutipleNum){   
		    winDialog.alert("最多只能选"+mutipleNum+"项！",{icon:'01'});
		    self.checked = false;
		}
    };
	
    _.isExpired = function(sDate){
		return (sDate.replace(/(-)|\s/g,'') < getTimestamp("yyyy-MM-dd hh").replace(/(-)|\s/g,''));
    };
	
    _.getTimestamp =function(format){
		//the separatings line can be "-" ,'/' or '.' or else<br />
		var currentTime = new Date();
		var thisYear = currentTime.getFullYear();
		var thisMonth = currentTime.getMonth() + 1 ;
		thisMonth = thisMonth > 9 ? thisMonth : ("0" +thisMonth);
		var today = currentTime.getDate() > 9 ? currentTime.getDate() :("0" +currentTime.getDate());
		var hh = currentTime.getHours();
		var mm = currentTime.getMinutes() > 9 ? currentTime.getMinutes() : ("0" + currentTime.getMinutes());
		var ss = currentTime.getSeconds() > 9 ? currentTime.getSeconds() : ("0" + currentTime.getSeconds());
		return (format.replace(/(y{2,4})/, thisYear).replace('MM', thisMonth).replace('dd', today).replace('hh', hh).replace('mm', mm).replace('ss', ss));
    };

    _.readyFun = function(){
		var uid;
		var isVoted = false;

		Lib.checkAuthor();
		if($isLogin)
			uid = $UID;
		else
			uid = '0';

		var mycookie = swfAPI.getC(uid);
		if(mycookie){
			var cookielist = mycookie.split("|");

			for(var i=0;i<cookielist.length;i++){
				var onecookie = cookielist[i];
				if(onecookie == scope.$articleid){
					isVoted = true;
					break;
				}	
			}
		}
		if(!isVoted){
			Core.Events.addEvent("voteBtn",function(){
				//var items = document.getElementsByName("chb1");	
				var items=$T($E("voteViewContent"),"input");  
				var selectedItems = [];
				
				for(var i = 0;i<items.length;i++){
					var item = items[i];
					
					if(item.checked&&item.name&&item.name=="chb1"){
						selectedItems.push(i+1);
					}
				}
				
				if(selectedItems.length < 1) {
					winDialog.alert("请选择要投票的项！",{icon:'01'});
					return false;
				}
				
				// 修复重复登录问题
				Lib.checkAuthor();
				if($isLogin)
					uid = $UID;
				else
					uid = '0';
                //投票后种flash cookie
				function setFlashCookie(){
                    try{
                        //将种flash cookie提前，有时种flash cookie会失败
                        var flashBar = Core.Dom.getElementsByClass($E('voter'), 'div', 'vShape')[0];
                        if (flashBar) {
                            flashBar.style.display = "";
                        }
                        if(mycookie){
                            if(cookielist.length > 99){
                                swfAPI.clearK(uid);
                            }else 
                                mycookie = scope.$articleid + "|" + mycookie;
                        }else{
                            mycookie = scope.$articleid; 
                        }
                        swfAPI.setC(uid,mycookie.toString());
                    }catch(e){
                        //出错打印
                        Debug.error("投票种flash cookie失败！错误原因："+e);
                    }
                }
				this.flag = true;
				var selectedLen = selectedItems.length;
				new Interface("http://control.blog.sina.com.cn/admin/vote/shot_vote.php?version=7","ijax").request({
					POST:{
						blog_id        : scope.$articleid,
						vote_checklist : selectedItems.join(",")			
					},
					onSuccess : function(res){
                        setFlashCookie();
                        try {
							var btn = Core.Dom.getElementsByClass(document, 'div', 'vBtn')[0];
							Core.Dom.removeParentNode($E('voteBtn'));
							btn.innerHTML = "<span class=\"voteState\">已投票</span>";
							clearAllInterval();
						}catch (error) {}
						
						window.vote_count.total += 1;
						var spans = Core.Dom.getElementsByClass($E('voteViewContent'), 'span', '');
						var tempArr = [];
						for (var m=0; m<selectedLen; m++){
							var item = selectedItems[m];
							window.vote_count.detail[item-1] += 1;
							tempArr.push(spans[item-1].innerHTML);
						}
						var newItem = {};
						newItem.uid = $UID;
						var time = new Date().getTime();
						time /= 1000;
						time = Math.ceil(time);
						newItem.time = time;
						newItem.vote = tempArr;
						var tempResult = window.vote_interface_result;
						var tempRArr = [];
						for (var i=0; i<tempResult.length; i++){
							tempRArr[i+1] = tempResult[i];
						}
						tempRArr[0] = newItem;
						window.vote_interface_result = tempRArr;
						renderVoteNum();
						initLoginBar();
						
					},
					onError : function(res){
						try {
							winDialog.alert($SYSMSG[res.code]);
							if (res.code == 'B00902') {
								var btn = Core.Dom.getElementsByClass(document, 'div', 'vBtn')[0];
								Core.Dom.removeParentNode($E('voteBtn'));
								
								btn.innerHTML = "<span class=\"voteState\">投票已截止</span>";
								
								var voteItems = $N('chb1');
								
								for (var i = 0; i < voteItems.length; i++) {
									voteItems[i].disabled = true;
									try {
										voteItems[i].parentNode.childNodes[3].style.cursor = "default";
									}catch(error) {} 
								}
								
								var flashBar = Core.Dom.getElementsByClass($E('voter'), 'div', 'vShape')[0];
								if (flashBar) {
									flashBar.style.display = "";
								}
							}else if(res.code == 'B00904') {
                                //重新在flash上种cookie
                                if(!isVoted){
                                    setFlashCookie();
                                }
								var btn = Core.Dom.getElementsByClass(document, 'div', 'vBtn')[0];
								Core.Dom.removeParentNode($E('voteBtn'));
								
								btn.innerHTML = "<span class=\"voteState\">已投票</span>";
								
								var voteItems = $N('chb1');
								
								for (var i = 0; i < voteItems.length; i++) {
									voteItems[i].disabled = true;
									try {
										voteItems[i].parentNode.childNodes[3].style.cursor = "default";
									}catch(error) {} 
								}
								/*
								var flashBar = Core.Dom.getElementsByClass($E('voter'), 'div', 'vShape')[0];
								if (flashBar) {
									flashBar.style.display = "";
								}
                                */
							}
						}catch(error) {}
					}
				});
			},'click',false);
		}
		else
		{
			var btn = Core.Dom.getElementsByClass(document, 'div', 'vBtn')[0];
			Core.Dom.removeParentNode($E('voteBtn'));
							
			btn.innerHTML = "<span class=\"voteState\">已投票</span>";
			
			var items = document.getElementsByName("chb1");	 
			for(var j=0;j<items.length;j++)
			{
				items[j].disabled = "true";
				try {
					if ($IE) {
						items[j].parentNode.childNodes[2].style.cursor = "default";
					}else {
						items[j].parentNode.childNodes[3].style.cursor = "default";
					}
				}catch(error) {}; 
			}
			
			var flashBar = Core.Dom.getElementsByClass($E('voter'), 'div', 'vShape')[0];
			if (flashBar) {
				flashBar.style.display = "";
			}
		}
		
    };

    _.swfAPI = {
		setC : function(key, value){
			
			$E('swfId').setC(key, value);
		},
		getC : function(key){

			return $E('swfId').getC(key);
		},
		clearK : function(key){
			$E('swfId').clearK(key);
		},
		clearC : function(){
			$E('swfId').clearC();
		}
    };

	_.insertList = function(oResult) {//渲染最新投票列表
		function getLocTime(nS) {
    		var date = new Date(nS*1000);
			return date.getFullYear()+"-"+((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+date.getDate()+" "+date.getHours()+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
		}
		// console.log(oResult);

		var tpl = '<li><span class="SG_dot"></span><span class="txt"><a target="_blank" href="#{url}">#{nick}</a>#{userV}&nbsp;<span class="SG_txtb">投票给 #{vote}</span><em class="SG_txtc">#{time}</em></span></li>';
		var list = "";
        var getVHTML = Lib.blogv.getVHTML;
		// console.log(vote_interface_result);
		if(this.vote_interface_result) {

			for(var i=0; i<vote_interface_result.length; i++) {
				var item = vote_interface_result[i];
				var html = tpl;
				html = html.replace("#{url}", 'http://blog.sina.com.cn/u/'+item["uid"]);
				html = html.replace("#{nick}", oResult[item["uid"]]);    //oResult[key]);
                html = html.replace("#{userV}", getVHTML(item["wtype"])); 
				html = html.replace("#{time}", getLocTime(item["time"]));
    
				var con = "";
				for(var j=0;j<item["vote"].length;j++) {
					con += '"'+item["vote"][j]+'" ';
				}
				html = html.replace("#{vote}", con);
				list += html;
				if (i == 10){
					break;
				}
			}
			
			if($E('voterlist')) {
				$E('voterlist').innerHTML = list;
			}
		}
	};
	
	_.initLoginBar = function() {
		Lib.checkAuthor();
		if ($E('vote_login_txt')) {
			if ($isLogin) {
				$E('vote_login_txt').style.display = "none";
			}
			else {
				$E('vote_login_txt').style.display = "";
				
				$E('vote_login').onclick = function(){
					var trayLogin = new Lib.Login.Ui();
					trayLogin.login();
				};
			}
		}
		
		//this.initNewVote();
	};
	
	_.initNewVote = function() {//增加发起新投票及分享投票节点，增加更多投票链接	
		Lib.checkAuthor();
		if ($E('voteAD')) {
			$E('voteAD').innerHTML = '<a class="SG_linka"><img height="15" align="top" width="15" class="SG_icon SG_icon33" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" title="投票"></a>&nbsp;<a target="_blank" href="http://control.blog.sina.com.cn/admin/article/article_add.php#voteadd">发起新投票</a>&nbsp;&nbsp;&nbsp;<a class="SG_linka"><img height="18" align="top" width="18" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon110"></a>&nbsp;<a href="#" id="shareVote">分享此投票</a>';	
			$E('shareVote').onclick=function(){				
				var title = encodeURIComponent('分享投票：' + $T($E('voter'),'span')[0].innerHTML + '——来自'+scope.owenerNickName+'的博文：' +  Core.Dom.byClz(document.body, 'h2', 'titName')[0].innerHTML||""),
				r = "新浪-博客",
				l = 'http://blog.sina.com.cn',
				u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&title=' + title + "&url=" + encodeURIComponent(document.location) + '&source=' + r + '&sourceUrl=' + encodeURIComponent(l) + '&content=utf-8&appkey=1617465124' ;
				window.open(u, 'mb', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
				return false;
			};
		}
		
		var morevotediv = $E('cc_morevote');//增加更多投票链接	
		if(!morevotediv){
			morevotediv = $C('div');
			morevotediv.id = "cc_morevote";
			morevotediv.className = "voteapp_btnMore";
			morevotediv.innerHTML = '<a href="http://control.blog.sina.com.cn/blogprofile/profilevote.php?type=1" target="blank" title="查看更多投票">查看更多投票&gt;&gt;</a><img class="SG_icon SG_icon11" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="新" align="absmiddle" />';
			$E('voterlist').parentNode.parentNode.appendChild(morevotediv);
		}
	};

    _.renderVoteNum = function(){//渲染投票信息 横条HTML版
		var uidList = [];
		var result = window.vote_interface_result;

		for (var i = 0; i < result.length; i++) {
			var item = result[i];
			uidList[uidList.length] = item["uid"];
		}

		Lib.Uic.getNickName(uidList, insertList);//根据uid获得昵称
	
		this.initNewVote();//增加发起新投票及分享投票节点
		
		var temp = $E("chb1");
		if (temp != null && temp.type == "radio") {
			window.vote_rc_type = 'radio';
		}else {
			window.vote_rc_type = 'checkbox';
		}

		this.valueContents = Core.Dom.getElementsByClass($E("voter"),"div","num");
		var total = 0;
		voteValues = [];		
		var k;
		var counts = window.vote_count.detail;
		var total = window.vote_count.total;
		$E("total").innerHTML = total + "人";
		var totalTickets = 0;
		for (var j=0; j<counts.length; j++){
			totalTickets += counts[j];
			// console.log(totalTickets);
		}

		// 按最高单项投票数如果超过总人数，则重置总人数为单项最高，想法保留
		for(k=0;k<valueContents.length;k++){
			var itemVote = counts[k];
			
			if (totalTickets == 0) {
				var percent = "0%";
			}
			else {
				if (Math.round(itemVote / totalTickets * 100) > 100) {
					var percent = "100%";
				}
				else {
					var percent = Math.round(itemVote / totalTickets * 100) + "%";
				}
			}
			voteValues.push(percent);
			valueContents[k].innerHTML = itemVote + '<span class="SG_txtc">('+percent+')</span>';	     
		}
		renderProgress(voteValues);
    };
	
    _.renderProgress = function(voteValues){//渲染投票过程
		window.itvIds = [];
		var i;
		var valueBars = Core.Dom.getElementsByAttr($E("voter"),"name","voteResult");
		
		var valueContents = Core.Dom.getElementsByClass($E("voter"),"div","num");
		var percentW = [];
		for(i=0;i<valueContents.length;i++){
			(/\((.*)\)/).test(valueContents[i].innerHTML);
			percentW[i]=RegExp.$1;
		}
		
		for(i=0;i<valueBars.length;i++){
			valueBars[i].className = "color c"+(i+1);
			valueBars[i].style.fontSize = "8px";
			valueBars[i].style.width = "0px";
			window.itvIds[i]=window.setInterval((function(idx){
				return function(){
					
					if(parseInt(valueBars[idx].style.width) < parseInt(percentW[idx])){
						valueBars[idx].style.width= parseInt(valueBars[idx].style.width, 10)+1+"%";
					}else{
						window.clearInterval(itvIds[idx]);
					}
				};
			})(i),10);
		}
		
		if(!this.rf)
			_.rf = new RenderFlash();
	};
	
	_.clearAllInterval = function() {//清空所有定时
		if (window.itvIds) {
			for (var i = 0; i < window.itvIds.length; i++) {
				window.clearInterval(itvIds[i]);
			}
		}
	};
	
})(window);