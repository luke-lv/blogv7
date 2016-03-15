/**
 * @fileoverview
 *    博文列表组件
 一共有三个 10001、10002、10003，都是同类型的可定制组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */

$import("sina/core/array/foreach.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/nextNode.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");

$import("sina/utils/io/jsload.js");
$import("sina/utils/io/ajax.js");
$import("sina/ui/pagination.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");

$import("articleManage/article_addFavorite.js");
$import("articleManage/article_delete.js");
$import("articleManage/article_unsetTop.js");
$import("component/include/getArticlesDetailNumber.js");
// $import("component/include/getArticlesFavoriteNumber.js"); 全部数据由getArticlesDetailNumber方法提供
$import("component/include/getArticlesSort.js");
$import("component/include/articleListComponentSynchronize.js");
$import("component/include/bindSlideEvent.js");
$import("msg/articleManageMSG.js");
$import("msg/impeachMSG.js");

$import("worldcup/articleFunc/article_hide.js");

$import("lib/checkAuthor.js");
$import("lib/login/ui.js");
$import("lib/openBlog.js");
$import("lib/diYuanXinLog.js");

/**
 * 组件渲染流程
 *    初始状态：    实例化    -> 渲染收藏评论阅读数
 *                        -> 渲染分页

 *    刷新/跳页:    根据参数加载指定页码的文章列表 -> 渲染收藏评论阅读数
 *                                             -> 渲染分页

 *    删除文章:    删除确认 -> 删除接口 -> 刷新组件
 *                                    -> 同步页面其他两个组件状态(如果存在且分类相同)
 */
