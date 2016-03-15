/**
 * @fileoverview 此文件是应用于博客首页右侧导航关注博主排行选项
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2013-06-27
 * @vertion 0.01
 */
$import("lib/jobs.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getXY.js");
$import("sina/utils/insertTemplate.js");
$import("lib/interface.js");
$import("sina/utils/io/ijax.js");
$import("lib/util/hoverJq.js");
$import("sina/core/string/shorten.js");
$import("lib/showError.js");
$import("lib/msg/systemMSG.js");
$import("lib/msg/attentionMSG.js");
$import("lib/sendLog.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/array/foreach.js");

$registJob('attenBlogerRank', function() {
	var wrap = $E("attenBloggerWrap");
	if(!wrap){
		return;
	}
	
	var tpl = "",tagsTpl="";
	var url = "http://interface.blog.sina.com.cn/riaapi/profile/tj_uid_tag.php";
	var j=0, m=0,z=0, h = 0, data, attenNum, n=0, x=0,uids="";
	var _shorten = Core.String.shorten;
	var flag = 0;
	var type = 0;
	var atenNum = 0;
	var cardWrap, _nameCard,portraits, $lis, attenFunc;
	loadAttenBloggerInfo();
	function loadAttenBloggerInfo(){
		if(m!=0){
			tpl="";
			j=0;
			n=0;
			tagsTpl ="";
			uids="";
		}
		m++;
		if(type === 1){
			var spans = $T(wrap, 'span');
			var spanLen = spans.length;
			for(var i = 0; i<spanLen; i++){
				uids = uids + spans[i].getAttribute("attenUid") + ",";
			}
		}
		Utils.Io.JsLoad.request(url, {
			GET: {
				uid:scope.$uid,
				type:type,
				uids:uids
			},
			onComplete: function(result) {
				atenNum = 0;
				if(result && result.code ==="A00006"){
					if(!type && type===0){
						type=1;
						data = result.data.tj_user;
						var len = data && data.length;
						if(len){
							for(var i=0; i<data.length; i++){
								var veryfy = _shorten(data[i].is_v && data[i].v_info ? data[i].v_info.verified_reason : "",18);
								var veryfylog = data[i].is_v ? (data[i].v_info.type>0 && data[i].v_info.type <=7 ? '<img width="15" height="15" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon147">':'<img width="15" height="15" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon146">'):"";
								tpl = tpl + '<li>' +
								    	'<dl class="pic30">' +
								        	'<dt class="pic" num="'+ (j++) +'"><a href="http://blog.sina.com.cn/u/'+data[i].uid+'" onclick="v7sendLog(\'39_01_01_'+ $UID +'\')" target="_blank"><img width="30" height="30" alt="" src="'+ data[i].image +'"></a>' +
								    		'</dt>' +
								    		'<dd class="con">' +
								        		'<div class="btn"><a href="javascript:;" onclick="return false;" class="W_btn_b" target="_blank"><span attenUid="'+ data[i].uid +'" attenNum="'+ (n++) +'">加关注</span></a></div>' +
								        		'<p class="name"><a href="http://blog.sina.com.cn/u/'+ data[i].uid +'" class="S_func1" target="_blank" onclick="v7sendLog(\'39_01_02_'+ $UID +'\')">'+ _shorten(data[i].uname,10) + veryfylog +'</a></p>' +
								       			'<p class="info">'+ veryfy +'</p>' +
								    		'</dd>' +
										'</dl>' +
									'</li>';
							}	
							tpl = tpl +'<li><p class="ico_hot"><a href="http://blog.sina.com.cn/lm/rank/monthbang/" target="_blank"><img width="48" height="16" src="http://simg.sinajs.cn/blog7style/images/center/newversion/hot.gif" alt=""></a></p></li>'
							wrap.innerHTML = tpl;	
							initAllEvent(data);
						}else{
							wrap.innerHTML = "";
						}
						
					}else{
						var dataSingle = result.data.tj_user;
						var len = dataSingle && dataSingle.length;
						if(len){
							var veryfy = _shorten(dataSingle[0].is_v ? dataSingle[0].v_info.verified_reason : "",18);
							var veryfylog = dataSingle[0].is_v ? (dataSingle[0].v_info.type>0 && dataSingle[0].v_info.type <=7 ? '<img width="15" height="15" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon147">':'<img width="15" height="15" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon146">'):"";
							var replaceTpl = '<dl class="pic30">' +
										        	'<dt class="pic" num="'+ attenNum +'"><a href="http://blog.sina.com.cn/u/'+dataSingle[0].uid+'" onclick="v7sendLog(\'39_01_01_'+ $UID +'\')" target="_blank"><img width="30" height="30" alt="" src="'+ dataSingle[0].image +'"></a>' +
										    		'</dt>' +
										    		'<dd class="con">' +
										        		'<div class="btn"><a href="javascript:;" onclick="return false;" class="W_btn_b" target="_blank"><span attenUid="'+ dataSingle[0].uid +'" attenNum="'+ attenNum +'">加关注</span></a></div>' +
										        		'<p class="name"><a href="http://blog.sina.com.cn/u/'+ dataSingle[0].uid +'" class="S_func1" target="_blank" onclick="v7sendLog(\'39_01_02_'+ $UID +'\')">'+ _shorten(dataSingle[0].uname,10) + veryfylog +'</a></p>' +
										       			'<p class="info">'+ veryfy +'</p>' +
										    		'</dd>' +
												'</dl>';
							wrap.children[attenNum].style.display=""
							wrap.children[attenNum].innerHTML= replaceTpl;
							data[attenNum] = dataSingle[0];
							Core.Events.removeEvent(wrap,attenEventFunc,"click");
							initAllEvent(data);
						}
					}
					
				}	
			},
			onException: function(){
			},
			returnType:"json"
		});
	}
	//初始化关注博主所有事件
	function initAllEvent(data){
		if(flag === 0){
			cardWrap = '<div id="#{cardWrap}" style="display:none;position: absolute; left:567px; z-index:100; top: 760px;" class="c_layer">' +
			    '<div class="bg">' +
			        '<div class="content" id="#{cardContent}" style="height:160;">' +
			            
			        '</div>' +
			        '<div class="arrow arrow_r" id="#{cardArrow}" style="top: auto; bottom: 50px;"></div>' +
			    '</div>' +
			'</div>';
			_nameCard = Utils.insertTemplate($E("sinablogbody"),cardWrap,'BeforeEnd');
			flag=1;
		}
		portraits = Core.Dom.getElementsByClass(wrap,"dt","pic"); 
		$lis = $T(wrap, 'dt');
		var s, t;
		//绑定导航事件
		Lib.util.hoverJq({
            'elm': $lis,
            'mouseenter': function(evt, el, index) {
            	//此处延时处理，为了解决多次滑动名片不显示的问题
            	setTimeout(function(){
        		 	createCard(el,_nameCard,data);
        		},50);
                s && clearTimeout(s);
            },
            'mouseleave': function(evt, el, index) { 
				t && clearTimeout(t);
				t = setTimeout(function(){//离开时，延迟隐藏当前弹出列表
					hideCard(_nameCard);
				}, 50);
            },
            'delay': 50
        });	

        var cards= [_nameCard.cardWrap];
		//绑定名片展示事件
        Lib.util.hoverJq({
            'elm': cards,
            'mouseenter': function(evt, el) { 
               	_nameCard.cardWrap.style.display="";
				t && clearTimeout(t);
            },
            'mouseleave': function(evt,el) {
				s && clearTimeout(s);
            	s = setTimeout(function(){
            		hideCard(_nameCard);
            	},50);
            },
            'delay': 50
        });	
        Core.Events.addEvent(wrap, attenEventFunc,"click");
	}
	function attenEventFunc(event){
    	var target= (event && event.target) || (window.event && window.event.srcElement);
        if(target && target.tagName && target.tagName.toLowerCase() == 'span'){
           	if(!atenNum){
           		atenNum = 1;
           		addAttenFunc(target);
           	}  	
        }else{
            return;
        }
    }
   	//创建名片数据
	function createCard(el,wrapper,data){
		var num = parseInt(el.getAttribute("num"));
		var pos = Core.Dom.getXY(el);
		wrapper.cardWrap.style.top = pos[1]- 133 +"px";
		wrapper.cardWrap.style.left = pos[0]- 344 +"px";
		wrapper.cardWrap.style.display="";
		var veryfy = _shorten(data[num].is_v ? data[num].v_info.verified_reason : "",50);
		var veryfylog = data[num].is_v ? (data[num].v_info.type>0 && data[num].v_info.type <=7 ? '<img width="15" height="15" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon147">':'<img width="15" height="15" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon146">'):"";
		var cardTpl = '<p class="c_layer_close"><a href="javascript:;" onclick="return false;" id="close_card"><img width="13" height="13" alt="" src="http://simg.sinajs.cn/blog7style/images/center/newversion/c_layer_close.gif"></a></p>' +
						'<dl class="name">' +
						    '<dt>' +
						        '<a href="http://blog.sina.com.cn/u/'+ data[num].uid +'" target="_blank" onclick="v7sendLog(\'39_01_01_'+ $UID +'\')"><img width="50" height="50" alt="" src="'+ data[num].image +'"></a>' +
						    '</dt>' +
						    '<dd>' +
						        '<p><a href="http://blog.sina.com.cn/u/'+ data[num].uid +'" target="_blank" onclick="v7sendLog(\'39_01_02_'+ $UID +'\')">'+ data[num].uname +'</a> '+ veryfylog +'</p>' +
						        '<p class="address">博客访问:'+ data[num].pv +'</p>' +
						        '<p>博客等级:'+ data[num].level +'</p>' +
						        '<p style="height:40px;">'+ veryfy +'</p>' +
						        '<p><a href="http://blog.sina.com.cn/u/'+ data[num].uid +'" target="_blank">'+ data[num].blog_title +'&gt;&gt;</a></p>' +
						        '<div class="btn"><a class="W_btn_b" href="javascript:;" onclick="return false;"><span attenUid="'+ data[num].uid +'" attenNum="'+ num +'">加关注</span></a></div>' +
						    '</dd>' +
						'</dl>'+
						'<div class="clearit"></div>';
		wrapper.cardContent.innerHTML = cardTpl;
		var cardBtns = Core.Dom.getElementsByClass(wrapper.cardWrap,"div","btn"); 
		var elCardBtn = cardBtns[0].children[0].children[0];
		var closeCardBtn = $E("close_card");
		//绑定名片里的加关注
		Core.Events.addEvent(elCardBtn,(function(dom){
			return function(){
			 	if(!atenNum){
	           		atenNum = 1;
	           		addAttenFunc(dom);
	           	}  		
			}
		})(elCardBtn),"click");
		//绑定名片里的关闭按钮
		Core.Events.addEvent(closeCardBtn,(function(dom){
			return function(){
				wrapper.cardWrap.style.display="none";
			}
		})(closeCardBtn),"click");
	}

	//隐藏名片函数
	function hideCard(wrapper){
		wrapper.cardWrap.style.display="none";
		wrapper.cardContent.innerHTML="";
	}
	//加关注方法
	function addAttenFunc(el){
		var msg;
		var attenUid = el.getAttribute("attenUid");
		attenNum = parseInt(el.getAttribute("attenNum"));
		v7sendLog('39_01_03_'+ $UID + "_" + attenUid);
		new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php", "ijax").request({
			POST : {
                uid: scope.$uid,
                aid: attenUid
            }
			,onSuccess	: function(){}
			,onError	: function(oData){
				var msg = "";
				switch(oData.code) {
					case "A11007":
						msg = $SYSMSG["A11007"].replace("#{linkNewBlog}", "http://login.sina.com.cn/hd/reg_sec.php?entry=blog");
						winDialog.alert(msg,{funcOk: function(){
								window.open("http://login.sina.com.cn/hd/reg_sec.php?entry=blog", "_blank", "");
							}});
						break;
					case "A33003": // 超过最大关注数 
						msg = $SYSMSG.A33003.replace("#{UID}", $UID);
						winDialog.alert(msg);	
						break;
					case "A33004": // 关注成功
						try{
				            var els = el.parentNode.parentNode.parentNode.parentNode; 
				        }catch(e){
				        }

						
						if(els && els.className === "pic30"){
							els.style.display = "none";
						}else{
							_nameCard.cardWrap.style.display = "none";
							var spans = $T(wrap,"span");
							spans[attenNum].parentNode.parentNode.parentNode.parentNode.style.display="none";
						}
						var alertConf = {
							subText : ['<div class="CP_w_cnt SG_txtb">以后对方的动态（发博文，图片，投票等），都可以在<span style="color:red">个人中心</span>查看啦！</div>'
								, '<ul class="CP_w_part CP_w_aLine">'
									, '<li><a href="http://control.blog.sina.com.cn/blogprofile/index.php?type=3&from=attention" onclick="winDialog.getDialog(\'attention\').hidden();" target="_blank">到个人中心查看关注动态&gt;&gt;</a></li>'
									//, '<li><a href="http://sina.allyes.com/main/adfclick?db=sina&bid=118883,251213,256255&cid=0,0,0&sid=247096&advid=358&camid=19809&show=ignore&url=http://blog.2010.sina.com.cn/yunying/2010worldcup/" target="_blank">记录激动时刻，赢取超级大奖！</a></li>'
								, '</ul>'].join(""),
							icon:	"03",
							width:	300
						}

						try {
							var attentionButton = $E("module_901_attention");
							attentionButton.className = "SG_aBtn SG_aBtn_dis";
							attentionButton.innerHTML = '<cite onclick="Lib.Component.isAttentioned(\'' + $UID + '\', \'' + scope.$uid + '\');">已关注</cite>';
						}catch(e){}

						msg = $SYSMSG["A33004"];
						alertConf["subText"] = alertConf["subText"].replace(/#{UID}/g, $UID);
						winDialog.alert(msg, alertConf, "attention");
						loadAttenBloggerInfo();
						break;
					default:
					 	showError(oData.code);
				}
			}
		});
		
	}
});