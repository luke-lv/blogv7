/**
 * @fileoverview 根据传入的id,将模板样式写入页面
 * @author xinyu@staff.sina.com.cn
 *
 */

(function () {
    window.dwThemeCss = function (ids, type) {

        //如果是选择模板，则清空写入页面上的style，否则不清空-----------------
        if (type && type == 'theme') {
            var styleids = ["tplstyle", "bgcolor", "bgtyle", "heightstyle", "headtyle", "navtyle", "positionstyle"];
//			var styles = $T(document, 'style');
//			for (var i = styles.length - 1; i > 0; i--) {
//				styles[i].parentNode.removeChild(styles[i]);
//			}
            for (var i = 0; i < styleids.length; i++) {
                if ($E(styleids[i])) {
                    $E(styleids[i]).parentNode.removeChild($E(styleids[i]));
                }
            }
        } else if (type && type == 'color') {
            if ($E('tplstyle')) {
                $E('tplstyle').parentNode.removeChild($E('tplstyle'));
            }
            if ($E('bgcolor')) {
                $E('bgcolor').parentNode.removeChild($E('bgcolor'));
            }
            if ($E('heightstyle')) {
                $E('heightstyle').parentNode.removeChild($E('heightstyle'));
            }
            if ($E('positionstyle')) {
                $E('positionstyle').parentNode.removeChild($E('positionstyle'));
            }

            if ($IE) {
                //针对IE，需要特殊处理，选择色系的时候，
                //如果用户使用了自定义的东西，则将这些写到对象的样式中
                //否则，ie的解析机制使得虽然t.css在这些自定义样式的前面插入，
                //但是实际解析却由于是后来插入的而在最后，覆盖了自定义样式
                var divarr = ['', '', 'sinablogb', 'blognavBg', 'sinablogHead'];
                for (i = 2; i < 5; i++) {
                    if (__pageSetVar["customPic_" + i].pid != "no" && __pageSetVar["customPic_" + i].apply == "1") {
                        trace('i=' + i + ";" + $E(divarr[i]).style.cssText + ";");
                        if ($E(divarr[i]).style.cssText == '') {
                            __pageSetVar.funcSetUsePic(i + '');
                        }
                    }
                }
            }
        }
        //-------------------------------------

        if ($IE) {
            var links = SwapLink.getThemeLinks();
            SwapLink.loading = true;
            SwapLink.appendLink(ids, Core.Function.bind3(SwapLink.deleteTLink, SwapLink, [links]));
        } else {
            if ($E('themeLink')) {
                $E("themeLink").href = 'http://simg.sinajs.cn/blog7newtpl/css/' + ids.split("_")[0] + '/' + ids + '/t.css';
            } else {
                var link = $C("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = 'http://simg.sinajs.cn/blog7newtpl/css/' + ids.split("_")[0] + '/' + ids + '/t.css';
                link.id = "themeLink";
                var allLink = $T(document.getElementsByTagName("head")[0], 'link');
                Core.Dom.insertAfter(link, allLink[allLink.length - 1]);
                //                document.getElementsByTagName("head")[0].appendChild(link);
            }
        }
    };

    if ($IE) {
        var SwapLink = {
            getThemeLinks: function () {
                if ($E('themeLink'))
                    return $E('themeLink');
                var cssLinks = document.getElementsByTagName("link"), length = cssLinks.length, d_links = null;
                for (var i = 0; i < length; i++) {
                    var href = cssLinks[i].href;
                    if (href.indexOf("/t.css") != -1)
                        d_links = cssLinks[i];
                }
                return d_links;
            },
            appendLink: function (ids, onloadFunc) {
                var themeLink = this.$CLink('http://simg.sinajs.cn/blog7newtpl/css/' + ids.split("_")[0] + '/' + ids + '/t.css');
                themeLink.onload = onloadFunc;

                //加延迟执行，避免在IE下背景为空白
                setTimeout(function () {
                    var allLink = $T(document.getElementsByTagName("head")[0], 'link');
//					trace('allLink.length='+allLink.length);
                    Core.Dom.insertAfter(themeLink, allLink[allLink.length - 1]);
//					alert(document.getElementsByTagName("head")[0].innerHTML);
//                    document.getElementsByTagName("head")[0].appendChild(themeLink);
                }, 1);

            },
            deleteTLink: function (links) {
                if (links) {
                    links.disabled = "disabled";
                    Core.Dom.removeNode(links);
                }
                this.loading = false;
            },
            $CLink: function (href) {
                var link = $C("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.id = 'themeLink';
                link.href = href;
                return link;
            },
            loading: false
        };
    }

})();
