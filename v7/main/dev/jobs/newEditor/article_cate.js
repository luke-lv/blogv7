/**
 * 新编辑器博文分类功能开发
 * @author gaolei2@
 */
$import("sina/sina.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/events/fixEvent.js");
// $import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopDefaultEvent.js");

$import("lib/classUtils.js");
$import("lib/util/hoverJq.js");


$registJob("article_cate", function () {

    var __addEvent = Core.Events.addEvent,
        __fixEvent = Core.Events.fixEvent,
        // __removeEvent = Core.Events.removeEvent,
        __stopDefault = Core.Events.stopDefaultEvent,
        __classUtil = new Lib.classUtils();


    var blogCateSelect = $E('blog_cate_select'),                // 选择博文分类区域
        blogCateList = $E('blog_cate_list'),                    // 博文分类列表区域
        blogCateSelectedList = $E('blog_cate_selected_list'),   // 已经选择的博文分类，私密博主分类默认为私密，其他博主默认无分类

        componentSelect = $E('componentSelect');                // 原始的选择博文分类select框

    if (!blogCateSelect || !blogCateList || !blogCateSelectedList){  // 都没有，啥都不用做了。。。
        return;
    }

    // 点击 选择博文分类
    __addEvent(blogCateSelect, function(e){
        v7sendLog('16_01_21');
        var iNode = blogCateSelect.getElementsByTagName('i')[0];
        
        if (blogCateList.style.display == 'none'){
            // 显示
            blogCateList.style.display = '';
            blogCateSelectedList.style.display = 'none';
            // 箭头向上
            __classUtil.delClass(iNode, 'i2_darr');
            __classUtil.addClass(iNode, 'i3_uarr');

        }else{
            // 隐藏
            blogCateList.style.display = 'none';
            blogCateSelectedList.style.display = '';
            // 箭头向下
            __classUtil.delClass(iNode, 'i3_uarr');
            __classUtil.addClass(iNode, 'i2_darr');
        }
        __stopDefault(e);
    });

    // 点击 博文分类列表
    __addEvent(blogCateList, function(e){
        e = __fixEvent(e);
        var iNode = blogCateSelect.getElementsByTagName('i')[0];
        var elem = findTarget(blogCateList, e.target, 'li');
        // elem html : <li cate_value="1"><span class="dot"></span><a class="sort_by" href="javascript:void(0);">test</a></li>
        if (elem){
            
            var cateValue = elem.getAttribute('cate_value');
            if (cateValue == '0'){
                __classUtil.addClass($E('is_private_blog'), 'btn_cur');
                $E('xRankRadio').checked = 'checked';
            }else{
                __classUtil.delClass($E('is_private_blog'), 'btn_cur');
                $E('xRankRadio').checked = '';
            }
            componentSelect.value = cateValue;

            var cateText = elem.getElementsByTagName('a')[0];
            cateText = cateText.innerText || cateText.textContent;
            var newLi = $C('li');
            newLi.setAttribute('cate_value', cateValue);
            newLi.innerHTML = '<span class="dot"></span><a class="sort_by" href="javascript:;return false;"><span class="dot_cont">'+ cateText +'<i class="dot_hover2" onclick="deleteArticleCate();" ></i></span></a>';

            blogCateSelectedList.innerHTML = '';
            blogCateSelectedList.appendChild(newLi);

            if ($IE6){
                var hoverElem = blogCateSelectedList.getElementsByTagName('li')[0];
                Lib.util.hoverJq({
                    elm: hoverElem,
                    mouseenter: function(evt, el, index){
                        var a = el.getElementsByTagName('a')[0];
                        __classUtil.addClass(a, 'sort_close');
                    },
                    mouseleave: function(evt, el, index){
                        var a = el.getElementsByTagName('a')[0];
                        __classUtil.delClass(a, 'sort_close');
                    }
                });
            }

            
            blogCateSelectedList.style.display = '';
            blogCateList.style.display = 'none';

            __classUtil.delClass(iNode, 'i3_uarr');
            __classUtil.addClass(iNode, 'i2_darr');
        }

    });

    function findTarget(parent, target, tag){

        while(target !== parent){
            if (target.tagName.toLowerCase() == tag){
                return target;
            }
            target = target.parentNode;
        }
    }

    window.deleteArticleCate = function(){
        var __classUtil = new Lib.classUtils();
        var cateList = $E('blog_cate_selected_list'),
            componentSelect = $E('componentSelect'),
            isPrivateBlog = $E('is_private_blog'),
            xRankRadio = $E('xRankRadio');         // 文章是否仅自己可见
        
        __classUtil.delClass(isPrivateBlog, 'btn_cur');

        xRankRadio.checked = '';

        cateList.innerHTML = '';
        cateList.style.display = 'none';

        componentSelect.value = '00';

        return false;
    };

});
