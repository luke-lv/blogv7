/**
 * @fileoverview 博客夹页tj=tech，改变文章字体大小
 * @author Liu Xiaoyue | xiaoyue3@staff.sina.com.cn
 * @date 2013-04-01
 * @vertion 0.01
 */
$import("lib/jobs.js");
$import("sina/core/events/addEvent.js");

$registJob('articleTjTechFont', function(){
    var bigFontBtn = $E("articleSmallFont");
    var smallFontBtn = $E("articleBigFont");
    var wrap = $E("module_3001_SG_connBody");
    var contentWrap = wrap.children[2];
    //大字体
    Core.Events.addEvent(bigFontBtn,function(){
        var sizeB = bigFontBtn.getAttribute("fontsizebig"); //默认12
        // if(sizeB === "12"){
        //     bigFontBtn.setAttribute("fontsizebig","14");
        //     contentWrap.className = "articalContent blkContainerSblkCon_" + (parseInt(sizeB)+2);
        //     smallFontBtn.setAttribute("fontsizesmall","14");
        //     smallFontBtn.className = "icon_index font_up font_down";
        // }
        if(sizeB === "14"){
            bigFontBtn.setAttribute("fontsizebig","16");
            contentWrap.className = "articalContent blkContainerSblkCon_" + (parseInt(sizeB)+2);
            smallFontBtn.setAttribute("fontsizesmall","16");
            smallFontBtn.className = "icon_index font_up font_down";
        }
        if(sizeB === "16"){
            bigFontBtn.setAttribute("fontsizebig","18");
            contentWrap.className = "articalContent blkContainerSblkCon_" + (parseInt(sizeB)+2);
            smallFontBtn.setAttribute("fontsizesmall","18");
            bigFontBtn.className = "icon_index font_up font_nosize";//最大字体，不能在扩大字体样式
        }
    });
    //小字体
    Core.Events.addEvent(smallFontBtn,function(){
        var sizeS = smallFontBtn.getAttribute("fontsizesmall");//默认12
        if(sizeS === "18"){
            smallFontBtn.setAttribute("fontsizesmall","16");
            contentWrap.className = "articalContent blkContainerSblkCon_" + (parseInt(sizeS)-2);
            bigFontBtn.setAttribute("fontsizebig","16");
            bigFontBtn.className = "icon_index font_up";//最大字体由置灰状态 变成可点状态
        }
        if(sizeS === "16"){
            smallFontBtn.setAttribute("fontsizesmall","14");
            contentWrap.className = "articalContent blkContainerSblkCon_" + (parseInt(sizeS)-2);
            bigFontBtn.setAttribute("fontsizebig","14");
            smallFontBtn.className = "icon_index font_up font_down_disable";//最小字体，不能在缩小字体样式
        }
        // if(sizeS === "14"){
        //     smallFontBtn.setAttribute("fontsizesmall","12");
        //     contentWrap.className = "articalContent blkContainerSblkCon_" + (parseInt(sizeS)-2);
        //     bigFontBtn.setAttribute("fontsizebig","12");
        //     smallFontBtn.className = "icon_index font_up font_down_disable";//最小字体，不能在缩小字体样式
        // }
    });

});

