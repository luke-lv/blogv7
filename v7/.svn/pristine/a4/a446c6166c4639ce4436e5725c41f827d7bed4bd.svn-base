$import('expands/winbox.js');
$import("sina/ui/moduleDialog.js");
$import("editor/tools/uploadimage/UploadImage.js");
$import("sinaEditor/editor_travel.js");

$import("sina/utils/UserData.js");

// var winbox = Lib.Expands.$.WinBox;

// var testdialog = new winbox({
//     title: 'testDialog'
// });

// testdialog.show();


//TODO: 是否采用原生的range执行剪切操作
window.USE_NATIVE = (-1 !== location.href.toString().indexOf('usenative'));
$registJob("editor_travel_init", function() {
    var _disabled = function(range) {
        var res = false,
            start = range.startContainer;
        if (start.nodeType == 3 && start.parentNode.getAttribute('se-img') == 'span') {
            res = true;
        }

        if (start.nodeType == 1 && start.getAttribute('se-img') == 'span') {
            res = true;
        }
        return res;
    };

    var editor = SinaEditor.create({
        root: '#editor',
        focusCls: 'BNE_txtA',
    //BUG: BLOGBUG-14451
        emptyContent: !$IE ? '<p></br></p>' : '<p></p>',
        plugins: [{
            name: 'hotkey',
            params: {
                keylist: [{
                    exec: 'bold',
                    params: null,
                    hotkeys: ['ctrl + b' /*, 'alt +ctrl+ 66'*/ ]
                }, {
                    exec: 'italic',
                    params: null,
                    hotkeys: ['ctrl + i' /*, 'ctrl + alt +73'*/ ]
                }, {
                    exec: 'underline',
                    params: null,
                    hotkeys: ['ctrl + u' /*, 'ctrl + alt + 85'*/ ]
                }, {
                    exec: 'justify',
                    params: function() {
                        var editor = this,
                            state = editor.queryCommandState('justify'),
                            align = {
                                left: 'center',
                                center: 'right',
                                right: 'left'
                            };
                        return align[state] || -1;
                    },
                    hotkeys: 'ctrl + j'
                }]
            }
        }, {
            name: 'basestyle',
            params: {
                disabled: _disabled
            }
        }, {
            name:'undo'
        }, {
            name: 'paste',
            params: {
                getType: function(range) { //图注过滤
                    var res = 'text/html',
                        start = range.startContainer;
                    if (start.nodeType == 3 && start.parentNode.getAttribute('se-img') == 'span') {
                        res = 'text/plain';
                    }

                    if (start.nodeType == 1 && start.getAttribute('se-img') == 'span') {
                        res = 'text/plain';
                    }
                    start = start.parentNode; /*hack for IE*/
                    if (start.nodeType == 1 && start.getAttribute('se-img') == 'span') {
                        res = 'text/plain';
                    }
                        
                    return res;
                }

            }
        }, {
            name: 'enterkey'
        }, {
            name: 'deletekey'
        }, {
            name: 'widget'
        }, {
            name: 'justify'
        }, {
            name: 'justifyBtn'
        }, {
            name: 'title',
            params: {
                disabled: _disabled
            }
        }, {
            name: 'titleBtn'
        }, {
            name: 'initDivContent',
            level: 0
        }, {
            name: 'colorPicker',
            params: {
                //id: 'colorPicker',
                //colors: ['#ccc', '#000', '#ddd'],
                fixTagA : 'skip',
                disabled: _disabled
            }
        }, {
            name: 'colorPickerBtn',
            params: {
                events: {
                    'plugin.colorPickerBtn.ok': function(e, btn, color) {
                        if (btn) {
                            var box = btn.node.childNodes[0];
                            if (color) {
                                box.style.cssText = 'border-bottom:2px solid ' + color
                            } else {
                                box.style.cssText = '';
                            }
                        }
                    }
                }
            }
        }, {
            name: 'link'
        }, {
            name: 'linkBtn'
        }, {
            name: 'image'
        }, {
            name: 'imageBtn'
        }, {
            name: 'music'
        }, {
            name: 'musicBtn'
        }, {
            name: 'video'
        }, {
            name: 'videoBtn'
        },{
            name : 'suda'
        }, {
            name: 'toolBar',
            params: {
                id: 'toolbar',
                name: 'main',
                tpl: '<a class="color1_a" href="javascript:void(0);" id="bold" action="bold"><i class="icon i7_B"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="italic" action="italic"><i class="icon i8_I"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="underline" action="underline"><i class="icon i9_U"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="title_h1_btn" action="titleBtn"><i class="icon i19_title1"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="title_h2_btn" action="groupSpace"><i class="icon i20_title2"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="justify_left_btn" action="justifyBtn"><i class="icon i10_l_alining"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="justify_center_btn" action="groupSpace"><i class="icon i11_c_alining"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="justify_right_btn" action="groupSpace"><i class="icon i12_r_alining"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="link" action="linkBtn"><i class="icon i13_link"></i></a>' +
                    '<a class="color1_a" href="javascript:void(0);" id="colorPicker" action="colorPickerBtn"><i class="icon i14_A"></i></a>' +
                    '<i class="arrow-down"></i>'
            }
        },{
            name : 'travel'
        }]
    });
    if ($macOS) {
        $E('editor').style.fontFamily = "'STHeiti','Microsoft Yahei', 'Simsun'";
    }

    editor.ready(function() {
//    editor.domUtil.on('resizestart', function(e){
//      return false;
//    });
        // editor.focus();
        // editor.setContent([
        //     '<p>“福喜”这名字看上去很中国，其实是一家地道的外资企业——该企业为美国独资，隶属于美国osi集团，而后者是世界上最大的肉类及蔬菜加工集团。福喜生产的加工食品所供应的品牌，除了麦当劳、肯德基和必胜客以外，还包括星巴克、德克士、7-11等十多家我们耳熟能详的洋字号餐饮企业。</p>',
        //     '<p>洋快餐以其方便、卫生、高标准深受相当一部分国人青睐。因为信赖这些快餐食品背后的大公司，我们很少关心一个汉堡、一枚鸡块的原材料来源。然而记者卧底发现，更改生产日期重新上市、冰鲜过期变冰冻、以次充好、臭肉加工……这些丧尽天良的勾当，就堂而皇之地发生在全球知名的食品加工企业里。</p>',
        //     '<p>因涉事企业均为洋字号，因此有评论说“此次事件彻底粉碎了外资食品及餐饮业的高质量、高标准神话”。我很反感这种幸灾乐祸的腔调，一来，生产和销售过期肉的虽是洋企业、洋快餐，把过期肉吃进肚子里的却是中国人；二来，这些洋企业、洋快餐是在中国境内被查出问题，还没听说这些跨国餐饮企业开在国外的分店胆敢卖过期肉。所以，这更像是“南橘北枳”，否则就没有办法解释，为什么上海福喜生产的过期肉类原料“优先安排在中国使用”。</p>'
        // ].join(''));
    });

    window.editor = editor;
});
