/**
 * @fileoverview
 *	人气用户推荐 id=10008
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/ui/template.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");

$import("lib/component/class/registComp.js");
$import("lib/interface.js");
$import("lib/msg/systemMSG.js");

$import("product/attention/attention.js");
$import("component/include/rollingCircle.js");
/**
 * 个人中心人气用户推荐组件
 */
$registComp(10008, {
	"html"	: ['<div class="center_slider center_free">'
					, '<div id="rollingCircle_10008" class="sliderBox"></div>'
					, '<div id="rollingArrow_10008" class="slider_arrow"></div>'
				, '</div>'].join(""),
	"template"	: ['<div class="sliderCell">'
						, '<div class="pt">'
							, '<a href="#{url}" target="_blank"><img src="#{icon}" alt="" /></a>'
						, '</div>'
						, '<div class="sliderInfo">'
							, '<p class="nm"><a href="#{url}" target="_blank">#{uname}</a></p>'
							, '<p class="tip SG_txtb">#{type}类</p>'
							, '<p class="link"><a href="#" onclick="new scope.Attention().add(scope.$uid, #{uid});return false;" class="CP_a_fuc">[<cite>加关注</cite>]</a></p>'
						, '</div>'
					, '</div>'].join(""),
	"load"	: function () {
		var __this = this;
		this.setContent(this.html);
		if (this.currentId == null && scope.$playids[this.compId] != null) {
			this.currentId = scope.$playids[this.compId];
			//this["render_" + this.size]();
		}
		var userData = new Interface("http://control.blog.sina.com.cn/riaapi/profile/attentionuser.php", "ajax").request({
			GET	:	{
				title_code : this.currentId.toString()
			},
			onSuccess : function (oData) {
				__this.render(oData);
			}
		});
	},
	"render"	: function (oData){
		var _data = oData;
		var _len = _data.length;
		for(var i = 0; i < _len; i ++){
			_data[i].icon = "http://portrait" + (_data[i].uid * 1 % 8 + 1) + ".sinaimg.cn/" + _data[i].uid + "/blog/50";
			_data[i].url = "http://blog.sina.com.cn/u/" + _data[i].uid;
			_data[i].online = "display: none;";
		}
		var template = new Ui.Template(this.template);
		var result = '<div class="sliderList" style="height:201px;">' + template.evaluateMulti(_data, true) + '</div>';
		var scroller = new App.rollingCircle("rollingCircle_10008", result, {
			"containerHeight" : 201
		});
		Core.Events.addEvent("rollingArrow_10008", scroller.gotoNext.bind2(scroller));

	}
});
