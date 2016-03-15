/**
 * @fileoverview
 *    页面设置中博文列表组件 10001，与其他页面的仅接口不一样
 一共有三个 10001、10002、10003，都是同类型的可定制组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/utils/io/ajax.js");
$import("sina/core/array/hashBy.js");
$import("sina/core/string/byteLength.js");

$import("lib/interface.js");
$import("lib/component/class/registComp.js");

$import("component/comp_10001.js");
$import("component/include/getArticlesSort.js");
$import("component/include/articleListComponentSynchronize.js");
/**
 * 组件渲染流程，参见 10001
 */
$registComp(10001, {
    // 载入指定分页的列表
    "load": function (nPage) {
        var isNewCreate = this.getContent().innerHTML == "";
        // 没提供页码就不自动加载
        if ((nPage == null || this.currentPage == null) && isNewCreate == false) {
            if (this.size != 210) {
                // 没提供页码就直接读数和渲染分页
                this.afterLoadList();
                this.articleSort = $E("pagination_" + this.compId).getAttribute("classID");
                App.articleListComponentSynchronize.regist(this.compId, this.articleSort, this.size);
            } else {
                this.getArticleListsIn210();
                var i_getUserSet = new Interface("http://control.blog.sina.com.cn/riaapi/component_config/read_component.php", "ijax");
                i_getUserSet.request({
                    POST: {
                        "title_code": this.compId
                    }, onSuccess: Core.Function.bind2(function (oData) {
                        var info = oData[this.compId];
                        // 当前组件的分类
                        this.articleSort = (info._default == 1) ? 0 : info.my_body.cat;
                        // 当前组件是摘要还是全文显示
                        this.articleView = (info._default == 1) ? 0 : info.my_body.display_type;
                        App.articleListComponentSynchronize.regist(this.compId, this.articleSort, this.size);
                    }, this)
                });
            }
            return;
        }
        if (isNaN(nPage)) {
            if (this.size != 210) {
                // 没提供页码就直接读数和渲染分页
                this.afterLoadList();
            } else {
                this.getArticleListsIn210();
            }
            return;
        }
        var i_getArticleList = new Interface("http://control.blog.sina.com.cn/riaapi/appMake_Show.php", "jsload");
        var param = {
            "uid": scope.$uid, "vid": this.compId, "width": this.size, "p": nPage || this.currentPage || 1
        };

        i_getArticleList.request({
            GET: param, onSuccess: Core.Function.bind2(function (sData) {
                // 将列表写入到组件中
                // 如果组件不是 210，还需要渲染分页
                if (isNewCreate) {
                    try {
                        var i_getUserSet = new Interface("http://control.blog.sina.com.cn/riaapi/component_config/read_component.php", "ijax");
                        i_getUserSet.request({
                            POST: {
                                "title_code": this.compId
                            }, onSuccess: Core.Function.bind2(function (oData) {
                                var info = oData[this.compId];
                                // 当前组件的分类
                                this.articleSort = (info._default == 1) ? 0 : info.my_body.cat;
                                // 当前组件是摘要还是全文显示
                                this.articleView = (info._default == 1) ? 0 : info.my_body.display_type;
                                App.articleListComponentSynchronize.regist(this.compId, this.articleSort, this.size);
                            }, this)
                        });
                    } catch (e) {
                        trace(e.message);
                    }
                }

                if (this.size != 210) {
                    this.setContent(sData);
                    this.afterLoadList();
                } else {
                    // 210 组件输出的 HTML 已经包含更多
                    this.setContent(sData);
                    this.getArticleListsIn210();
                }
            }, this)
        });
        var title = this.getTitle().getAttribute("comp_title") || this.getTitle().innerHTML;
        this.getTitle().setAttribute("comp_title", title);
        if (this.size == 210 && Core.String.byteLength(title) > 8) {
            this.getTitle().innerHTML = Core.String.leftB(title, 6) + "…";
        } else {
            this.getTitle().innerHTML = title;
        }
        if (scope.$pageid == "pageSetM" && this.setManage) {
            this.setManage();
        }
    }
    /*
     * 设置组件的管理链接，仅在页面设置新增组件的时候会用到
     */, "setManage": function () {
        if ($isAdmin && this.getManage()) {
            // 如果没有分类ID号，先去读取，否则管理链接没法增加
            this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(' + this.compId + ');return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(' + this.compId + ');return false;">↓</a></span>' + '<a href="#" onclick="Lib.Component.set(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>设置</cite>]</a>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
        }
    }
    /*
     * 取得用户该列表的设置
     */, "getUserSet": function () {
        // 先读取分类 ID 和对应的名称
        if (this.isSetOn == null) {
            this.isSetOn = true;
            Core.Dom.insertHTML(this.getContent(), '<div id="comp_' + this.compId + '_set"></div>', "AfterBegin");
            App.getArticlesSort(Core.Function.bind2(function () {
                var userset_html = ['<div class="vp_login #{cls} borderc">'
                    ,
                        '<div>显示方式：<select id="comp_' + this.compId + '_view" #{disable}>#{view}</select>#{tips}' + (this.size != 210 ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '')
                    ,
                        ' 用分类筛选：<select id="comp_' + this.compId + '_sort">#{type}</select>' + (this.size != 210 ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '<br/>')
                    , ' 显示文章篇数：<select id="comp_' + this.compId + '_pagesize">#{pagesize}</select>'
                    ,
                        '</div>#{span210start}<a href="#" onclick="Core.Function.bind2(Lib.Component.instances[' + this.compId + '].saveUserSet, Lib.Component.instances[' + this.compId + '])();return false;" class="SG_aBtn SG_aBtnB "><cite>确定</cite></a>&nbsp;'
                    ,
                        '<a href="#" onclick="Core.Dom.removeNode($E(\'comp_' + this.compId + '_set\'));Lib.Component.instances[' + this.compId + '].isSetOn=null;return false;" class="SG_aBtn SG_aBtnB "><cite>取消</cite></a>#{span210end}'
                    , '</div>'].join("");

                var i_getUserSet = new Interface("http://control.blog.sina.com.cn/riaapi/component_config/read_component.php", "ijax");
                i_getUserSet.request({
                    POST: {
                        "title_code": this.compId
                    }, onSuccess: Core.Function.bind2(function (oData) {
                        var info = oData[this.compId];
                        // 当前组件的分类
                        this.articleSort = (info._default == 1) ? 0 : info.my_body.cat;
                        // 当前组件是摘要还是全文显示
                        this.articleView = (info._default == 1) ? 0 : info.my_body.display_type;
                        this.articlePageSize = (info._default == 1) ? 10 : (info.my_body.page_size || 10);

                        var setClass = {
                            210: "w3", 510: "w2", 730: "w1"
                        };
                        //准备用于替换模板的数据
                        var data = {
                            "cls": setClass[this.size], "disable": this.size == 210 ? 'disabled="true"' : '', "tips": this.size == 210 ? '<br/>该模块移至更宽位置方可使用该功能</div><div>' : '', "span210start": this.size == 210 ? '<span>' : '', "span210end": this.size == 210 ? '</span>' : ''
                        };
                        // 全文还是摘要数据
                        data.view = '<option value="0" ' + (this.articleView == 0 ? 'selected="true"' : '') + '>摘要</option><option value="1"' + (this.articleView == 1 ? 'selected="true"' : '') + '>全文</option><option value="2"' + (this.articleView == 2 ? 'selected="true"' : '') + '>标题</option>';
                        // 分类数据
                        var type = ['<option value="0" ' + (this.articleSort == 0 ? 'selected="true"' : '') + '>全部博文</option>'];
                        Core.Array.foreach(App.ArticlesSort.data, Core.Function.bind2(function (oItem) {
                            type.push('<option value="' + oItem.id + '" ' + (this.articleSort == oItem.id ? 'selected="true"' : '') + '>' + (this.size == 210 ? Core.String.leftB(oItem.name, 16) : oItem.name) + '</option>');
                        }, this));
                        data.type = type.join("");
                        data.pagesize = ['<option value="1" ' + (this.articlePageSize == 1 ? 'selected="true"' : '') + '>1 篇</option>'
                            ,
                                '<option value="2" ' + (this.articlePageSize == 2 ? 'selected="true"' : '') + '>2 篇</option>'
                            ,
                                '<option value="3" ' + (this.articlePageSize == 3 ? 'selected="true"' : '') + '>3 篇</option>'
                            ,
                                '<option value="4" ' + (this.articlePageSize == 4 ? 'selected="true"' : '') + '>4 篇</option>'
                            ,
                                '<option value="5" ' + (this.articlePageSize == 5 ? 'selected="true"' : '') + '>5 篇</option>'
                            ,
                                '<option value="6" ' + (this.articlePageSize == 6 ? 'selected="true"' : '') + '>6 篇</option>'
                            ,
                                '<option value="7" ' + (this.articlePageSize == 7 ? 'selected="true"' : '') + '>7 篇</option>'
                            ,
                                '<option value="8" ' + (this.articlePageSize == 8 ? 'selected="true"' : '') + '>8 篇</option>'
                            ,
                                '<option value="9" ' + (this.articlePageSize == 9 ? 'selected="true"' : '') + '>9 篇</option>'
                            ,
                                '<option value="10" ' + (this.articlePageSize == 10 ? 'selected="true"' : '') + '>10 篇</option>'].join('');
                        //将设置 DIV 写入组件内
                        var template = new Ui.Template(userset_html);
                        var result = template.evaluate(data);
                        $E('comp_' + this.compId + '_set').innerHTML = result;
                    }, this), onError: function (oData) {
                        showError(oData.code);
                    }, onFail: function () {
                        showError("A00001");
                    }
                });
            }, this));
        }
    }
    /*
     * 保存用户设置并刷新当前列表
     */, "saveUserSet": function () {
        Debug.info("save..." + this.compId);
        var userSort = $E('comp_' + this.compId + '_sort').value;
        var userView = $E('comp_' + this.compId + '_view').value;
        var userPageSize = $E('comp_' + this.compId + '_pagesize').value;
        // 如果显示模式和分类都未变化，就直接删除设置 DIV，不做接口提交
        if (userSort == this.articleSort && userView == this.articleView && userPageSize == this.articlePageSize) {
            Debug.log("组件 " + this.compId + " 没有任何修改，直接关掉设置浮层");
            Core.Dom.removeNode($E('comp_' + this.compId + '_set'));
            this.isSetOn = null;
        } else {
            var i_setUserSet = new Interface("http://control.blog.sina.com.cn/riaapi/component_config/write_component.php", "ijax");
            i_setUserSet.request({
                POST: {
                    "title_code": this.compId, "cat": userSort, "display_type": userView, "page_size": userPageSize
                },
                onSuccess: Core.Function.bind2(function () {
                    this.isSetOn = null;
                    Core.Dom.removeNode($E('comp_' + this.compId + '_set'));
                    Debug.info("如果改变了分类,pagesize或者显示模式，就刷新组件");

                    if (userSort != this.articleSort || userView != this.articleView || userPageSize != this.articlePageSize) {
                        this.articleSort = userSort;
                        App.articleListComponentSynchronize.regist(this.compId, this.articleSort);
                        // 改变组件标题
                        var list = Core.Array.hashBy(App.ArticlesSort.data, "id");
                        var titleText = userSort == 0 ? "博文" : list[userSort].name;
                        this.getTitle().setAttribute("comp_title", titleText);
                        if (this.size == 210 && Core.String.byteLength(titleText) > 8) {
                            this.getTitle().innerHTML = Core.String.leftB(titleText, 6) + "…";
                        }
                        this.setTitle(titleText);

                        // 重新读取组件的文章列表
                        this.currentPage = 1;
                        this.load(this.currentPage);
                    }
                }, this), onError: function (oData) {
                    showError(oData.code);
                }, onFail: function () {
                    showError("A00001");
                }
            });
        }
    }
}, "10001");
