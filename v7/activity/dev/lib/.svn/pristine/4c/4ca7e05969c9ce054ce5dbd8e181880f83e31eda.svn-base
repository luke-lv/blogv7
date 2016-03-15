/* 
 * 评论回复textarea
 * new CommentV2.CommentArea({container:$E("article_comment_list"),sid:new Date().getTime()});
 * new CommentV2.CommentArea({container:$E("article_comment_list"),sid:new Date().getTime()+1,autolineheight:"yes",shownum:"no"});
 */
$import("lib/commentv2/_comment.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/commentv2/TextAreaUtils.js");
//$import("lib/commentv2/at.js");
$import("lib/commentv2/FaceDialog.js");
//$import("lib/commentv2/toFeedText.js");
$import("sina/core/string/trim.js");
$import("lib/commentv2/autoHeightTextArea.js");
CommentV2.CommentArea = Core.Class.create();
CommentV2.CommentArea.prototype = {
  initialize: function(option) {
    this._container = option.container; //容器
    this._place = option.place || "BeforeEnd";
    this._maxtext = (option.maxtext || 140) * 2; //最大字数
    this._sid = option.sid || new Date().getTime(); //获取唯一标志
    option.shownum = option.shownum || "yes"; //默认显示字数判断
    this._shownum = option.shownum == "yes" ? 1 : 0; //是否显示字数状态行默认显示
    option.autolineheight = option.autolineheight || "no"; //默认不自适应高度
    this._autolineheight = option.autolineheight == "no" ? 0 : 1; //自适应行高
    option.alertnotice = option.alertnotice || "yes";//默认alert提示
    this._alertnotice = option.alertnotice == "yes" ? 1 : 0;//默认alert提示 
    this._maxheight = option.maxheight || 100; //自适应时最大高度
    this._okhandler = option.okhandler || function(){};//发布成功后的回调
    this._initTareBox();
    this._initDom();
    this._bindEvent();
    this._clock = null; //检查焦点位置的时钟
  },
  //设置要回复的数据 @plugs 含有add方法的类 @opt 提交回复接口时所需的所有参数
  setReplyData:function(plugs,opt) {
    this._plugs = plugs;
    this._replaydata = opt;
  },
  //设置值
  setValues:function  (option) {
      var value = option.comment;
      var index = CommentV2.TextAreaUtils.selectionStart(this._tarea);
      //value = CommentV2.ToFeedText(value);//过滤表情和html标签
      this._tarea.value = "";
      CommentV2.TextAreaUtils.insertText(this._tarea, value, index);
      CommentV2.TextAreaUtils.setCursor(this._tarea, 0);
      this._checkNum();
  },
  //读取值
  getValue:function() {
     return this._tarea.value;
  },
  _setTpl: function(argument) {
    this.tpl = [
    // '<li><div class="SG_reply">',
    //   '<div class="SG_reply_con borderc">',
    //   '<div class="bd">',
      '<div id="tare' + this._sid + '">',
      '<div class="count" node-type="num">您还能输入' + (this._maxtext / 2) + '字</div>',
      '<textarea  node-type="textEl"></textarea>',
      '<div class="func"> <a href="#" class="fico" node-type="faceBtn"></a>',
      '<div class="fr">',
      '<label>',
      '<input node-type="shareIpt" type="checkbox">',
      '将评论分享到微博 </label>',
      '<a href="#" class="SG_aBtn btn_reply" node-type="subtnEl"><cite>回复</cite></a></div>',
      '</div>',
      '</div>'
      // '</div>',
      // '</div>',
      // '</div></li>'
    ].join("");
  },
  //初始化评论框
  _initTareBox: function() {
    this._setTpl();
    Core.Dom.insertHTML(this._container, this.tpl, this._place);
    this._selfcontainer = $E("tare" + this._sid);
  },
  //初始化节点
  _initDom: function() {
    var container = this._selfcontainer;
    if (!container) {
      return;
    }
    this._tarea = Core.Dom.getElementsByAttr(container, "node-type", "textEl")[0];
    this._num = Core.Dom.getElementsByAttr(container, "node-type", "num")[0];
    this._subtn = Core.Dom.getElementsByAttr(container, "node-type", "subtnEl")[0];
    this._facebtn = Core.Dom.getElementsByAttr(container, "node-type", "faceBtn")[0];
    this._shareitp = Core.Dom.getElementsByAttr(container, "node-type", "shareIpt")[0];
    this._shareitp.checked = Utils.Cookie.getCookie("acp_bb") == "1" ? false : true;
    if (!this._shownum) {
      this._num.style.display = "none";
    }
  },
  //事件绑定
  _bindEvent: function() {
    var _this = this;
    //this._at = new CommentV2.at(this._tarea);
    //布码
    Core.Events.addEvent(this._shareitp, function(e){
      if(scope.$PRODUCT_NAME == "blog7"){
          v7sendLog("32_01_09");
      }
      if(scope.$PRODUCT_NAME == "blog7icp"){
          v7sendLog("32_01_13");
      }
    }, "click");
    Core.Events.addEvent(this._tarea, this._checkNum.bind2(this), "keydown");
    Core.Events.addEvent(this._tarea, function(e) {
      // body...
      _this._checkNum();
      var e = Core.Events.getEvent();
      var target = e.target || e.srcElement;
      //  var s = CommentV2.TextAreaUtils.selectionStart(target);
      //     //CommentV2.TextAreaUtils.selectText(target,0,s-1);
      // var t =  CommentV2.TextAreaUtils.getCursorPos(target);
      //trace(_this._at.getAtName()+"++")
      _this._checkValue(); //[@]
      // if(e.preventDefault) {
      //    e.preventDefault();
      // }else{
      //    e.returnValue=false;
      // }
      // _this._bindKeyEvent(e);
    }, "keyup");
	
	Core.Events.addEvent(this._tarea, this._bindKeyEvent.bind2(this), "keydown");
    /*********************@功能{******************************/
    /*Core.Events.addEvent(this._tarea, function(e) { //[@]
      //CommentV2.TextAreaUtils.selectText(target,0,s-1);
      //trace(_this._at.getAtName()+"**")
      _this.clock = setInterval(_this._checkValue.bind2(_this), 200);
    }, "focus");
    Core.Events.addEvent(this._tarea, function(e) { //[@]
      //CommentV2.TextAreaUtils.selectText(target,0,s-1);
      //trace(_this._at.getAtName()+"**")
      clearInterval(_this.clock);
    }, "blur");*/
    /*********************}@功能******************************/
    Core.Events.addEvent(this._subtn, function(e) { //提交
      var e = Core.Events.getEvent();
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      _this._submitForm();
    }, "click");
    Core.Events.addEvent(this._facebtn, function(e) { //插入表情
      if(scope.$PRODUCT_NAME == "blog7"){
          v7sendLog("32_01_11");
      }
      if(scope.$PRODUCT_NAME == "blog7icp"){
          v7sendLog("32_01_15");
      }
      var e = Core.Events.getEvent();
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      _this._showFacePanel();
    }, "click");
    if (this._autolineheight) {
      CommentV2.autoHeightTextArea({
        'textArea': this._tarea,
        'maxHeight': this._maxheight,
        'inputListener': function() {
          trace('--autoHeightTextArea--');
        }
      });
    }
  },
  //检查name值
  _checkValue: function() {
    // var key = this._at.getAtName();
  },
  //检查字数
  _checkNum: function() {
    var num = this._getUnoccupiedNum();
    if (this._shownum) {
      var showtext = num >= 0 ? "还可以输入" + num + "字" : "<em class=\"red\">已超出" + (-num) + "字</em>";
      this._num.innerHTML = showtext;
    }
  },
  //判断是否超出字数
  _jsOverflow:function() {
    var num = this._getUnoccupiedNum();
    return num < 0 ? true : false;
  },
  //获取还可输入的字数
  _getUnoccupiedNum:function() {
    var text = this._tarea.value;
    var textlen = this._getLen(text);
    var max = this._maxtext;
    var num = (max - textlen) % 2 == 0 ? (max - textlen) / 2 : (max - textlen - 1) / 2;
    return num;
  },
  //获取字长
  _getLen: function(a) {
    if (!a) {
      return 0;
    }
    var b = a.match(/[^\x00-\xff]/g);
    return a.length + (b ? b.length : 0);
  },
  //绑定键盘事件
  _bindKeyEvent: function(e) {
	// var e = Core.Events.getEvent();
    if (e.keyCode == 13 && e.ctrlKey) {
      this._submitForm();
    }
  },
  //数据验证
  _validate:function() {
     var _this = this;
     if(Core.String.trim(this._tarea.value) == ""){
        winDialog.alert($SYSMSG["B36041"] , {
          icon:"01",
          funcOk: function(){
            _this._tarea.focus();
          }
       });
       return false;
     }
     if(this._jsOverflow()){
       winDialog.alert($SYSMSG["B36208"], {
          icon:"01",
          funcOk: function(){
            _this._tarea.focus();
          }
       });
       return false;
     }
     return true;
     
  },
  //提交
  _submitForm: function() {
    if(scope.$PRODUCT_NAME == "blog7"){
        v7sendLog("32_01_10");
    }
    if(scope.$PRODUCT_NAME == "blog7icp"){
        v7sendLog("32_01_14");
    }
    if(!this._validate()){
      return;
    };
    if(this._plugs){
      this._replaydata.reply_content = Core.String.trim(this._tarea.value);
      this._replaydata.is_t = this._shareitp.checked ? 1 : 0;//是否分享到微博
      this._setShareWbSign();//设置分享到微博标志
      this._plugs.add(this._replaydata,this.successFun.bind2(this),this.errorFun.bind2(this));//调用add方法发布回复内容
    }
  },
  //设置分享到微博标志
  _setShareWbSign:function() {
    if (this._shareitp) {
          if (this._shareitp.checked) {
              if($E("bb")){
                $E("bb").checked = true;
              }
              if (Utils.Cookie.getCookie("acp_bb") == "1") {
                  Utils.Cookie.setCookie("acp_bb", "", -1, "/", ".blog.sina.com.cn");
              }
          }
          else {
              if($E("bb")){
                $E("bb").checked = false;
              }
              if (Utils.Cookie.getCookie("acp_bb") != "1") {
                  Utils.Cookie.setCookie("acp_bb", "1", 2400, "/", ".blog.sina.com.cn");
              }
          }
      }
  },
  //发布成功
  successFun:function(data){
    this._tarea.value = "";
    this._checkNum();
    var _this = this;
    if(this._alertnotice){
      winDialog.alert("发布成功" , {
        icon:"03",
          funcOk: function(){
            _this._plugs.sucOkFun && _this._plugs.sucOkFun();//发布成功点击ok确定后的回调
          }
      });
    }
    this._okhandler();
  },
  //发布失败
  errorFun:function(data) {
    if(scope.$PRODUCT_NAME == "blog7"){
        v7sendLog("32_01_12");
    }
    if(scope.$PRODUCT_NAME == "blog7icp"){
        v7sendLog("32_01_16");
    }
    var errorinfo = data ? $SYSMSG[data.code] : "发布失败，请稍后再试";
    winDialog.alert(errorinfo, {
        icon:"01",
        funcOk: function(){
          _this._plugs.errOkFun && _this._plugs.errOkFun();//发布失败点击ok确定后的回调
        }
    });
  },
  //显示表情模块
  _showFacePanel: function() {
    if (!this.facedialog) {
      this.facedialog = new CommentV2.FaceDialog(this._facebtn, this._tarea);
    } else {
      this.facedialog.show();
    }
  }
};