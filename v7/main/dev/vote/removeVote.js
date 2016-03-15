$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("msg/voteMsg.js");

window.removeVote = function(){
	
	winDialog.confirm('是否确定删除投票？', {
            funcOk: function(){
                if (articleEditorCFG.articleStatus.match(/(2|3)/g) /*&& articleEditorCFG.articlevData != null 尝试不判断,还没想清楚会出什么问题*/) {
					new Interface("http://control.blog.sina.com.cn/admin/vote/del_vote_from_article.php", "ajax").request({
						POST: {
							blog_id: $E("blog_id").value
						},
						onSuccess: function(res){
							$E("editorForm").blogVote.value = 'no';
							window.vote_status = 'remove';
							$E("saveStatus").style.display = 'none';
							$E("newStatus").style.display = '';
							// $E("voteId").value = null;
							articleEditorCFG.articlevData = null;
							
							window.insertVote = null;
						},
						onError: function(res){
							winDialog.alert($SYSMSG[res.code], {
								icon: "01"
							});
						}
					})
				}
				else {
					$E("editorForm").blogVote.value = 'no';
					window.insertVote = null;
					window.vote_status = 'remove';
				}
            }.bind2(this),
			funcCancel: function(){
               editorTabs.showTab("vote");
            }.bind2(this),
            textOk: "是",
            textCancel: "否",
            defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
            title: "提示",
            icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
        }, "insertVoteTip");
		
 		var dia=winDialog.getDialog("insertVoteTip");
		var closeBtn=dia.getNodes().btnClose;
		Core.Events.addEvent(closeBtn,function(){editorTabs.showTab("vote");},"click");
}

window.showVote = function(){
	if($E("editorForm").blogVote){
	    $E("editorForm").blogVote.value = 'yes';
	    //window.insertVote =  new Vote();
	}

    }