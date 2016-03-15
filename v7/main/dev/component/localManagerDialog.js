/**
 * @fileoverview 地图组件 地理信息管理对话框
 * @author Luo Rui 2010/3/12
 */

/** 初始化地理信息管理对话框 */
$import("lib/dialogConfig.js");
$import("lib/showError.js");

$import("sina/core/math/getUniqueId.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/shorten.js");

var LocalManagerDialog = Core.Class.create();
LocalManagerDialog.prototype = {
    "interfaceLoadCate": App.getArticlesSort, "interfaceLoadList": new Interface('http://control.blog.sina.com.cn/riaapi/photoblog/get_blog_list_by_page_class.php', 'jsload'), "interfaceSave": new Interface('http://control.blog.sina.com.cn/riaapi/photoblog/set_blogs_places.php', 'ijax'), "saveData": {}, "pageSize": 10, "dialog": null, "initialize": function (action) {
        this.action = action || false;
    }, "show": function () {
        this.initDialog();
        this.dialog.show();
        this.dialog.setFixed(true);
        this.dialog.setAreaLocked(true);
        this.dialog.setMiddle();
    }
    /**
     * 初始化对话框
     */, "initDialog": function () {
        var _this = this;
        var data = {
            width: 0,
            height: 0
        };
        this.id = Core.Math.getUniqueId();
        var temp = new Ui.Template("<div style='width: #{width}px; height: #{height}px;' id='map_" + this.id + "'></div>");
        var obj = {
            ad: false,
            drag: true,
            title: "地理信息管理",
            content: temp.evaluate(data),
            shadow: 1,
            width: data.width,
            height: data.height
        };
        var dialog = winDialog.createCustomsDialog(obj);
        if (!this.dialog) {
            this.dialog = dialog;
            $E("map_" + this.id).innerHTML = this.tpl;
            // 关闭对话框的操作
            this.dialog.nodes['btnClose'].href = "javascript:;";
            this.dialog.nodes['btnClose'].onclick = function () {
                _this.closeConfirm();
            };
            //保存按钮
            Core.Events.addEvent($E('comp_10007_saveBtn'), function () {
                _this.save();
            });
            //取消按钮
            Core.Events.addEvent($E('comp_10007_cancelBtn'), function () {
                _this.closeConfirm();
                _this.dialog.close();
            });
            //分类下拉列表
            Core.Events.addEvent($E('comp_10007_selectCate'), function () {
                _this.loadPhotoBlogList(1);
            }.bind2(this), 'change');
        }
        _this.loadCate(function () {
            _this.loadPhotoBlogList(1, null, true);
        });
    }
    /**
     * 关闭确认
     */, "closeConfirm": function () {
        var _this = this;
        if (this.getSaveDataCount() > 0) {
            winDialog.confirm("是否保存此更改？", {
                funcOk: function () {
                    _this.save();
                },
                funcCancel: function () {
                },
                funcClose: function () {
                },
                textOk: "是",
                textCancel: "否"
            });
        } else {
            this.dialog.close();
        }
    }
    /**
     * 读取并显示分类
     */, "loadCate": function (functionCB) {
        var _this = this;
        _this.interfaceLoadCate(function (oData) {
            if (functionCB) functionCB();
            var selectCate = $E('comp_10007_selectCate');
            _this.cateInfo = oData;
            _this.countInfo = {};
            selectCate.options.length = 0;
            selectCate.options.add(new Option('全部博文(' + oData.total + ')', ''));
            _this.countInfo[0] = oData.total;
            for (var n = 0, m = oData.data.length, datai; n < m; n++) {
                datai = oData.data[n];
                selectCate.options.add(new Option(datai.name + '(' + datai.count + ')', datai.id));
                _this.countInfo[n + 1] = datai.count;
            }
        });

    }
    /**
     * 显示图片博文列表
     * @param {Integer} page
     */, "loadPhotoBlogList": function (page, showTips, setMiddle) {
        var _this = this;
        _this.clearPhotoBlogList();
        _this.saveData = {};
        _this.hideTips();
        _this.interfaceLoadList.request({
            GET: {
                'uid': scope.$uid,
                'page': page,
                'size': _this.pageSize,
                'class': $E('comp_10007_selectCate').value
            }, onSuccess: function (oData) {
                var selectCate = $E('comp_10007_selectCate');
                var pbList = $E('comp_10007_photoBlogList');
                var htmlStr = '';
                var maxPage = Math.ceil(_this.countInfo[selectCate.selectedIndex] / _this.pageSize);
                _this.maxPage = maxPage;
                for (var n = 0, m = oData.length; n < m; n++) {
                    var _d = oData[n];
                    var htmlSelect = _this.selectTpl.format(_d.blog_id, _d.blog_id, _d.blog_id, "onchange = \"localManagerDialog.changeNation('" + _d.blog_id + "', this.value);\"", "onchange = \"localManagerDialog.changeProvince('" + _d.blog_id + "', this.value);\"", "onchange = \"localManagerDialog.changeCity('" + _d.blog_id + "', this.value);\"");
                    var url = 'http://blog.sina.com.cn/s/blog_' + _d.blog_id + '.html';
                    var is_photo = _d.if_photo ? '<span class="atc_ic_b"><img width="15" height="15" align="absmiddle" title="此博文包含图片" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon18"></span>' : '';
                    var str_hover = 'onmouseover="this.className=\'mapLayer_cell SG_j_linedot1 mapLayer_hover\'" ' + 'onmouseout="this.className=\'mapLayer_cell SG_j_linedot1\'" ';
                    htmlStr += _this.itemTpl.format(Core.String.shorten(_d.title, 50, ''), _d.blog_id, _d.blog_id, htmlSelect, url, _d.suggest, is_photo, str_hover);
                }
                if (!htmlStr) {
                    var _tmp = '';
                    if ($E('comp_10007_selectCate').value == '') {
                        _tmp = '暂无博文';
                    } else {
                        _tmp = '暂无博文';
                    }
                    htmlStr = '<div style="text-align:center;padding:10px">{0}</div>'.format(_tmp);
                }
                pbList.innerHTML = htmlStr;
                _this.clearSaveData();
                for (var n = 0, m = oData.length; n < m; n++) {
                    if (oData[n].nation == 1) { //国内
                        _this.reappear(oData[n], 1); //重现下拉列表, 1表示国内
                    } else if (oData[n].nation > 1) {
                        _this.reappear(oData[n], 2); //重现下拉列表, 2表示国外
                    } else {
                        _this.changeNation(oData[n].blog_id, -1, true);
                    }
                }
                if (maxPage > 1) { //有翻页则渲染
                    $E('comp_10007_set_page').style.display = 'block';
                    Ui.Pagination.init({
                        "pageNode": "comp_10007_set_page",
                        "nodeClassNamePrefix": "SG",
                        "curPage": page, // 当前所在页码
                        "maxPage": maxPage, //最大页数
                        "pageTpl": function (page) {
                            if (_this.getSaveDataCount() > 0) {
                                winDialog.confirm('是否保存设置？ ', {
                                    funcOk: function () {
                                        _this.save(function () {
                                            _this.loadPhotoBlogList(page, _this.getSaveDataCount() > 0 ? true : false);
                                        });
                                    },
                                    funcCancel: function () {
                                        _this.loadPhotoBlogList(page, _this.getSaveDataCount() > 0 ? true : false);
                                    }
                                });
                            } else {
                                _this.loadPhotoBlogList(page, _this.getSaveDataCount() > 0 ? true : false);
                            }
                        }
                    }).show();
                } else { //隐藏翻页
                    $E('comp_10007_set_page').innerHTML = '';
                    $E('comp_10007_set_page').style.display = 'none';
                }
                if (showTips) {
                    _this.showTips();
                } else {
                    _this.hideTips();
                }
                if (setMiddle) {
                    _this.dialog.setMiddle();
                }
            }, onError: function (data) {
                $E('comp_10007_photoBlogList').innerHTML = '<div style="text-align:center" style="padding:10px">载入博文列表失败， 囧rz。</div>';
                $E('comp_10007_set_page').style.display = 'none';
            }, onFail: function (data) {
                $E('comp_10007_photoBlogList').innerHTML = '<div style="text-align:center" style="padding:10px">载入博文列表失败， 囧rz。</div>';
                $E('comp_10007_set_page').style.display = 'none';
            }
        });
    }
    /**
     * 重现下拉列表
     */, "reappear": function (oData, type) {
        if (type == 1) {
            $E('nation_' + oData.blog_id).selectedIndex = 1; //选择了国内
            this.changeNation(oData.blog_id, 0, true);
            var opt = $E('province_' + oData.blog_id).options;
            for (var i = 0, j = opt.length; i < j; i++) {
                if (opt[i].value == oData.province) {
                    $E('province_' + oData.blog_id).selectedIndex = i;
                }
                ;
            }
            this.changeProvince(oData.blog_id, oData.province, true);
            var opt = $E('city_' + oData.blog_id).options;
            for (var i = 0, j = opt.length; i < j; i++) {
                if (opt[i].value == oData.city) {
                    $E('city_' + oData.blog_id).selectedIndex = i;
                }
                ;
            }
        } else if (type == 2) {
            $E('nation_' + oData.blog_id).selectedIndex = 2; //选择了国外
            this.changeNation(oData.blog_id, 1, true);
            var opt = $E('province_' + oData.blog_id).options;
            for (var i = 0, j = opt.length; i < j; i++) {
                if (opt[i].value == oData.nation) {
                    $E('province_' + oData.blog_id).selectedIndex = i;
                }
                ;
            }
        }
    }
    /**
     * 清除当前图片博文列表
     */, "clearPhotoBlogList": function () {
        $E('comp_10007_photoBlogList').innerHTML = '<div class="topbar_loading" style="height:370px"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif" />加载中…</div>';
    }
    /**
     * 改变国内或国外
     * @param {String} blog_id
     * @param {Integer} val
     */, "changeNation": function (blog_id, val, noSave) {
        if (val == 1) { //如果是国外
            $E('city_' + blog_id).style.display = 'none';
            //$E('city_' + blog_id).style.visibility = 'hidden';
            this.refreshNation(blog_id); //刷新国外国家列表
            $E('province_' + blog_id).disabled = '';
            $E('province_' + blog_id).className = 'm_w4';
            $E('city_' + blog_id).disabled = '';
            delete this.saveData[blog_id];
        } else if (val == 0) { //国内
            $E('city_' + blog_id).style.display = '';
            //$E('city_' + blog_id).style.visibility = 'visible';
            this.refreshProvince(blog_id); //刷新国内省份列表
            this.refreshCity(blog_id); //刷新城区列表
            $E('province_' + blog_id).disabled = '';
            $E('province_' + blog_id).className = 'm_w2';
            delete this.saveData[blog_id];
        } else { //没有选择
            this.refreshProvince(blog_id); //刷新国内省份列表
            this.refreshCity(blog_id); //刷新城区列表
            $E('province_' + blog_id).disabled = 'disabled';
            $E('province_' + blog_id).className = 'm_w2';
            $E('city_' + blog_id).disabled = 'disabled';
            $E('city_' + blog_id).style.display = '';
            if (!noSave) {
                this.saveData[blog_id] = {
                    nation: '0',
                    province: '0',
                    city: '0'
                }
                //this.showTips();
            } else {
                delete this.saveData[blog_id];
            }
        }

    }
    /**
     * 改变省份(或者国外国家)
     * @param {String} blog_id
     * @param {Integer} val
     */, "changeProvince": function (blog_id, val, noSave) {
        this.refreshCity(blog_id);
        if ($E('nation_' + blog_id).value == 0) { //国内
            if (!noSave) {
                if ($E('province_' + blog_id).value == 0) {
                    delete this.saveData[blog_id];
                } else {
                    this.saveData[blog_id] = {
                        nation: '1',
                        province: val,
                        city: '0'
                    }
                }
                //this.showTips();
            }
        } else if ($E('nation_' + blog_id).value == 1) { //国外
            if (!noSave) {
                if ($E('province_' + blog_id).value == 0) {
                    delete this.saveData[blog_id];
                } else {
                    this.saveData[blog_id] = {
                        nation: val,
                        province: '0',
                        city: '0'
                    }
                }
                //this.showTips();
            }
        } else { //没有选择
        }
    }
    /**
     * 改变城市
     * @param {String} blog_id
     * @param {Integer} val
     */, "changeCity": function (blog_id, val, noSave) {
        if (!noSave) {
            this.saveData[blog_id] = {
                nation: '1',
                province: $E('province_' + blog_id).value,
                city: $E('city_' + blog_id).value
            }
            //this.showTips();
        }
    }
    /**
     *  刷新国外国家列表
     * @param {String} blog_id
     */, "refreshNation": function (blog_id) {
        var opt = $E('province_' + blog_id).options;
        opt.length = 0;
        opt.add(new Option('请选择', 0));
        for (var n = 2, m = 226; n <= m; n++) {
            opt.add(new Option(this.worldMap[n], n));
        }
    }
    /**
     * 刷新国内省份列表
     * @param {String} blog_id
     */, "refreshProvince": function (blog_id) {
        var opt = $E('province_' + blog_id).options;
        opt.length = 0;
        opt.add(new Option('请选择', 0));
        for (var n = 1, m = 34; n <= m; n++) {
            opt.add(new Option(this.chinaMap[n].pro, n));
        }
    }
    /**
     * 刷新城区列表
     * @param {String} blog_id
     */, "refreshCity": function (blog_id) {
        var province = $E('province_' + blog_id).value;
        var nation = $E('nation_' + blog_id).value;
        var opt = $E('city_' + blog_id).options;
        opt.length = 0;
        opt.add(new Option('请选择', 0));
        $E('city_' + blog_id).disabled = 'disabled';
        if (nation == 0 && province > 0) {
            var sub = this.chinaMap[province].sub;
            for (var n = 1, m = this.chinaMap[province].subCount; n <= m; n++) {
                opt.add(new Option(sub[n], n));
            }
            $E('city_' + blog_id).disabled = '';
        }
    }
    /**
     * 保存地理信息
     */, "save": function (func) {
        var _this = this;
        var count = -1;
        var tmpObj = {};
        for (var e in this.saveData) {
            count++;
            tmpObj['blog_id_' + count] = e;
            tmpObj['nation_' + count] = this.saveData[e].nation;
            tmpObj['province_' + count] = this.saveData[e].province;
            tmpObj['city_' + count] = this.saveData[e].city;
        }
        if (count < 0) {
            _this.dialog.close();
            return;
        }
        tmpObj.cnt = count + 1;
        this.interfaceSave.request({
            GET: {
                uid: scope.$uid
            },
            POST: tmpObj,
            onSuccess: function (oData) {
                _this.clearSaveData();
                _this.hideTips();
                Lib.Component.instances[10007].load();
                winDialog.alert("保存成功！", {
                    funcOk: function () {
                        if (typeof func == 'function') {
                            func();
                        }
                    },
                    icon: "03"
                }, "tips");
            },
            onError: function (oData) {
                showError(oData.code);
            },
            onFail: function (oData) {
                showError('A00001');
            }
        });
    }
    /**
     * 清除要保存的数据
     */, "clearSaveData": function () {
        for (var e in this.saveData) {
            delete this.saveData[e];
        }
    }
    /**
     * 返回要保存的数据的条数
     */, "getSaveDataCount": function () {
        var count = 0;
        for (var e in this.saveData) {
            count++;
        }
        return count;
    }, "showTips": function (str) {
        return; //需求变更
        var tips = $E('comp_10007_tips');
        tips.style.display = 'block';
        if (!str && this.maxPage <= 1) {
            tips.style.display = 'none';
            return;
        }
        tips.innerHTML = str || "我们建议你先点击保存设置，再翻页";
    }, "hideTips": function () {
        return; //需求变更
        var tips = $E('comp_10007_tips');
        tips.style.display = 'none';
        tips.innerHTML = "";
    }, "tpl": '<div style="width: 750px;" class="CP_layercon6">' + '<div class="mapLayer">' + '<div class="mapLayer_top SG_j_line1">' + '<div class="sort">' + '<span>分类：</span>' + '<select id="comp_10007_selectCate"><option>加载中…</option></select>' + '</div>' + '<span class="tip">*为必填项</span>' + '<div class="clearit"></div>' + '</div>' + '<div class="mapLayer_main">' + '<div class="mapLayer_list" id="comp_10007_photoBlogList" style="height:384px">' + '</div>' + '<div id="comp_10007_tips" style="text-align:right;color:#C00;padding-top:10px;overflow:hidden;height:0;display:none">' + '</div>' + '<div id="comp_10007_set_page" class="SG_page">' + '</div>' + '<div class="mapLayer_btn">' + '<a class="SG_aBtn SG_aBtnB" href="#" id="comp_10007_saveBtn" onclick="return false"><cite>保存设置</cite></a>' + '<a class="SG_aBtn SG_aBtnB" href="#" id="comp_10007_cancelBtn" onclick="return false"><cite>关闭窗口</cite></a>' + '</div>' + '</div>' + '</div>' + '</div>', "itemTpl": '<div class="mapLayer_cell SG_j_linedot1" {7}>' + '<p class="mapLayer_nm SG_dot">{5}<a href="{4}" target="_blank">{0}</a>{6}</p>' + '<p class="mapLayer_opt" id="comp_10007_set_{1}" blog_id="{2}">{3}</p>' + '<div class="clearit"></div>' + '</div>', "selectTpl": '<em>*</em> ' + '<select class="m_w1" id="nation_{0}" {3}><option value="-1">请选择</option><option value="0">国内</option><option value="1">国外</option></select> ' + '<em>*</em> ' + '<select class="m_w2" id="province_{1}" {4}><option value="0">请选择</option></select> ' + '<select class="m_w3" id="city_{2}" {5}><option value="0">请选择</option></select>', "chinaMap": {
        1: {
            'pro': '北京',
            'py': 'beijing',
            'subCount': 18,
            'sub': {
                1: '昌平区',
                2: '朝阳区',
                3: '崇文区',
                4: '大兴区',
                5: '东城区',
                6: '房山区',
                7: '丰台区',
                8: '海淀区',
                9: '怀柔区',
                10: '门头沟区',
                11: '密云县',
                12: '平谷区',
                13: '石景山区',
                14: '顺义区',
                15: '通州区',
                16: '西城区',
                17: '宣武区',
                18: '延庆县'
            }
        },
        2: {
            'pro': '上海',
            'py': 'shanghai',
            'subCount': 19,
            'sub': {
                1: '宝山区',
                2: '长宁区',
                3: '崇明县',
                4: '奉贤区',
                5: '虹口区',
                6: '黄浦区',
                7: '嘉定区',
                8: '金山区',
                9: '静安区',
                10: '卢湾区',
                11: '南汇区',
                12: '普陀区',
                13: '浦东新区',
                14: '青浦区',
                15: '松江区',
                16: '徐汇区',
                17: '杨浦区',
                18: '闸北区',
                19: '闵行区'
            }
        },
        3: {
            'pro': '天津',
            'py': 'tianjin',
            'subCount': 18,
            'sub': {
                1: '宝坻区',
                2: '北辰区',
                3: '大港区',
                4: '东丽区',
                5: '汉沽区',
                6: '和平区',
                7: '河北区',
                8: '河东区',
                9: '河西区',
                10: '红桥区',
                11: '蓟县',
                12: '津南区',
                13: '静海县',
                14: '南开区',
                15: '宁河县',
                16: '塘沽区',
                17: '武清区',
                18: '西青区'
            }
        },
        4: {
            'pro': '重庆',
            'py': 'zhongqing',
            'subCount': 30,
            'sub': {
                1: '巴南区',
                2: '长寿区',
                3: '城口县',
                4: '大足县',
                5: '垫江县',
                6: '丰都县',
                7: '奉节县',
                8: '涪陵区',
                9: '合川区',
                10: '江津区',
                11: '开县',
                12: '梁平县',
                13: '南川区',
                14: '彭水苗族土家族自治县',
                15: '黔江区',
                16: '荣昌县',
                17: '石柱土家族自治县',
                18: '铜梁县',
                19: '万州区',
                20: '巫山县',
                21: '巫溪县',
                22: '武隆县',
                23: '秀山土家族苗族自治县',
                24: '永川区',
                25: '酉阳土家族苗族自治县',
                26: '云阳县',
                27: '忠县',
                28: '潼南县',
                29: '璧山县',
                30: '綦江县'
            }
        },
        5: {
            'pro': '河北',
            'py': 'hebei',
            'subCount': 11,
            'sub': {
                1: '保定市',
                2: '沧州市',
                3: '承德市',
                4: '邯郸市',
                5: '衡水市',
                6: '廊坊市',
                7: '秦皇岛市',
                8: '石家庄市',
                9: '唐山市',
                10: '邢台市',
                11: '张家口市'
            }
        },
        6: {
            'pro': '山西',
            'py': 'shanxi',
            'subCount': 11,
            'sub': {
                1: '长治市',
                2: '大同市',
                3: '晋城市',
                4: '晋中市',
                5: '临汾市',
                6: '吕梁市',
                7: '朔州市',
                8: '太原市',
                9: '忻州市',
                10: '阳泉市',
                11: '运城市'
            }
        },
        7: {
            'pro': '辽宁',
            'py': 'liaoning',
            'subCount': 13,
            'sub': {
                1: '鞍山市',
                2: '本溪市',
                3: '朝阳市',
                4: '大连市',
                5: '丹东市',
                6: '抚顺市',
                7: '阜新市',
                8: '锦州市',
                9: '辽阳市',
                10: '盘锦市',
                11: '沈阳市',
                12: '铁岭市',
                13: '兴城市'
            }
        },
        8: {
            'pro': '吉林',
            'py': 'jilin',
            'subCount': 8,
            'sub': {
                1: '白城市',
                2: '长白山市',
                3: '长春市',
                4: '吉林市',
                5: '四平市',
                6: '松原市',
                7: '通化市',
                8: '延边市'
            }
        },
        9: {
            'pro': '黑龙江',
            'py': 'heilongjiang',
            'subCount': 12,
            'sub': {
                1: '大庆市',
                2: '哈尔滨市',
                3: '鹤岗市',
                4: '黑河市',
                5: '鸡西市',
                6: '佳木斯',
                7: '牡丹江市',
                8: '七台河市',
                9: '齐齐哈尔市',
                10: '双鸭山市',
                11: '绥化市',
                12: '伊春市'
            }
        },
        10: {
            'pro': '江苏',
            'py': 'jiangsu',
            'subCount': 13,
            'sub': {
                1: '常州市',
                2: '淮安市',
                3: '连云港市',
                4: '南京市',
                5: '南通市',
                6: '苏州市',
                7: '宿迁市',
                8: '泰州市',
                9: '无锡市',
                10: '徐州市',
                11: '盐城市',
                12: '扬州市',
                13: '镇江市'
            }
        },
        11: {
            'pro': '浙江',
            'py': 'zhejiang',
            'subCount': 11,
            'sub': {
                1: '杭州市',
                2: '湖州市',
                3: '嘉兴市',
                4: '金华市',
                5: '丽水市',
                6: '宁波市',
                7: '绍兴市',
                8: '台州市',
                9: '温州市',
                10: '舟山市',
                11: '衢州市'
            }
        },
        12: {
            'pro': '安徽',
            'py': 'anhui',
            'subCount': 17,
            'sub': {
                1: '安庆市',
                2: '蚌埠市',
                3: '巢湖市',
                4: '池州市',
                5: '滁州市',
                6: '阜阳市',
                7: '毫州市',
                8: '合肥市',
                9: '淮北市',
                10: '淮南市',
                11: '黄山市',
                12: '六安市',
                13: '马鞍山市',
                14: '宿州市',
                15: '铜陵市',
                16: '芜湖市',
                17: '宣城市'
            }
        },
        13: {
            'pro': '福建',
            'py': 'fujian',
            'subCount': 9,
            'sub': {
                1: '福州市',
                2: '龙岩市',
                3: '南平市',
                4: '宁德市',
                5: '莆田市',
                6: '泉州市',
                7: '三明市',
                8: '厦门市',
                9: '漳州市'
            }
        },
        14: {
            'pro': '江西',
            'py': 'jiangxi',
            'subCount': 11,
            'sub': {
                1: '抚州市',
                2: '赣州市',
                3: '吉安市',
                4: '景德镇市',
                5: '九江市',
                6: '南昌市',
                7: '萍乡市',
                8: '上饶市',
                9: '新余市',
                10: '宜春市',
                11: '鹰潭市'
            }
        },
        15: {
            'pro': '山东',
            'py': 'shandong',
            'subCount': 17,
            'sub': {
                1: '滨州市',
                2: '德州市',
                3: '东营市',
                4: '菏泽市',
                5: '济南市',
                6: '济宁市',
                7: '莱芜市',
                8: '聊城市',
                9: '临沂市',
                10: '青岛市',
                11: '日照市',
                12: '泰安市',
                13: '威海市',
                14: '潍坊市',
                15: '烟台市',
                16: '枣庄市',
                17: '淄博市'
            }
        },
        16: {
            'pro': '河南',
            'py': 'henan',
            'subCount': 18,
            'sub': {
                1: '安阳市',
                2: '鹤壁市',
                3: '济源市',
                4: '焦作市',
                5: '开封市',
                6: '洛阳市',
                7: '南阳市',
                8: '平顶山市',
                9: '三门峡市',
                10: '商丘市',
                11: '新乡市',
                12: '信阳市',
                13: '许昌市',
                14: '郑州市',
                15: '周口市',
                16: '驻马店市',
                17: '漯河市',
                18: '濮阳市'
            }
        },
        17: {
            'pro': '湖北',
            'py': 'hubei',
            'subCount': 16,
            'sub': {
                1: '鄂州市',
                2: '恩施州',
                3: '黄冈市',
                4: '黄石市',
                5: '荆门市',
                6: '荆州市',
                7: '潜江市',
                8: '十堰市',
                9: '随州市',
                10: '天门市',
                11: '武汉市',
                12: '仙桃市',
                13: '咸宁市',
                14: '襄樊市',
                15: '孝感市',
                16: '宜昌市'
            }
        },
        18: {
            'pro': '湖南',
            'py': 'hunan',
            'subCount': 14,
            'sub': {
                1: '常德市',
                2: '长沙市',
                3: '郴州市',
                4: '衡阳市',
                5: '怀化市',
                6: '娄底市',
                7: '邵阳市',
                8: '湘潭市',
                9: '湘西州',
                10: '益阳市',
                11: '永州市',
                12: '岳阳市',
                13: '张家界市',
                14: '株洲市'
            }
        },
        19: {
            'pro': '广东',
            'py': 'guangdong',
            'subCount': 21,
            'sub': {
                1: '潮州市',
                2: '东莞市',
                3: '佛山市',
                4: '广州市',
                5: '河源市',
                6: '惠州市',
                7: '江门市',
                8: '揭阳市',
                9: '茂名市',
                10: '梅州市',
                11: '清远市',
                12: '汕头市',
                13: '汕尾市',
                14: '韶关市',
                15: '深圳市',
                16: '阳江市',
                17: '云浮市',
                18: '湛江市',
                19: '肇庆市',
                20: '中山市',
                21: '珠海市'
            }
        },
        20: {
            'pro': '海南',
            'py': 'hainan',
            'subCount': 9,
            'sub': {
                1: '东方市',
                2: '海口市',
                3: '琼海市',
                4: '琼山市',
                5: '三亚市',
                6: '万宁市',
                7: '文昌市',
                8: '五指山市',
                9: '儋州市'
            }
        },
        21: {
            'pro': '四川',
            'py': 'sichuan',
            'subCount': 21,
            'sub': {
                1: '阿坝州',
                2: '巴中市',
                3: '成都市',
                4: '达州市',
                5: '德阳市',
                6: '甘孜州',
                7: '广安市',
                8: '广元市',
                9: '乐山市',
                10: '凉山州',
                11: '眉山市',
                12: '绵阳市',
                13: '南充市',
                14: '内江市',
                15: '攀枝花市',
                16: '遂宁市',
                17: '雅安市',
                18: '宜宾市',
                19: '资阳市',
                20: '自贡市',
                21: '泸州市'
            }
        },
        22: {
            'pro': '贵州',
            'py': 'guizhou',
            'subCount': 9,
            'sub': {
                1: '安顺市',
                2: '毕节',
                3: '贵阳市',
                4: '六盘水市',
                5: '黔东南州',
                6: '黔南州',
                7: '黔西南州',
                8: '铜仁',
                9: '遵义市'
            }
        },
        23: {
            'pro': '云南',
            'py': 'yunnan',
            'subCount': 16,
            'sub': {
                1: '保山市',
                2: '楚雄州',
                3: '大理州',
                4: '德宏州',
                5: '迪庆州',
                6: '红河州',
                7: '昆明市',
                8: '丽江',
                9: '临沧',
                10: '怒江州',
                11: '普洱市',
                12: '曲靖市',
                13: '文山州',
                14: '西双版纳州',
                15: '玉溪市',
                16: '昭通市'
            }
        },
        24: {
            'pro': '陕西',
            'py': 'shaanxi',
            'subCount': 10,
            'sub': {
                1: '安康市',
                2: '宝鸡市',
                3: '汉中市',
                4: '商洛市',
                5: '铜川市',
                6: '渭南市',
                7: '西安市',
                8: '咸阳市',
                9: '延安市',
                10: '榆林市'
            }
        },
        25: {
            'pro': '甘肃',
            'py': 'gansu',
            'subCount': 13,
            'sub': {
                1: '白银市',
                2: '定西地区',
                3: '甘南州',
                4: '嘉峪关市',
                5: '酒泉市',
                6: '兰州市',
                7: '临夏回族自治州',
                8: '陇南地区',
                9: '平凉市',
                10: '庆阳市',
                11: '天水市',
                12: '武威市',
                13: '张掖市'
            }
        },
        26: {
            'pro': '青海',
            'py': 'qinghai',
            'subCount': 7,
            'sub': {
                1: '果洛州',
                2: '海北州',
                3: '海东',
                4: '海南州',
                5: '海西州',
                6: '西宁市',
                7: '玉树州'
            }
        },
        27: {
            'pro': '内蒙古',
            'py': 'neimenggu',
            'subCount': 12,
            'sub': {
                1: '阿拉善盟',
                2: '巴彦淖尔盟',
                3: '包头市',
                4: '赤峰市',
                5: '鄂尔多斯市',
                6: '呼和浩特市',
                7: '呼伦贝尔市',
                8: '通辽市',
                9: '乌海市',
                10: '乌兰察布盟',
                11: '锡林郭勒盟',
                12: '兴安盟'
            }
        },
        28: {
            'pro': '广西',
            'py': 'guangxi',
            'subCount': 14,
            'sub': {
                1: '百色市',
                2: '北海市',
                3: '崇左市',
                4: '防城港市',
                5: '桂林市',
                6: '贵港市',
                7: '河池市',
                8: '贺州市',
                9: '来宾市',
                10: '柳州市',
                11: '南宁市',
                12: '钦州市',
                13: '梧州市',
                14: '玉林市'
            }
        },
        29: {
            'pro': '西藏',
            'py': 'xicang',
            'subCount': 7,
            'sub': {
                1: '阿里',
                2: '昌都',
                3: '拉萨市',
                4: '林芝',
                5: '那曲',
                6: '日喀则',
                7: '山南'
            }
        },
        30: {
            'pro': '宁夏',
            'py': 'ningxia',
            'subCount': 5,
            'sub': {
                1: '固原市',
                2: '石嘴山市',
                3: '吴忠市',
                4: '银川市',
                5: '中卫'
            }
        },
        31: {
            'pro': '新疆',
            'py': 'xinjiang',
            'subCount': 14,
            'sub': {
                1: '阿克苏',
                2: '阿勒泰州',
                3: '巴音郭楞州',
                4: '博尔塔拉州',
                5: '昌吉州',
                6: '哈密',
                7: '和田',
                8: '喀什',
                9: '克拉玛依市',
                10: '克孜勒苏州',
                11: '石河子市',
                12: '吐鲁番',
                13: '乌鲁木齐市',
                14: '伊犁州'
            }
        },
        32: {
            'pro': '香港',
            'py': 'xianggang',
            'subCount': 12,
            'sub': {
                1: '东区',
                2: '九龙城',
                3: '葵青',
                4: '离岛',
                5: '南区',
                6: '沙田',
                7: '屯门',
                8: '湾仔',
                9: '油尖旺',
                10: '元朗',
                11: '中西区',
                12: '荃湾'
            }
        },
        33: {
            'pro': '澳门',
            'py': 'aomen',
            'subCount': 8,
            'sub': {
                1: '大堂区',
                2: '风顺堂区',
                3: '花地玛堂区',
                4: '嘉模堂区',
                5: '路氹城',
                6: '圣安多尼堂区',
                7: '圣方济各堂区',
                8: '望德堂区'
            }
        },
        34: {
            'pro': '台湾',
            'py': 'taiwan',
            'subCount': 22,
            'sub': {
                1: '板桥市',
                2: '斗六市',
                3: '丰原市',
                4: '凤山市',
                5: '高雄市',
                6: '花莲市',
                7: '基隆市',
                8: '嘉义市',
                9: '苗栗市',
                10: '南投市',
                11: '屏东市',
                12: '台北市',
                13: '台东市',
                14: '台南市',
                15: '台中市',
                16: '太保市',
                17: '桃园市',
                18: '新营市',
                19: '新竹市',
                20: '宜兰市',
                21: '彰化市',
                22: '竹北市'
            }
        }
    }, "worldMap": {
        1: '中国',
        2: '阿尔巴尼亚',
        3: '阿尔及利亚',
        4: '阿富汗',
        5: '阿根廷',
        6: '阿联酋',
        7: '阿鲁巴',
        8: '阿曼',
        9: '阿塞拜疆',
        10: '埃及',
        11: '埃塞俄比亚',
        12: '爱尔兰',
        13: '爱沙尼亚',
        14: '安道尔',
        15: '安哥拉',
        16: '安圭拉',
        17: '安提瓜和巴布达',
        18: '奥地利',
        19: '澳大利亚',
        20: '巴巴多斯',
        21: '巴布亚新几内亚',
        22: '巴哈马',
        23: '巴基斯坦',
        24: '巴拉圭',
        25: '巴勒斯坦',
        26: '巴林',
        27: '巴拿马',
        28: '巴西',
        29: '白俄罗斯',
        30: '百慕大',
        31: '保加利亚',
        32: '北马里亚纳群岛',
        33: '贝宁',
        34: '比利时',
        35: '冰岛',
        36: '玻利维亚',
        37: '波多黎各',
        38: '波黑',
        39: '波兰',
        40: '波斯尼亚和墨塞哥维那',
        41: '博茨瓦纳',
        42: '伯利兹',
        43: '不丹',
        44: '布基纳法索',
        45: '布隆迪',
        46: '朝鲜',
        47: '赤道几内亚',
        48: '丹麦',
        49: '德国',
        50: '东帝汶',
        51: '多哥',
        52: '多米尼加',
        53: '多米尼克',
        54: '俄罗斯',
        55: '厄瓜多尔',
        56: '厄立特里亚',
        57: '法国',
        58: '法罗群岛',
        59: '法属波利尼西亚',
        60: '法属圭亚那',
        61: '梵蒂冈',
        62: '斐济',
        63: '菲律宾',
        64: '芬兰',
        65: '佛得角',
        66: '冈比亚',
        67: '刚果（布）',
        68: '刚果（金）',
        69: '哥伦比亚',
        70: '哥斯达黎加',
        71: '格林纳达',
        72: '格陵兰',
        73: '格鲁吉亚',
        74: '古巴',
        75: '瓜德罗普',
        76: '关岛',
        77: '圭亚那',
        78: '哈萨克斯坦',
        79: '海地',
        80: '韩国',
        81: '荷兰',
        82: '荷属安的列斯',
        83: '黑山',
        84: '洪都拉斯',
        85: '基里巴斯',
        86: '吉布提',
        87: '吉尔吉斯斯坦',
        88: '几内亚',
        89: '几内亚比绍',
        90: '加拿大',
        91: '加那利群岛',
        92: '加纳',
        93: '加蓬',
        94: '柬埔寨',
        95: '捷克',
        96: '津巴布韦',
        97: '喀麦隆',
        98: '卡塔尔',
        99: '开曼群岛',
        100: '科摩罗',
        101: '科特迪瓦',
        102: '科威特',
        103: '克罗地亚',
        104: '肯尼亚',
        105: '库克群岛',
        106: '拉脱维亚',
        107: '莱索托',
        108: '老挝',
        109: '黎巴嫩',
        110: '利比里亚',
        111: '利比亚',
        112: '立陶宛',
        113: '列支敦士登',
        114: '留尼旺',
        115: '卢森堡',
        116: '卢旺达',
        117: '罗马尼亚',
        118: '马达加斯加',
        119: '马德拉群岛',
        120: '马耳他',
        121: '马尔代夫',
        122: '马拉维',
        123: '马来西亚',
        124: '马里',
        125: '马其顿',
        126: '马绍尔群岛',
        127: '马提尼克',
        128: '毛里求斯',
        129: '毛里塔尼亚',
        130: '美国',
        131: '美属萨摩亚',
        132: '美属维尔京群岛',
        133: '蒙古',
        134: '蒙特塞拉特',
        135: '孟加拉国',
        136: '秘鲁',
        137: '密克罗尼西亚',
        138: '缅甸',
        139: '摩尔多瓦',
        140: '摩洛哥',
        141: '摩纳哥',
        142: '莫桑比克',
        143: '墨西哥',
        144: '纳米比亚',
        145: '南非',
        146: '瑙鲁',
        147: '尼泊尔',
        148: '尼加拉瓜',
        149: '尼日尔',
        150: '尼日利亚',
        151: '纽埃',
        152: '挪威',
        153: '帕劳',
        154: '皮特凯恩',
        155: '葡萄牙',
        156: '日本',
        157: '瑞典',
        158: '瑞士',
        159: '萨尔瓦多',
        160: '萨摩亚',
        161: '塞尔维亚',
        162: '塞拉利昂',
        163: '塞内加尔',
        164: '塞浦路斯',
        165: '塞舌尔',
        166: '沙特阿拉伯',
        167: '圣多美和普林西比',
        168: '圣赫勒拿',
        169: '圣基茨和尼维斯',
        170: '圣卢西亚',
        171: '圣马力诺',
        172: '圣文森特和格林纳丁斯',
        173: '斯里兰卡',
        174: '斯洛伐克',
        175: '斯洛文尼亚',
        176: '斯威士兰',
        177: '苏丹',
        178: '苏里南',
        179: '索马里',
        180: '所罗门群岛',
        181: '塔吉克斯坦',
        182: '泰国',
        183: '坦桑尼亚',
        184: '汤加',
        185: '特克斯和凯科斯群岛',
        186: '特立尼达和多巴哥',
        187: '突尼斯',
        188: '图瓦卢',
        189: '土耳其',
        190: '土库曼斯坦',
        191: '托克劳',
        192: '瓦利斯和富图纳',
        193: '瓦努阿图',
        194: '危地马拉',
        195: '委内瑞拉',
        196: '文莱',
        197: '乌干达',
        198: '乌克兰',
        199: '乌拉圭',
        200: '乌兹别克斯坦',
        201: '西班牙',
        202: '西撒哈拉',
        203: '希腊',
        204: '新加坡',
        205: '新喀里多尼亚',
        206: '新西兰',
        207: '匈牙利',
        208: '叙利亚',
        209: '牙买加',
        210: '亚美尼亚',
        211: '亚速尔群岛',
        212: '也门',
        213: '伊拉克',
        214: '伊朗',
        215: '以色列',
        216: '意大利',
        217: '印度',
        218: '印度尼西亚',
        219: '英国',
        220: '英属维尔京群岛',
        221: '约旦',
        222: '越南',
        223: '赞比亚',
        224: '乍得',
        225: '智利',
        226: '中非'
    }
};
