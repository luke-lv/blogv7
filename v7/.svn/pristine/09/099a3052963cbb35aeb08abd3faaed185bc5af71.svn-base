/** 
 * @fileoverview 编辑博客标题
 * @author xy xinyu@staff.sina.com.cn
 */
$import('lib/lib.js');
$import("sina/core/string/decodeHTML.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/utils/io/jsload.js");
$import('sina/utils/copy.js');
$import("sina/ui/dialog/dialog.js");
$import("sina/utils/limitLength.js");
$import("sina/utils/limitReg.js");
$import("sina/core/string/trim.js");
$import("msg/blogModifyTitleMSG.js");

(function(){
    Lib.modifyTitle = function(){
        if (Lib.modifyTitle._dialog) {
            $E('editTitle').value = Core.String.decodeHTML($E('blognamespan').innerHTML);
            setMessage("B21000");
            Lib.modifyTitle._dialog.show();
            Lib.modifyTitle._dialog.setMiddle();
            Lib.modifyTitle.savingflag = false;
            return;
        }
        //增加编辑对话框----------------------------------------
        var content = '<p class="editBlogNm_tip" id="editBlogNm_tip"><span>提示：</span>12个中文或24个字符以内。</p>' +
        '<div class="editBlogNm_input"><input type="text" class="SG_input" id="editTitle" ><a href="javascipt:;" onclick="return false;" class="SG_aBtn SG_aBtnB"><cite id="saveTitle">保存</cite></a>' +
        '<a href="javascript:;" class="SG_aBtn SG_aBtnB" onclick="return false;"><cite id="cancalTitle">取消</cite></a></div>';
        
        var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false;">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div class="CP_layercon2 editBlogNm" id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
        
        Lib.modifyTitle._dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "编辑博客名称",
            content: content,
            width: 415,
            height: 185
        }, "tips");
        $E('editTitle').value = Core.String.decodeHTML($E('blognamespan').innerHTML);
        Lib.modifyTitle.savingflag = false;
        Lib.modifyTitle._dialog.show();
        Lib.modifyTitle._dialog.setMiddle();
        Lib.modifyTitle._dialog.setAreaLocked(true);
        //进行输入时的一些限制-----------------------------
        Utils.limitLength($E('editTitle'), 24);
        Utils.limitReg($E('editTitle'), /^[\s\u3000]*$/gi); // \.*(sina|ｓｉｎａ)\.*过滤特殊的，目前不需要过滤，让后端过滤
        Core.Events.addEvent($E('saveTitle'), function(){
            if (Core.String.trim($E('editTitle').value) == "") {
                setMessage('B21001');
                return;
            }
            save();
        });
        
        Core.Events.addEvent($E('cancalTitle'), function(){
            disabledBtn(false);
            $E("editBlogNm_tip").innerHTML = "";
            Lib.modifyTitle._dialog.hidden();
        });
        
        Core.Events.addEvent($E("editTitle"), function(){
			var e=Core.Events.getEvent();
            if ($E("saveTitle").disabled == true) {
                return;
            }
            else 
                if (e.keyCode == 13) {
                    save();
                }
            
        }, "keyup");
        
		
        function save(){
            if (Lib.modifyTitle.savingflag == false) {
                Lib.modifyTitle.savingflag = true;
                disabledBtn(true);
                setMessage("B21004");
                
                var title = Core.String.trim($E("editTitle").value);
                var secure_code = $encrypt_code || "";
                Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/admin/custom/update_blogtitle.php?uid=" + scope.$uid + "&title=" + encodeURIComponent(title) + "&secure_code=" + secure_code, {
                    onComplete: function(txt){
                        disabledBtn(false);
                        if (txt && txt.code == "A00006") {
                            $E("blognamespan").innerHTML = Core.String.encodeHTML(title) ;
                            Lib.modifyTitle._dialog.hidden();
							//BLOGBUG-5423 号提案
							if($E('blogTitle').offsetWidth+$E('blogTitle').offsetLeft>$E('headarea').offsetWidth){
								$E('blogTitle').style.left=($E('headarea').offsetWidth-$E('blogTitle').offsetWidth)+'px';
							}
							if($E('blogTitle').offsetHeight+$E('blogTitle').offsetTop>$E('headarea').offsetHeight){
								$E('blogTitle').style.top=($E('headarea').offsetHeight-$E('blogTitle').offsetHeight)+'px';
							}
                        }
                        else 
                            if (txt && txt.code != 'A00006') {
                                showError(txt.code);
                            }
                        Lib.modifyTitle.savingflag = false;
                    }
                });
            }
        }
        function setMessage(code){
            $E('editBlogNm_tip').innerHTML = $SYSMSG[code];
        }
        function disabledBtn(isTrue, save){
            if (isTrue) {
                if (!save) {
                    $E("editTitle").disabled = true;
                }
                $E("saveTitle").disabled = true;
            }
            else {
                if (!save) {
                    $E("editTitle").disabled = false;
                }
                $E("saveTitle").disabled = false;
                setMessage("B21000");
            }
        }
        
    };
})();
