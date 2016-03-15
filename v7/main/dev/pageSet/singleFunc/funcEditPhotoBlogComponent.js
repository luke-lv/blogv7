/**
 * @fileoverview 编辑或新增自定义图片博文列表组件
 * @author Luo Rui luorui1@staff.sina.com.cn
 */
$import("sina/ui/dialog/windowDialog.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/format.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/array/foreach.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/limitLength.js");
$import("sina/utils/limitReg.js");
$import("sina/ui/template.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import('pageSet/pageSetVariables.js');
$import("msg/diycomponentsMSG.js");
$import("component/include/getArticlesSort.js");

(function () {
    var _this = window.editPhotoBlogComp = {
        "cateInfo": {}, "pageSize": 4, "articleList": [], "compTitle": '', "compStyle": 0, "compId": '', "maxCount": 100, "titleTip": '请输入模块标题', "emptyTitle": '输入名称（必填）'
        /**
         * 博文分类接口 读取
         */, "interfaceLoadCate": App.getArticlesSort
        /**
         * 博文列表接口 读取
         */, "interfaceLoadList": new Interface('http://control.blog.sina.com.cn/riaapi/associate/get_articles_xrank.php', 'jsload')
        /**
         * 博文列表接口 读取(之前的)
         */, "interfaceLoadList_old": new Interface('http://control.blog.sina.com.cn/riaapi/photoblog/get_blog_list_by_page_class.php', 'jsload')
        /**
         * 图片博文列表组件 读取
         */, "interfaceLoadComponent": new Interface('http://control.blog.sina.com.cn/riaapi/sys_module/edit_custmod_photoblog.php', 'jsload')
        /**
         * 图片博文列表组件 创建
         */, "interfaceCreateComponent": new Interface('http://control.blog.sina.com.cn/riaapi/sys_module/new_custmod_photoblog_post.php', 'ajax')
        /**
         * 图片博文列表组件 修改
         */, "interfaceModifyComponent": new Interface('http://control.blog.sina.com.cn/riaapi/sys_module/edit_custmod_photoblog_post.php', 'ijax'), "interfaceShow": new Interface('http://control.blog.sina.com.cn/riaapi/appMake_Show.php', 'jsload')
        /**
         * 新增或编辑
         * @param {Object} cid
         */, "edit": function (cid) {
            if (!window._photoBlogDialog) {
                _this.initDialog();
            }
            if (!cid) {
                _this.addDialogShow();
            } else {
                _this.modifyDialogShow(cid);
            }
            _this.compId = cid;
        }
        /**
         * 显示新增浮层
         */, "addDialogShow": function () {
            _this.compId = '';
            _this.compTitle = '';
            _this.compStyle = 0;
            _this.articleList.length = 0;
            _this.clearPhotoBlogList();
            _this.clearArticleList();
            $E('inputName').value = _this.titleTip;
            $E('selectStyle').selectedIndex = 0;
            $E('selectCate').selectedIndex = 0;
            $E('savePhotoBtn').style.display = "none";
            $E('applyPhotoBtn').innerHTML = '保存';
            $E('applyPhotoBtn').parentNode.style.display = '';
            window._photoBlogDialog.show();
            window._photoBlogDialog.setAreaLocked(true);
            window._photoBlogDialog.setMiddle();
            _this.loadCate(function () {
                _this.loadPhotoBlogList(1);
                _this.renderList();
                window._photoBlogDialog.setMiddle();
            });
        }
        /**
         * 显示修改浮层
         */, "modifyDialogShow": function (cid) {
            _this.clearPhotoBlogList();
            _this.clearArticleList();
            $E('savePhotoBtn').style.display = "";
            $E('applyPhotoBtn').parentNode.style.display = 'none';
            window._photoBlogDialog.show();
            window._photoBlogDialog.setAreaLocked(true);
            window._photoBlogDialog.setMiddle();
            _this.loadComponentInfo(cid, function () {
                _this.loadCate(function () {
                    window._photoBlogDialog.setMiddle();
                    _this.loadPhotoBlogList(1);
                });
            });
        }
        /**
         * 读取组件信息
         */, "loadComponentInfo": function (cid, func) {
            _this.interfaceLoadComponent.request({
                GET: {
                    cid: cid
                }, onSuccess: function (oData) {
                    $E('inputName').value = _this.decode(oData.name);
                    $E('selectStyle').selectedIndex = oData.style;
                    _this.compTitle = oData.name;
                    _this.compStyle = oData.style;
                    _this.articleList.length = 0;
                    for (var n = 0, m = oData.list.length; n < m; n++) {
                        _this.articleList.push({
                            "is_photo": oData.list[n].if_photo,
                            "title": Core.String.a2u(oData.list[n].title),
                            "id": 'a_' + oData.list[n].blog_id
                        });
                    }
                    _this.renderList();
                    if (func) {
                        func();
                    }
                }, onError: function (data) {
                    showError(data.code);
                }, onFail: function () {
                    showError('A00001');
                }
            });
        }
        /**
         * 读取并显示分类
         */, "loadCate": function (functionCB) {
            _this.interfaceLoadCate(function (oData) {
                if (functionCB) functionCB();
                var selectCate = $E('selectCate');
                _this.cateInfo = oData;
                _this.countInfo = {};
                selectCate.options.length = 0;
                selectCate.options.add(new Option('全部图片博文', ''));
                _this.countInfo[0] = oData.total;
                var opt, datai;
                for (var n = 0, m = oData.data.length; n < m; n++) {
                    datai = oData.data[n];
                    opt = new Option(format(datai.name, 20), datai.id);
                    opt.title = datai.name;
                    selectCate.options.add(opt);
                    _this.countInfo[n + 1] = datai.count;
                }
            });
            function format(str, len) {
                var strLen = Core.String.byteLength(str);
                if (strLen > len) {
                    str = Core.String.leftB(str, len - 2) + '…';
                }
                return str;
            }
        }
        /**
         * 显示图片博文列表
         * @param {Integer} page
         */, "loadPhotoBlogList": function (page) {
            _this.clearPhotoBlogList();
            _this.interfaceLoadList.request({
                GET: {
                    'uid': scope.$uid,
                    'p': page,
                    's': _this.pageSize,
                    'c': $E('selectCate').value,
                    'x': 'img'
                }, onSuccess: function (oData) {
                    var selectCate = $E('selectCate');
                    var pbListUl = $E('pbListUl');
                    var htmlStr = '';
                    var template = '<li><input type="checkbox" id="a_{0}" {3} {4}/>{6}<label for="a_{1}" isphoto="{7}">{2}</label>{5}</li>';
                    var checked = 'checked="checked"';
                    var onclick = 'onclick="editPhotoBlogComp.addToList(this)"';
                    var result = oData['result'] ? oData['result'] : [];
                    var maxPage = oData.count ? Math.ceil(oData.count / _this.pageSize) : 0;
                    pbListUl.innerHTML = '';

                    for (var n = 0, m = result.length; n < m; n++) {
                        if (_this.duplicate('a_' + result[n].i)) {
                            checked = 'checked="checked"';
                        } else {
                            checked = '';
                        }
                        var is_photo = result[n].p == 1 ? '<span class="atc_ic_b"><img width="15" height="15" align="absmiddle" title="此博文包含图片" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon18"></span>' : '';
                        var is_recommend = result[n].r == 1 ? '<a target="_blank" href="#" onclick="return false"><img align="absmiddle" width="18" height="18" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon107"></a>' : '';
                        htmlStr += template.format(result[n].i, result[n].i, result[n].t, checked, onclick, is_photo, is_recommend, result[n].p == 1 ? 'true' : 'false');
                    }
                    if (!htmlStr) {
                        var _tmp = '';
                        if ($E('selectCate').value == '') {
                            _tmp = '你还没有图片博文，现在<a href="http://control.blog.sina.com.cn/admin/article/article_add.php" target="_blank"><strong>发博文</strong>'
                        } else {
                            _tmp = '该分类下暂无博文'
                        }
                        htmlStr = '<div style="text-align:center;padding:10px">{0}</div>'.format(_tmp);
                    }
                    pbListUl.innerHTML = htmlStr;

                    if (maxPage > 1) {
                        $E('pbListPage').style.display = 'block';
                        Ui.Pagination.init({
                            "pageNode": "pbListPage",
                            "nodeClassNamePrefix": "SG",
                            "curPage": page, // 当前所在页码
                            "maxPage": maxPage, //最大页数
                            "pageTpl": function (page) {
                                _this.loadPhotoBlogList(page);
                            }
                        }).show();
                    } else {
                        $E('pbListPage').innerHTML = '';
                        $E('pbListPage').style.display = 'none';
                    }
                }, onError: function (data) {
                    $E('pbListUl').innerHTML = '<li style="text-align:center">载入博文列表失败， 囧rz。</li>';
                    $E('pbListPage').style.display = 'none';
                }, onFail: function (data) {
                    $E('pbListUl').innerHTML = '<li style="text-align:center">载入博文列表失败， 囧rz。</li>';
                    $E('pbListPage').style.display = 'none';
                }
            });
        }
        /**
         * 清除当前图片博文列表
         */, "clearPhotoBlogList": function () {
            $E('pbListUl').innerHTML = '<li class="topbar_loading"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif" />加载中…</li>';
        }
        /**
         * 清除已选中的博文列表
         */, "clearArticleList": function () {
            $E('articleList').innerHTML = '<li style="text-align:center">暂无内容</li>';
        }
        /**
         * 把选中的博文添加到列表中
         */, "addToList": function (cbox) {
            if (cbox.checked) {
                if (_this.articleList.length >= _this.maxCount) {
                    winDialog.alert('最多只能添加100篇博文', {icon: '01'});
                    cbox.checked = false;
                    return;
                }
            }
            ;
            var arrLi = $T($E('pbListUl'), 'li');
            for (var li = {}, title = '', is_photo = false, n = 0, m = arrLi.length; n < m; n++) {
                li = $T(arrLi[n], 'input')[0];
                title = $T(arrLi[n], 'label')[0].innerHTML;
                is_photo = $T(arrLi[n], 'label')[0].getAttribute('isphoto') == 'true';
                if (li.checked) {
                    if (!_this.duplicate(li.id)) {
                        _this.articleList.unshift({"id": li.id, "title": title, "is_photo": is_photo});
                    }
                } else {
                    var index = _this.findIndex(li.id);
                    if (index > -1) {
                        _this.articleList.splice(index, 1);
                    }
                }
            }
            _this.renderList();
        }
        /**
         * 渲染选中的博文列表
         */, "renderList": function () {
            var articleList = $E('articleList');
            var template = '<li id="{8}"><div><span class="SG_floatR">' + '<span class="SG_floatL"><a href="#" {1} class="CP_a_fuc Option1">[<cite>编辑</cite>]</a></span>' + '<span class="SG_floatL"><a href="#" {2} class="CP_a_fuc Option2">[<cite>删除</cite>]</a></span>' + '<span class=" SG_floatL"><a href="#" {3} class="sortUp {5}"><img src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" alt="" /></a></span>' + '<span class=" SG_floatL"><a href="#" {4} class="sortDown {6}"><img src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"  alt="" /></a></span>' + '</span><a href="{9}" class="customName" target="_blank">{0}</a>{7}</div></li>';
            var htmlStr = '';
            Core.Array.foreach(_this.articleList, function (o, index) {
                var str_1 = 'onclick="editPhotoBlogComp.showEditor(' + index + ');return false"';
                var str_2 = 'onclick="editPhotoBlogComp.deleteFromList(' + index + ');return false"';
                var str_3 = 'onclick="editPhotoBlogComp.sortUp(' + index + ');return false"';
                var str_4 = 'onclick="editPhotoBlogComp.sortDown(' + index + ');return false"';
                var str_5 = 'sortUpT';
                var str_6 = 'sortDownB';
                var str_7 = o.is_photo ? '<span class="atc_ic_b"><img width="15" height="15" align="absmiddle" title="此博文包含图片" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon18"></span>' : '';
                var str_8 = 'li_' + o.id;
                var str_9 = 'http://blog.sina.com.cn/s/blog_' + o.id.replace('a_', '') + '.html';
                if (index > 0) str_5 = '';
                if (index < _this.articleList.length - 1) str_6 = '';
                htmlStr += template.format(_this.encode(o.title), str_1, str_2, str_3, str_4, str_5, str_6, (str_7, ''), str_8, str_9);
            });
            if (!htmlStr) htmlStr = '<li style="text-align:center">暂无内容</li>';
            articleList.innerHTML = htmlStr;
            _this.refreshBtn();
        }
        /**
         * 保存组件
         */, "saveComponent": function () {
            var inputName = $E('inputName');
            _this.compTitle = inputName.value.replace(/\s|　/g, '');
            inputName.value = _this.compTitle;
            if (_this.compTitle == _this.titleTip) {
                _this.compTitle = '';
            }
            if (_this.compTitle == '') {
                winDialog.alert("请输入标题", {
                    funcOk: function () {
                        setTimeout(function () {
                            inputName.focus();
                        }, 0);
                    },
                    icon: "01"
                }, "tips");
                return;
            }
            if (_this.articleList.length <= 0) {
                winDialog.alert("请至少选择一篇博文", {
                    funcOk: function () {
                    },
                    icon: "01"
                }, "tips");
                return;
            }
            if (!_this.isReadyToSave()) return;
            var data = {
                cid: _this.compId,
                title: _this.compTitle,
                style: _this.compStyle,
                cnt: _this.articleList.length
            }
            for (var n = 0, m = _this.articleList.length; n < m; n++) {
                data["title_" + n] = _this.articleList[n].title;
                data["id_" + n] = _this.articleList[n].id.replace('a_', '');
                //data["link_" + n] = 'http://blog.sina.com.cn/s/blog_' + data["id_" + n] + '.html';
            }
            var interfaceO = {};
            if (!_this.compId) { //如果没有compId，新建组件
                interfaceO = _this.interfaceCreateComponent;
                _this.isnew = true;
            } else { //有则修改组件
                interfaceO = _this.interfaceModifyComponent;
                _this.isnew = false;
            }
            var retitle = data.title;
            interfaceO.request({
                GET: {
                    uid: scope.$uid
                },
                POST: data,
                onSuccess: function (data) {
                    winDialog.alert("保存成功！", {
                        funcOk: function () {
                            window._photoBlogDialog.hidden();
                            //点击应用按钮
                            if (_this.isnew == true && __pageSetVar.component_list.length < 25) {
                                $E('components_9_' + data).checked = true;
                                addComp(data, __pageSetVar.textname, 1);
                                var titlespan = Core.Dom.getChildrenByClass(Core.Dom.getChildrenByClass($E('module_' + data), 'SG_connHead')[0], 'title')[0];
                                titlespan.innerHTML = retitle;
                            }
                        },
                        icon: "03"
                    }, "tips");
                    try {
                        __pageSetVar.tabs[4].loadData();
                    } catch (e) {
                    }
                    _this.refreshPanel(data, retitle);
                },
                onError: function (data) {
                    showError(data.code);
                },
                onFail: function () {
                    showError('A00001');
                }
            });
        }
        /**
         * 刷新组件
         * @param {Integer} data 组件id
         */, "refreshPanel": function (data, retitle) {
            var width = $E('module_' + data).offsetWidth;
            try {
                var title = Core.Dom.getChildrenByClass($T($E('module_' + data), 'div')[0], 'title')[0];
                title.innerHTML = retitle;
                title.setAttribute('title', retitle);
                title.setAttribute('comp_title', retitle);
                Lib.Component.instances[data].load();
            } catch (e) {
            }
            try {
                this.interfaceShow.request({
                    GET: {
                        uid: scope.$uid,
                        vid: data,
                        width: width
                    },
                    onSuccess: function (data2) {
                        Core.Dom.getChildrenByClass($E('module_' + data), 'SG_connBody')[0].innerHTML = data2;
                        return;
                    },
                    onError: function (data) {
                        showError(data.code);
                    },
                    onFail: function (data) {
                        showError(data.code);
                    }
                });
            } catch (e) {
            }
        }

        /**
         * 刷新保存按钮
         */, "refreshBtn": function () {
            var savePhotoBtn = $E('savePhotoBtn');
            if (_this.articleList.length > 0) {
                savePhotoBtn.className = 'SG_aBtn SG_aBtnB';
                savePhotoBtn.style.cursor = 'pointer';
            } else {
                savePhotoBtn.className = 'SG_aBtn SG_aBtnB';
                savePhotoBtn.style.cursor = 'pointer';
            }
        }
        /**
         * 从选中列表中移除
         * @param {Integer} i
         */, "deleteFromList": function (i) {
            try { //尝试同步取消选择
                $E(_this.articleList[i].id).checked = '';
            } catch (e) {
            }
            _this.articleList.splice(i, 1);
            _this.renderList();
        }
        /**
         * 博文上移
         * @param {Integer} i
         */, "sortUp": function (i) {
            if (i <= 0) return;
            var o = _this.articleList[i - 1];
            _this.articleList.splice(i - 1, 1, _this.articleList[i]);
            _this.articleList.splice(i, 1, o);
            _this.renderList();
        }
        /**
         * 博文下移
         * @param {Integer} i
         */, "sortDown": function (i) {
            if (i >= this.articleList.length - 1) return;
            var o = _this.articleList[i + 1];
            _this.articleList.splice(i + 1, 1, _this.articleList[i]);
            _this.articleList.splice(i, 1, o);
            _this.renderList();
        }
        /**
         * 检查是否有重复
         * @param {String} blog_id
         */, "duplicate": function (blog_id) {
            var flag = false;
            Core.Array.foreach(_this.articleList, function (o) {
                if (o.id == blog_id) flag = true;
            });
            return flag;
        }
        /**
         * 查找在选中博文中的位置
         * @param {String} blog_id
         */, "findIndex": function (blog_id) {
            var index = -1;
            for (var n = 0, m = _this.articleList.length; n < m; n++) {
                if (_this.articleList[n].id == blog_id) {
                    index = n;
                    return index;
                }
            }
            return index;
        }
        /**
         * 显示条目编辑框
         * @param {Integer} i 下标
         */, "showEditor": function (i) {
            this.hideEditor();
            var blog_id = this.articleList[i].id;
            var str1 = 'onclick="editPhotoBlogComp.saveEditor(' + i + ');return false"';
            var str2 = 'onclick="editPhotoBlogComp.hideEditor();return false"';
            var str3 = this.articleList[i].title;
            var htmlStr = this.editorTpl.format(i, str1, str2, str3);
            var li = $E('li_' + this.articleList[i].id);
            Core.Dom.insertHTML(li, htmlStr, "beforebegin");
            li.style.display = 'none';
            Utils.limitLength($E('title_input'), 50); //限制为25个汉字
            var reg = /\"|\\|\s|　/;
            Utils.limitReg($E('title_input'), reg); //不允许出现空格
        }
        /**
         * 关闭条目编辑框
         */, "hideEditor": function () {
            var titleEditor = $E('title_editor');
            if (!titleEditor) return;
            var li = $E('li_' + this.articleList[titleEditor.getAttribute('list_id')].id);
            li.style.display = 'block';
            titleEditor.parentNode.removeChild(titleEditor);
        }
        /**
         * 暂时保存条目
         * @param {Integer} i 下标
         */, "saveEditor": function (i) {
            var input = $E('title_input');
            if (!input) return;
            var val = input.value;
            if (val.replace(/\s/g, '').length <= 0 || val == this.emptyTitle) {
                input.value = this.emptyTitle;
                input.onfocus = function () {
                    this.value = '';
                }
                input.onblur = function () {
                    this.onclick = null;
                }
                return;
            }
            this.articleList[i].title = val;
            $T($E('li_' + this.articleList[i].id), 'a')[4].innerHTML = this.encode(val);
            this.hideEditor();
        }
        /**
         * 如果正在编辑中,做出相应处理
         */, "isReadyToSave": function () {
            var titleEditor = $E('title_editor');
            var input = $E('title_input');
            if (!input) return true;
            var val = input.value;
            if (val.replace(/\s/g, '').length <= 0 || val == this.emptyTitle) {
                input.value = this.emptyTitle;
                input.onfocus = function () {
                    this.value = '';
                }
                input.onblur = function () {
                    this.onclick = null;
                }
                return false;
            }
            this.saveEditor(titleEditor.getAttribute('list_id'));
            return true;
        }, "encode": function (str) {
            return str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        }, "decode": function (str) {
            return str.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>');
        }
        /**
         * 条目编辑框模板
         */, "editorTpl": '' + '<li id="title_editor" list_id="{0}" ><div class="editCustomModule">' + '<span class="SG_floatL">' + '<input id="title_input" class="CP_w_fm3" type="text" value="{3}" name=""/>' + '</span>' + '<span class="SG_floatL">' + '<a href="javascript:;" {1} class="SG_aBtn SG_aBtnB"><cite>确定</cite></a>' + '</span>' + '<span class="SG_floatL">' + '<a href="javascript:;" {2} class="SG_aBtn SG_aBtnB"><cite>取消</cite></a>' + '</span></div></li>'
        /**
         * 初始化图片博文对话框
         */, "initDialog": function () {
            var content = '<div class="customModuleListPop">' + '<div class="addCustomModule addCustomModule_ptb">' + '<span class="SG_floatL"><input id="inputName" class="CP_w_fm2" type="text" value="输入名称(必填)" name="" /> <em class="SG_clewtxta">* 必填</em></span>' + '<span class="SG_floatR">分类： <select id="selectCate"><option value="">加载中</option></select>&nbsp;&nbsp;&nbsp;&nbsp;呈现方式： <select id="selectStyle"><option value="0">图片</option><option value="1">文字</option></select></span>' + '<div class="clearit"></div>' + '<div class="customPhotoBlog" style="padding-bottom:10px">' + '<div class="customPhotoBlog_list SG_j_linedot1">' + '<ul id="pbListUl">' + '</ul>' + '</div>' + '<div id="pbListPage"  class="SG_page">' + '<ul class="SG_pages">' + '</ul>' + '</div>' + '<div class="clearit"></div>' + '</div>' + '</div>' + '<div class="customModuleList customModuleList_2">' + '<ul id="articleList">' + '</ul>' + '</div>' + '<p class="CP_w_btns"><a class="SG_aBtn SG_aBtnB" href="#" onclick="return false;" id="savePhotoBtn"><cite>保存</cite></a><a class="SG_aBtn SG_aBtnB" href="#" onclick="return false;" style=""><cite id="applyPhotoBtn">应用</cite></a><a class="SG_aBtn SG_aBtnB" href="#" id="photoBlogCompCancel"><cite>取消</cite></a></p>' + '</div>';

            var tpl = ['<table id="#{entity}" class="CP_w2 topSettingPop">', '<thead id="#{titleBar}">', '<tr>',
                '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">',
                '<strong id="#{titleName}"></strong>',
                '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false;">关闭</a></cite>',
                '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>',
                '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>',
                '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>',
                '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div id="#{content}">', '</div>', '</td>',
                '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");

            window._photoBlogDialog = winDialog.createCustomsDialog({
                tpl: tpl,
                title: "设置模块 > 管理自定义模块 > 自定义图片博文列表",
                content: content,
                width: 623,
                zIndex: 1024
            }, "photoBlogComp");
            var photoBlogComp = winDialog.getDialog('photoBlogComp');
            var btnClose = photoBlogComp.getNodes()["btnClose"];

            //关闭按钮
            Core.Events.addEvent(btnClose, function () {
            });

            //模块名字
            Core.Events.addEvent($E('inputName'), function (e) {
                var tag = Core.Events.getEventTarget(e);
                _this.compTitle = tag.value;
            }, 'change');
            Core.Events.addEvent($E('inputName'), function (e) {
                var tag = Core.Events.getEventTarget(e);
                if (tag.value == _this.titleTip) {
                    tag.value = '';
                    _this.compTitle = '';
                }
                _this.compTitle = tag.value;
            }, 'focus');
            Core.Events.addEvent($E('inputName'), function (e) {
                var tag = Core.Events.getEventTarget(e);
                if (tag.value == _this.titleTip || tag.value == '') {
                    tag.value = _this.titleTip;
                    _this.compTitle = '';
                }
            }, 'blur');

            //添加按钮
            Core.Events.addEvent($E('btnAddToList'), function () {
                _this.addToList();
            }.bind2(this));

            //分类下拉列表
            Core.Events.addEvent($E('selectCate'), function () {
                _this.loadPhotoBlogList(1);
            }.bind2(this), 'change');

            //样式下拉列表
            Core.Events.addEvent($E('selectStyle'), function (e) {
                var tag = Core.Events.getEventTarget(e);
                _this.compStyle = tag.value;
            }, 'change');

            //保存按钮
            Core.Events.addEvent($E('savePhotoBtn'), function () {
                _this.saveComponent();
            });

            //应用事件------------------
            Core.Events.addEvent($E('applyPhotoBtn'), function () {
                _this.saveComponent();
            });

            //取消按钮
            Core.Events.addEvent($E('photoBlogCompCancel'), function () {
                window._photoBlogDialog.hidden();
            });
            Utils.limitLength($E('inputName'), 16); //限制为8个汉字
            var reg = /\"|\\|\s|　/
            Utils.limitReg($E('inputName'), reg); //不允许出现空格

        }
    };
})();
