/**
 * html整理
 * @constructor
 * @editor
 */
SinaEditor.regist('FilterHTML', function (SE) {
    var dtd = SE.dtd, Util = SE.Util;
    var FH = function (domUtil, opts) {
        this.domUtil = domUtil;
        this.doc = domUtil.doc;
    };
    //document.createRoot = document.createElement;
    //Element.prototype.html = function() {
    //    return this.innerHTML.replace(/&amp;/g, '&');
    //}
    FH.prototype = {
        constructor: SinaEditor.FilterHTML,
        elem: new SinaEditor.Elem,
        //elem: document,
        fillChar: SinaEditor.spaceChar,

        browser: SinaEditor.env,

        isBr: function (node) {
            return node && node.nodeType == 1 && node.tagName == 'BR';
        },

        isEmptyElement: function (node) {
            if (!node) {
                return false;
            }
            if (node.nodeType != 1) {
                return false;
            }
            if (node.childNodes.length > 0) {
                return false;
            }
            var i = 0, elem;
            while ((elem = node.childNodes[i]) && i++) {
                if (elem.nodeType == 1) {
                    return false;
                }
                if (elem.nodeType == 3) {
                    if (Util.trim(elem.nodeValue).replace(new RegExp(fillChar, 'g'), '').length == 0) {
                        return true;
                    }
                }
            }
            return false;
        },

        pasteHtml: function (pasteBinDiv) {
            var div = pasteBinDiv, browser = this.browser, self = this;
            var html, domUtil = this.domUtil;
            if (browser.$webkit) {
                var brs = div.querySelectorAll('div br');
                for (var i = 0, bi; bi = brs[i++];) {
                    var pN = bi.parentNode;
                    if (pN && pN.tagName == 'DIV' && pN.childNodes.length == 1) {
                        pN.innerHTML = '<p><br/></p>';
                        domUtil.remove(pN);
                    }
                }
                var metas = div.querySelectorAll('meta');
                for (var i = 0, ci; ci = metas[i++];) {
                    domUtil.remove(ci);
                }

                var brs = div.querySelectorAll('br');
                for (i = 0; ci = brs[i++];) {
                    if (/^apple-/i.test(ci.className)) {
                        domUtil.remove(ci);
                    }
                }
            }

            if (browser.$firefox) {
                var dirtyNodes = div.querySelectorAll('[_moz_dirty]');
                for (i = 0; ci = dirtyNodes[i++];) {
                    ci.removeAttribute('_moz_dirty');
                }
            }
            if (!browser.$msie) {
                var spans = div.querySelectorAll('span.Apple-style-span');
                for (var i = 0, ci; ci = spans[i++];) {
                    domUtil.remove(ci, true);
                }
            }

            html = div.innerHTML;
            html = this.filterWord(html);
            var rs = this.filterHtml({
                html: html
            }, false, true, false);
            var root = rs.root;
            if (browser.$webkit) {
                if (root.lastChild && self.isBr(root.lastChild)) {
                    root.removeChild(root.lastChild);
                }
                self.domUtil.each(self.domUtil.body.querySelectorAll('div'), function (node) {
                    if (self.isEmptyElement(node) && domUtil.isBlock(node)) {
                        domUtil.remove(node)
                    }
                })

            }
            rs.html = root.html();
            root.root = null;
            return rs.html;
        },

        filterWord: (function (self) {

            //是否是word过来的内容
            function isWordDocument(str) {
                var re = new RegExp( /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument)/ig );
                return re.test(str);
            }

            //去掉小数
            function transUnit(v) {
                v = v.replace(/[\d.]+\w+/g, function (m) {
                    return Util.unit2Pixel(m);
                });
                return v;
            }
            function ensureUnits( v ) {
                v = v.replace(/([\d.]+)([\w]+)?/g, function (m, p1, p2){
                    return (Math.round(parseFloat(p1)) || 1) + (p2 || 'px');
                });
                return v;
            } 
            function filterPasteWord(str) {
                  //remove link break
                  str = str.replace( /\r\n|\n|\r/ig, "" );
                  //remove &nbsp; entities at the start of contents
                  str = str.replace( /^\s*(&nbsp;)+/ig, "" );
                  //remove &nbsp; entities at the end of contents
                  str = str.replace( /(&nbsp;|<br[^>]*>)+\s*$/ig, "" );
                  // Word comments like conditional comments etc
                  str = str.replace( /<!--[\s\S]*?-->/ig, "" );
                  // Remove comments, scripts (e.g., msoShowComment), XML tag, VML content, MS Office namespaced tags, and a few other tags
                  //str = str.replace( /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi, "" );

                  //convert word headers to strong
                  str = str.replace( /<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi, "<p><strong>$1</strong></p>" );
                  //remove lang attribute
                  str = str.replace( /(lang)\s*=\s*([\'\"]?)[\w-]+\2/ig, "" );
                  // Examine all styles: delete junk, transform some, and keep the rest
                  str = str.replace( /(<[a-z][^>]*)\sstyle="([^"]*)"/gi, function( str, tag, style ) {
                      var n = [],
                              i = 0,
                              s = style.replace( /^\s+|\s+$/, '' ).replace( /&quot;/gi, "'" ).split( /;\s*/g );

                      // Examine each style definition within the tag's style attribute
                      for ( var i = 0; i < s.length; i++ ) {
                          var v = s[i];
                          var name, value,
                                  parts = v.split( ":" );

                          if ( parts.length == 2 ) {
                              name = parts[0].toLowerCase();
                              value = parts[1].toLowerCase();
                              // Translate certain MS Office styles into their CSS equivalents
                              switch ( name ) {
                                  case "mso-padding-alt":
                                  case "mso-padding-top-alt":
                                  case "mso-padding-right-alt":
                                  case "mso-padding-bottom-alt":
                                  case "mso-padding-left-alt":
                                  case "mso-margin-alt":
                                  case "mso-margin-top-alt":
                                  case "mso-margin-right-alt":
                                  case "mso-margin-bottom-alt":
                                  case "mso-margin-left-alt":
          //                        case "mso-border-alt":
          //                        case "mso-border-top-alt":
          //                        case "mso-border-right-alt":
          //                        case "mso-border-bottom-alt":
          //                        case "mso-border-left-alt":
                                  case "mso-table-layout-alt":
                                  case "mso-height":
                                  case "mso-width":
                                  case "mso-vertical-align-alt":
                                      n[i++] = name.replace( /^mso-|-alt$/g, "" ) + ":" + ensureUnits( value );
                                      continue;

                                  case "horiz-align":
                                      n[i++] = "text-align:" + value;
                                      continue;

                                  case "vert-align":
                                      n[i++] = "vertical-align:" + value;
                                      continue;

                                  case "font-color":
                                  case "mso-foreground":
                                      n[i++] = "color:" + value;
                                      continue;

                                  case "mso-background":
                                  case "mso-highlight":
                                      n[i++] = "background:" + value;
                                      continue;

                                  case "mso-default-height":
                                      n[i++] = "min-height:" + ensureUnits( value );
                                      continue;

                                  case "mso-default-width":
                                      n[i++] = "min-width:" + ensureUnits( value );
                                      continue;

                                  case "mso-padding-between-alt":
                                      n[i++] = "border-collapse:separate;border-spacing:" + ensureUnits( value );
                                      continue;

                                  case "text-line-through":
                                      if ( (value == "single") || (value == "double") ) {
                                          n[i++] = "text-decoration:line-through";
                                      }
                                      continue;

                                  case "mso-zero-height":
                                      if ( value == "yes" ) {
                                          n[i++] = "display:none";
                                      }
                                      continue;
                              }
                              // Eliminate all MS Office style definitions that have no CSS equivalent by examining the first characters in the name
                              if ( /^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:align|decor|indent|trans)|top-bar|version|vnd|word-break)/.test( name ) ) {
                                  continue;
                              }
                              // If it reached this point, it must be a valid CSS style
                              n[i] = name + ":" + parts[1];        // Lower-case name, but keep value case
                          }
                      }
                      // If style attribute contained any valid styles the re-write it; otherwise delete style attribute.
                      if ( i > 0 ) {
                          return tag + ' style="' + n.join( ';' ) + '"';
                      } else {
                          return tag;
                      }
                  } );
                  str = str.replace( /([ ]+)<\/span>/ig, function ( m, p ) {
                      return new Array( p.length + 1 ).join( '&nbsp;' ) + '</span>';
                  } );

                  return str;
              }

            return function (html) {
                return (isWordDocument(html) ? filterPasteWord(html) : html);
            }
        })(this),

        filterHtml: function (html, ignoreBlank, isDom, noPaste) {
            var startDate = +new Date;
            var self = this;
            var htmlstr = html.html;
            var re_tag = /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\s\/<>]+)\s*((?:(?:"[^"]*")|(?:'[^']*')|[^"'<>])*)\/?>))/g, re_attr = noPaste ? /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:\"([^\"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g : /(id|bookmarktag)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/gi; //只保留bookmarktag

            //ie下取得的html可能会有\n存在，要去掉，在处理replace(/[\t\r\n]*/g,'');代码高量的\n不能去除
            var allowEmptyTags = {
                b: 1,
                code: 1,
                i: 1,
                u: 1,
                strike: 1,
                s: 1,
                tt: 1,
                strong: 1,
                q: 1,
                samp: 1,
                em: 1,
                span: 1,
                sub: 1,
                img: 1,
                sup: 1,
                font: 1,
                big: 1,
                small: 1,
                iframe: 1,
                a: 1,
                br: 1,
                pre: 1
            };
            htmlstr = htmlstr.replace(new RegExp(self.fillChar, 'g'), ''); //特殊空字符过滤
            if (!ignoreBlank) {
                htmlstr = htmlstr.replace(new RegExp('[\\r\\t\\n' + (ignoreBlank ? '' : ' ') + ']*<\/?(\\w+)\\s*(?:[^>]*)>[\\r\\t\\n' + (ignoreBlank ? '' : ' ') + ']*', 'g'), function (a,
                                                                                                                                                                                         b) {
                    //br暂时单独处理
                    if (b && allowEmptyTags[b.toLowerCase()]) {
                        return a.replace(/(^[\n\r]+)|([\n\r]+$)/g, '');
                    }
                    return a.replace(new RegExp('^[\\r\\n' + (ignoreBlank ? '' : ' ') + ']+'), '').replace(new RegExp('[\\r\\n' + (ignoreBlank ? '' : ' ') + ']+$'), '');
                });
            }

            var notTransAttrs = {
                'href': 1,
                'src': 1
            };

            var needParentNode = {
                    'td': 'tr',
                    'tr': ['tbody', 'thead', 'tfoot'],
                    'tbody': 'table',
                    'th': 'tr',
                    'thead': 'table',
                    'tfoot': 'table',
                    'caption': 'table',
                    'li': ['ul', 'ol'],
                    'dt': 'dl',
                    'dd': 'dl',
                    'option': 'select'
                }, needChild = {
                    'ol': 'li',
                    'ul': 'li'
                }, skipTags = {
                    'nav': 1,
                    'article': 1,
                    'title': 1,
                    'header': 1,
                    'aside': 1,
                    'tbcc': 1,
                    'table': 1,
                    'tbody': 1,
                    'input': 1,
                    'iframe': 1,
                    //'style': 1,
                    'textarea': 1,
                    'form': 1,
                    'script': 1,
                    'link': 1,
                    'html': 1,
                    'xml' :1,
                    'meta': 1,
                    'body': 1,
                    'caption': 1,
                    'select': 1,
                    'option': 1,
                    'optgroup': 1,
                    'button': 1,
                    'img': noPaste ? !1 : 1,
                    'video': 1,
                    'audio': 1,
                    'w:sdt': 1,
                    'o:p': 1,
                    'w:sdtpr': 1
                }, changeTags = {
                    'th': 'p',
                    'tr': 'p',
                    'td': 'span',
                    'a': noPaste ? 'a' : 'span',
                    'div': noPaste ? 'div' : 'p'
                };

            function text(parent, data, prevParent) {
                var _par = parent;
                if (prevParent) {
                    if (prevParent.isAddParent) {
                        _par = prevParent;
                    } else if (_par.nodeType == 9) {
                        _par = element(_par, 'p', '', root, null, true);
                    }
                }
                if (needChild[_par.tagName.toLowerCase()]) {
                    _par = element(parent, needChild[_par.tagName], null, null, true);
                    _par = text(_par, data, parent);
                } else {
                    _par.appendChild(self.elem.createTextNode(data));
                }
                return parent;
            }

            function comment(parent, data) {
                var comment = self.elem.createComment(data);
                parent.appendChild(comment);
            }

            function element(parent, tagName, htmlattr, root, prevParent, isAddParent) {
                var needParentTag;
                //要把table转成p和span
                if (skipTags[tagName]) {
                    return parent;
                }

                if (changeTags[tagName]) {
                    tagName = changeTags[tagName];
                }

                if (!dtd[tagName]) { //过滤自定义标签 
                    return parent;
                }

                if (needParentTag = needParentNode[tagName]) {
                    var tmpParent = parent, hasParent;

                    while (tmpParent != root) {
                        if (Util.isArray(needParentTag) ? Util.inArray(needParentTag, tmpParent.tagName.toLowerCase()) : needParentTag == tmpParent.tagName.toLowerCase()) {
                            parent = tmpParent;
                            hasParent = true;
                            break;
                        }
                        tmpParent = tmpParent.parentNode;
                    }
                    if (!hasParent) {
                        var isPrev = false;
                        if (prevParent && prevParent.isAddParent) {
                            isPrev = Util.isArray(needParentTag) ? Util.inArray(needParentTag, prevParent.tagName.toLowerCase()) : needParentTag == prevParent.tagName.toLowerCase();
                        }
                        if (isPrev) {
                            parent = prevParent;
                        } else {
                            parent = element(parent, Util.isArray(needParentTag) ? needParentTag[0] : needParentTag, '', root, parent.lastChild, true)
                        }
                    }

                }
                var elm = self.elem.createElement(tagName), elmAttrs;

                elm.isAddParent = !!isAddParent;
                if (!dtd.$block[tagName] && parent == root) {
                    if (prevParent && prevParent.isAddParent && dtd[prevParent.tagName][tagName]) {
                        parent = prevParent;
                    } else {
                        parent = element(parent, 'p', '', root, true);
                    }
                } else {
                    if (parent.isAddParent && !(Util.isArray(needParentTag) ? Util.inArray(needParentTag, parent.tagName.toLowerCase()) : needParentTag == parent.tagName.toLowerCase())) {
                        parent = parent.parentNode;
                    }
                }
                while (parent && !dtd[parent.tagName][tagName] && parent != root) {
                    parent = parent.parentNode;
                }
                parent.appendChild(elm);
                //按dtd处理嵌套
                //        if(parent.type != 'root' && !dtd[parent.tagName][tagName])
                //            parent = parent.parentNode;

                //如果属性存在，处理属性
                if (htmlattr) {
                    var attrs = {}, match;
                    while (match = re_attr.exec(htmlattr)) {
                        attrs[match[1].toLowerCase()] = notTransAttrs[match[1].toLowerCase()] ? (match[2] || match[3] || match[4]) : Util.unhtml(match[2] || match[3] || match[4])
                    }
                    elmAttrs = attrs;
                }

                if (elmAttrs && noPaste) {
                    self.domUtil.setAttributes(elm, elmAttrs);
                    if (elmAttrs.style) {
                        elm.setAttribute('style', elmAttrs.style);
                    }
                    if (elmAttrs.id) {
                        elm.setAttribute('id', elmAttrs.id);
                    }
                }
                return dtd.$empty[tagName] ? parent : elm
            }

            var match, currentIndex = 0, nextIndex = 0, //root = this.doc.createElement('div');
                root = html.root || self.elem.createRoot('div');
            var currentParent = root;
            while (match = re_tag.exec(htmlstr)) {
                currentIndex = match.index;
                try {
                    if (currentIndex > nextIndex) {
                        //text node
                        currentParent = text(currentParent, htmlstr.slice(nextIndex, currentIndex), currentParent.lastChild);
                    }
                    if (match[3]) {
                        if (dtd.$cdata[currentParent.tagName]) {
                            currentParent = text(currentParent, match[0], currentParent.lastChild);
                        } else {
                            //start tag
                            currentParent = element(currentParent, match[3].toLowerCase(), match[4], root, currentParent.lastChild);

                        }

                    } else if (match[1]) {
                        if (dtd.$block[currTag]) {
                            currentParent = root;
                        }
                        if (currentParent != root) {

                            while (!dtd[currentParent.tagName][match[1]] && currentParent != root) {
                                currentParent = currentParent.parentNode;
                            }

                            if (currentParent == root) {
                                nextIndex = re_tag.lastIndex;
                                continue;
                            }

                            if (dtd.$cdata[currentParent.tagName] && !dtd.$cdata[match[1]]) {
                                currentParent = text(currentParent, match[0], currentParent.lastChild);
                            } else {
                                var currTag = match[1].toLowerCase();

                                if (skipTags[currTag]) {
                                    nextIndex = re_tag.lastIndex;
                                    continue;
                                }
                                if (changeTags[currTag]) {
                                    currTag = changeTags[currTag];
                                }

                                if (needParentNode[currTag]) {
                                    currTag = needParentNode[currTag][0] || needParentNode[currTag];
                                }
                                while (currentParent && !dtd[currentParent.tagName][currTag] && currentParent != root) {
                                    currentParent = currentParent.parentNode;
                                }
                                if (currentParent == root) {
                                    nextIndex = re_tag.lastIndex;
                                    continue;
                                }
                                var tmpParent = currentParent;
                                while (currentParent.nodeType == 1 && currentParent.tagName.toLowerCase() != currTag) {
                                    currentParent = currentParent.parentNode;
                                    if (currentParent == root) {
                                        currentParent = tmpParent;
                                        break;
                                    }
                                }
                                //end tag
                                currentParent = currentParent.parentNode;

                            }

                        }

                    } else if (match[2]) { //注释不要
                        //comment(currentParent, match[2]);
                    }
                } catch (e) {
                    throw new Error(e);
                }

                nextIndex = re_tag.lastIndex;

            }
            if (nextIndex < htmlstr.length) {
                text(currentParent, htmlstr.slice(nextIndex), currentParent.lastChild);
            }
            var html = root.html();
            try {
                console.info('filterHTml time:' + ((+new Date) - startDate) + 'ms')
            } catch (e) {
            }
            if (!isDom) {
                root = null;
                return {
                    html: html
                };
            } else {
                return {
                    html: html,
                    root: root
                }
            }

        }
    }
    return FH;
});
