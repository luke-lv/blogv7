/**
 * @fileoverview 个人档案个人经历编辑
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-14
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/system/br.js");

$import("lib/interface.js");
$import("lib/dialogConfig.js");

$import("msg/personal.js");
$import("product/personal/autoComplete.js");
$import("product/personal/common.js");

/**
 * 个人经历静态类
 */
scope.Experience = {
    /**
     * 添加学校信息的link状态
     *            "hidden"
     *            "show"
     */
    addSchoolLinkState: "",

    /**
     * 添加公司信息的link状态
     *            "hidden"
     *            "show"
     */
    addCompanyLinkState: "",

    initialize: function () {
        var me = this;
        var isSubmit = true;
        var schoolIndex = 0;
        var companyIndex = 0;
        var selectAppenderDesc = new scope.personal.SelectAppender(-1);
        var selectAppender = new scope.personal.SelectAppender();

        Core.Events.addEvent($E("addSchool"), appendSchool, "click");
        Core.Events.addEvent($E("addCompany"), appendCompany, "click");

        //绑定没有任何数据的添加按钮的事件
        Core.Events.addEvent($E("linkAddExperience"), showExperienceEditor, "click");

        //保存数据
        Core.Events.addEvent($E("btnExperienceSave"), function () {
            if (isSubmit) {
                saveData();
                return false;
            }
        }, "click");
        //取消编辑
        Core.Events.addEvent($E("btnExperinceCancel"), function () {

            if (isSubmit) {
                //显示"编辑"按钮
                $E("btnEditCareerInfo").parentNode.style.display = "";

                $E("careerInfoRes").style.display = "";
                $E("editCareer").style.display = "none";

                //清除表中显示的数据项
                var i, len;
                len = $E("schoolEditor").rows.length;
                for (i = len - 1; i >= 0; i--) {
                    $E("schoolEditor").deleteRow(i);
                }

                len = $E("companyEditor").rows.length;
                for (i = len - 1; i >= 0; i--) {
                    $E("companyEditor").deleteRow(i);
                }

                //隐藏有历史数据的提示信息
                $E("careerInfoTip").style.display = "none";

                //还原添加学校和添加公司链接的显示状态
                $E("addSchoolPanel").style.display = me.addSchoolLinkState;
                $E("addCompanyPanel").style.display = me.addCompanyLinkState;
            }

        }, "click");

        //显示编辑区域
        Core.Events.addEvent($E("btnEditCareerInfo"), showExperienceEditor, "click");

        //显示编辑区域
        function showExperienceEditor() {
            //隐藏"编辑"按钮
            $E("btnEditCareerInfo").parentNode.style.display = "none";
            //显示Loading
            $E("careerLoading").style.display = "";

            getData();
            return false;
        }

        /*学校信息的相关操作*/

        //添加学校
        function appendSchool() {
            var tr = $E("schoolEditor").insertRow(-1);
            var td1 = tr.insertCell(-1);
            var td2 = tr.insertCell(-1);

            tr.id = "school_" + schoolIndex;

            td1.className = "rolTd1 CP_txta rolSele";
            td2.className = "rolTd2 rolSele";

            td1.innerHTML = $E("schoolEditor").rows.length == 1 ? "学&nbsp;&nbsp;&nbsp;校：" : "";
            td2.innerHTML = '<div class="posSchool"><span class="tdP20">' + '<em>' + '<select disabled="disabled" id="schoolType' + schoolIndex + '" style="width:66px;">' + '<option value="0">大学</option>' + '</select>' + '</em>' + '<em>' + '<input style="color:#999999;" id="schoolName' + schoolIndex + '" type="text" class="personText" value="学校名称"/>' + '<div class="assn_sel" style="left:11110px; top:35px;"></div>' + '</em>' + '<em>' + '<input style="color:#999999;" type="text" id="profession' + schoolIndex + '" class="personText" value="学院/专业"/>' + '</em>' + '<em>' + '<select id="matrDate' + schoolIndex + '" style="width:86px;">' + '<option value="0">入读时间</option>' + '</select>' + '</em>' + '<em class="sameBirth">' + '<a style="display:none;" id="findSchoolmate' + schoolIndex + '" href="javascript:;">找同学&gt;&gt;</a>' + '</em>' + '<em class="personDelete">' + '<a class="CP_a_fuc" href="javascript:;">[<cite id="btnRemoveSchool' + schoolIndex + '">删除</cite>]</a>' + '</em></span>' + '<p style="display:none;" id="msgFindSchoolmate' + schoolIndex + '" class="errorAction addForm">请输入正确的学校名称，才能找到你的同学</p>' + '<p style="display:none;" id="msgSchoolName' + schoolIndex + '" class="errorAction addForm">请输入学校名称</p>' + '<p style="display:none;" id="msgMatrDate' + schoolIndex + '" class="errorAction addForm">请选择入读时间</p>' + '<p style="display:none;" id="msgAddNewSchool' + schoolIndex + '" class="errorAction addForm">未找到该学校，请输入正确的学校名称或<a id="addNewSchool' + schoolIndex + '" href="javascript:;">申请添加该学校</a></p>' + '</div>';

            Utils.Form.limitMaxLen($E("schoolName" + schoolIndex), 40);
            Utils.Form.limitMaxLen($E("profession" + schoolIndex), 40);

            //绑定申请添加学校的事件
            Core.Events.addEvent($E("addNewSchool" + schoolIndex), function (idx) {
                return function () {
                    addNewSchool($E("schoolName" + idx).value);
                    return false;
                };
            }(schoolIndex), "click");

            //绑定"删除"按钮的事件
            Core.Events.addEvent($E("btnRemoveSchool" + schoolIndex), function (idx) {
                return function () {
                    removeSchool(idx);
                };
            }(schoolIndex), "click");

            //如果添加了5条记录则隐藏"添加上学经历"
            if ($E("schoolEditor").rows.length >= 5) {
                showAddSchool(false);
            }

            //初始化"入学时间"下拉列表
            selectAppenderDesc.initialize($E("matrDate" + schoolIndex), 2009, 1950);

            //绑定"学校名称"的事件操作
            Core.Events.addEvent($E("schoolName" + schoolIndex), function (idx) {
                return function () {
                    if ($E("schoolName" + idx).value == "学校名称") {
                        $E("schoolName" + idx).value = "";
                    }

                    //根据文字输入情况改变输入框文字的颜色
                    $E("schoolName" + idx).style.color = "#333333";

                    $E("msgAddNewSchool" + idx).style.display = "none";
                    $E("msgFindSchoolmate" + idx).style.display = "none";
                    $E("msgSchoolName" + idx).style.display = "none";
                };
            }(schoolIndex), "focus");
            Core.Events.addEvent($E("schoolName" + schoolIndex), function (idx) {
                return function () {
                    if ($E("schoolName" + idx).value == "") {
                        $E("schoolName" + idx).value = "学校名称";
                    }

                    //根据文字输入情况改变输入框文字的颜色
                    if ($E("schoolName" + idx).value != "学校名称") {
                        $E("schoolName" + idx).style.color = "#333333";
                    } else {
                        $E("schoolName" + idx).style.color = "#999999";
                    }
                };
            }(schoolIndex), "blur");

            //绑定"学院/专业"的事件操作
            Core.Events.addEvent($E("profession" + schoolIndex), function (idx) {
                return function () {
                    if ($E("profession" + idx).value == "学院/专业") {
                        $E("profession" + idx).value = "";
                    }

                    //根据文字输入情况改变输入框文字的颜色
                    $E("profession" + idx).style.color = "#333333";
                };
            }(schoolIndex), "focus");
            Core.Events.addEvent($E("profession" + schoolIndex), function (idx) {
                return function () {
                    if ($E("profession" + idx).value == "") {
                        $E("profession" + idx).value = "学院/专业";
                    }

                    //根据文字输入情况改变输入框文字的颜色
                    if ($E("profession" + idx).value != "学院/专业") {
                        $E("profession" + idx).style.color = "#333333";
                    } else {
                        $E("profession" + idx).style.color = "#999999";
                    }
                };
            }(schoolIndex), "blur");

            //找绑定"找同学"的事件操作
            Core.Events.addEvent($E("findSchoolmate" + schoolIndex), function (idx) {
                return function () {

                    hiddenSchoolAllMsg();

                    if ($E("schoolName" + idx).value.replace(/\s/g, "") == "学校名称") {
                        $E("msgFindSchoolmate" + idx).style.display = "";
                        $E("findSchoolmate" + idx).href = "javascript:;";
                        $E("findSchoolmate" + idx).target = "";
                    } else {
                        $E("findSchoolmate" + idx).target = "_blank";
                        $E("findSchoolmate" + idx).href = "javascript:alert('" + $E("schoolName" + idx).value + "');";
                    }
                };
            }(schoolIndex), "click");

            //"学校名称"的自动完成/
            var acSchoolName = new scope.autoComplate($E("schoolName" + schoolIndex)
                // Modified by L.Ming 接口地址变更 2009.11.26
//				,'http://icp.cws.api.sina.com.cn/profile/relate_school.php',{
                , 'http://control.blog.sina.com.cn/riaapi/profile/relate_school.php', {
                    'class': 'assn',
                    'style': 'width:193px;',
                    'searchFun': null,
                    'onSearchNullTextShow': function (idx) {
                        return function () {
                            //绑定"申请添加学校"的事件
                            if ($E("acAddNewSchool" + idx)) {
                                Core.Events.addEvent($E("acAddNewSchool" + idx), function () {
                                    addNewSchool($E("schoolName" + idx).value);
                                }, "mousedown");
                            }
                        };
                    }(schoolIndex),
                    'complateFun': function (inp, value, text) {
                        inp.value = text;
                        schoolName = text;
                        classAuto.defalutAjaxData = {'schoolname': schoolName};
                    },
                    'lightOnFun': null,
                    'lightOffFun': null,
                    'searchNullText': '未找到该学校，请检查输入是否正确，或<a  href="javascript:;"><cite id="acAddNewSchool' + schoolIndex + '">申请添加学校</cite></a>',
                    'searchEmptyText': '请输入学校名称'
                });

            //"学院/专业"的自动完成
            var classAuto = new scope.autoComplate($E("profession" + schoolIndex)
                // Modified by L.Ming 接口地址变更 2009.11.26
//				,'http://icp.cws.api.sina.com.cn/profile/relate_college.php',{
                , 'http://control.blog.sina.com.cn/riaapi/profile/relate_college.php', {
                    'class': 'assn',
                    'style': 'width:193px;',
                    'searchFun': null,
                    'complateFun': null,
                    'lightOnFun': null,
                    'lightOffFun': null,
                    'searchNullText': '没有搜索到学院名称',
                    'searchEmptyText': '请输入学院或专业全称'
                });

            //"入读时间"事件绑定
            Core.Events.addEvent($E("matrDate" + schoolIndex), function (idx) {
                return function () {
                    $E("msgMatrDate" + idx).style.display = "none";
                };
            }(schoolIndex), "change");

            schoolIndex++;

        }

        //显示"添加上学经历"
        function showAddSchool(state) {
            $E("addSchoolPanel").style.display = state ? "" : "none";
        }

        //移除学校
        function removeSchool(idx) {
            var i, len = $E("schoolEditor").rows.length;
            for (i = len - 1; i >= 0; i--) {
                if ($E("schoolEditor").rows[i].id == "school_" + idx) {
                    $E("schoolEditor").deleteRow(i);
                }
            }

            //如果少于5条记录则显示"添加上学经历"
            if ($E("schoolEditor").rows.length < 5) {
                showAddSchool(true);
            }

            //将"学校"两个字显示在第一行的开头
            if ($E("schoolEditor").rows.length > 0) {
                $E("schoolEditor").rows[0].cells[0].innerHTML = "学&nbsp;&nbsp;&nbsp;校：";
            }
        }

        /*公司信息的相关操作*/

        //添加公司
        function appendCompany() {
            var tr = $E("companyEditor").insertRow(-1);
            var td1 = tr.insertCell(-1);
            var td2 = tr.insertCell(-1);

            tr.id = "company_" + companyIndex;

            td1.className = "rolTd1 CP_txta rolSele";
            td2.className = "rolTd2 rolSele";

            td1.innerHTML = $E("companyEditor").rows.length == 1 ? "公&nbsp;&nbsp;&nbsp;司：" : "";
            td2.innerHTML = '<span class="tdP20">' + '<em>' + '<input id="companyName' + companyIndex + '" type="text" style="width: 171px;color:#999999" value="公司名称" class="personText"/>' + '</em>' + '<em>' + '<select id="fromYear' + companyIndex + '" style="width: 66px;"><option value="0">年</option></select>' + '</em>' + '<em>' + '<select id="fromMonth' + companyIndex + '" style="width: 46px;"><option value="0">月</option></select>' + '</em> 至 ' + '<em>' + '<select id="toYear' + companyIndex + '" style="width: 66px;"><option value="today">今</option></select>' + '</em>' + '<em>' + '<select id="toMonth' + companyIndex + '" style="width: 46px;"><option value="0">月</option></select>' + '</em>' + '<em class="sameBirth">' + '<a style="display:none;" id="findWorkmate' + companyIndex + '" href="javascript:;">找同事>></a>' + '</em>' + '<em>' + '<a id="btnRemoveCompany' + companyIndex + '" href="javascript:;" class="CP_a_fuc">[<cite>删除</cite>]</a>' + '</em>' + '</span>' + '<p style="display:none;" id="msgInputCompanyName' + companyIndex + '" class="errorAction addForm">请输入公司名称</p>' + '<p style="display:none;" id="msgFindWorkmate' + companyIndex + '" class="errorAction addForm">请输入正确的公司名称，才能找到你的同事</p>' + '<p style="display:none;" id="msgYearMonth' + companyIndex + '" class="errorAction addForm">请选择入职完整年月份</p>' + '<p style="display:none;" id="msgLeaveYearMonth' + companyIndex + '" class="errorAction addForm">请选择离职完整年月份</p>' + '<p style="display:none;" id="msgErrorDate' + companyIndex + '" class="errorAction addForm">离职时间不应早于入职时间</p>';

            Utils.Form.limitMaxLen($E("companyName" + companyIndex), 40);

            //绑定"删除"按钮的事件
            Core.Events.addEvent(("btnRemoveCompany" + companyIndex), function (idx) {
                return function () {
                    removeCompany(idx);
                };
            }(companyIndex), "click");

            //如果添加了5条记录则隐藏"添加工作经历"
            if ($E("companyEditor").rows.length >= 5) {
                showAddCompany(false);
            }

            //初始化年份下拉列表
            selectAppenderDesc.initialize($E("fromYear" + companyIndex), 2011, 1908);
            selectAppender.initialize($E("fromMonth" + companyIndex), 1, 12);
            selectAppenderDesc.initialize($E("toYear" + companyIndex), 2011, 1908);
            selectAppender.initialize($E("toMonth" + companyIndex), 1, 12);

            //绑定"公司名称"的事件操作
            Core.Events.addEvent($E("companyName" + companyIndex), function (idx) {
                return function () {
                    if ($E("companyName" + idx).value == "公司名称") {
                        $E("companyName" + idx).value = "";
                    }

                    //根据文字输入情况改变输入框文字的颜色
                    $E("companyName" + idx).style.color = "#333333";

                    $E("msgInputCompanyName" + idx).style.display = "none";
                    $E("msgFindWorkmate" + idx).style.display = "none";
                };
            }(companyIndex), "focus");
            Core.Events.addEvent($E("companyName" + companyIndex), function (idx) {
                return function () {
                    if ($E("companyName" + idx).value == "") {
                        $E("companyName" + idx).value = "公司名称";
                    }

                    //根据文字输入情况改变输入框文字的颜色
                    if ($E("companyName" + idx).value != "公司名称") {
                        $E("companyName" + idx).style.color = "#333333";
                    } else {
                        $E("companyName" + idx).style.color = "#999999";
                    }
                };
            }(companyIndex), "blur");

            //绑定"找同事"的事件操作
            Core.Events.addEvent($E("findWorkmate" + companyIndex), function (idx) {
                return function () {
                    if ($E("companyName" + idx).value.replace(/\s/g, "") == "公司名称") {
                        $E("msgFindWorkmate" + idx).style.display = "";
                        $E("findWorkmate" + idx).href = "javascript:;";
                        $E("findWorkmate" + idx).target = "";
                    } else {
                        $E("findWorkmate" + idx).target = "_blank";
                        $E("findWorkmate" + idx).href = "javascript:alert('" + $E("companyName" + idx).value + "');";
                    }
                };
            }(companyIndex), "click");

            //"公司名称"的自动完成
            var acCompanyName = new scope.autoComplate($E("companyName" + companyIndex)
                // Modified by L.Ming 接口地址变更 2009.11.26
//				,'http://icp.cws.api.sina.com.cn/profile/relate_company.php',{
                , 'http://control.blog.sina.com.cn/riaapi/profile/relate_company.php', {
                    'class': 'assn',
                    'style': 'width:193px;',
                    'searchFun': null,
                    'complateFun': null,
                    'lightOnFun': null,
                    'lightOffFun': null,
                    'searchNullText': null,
                    'searchEmptyText': '请输入公司全称'
                });

            //所有年月份有选择改变时，隐藏错误提示
            Core.Events.addEvent($E("fromYear" + companyIndex), function (idx) {
                return function () {
                    $E("msgYearMonth" + idx).style.display = "none";
                    $E("msgErrorDate" + idx).style.display = "none";
                };
            }(companyIndex), "change");
            Core.Events.addEvent($E("fromMonth" + companyIndex), function (idx) {
                return function () {
                    $E("msgYearMonth" + idx).style.display = "none";
                    $E("msgErrorDate" + idx).style.display = "none";
                };
            }(companyIndex), "change");
            Core.Events.addEvent($E("toYear" + companyIndex), function (idx) {
                return function () {
                    $E("msgLeaveYearMonth" + idx).style.display = "none";
                    $E("msgErrorDate" + idx).style.display = "none";

                    //离职年份为"至今"时，隐藏月份，否则显示月份
                    if ($E("toYear" + idx).value == "today") {
                        $E("toMonth" + idx).style.display = "none";
                        $E("toMonth" + idx).selectedIndex = 0;
                    } else {
                        $E("toMonth" + idx).style.display = "";
                    }
                };
            }(companyIndex), "change");
            Core.Events.addEvent($E("toMonth" + companyIndex), function (idx) {
                return function () {
                    $E("msgLeaveYearMonth" + idx).style.display = "none";
                    $E("msgErrorDate" + idx).style.display = "none";
                };
            }(companyIndex), "change");

            //离职年份为"至今"时，隐藏月份
            if ($E("toYear" + companyIndex).value == "today") {
                $E("toMonth" + companyIndex).style.display = "none";
            }

            companyIndex++;

        }

        //显示"添加工作经历"
        function showAddCompany(state) {
            $E("addCompanyPanel").style.display = state ? "" : "none";
        }

        //移除公司
        function removeCompany(idx) {
            var i, len = $E("companyEditor").rows.length;
            for (i = len - 1; i >= 0; i--) {
                if ($E("companyEditor").rows[i].id == "company_" + idx) {
                    $E("companyEditor").deleteRow(i);
                }
            }

            //如果少于5条记录则显示"添加工作经历"
            if ($E("companyEditor").rows.length < 5) {
                showAddCompany(true);
            }

            //将"公司"两个字显示在第一行的开头
            if ($E("companyEditor").rows.length > 0) {
                $E("companyEditor").rows[0].cells[0].innerHTML = "公&nbsp;&nbsp;&nbsp;司：";
            }
        }

        //隐藏学校所有的错误提示信息
        function hiddenSchoolAllMsg() {
            var i, len = $E("schoolEditor").rows.length;
            for (i = 0; i < len; i++) {
                $E("msgFindSchoolmate" + $E("schoolEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "none";
                $E("msgSchoolName" + $E("schoolEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "none";
                $E("msgMatrDate" + $E("schoolEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "none";
            }
        }

        //隐藏公司所有的错误提示信息
        function hiddenCompanyAllMsg() {
            var i, len = $E("companyEditor").rows.length;
            for (i = 0; i < len; i++) {
                $E("msgInputCompanyName" + $E("companyEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "none";
                $E("msgFindWorkmate" + $E("companyEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "none";
                $E("msgYearMonth" + $E("companyEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "none";
                $E("msgLeaveYearMonth" + $E("companyEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "none";

            }
        }

        //申请添加新学校
        window.addNewSchool = function (schoolName) {
            // Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/addSchool.php", "jsload")).request({
            (new Interface("http://control.blog.sina.com.cn/riaapi/profile/addSchool.php", "jsload")).request({
                GET: {
                    school: schoolName,
                    uid: scope.$uid, version: 7
                },
                onSuccess: function (iData) {
                    winDialog.alert("已成功提交申请，请等候审批");
                },
                onError: function (iData) {
                    winDialog.alert($PERSONAL_MSG[iData.code], { icon: "02" });

                },
                onFail: function (iData) {
                }
            });
        };

        //保存数据
        function saveData() {
            var i, len;
            var verified = true;
            hiddenSchoolAllMsg();
            hiddenCompanyAllMsg();

            /*验证学校数据*/
            len = $E("schoolEditor").rows.length;
            for (i = 0; i < len; i++) {
                //学校名称
                if ($E("schoolEditor").rows[i].getElementsByTagName("input")[0].value == "学校名称") {
                    $E("msgSchoolName" + $E("schoolEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "";
                    verified = false;
                }
                //入读时间
                if ($E("schoolEditor").rows[i].getElementsByTagName("select")[1].value == "0") {
                    $E("msgMatrDate" + $E("schoolEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "";
                    verified = false;
                }
            }

            /*验证公司数据*/
            len = $E("companyEditor").rows.length;
            for (i = 0; i < len; i++) {
                //公司名称
                if ($E("companyEditor").rows[i].getElementsByTagName("input")[0].value == "公司名称") {
                    $E("msgInputCompanyName" + $E("companyEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "";
                    verified = false;
                }
                //入职年月份
                if ($E("companyEditor").rows[i].getElementsByTagName("select")[0].value == "0" || $E("companyEditor").rows[i].getElementsByTagName("select")[1].value == "0") {
                    $E("msgYearMonth" + $E("companyEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "";
                    verified = false;
                }
                //离职年月份
                if ($E("companyEditor").rows[i].getElementsByTagName("select")[2].value != "today" && $E("companyEditor").rows[i].getElementsByTagName("select")[3].value == "0") {
                    $E("msgLeaveYearMonth" + $E("companyEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "";
                    verified = false;
                }

                //离职时间早于入职时间
                var startYear = parseInt($E("companyEditor").rows[i].getElementsByTagName("select")[0].value);
                var endYear = parseInt($E("companyEditor").rows[i].getElementsByTagName("select")[2].value);
                var startMonth = parseInt($E("companyEditor").rows[i].getElementsByTagName("select")[1].value);
                var endMonth = parseInt($E("companyEditor").rows[i].getElementsByTagName("select")[3].value);
                if (endYear < startYear || endYear == startYear && endMonth < startMonth) {
                    $E("msgErrorDate" + $E("companyEditor").rows[i].id.replace(/[^0-9]*/g, "")).style.display = "";
                    verified = false;
                }
            }

            if (verified) {
                isSubmit = false;

                //格式化要提交的数据
                var schoolData, companyData;
                var sds = [], cds = [];

                //学校的数据
                len = $E("schoolEditor").rows.length;
                for (i = 0; i < len; i++) {
                    sds[i] = {};
                    sds[i].schoolType = $E("schoolEditor").rows[i].getElementsByTagName("select")[0].value;
                    sds[i].schoolName = encodeURI($E("schoolEditor").rows[i].getElementsByTagName("input")[0].value);
                    sds[i].profession = encodeURI($E("schoolEditor").rows[i].getElementsByTagName("input")[1].value);
                    sds[i].matrDate = $E("schoolEditor").rows[i].getElementsByTagName("select")[1].value;
                    sds[i] = scope.personal.jsonToString(sds[i]);
                }
                schoolData = "[" + sds.join(",") + "]";

                //公司的数据
                len = $E("companyEditor").rows.length;
                for (i = 0; i < len; i++) {
                    cds[i] = {};
                    cds[i].companyName = encodeURI($E("companyEditor").rows[i].getElementsByTagName("input")[0].value);
                    cds[i].year1 = $E("companyEditor").rows[i].getElementsByTagName("select")[0].value;
                    cds[i].month1 = $E("companyEditor").rows[i].getElementsByTagName("select")[1].value;
                    cds[i].year2 = $E("companyEditor").rows[i].getElementsByTagName("select")[2].value;
                    cds[i].month2 = $E("companyEditor").rows[i].getElementsByTagName("select")[3].value;
                    cds[i] = scope.personal.jsonToString(cds[i]);
                }
                companyData = "[" + cds.join(",") + "]";

                //提交数据
                submitData(schoolData, companyData);
            }
        }

        //局部刷新更新个人经历的数据
        function updateShowData(percent) {
            setTimeout(function () {
                // Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/show_career.php", "jsload")).request({
                (new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_career.php", "jsload")).request({
                    GET: {
                        uid: scope.$uid, version: 7
                    },
                    onSuccess: function (iData) {
                        _updateShowData(iData);
                        isSubmit = true;
                    },
                    onError: function (iData) {
                        winDialog.alert($PERSONAL_MSG[iData.code], { icon: "02" });
                        isSubmit = true;
                    },
                    onFail: function (iData) {
                        isSubmit = true;
                    }
                });
            }, 1);

            function _updateShowData(iData) {
                var sds = iData["school"];
                var cds = iData["company"];
                var i, len;
                var careerInfoRes = $E("careerInfoRes");
                var trSchoolDisplay = $E("trSchoolDisplay");
                var trCompanyDisplay = $E("trCompanyDisplay");
                var careerAddItem = $E("careerAddItem");

                //绑定学校的显示数据
                if (sds.length > 0) {
                    var schoolType = {
                        "0": "大学"
                    };
                    var tableSchoolDisplay = $E("tableSchoolDisplay");
                    len = tableSchoolDisplay.rows.length;
                    for (i = len - 1; i >= 0; i--) {
                        tableSchoolDisplay.deleteRow(i);
                    }

                    len = sds.length;
                    for (i = 0; i < len; i++) {
                        var tr = tableSchoolDisplay.insertRow(-1);
                        var td1 = tr.insertCell(-1);
                        var td2 = tr.insertCell(-1);
                        td1.innerHTML = '<span class="unSchool">' + schoolType[sds[i]["schoolType"]] + '</span>';

                        var scl = encodeURIComponent(sds[i]["schoolName"]);
                        var pro = encodeURIComponent(sds[i]["profession"]);

                        //有链接的情况
                        td2.innerHTML = ' <span class="tdP20"><a id="sclLink_' + i + '" target="_blank" href="">' + sds[i]["schoolName"] + '</a></span>' + '<span class="tdP20"><a id="proLink_' + i + '" target="_blank" href="">' + sds[i]["profession"] + '</a></span>' + '<span class="tdP20">' + sds[i]["matrDate"] + '年入读</span>';

                        $E("sclLink_" + i).href = 'http://uni.sina.com.cn/c.php?t=ren&st=1&gend=0&prov=0&city=0&age_min=0&age_max=0&ie=utf-8&scho=' + scl;
                        $E("proLink_" + i).href = 'http://uni.sina.com.cn/c.php?t=ren&st=1&gend=0&prov=0&city=0&age_min=0&age_max=0&ie=utf-8&scho=' + scl + '&pro=' + pro;
                    }
                    trSchoolDisplay.style.display = "";
                    careerAddItem.style.display = "none";
                } else {
                    //隐藏学校所在的行
                    trSchoolDisplay.style.display = "none";
                }

                //绑定公司的显示数据
                if (cds.length > 0) {
                    var tableCompanyDisplay = $E("tableCompanyDisplay");
                    len = tableCompanyDisplay.rows.length;
                    for (i = len - 1; i >= 0; i--) {
                        tableCompanyDisplay.deleteRow(i);
                    }

                    len = cds.length;
                    for (i = 0; i < len; i++) {
                        var newDate = cds[i]["year2"] == "today" ? "今" : cds[i]["year2"] + "年" + cds[i]["month2"] + "月";
                        var tr = tableCompanyDisplay.insertRow(-1);
                        var td1 = tr.insertCell(-1);
                        td1.className = "rolTd2";
                        //有链接的情况
                        td1.innerHTML = '<span class="tdP20"><a target="_blank" href="http://uni.sina.com.cn/c.php?t=ren&st=1&gend=0&prov=0&city=0&age_min=0&age_max=0&ie=utf-8&comp=' + encodeURIComponent(cds[i]["companyName"]) + '">' + cds[i]["companyName"] + '</a></span>' + '<span class="tdP20">' + cds[i]["year1"] + '年' + cds[i]["month1"] + '月至' + newDate + '</span>';

                    }
                    trCompanyDisplay.style.display = "";
                    careerAddItem.style.display = "none";
                } else {
                    //隐藏学校所在的行
                    trCompanyDisplay.style.display = "none";
                }

                //没有任何数据
                if (sds.length == 0 && cds.length == 0) {
                    trSchoolDisplay.style.display = "none";
                    trCompanyDisplay.style.display = "none";
                    careerAddItem.style.display = "";
                }

                //清除编辑表中暂时显示的数据项
                len = $E("schoolEditor").rows.length;
                for (i = len - 1; i >= 0; i--) {
                    $E("schoolEditor").deleteRow(i);
                }

                len = $E("companyEditor").rows.length;
                for (i = len - 1; i >= 0; i--) {
                    $E("companyEditor").deleteRow(i);
                }

                //隐藏有历史数据的提示信息
                $E("careerInfoTip").style.display = "none";

                //显示"编辑"按钮，隐藏编辑区
                $E("btnEditCareerInfo").parentNode.style.display = "";
                $E("careerInfoRes").style.display = "";
                $E("editCareer").style.display = "none";

                //更新"完成度"
                $E("careerPercent").innerHTML = "已完成" + percent;

            }
        }

        //提交数据
        function submitData(schoolData, companyData) {
            // Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/edit_career.php", "jsload")).request({
            (new Interface("http://control.blog.sina.com.cn/riaapi/profile/edit_career.php", "jsload")).request({
                GET: {
                    uid: scope.$uid,
                    school: schoolData,
                    company: companyData,
                    nosearch: $E("experienceSearchMask").checked ? "1" : "0", version: 7
                },
                noencode: true,
                onSuccess: function (iData) {
                    updateShowData(iData["percent"]);
                },
                onError: function (iData) {
                    if (iData["code"] == "A00008") {
                        //学校名称没有验证通过
                        var i, len = $E("schoolEditor").rows.length;
                        for (i = 0; i < len; i++) {
                            if (i == parseInt(iData["data"]["key"])) {
                                $E("schoolEditor").rows[i].getElementsByTagName("p")[3].style.display = "";
                            }
                        }

                    } else {
                        winDialog.alert($PERSONAL_MSG[iData.code], {
                            icon: "02"
                        });
                    }
                    isSubmit = true;
                },
                onFail: function (iData) {
                    isSubmit = true;
                }
            });
        }

        /*初始化数据*/

        //获取数据
        function getData() {
            // Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/show_career.php", "jsload")).request({
            (new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_career.php", "jsload")).request({
                GET: {
                    uid: scope.$uid, version: 7
                },
                onSuccess: function (iData) {
                    initializeInfo(iData);
                },
                onError: function (iData) {
                    winDialog.alert($PERSONAL_MSG[iData.code], { icon: "02" });
                },
                onFail: function (iData) {
                }
            });
        }

        //初始化列表
        function initializeInfo(iData) {
            var i, len;
            //学校列表
            var sds = iData["school"] || [];
            len = sds.length;
            for (i = 0; i < len; i++) {
                appendSchool();
                scope.personal.setSelectValue($E("schoolEditor").rows[i].getElementsByTagName("select")[0], sds[i]["schoolType"]);
                $E("schoolEditor").rows[i].getElementsByTagName("input")[0].value = sds[i]["schoolName"];
                $E("schoolEditor").rows[i].getElementsByTagName("input")[1].value = sds[i]["profession"];
                scope.personal.setSelectValue($E("schoolEditor").rows[i].getElementsByTagName("select")[1], sds[i]["matrDate"]);

                //初始化输入框的文本颜色
                if (sds[i]["schoolName"] != "学校名称") {
                    $E("schoolEditor").rows[i].getElementsByTagName("input")[0].style.color = "#333333";
                }
                if (sds[i]["profession"] != "学院/专业") {
                    $E("schoolEditor").rows[i].getElementsByTagName("input")[1].style.color = "#333333";
                }
            }

            me.addSchoolLinkState = $E("addSchoolPanel").style.display;

            //公司列表
            var cds = iData["company"] || [];
            len = cds.length;
            for (i = 0; i < len; i++) {
                appendCompany();
                $E("companyEditor").rows[i].getElementsByTagName("input")[0].value = cds[i]["companyName"];
                scope.personal.setSelectValue($E("companyEditor").rows[i].getElementsByTagName("select")[0], cds[i]["year1"]);
                scope.personal.setSelectValue($E("companyEditor").rows[i].getElementsByTagName("select")[1], cds[i]["month1"]);
                scope.personal.setSelectValue($E("companyEditor").rows[i].getElementsByTagName("select")[2], cds[i]["year2"]);
                scope.personal.setSelectValue($E("companyEditor").rows[i].getElementsByTagName("select")[3], cds[i]["month2"]);

                //初始化输入框的文本颜色
                if (cds[i]["companyName"] != "公司名称") {
                    $E("companyEditor").rows[i].getElementsByTagName("input")[0].style.color = "#333333";
                }

                //离职日期为"至今"则不显示月
                if ($E("companyEditor").rows[i].getElementsByTagName("select")[2].value == "today") {
                    $E("companyEditor").rows[i].getElementsByTagName("select")[3].style.display = "none";
                }
            }

            me.addCompanyLinkState = $E("addCompanyPanel").style.display;

            //是否在搜索中隐藏信息
            $E("experienceSearchMask").checked = iData["nosearch"] == "1";

            //隐藏显示区域，显示编辑区域
            $E("careerInfoRes").style.display = "none";
            $E("editCareer").style.display = "";

            //隐藏Loading
            $E("careerLoading").style.display = "none";

            //如果有历史数据，则显示提示信息
            $E("careerInfoTip").style.display = iData["isHistory"] ? "" : "none";
        }
    }
};
