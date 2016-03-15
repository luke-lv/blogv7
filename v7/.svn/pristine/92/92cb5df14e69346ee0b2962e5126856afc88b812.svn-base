/**
 * @fileoverview 相关博文定向投放
 * @authors yifei (yifei2@staff.sina.com.cn)
 * @date    2013-09-10 16:27:42
 */

$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertHTML.js");

$registJob("xgBlogAD", function(){
  var newVersion = (scope.$pageid == 'articleM_new' || scope.$pageid == 'article_new');
  var $getByClass = Core.Dom.getElementsByClass;
  var $insertHTML = Core.Dom.insertHTML;

  var xgWrap = $E('module_903');
  var bodyWrapper, secondLi, thirdLi, liCount, moreWrapper;
  // var sloturl = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pagexg.php';
  var sloturl = 'http://comet.blog.sina.com.cn/api?maintype=pagexg';
  
  var sourceID = 'SLOT_89';
  // 广告模板
  var adTpl_xg1 = '<li class="SG_j_linedot1">'
          + '<p class="atcTitCell_tit SG_dot">'
          +   '<a {{a_c_suda}} href="{{a_href}}" target="_blank" title="{{a_title}}">{{words}}</a>'
          + '</p>'
          + '<p class="atcTitCell_nm">'
          +   '<a {{a_c_suda}} href="{{a_href}}" class="SG_linkb" target="_blank">{{author}}</a>'
          + '</p>'
          + '</li>';
  var adTpl_xg2 = '<li class="reco_bloglist_con">'
          + '<span class="blogname">'
          + '<a {{a_c_suda}} onclick="v7sendLog(\'41_01_07\');" href="{{a_href}}" target="_blank" title="{{a_title}}">{{words}}</a>'
          + '</span>'
          + '<span class="bloguser">'
          + '<a {{a_c_suda}} onclick="v7sendLog(\'41_01_07\');" class="SG_linkb" href="{{a_href}}" target="_blank">{{author}}</a>'
          + '</span>'
          + '</li>';
  var adTpl_xg3 = '<li>'
          + '<p class=Ltit>'
          +   '<a {{a_c_suda}} class="BNE_lkA" href="{{a_href}}" target="_blank" title="{{a_title}}"><i class="icon i7_dot"></i>{{words}}</a>'
          + '</p>'
          + '<p class="Lname">'
          +   '<a {{a_c_suda}} class="BNE_lkB" href="{{a_href}}" class="SG_linkb" target="_blank">{{author}}</a>'
          + '</p>'
          + '</li>';
  var adTpl_common1 = '<li class="SG_j_linedot1">'
          + '<p class="atcTitCell_tit SG_dot">'
          +   '<a {{a_c_suda}} href="{{a_href}}" target="_blank" title="{{a_title}}">{{a_title}}</a>'
          + '</p>'
          + '<p class="atcTitCell_nm">'
          +   '<a {{a_c_suda}} href="http://blog.sina.com.cn/u/{{uid}}" class="SG_linkb" target="_blank">{{author}}</a>'
          + '</p>'
          + '</li>';
  var adTpl_common2 = '<li class="reco_bloglist_con">'
          + '<span class="blogname">'
          + '<a {{a_c_suda}} onclick="v7sendLog(\'41_01_07\');" href="{{a_href}}" target="_blank" title="{{a_title}}">{{a_title}}</a>'
          + '</span>'
          + '<span class="bloguser">'
          + '<a {{a_c_suda}} onclick="v7sendLog(\'41_01_07\');" class="SG_linkb" href="http://blog.sina.com.cn/u/{{uid}}" target="_blank">{{author}}</a>'
          + '</span>'
          + '</li>';
  var adTpl_common3 = '<li>'
          + '<p class=Ltit>'
          +   '<a {{a_c_suda}} class="BNE_lkA" href="{{a_href}}" target="_blank" title="{{a_title}}"><i class="icon i7_dot"></i>{{a_title}}</a>'
          + '</p>'
          + '<p class="Lname">'
          +   '<a {{a_c_suda}} class="BNE_lkB" href="http://blog.sina.com.cn/u/{{uid}}" class="SG_linkb" target="_blank">{{author}}</a>'
          + '</p>'
          + '</li>';

    

  // 模板函数
  function tplToData(template, data) {
    var t, key, reg;
    
    //遍历该数据项下所有的属性，将该属性作为key值来查找标签，然后替换
    for (key in data) {
      reg = new RegExp('{{' + key + '}}', 'ig');
      t = (t || template).replace(reg, data[key]);
    }
    return t;
  }

  // 请求接口获取广告数据
  function reqData() {
    Utils.Io.JsLoad.request(sloturl, {
      GET : {
        id : sourceID,
        uid : $UID || 0,
        blogerid : scope.$uid || 0
      },
      onComplete : function(res){
        var data = null;

        if(res[sourceID]) {
          data = res[sourceID].res[0];
        }

        if(data) {
          // 判断tj=2页面还是普通博文页
          if(scope.$pageid == 'articletj') {
            var htmlxg2 = tplToData(adTpl_xg2, data);
            $insertHTML(secondLi, htmlxg2, 'AfterEnd');
          }else if(newVersion){
            var htmlxg3 = tplToData(adTpl_xg3, data);
            $insertHTML(secondLi, htmlxg3, 'AfterEnd');
          }else {
            var htmlxg1 = tplToData(adTpl_xg1, data);
            $insertHTML(secondLi, htmlxg1, 'AfterEnd');
          }
          
          // 相关博文第三条布码
          if(SUDA) {
            SUDA.uaTrack(data.a_v_suda_key, data.a_v_suda_value);
          }
        }

        reqRelatedBlog();
      },
      onException: function(res) {
      }
    });
  }

  // 相关博文接口
  function reqRelatedBlog() {
    var articleId = scope.$articleid;
    var cateId = scope.$cate_id;
    var sortId = scope.$sort_id;
    if(articleId) {
      var url = 'http://blog.sina.com.cn/s/related_' + articleId + '.js';
      var reqdata = {
        cate_id : cateId,
        sort_id : sortId
      };
      bodyWrapper = newVersion ? $getByClass(xgWrap, 'ul','crlaList') : $getByClass(xgWrap,'div','SG_connBody');
      moreWrapper = newVersion ? $getByClass(xgWrap,'div',"more") : $getByClass(xgWrap, 'div', "atcTit_more");

      if(scope.$pageid == 'articletj') {
        liCount = $getByClass(bodyWrapper[0], 'li', "reco_bloglist_con").length;
      } else if(newVersion){
        liCount = $getByClass(bodyWrapper[0], 'li',"").length;
      }else {
        liCount = $getByClass(bodyWrapper[0], 'li', "SG_j_linedot1").length;
      }
      // 存在相关博文，不请求接口
      if(liCount > 3) {
        return;
      }
      
      Utils.Io.Ajax.request(url, {
        returnType: 'json',
        GET : reqdata,
        onComplete : function(res){
          var res2 = res.slideReads;
          var res = res.relatedReads;
          // 判断tj=2页面还是普通博文页
          if(scope.$pageid == 'articletj') {
            var ulNode = $getByClass(bodyWrapper[0], 'ul', "reco_bloglist have_user")[0];
            if(ulNode) {
              for(var i=0;i<res.length;i++) {
                var htmlcommon2 = tplToData(adTpl_common2, res[i]);
                $insertHTML(ulNode, htmlcommon2, 'BeforeEnd');
              }
            }
          } else if(newVersion){
            var ulNode = bodyWrapper[0];
            if(ulNode){
              for(var i=0;i<res.length;i++) {
                var htmlcommon3 = tplToData(adTpl_common3, res[i]);
                $insertHTML(ulNode, htmlcommon3, 'BeforeEnd');
              }
            }   
          }else {
            var ulNode = $getByClass(bodyWrapper[0], 'ul', "")[0];
            if(ulNode) {
              for(var i=0;i<res.length;i++) {
                var htmlcommon1 = tplToData(adTpl_common1, res[i]);
                $insertHTML(ulNode, htmlcommon1, 'BeforeEnd');
              }
            }
          }
          // 更多节点
          var moreNode = $getByClass(moreWrapper[0], 'a', "")[0];
          if(moreNode) {
            if(sortId == '111') {
              moreNode.setAttribute('href', 'http://finance.sina.com.cn/blog/8.html');
            }else if(sortId == '153') {
              moreNode.setAttribute('href', 'http://finance.sina.com.cn/blog/2.html');
            }
          }

                    if(typeof window.scope.___fnForListenerSlot === 'function') {
                        window.scope.___fnForListenerSlot(res2);//等待相关文章接口回调。
                    } else {
                        window.scope.___fnForListenerSlot = res2;
                    }
                    
        },
        onException: function(res) {
        }
      });
    }
  }

  // 判断tj=2页面还是普通博文页
  if(scope.$pageid == 'articletj') {
    bodyWrapper = $getByClass(xgWrap, 'div', "SG_connBody");
    secondLi = $getByClass(bodyWrapper[0], 'li', "reco_bloglist_con")[1];
    
  }else if(newVersion){
    bodyWrapper = $getByClass(xgWrap, 'ul', "crlaList");
    secondLi = $getByClass(bodyWrapper[0], 'li','')[1];
  }else {
    bodyWrapper = $getByClass(xgWrap, 'div', "SG_connBody");
    secondLi = $getByClass(bodyWrapper[0], 'li', "SG_j_linedot1")[1];
  }

  if(secondLi) {
    reqData();
  }
  
});
