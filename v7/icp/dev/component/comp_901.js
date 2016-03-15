/**
 * @fileoverview
 *	个人信息组件，具体呈现
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/string/formatNumber.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/string/trim.js");

$import("lib/component/class/registComp.js");
$import("lib/component/final/comp_901.js");
$import("lib/interface.js");
$import("lib/component/include/attention.js");
$import("lib/component/include/setPV.js");
$import("lib/component/include/invite.js");
$import("lib/component/include/scrip.js");
$import("lib/checkAuthor.js");
$import("other/SinaEx.js");

/**
 * 博客个首个人信息组件的呈现
 */
$registComp(901, {
    "baseHTML": ['' + '<div class="info">' + '<div class="info_img" id="comp_901_head">' + '<img src="http://portrait' + (scope.$uid * 1 % 8 + 1) + '.sinaimg.cn/' + scope.$uid + '/blog/180" id="comp_901_head_image" width="180" height="180" alt="" />' + '</div>' + '<div class="info_txt">' + '<div class="info_nm">' + '<img id="comp_901_online_icon" style="display:none;" class="SG_icon SG_icon1" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" align="absmiddle" /><span class="SG_txtb"><strong id="comp_901_nickname">&nbsp;</strong></span>' + '<span class="info_into"><a class="SG_linka" href="http://space.sina.com.cn/u/1406758883"><img class="SG_icon SG_icon41" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="空间" align="absmiddle" />进入我的空间</a></span>' + '<div class="clearit"></div>' + '</div>' + '<div class="info_btn1">' //flm
        + '<a href="http://you.video.sina.com.cn/' + scope.$uhost + '" class="SG_aBtn SG_aBtn_ico" target="_blank">' + '<cite>' + '<img class="SG_icon SG_icon16" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" align="absmiddle" />播客' + '</cite>' + '</a><a href="http://weibo.com/' + scope.$uid + '?source=blog" class="SG_aBtn SG_aBtn_ico">' + '<cite>' + '<img class="SG_icon SG_icon51" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" align="absmiddle" />微博' + '</cite>' + '</a>' + '<div class="clearit"></div>' + '</div>' //flm
        + '<div class="SG_j_linedot"></div>' + '<div class="info_list">' + '<ul class="info_list1">' + '<li>' + '<span class="SG_txtc">博客等级：</span><span id="comp_901_grade">读取中…</span>' + '</li>' + '<li>' + '<span class="SG_txtc">博客积分：</span><span id="comp_901_score">读取中…</span>' + '</li>' + '</ul>' + '<ul class="info_list2">' + '<li>' + '<span class="SG_txtc">博客访问：</span><span id="comp_901_pv">读取中…</span>' + '</li>' + '<li>' + '<span class="SG_txtc">关注人气：</span><span id="comp_901_attention">读取中…</span>' + '</li>' + '</ul>' + '</div>' + '<div class="clearit"></div>' + '</div>' + '<div class="clearit"></div>' + '</div>'
    ].join(""),
    "load": function() {
            Lib.checkAuthor();
            if ($E("comp_901_head") == null) {
                this.setContent(this.baseHTML);
            }
            // 如果是访客浏览，就进入加好友等按钮的状态逻辑
            if ($isAdmin == false && $isLogin) {
                this.loadIsFriend();
            } else if ($isAdmin == false && !$isLogin) {
                this.isFriend = false;
                this.loadOnline();
            } else {
                this.isOnline = true;
            }

            Lib.Uic.getNickName([scope.$uid], function(data) {
                var _trim = Core.String.trim;
                var ownernickEl = $E("ownernick") || $E("comp_901_nickname");
                var nickName = _trim(ownernickEl.textContent || ownernickEl.innerText);
                var nickHTML = _trim(ownernickEl.innerHTML);
                //此处对昵称长度的限制
                if (Core.String.byteLength(data[scope.$uid]) > 20) {
                    var nick = data[scope.$uid].replace(/(.{10})/g, '$1\<br\/\>');
                } else {
                    var nick = data[scope.$uid]
                }
                if (!nickName && nickName != nickHTML) { //昵称值为空 并且 有加v标识
                    ownernickEl.innerHTML = nick + "&nbsp;" + nickHTML;
                } else if (nickName && nickName != nickHTML) { //此处昵称存在，有加v标识
                    try {
                        var imgs = ownernickEl.getElementsByTagName("a");
                        var cons = imgs && imgs[0].innerHTML;
                        ownernickEl.innerHTML = nick + '&nbsp;<a href="http://blog.sina.com.cn/v/verify" target="_blank">' + cons + '</a>';
                    } catch (e) {}
                } else { //昵称存在，没有加v标识。 昵称不存在，直接写成值
                    ownernickEl.innerHTML = nick;
                }
            });

            if ($E("comp_901_nickname")) { //分离昵称渲染和头像渲染。配合 PHP 做优化。
                this.loadNickname();
            } else {
                this.renderHead();
                var ownernickEl = $E("ownernick");
                var _trim = Core.String.trim;
                var byteLength = Core.String.byteLength;
                var tmp, oldNick;
                if (ownernickEl) {
                    tmp = _trim(ownernickEl.textContent || ownernickEl.innerText).replace(/(\r|\n)/g, "");
                    var len = byteLength(tmp);
                    scope.owenerNickName = tmp;
                    if (22 < len) {
                        // 兼容IE浏览器，如果使用innerHTML替换，
                        // vlink的innerHTML会被清空
                        // by wangqiang1
                        var vLink = $T(ownernickEl, "a")[0];
                        var linkInner = vLink.innerHTML;
                        ownernickEl.innerHTML = this.fixNick(tmp) + "&nbsp;";
                        if (vLink) {
                            vLink.innerHTML = linkInner;
                            ownernickEl.appendChild(vLink);
                        }
                    }
                }
            }
            this.loadOtherInfo();
            if (scope.$pageid == "pageSetM" && this.setManage && scope.$private.ad == 0 && scope.$private.adver == 0 && scope.$private.p4p == 0) {
                this.setManage();
            }
            this.mapEnter();//地图入口
            //this.tenyears();//十周年相关
        }
        /**
         * 修正用户昵称，微博账号15个中文
         */
        ,
    fixNick: function(nick) {
            var byteLength = Core.String.byteLength;
            var leftB = Core.String.leftB;
            var _trim = Core.String.trim;
            var len = byteLength(nick);
            var tmp;

            nick = _trim(nick);

            if (22 < len) {
                tmp = leftB(nick, 20);
                nick = tmp + "<br>" + nick.replace(tmp, "")
            }

            return nick;
        }
        /*
         * 显示在线图标
         */
        ,
    "showOnlineInfo": function() {
            if (!$isAdmin && this.isOnline) {
                Core.Dom.setStyle($E("comp_901_online_icon"), "display", "");
                $E("comp_901_online_icon").alt = "在线";
                $E("comp_901_online_icon").title = "在线";
            }
        }
        /*
         * 显示昵称
         */
        ,
    "showNickName": function(oResult) {
            var nickname = oResult[scope.$uid] || "";
            nickname = Core.String.encodeHTML(nickname);
            scope.owenerNickName = nickname;
            $E("comp_901_nickname").innerHTML = nickname;
            this.renderHead(nickname);
        }
        /*
         * wrap 用户头像，点击进入上传头像页
         */
        ,
    renderHead: function(nickname) {
            if (!$isAdmin) {
                if (nickname) {
                    $E("comp_901_head_image").title = nickname;
                }
            } else {
                $E("comp_901_head").innerHTML = '<a href="http://control.blog.sina.com.cn/blogprofile/nick.php"' + ' title="点击上传头像" target="_blank"><img id="comp_901_head_image" width="180" height="180" alt="点击上传头像" src="http://portrait' + (scope.$uid * 1 % 8 + 1) + '.sinaimg.cn/' + scope.$uid + '/blog/180" /></a>';
            }
        }
        /*
         * 加载其他的附加信息接口
         */
        ,
    "loadOtherInfo": function() {
        this.loadPv();
        //加载金笔信息
        this.loadGoldpan();
        //if($isAdmin == false || $E("comp_901_attention").innerHTML == "读取中…"){
        //2011-04-28 关注数都读接口			
        this.loadAttention();
        //}

        //积分接口暂时不会被调用,接口将会被弃用
        //this.loadScore();


        //世界杯的足球图标下线
        //this.loadWorldCupIcon();

        // 判断彩信用户

        // 判断广告共享计划用户
        if (scope.$pageid == "index" || scope.$pageid == "indexM" || scope.$pageid == "pageSetM") {
            this.loadAdManage();
        }

        //判断用户是否要更换新徽章
        //if(scope.$private && scope.$private.moveMedal===1){
        //	this.loadNewIcon();
        //}else{
        // this.load5YearsIcon();
        // this.load7YearsIcon();
        //}
    },
    /**
     * 加载新徽章
     */
    "loadNewIcon": function() {

        var _link = $C("a");
        _link.href = "http://move.blog.sina.com.cn/";
        _link.target = "_blank";
        _link.position = "absolute";
        var _img = $C("img");
        _img.src = "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif";
        _img.className = "fiveyearsIcon";
        if ($IE6) {
            _img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='http://simg.sinajs.cn/blog7style/images/special/move/move_hz.png',sizingMethod='image')";
        } else {
            _img.style.backgroundImage = "url(http://simg.sinajs.cn/blog7style/images/special/move/move_hz.png)";
        }
        _img.alt = "邀请MSN好友获得朋友徽章";
        _img.title = "邀请MSN好友获得朋友徽章";
        _img.style.border = "none";
        _link.appendChild(_img);
        $E("comp_901_head").appendChild(_link);

        //添加msn徽章点击统计
        _link.onclick = function() {
            Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnGuideCount.php?type=hitMedal");
        }
        _link = null;
    },
    /*
     * 请求博主的访问数，每请求一次该接口，自动加一
     */
    "loadPv": function() {
        var refer = document.referrer == '0' ? '' : encodeURIComponent(document.referrer);
        if (scope.totalPv && !isNaN(scope.totalPv)) {
            $SetPV(scope.totalPv);
        } else {
            var pvurl = "";
            if (scope.$articleid) {
                pvurl = "http://comet.blog.sina.com.cn/api?maintype=hits&act=4&aid=" + scope.$articleid + '&ref=' + refer;
            } else {
                var $uidhex = (scope.$uid * 1).toString(16);
                $uidhex.length < 8 ? $uidhex = (("00000000" + $uidhex).substr($uidhex.length, 8)) : $uidhex;
                pvurl = "http://comet.blog.sina.com.cn/api?maintype=hits&act=3&uid=" + $uidhex + '&ref=' + refer;
            }
            Utils.Io.JsLoad.request(pvurl, {
                onComplete: function(data) {
                    if (data && typeof data.pv != "undefined") {
                        scope.totalPv = data.pv;
                        $SetPV(data.pv);
                    }
                },
                onException: function() {
                    $SetPV(0);
                }
            });
        }
    },
    "loadBadge": function(data) {
        // debugger;
        var names = ["点亮荣誉勋章", "新新博主", "新锐博主", "先锋博主", "精英博主", "风云博主", "资深博主", "元老博主", 0, 0, "图片博主", "兑换图片博主服务", "私密博文", "兑换私密博文", "金笔", "兑换金笔"];
        var aTpl = '<a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_action.php" title="[title]"><img title="[title]" alt="[title]" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="badge" style="background-image:url([imgPath].png);_background-image: url([imgPath].gif);"></a>';
        var el = $E("comp_901_badge");
        if (!el) {
            return;
        }
        var badges = [];
        if (data.medal > 0) {
            data.medal > 7 ? data.medal = 7 : '';
            badges.push({
                medal: data.medal,
                title: names[data.medal]
            });
        } else {
            badges.push({
                medal: 8,
                title: names[0]
            });
        }
        if (data.pic_vip == 1) {
            badges.push({
                medal: 10,
                title: names[10]
            });
        } else {
            badges.push({
                medal: 11,
                title: names[11]
            });
        }
        if (data['private'] == 1) {
            badges.push({
                medal: 12,
                title: names[12]
            });
        } else {
            badges.push({
                medal: 13,
                title: names[13]
            });
        }
        if (data['goldpen'] > 0) {
            names[14] = "现有金笔" + data['goldpen'] / 1 + "支";
            badges.push({
                medal: 14,
                title: names[14]
            });
        } else {
            badges.push({
                medal: 15,
                title: names[15]
            });
        }
        var htmlStr = '';
        for (var i = 0; i < badges.length; i++) {
            var item = badges[i];
            var n = item.medal < 10 ? ("0" + item.medal) : item.medal;
            imgPath = "http://simg.sinajs.cn/blog7style/images/common/badge/badge" + n;
            htmlStr += aTpl.replace(/\[imgPath\]/g, imgPath).replace(/\[title\]/g, item.title);
        }

        Core.Dom.insertHTML(el, htmlStr, "beforeend");
    },
    loadGoldpan: function() {
            var dEl = $E('comp_901_d_goldpen');
            var rEl = $E('comp_901_r_goldpen');
            if (dEl && rEl) {
                Utils.Io.JsLoad.request(
                    "http://comet.blog.sina.com.cn/api?maintype=goldpen&uid=" + scope.$uid, {
                        onComplete: function(data) {
                            // data = data || {"donate": 2333,"receive":8888};
                            if (data) {
                                rEl.innerHTML = data.donate;
                                dEl.innerHTML = data.receive;
                            }
                        },
                        onException: function() {}
                    });
            }
        }
        /*
         * 载入博主积分
         * @disuse 已经被废弃
         */
        ,
    "loadScore": function() {
            setTimeout(function() {
                Utils.Io.JsLoad.request("http://blogcnfv5.sinajs.cn/blogscr?uid=" + scope.$uid + "&varname=blogScore&.js", {
                    onComplete: function() {
                        // Modified by L.Ming 如果积分接口出错，输出0，以免JS报错
                        if (typeof blogScore != "undefined" || $E("comp_901_score") == null) {
                            // 计算积分
                            var _a = blogScore.coefficient.a;
                            var _b = blogScore.coefficient.b;
                            var _c = blogScore.coefficient.c;
                            var _d = blogScore.coefficient.d;
                            var _x1 = blogScore.x;
                            var _y1 = blogScore.y;
                            var _z1 = blogScore.z;
                            var _w1 = blogScore.w;
                            var _score = _x1 * _a + _y1 * _b + _z1 * _c + _w1 * _d;
                            $E("comp_901_score").innerHTML = '<strong>' + Core.String.formatNumber(_score) + '</strong>';
                        }
                    },
                    noreturn: true
                });
            }, 1);
        }
        /*
         * 载入博主关注数
         */
        ,
    "loadAttention": function() {
            /*
		if ($isAdmin && $E("comp_901_attention").innerHTML != "读取中…") {
			return;
		}
		*/
            var me = this;
            var attention = new Interface("http://blogtj.sinajs.cn/api/get_attention_num.php", "jsload");
            var getVal = {
                "uid": scope.$uid,
                "suid": $isLogin ? $UID : "0",
                "attention": "suid"
                    //2011-05-03 积分接口一直都调用
                    ,
                "userpointuid": scope.$uid,
                "s": "1" // blog7 多增加一个这个参数，用以区分
            };

            //当接口结合时被调用,原来的接口废弃,默认情况下这个是不会被调用的
            if (this.mashAddFriend) {
                var friendattuid = scope.$uid;
                var friendattsuid = $UID;
                if (friendattuid && friendattsuid) {
                    getVal.friendattuid = friendattuid;
                    getVal.friendattsuid = friendattsuid;
                } else {
                    //未登录情况下不做任何处理
                    this.mashAddFriend = false;
                }
            }

            attention.request({
                GET: getVal,
                onSuccess: Core.Function.bind2(function(oData) {
                    Lib.checkAuthor();
                    if ($E("comp_901_attention")) {
                        var att_num = Core.String.formatNumber(oData.num[scope.$uid]);
                        $E("comp_901_attention").innerHTML = '<strong>' + (att_num < 0 ? 0 : att_num) + '</strong>';
                    }
                    if (oData.is_attention && oData.is_attention[scope.$uid] == 1) {
                        this.isAttentioned = true;
                        if ($E("module_901_attention")) {
                            $E("module_901_attention").innerHTML = "已关注";
                        }
                    }
                    if (typeof oData.userpoint != "undefined") {
                        if ($E('comp_901_score')) {
                            //积分项目 添加积分链接和'新'图标标示 2014-06-18
                            $E('comp_901_score').innerHTML = '<a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_action.php" title="积分"><strong>' + oData.userpoint + '</strong><img width="15" height="15" align="top" title="积分" alt="积分" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon11">';
                        }
                    }
                    if (this.mashAddFriend) {
                        //还原回原来的返回格式，方便代码复用
                        var data = [{
                            'uid': scope.$uid,
                            'status': oData.friendattr
                        }];
                        this.friendSuccessCallback(data);
                    }
                    if (oData.svr_time) { //2010 - 05
                        scope.$svr_time = oData.svr_time;
                    }
                    this.loadBadge(oData); //add jiangwei5
                    /*
				if(scope.useNewInterfaceToGetNum) {
					trace('通过新的接口返回');
					if(scope.useNewInterfaceToGetNum.onSuccess) {
						trace('执行成功');
						scope.useNewInterfaceToGetNum.onSuccess(oData['digg']);
					} else {
						setTimeout(function() {
							trace('延迟执行');
							if(scope.useNewInterfaceToGetNum.onSuccess) {
								trace('延迟执行成功');
								scope.useNewInterfaceToGetNum.onSuccess(oData['digg']);
							}
						},300);
					}
				}
				*/

                }, this),
                onError: function() {
                    if ($E("comp_901_attention")) {
                        $E("comp_901_attention").innerHTML = '<strong>0</strong>';
                    }
                    if (me.mashAddFriend) {
                        me.friendErrorCallback();
                    }
                    me.loadBadge(); //add jiangwei5
                    /*
				if(scope.useNewInterfaceToGetNum) {
					if(scope.useNewInterfaceToGetNum.onError) {
						scope.useNewInterfaceToGetNum.onError();
					} else {
						setTimeout(function() {
							if(scope.useNewInterfaceToGetNum.onError) {
								scope.useNewInterfaceToGetNum.onError();
							}
						},300);
					}
				}
				*/
                },
                onFail: function() {
                    if ($E("comp_901_attention")) {
                        $E("comp_901_attention").innerHTML = '<strong>0</strong>';
                    }
                    if (me.mashAddFriend) {
                        me.friendErrorCallback();
                    }
                    me.loadBadge(); //add jiangwei5
                    /*
				if(scope.useNewInterfaceToGetNum) {
					if(scope.useNewInterfaceToGetNum.onFail) {
						scope.useNewInterfaceToGetNum.onFail();
					} else {
						setTimeout(function() {
							if(scope.useNewInterfaceToGetNum.onFail) {
								scope.useNewInterfaceToGetNum.onFail();
							}
						},300);
					}
				}
				*/
                }
            });
        }
        /*
         * 渲染世界杯徽标
         */
        ,
    "loadWorldCupIcon": function() {
            if (scope.$isWorldcupUser == 1) { // 判断博主是否参加了世界杯活动的 scope 变量暂时还没有，默认全显示
                var _link = $C("a");
                _link.href = "http://blog.2010.sina.com.cn/yunying/2010worldcup/";
                _link.target = "_blanks";
                var _img = $C("img");
                _img.id = "comp_901_wcIcon";
                _img.src = "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif";
                _img.className = "worldcup_icon worldcup_icon_l";
                _img.alt = "记录激动时刻，赢取超级大奖！快一起参加吧！";
                _img.title = "记录激动时刻，赢取超级大奖！快一起参加吧！";
                _link.appendChild(_img);
                $E("comp_901_head").appendChild(_link);
            }
        }
        /*
         * 渲染博客五周年勋章
         */
        ,
    "load7YearsIcon": function() {

        var headPic = $E("comp_901_head");
        var medalObj = {
            medal0: "http://simg.sinajs.cn/blog7style/images/activity/blog7year/icon_wmm.png",
            medal1: "http://simg.sinajs.cn/blog7style/images/activity/blog7year/icon_xx.png",
            medal2: "http://simg.sinajs.cn/blog7style/images/activity/blog7year/icon_xr.png",
            medal3: "http://simg.sinajs.cn/blog7style/images/activity/blog7year/icon_xf.png",
            medal4: "http://simg.sinajs.cn/blog7style/images/activity/blog7year/icon_jy.png",
            medal5: "http://simg.sinajs.cn/blog7style/images/activity/blog7year/icon_fy.png?v20120917",
            medal6: "http://simg.sinajs.cn/blog7style/images/activity/blog7year/icon_zs.png",
            medal7: "http://simg.sinajs.cn/blog7style/images/activity/blog7year/icon_yl.png"
        }
        var medalType = scope.$private.medal7;
        medalType = 7 < medalType ? 7 : medalType;
        if (medalType) {
            var _a = $C("a");
            _a.setAttribute("target", "_blank");
            _a.setAttribute("href", "http://control.blog.sina.com.cn/blog_7years/index.php");
            var _img = $C("img");

            _img.src = "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif";
            _img.className = "sevenyearsIcon";
            if ($IE6) {
                _img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + medalObj["medal" + medalType] + "',sizingMethod='image')";
            } else {
                _img.style.backgroundImage = "url(" + medalObj["medal" + medalType] + ")";
            }
            //_img.alt = medalType+"周年勋章";
            //_img.title = medalType+"周年勋章";
            _img.style.border = "none";
            _a.appendChild(_img);

            $E("comp_901_head").appendChild(_a);

            // var html ='<a href = "http://control.blog.sina.com.cn/blog_7years/index.php" target = "_blank">'
            // +'<img src = "'+medalObj["medal"+medalType]+'"/>'
            // +'</a>';
            // Core.Dom.insertHTML(headPic,html,'beforeend');
        } else if (!scope.$private.medal && $UID == scope.$uid) {

            var _a = $C("a");
            _a.setAttribute("target", "_blank");
            _a.setAttribute("href", "http://control.blog.sina.com.cn/blog_7years/index.php");
            var _img = $C("img");

            _img.src = "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif";
            _img.className = "sevenyearsIcon";
            if ($IE6) {
                _img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + medalObj["medal0"] + "',sizingMethod='image')";
            } else {
                _img.style.backgroundImage = "url(" + medalObj["medal0"] + ")";
            }
            //_img.alt = medalType+"周年勋章";
            //_img.title = medalType+"周年勋章";
            _img.style.border = "none";
            _a.appendChild(_img);

            $E("comp_901_head").appendChild(_a);
        }
    },
    "load5YearsIcon": function() {
            if (scope.$private.medal7) {
                return; //有7周年的就不渲染5周年的了
            }
            trace('【活动】显示用户勋章。');
            try {
                var text = ['纪念勋章', '一', '二', '三', '四', '五'];
                var medal = scope.$private.medal;
                if (medal > 0 || medal === 0) {
                    var _a = $C("a");
                    _a.setAttribute("target", "_blank");
                    _a.setAttribute("href", "http://control.blog.sina.com.cn/blog_7years/index.php");
                    var _img = $C("img");
                    _img.src = "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif";
                    _img.className = "fiveyearsIcon";
                    if ($IE6) {
                        _img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='http://simg.sinajs.cn/blog7style/images/special/fiveyears/at/" + medal + "y.png',sizingMethod='image')";
                    } else {
                        _img.style.backgroundImage = "url(http://simg.sinajs.cn/blog7style/images/special/fiveyears/at/" + medal + "y.png)";
                    }
                    _img.alt = medal > 0 ? (text[medal] + "周年勋章") : (text[0]);
                    _img.title = medal > 0 ? (text[medal] + "周年勋章") : (text[0]);
                    _img.style.border = "none";
                    _a.appendChild(_img)
                    $E("comp_901_head").appendChild(_a);

                    if ($UID == scope.$uid) {

                        var _span = $C("span");
                        var spanClassName1 = "updateIcon_1";
                        var spanClassName2 = "updateIcon_2";
                        _span.className = spanClassName1;
                        _a.appendChild(_span);
                        var flag = 0;
                        setInterval(function() {
                            if (flag % 2 == 1) {
                                _span.className = spanClassName1;
                                i = 0;
                            } else {
                                _span.className = spanClassName2;
                            };
                            flag++;

                        }, 500);
                    }
                    trace('【活动】显示用户勋章完成。');
                } else {
                    trace('【活动】用户还没有获得勋章。');
                }
            } catch (e) {
                trace('【活动】显示用户勋章发生异常。');
            }
        }
        /*
         * 载入博主照片数
         */
        ,
    "loadPhotoCount": function() {}
        /*
         * 载入博主视频数
         */
        ,
    "loadVideoCount": function() {}
        // 加载广告共享计划管理链接
        ,
    "loadAdManage": function() {
            if ($isAdmin && scope.$private != null && scope.$private.ad != null && scope.$private.ad != 0 && $E("comp_901_adlink") == null) {
                Debug.info("添加广告共享计划管理链接");
                var adHTML = ['<div class="info_locate2"><div class="SG_j_linedot"/></div>' + '<div id="comp_901_adlink" class="info_AD"><a href="http://share.sass.sina.com.cn/widget_ad/widget_ad_index.php"' + ' target="_blank">管理广告共享计划</a></div>'].join("");
                var buttonNode = Core.Dom.getElementsByClass(this.getContent(), "div", "info_txt");
                if (buttonNode) {
                    buttonNode = buttonNode[0].lastChild;
                    Core.Dom.insertHTML(buttonNode, adHTML, "BeforeBegin");
                }
            }
        }
        /*
         * 显示加好友等按钮
         */
        ,
    "showVisitButton": function() {
        if ($isAdmin) {
            return;
        }
        if ($E('info_locate_id')) {
            var p = $E('comp901_btn_invite');
            if (p) {
                p.href = "javascript:void(0)";
                if (this.isFriend == false) {
                    p.innerHTML = "<cite>加好友</cite>";
                    p.onclick = function() {
                        Lib.invite(scope.$uid);
                        return false;
                    };
                } else {
                    p.innerHTML = "<cite>已是好友</cite>";
                    /*if (this.isOnline) {
                     p.onclick = function(){
                     ucClient.chatWith(scope.$uid);
                     return false;
                     };
                     }
                     else {
                     p.onclick = function(){
                     winDialog.alert('该用户不在线，暂不能聊天。', {
                     icon: '02'
                     });
                     return false;
                     };
                     }*/
                }
            }
            p = $E('comp901_btn_sendpaper');
            if (p) {
                p.href = "javascript:void(0)";
                p.onclick = function() {
                    Lib.scrip(scope.$uid);
                    return false;
                };
            }
            p = $E('comp901_btn_msninfo');
            if (p) {
                p.href = 'http://blog.sina.com.cn/s/profile_' + scope.$uid + '.html#write';
            }
            p = $E('comp901_btn_follow');
            if (p) {
                var self = this;
                if (this.isAttentioned) {
                    p.innerHTML = "<cite>已关注</cite>";
                } else {
                    p.innerHTML = "<cite>加关注</cite>";
                }

                p.onclick = function() {
                    if (self.isAttentioned) {
                        self.deleteAttention();
                    } else {
                        Lib.Component.Attention();
                        this.innerHTML = "<cite>已关注</cite>";
                        self.isAttentioned = true;
                    }
                    return false;
                }
            }
            return;
        } else {
            var buttonNode;
            // 加好友按钮的 HTML
            var inviteButtonHTML = '';
            // 访客
            if (this.isFriend == false) {
                inviteButtonHTML = 'Lib.invite(' + scope.$uid + ');return false;" class="SG_aBtn"><cite>加好友';
            } else {
                // 博主在线
                /*if(this.isOnline){
                 inviteButtonHTML = 'ucClient.chatWith(' + scope.$uid + ');;return false;\" class=\"SG_aBtn\"';
                 }else{ // 博主不在线
                 inviteButtonHTML = "winDialog.alert('该用户不在线，暂不能聊天。', {icon : '02'});return false;\" class=\"SG_aBtn SG_aBtn_dis\"";
                 }*/
                inviteButtonHTML += '><cite>已是好友';
            }
            var result = ['<div id="info_locate_id" class="info_locate"><div class="SG_j_linedot"></div>', '<div class="info_btn2">', '<p><a href="#" onclick="' + inviteButtonHTML, '</cite></a>', '<a href="#" onclick="Lib.scrip(' + scope.$uid + ');return false;" class="SG_aBtn">', '<cite>发纸条</cite></a></p>', '<p><a href="http://blog.sina.com.cn/s/profile_' + scope.$uid + '.html#write" class="SG_aBtn" target="_blank">', '<cite>写留言</cite></a>', '<a id="module_901_attention" href="#" onclick="return false;" class="SG_aBtn' + (this.isAttentioned ? ' SG_aBtn_dis' : '') + '">', '<cite onclick="Lib.Component.' + (this.isAttentioned ? ' isAttentioned' : 'Attention') + '();">' + (this.isAttentioned ? '已' : '加') + '关注</cite></a></p>', '<div class="clearit"></div>', '</div></div>'].join("");

            if (this.size == 210) {
                buttonNode = Core.Dom.getElementsByClass(this.getContent(), "div", "info_btn1");
                if (buttonNode) {
                    buttonNode = buttonNode[0];
                    Core.Dom.insertHTML(buttonNode, result, "AfterEnd");
                }
            } else {
                buttonNode = Core.Dom.getElementsByClass(this.getContent(), "div", "info_txt");
                if (buttonNode) {
                    buttonNode = buttonNode[0];
                    Core.Dom.insertHTML(buttonNode, result, "BeforeEnd");
                }
            }
        }
    },

    //地图入口

    mapEnter : function(){
        var module_901 = $E('module_901');
        if (!module_901) {
            return;
        }
        
        info_list = selectClassOnce(module_901, 'info_list', 'div');
        if (info_list) {
            var div = document.createElement('div');
            div.className = 'info_list';
            div.innerHTML = '<a href="http://blog.sina.com.cn/lm/map/" target="_blank" title=""><img src="http://simg.sinajs.cn/blog7style/images/blog_editor/ten_map.png" alt="博客十周年地图"></a>';
            info_list.parentNode.insertBefore(div, info_list);
            Core.Events.addEvent(div.firstChild, function(evt) {
                v7sendLog('15_04_13_' + scope.$uid);
            });
        }





        function selectClassOnce(elem, className, tagName) { //简易选择器
            if (elem.querySelector) {
                var selector = tagName ? tagName + '.' + className : '.' + className;
                return elem.querySelector(selector);
            } else {
                var nodes = elem.getElementsByTagName(tagName || '*') || [],
                    reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
                for (var n = 0; n < nodes.length; n++) {
                    var item = nodes[n];
                    if (reg.test(item.className)) {
                        return item;
                    }
                }
                return null;
            }

        }
    
    
    },
    //十周年
    tenyears: function() {
        var module_901 = $E('module_901');
        if (!module_901) {
            return;
        }

        info_list = selectClassOnce(module_901, 'info_list', 'div');
        if (info_list) {
            var div = document.createElement('div');
            div.className = 'info_list';
            div.innerHTML = '<a href="http://blog.sina.com.cn/lm/ten" target="_blank" title=""><img src="http://simg.sinajs.cn/blog7style/images/blog_editor/ten_182_48.png" alt="博客十周年"></a>';
            info_list.parentNode.insertBefore(div, info_list);
            Core.Events.addEvent(div.firstChild, function(evt) {
                v7sendLog('15_04_13_' + scope.$uid);
            });
        }





        function selectClassOnce(elem, className, tagName) { //简易选择器
            if (elem.querySelector) {
                var selector = tagName ? tagName + '.' + className : '.' + className;
                return elem.querySelector(selector);
            } else {
                var nodes = elem.getElementsByTagName(tagName || '*') || [],
                    reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
                for (var n = 0; n < nodes.length; n++) {
                    var item = nodes[n];
                    if (reg.test(item.className)) {
                        return item;
                    }
                }
                return null;
            }

        }
    },
    // 取消关注
    deleteAttention: function() {
        var self = this;
        winDialog.confirm("是否要取消关注？", {
            funcOk: function() {
                new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_del.php", "jsload").request({
                    GET: {
                        "uid": $UID,
                        "aid": scope.$uid
                    },
                    onSuccess: function() {
                        var attentionButton = $E("comp901_btn_follow");
                        attentionButton.className = "SG_aBtn";
                        attentionButton.innerHTML = '<cite>加关注</cite>';
                        self.isAttentioned = false;
                    },
                    onError: function() {
                        winDialog.alert("取消失败！请重试。");
                    },
                    onFail: function() {
                        winDialog.alert("取消失败！请重试。");
                    }
                });
            },
            funcCancel: function() {
                // Lib.Component.isAttentioned();
                return;
            },
            textOk: "是",
            textCancel: "否"
        });
    }
}, 901);