$registComp(10001, {
    // 保存当前页码
    "currentPage": 1
    // 保存当前分类
    , "currentSort": null
    // 载入指定分页的列表
    , "load": function (nPage) {

        // 没提供页码就不自动加载
        if (nPage == null || this.currentPage == null) {
            if (this.size != 210) {
                // 没提供页码就直接读数和渲染分页
                this.afterLoadList();
                this.articleSort = $E("pagination_" + this.compId).getAttribute("classID");
                App.articleListComponentSynchronize.regist(this.compId, this.articleSort, this.size);
            } else {
                Lib.checkAuthor();
                if ($isAdmin) {
                    this.getArticleListsIn210();
                }
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
        // 如果组件不是 210，就渲染分页；210 的博文列表无翻页
        // 非页面设置的组件读取静态 html 接口
        var listUrl = "http://blog.sina.com.cn/s/article_sort_" + scope.$uid + "_" + this.compId + "_" + nPage + ".html";

        Utils.Io.Ajax.request(listUrl, {
            GET: {
                url_random: 0
            }, onComplete: Core.Function.bind2(function (sData) {
                // 将列表写入到组件中
                this.setContent(sData);
                if (this.size != 210) {
                    // 没提供页码就直接读数和渲染分页
                    this.afterLoadList();
                } else {
                    this.getArticleListsIn210();
                }
            }, this)
        });
    },
    // 加载列表成功后，渲染收藏、评论、阅读数及分页
    "afterLoadList": function () {
        this.currentPage = this.currentPage || 0;
        this.getArticleLists();
        this.getSortInfo();
    }
    /*
     * 取得当前页的文章 ID 列表
     */, "getArticleLists": function () {
        var titleLists = eval('(' + $E("pagination_" + this.compId).getAttribute("favMD5") + ')');
        this.currentArticleList = [];

        //顶踩得UID
        var uids = [];
        var favKey = [];
        for (var key in titleLists) {
            var aid = key;
            this.currentArticleList.push(aid);
            uids.push(scope.$uid);
            favKey.push(titleLists[key]);
        }

        var me = this;

        for (var i = 0; me.currentArticleList[i]; i++) {
            var newEle = $E('digg_list_' + me.compId + '_' + me.currentArticleList[i]);
            if (newEle) {
                var eleT = $E('digg_list_' + me.compId + '_' + me.currentArticleList[i]).parentNode.parentNode.getElementsByTagName('b')[0];
                $E('digg_list_' + me.compId + '_' + me.currentArticleList[i]).onclick = (function (tar) {
                    return function (e) {
                        scope.digger.showLast10(tar);
                        return false;
                    }
                })({
                    'ele': eleT, 'res_id': me.currentArticleList[i], 'res_uid': scope.$uid
                });
                var eleT = $E('digg_list_' + me.compId + '_' + me.currentArticleList[i]).parentNode.parentNode.getElementsByTagName('b')[0];
                $E(eleT).onclick = (function (tar) {
                    return function (e) {
                        scope.digger.showLast10(tar);
                        return false;
                    }
                })({
                    'ele': eleT, 'res_id': me.currentArticleList[i], 'res_uid': scope.$uid
                });
            }
        }

        this.bindEvent();

        // 读取阅读评论数，并通过 this.renderNumber 回写
        App.getArticlesDetailNumber(scope.$uid, this.currentArticleList, Core.Function.bind2(this.renderNumber, this));
        // 读取收藏数，并回写 。取消调用旧接口——modified by gaolei 2013-4-1
        /* 		App.getArticlesFavoriteNumber(titleLists
         , Core.Function.bind2(function (oData){
         for(var k in titleLists){
         Lib.checkAuthor();
         if (!$E("f_" + this.compId + "_" + k)) {continue;}
         var splitChar= '';
         if($_GLOBAL.diggerOpenFlag && $E("digg_list_" + this.compId + "_" + k)) {
         splitChar = '┆ ';
         } else {
         splitChar="";
         }
         //if(oData["1_url_" + titleLists[k]] != null){
         if(oData[k] != null){
         $E("f_" + this.compId + "_" + k).nextSibling.nodeValue = '(' + oData[k] + ') '+splitChar;
         }else{
         $E("f_" + this.compId + "_" + k).nextSibling.nodeValue = '(0) '+splitChar;
         }
         }
         },this)); */

    }

    //顶踩的回调功能
    /**
     * @deprecated 个人博客首页不再显示数量，已经废弃
     */, "diggerCallBack": function (data) {
        var me = this;
        for (var i = 0; me.currentArticleList[i]; i++) {
            //顶的数量
            var mNum = data ? data['digg_m_' + me.currentArticleList[i]] : 0;
            var countEle = $E('dbox_count_' + me.compId + '_' + me.currentArticleList[i]);

            if (!countEle) {
                trace('dbox_count_' + me.compId + '_' + me.currentArticleList[i] + '没有发现顶的数字，认为不加载的');
                continue;
            }
            if (mNum) {
                //$E('digg_list_'+me.compId+'_'+me.currentArticleList[i]).parentNode.nextSibling.nodeValue = '('+mNum+')'
                countEle.innerHTML = mNum;
                countEle.setAttribute('mnum', mNum);
            } else {
                //$E('digg_list_'+me.compId+'_'+me.currentArticleList[i]).parentNode.nextSibling.nodeValue = '(0)';
                countEle.innerHTML = '0';
                countEle.setAttribute('mnum', '0');
            }
            var parent = countEle.parentNode;
            parent.style.cursor = 'pointer';
            var res_id = me.currentArticleList[i];
            scope.digger.bindEvent({
                //要改变class的ele
                'ele': parent
                //要绑定事件的ele
                //,'targetEle' : parent.getElementsByTagName('p')[1]
                , 'targetEle': parent, 'ti_title': encodeURIComponent(countEle.getAttribute('ti_title') || ''), 'disClass': 'upBox upBox_dis', 'res_id': res_id, 'res_type': 1, 'res_uid': scope.$uid
                //可选,组件的ID
                , 'compId': me.compId, 'whenFind': function (_opt) {
                    _opt.ele.className = 'upBox upBox_dis';
                    _opt.ele.style.cursor = 'default';
                    _opt.ele.getElementsByTagName('p')[1].innerHTML = '已顶';
                }, 'events': {
                    'mouseover': function (_opt) {
                        return function () {
                            _opt.ele.className = 'upBox upBox_click';
                            _opt.ele.getElementsByTagName('p')[0].innerHTML = '+1';
                        }
                    }, 'mouseout': function (_opt) {
                        return function () {
                            _opt.ele.className = 'upBox';
                            var ele = _opt.ele.getElementsByTagName('p')[0];
                            ele.innerHTML = ele.getAttribute('mnum');
                        }
                    }, 'click': function (_opt) {
                        return function () {
                            scope.digger.diggerPost({
                                'params': {
                                    'res_id': _opt.res_id, 'res_uid': _opt.res_uid || scope.$uid, 'action': '0', 'res_type': '1', 'ti_title': _opt.ti_title
                                }, 'res_id': _opt.res_id, 'res_uid': _opt.res_uid || scope.$uid, 'action': '0', 'res_type': '1', 'onSuccess': function (data) {
                                    _opt.targetEle.onmouseover = function () {
                                    }
                                    _opt.targetEle.onmouseout = function () {
                                    }
                                    _opt.targetEle.onclick = function () {
                                    }
                                    _opt.ele.className = 'upBox upBox_dis';
                                    var ele = _opt.ele.getElementsByTagName('p')[0];
                                    _opt.ele.style.cursor = 'default';
                                    _opt.ele.getElementsByTagName('p')[1].innerHTML = '已顶';
                                    var curr = parseInt(ele.getAttribute('mnum')) + 1;
                                    ele.innerHTML = curr;
                                    //todo 这里需要同步更新吗？能马上刷出结果来吗？
                                    //$E('digg_list_'+_opt.compId+'_'+_opt.res_id).parentNode.nextSibling.nodeValue = '('+curr+')';
                                }, 'onError': function (data) {
                                    if (data.code == 'B00801') {
                                        winDialog.alert("这篇博文您已经顶过啦!", {
                                            icon: "01"
                                        });
                                        _opt.targetEle.onmouseover = function () {
                                        }
                                        _opt.targetEle.onmouseout = function () {
                                        }
                                        _opt.targetEle.onclick = function () {
                                        }
                                        _opt.ele.className = 'upBox upBox_dis';
                                        _opt.ele.style.cursor = 'default';
                                        var ele = _opt.ele.getElementsByTagName('p')[0];
                                        _opt.ele.getElementsByTagName('p')[1].innerHTML = '已顶';
                                        var curr = ele.getAttribute('mnum');
                                        ele.innerHTML = curr;
                                        scope.digger.setData(_opt.res_id, scope.$uid, 1);
                                    } else {
                                        showError(data.code);
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    // 获取 210 px 下的文章列表
    , "getArticleListsIn210": function () {
        Lib.checkAuthor();
        if ($isAdmin) {
            var linkNodes = Core.Dom.getElementsByClass(this.getContent(), "div", "setup");
            var getLastKid = function (parent, tag) {
                var elements = parent.getElementsByTagName(tag);
                return elements.length ? elements[elements.length - 1] : undefined;
            };
            var lastA;
            if (linkNodes.length > 0) {
                this.currentArticleList = [];
                for (var i = 0, len = linkNodes.length; i < len; i++) {
                    lastA = getLastKid(linkNodes[i], "a");
                    if (lastA && (lastA.id != null)) {			//做世界杯兼容（不允许删除）
                        this.currentArticleList.push(lastA.id.replace(/^d_\d+_/, ""));
                    }
                }
                this.bindEvent();
            }
        }
    }
    // 给文章的操作链接绑定事件
    , "bindEvent": function () {
        var sildeBoxData = []
            , isShowSlide = true;

        if (scope && (scope.$pageid === "pageSetM")) {
            isShowSlide = false;
        }
        Core.Array.foreach(this.currentArticleList, Core.Function.bind2(function (aid) {
            // 给收藏链接绑定事件
            if ($E("f_" + this.compId + "_" + aid)) {
                Core.Events.addEvent($E("f_" + this.compId + "_" + aid), Core.Function.bind3(function (sAid) {
                    var me = this;
                    var func = function () {
                        scope.blogOpener.showDialog(function () {
                            new App.addFavoriteArticle(sAid, {
                                callback: Core.Function.bind3(function () {
                                    // 重写收藏数
                                    var currentNum = $E("f_" + me.compId + "_" + sAid).nextSibling.nodeValue;
                                    currentNum = currentNum.replace(/(\d+)/, function (a, b) {
                                        return (b * 1 + 1);
                                    });
                                    $E("f_" + me.compId + "_" + sAid).nextSibling.nodeValue = currentNum;
                                    winDialog.alert($SYSMSG.B03020, {icon: "03"});
                                }, me, [sAid])
                            });
                        });
                    }

                    Lib.checkAuthor();
                    if (!$isLogin) {
                        v7sendLog('48_01_35');
                        new Lib.Login.Ui().login(func);
                    } else {
                        func();
                    }

                }, this, [aid]));
            }

            // 给删除、取消置顶链接绑定事件
            Lib.checkAuthor();
            if ($isAdmin) {
                if ($E("d_" + this.compId + "_" + aid)) {
                    Core.Events.addEvent($E("d_" + this.compId + "_" + aid), Core.Function.bind3(function (sAid) {
                        new App.deleteArticle(sAid, {
                            callback: Core.Function.bind3(function () {
                                Core.Function.bind3(this.reload, this, [this.size, null, true])();
                                App.articleListComponentSynchronize.synchronize(this.compId, this.articleSort);
                            }, this)
                        });
                    }, this, [aid]));
                }
                if ($E("u_" + this.compId + "_" + aid)) {
                    Core.Events.addEvent($E("u_" + this.compId + "_" + aid), Core.Function.bind3(function (sAid) {
                        new App.unsetTopArticle(sAid, {
                            callback: Core.Function.bind3(function () {
                                Core.Function.bind3(this.reload, this, [this.size, null, true])();
                                App.articleListComponentSynchronize.synchronize(this.compId, this.articleSort);
                            }, this)
                        });
                    }, this, [aid]));
                }
                if ($E("h_" + this.compId + "_" + aid)) {
                    Core.Events.addEvent($E("h_" + this.compId + "_" + aid), Core.Function.bind3(function (sAid) {
                        new App.articleHide(sAid, {
                            callback: Core.Function.bind3(function () {
                                Core.Function.bind3(this.reload, this, [this.size, null, true])();
                                App.articleListComponentSynchronize.synchronize(this.compId, this.articleSort);
                            }, this)
                        });
                    }, this, [aid]));
                }
            }
            if (isShowSlide) {
                var slideData = this.getSummaryPics(aid);
                slideData && sildeBoxData.push(slideData);
            }
        }, this));
//      sildeBoxData = [{
//            blogId : '78129317010127qb'
//            ,link  : 'http://blog.sina.com.cn/s/blog_78129317010127qb.html'
//            ,title : '[转载]【实拍】湖南隆回高平镇暴雨过后 损失严重'
//            ,imgs : [$E('image_operate_46401342582123072')]
//            ,publishTime : '2012-09-05 18:32'
//            
//        }]
        if (isShowSlide) {
            App.bindSlideEvent(sildeBoxData, $E("module_" + this.compId));
        }
    }
    // 将评论、阅读、转载数写入页面。新增收藏数——modified by gaolei 2013-4-1
    , "renderNumber": function (oData) {
        Core.Array.foreach(this.currentArticleList, Core.Function.bind2(function (oItem) {
            if (oData[oItem] != null) {
                // 写阅读数
                if ($E("r_" + this.compId + "_" + oItem) != null) {
                    $E("r_" + this.compId + "_" + oItem).nextSibling.nodeValue = '(' + (oData[oItem].r || 0) + ') ┆ ';
                }
                // 写评论数
                if ($E("c_" + this.compId + "_" + oItem) != null) {
                    $E("c_" + this.compId + "_" + oItem).nextSibling.nodeValue = '(' + (oData[oItem].c || 0) + ') ┆ ';

                }
                // 写转载数
                if ($E("z_" + this.compId + "_" + oItem) != null) {
                    $E("z_" + this.compId + "_" + oItem).innerHTML = '(' + (oData[oItem].z || 0) + ')';
                }

                // 写收藏数
                if ($E("f_" + this.compId + "_" + oItem) != null) {
                    // 收藏数后面可能有其他类型的数据，需要手动加┆， 虽然没测试到，还是照常还原吧 modified by gaolei2 2013-4-1
                    var splitChar = '';
                    if ($_GLOBAL.diggerOpenFlag && $E("digg_list_" + this.compId + "_" + oItem)) {
                        splitChar = '┆ ';
                    }
                    $E("f_" + this.compId + "_" + oItem).nextSibling.nodeValue = '(' + (oData[oItem].f || 0) + ')' + splitChar;
                }
            }
        }, this));
    }

    /*
     * 从分页节点中获取当前组件的总文章数，以便分页使用
     */, "getSortInfo": function () {
        this.count = $E("pagination_" + this.compId).getAttribute("total") * 1;
        this.showPagination();
    }
    /*
     * 显示分页节点
     */, "showPagination": function () {
        var pagesize = $E('pagination_' + this.compId).getAttribute('pagesize') || 10;
        var maxPage = Math.ceil(this.count / pagesize);
        var curPage = this.currentPage;
        if (maxPage > 1) {
            Ui.Pagination.init({
                "pageNode": "pagination_" + this.compId,			// 用于写入分页的节点,class="XX_page"的div
                "nodeClassNamePrefix": "SG",						// CSS 样式前缀
                "curPage": curPage,								// 当前页码
                "maxPage": maxPage,								// 最大页码数
                "showLastPage": false,								// 不显示最后页按钮
                "showTotal": true,									// 显示总页数
                "pageTpl": Core.Function.bind2(this.goPage, this)	// 跳转的页面规则
            }).show();
            var paging = $E('pagination_' + this.compId);
            var liObj = paging.children[0].getElementsByTagName('li');
            Core.Array.foreach(liObj, function (item) {
                item.onclick = function () {
                    Lib.sendSuda(function () {
                        try {
                            //2013.4.12 suda代码修改
                            //S_pSt()函数不再使用, 如果需要统计动态加载等调用SUDA.log()
                            SUDA.log("", "blog_blogger_page");
                        } catch (e) {
                        }
                    });
                    Lib.diYuanXinLog(function () {
                        try {
                            vjEventTrack("");
                        } catch (e) {
                        }
                    });
                }
            });
        } else {
            $E("pagination_" + this.compId).style.display = "none";
        }
    }

    /*
     * 跳到指定的页码
     */, "goPage": function (nPage) {
        this.currentPage = nPage;
        this.load(nPage);
        $E("module_" + this.compId).scrollIntoView(true);
    }
    /*
     * 重新加载博文列表组件
     * @param {Number}	sSize			按什么尺寸重载
     * @param {Boolean}	bAddManage		是否需要加管理链接
     * @param {Boolean}	bForceRequest	是否强制刷新
     */, "reload": function (sSize, bAddManage, bForceRequest) {
        var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
        if (!sizeCorrect) {
            Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
            return;
        }
        this.size = sSize || this.size;
        if (this.size == 210) {
            this.currentPage = 1;
        }
        this.isSetOn = null;
        if (bForceRequest == true || this.cacheData == null) {
            this.load(this.currentPage);
        } else {
            this["render_" + this.size]();
        }
    }
    /**
     * 获取博文摘要的图片
     *
     * @param {String}    aid    文章的ID
     */, "getSummaryPics": function (aid) {
        var titleId = "t_" + this.compId + "_" + aid;
        var titleEl = $E(titleId);
        if (!titleEl) {
            return null;
        }
        var linkEl = titleEl.children[0];
        var link = linkEl.href;
        var title = linkEl.firstChild.nodeValue;
        var $byClz = Core.Dom.getChildrenByClass, $nextNode = Core.Dom.nextNode;

        var blogTitleHeaderEl = titleEl.parentNode;
        //var isImg = $byClz(blogTitleHeaderEl, 'SG_icon SG_icon18')[0];
        // 不是带图片博文直接返回空
        //if (!isImg){
        //    return null;
        //}

        var publishTimeEl = $byClz(blogTitleHeaderEl, 'time SG_txtc')[0];
        var publishTime = publishTimeEl.childNodes[0].nodeValue.replace(/\(|\)/g, '')

        var tagEl = $nextNode(blogTitleHeaderEl);
        if (!tagEl) {
            return null;
        }
        // 获取内容图片
        var contentEl = $nextNode(tagEl);
        var imgs = $T(contentEl, 'img');
        // 有事带图片的博文也不会有图片
        if (0 === imgs.length) {
            return null;
        }
        var data = {
            blogId: aid, link: link, title: title, imgs: imgs, publishTime: publishTime
        };
        return data;
    }
}, "dynamic");
