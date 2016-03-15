/**
 * @fileoverview 编辑或者新增自定义列表组件
 * @author xinyu@staff.sina.com.cn
 */
$import("sina/ui/dialog/windowDialog.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/shorten.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/ui/template.js");
$import("sina/utils/limitLength.js");
$import("sina/utils/limitReg.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import('pageSet/pageSetVariables.js');
$import("msg/diycomponentsMSG.js");
$import("pageSet/uidlist.js");

(function () {
    //如果存在id，则是编辑状态，否则是新增状态
    window.editLinkComp = {
        id: null,
        reg: /^(http?|https|ftp|mms|sftp|telnet|rtsp):\/\/\.*/,
        data: '',
        isnew: false,
        edit: function (id) {
            this.id = id;
            this.isnew = false;
            var _this = this;

            if (!window._linkdialog) {
                //增加链接组件的对话框-----------------------------------------
                var content = '<div id="customModuleListPop" class="customModuleListPop"><div id="editCustomModuleName" class="editCustomModuleName" style=""><span class="SG_floatL"><input type="text" class="CP_w_fm2" value="请输入标题" id="nameinput"/></span><span style="color:red;">*(必填)</span></div>';
                content += '<div class="addCustomModule" id="addCustomModule"><span class="SG_floatL"><input type="text" value="输入名称(必填)" class="CP_w_fm2" maxLength="72"/></span><span class="SG_floatL"><input type="text" value="http://" class="CP_w_fm2"　maxLength="256"/></span><span class="SG_floatL"><input type="text" value="输入描述" class="CP_w_fm2" maxLength="1000"/></span><span class="SG_floatL"><a class="SG_aBtn SG_aBtnB" href="javascript:;" onclick="return false;"><cite>添加</cite></a></span></div>';
                content += '<div class="customModuleList"><ul id="customModuleList">暂无内容。</ul></div>';
                content += '<p class="CP_w_btns"><a href="#" onclick="return false;" class="SG_aBtn SG_aBtnB"><cite id="savebtn">保存</cite></a><a href="#" onclick="return false;" class="SG_aBtn SG_aBtnB" style="display:none;"><cite id="applybtn">应用</cite></a><a href="#" onclick="return false;" class="SG_aBtn SG_aBtnB"><cite id="linkpreview">预览</cite></a><a href="#" onclick="return false;" class="SG_aBtn SG_aBtnB"><cite id="linkcompcancel">取消</cite></a></p></div>';
                content += '<div id="textCustomContant" class="textCustomContant" style="display:none;"><div id="previewdiv" class="SG_colW73 SG_colFirst"><div class="SG_conn">';
                content += '<div class="SG_connHead"><span id="previewtitle" class="title">自定义组件</span><span class="edit"></span></div>';
                content += '<div class="SG_connBody">';
                content += '<div class="diywidget" id="previewbody"></div></div>';
                content += '<div class="SG_connFoot"/></div></div>';
                content += '</div></div><p class="CP_w_btns" id="backtoeditp" style="display:none;"><a class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="backtoedit">返回编辑</cite></a></p>';

                var tpl = ['<table id="#{entity}" class="CP_w2 topSettingPop">', '<thead id="#{titleBar}">', '<tr>',
                    '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">',
                    '<strong id="#{titleName}"></strong>',
                    '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false;">关闭</a></cite>',
                    '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>',
                    '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>',
                    '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>',
                    '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div id="#{content}">', '</div>',
                    '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");

                window._linkdialog = winDialog.createCustomsDialog({
                    tpl: tpl,
                    title: "设置模块 > 管理自定义模块 > 自定义列表模块",
                    content: content,
                    width: 623,
                    height: 411,
                    zIndex: 1024
                }, "linkcomp");
                var linkcomp = winDialog.getDialog('linkcomp');
                var btnClose = linkcomp.getNodes()["btnClose"];
                Core.Events.addEvent(btnClose, editLinkComp.dialogClose);
                //---------------------------------------------------------

                //保存事件------------------
                Core.Events.addEvent($E('savebtn'), function () {
                    // if(famous[scope.$uid] == 1){
                    // 	winDialog.alert("<span style='font-size:12px; font-weight:normal;'>\
                    // 		您对列表组件的修改需要通过审核，<br>审核结果会以系统消息的方式通知您。<br/><br/>\
                    // 		如有疑问请咨询：<br/>电话:4008812813<br/>邮箱:ads@staff.sina.com.cn</span>", {
                    // 		funcOk: function(){
                    // 			this.save(this.id);
                    // 			return;
                    // 		}.bind2(this),
                    // 		icon: "01"
                    // 	}, "tips");
                    // }else{
                    this.save(this.id);
                    return;
                    // }
                }.bind2(this));
                //------------------------

                //应用按钮事件------------------
                Core.Events.addEvent($E('applybtn'), function () {
                    // if(famous[scope.$uid] == 1){
                    // 	winDialog.alert("<span style='font-size:12px; font-weight:normal;'>\
                    // 		您对列表组件的修改需要通过审核，<br>审核结果会以系统消息的方式通知您。<br/><br/>\
                    // 		如有疑问请咨询：<br/>电话:4008812813<br/>邮箱:ads@staff.sina.com.cn</span>", {
                    // 		funcOk: function(){
                    // 			this.isnew=true;
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
                Core.Events.addEvent($E('linkcompcancel'), function () {
                    window._linkdialog.hidden();
                });

                //输入标题的input的事件---------------------------------------------------
                Utils.limitLength($E('nameinput'), 16);
                Utils.limitReg($E('nameinput'), /\"|\\|\s|　/);
                Core.Events.addEvent($E('nameinput'), function () {
                    if (Core.String.trim($E('nameinput').value) == "请输入标题") {
                        $E('nameinput').value = "";
                    }
                }, 'focus');
                Core.Events.addEvent($E('nameinput'), function () {
                    if (Core.String.trim($E('nameinput').value) == "") {
                        $E('nameinput').value = "请输入标题";
                    }
                }, 'blur');
                //-----------------------------------------------------------------------

                //给三个输入框绑定事件，这些事件也可以应用到编辑时的3个输入框------------
                var inputs = $T($E('addCustomModule'), 'input');
                Core.Events.addEvent(inputs[0], Core.Function.bind3(_this.inputLength, _this, [inputs[0], /\"|\\|\s|　/,
                    72]), 'keydown');
                Core.Events.addEvent(inputs[0], Core.Function.bind3(_this.inputfocus, _this, [inputs[0],
                    '输入名称(必填)']), 'focus');
                Core.Events.addEvent(inputs[0], Core.Function.bind3(_this.inputblur, _this, [inputs[0],
                    '输入名称(必填)']), 'blur');
                Core.Events.addEvent(inputs[1], Core.Function.bind3(_this.inputLength, _this, [inputs[1], /\"|\\|\s|　/,
                    256]), 'keydown');
                Core.Events.addEvent(inputs[2], Core.Function.bind3(_this.inputLength, _this, [inputs[2], /\"|\\|\s|　/,
                    1000]), 'keydown');
                Core.Events.addEvent(inputs[2], Core.Function.bind3(_this.inputfocus, _this, [inputs[2],
                    '输入描述']), 'focus');
                Core.Events.addEvent(inputs[2], Core.Function.bind3(_this.inputblur, _this, [inputs[2],
                    '输入描述']), 'blur');
                //-----------------------------------

                Core.Events.addEvent($E('backtoedit'), function () {
                    $E('customModuleListPop').style.display = "";
                    $E('textCustomContant').style.display = "none";
                    $E('backtoeditp').style.display = "none";
                    window._linkdialog.setSize(623, 411);
                });

                //预览事件------------------------------------------------
                Core.Events.addEvent($E('linkpreview'), function () {
                    if (Core.String.trim($E('nameinput').value) == '请输入标题') {
                        winDialog.alert("请输入标题", {
                            icon: "02"
                        }, "警告");
                        return;
                    }
                    this.preview();
                    if (this.id && $E('module_' + this.id) && $E('module_' + this.id).parentNode != $E('hiddendiv')) {

                        $E('previewdiv').className = $E('module_' + this.id).parentNode.className;
                    } else {
                        $E('previewdiv').className = 'SG_colW21';
                    }
                    $E('customModuleListPop').style.display = "none";
                    $E('textCustomContant').style.display = "";
                    $E('backtoeditp').style.display = "";
                    window._linkdialog.setSize(789, 411);
                }.bind2(this));

            }

            //----------------------------------------------------------------

            inputs = $T($E('addCustomModule'), 'input');
            inputs[0].value = '输入名称(必填)';
            inputs[1].value = 'http://';
            inputs[2].value = '输入描述';

            $E('applybtn').innerHTML = '保存';
            if (id) {//说明是编辑
                this.readData(id);
                $E('applybtn').parentNode.style.display = "none";
                $E('savebtn').parentNode.style.display = "";
            } else {//说明是新增。
                $E('nameinput').value = '请输入标题';
                $E('customModuleList').innerHTML = '暂无内容。';
                window._linkdialog.show();
                window._linkdialog.setAreaLocked(true);
                window._linkdialog.setMiddle();
                $E('savebtn').parentNode.style.display = "none";
                $E('applybtn').parentNode.style.display = "";
            }

            Core.Events.addEvent($T($E('addCustomModule'), 'cite')[0], this.addLink.bind2(this), 'click');//绑定增加链接按钮
            if ($E('customModuleListPop').style.display == 'none') {//每次进入时，首先显示的编辑页面，如果不是，则让其是
                window._linkdialog.setSize(623, 411);
                $E('customModuleListPop').style.display = "";
                $E('textCustomContant').style.display = "none";
            }

        },
        /**
         * 读取该组件的信息
         * @param {Object} id
         */
        readData: function (id) {

            this.id = id;
            var _editModule = new Interface('http://control.blog.sina.com.cn/riaapi/sys_module/edit_custmod_link.php?version=7&cid=' + id, "jsload");
            _editModule.request({
                onSuccess: function (data) {
                    editLinkComp.data = data;
                    this.fillData();
                }.bind2(this),
                onError: function () {
                    editLinkComp.data = "";
                    this.fillData();
                }.bind2(this),
                onFail: function () {
                    editLinkComp.data = "";
                    this.fillData();
                }.bind2(this)
            });
        },
        /**
         * 读取数据后填入数据
         */
        fillData: function () {
            if (editLinkComp.data != "") {
                var _this = this;
                $E('customModuleList').innerHTML = '';
                $E('nameinput').value = Core.String.decodeHTML(editLinkComp.data.name);
                if (editLinkComp.data.list.length > 0) {

                    for (var i = editLinkComp.data.list.length - 1; i >= 0; i--) {
                        var item = {};
                        item.otitle = Core.String.a2u(editLinkComp.data.list[i].title);
                        item.olink = Core.String.a2u(editLinkComp.data.list[i].link);
                        item.odesc = Core.String.a2u(editLinkComp.data.list[i].desc);
                        item.title = Core.String.shorten(item.otitle, 40, '...');
                        item.link = item.olink;
                        item.desc = Core.String.shorten(item.odesc, 40, '...');
                        //                        _result.push(item);
                        trace('i=' + i + ";内容是：" + item.title);
                        var li = $C('li');
                        var str = this.addRow(item);
                        li.innerHTML = str;
                        Core.Dom.insertHTML($E('customModuleList'), '<li>' + str + '</li>', 'AfterBegin');
                    }
                } else {
                    $E('customModuleList').innerHTML = '暂无内容。';
                }
            }
            //ie下 BLOGBUG-5049 号bug会有问题，因此在有内容时将对话框放这里显示出来
            window._linkdialog.show();
            window._linkdialog.setAreaLocked(true);
            window._linkdialog.setMiddle();
        },
        /**
         * 编辑某一行
         */
        editOne: function (obj) {
            var _this = this;
            var div = obj.parentNode.parentNode.parentNode.parentNode;
            var li = div.parentNode;
            var inputs = $T(li, 'input');
            var desc = inputs[2].value;
            if (!editLinkComp.reg.test(inputs[1].value)) {
                //如果输入类似www.sina.com.cn,补全为http://www.sina.com.cn
                inputs[1].value = 'http://' + inputs[1].value;
            }
            var href = inputs[1].value;
            var name = inputs[0].value;

            li.innerHTML = '<div class="editCustomModule"><span class="SG_floatL"><input type="text" name="" value="' + name + '" class="CP_w_fm2"/></span><span class="SG_floatL"><input type="text" name="" value="' + href + '" class="CP_w_fm2"/></span><span class="SG_floatL"><input type="text" name="" value="' + desc + '" class="CP_w_fm2"/><input type="hidden" value="' + name + '"><input type="hidden" value="' + href + '"><input type="hidden" value="' + desc + '"></span><span class="SG_floatL"><a class="SG_aBtn SG_aBtnB" href="javascript:;" onclickc="return false;"><cite onclick="editLinkComp.confirmOne(this);">确定</cite></a></span><span class="SG_floatL"><a class="SG_aBtn SG_aBtnB" href="javascript:;" onclick="return false;"><cite onclick="editLinkComp.cancelOne(this);">取消</cite></a></span></div>';

            //给三个输入框绑定事件，这些事件也可以应用到编辑时的3个输入框------------
            var inputs = $T(li, 'input');
            Core.Events.addEvent(inputs[0], Core.Function.bind3(_this.inputLength, _this, [inputs[0], /\"|\\|\s|　/,
                72]), 'keydown');
            Core.Events.addEvent(inputs[0], Core.Function.bind3(_this.inputfocus, _this, [inputs[0],
                '输入名称(必填)']), 'focus');
            Core.Events.addEvent(inputs[0], Core.Function.bind3(_this.inputblur, _this, [inputs[0],
                '输入名称(必填)']), 'blur');
            Core.Events.addEvent(inputs[1], Core.Function.bind3(_this.inputLength, _this, [inputs[1], /\"|\\|\s|　/,
                256]), 'keydown');
            Core.Events.addEvent(inputs[2], Core.Function.bind3(_this.inputLength, _this, [inputs[2], /\"|\\|\s|　/,
                1000]), 'keydown');
            Core.Events.addEvent(inputs[2], Core.Function.bind3(_this.inputfocus, _this, [inputs[2], '输入描述']), 'focus');
            Core.Events.addEvent(inputs[2], Core.Function.bind3(_this.inputblur, _this, [inputs[2], '输入描述']), 'blur');
            //-----------------------------------
        },
        /**
         * 编辑某行后点击取消
         * @param {Object} obj
         */
        cancelOne: function (obj) {
            var div = obj.parentNode.parentNode.parentNode;
            var li = div.parentNode;
            var inputs = $T(li, 'input');

            var item = {};
            item.otitle = Core.String.encodeHTML(inputs[3].value);
            item.olink = inputs[4].value;
            item.odesc = Core.String.encodeHTML(inputs[5].value);
            item.title = Core.String.shorten(item.otitle, 40, '...');
            item.link = item.olink;
            item.desc = Core.String.shorten(item.odesc, 40, '...');

            var str = this.addRow(item);
            li.innerHTML = str;

        },
        /**
         * 编辑某行后点击确定
         * @param {Object} obj
         */
        confirmOne: function (obj) {
            var div = obj.parentNode.parentNode.parentNode;
            var li = div.parentNode;
            var inputs = $T(li, 'input');
            if (inputs[0].value == "输入名称(必填)") {
                return;
            }

            var item = {};
            if (!editLinkComp.reg.test(inputs[1].value)) {//如果输入类似www.sina.com.cn,补全为http://www.sina.com.cn
                inputs[1].value = 'http://' + inputs[1].value;
            }
            item.otitle = Core.String.encodeHTML(inputs[0].value);
            item.olink = inputs[1].value;
            item.odesc = Core.String.encodeHTML(inputs[2].value == '输入描述' ? '' : inputs[2].value);
            item.title = Core.String.shorten(item.otitle, 40, '...');
            item.link = item.olink;
            item.desc = Core.String.shorten(item.odesc, 40, '...');

            var str = this.addRow(item);
            li.innerHTML = str;
        },
        /**
         *删除某一行
         */
        deleteOne: function (obj) {
            var li = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
            var ul = li.parentNode;
            ul.removeChild(li);
            if (ul.childNodes.length == 0) {
                ul.innerHTML = "暂无内容。";
            }
        },
        /**
         * 输入链接名称input获得焦点时
         * @param {Object} obj
         */
        inputfocus: function (obj, text) {
            if (Core.String.trim(obj.value) == text) {
                obj.value = "";
            }
        },
        inputblur: function (obj, text) {
            if (Core.String.trim(obj.value) == "") {
                obj.value = text;
            } else {
                obj.value = Core.String.trim(obj.value);
            }
        },
        inputLength: function (obj, reg, num) {
            Utils.limitLength(obj, num);
            //Utils.limitReg(obj, reg);
        },
        /**
         * 添加一个链接
         */
        addLink: function () {
            var inputs = $T($E('addCustomModule'), 'input');
            if (Core.String.trim(inputs[0].value) == "输入名称(必填)") {
                return;
            }
            var li = $C('li');
            if (!this.reg.test(inputs[1].value)) {//如果输入类似www.sina.com.cn,补全为http://www.sina.com.cn
                inputs[1].value = 'http://' + inputs[1].value;
            }

            var item = {};
            item.otitle = Core.String.encodeHTML(inputs[0].value);
            item.olink = inputs[1].value;
            item.odesc = Core.String.encodeHTML(inputs[2].value == '输入描述' ? '' : inputs[2].value);
            item.title = Core.String.shorten(item.otitle, 40, '...');
            item.link = item.olink;
            item.desc = Core.String.shorten(item.odesc, 40, '...');
            var str = this.addRow(item);

            li.innerHTML = str;

            if ($E('customModuleList').innerHTML == "暂无内容。") {
                $E('customModuleList').innerHTML = "";
            }
            Core.Dom.insertHTML($E('customModuleList'), '<li>' + str + '</li>', 'AfterBegin');
            inputs[0].value = "输入名称(必填)";
            inputs[1].value = "http://";
            inputs[2].value = "输入描述";
        },
        /**
         * 根据需要显示的内容，得到该行的li中的html,然后返回这个html，供li显示
         * 采用模板替换，因为显示在链接列表中的html结构一样，因此共用
         * @param {Object} item
         */
        addRow: function (item) {
            var _template = '<div><span class="SG_floatR"><span class="SG_floatL"><a class="CP_a_fuc Option1" href="javascript:;" onclick="return false;">[<cite onclick="editLinkComp.editOne(this);">编辑</cite>]</a></span>' + '<span class="SG_floatL"><a class="CP_a_fuc Option2" href="javascript:;" onclick="return false;">[<cite onclick="editLinkComp.deleteOne(this);">删除</cite>]</a></span>' + '<span class="SG_floatL"><a class="sortUp" href="javascript:;" onclick="editLinkComp.up(this);return false;"><img src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"/></a></span>' + '<span class="SG_floatL"><a class="sortDown" href="javascript:;" onclick="editLinkComp.down(this);return false;"><img  src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"/></a><input type="hidden" value="#{otitle}"><input type="hidden" value="#{olink}"><input type="hidden" value="#{odesc}"></span></span>' + '<a class="customName" href="#{link}" target="_blank">#{title}</a></div><p class="desc">#{desc}</p>';
            var tmp = new Ui.Template(_template);
            return tmp.evaluate(item);
        },
        /**
         * 向上移动操作
         * @param {Object} obj
         */
        up: function (obj) {
            var li = obj.parentNode.parentNode.parentNode.parentNode;
            var ul = li.parentNode;
            if (li.previousSibling) {
                ul.insertBefore(li, li.previousSibling);
            }
        },
        /**
         * 向下移动操作
         * @param {Object} obj
         */
        down: function (obj) {//向下移动一个
            var li = obj.parentNode.parentNode.parentNode.parentNode;
            var ul = li.parentNode;
            if (li.nextSibling) {
                ul.insertBefore(li.nextSibling, li);
            }
        },
        /**
         * 对话框关闭按钮绑定的事件
         */
        dialogClose: function () {
            if (editLinkComp.id) {
                if (Core.String.decodeHTML(editLinkComp.data.name) != $E('nameinput').value) {
                    editLinkComp.dialogCloseEvent();
                    return;
                }
                trace('save str=' + editLinkComp.getSaveStr());
                trace('orig str=' + editLinkComp.getOrignStr());
                if (editLinkComp.getSaveStr() != editLinkComp.getOrignStr(editLinkComp.id)) {
                    editLinkComp.dialogCloseEvent();
                    return;
                }
                window._linkdialog.hidden();
            } else {
                if (Core.String.trim($E('nameinput').value) == '请输入标题' && $T($E('customModuleList'), 'input').length == 0) {
                    window._linkdialog.hidden();
                } else {
                    editLinkComp.dialogCloseEvent();
                }
            }
        },
        dialogCloseEvent: function () {
            winDialog.confirm($SYSMSG.B27004, {
                funcOk: function () {
                    editLinkComp.save();
                },
                funcCancel: function () {
                    window._linkdialog.hidden();
                }
            });
        },
        /**
         *保存数据
         */
        save: function (id, afterFilter) {
            var __this = this;
            var __id = id;
            if (Core.String.trim($E('nameinput').value) == '请输入标题') {
                winDialog.alert("请输入标题！", {
                    funcOk: function () {
                        window._linkdialog.show();
                        window._linkdialog.setAreaLocked(true);
                    },
                    icon: "02"
                }, "提示");
                return;
            }
            var name = $E('nameinput').value;
            var str = editLinkComp.getSaveStr();
            var saveinterface = null;
            var postdata = {
                uid: scope.$uid,
                Title: name,
                Data: str
            };
            __pageSetVar.textname = name;
            if (this.id) {
                saveinterface = new Interface("http://control.blog.sina.com.cn/riaapi/sys_module/edit_custmod_link_post.php?version=7", "ijax");
                postdata.cid = this.id;
            } else {
                saveinterface = new Interface("http://control.blog.sina.com.cn/riaapi/sys_module/new_custmod_link_post.php?version=7", "ijax");
                postdata.secure_code = $encrypt_code;
            }

            if (afterFilter) {
                postdata.check = 1;
            }

            // 保存列表
            saveinterface.request({
                POST: postdata,
                onSuccess: function (data) {
                    winDialog.alert("保存成功！", {
                        funcOk: function () {
                            window._linkdialog.hidden();
                        },
                        icon: "03"
                    }, "tips");
                    var tips = winDialog.getDialog('tips');
                    var anchor = tips.getNodes()["btnClose"];
                    anchor.onclick = function () {
                        window._linkdialog.hidden();
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

                        return;
                    }
                    //--------------------------------------------
                    if ($E('cuscompli_' + data)) {//说明是编辑原来的列表组件
                        var checked = "";
                        if ($E('module_' + data)) {
                            //此处调用存在组件时的方法
                            checked = "checked";
                            Lib.Component.refresh(data, {
                                width: $E('module_' + data).offsetWidth
                            });
                            //BLOGBUG-5276 号提案
                            var titlespan = Core.Dom.getChildrenByClass(Core.Dom.getChildrenByClass($E('module_' + data), 'SG_connHead')[0], 'title')[0];
                            if ($E('module_' + data).offsetWidth == '210') {
                                titlespan.innerHTML = Core.String.shorten(Core.String.encodeHTML(__pageSetVar.textname), 12);
                            } else {
                                titlespan.innerHTML = Core.String.encodeHTML(__pageSetVar.textname);
                            }
                            titlespan.setAttribute('comp_title', Core.String.encodeHTML(__pageSetVar.textname));
                        }
                        //BLOGBUG-5278 号bug
                        if ($E('module_' + data) && $E('module_' + data).parentNode != $E('hiddendiv')) {
                            $T($E('cuscompli_' + data), 'span')[0].innerHTML = '<input type="checkbox" ' + checked + ' onclick="clickComponentsEvent(this,' + data + ',\'' + __pageSetVar.textname + '\',9)" id="components_9_' + data + '"/><label for="components_9_' + data + '">' + Core.String.encodeHTML(__pageSetVar.textname) + '</label>';
                        } else {
                            $T($E('cuscompli_' + data), 'span')[0].innerHTML = '<input type="checkbox"  onclick="clickComponentsEvent(this,' + data + ',\'' + __pageSetVar.textname + '\',9)" id="components_9_' + data + '"/><label for="components_9_' + data + '">' + Core.String.encodeHTML(__pageSetVar.textname) + '</label>';
                        }

                    } else {//说明原来没有，是新增加的列表组件
//                        if ($IE6) {
//                            __pageSetVar.tabs[4].loadData();
//                        }
//                        else {
                        if ($E('customModuleUl').innerHTML == '您尚未创建任何自定义组件') {
                            $E('customModuleUl').innerHTML = '';
                        }
                        var li = $C('li');
                        li.id = 'cuscompli_' + data;
                        var html = '<span class="moduleli"><input type="checkbox" onclick="clickComponentsEvent(this,' + data + ',\'' + __pageSetVar.textname + '\',9)" id="components_9_' + data + '"/><label for="components_9_' + data + '">' + Core.String.encodeHTML(__pageSetVar.textname) + '</label></span><span class="option"><a onclick="return false;" class="CP_a_fuc" href="javascript:;">[<cite onclick="editCustomComp(' + data + ',\'link\');">编辑</cite>]</a><a onclick="return false;" class="CP_a_fuc" href="javascript:;">[<cite onclick="deleteCustomComp(' + data + ');">删除</cite>]</a></span>';
                        li.innerHTML = html;
                        $E('customModuleUl').appendChild(li);
//                        }

                        //点击应用按钮
                        if (this.isnew == true && __pageSetVar.component_list.length < 25) {
                            $E('components_9_' + data).checked = true;
                            addComp(data, __pageSetVar.textname, 1);
                        }

                    }
                }.bind2(this),
                onError: function (_data) {
                    if (_data.code == 'B28103') {//说明该组件已经被删除
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
                                window._linkdialog.show();
                            }
                            window._linkdialog.hidden();
                        },
                        icon: "01"
                    }, "tipslink");

                    if (_data.code == 'A00005' || _data.code == 'A00004') {//说明权限问题,跳出
                        trace("说明权限问题,跳出");
                        var tipslink = winDialog.getDialog('tipslink');
                        var anchor = tipslink.getNodes()["btnClose"];
                        var anchor2 = tipslink.getNodes()["linkOk"];
                        var okbtn = tipslink.getNodes()["btnOk"];
                        anchor.onclick = okbtn.onclick = function () {
                            Core.Events.removeEvent(window, beforeunloadfunc, 'beforeunload');
                            window.location.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                        };
                        anchor2.href = anchor.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                    }
                }.bind2(this),
                onFail: function () {
                    winDialog.alert("保存失败", {
                        funcOk: function () {
                            window._linkdialog.show();
                        },
                        icon: "02"
                    }, "警告");
                }
            });

        },
        /**
         * 得到提交时需要用到的字符串
         *
         */
        getSaveStr: function () {
            //转换列表为发送字符串--------------------------------
            var str = "[";
            var lis = $T($E('customModuleList'), 'li');
            for (var i = lis.length - 1; i >= 0; i--) {

                var o = {};
                var inputs = $T(lis[i], 'input');
                var desc = inputs[2].value;

                if (!this.reg.test(inputs[1].value)) {
                    //如果输入类似www.sina.com.cn,补全为http://www.sina.com.cn
                    inputs[1].value = 'http://' + inputs[1].value;
                }

                var href = inputs[1].value;
                var title = inputs[0].value;
                o.title = title;
                o.desc = desc;
                o.href = href;
                str += '{"title":"' + title + '","desc":"' + desc + '","link":"' + href + '"},';
            }
            if (str.length > 2) {
                str = str.substring(0, str.length - 1);
            }
            str += ']';
            return str;
            //-------------------------------------------------------------
        },
        /**
         * 根据id得到该自定义组件的原始字符串
         * @param {Object} id
         */
        getOrignStr: function (id) {
            var str = '[';
            if (editLinkComp.data != "") {
                for (var i = editLinkComp.data.list.length - 1; i >= 0; i--) {
                    str += '{"title":"' + editLinkComp.data.list[i].title + '","desc":"' + editLinkComp.data.list[i].desc + '","link":"' + editLinkComp.data.list[i].link + '"},';
                }
                if (str.length > 2) {
                    str = str.substring(0, str.length - 1);
                }
            }
            str += ']';
            str = Core.String.a2u(str);
            return str;
        },
        preview: function () {

            $E('previewtitle').innerHTML = Core.String.encodeHTML($E('nameinput').value);
            var _template = '<div class="diyList"><p class="SG_dot"><a href="#{href}" target="_blank">#{title}</a></p><p class="">#{desc}</p></div><div class="SG_j_linedot"></div>';
            var _result = [];
            var lis = $T($E('customModuleList'), 'li');

            for (var i = 0; i < lis.length; i++) {
                var o = {};
                var inputs = $T(lis[i], 'input');

                if (!this.reg.test(inputs[1].value))//如果输入类似www.sina.com.cn,补全为http://www.sina.com.cn
                    inputs[1].value = 'http://' + inputs[1].value;
                var href = inputs[1].value;

                //BLOGBUG-5578 经产品确定，FF下的预览效果可以接收，所以不做截取操作
                o.title = Core.String.encodeHTML(inputs[0].value);
                o.desc = Core.String.encodeHTML(inputs[2].value);
                o.href = href;
                _result.push(o);
            }
            var tmp = new Ui.Template(_template);
            sResult = tmp.evaluateMulti(_result, false);
            $E('previewbody').innerHTML = sResult;
        }
    };
})();
