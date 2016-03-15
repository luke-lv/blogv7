/**
 * @fileoverview 编辑或者新增自定义列表组件
 * @author xinyu@staff.sina.com.cn
 */
$import("sina/ui/dialog/windowDialog.js");
$import("sina/ui/dialog/dialog.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/ui/template.js");
$import("sina/ui/renderer/simpleRenderer.js");
$import("sina/utils/limitLength.js");
$import("sina/utils/limitReg.js");
$import("sina/utils/form/radio.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import('pageSet/pageSetVariables.js');
$import("msg/diycomponentsMSG.js");
$import("editor/SmallEditor.js");
$import("pageSet/uidlist.js");

(function () {
    //如果存在id，则是编辑状态，否则是新增状态
    var editTextComp = {
        id: null,
        size: 210,
        dialog: null,
        data: '',
        isnew: false,
        edit: function (id) {
            trace('本次修改的id是：' + id);
            if (id && $E('module_' + id)) {
                editTextComp.size = $E('module_' + id).offsetWidth;
            } else {
                editTextComp.size = 210;
            }
            this.id = id;
            this.isnew = false;
            this.createDlg();

            if (id) {				// 说明是编辑
                this.id = id;
                var _editModule = new Interface('http://control.blog.sina.com.cn/riaapi/sys_module/edit_custmod_html.php?version=7&cid=' + id, "jsload");
                _editModule.request({
                    onSuccess: function (data) {
                        editTextComp.data = data;
                        this.fillData();
                    }.bind2(this),

                    onError: function () {
                        editTextComp.data = "";
                        this.fillData();
                    }.bind2(this),

                    onFail: function () {
                        editTextComp.data = "";
                        this.fillData();
                    }.bind2(this)
                });
                $E('applytextbtn').parentNode.style.display = "none";
                $E('savetextbtn').parentNode.style.display = "";
            } else {			// 说明是新增
                $E('texttitle').value = '请输入标题';
                $E('editor_textarea').value = '';
                editTextComp.fillFrame();
                var apllytextbtn = $E('applytextbtn');
                $E('savetextbtn').parentNode.style.display = "none";
                apllytextbtn.innerHTML = '保存';
                apllytextbtn.parentNode.style.display = "";
            }

            window._textdialog.show();
            window._textdialog.setAreaLocked(true);
            window._textdialog.setMiddle();
            var radios = $E('reditorform').textcolumn;

            // 根据初始内容确定初始显示的编辑器大小-----------------------------------------
            switch (editTextComp.size) {
                case 210:
                    $E('sizeContainer').className = 'SmallblogEditorWrap myWidth_S';
                    Utils.Form.Radio.set(radios, "1");
                    break;
                case 510:
                    $E('sizeContainer').className = 'SmallblogEditorWrap myWidth_M';
                    Utils.Form.Radio.set(radios, "2");
                    break;
                case 730:
                    $E('sizeContainer').className = 'SmallblogEditorWrap myWidth_L';
                    Utils.Form.Radio.set(radios, "3");
                    break;
                default:
                    $E('sizeContainer').className = 'SmallblogEditorWrap myWidth_S';
                    Utils.Form.Radio.set(radios, "1");
                    break;
            }
            $E('texttitle').focus();
        },

        //
        createDlg: function () {
            var _this = this;
            var content = "";
            content += '<div style="height: 350px;" class="textCustomContant" id="editAll">';
            content += '<div id="textCustomContantWidth" class="textCustomContantWidth"><form id="reditorform"><input type="radio" name="textcolumn" value="1" onclick="editor.swapSize(\'small\');editTextComp.size=210;editor.baseTools.shutOut.setSize(210,30);" id="reditor1"/><label for="reditor1">窄栏</label><input type="radio" name="textcolumn" value="2" onclick="editor.swapSize(\'hit\');editTextComp.size=510;editor.baseTools.shutOut.setSize(510,30);" id="reditor2"/><label for="reditor2">中栏</label><input type="radio" name="textcolumn" value="3" onclick="editor.swapSize(\'big\');editTextComp.size=730;editor.baseTools.shutOut.setSize(730,30);" id="reditor3"/><label for="reditor3">宽栏</label></form></div>';
            content += '<div class="simpleEditor" id="simpleEditor">';
            content += '<div id="sizeContainer" class="SmallblogEditorWrap myWidth_M">';
            content += '<div class="editor_title"><input type="text" name="texttitle" id="texttitle" maxlength="16" value="请输入标题"/></div>';
            content += '<div id="SinaEditor" class="SinaEditor">';
            content += '<div class="mini_tools" id="mini_tools"> </div>';
            content += '<div class="EditorContent">';
            content += '<div class="EditorBoxLeft">';
            content += '<div class="main_middle">';
            content += '<div id="textarea_container" style="display:none;">';
            content += '<textarea name="blog_body" id="editor_textarea" class="textarea" style="border:0px none;display: none;overflow:auto; width:98%"></textarea>';
            content += '</div>';
            content += '<div id="iframe_container"></div>';
            content += '</div>';
            content += '<div class="main_foot">';
            content += '<div class="leftFoot">';
            content += '<input type="checkbox" id="editor_checkbox"/>';
            content += '<label for="editor_checkbox">显示源代码</label>';
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '<div id="textBtnDiv" class="miniEd_Btn"><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="#" onclick="return false;"><cite id="savetextbtn">保存</cite></a><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="#" onclick="return false;" style="display:none;"><cite id="applytextbtn">应用</cite></a><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="#" onclick="return false;"><cite id="textPreviewBtn">预览</cite></a><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="#" onclick="return false;"><cite id="textcompcancel">取消</cite></a></div>';
            content += '</div>';
            content += '</div>';
            content += '<div id="textPreviewDiv" style="display:none;" class="textCustomContant">';
            content += '<div class="SG_colW21" id="textPreviewWD">';
            content += '     <div class="SG_conn">';
            content += '      <div class="SG_connHead">';
            content += '        <span class="title" id="previewName">自定义组件</span>';
            content += '      </div>';
            content += '      <div class="SG_connBody">';
            content += '        <div class="diywidget" id="previewBody"></div>';
            content += '      </div>';
            content += '     <div class="SG_connFoot"></div>';
            content += '  </div>';
            content += '</div>';
            content += '</div>';
            // <div class="textCustomTitle"></div><div class="textCustomContantTxt"></div></div>';
            content += '<p id="textPrevBtnDiv" style="display:none;" class="CP_w_btns"><a class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="textPreviewBack">返回编辑</cite></a></p>';
            var tpl = ['<table id="#{entity}" class="CP_w2 topSettingPop">', '<thead id="#{titleBar}">', '<tr>',
                '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">',
                '<strong id="#{titleName}"></strong>',
                '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false;">关闭</a></cite>',
                '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>',
                '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>',
                '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>',
                '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div id="#{content}" >', '</div>',
                '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
            //生成对话框
            //if ($IE && window._textdialog) {
            // return;
            // }
            //else {
            window._textdialog = winDialog.createCustomsDialog({
                tpl: tpl,
                title: "设置模块 > 管理自定义模块 > 自定义文本模块",
                content: content,
                renderer: Ui.SimpleRenderer,
                width: 800,
                height: 411,
                zIndex: 1024
            }, "textdialog");
            //if ($MOZ) {
            window._textdialog.addEventListener("hidden", function () {
                this.destroy();
            });
            //}
            //}

            window._textdialog.addEventListener("hidden", function () {
                if (window.editor.modeType != 'edit') {
                    window.editor.swapMode();
                }
            });

            // 初始化编辑器---------------------------------------
            var option = {
                iframe_container: "iframe_container",
                iframe_cls: "iframe",
                textarea: "editor_textarea",
                checkbox: "editor_checkbox",
                focusElementId: "textCustomContantWidth"
            };

            setTimeout(function () {
                // 提案 4833 http://issue.internal.sina.com.cn/browse/BLOGBUG-4833
                Editor.Utils.ShutOut.prototype.initialize = function () {
                    this.id = Core.Math.getUniqueId();
                    Core.Dom.addHTML($E("mini_tools"), '<div id="shut_out' + this.id + '" style="display:none;background:#F1F1F1;position: absolute; z-index: 1025;"></div>');
                };
                Editor.Utils.ShutOut.prototype.show = function () {
                    this.setPosition(0, 0);
                    $E("shut_out" + this.id).style.display = "block";
                };
                window.editor = new Editor.SmallEditor(option);
            }, 5);

            // -----------------------------------------------------

            // 输入标题的input的事件---------------------------------------------------
            Utils.limitLength($E('texttitle'), 16);
            Utils.limitReg($E('texttitle'), /\"|\\|\s|　/);
            Core.Events.addEvent($E('texttitle'), function () {
                if (Core.String.trim($E('texttitle').value) == "请输入标题") {
                    $E('texttitle').value = "";
                }
            }, 'focus');
            Core.Events.addEvent($E('texttitle'), function () {
                if (Core.String.trim($E('texttitle').value) == "") {
                    $E('texttitle').value = "请输入标题";
                }
            }, 'blur');

            // 编辑组件的保存
            // trace('绑定到保存按钮的id是：' + _this.id);
            Core.Events.addEvent($E('savetextbtn'), function () {
                // if(famous[scope.$uid] == 1){
                // 	winDialog.alert("<span style='font-size:12px; font-weight:normal;'>\
                // 		您对文本组件的修改需要通过审核，<br/>审核结果会以系统消息的方式通知您。<br/><br/>\
                // 		如有疑问请咨询：<br/>电话:4008812813<br/>\
                // 		邮箱:ads@staff.sina.com.cn</span>", {
                // 		funcOk: function(){
                // 			this.save(this.id);
                // 		}.bind2(this),
                // 		icon: "01"
                // 	}, "tips");
                // }else{
                this.save(this.id);
                // }
            }.bind2(this));

            // 新增组件的保存事件
            Core.Events.addEvent($E('applytextbtn'), function () {
                // if(famous[scope.$uid] == 1){
                // 	winDialog.alert("<span style='font-size:12px; font-weight:normal;'>\
                // 		您对文本组件的修改需要通过审核，<br/>审核结果会以系统消息的方式通知您。<br/><br/>\
                // 		如有疑问请咨询：<br/>电话:4008812813<br/>\
                // 		邮箱:ads@staff.sina.com.cn</span>", {
                // 		funcOk: function(){
                // 			this.isnew = true;
                // 			this.save(this.id);
                // 		}.bind2(this),
                // 		icon: "01"
                // 	}, "tips");
                // }else{
                this.isnew = true;
                this.save(this.id);
                // }
            }.bind2(this));
            //------------------------

            //取消事件-----------------
            Core.Events.addEvent($E('textcompcancel'), function () {
                editTextComp.closeDialog();
            }, 'click');

            //预览事件
            Core.Events.addEvent($E('textPreviewBtn'), function () {
                if (Core.String.trim($E('texttitle').value) == '请输入标题') {
                    winDialog.alert("请输入标题", {
                        renderer: Ui.SimpleRenderer,
                        icon: "02",
                        title: "警告"
                    });
                    return;
                }

                if (window.editor.modeType == 'edit') {
                    editor.frameToArea();
                } else {
                    $E('editor_checkbox').checked = false;
                }
                //var divs = $T($E('textPreviewDiv'), 'div');
                $E('previewName').innerHTML = Core.String.encodeHTML($E('texttitle').value);
                if (window.editor.modeType != 'edit') {
                    window.editor.swapMode();
                }
                $E('previewBody').innerHTML = $E('editor_textarea').value;
                $E('editAll').style.display = "none";
                $E('textPreviewDiv').style.display = "";
                $E('textPrevBtnDiv').style.display = "";
                switch (editTextComp.size) {
                    case 210:
                        $E('textPreviewWD').className = 'SG_colW21';
                        break;
                    case 510:
                        $E('textPreviewWD').className = 'SG_colW51';
                        break;
                    case 730:
                        $E('textPreviewWD').className = 'SG_colW73';
                        break;
                    default:
                        $E('textPreviewWD').className = 'SG_colW21';
                        break;
                }
            }, 'click');

            //取消预览事件-----------------------------------------
            Core.Events.addEvent($E('textPreviewBack'), function () {
                $E('editAll').style.display = "";
                $E('textPreviewDiv').style.display = "none";
                $E('textPrevBtnDiv').style.display = "none";
            }, 'click');
            //---------------------------------------------------

        },
        closeDialog: function () {
            if (!$IE)
                window._textdialog.close(); else
                window._textdialog.hidden();
        },
        resize: function () {

        },
        /**
         * 读取数据后填入数据
         */
        fillData: function () {
            if (editTextComp.data != "") {
                $E('texttitle').value = Core.String.decodeHTML(editTextComp.data.name);
                $E('editor_textarea').value = editTextComp.data.content;

            } else {
                $E('texttitle').value = "请输入标题";
                $E('editor_textarea').value = "";
            }
            this.fillFrame();
        },
        /**
         * 编辑器的那个iframe内的页面是一个固定页面，因此需要判断是否onload完成
         */
        fillFrame: function () {
            var interval = setInterval(function () {
                if (editor.onload == true) {
                    editor.areaToFrame();
                    clearInterval(interval);
                }
            }, 10);
        },
        /**
         *保存数据'"
         */
        save: function (id, afterFilter) {
            var __this = this;
            var __id = id;
            if (Core.String.trim($E('texttitle').value) == '') {
                winDialog.alert("请输入标题！", {
                    icon: "02"
                }, "提示");
                return;
            }
            if (window.editor.modeType == 'edit') {
                /*分屏加载时需要给图片加高度
                 var imgarr=window.editor.iframeDocument.getElementsByTagName("IMG");
                 var imglen=imgarr.length;
                 for(var i=0;i<imglen;i++){
                 var m=imgarr[i];
                 //trace("m.offsetWidth="+m.offsetHeight+"clientWidth="+m.clientHeight);

                 //trace(m.height);
                 //trace(m.style.width);
                 m.height=m.offsetHeight;

                 }
                 */
                editor.frameToArea();
            }

            var saveinerface = null;
            var postdata = {};

            postdata.uid = scope.$uid;
            postdata.Data = $E('editor_textarea').value;
            postdata.Title = $E('texttitle').value;
            __pageSetVar.textname = $E('texttitle').value;
            __pageSetVar.textcontent = $E('editor_textarea').value;
            if (this.id) {
                trace('编辑的id是' + this.id);
                saveinterface = new Interface("http://control.blog.sina.com.cn/riaapi/sys_module/edit_custmod_html_post.php?version=7", "ijax");
                postdata.cid = this.id;

            } else {
                saveinterface = new Interface("http://control.blog.sina.com.cn/riaapi/sys_module/new_custmod_html_post.php?version=7", "ijax");
                postdata.secure_code = $encrypt_code;
            }

            if (afterFilter) {
                postdata.check = 1;
            }

            // 读取列表
            saveinterface.request({
                POST: postdata,
                onSuccess: function (data) {
                    winDialog.alert("保存成功！", {
                        funcOk: function () {
                            editTextComp.closeDialog();
                        },
                        icon: "03"
                    }, "tips");
                    var tips = winDialog.getDialog('tips');
                    var anchor = tips.getNodes()["btnClose"];
                    anchor.onclick = function () {
                        editTextComp.closeDialog();
                        return false;
                    };

                    //说明是非页面设置----------------------------
                    if (scope.$pageid != 'pageSetM') {
                        Lib.Component.refresh(data, {
                            width: $E('module_' + data).offsetWidth
                        });
                        var titlespan = Core.Dom.getChildrenByClass(Core.Dom.getChildrenByClass($E('module_' + data), 'SG_connHead')[0], 'title')[0];
                        //BLOGBUG-5276 号提案
                        if ($E('module_' + data).offsetWidth == '210') {
                            titlespan.innerHTML = Core.String.shorten(Core.String.encodeHTML(__pageSetVar.textname), 12);
                        } else {
                            titlespan.innerHTML = Core.String.encodeHTML(__pageSetVar.textname);
                        }
                        titlespan.setAttribute('comp_title', Core.String.encodeHTML(__pageSetVar.textname));

                        return;
                    }

                    //--------------------------------------------
                    if ($E('cuscompli_' + data)) {			// 说明是编辑原来的文本组件
                        trace(" __pageSetVar.textname=" + __pageSetVar.textname);
                        var checked = "";
                        if ($E('module_' + data)) {
                            // 此处调用存在组件时的方法
                            Lib.Component.refresh(data, {
                                width: $E('module_' + data).offsetWidth
                            });
                            checked = "checked";
                            var titlespan = Core.Dom.getChildrenByClass(Core.Dom.getChildrenByClass($E('module_' + data), 'SG_connHead')[0], 'title')[0];

                            // BLOGBUG-5276 号提案
                            if ($E('module_' + data).offsetWidth == '210') {
                                titlespan.innerHTML = Core.String.shorten(Core.String.encodeHTML(__pageSetVar.textname), 12);
                            } else {
                                titlespan.innerHTML = Core.String.encodeHTML(__pageSetVar.textname);
                            }
                            titlespan.setAttribute('comp_title', Core.String.encodeHTML(__pageSetVar.textname));
                        }

                        // BLOGBUG-5278 号 bug
                        if ($E('module_' + data) && $E('module_' + data).parentNode != $E('hiddendiv')) {
                            $T($E('cuscompli_' + data), 'span')[0].innerHTML = '<input type="checkbox" ' + checked + ' onclick="clickComponentsEvent(this,' + data + ',\'' + __pageSetVar.textname + '\',9)" id="components_9_' + data + '"/><label for="components_9_' + data + '">' + Core.String.encodeHTML(__pageSetVar.textname) + '</label>';
                        } else {
                            $T($E('cuscompli_' + data), 'span')[0].innerHTML = '<input type="checkbox"  onclick="clickComponentsEvent(this,' + data + ',\'' + __pageSetVar.textname + '\',9)" id="components_9_' + data + '"/><label for="components_9_' + data + '">' + Core.String.encodeHTML(__pageSetVar.textname) + '</label>';
                        }
                    } else {					// 说明原来没有，是新增加的文本组件
                        // if ($IE6) {
                        // __pageSetVar.tabs[4].loadData();
                        // }
                        // else {
                        if ($E('customModuleUl').innerHTML == '您尚未创建任何自定义组件') {
                            $E('customModuleUl').innerHTML = '';
                        }
                        var li = $C('li');
                        li.id = 'cuscompli_' + data;
                        var html = '<span class="moduleli"><input type="checkbox" onclick="clickComponentsEvent(this,' + data + ',\'' + Core.String.encodeHTML(__pageSetVar.textname) + '\',9)" id="components_9_' + data + '"/><label for="components_9_' + data + '">' + Core.String.encodeHTML(__pageSetVar.textname) + '</label></span><span class="option"><a onclick="return false;" class="CP_a_fuc" href="javascript:;">[<cite onclick="editCustomComp(' + data + ',\'html\');">编辑</cite>]</a><a onclick="return false;" class="CP_a_fuc" href="javascript:;">[<cite onclick="deleteCustomComp(' + data + ');">删除</cite>]</a></span>';
                        li.innerHTML = html;
                        $E('customModuleUl').appendChild(li);
                        // }

                        //点击应用按钮
                        if (this.isnew == true && __pageSetVar.component_list.length < 25) {
                            $E('components_9_' + data).checked = true;
                            addComp(data, __pageSetVar.textname, 1);
                        }
                    }
                }.bind2(this),

                onError: function (_data) {
                    if (_data.code == 'B26104') {
                        winDialog.alert(_data.data, {
                            funcOk: function () {
                                window._textdialog.hidden();
                            },
                            icon: "02"
                        });
                        return;
                    }
                    if (_data.code == 'B26103') {//说明该组件已经被删除
                        if ($E('module_' + _data.data)) {
                            $E('module_' + _data.data).parentNode.removeChild($E('module_' + _data.data));
                        }
                        if ($E('cuscompli_' + _data.data)) {
                            $E('cuscompli_' + _data.data).parentNode.removeChild($E('cuscompli_' + _data.data));
                        }
                    }

                    if (_data.code == 'A11107') {
                        winDialog.alert($SYSMSG[_data.code], {
                            funcOk: function () {
                                __this.save(__id, 1);
                            },
                            icon: "01"
                        });
                        return;
                    }

                    winDialog.alert($SYSMSG[_data.code], {
                        funcOk: function () {
                            if (_data.code != 'A00005' || _data.code != 'A00004') {
                                // BLOGBUG-5243 号bug，除了权限错误外，其它错误都不关闭对话框
                                // $E('addCustomLink').focus();
                                // editTextComp.closeDialog();
                            }
                            window._textdialog.hidden();
                        },
                        icon: "02"
                    }, "tipshtml");

                    if (_data.code == 'A00005' || _data.code == 'A00004') {		// 说明权限问题,跳出
                        trace("说明权限问题,跳出");
                        var tipshtml = winDialog.getDialog('tipshtml');
                        var anchor = tipshtml.getNodes()["btnClose"];
                        var anchor2 = tipshtml.getNodes()["linkOk"];
                        var okbtn = tipshtml.getNodes()["btnOk"];
                        anchor.onclick = okbtn.onclick = function () {
                            Core.Events.removeEvent(window, window.beforeunloadfunc, 'beforeunload');
                            window.location.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                        };
                        anchor2.href = anchor.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                    }
                }.bind2(this),

                onFail: function () {
                    winDialog.alert("保存失败", {
                        funcOk: function () {
                            editTextComp.closeDialog();
                        },
                        icon: "02"
                    }, "警告");
                }
            });

        }
    };

    window.editTextComp = editTextComp;
})();

