/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 插入相册图片
 */
$import("sina/core/class/create.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/pagination.js");
$import("sina/core/array/each.js");
$import("lib/builder.js");
$import("sina/core/string/shorten.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/dom/getChildrenByClass.js");

var AlbumImage = Core.Class.create();

AlbumImage.prototype = {
    prePics: {
        count: 0
    },
    initialize: function(){
        this.initAlbumPic();
		//相册专辑发博文
	
    },
    /**
     * 初始化相册图片数据
     */
    initAlbumPic: function(){
        //菜单
        var url = 'http://control.blog.sina.com.cn/admin/myalbum/user_category_list.php';
        setTimeout(function(){
            Utils.Io.JsLoad.request(url, {
                onComplete: function(data, doc){
                    if (data.code == "A00006") {
                        var list = data.data;
                        var t = $E('album_menu');
                        var s = [];
                        s.push('<li class="current" onmouseover="window.albumImage.albumListHover(this);" onclick="window.albumImage.showAlbumPics(\'0\', this);this.blur();"><a href="#" onclick="return false;">全部图片</a></li>');
                        if (list != null) {
                            //trace("list not null");
                            Core.Array.each(list, function(cur){
                                var cls = '';
                                var key = cur['sns:vid'];
                                var title = cur['sns:title'];
                                s.push('<li id="album_'+key+'" class="' + cls + '" onmouseover="window.albumImage.albumListHover(this);" onclick="window.albumImage.showAlbumPics(\'' + key + '\', this);this.blur();" ><a href="#" onclick="return false;" title="' + title + '" >' + Core.String.shorten(title, 14, "") + '</a></li>');
                            });
                        }
                        t.innerHTML = s.join('\n');
                        //默认选中 all
                        this.currMenu = t.firstChild;
						this.showCategorys();
                    }
                }.bind2(this)
		     });
		}.bind2(this), 1);
        //默认显示全部图片
        ctgKey = "0";
        this.getAlbumPics(1);
    },
	showCategorys:function(){
		var ctg_id=Core.System.getParam("ctg_id"); 
		if (ctg_id) {
		//	this.showAlbumPics(vid,"li");
			var ele=$E("album_"+ctg_id);
			this.showAlbumPics(ctg_id, ele);
			ele.blur();
		}
	},
    albumListHover: function(){
        var aListHover = function(el){
            el = $(el);
            if (el.className == 'current') {
                return;
            }
            el.className = 'over';
            el.onmouseout = function(){
                if (el.className == 'current') {
                    return;
                }
                el.className = '';
            };
        };
    },
    /**
     * 相册图片分类选择
     */
    showAlbumPics: function(key, el){
        ctgKey = key;
        this.getAlbumPics(1);
        if (this.currMenu) {
            $E(this.currMenu).className = '';
        }
        var ep = $E(el);
        ep.className = 'current';
        this.currMenu = ep;
    },
    /**
     * //获取并显示相册图片
     * @param {Number} pageNum
     */
    getAlbumPics: function(pageNum){
        var key = ctgKey;
        this.currAlbum = {};
        var url = 'http://control.blog.sina.com.cn/admin/myalbum/user_photo_list.php?ctg_id=' + key + '&pagesize=14&p=' + pageNum;
        setTimeout(function(){
			Utils.Io.JsLoad.request(url, {
            onComplete: function(data, doc){
                if (data.code == "A00006") {
                    list = data.data;
                    var t = $E('album_pics');
                    t.innerHTML = '';
                    if (list.list.length < 1) {
                        var tip = (key == 0) ? '你的博客图片暂无内容。' : '此专辑暂无内容。';
                        t.innerHTML = '<li >' + tip + '</li>';
                        return;
                    }
                    if (!window.imageList.albumCallback) {
                        window.imageList.addDelCallback(window.albumImage.cancelSelect);
                        window.imageList.albumCallback = true;
                    }
                    
                    Core.Array.each(list.list, function(curPic){
                        var curPicUrl = curPic.link;
                        var smallPicUrl = curPic['sns:link1'];
                        
                        var struc = $C("li");
                        var struc_a = $C("a");
                        var struc_a_img = $C("img");
                        var struc_img = $C("img");
                        
                        struc_a.href = "javascript: void(0);";
                        
                        struc_img.className = "SG_icon SG_icon106";
                        struc_img.align = "absmiddle";
                        struc_img.title = "选中";
                        struc_img.src = "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif";
                        struc_img.width = 18;
                        struc_img.height = 18;
                        
                        
                        struc_a_img.src = smallPicUrl;
                        struc_a_img.width = 50;
                        struc_a_img.height = 50;
                        struc_a_img.alt = "点击添加";
                        struc_a.appendChild(struc_a_img);
                        struc.appendChild(struc_a);
                        struc.appendChild(struc_img);
                        t.appendChild(struc);
                        
                        var imageListId = window.imageList.checkValue(smallPicUrl);
                        if (imageListId != false) {
                            struc.className = "cur";
                            struc_a_img.delId = imageListId;
                            struc_a_img.isSelect = true;
                        }
						
		
	
                        //点图片也可添加
                        struc_a_img.onclick = function(){
                            //trace("上传");
                            var ele = Core.Events.getEventTarget();
                            if (typeof(ele.isSelect) == "undefined") {
                                ele.isSelect = "0";
                            }
                            if (ele.isSelect == "1") {
                                window.albumImage.delPreviewPics(ele.delId);
                                ele.parentNode.parentNode.className = "";
                                ele.isSelect = "0";
                                
                            }
                            else {
								//trace(">>"+imageList.at);
								if(imageList.at>=imageList.eleMax){
									if(imageList.eleMax>1){
										top.showError("B79006");
									}else{
										top.showError("B79005");
									}
									
								}
								
								
                                var delId = window.albumImage.addPreviewPics(curPicUrl, smallPicUrl);
                                if (delId) {
                                    ele.delId = delId;
                                    ele.parentNode.parentNode.className = "cur";
                                    ele.isSelect = "1";
                                }else{
									top.showError("B79010");
								}
                                
                            }
                        };
                        window.albumImage.currAlbum[curPicUrl] = struc;
                    });
                    /** 分页程序 */
                    var maxPage = Math.ceil(list.count / 14, 14);
                    if (maxPage > 1) {
                        Ui.Pagination.init({
                            "pageNode": "pagingContent",
							"nodeClassNamePrefix" :"SG",
                            "curPage": pageNum, // 当前所在页码
                            "maxPage": maxPage,
                            "pageTpl": window.albumImage.getAlbumPics,
                            "type": 2 // 指定类型为小区域翻页
                        }).show();
                    }
                    else {
                        $E("pagingContent").innerHTML = '';
                    }
					uploadImage.setSize();
                }
                else {
                    $WP.errTips(data.code, "01");
                    return;
                }
				
            }
       
	    });
	   	}.bind2(this),1);
    },
    addPreviewPics: function(url, preview){
        //trace("add_url:" + url);
        //trace("add_preview:"+preview);
        return window.imageList.add(preview, "album");
    },
    delPreviewPics: function(id){
        //trace("del:" + id);
        window.imageList.remove("id", id);
    },
    cancelSelect: function(id, value){
        var eleLis = Core.Dom.getChildrenByClass($E("album_pics"), "cur");
        for (var j = 0; j < eleLis.length; j++) {
            var eleImg = eleLis[j].childNodes[0].childNodes[0];
            if (eleImg.delId == id) {
                eleLis[j].className = "";
                eleImg.isSelect = "0";
                
            }
        }
    }
    
    
};
