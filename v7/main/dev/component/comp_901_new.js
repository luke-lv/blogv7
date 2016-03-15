/**
 * @fileoverview
 *  我的动态、关注、收藏、留言、圈子页——个人资料组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/component/class/registComp.js");
$import("component/comp_901.js");

$registComp(901, {
        "loadBadge": function (data) {
            var names = ["点亮荣誉勋章", "新新博主", "新锐博主", "先锋博主", "精英博主", "风云博主", "资深博主", "元老博主", 0, 0, "图片博主", "兑换图片博主服务",
                "私密博文", "兑换私密博文"];
            var aTpl = '<a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_action.php" title="[title]"><i title="[title]" alt="[title]" class="lisp_icon" style="background-image:url([imgPath].png);_background-image: url([imgPath].gif);"></i></a>';
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
            var htmlStr = '';
            for (var i = 0; i < badges.length; i++) {
                var item = badges[i];
                var n = item.medal < 10 ? ("0" + item.medal) : item.medal;
                imgPath = "http://simg.sinajs.cn/blog7style/images/common/badge/badge" + n;
                htmlStr += aTpl.replace(/\[imgPath\]/g, imgPath).replace(/\[title\]/g, item.title);
            }
            Core.Dom.insertHTML(el, htmlStr, "beforeend");
        },
        /*
         * 显示加好友等按钮
         */
        "showVisitButton": function () {
            if ($isAdmin) {
                return;
            }
            if ($E('info_locate_id')) {
                var p = $E('comp901_btn_invite');
                if (p) {
                    p.href = "javascript:void(0)";
                    if (this.isFriend === false) {
                        p.innerHTML = "<cite>加好友</cite>";
                        p.onclick = function () {
                            if (!$isLogin) {
                                v7sendLog('48_01_28');
                            }
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
                    p.onclick = function () {
                        if (!$isLogin) {
                            v7sendLog('48_01_27');
                        }
                        Lib.scrip(scope.$uid);
                        return false;
                    };
                }
                p = $E('comp901_btn_msninfo');
                if (p) {
                    p.onclick = function () {
                        if (!$isLogin) {
                            v7sendLog('48_01_29');
                        }
                    };
                    p.href = 'http://blog.sina.com.cn/s/profile_' + scope.$uid + '.html#write';
                }
                p = $E('comp901_btn_follow');
                if (p) {
                    var self = this;
                    if (this.isAttentioned) {
                        p.innerHTML = "<cite>已关注</cite>";
                    } else {
                        p.innerHTML = '<cite><i class="icon i31_jia"></i>加关注</cite>';
                    }

                    p.onclick = function () {
                        if (self.isAttentioned) {
                            self.deleteAttention();

                        } else {
                            Lib.Component.Attention();
                            this.innerHTML = "<cite>已关注</cite>";
                            self.isAttentioned = true;
                        }
                        return false;
                    };
                }
                return;
            } else {
                var buttonNode;
                // 加好友按钮的 HTML
                var inviteButtonHTML = '';
                // 访客
                if (this.isFriend === false) {
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
                var result = ['<div id="info_locate_id" class="info_locate"><div class="SG_j_linedot"></div>',
                    '<div class="info_btn2">', '<p><a href="#" onclick="' + inviteButtonHTML, '</cite></a>',
                        '<a href="#" onclick="Lib.scrip(' + scope.$uid + ');return false;" class="SG_aBtn">',
                    '<cite>发纸条</cite></a></p>',
                        '<p><a href="http://blog.sina.com.cn/s/profile_' + scope.$uid + '.html#write" class="SG_aBtn" target="_blank">',
                    '<cite>写留言</cite></a>',
                        '<a id="module_901_attention" href="#" onclick="return false;" class="SG_aBtn' + (this.isAttentioned ? ' SG_aBtn_dis' : '') + '">',
                        '<cite onclick="Lib.Component.' + (this.isAttentioned ? ' isAttentioned' : 'Attention') + '();">' + (this.isAttentioned ? '已' : '加') + '关注</cite></a></p>',
                    '<div class="clearit"></div>', '</div></div>'].join("");

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
        // 取消关注
        deleteAttention: function () {
            var self = this;
            winDialog.confirm("是否要取消关注？", {
                funcOk: function () {
                    new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_del.php", "jsload").request({
                        GET: {
                            "uid": $UID,
                            "aid": scope.$uid
                        },
                        onSuccess: function () {
                            var attentionButton = $E("comp901_btn_follow");
                            attentionButton.className = "BNE_btn";
                            attentionButton.innerHTML = '<cite><i class="icon i31_jia"></i>加关注</cite>';
                            self.isAttentioned = false;
                        },
                        onError: function () {
                            winDialog.alert("取消失败！请重试。");
                        },
                        onFail: function () {
                            winDialog.alert("取消失败！请重试。");
                        }
                    });
                },
                funcCancel: function () {
                    // Lib.Component.isAttentioned();
                    return;
                },
                textOk: "是",
                textCancel: "否"
            });
        }
    }, 901);

