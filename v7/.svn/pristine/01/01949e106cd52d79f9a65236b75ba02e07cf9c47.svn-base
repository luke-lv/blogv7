 /*
 * @fileoverview 樱花页面右侧景点区域滚动跟随效果
 * @author gaolei | gaolei2@
 * @date   2015-3-12
 */
$import("lib/jobs.js");
$import("comps/jquery.js");

$registJob('adScroll', function(){

    if ($.browser.msie && $.browser.version === 6.0){ // ie6不支持跟随效果
        return;
    }

    // if (!$.browser.msie && $.browser.version != 6.0){

        function canFixed () {
            
            var $side3 = $('.side3'); // 景点区域
            var sidesHeight = $('.sides').height() + $('.sides').offset().top; // 右侧区域整体高度
            var side3Height = $side3.height();  // 景点区域的高度

            if (sidesHeight != 0){
                if ($side3.css('position') == 'fixed'){ // 如果是fixed状态，需要把景点区域高度加到右侧整体区域高度上
                    sidesHeight += side3Height;
                }
            }

            var bottomHeight = 180; // 距离底部高度
            var documentHeight = $(document).height(); // 文档高度
            var scrollTop = $(document).scrollTop(); // 滚动高度

            if (documentHeight - bottomHeight - scrollTop >= side3Height){ // 可以放下景点区域高度状况
                // console.log(documentHeight - bottomHeight - scrollTop)
                if (scrollTop > sidesHeight) { // 把side3 景点定位为fixed
                    $('.side3').css({
                        'position': 'fixed',
                        'top': 0
                    });
                    var height = 0;
                    for (var i=0; i<$('.side3').length; i++){
                        var $node = $('.side3').eq(i);
                        if ($node.css('display') !== 'none'){
                            height = $node.height();
                            break;
                        }
                    }
                    $('.side5').css({
                        'position': 'fixed',
                        'top': height
                    });
                }else {
                    $('.side3').css({
                        'position': 'static',
                        'top': ''
                    });
                    $('.side5').css({
                        'position': 'static',
                        'top': ''
                    });
                }
            }else {
                $('.side3').css({
                    'position': 'static',
                    'top': ''
                });
                $('.side5').css({
                    'position': 'static',
                    'top': ''
                });
            }       
        }

        $(window).on('scroll', canFixed);
        $(window).on('resize', canFixed);

    // }

});
