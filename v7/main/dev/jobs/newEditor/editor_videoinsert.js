/**
 * @author {FlashSoft}
 */
$registJob("editor_video", function () {
	//文章发表: 插入视频回调接口;
	window.ArticleVIDEOFuncs = {
		addVIDEOList: function (sVideoURL, sVideoID) {
//			alert("p:" + sVideoURL);
//			alert("p:" + sVideoID)
			var id = "tmp_id"+ (+new Date());
			editor.insertHTML("<img src='http://simg.sinajs.cn/blog7style/images/common/editor/insetvideo.gif' width='482' height='388' id='"+id+"' vid='" + sVideoID + "'/>",{
				'id' : id
				,properites : {'vid':sVideoID}
			});
			$E("is_media").value = "true";
			VideoDialog.reset();
		}
	};
});