/**
 * @author {FlashSoft}
 * arranged by xy xinyu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/getXY.js");
$registJob("editor_cate", function () {
	//$G2("CateFuncs", "FlashSoft", "文章投稿分类程序");
	window.CateFuncs = {
		//rndID: parseInt(Math.random() * 100),
		rndID: 20,
		showCate: function(oSelf){
			this.menuNode.innerHTML = this.articleCate[oSelf.id].cateDesc.split(",").join("<br/>");
			var pos = Core.Dom.getXY(oSelf);
			Core.Dom.setStyle(this.menuNode, "left", pos[0] + "px");
			Core.Dom.setStyle(this.menuNode, "top", pos[1] + 20 + "px");
			Core.Dom.setStyle(this.menuNode, "display", "");
		},
		hideCate: function(){
			Core.Dom.setStyle(this.menuNode, "display", "none");
		},
		articleCate: {
			105: {
				cateName: "娱乐",
				cateDesc: "明星日志,八卦爆料,影音评论,粉丝心情"
			},
			102: {
				cateName: "文化",
				cateDesc: "人文历史,原创文学,书籍评论,文化评论"
			},
			104: {
				cateName: "体育",
				cateDesc: "篮球风云,天下足球,综合体育"
			},
			149: {
				cateName: "情感",
				cateDesc: "情感故事,青春随想,血缘亲情,同志爱人"
			},
			113: {
				cateName: "IT",
				cateDesc: "数码科技,IT评论,科技动态"
			},
			153: {
				cateName: "财经",
				cateDesc: "证券理财,理财技巧,产经发展,经济管理"
			},
			111: {
				cateName: "股票",
				cateDesc: "行情汇报,走势分析,股票心得"
			},
			152: {
				cateName: "校园",
				cateDesc: "校园生活,青春梦想,留学就业"
			},
			122: {
				cateName: "教育",
				cateDesc: "教育时评,考试资料,教育交流"
			},
			131: {
				cateName: "星座",
				cateDesc: "星座命运,预测生肖,占卜测试"
			},
			127: {
				cateName: "旅游",
				cateDesc: "旅游景点,路线推介,交通住宿,游记散文"
			},
			134: {
				cateName: "时尚",
				cateDesc: "美丽潮流,流行服饰,时尚杂志"
			},
			145: {
				cateName: "休闲",
				cateDesc: "私人生活,休闲方式,减压放松,家中宠物"
			},
			108: {
				cateName: "美食",
				cateDesc: "美食推介,餐厅品鉴,食谱大全"
			},
			130: {
				cateName: "汽车",
				cateDesc: "行业评论,业界动态,汽车产品,精彩旅程"
			},
			116: {
				cateName: "军事",
				cateDesc: "军事热点,军情揭秘,军史回顾,军事装备"
			},
			129: {
				cateName: "房产",
				cateDesc: "地产行情,房屋推介,租住日记"
			},
			136: {
				cateName: "家居",
				cateDesc: "家装设计,家居生活,装修点滴"
			},
			125: {
				cateName: "育儿",
				cateDesc: "亲子孕育,怀孕生子,婴幼教育,温馨家庭"
			},
			141: {
				cateName: "健康",
				cateDesc: "健康资讯,寻医问药,保健养生,心理卫生,美容瘦身"
			},
			118: {
				cateName: "游戏",
				cateDesc: "游戏新闻,评论杂谈,游戏介绍,游戏cosplay,攻略心得"
			},
			117: {
				cateName: "杂谈",
				cateDesc: "随笔感悟,生活记录,综合评论"
			}
		},
		writeCate: function () {
			var htmlBuffer = [];
			var item = null;
			var html = '';
            var compare = {
                '101': 105,
                '103': 113,
                '105': 149,
                '112': 125,
                '113': 102,
                '114': 122,
                '116': 141,
                '117': 116,
                '118': 131,
                '120': 153,
                '121': 117
            };
            var url = window.location.href;
            var arrs = /channel_id=(\d*)&/i.exec(url);
            
            for (var key in this.articleCate) {
				item = this.articleCate[key];
				html ='<span>\
					<input type="radio" name="sina_sort_id" id="sort_id_' + this.rndID + '_' + key + '" value="' + key + '">\
					<label style="text-align: left;" onmouseover="CateFuncs.showCate(this)" onmouseout="CateFuncs.hideCate(this)" id="' +
                key +
                '" for="sort_id_' +
                this.rndID +
                '_' +
                key +
                '">' +
                item.cateName +
                '</label></span>\
		   		';
				htmlBuffer[htmlBuffer.length] = html;
				html = null;
			}
			Core.Dom.addHTML($E("cateContent"), htmlBuffer.join(""));
            if (arrs != null && arrs[1] != null && typeof compare[arrs[1]] != 'undefined') {
                $E("sort_id_" + this.rndID + "_" + compare[arrs[1]]).checked = true;
            }
            else {
				if(articleEditorCFG.articleClassID && $E("sort_id_" + this.rndID + "_" + articleEditorCFG.articleClassID)){
					$E("sort_id_" + this.rndID + "_" + articleEditorCFG.articleClassID).checked = true;
				}
				//投稿规则修改
				// else{
					
				// 	$E("sort_id_" + this.rndID + "_" + 117).checked = true;
					
					
				// }
				if(scope.$pageid=="editor_film"){//影视博客默认为娱乐
					$E("sort_id_" + this.rndID + "_" + 105).checked = true;
				}
            }
		},
		writeCateMenu: function () {
			Core.Dom.addHTML($E("cateContent"), '<div id="sort_id_menu_' + this.rndID + '" style="line-height: 20px; width: 80px; background: #f4f4f4; position: absolute; top: 0; left: 0; border: 1px solid #7D7D7D; padding: 6px 0; display: none; text-align: center; color: #7D7D7D;">&nbsp;</div>');
			this.menuNode = document.getElementById("sort_id_menu_" + this.rndID);
		}
	};
	CateFuncs.writeCate();
	CateFuncs.writeCateMenu();
});