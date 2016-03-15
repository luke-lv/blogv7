/**
 * @fileoverview 手机订阅 改版
 * @author 常川 | changchuan@staff.sina.com.cn
 * @created 2010-08-10
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/showError.js");
$import("lib/msg/phone_attention.js");
$import("sina/core/events/getEventTarget.js");
/**
 * 绑定手机
 */
scope.PhoneCheck2 = Core.Class.create();
scope.PhoneCheck2.prototype = {
    //按纽是可用或是不可用状态
    buttonState_yidong: true,
    buttonState_liantong: true,
    /**
     * 初始化
     */
    initialize: function(){
        this.attachEvent();
    },
    attachEvent: function(){
        Core.Events.addEvent("iphoneservice1", this.showCopyright.bind2(this));
		Core.Events.addEvent("iphoneservice2", this.showCopyright.bind2(this));
        //绑定移动相关事件    id="mobilenum"  移动同意条款 id="msub_law"  移动同意按钮 id="iphonecheck1"   
        Core.Events.addEvent("msub_law", this.swapButton_yidong.bind2(this));
        Core.Events.addEvent("iphonecheck1", this.add_yidong.bind2(this));
        
        //绑定联通相关事件   id="iphonenum" 联通验证码 id="iphonecode" 同意条款id="agree" 联通确认开通id="iphonecheck2"
        Core.Events.addEvent("agree", this.swapButton_liantong.bind2(this));
        Core.Events.addEvent("iphonecheck2", this.add_liantong.bind2(this));
        
		//取消按钮 id="iphonecancel"  刷新按钮id="refreshbnt"  
        Core.Events.addEvent("iphonecancel", this.cancel.bind2(this));
		Core.Events.addEvent("refreshbnt", this.refresh.bind2(this));
    },
    /**
     * 移动手机添加订阅
     */
    add_yidong: function(){		
        if (!this.buttonState_yidong) {
            return;
        }
        if ($E("mobilenum").value == "") {
            showError("B24002");
            return;
        }
        if (!this.addInterface_yidong) {
            this.addInterface_yidong = new Interface("http://control.blog.sina.com.cn/admin/iphoneattention/check_phonewallet.php", "jsload");
        }
        Lib.checkAuthor();
        if (!$isLogin) {
            new Lib.Login.Ui().login(this.request_yidong.bind2(this));
        }
        else {
            this.request_yidong();
        }
        
    },
    /**
     * 联通手机添加订阅
     */
    add_liantong: function(){
        if (!this.buttonState_liantong) {
            return;
        }
        if ($E("iphonenum").value == "" || $E("iphonecode").value == "") {
            showError("B24006");
            return;
        }
        if (!this.addInterface_liantong) {
            this.addInterface_liantong = new Interface("http://control.blog.sina.com.cn/admin/iphoneattention/check.php", "jsload");
        }
        Lib.checkAuthor();
        if (!$isLogin) {
            new Lib.Login.Ui().login(this.request.bind2(this));
        }
        else {
            this.request_liantong();
        }
    },
    request_yidong: function(){
        var a = "0";
        if ($E("msub_law").checked) {
            a = "1";
        }
        this.addInterface_yidong.request({
            GET: {
                mobilenum: $E("mobilenum").value,
                msub_law: a
            },
            onSuccess: function(data){
                window.location.href = "http://i.blog.sina.com.cn/blogprofile/profilephone.php";
            },
            onError: function(data){
                if (data.code == "B24016") {
                    winDialog.alert('您还未开通博客，请点击<a href="http://login.sina.com.cn/hd/reg_sec.php?entry=blog" target="_blank">这里开通博客</a>，并在开通后完成绑定。', {
                        icon: "03",
                        funcOk: function(){
                            window.open("http://login.sina.com.cn/hd/reg_sec.php?entry=blog", "_blank", "");
                        }
                    });
                }else if (data.code =="B24022"){
					window.location.href = "http://i.blog.sina.com.cn/blogprofile/profilephone.php";
				}
                else {
                    showError(data.code);
                }
            },
            onFail: function(){
            }
        });
    },
    request_liantong: function(){
        var a = "0";
        if ($E("agree").checked) {
            a = "1";
        }
        this.addInterface_liantong.request({
            GET: {
                p: $E("iphonenum").value,
                c: $E("iphonecode").value,
                a: a
            },
            onSuccess: function(data){
                window.location.href = "http://i.blog.sina.com.cn/blogprofile/profilephone.php";
            },
            onError: function(data){
                if (data.code == "B24016") {
                    winDialog.alert('您还未开通博客，请点击<a href="http://login.sina.com.cn/hd/reg_sec.php?entry=blog" target="_blank">这里开通博客</a>，并在开通后完成绑定。', {
                        icon: "03",
                        funcOk: function(){
                            window.open("http://login.sina.com.cn/hd/reg_sec.php?entry=blog", "_blank", "");
                        }
                    });
                }else if (data.code =="B24022"){
					window.location.href = "http://i.blog.sina.com.cn/blogprofile/profilephone.php";
				}
                else {
                    showError(data.code);
                }
            },
            onFail: function(){
            }
        });
    },
	cancel:function()
	{
		if (!this.cancelInterface) {
            this.cancelInterface = new Interface("http://control.blog.sina.com.cn/admin/iphoneattention/cancel_phonewallet.php", "jsload");
        }
		this.cancelInterface.request({
			GET:{r:Math.random()},
			onSuccess:function(){
				window.location.href = "http://i.blog.sina.com.cn/blogprofile/profilephone.php";
			},
			onError:function(data){
				 winDialog.alert('取消失败请重试！', {
                        icon: "03",
                        funcOk: function(){}
                    });
			},
			onFail:function(){}
		});
	},
	refresh:function()
	{
		if (!this.refreshInterface) {
            this.refreshInterface = new Interface("http://control.blog.sina.com.cn/admin/iphoneattention/check_isopen.php", "jsload");
        }
		this.refreshInterface.request({
			GET:{r:Math.random()},
			onSuccess:function(){
				window.location.href = "http://i.blog.sina.com.cn/blogprofile/profilephone.php";
			},
			onError:function(data){
				winDialog.alert('请您按照短信提示完成开通后，再点击按钮继续。', {
                        icon: "03",
                        funcOk: function(){}
                    });
			},
			onFail:function(){}
		});
	},
    /**
     * 移动按钮的不可用状态和可用状态之间切换
     */
    swapButton_yidong: function(){
        var ele = $E("iphonecheck").parentNode;
        var target = Core.Events.getEventTarget();
        if (target.checked) {
            //		ele.parentNode.className="MoNcheck_lawBtn";
            ele.className = "SG_aBtn SG_aBtnB SG_aBtn14";
            this.buttonState = true;
        }
        else {
            //	ele.parentNode.className="MoNcheck_lawBtn2";
            ele.className = "SG_aBtn SG_aBtn14 SG_aBtn_dis";
            this.buttonState = false;
        }
        
    },
    /**
     * 移动按钮的不可用状态和可用状态之间切换
     */
    swapButton_liantong: function(){
        var ele = $E("iphonecheck").parentNode;
        var target = Core.Events.getEventTarget();
        if (target.checked) {
            //		ele.parentNode.className="MoNcheck_lawBtn";
            ele.className = "SG_aBtn SG_aBtnB SG_aBtn14";
            this.buttonState = true;
        }
        else {
            //	ele.parentNode.className="MoNcheck_lawBtn2";
            ele.className = "SG_aBtn SG_aBtn14 SG_aBtn_dis";
            this.buttonState = false;
        }
        
    },
    /**
     * 服务条款的显示
     */
    showCopyright: function(){
        var ele = $E("iphoneservice_content");
        var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div class="shareItemLayer" style="width:auto;" id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
        var content = '<div class="CP_layercon6" style="width:458px;">\
			<div class="mobileLayer">\
                	<div class="law">服务条款：<br/>&nbsp;&nbsp;&nbsp;&nbsp;欢迎您开通并使用新浪博客手机订阅服务（以下简称"手机订阅"）。在注册及使用时请您仔细阅读如下服务条款：本服务条款系由用户与新浪网（www.sina.com.cn以下简称新浪）就新浪提供的手机订阅服务所订立的相关权利义务规范。因此，请在注册成为新浪短信息服务用户前，详细阅读本服务条款的所有内容，当您在我已阅读服务条款项目前打勾后，即视为同意接受本服务条款的所有规范并愿受其约束，本服务条款对您及新浪均具有法律效力。该服务是新浪为用户提供的中文短信服务（英文手机用户及其他不能使用中文短信功能的用户暂时不能享受此项服务），其主要特点是用户可以根据自己的需要手机订阅相应博客，享受新浪及时的、全方位的短信服务（本服务是收费服务，具体服务内容及计费标准参见"资费说明"及"帮助"栏信息）。\
<br/> 一、服务对象  要成为新浪手机订阅服务用户，必须具备下列条件：（1）是与新浪合作提供短信息服务的通讯运营商的合法手机用户；（2）其通讯运营商已经同意并实际能够为其提供短信息服务；（3）完全同意此《新浪短信息服务条款》；（4）完成新浪短信服务的相关注册程序。\
<br/>二、特别提示  （1）新浪将根据实际情况推出各种类型的短信息服务，用户在订阅新浪提供的短信息服务之前，应当确认自己的手机能够正常接收和显示其所订制的服务，如因用户手机问题而不能正常接收和显示新浪发送的短信息，新浪不承担任何责任；（2）用户应妥善保管自己的手机，如用户的手机被他人借用或盗用，借用人或盗用人利用用户手机订制和使用新浪短信息服务所产生的全部费用，应由用户承担。对于因此给用户造成的损失，用户应当追究借用人或盗用人的责任，新浪对此不承担任何责任；（3）用户出国并使用国际漫游服务时，如用户未取消已订制的短信息服务，或者在国际漫游状态下继续使用短信息服务，由此引发的国际通信费用需由用户承担；（4）本手机订阅服务用于对用户博客的提示，若被订阅用户不更新博客，即没有短信产生，新浪不承担任何责任。（5）若因通讯运营商原因造成提醒短信的延后或丢失，新浪对此不承担任何责任。（6）新浪保留给用户发送新服务免费信息的权利。（7）本手机订阅服务暂不支持小灵通用户和广东大众卡。\
<br/>三、计费和缴费  （1）服务的计费周期为：从订制当日到本月月末。收费方式为包月方式，即用户在1个月（1个计费周期）内支付固定的包月费用。（2）新浪为用户提供有偿短信息服务，用户必须为其使用的短信息服务支付费用。具体服务的价格及收费的方式将标明在相应的页面上，用户在选择的同时，代表着同意接受所选短信息服务，而应向新浪支付标明的费用；（3）新浪为用户提供的服务费用，由通讯运营商代收，并且在用户向通讯运营商交纳的费用中优先扣缴。\
<br/>四、服务内容的变更、中断和结束  （1）新浪提供短信息服务需取决于新浪与通讯运营商之间的合作，如新浪与通讯运营商之间的合作终止，则新浪有权随时停止短信息服务的提供，并且无需对此承担任何责任。（2）新浪对因不可抗力、计算机病毒或黑客攻击等造成的服务中断或不能满足用户的要求不承担责任。由于通信线路、网络、用户所在位置、用户关机以及其他任何技术原因而导致用户不能接受信息或阅读短消息时出现乱码，新浪将不承担任何法律责任。（3）用户可随时根据实际情况停止使用新浪提供的手机订阅服务，也可以取消其已订制的手机订阅服务。但是用户应当按照其在订制短信息服务时相应页面上明示的计费及收费方式就新浪已经向其提供的短信息服务向新浪支付相应的短信息服务费用。（4）若用户退订服务，其服务将立即终止，其剩余条数为零。（5）新浪有权判定用户的行为是否符合本服务条款的要求，如果用户违背了本服务条款的规定，新浪有权中断对其提供短信息服务，或者采取其他新浪认为合适的措施。\
<br/>五、用户的帐号，密码和安全性  用户一旦成为新浪短信服务的用户，即可以通过新浪统一账户名和密码访问和使用新浪博客手机订阅服务。用户可随时根据需要改变自己的密码，并应对其密码严格保密。用户若发现任何非法使用或存在安全漏洞的情况，请立即通告新浪。\
<br/>六、赔偿  （1）如因新浪网的过错，导致用户接收到错误的信息并支付了不应支付的短信费用，经查实，新浪将给予用户的全部赔偿为：给予用户相当于不应支付的短信费用2倍的赔偿。赔偿的方式可能为现金赔偿，或免费提供相当于应赔偿金额的额外服务，具体赔偿方式由新浪网决定。（2）如因用户违反本服务条款中的任何规定而给新浪造成任何损失，用户必须赔偿新浪因此遭受的损失，包括但不限于新浪为此支出的律师费用及损害补偿费用等。\
<br/>七、服务条款的变更  新浪有权在必要时修改服务条款，服务条款一旦发生变动，将会在重要页面上提示修改内容或以其他方式通知用户。如果用户不接受服务条款的修改，可以随时停止使用新浪的短信息服务，并可以取消其已订阅的短信息服务。如果用户继续享用短信息服务，则视为接受服务条款的变动。\
<br/>八、通告  所有发给用户的通告都可通过在新浪重要页面的公告。服务条款的修改、服务变更、或其它重要事件的通告都会以此形式进行。\
<br/>九、法律适用  本服务条款的效力和解释均适用中华人民共和国法律，用户和新浪一致同意服从中国法院的管辖。如新浪服务条款与中华人民共和国法律相抵触，则这些条款将完全按法律规定重新解释，而其它条款则依旧保持对用户产生法律效力和影响。\
<br/>十、意见及建议  用户对服务之任何部分或本服务条款的任何部分之意见及建议可通过用户服务部门与新浪联系，具体联系方式如下：中国移动客服电话：4006125880（只收市话费，无长途费用）；125880（只支持移动手机，0.3元/分，无长途话费）新浪网客服电话： 4006900000（外地免长途）\
</div>\
                	<div class="mobLayer_btn">\
                    	<a href="javascript:;" onclick="scope.tiaokuanDialog.hidden();return false;" class="SG_aBtn SG_aBtnB"><cite>知道了</cite></a>\
                    </div>\
            </div>\
		</div>';
        
        scope.tiaokuanDialog = typeof scope.tiaokuanDialog != 'undefined' ? scope.tiaokuanDialog : winDialog.createCustomsDialog({
            tpl: tpl,
            title: "服务条款",
            content: content,
            width: 503,
            height: 285
        }, "tips");
        
        scope.tiaokuanDialog.show();
        scope.tiaokuanDialog.setMiddle();
    }
};
