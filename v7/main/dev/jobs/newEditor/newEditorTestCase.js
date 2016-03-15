// 测试
if (window.QUnit) {
	QUnit.config.autorun = false;
}

// 新版编辑器测试用例
$registJob("newEditorTestCase", function(){
    //QUnit.config.autorun = false;

	if (!window.QUnit) {
		return;

	}
    var selection, domUtil,
        $ = Lib.Expands.$,
        editor = SinaEditor.get(0);


    var initHtml = [
            '<p>“福喜”这名字看上去很中国，其实是一家地道的外资企业——该企业为美国独资，隶属于美国osi集团，而后者是世界上最大的肉类及蔬菜加工集团。福喜生产的加工食品所供应的品牌，除了麦当劳、肯德基和必胜客以外，还包括星巴克、德克士、7-11等十多家我们耳熟能详的洋字号餐饮企业。</p>',
            '<p>洋快餐以其方便、卫生、高标准深受相当一部分国人青睐。因为信赖这些快餐食品背后的大公司，我们很少关心一个汉堡、一枚鸡块的原材料来源。然而记者卧底发现，更改生产日期重新上市、冰鲜过期变冰冻、以次充好、臭肉加工……这些丧尽天良的勾当，就堂而皇之地发生在全球知名的食品加工企业里。</p>',
            '<p>因涉事企业均为洋字号，因此有评论说“此次事件彻底粉碎了外资食品及餐饮业的高质量、高标准神话”。我很反感这种幸灾乐祸的腔调，一来，生产和销售过期肉的虽是洋企业、洋快餐，把过期肉吃进肚子里的却是中国人；二来，这些洋企业、洋快餐是在中国境内被查出问题，还没听说这些跨国餐饮企业开在国外的分店胆敢卖过期肉。所以，这更像是“南橘北枳”，否则就没有办法解释，为什么上海福喜生产的过期肉类原料“优先安排在中国使用”。</p>'
        ].join('');

    var TestTools = {
        setSelection: function(o){
            var sel = editor.selection;
            if ('string' == typeof o) {
                o = editor.domUtil.$(o, editor.body)[0];
            }
            var rng = sel.createRange();
            
            rng.setStartBefore(o);
            rng.setEndAfter(o);
            rng.select();
            return rng;
            //rng.selectNode(o);
        },
        setContent: function(html){
            editor.setContent(html);
        },
        getNRange: function(rng){
            rng = rng || editor.selection.getRange();
            var nRng = editor.selection.getNativeRange();
            if (!nRng) {
                nRng = document.createRange();
            }
            nRng.setStart(rng.startContainer, rng.startOffset);
            nRng.setEnd(rng.endContainer, rng.endOffset);
            return nRng;
        },
        getHtml: function(node){
            var tmpDiv = editor.doc.createElement('div');
            tmpDiv.appendChild(node);
            return tmpDiv.innerHTML;
        }
    }

    var Task = function(cfg){
        var self = this, queue = [];
        var next = function(){
            function process(){
                var current = queue.shift();
                current && current(next);
            }
            if (cfg.delay) {
                setTimeout(function(){
                    process();
                }, cfg.delay);
            } else {
                process();
            }
        }

        self.then = function(fun){
            queue.push(fun);
            return self;
        };

        self.start = function(){
            next();
            return self;
        };

    };


    module('Module-RangeTest');

    test('测试cloneContents克隆firstChild', function(){
        TestTools.setContent('<p><em>Th</em>is <strong>is first</strong> child</p><p>test1</p>');
        editor.focus();
        var rng = TestTools.setSelection('p');
        var frag = rng.cloneContents();
        var tmpDiv = editor.doc.createElement('div');
        tmpDiv.appendChild(frag);
        equal(tmpDiv.innerHTML, '<p><em>Th</em>is <strong>is first</strong> child</p>', '克隆第一个节点通过!');
    });
    test('测试cloneContents克隆中间的节点', function(){
        TestTools.setContent('<p><em>Th</em>is <strong>is first</strong> child</p><p>test1</p><p>third line</p>');
        editor.focus();
        var middleNode = editor.domUtil.$('p')[1];
        var rng = TestTools.setSelection(middleNode);
        
        var frag = rng.cloneContents();
        var tmpDiv = editor.doc.createElement('div');
        tmpDiv.appendChild(frag);
        equal(tmpDiv.innerHTML,'<p>test1</p>', '测试克隆返回值!');
    });
    test('测试克隆最后一个节点', function(){
        TestTools.setContent('<p><em>Th</em>is <strong>is first</strong> child</p><p>test1</p>');
        editor.focus();
        var lastNode = editor.domUtil.$('p')[1];
        var rng = TestTools.setSelection(lastNode);
        var frag = rng.cloneContents();
        var tmpDiv = editor.doc.createElement('div');
        tmpDiv.appendChild(frag);
        equal(tmpDiv.innerHTML,'<p>test1</p>', '测试克隆的html与最后一个节点的html相等');
    });

    test('测试克隆startContainer为TextNode节点的情况', function(){

        TestTools.setContent('<p><em>Th</em>is <strong>is first</strong> child</p><p>test1</p>');
        editor.focus();
        //expect(3);
        
        var firstNode = editor.domUtil.$('p')[0];
        var firstTxt  = firstNode.childNodes[0].childNodes[0];
        var testHtml = '', frag, start, end, offset;

        
        var rng = editor.selection.createRange();

        rng.setStart(firstTxt, 0);
        rng.setEnd(firstTxt, firstTxt.nodeValue.length);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'Th'
            , 'Message: <p><em>[Th]</em>is <strong>is first</strong> child</p><p>test1</p>');

        rng.setStart(firstTxt, 1);
        rng.setEnd(firstTxt, firstTxt.nodeValue.length);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'h'
            , 'Message: <p><em>T[h]</em>is <strong>is first</strong> child</p><p>test1</p>');

        rng.setStart(firstTxt, 2);
        rng.setEnd(firstTxt, firstTxt.nodeValue.length);
        frag = rng.cloneContents();
        equal(frag.hasChildNodes(), false
            , 'Message: <p><em>Th[]</em>is <strong>is first</strong> child</p><p>test1</p>');

        rng.setStart(firstTxt, 0);
        rng.setEndAfter(firstNode.childNodes[0]);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>'
            , 'Message: <p><em>[Th</em>]is <strong>is first</strong> child</p><p>test1</p>');

        rng.setStart(firstTxt, 1);
        rng.setEndAfter(firstNode.childNodes[0]);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>h</em>'
            , 'Message: <p><em>T[h</em>]is <strong>is first</strong> child</p><p>test1</p>');

        rng.setStart(firstTxt, 2);
        rng.setEndAfter(firstNode.childNodes[0]);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em></em>'
            , 'Message: <p><em>Th[</em>]is <strong>is first</strong> child</p><p>test1</p>');

        rng.setStart(firstTxt, 0);
        rng.setEnd(firstNode, firstNode.childNodes.length - 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong>is first</strong>'
            , 'Message: <p><em>[Th</em>is <strong>is first</strong>] child</p><p>test1</p>');

        rng.setStart(firstTxt, 1);
        rng.setEnd(firstNode, firstNode.childNodes.length - 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>h</em>is <strong>is first</strong>'
            , 'Message: <p><em>T[h</em>is <strong>is first</strong>] child</p><p>test1</p>');

        rng.setStart(firstTxt, 2);
        rng.setEnd(firstNode, firstNode.childNodes.length - 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em></em>is <strong>is first</strong>'
            , 'Message: <p><em>Th[</em>is <strong>is first</strong>] child</p><p>test1</p>');

        rng.setStart(firstTxt, 0);
        rng.setEnd(firstNode, firstNode.childNodes.length);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong>is first</strong> child'
            , 'Message: <p><em>[Th</em>is <strong>is first</strong> child]</p><p>test1</p>');

        rng.setStart(firstTxt, 1);
        rng.setEnd(firstNode, firstNode.childNodes.length);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>h</em>is <strong>is first</strong> child'
            , 'Message: <p><em>T[h</em>is <strong>is first</strong> child]</p><p>test1</p>');

        rng.setStart(firstTxt, 2);
        rng.setEnd(firstNode, firstNode.childNodes.length);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em></em>is <strong>is first</strong> child'
            , 'Message: <p><em>Th[</em>is <strong>is first</strong> child]</p><p>test1</p>');

        rng.setStart(firstTxt, 0);
        rng.setEndAfter(firstNode);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<p><em>Th</em>is <strong>is first</strong> child</p>'
            , 'Message: <p><em>[Th</em>is <strong>is first</strong> child</p>]<p>test1</p>');

        rng.setStart(firstTxt, 0);
        rng.setEndAfter(firstNode);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<p><em>Th</em>is <strong>is first</strong> child</p>'
            , 'Message: <p><em>[Th</em>is <strong>is first</strong> child</p>]<p>test1</p>');

        rng.setStart(firstTxt, 1);
        rng.setEndAfter(firstNode);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<p><em>h</em>is <strong>is first</strong> child</p>'
            , 'Message: <p><em>T[h</em>is <strong>is first</strong> child</p>]<p>test1</p>');

        rng.setStart(firstTxt, 2);
        rng.setEndAfter(firstNode);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<p><em></em>is <strong>is first</strong> child</p>'
            , 'Message: <p><em>Th[</em>is <strong>is first</strong> child</p>]<p>test1</p>');

        end = firstNode.childNodes[2].childNodes[0];
        offset = 0;
        rng.setStart(firstTxt, 0);
        rng.setEnd(end, offset);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong></strong>'
            , 'Message: <p><em>[Th</em>is <strong>]is first</strong> child</p><p>test1</p>');

        end = firstNode.childNodes[2].childNodes[0];
        offset = 0;
        rng.setStart(firstTxt, 1);
        rng.setEnd(end, offset);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>h</em>is <strong></strong>'
            , 'Message: <p><em>T[h</em>is <strong>]is first</strong> child</p><p>test1</p>');

        end = firstNode.childNodes[2].childNodes[0];
        offset = 0;
        rng.setStart(firstTxt, 2);
        rng.setEnd(end, offset);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em></em>is <strong></strong>'
            , 'Message: <p><em>Th[</em>is <strong>]is first</strong> child</p><p>test1</p>');

        end = firstNode.childNodes[2].childNodes[0];
        offset = end.nodeValue.length-2;
        rng.setStart(firstTxt, 0);
        rng.setEnd(end, offset);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong>is fir</strong>'
            , 'Message: <p><em>[Th</em>is <strong>is fir]st</strong> child</p><p>test1</p>');

        end = firstNode.childNodes[2].childNodes[0];
        offset = end.nodeValue.length;
        rng.setStart(firstTxt, 0);
        rng.setEnd(end, offset);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong>is first</strong>'
            , 'Message: <p><em>[Th</em>is <strong>is first]</strong> child</p><p>test1</p>');
    });

    test('测试克隆1 == startContainer.nodeType的情况', function(){

        TestTools.setContent('<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        editor.focus();
        //expect(3);
        
        var firstNode = editor.domUtil.$('p')[0];
        var firstTxt  = firstNode.childNodes[0].childNodes[0].childNodes[0];
        var testHtml = '', frag, start, end, offset;

        
        var rng = editor.selection.createRange();

        start = firstNode;
        rng.setStart(start, 0);
        rng.setEnd(firstTxt, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<strong><em></em></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>]Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        
        start = firstNode;
        end = firstTxt;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<strong><em>T</em></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>T]h</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt;
        rng.setStart(start, 0);
        rng.setEnd(end, end.nodeValue.length);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<strong><em>Th</em></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th]</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        
        start = firstNode;
        end = firstTxt.parentNode;
        rng.setStart(start, 0);
        rng.setEndAfter(end);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>]is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>]is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>i</strong>'
            , 'Message: <p>[<strong><em>Th</em>i]s <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, end.nodeValue.length);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is </strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is ]<span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.parentNode;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>]is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.parentNode;
        rng.setStart(start, 0);
        rng.setEnd(end, 2);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is </strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span></span></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>]underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span></span></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>]underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 2);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>un</span></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>un]derline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 9);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline]</span></strong>is <strong>is first</strong> child</p><p>test1</p>');


        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline]</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>]is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first]</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>]is first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 2);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong>is</strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>is] first</strong> child</p><p>test1</p>');

        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 8);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first]</strong> child</p><p>test1</p>');

        start = firstNode.firstChild.firstChild;
        end = start.nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<em>Th</em>is <span>underline</span>'
            , '1 == endContainer.nodeType Message: <p><strong><em>[Th</em>is <span>underline]</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode.childNodes[0].childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p></p>'
            , '3 == endContainer.nodeType Message: <p><strong><em>[Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>]test1</p>');

        start = firstNode.childNodes[0].childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 3);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>tes</p>'
            , '3 == endContainer.nodeType Message: <p><strong><em>[Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>tes]t1</p>');

        start = firstNode.childNodes[0].childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 5);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , '3 == endContainer.nodeType Message: <p><strong><em>[Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1]</p>');

        start = firstNode.childNodes[0].childNodes[0];
        end = firstNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p></p>'
            , '1 == endContainer.nodeType Message: <p><strong><em>[Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>]test1</p>');

        start = firstNode.childNodes[0].childNodes[0];
        end = firstNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , '1 == endContainer.nodeType Message: <p><strong><em>[Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1]</p>');

        start = firstNode.firstChild;
        end = start.firstChild.nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<em>Th</em>is <span>underline</span>'
            , '1 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline]</span></strong>is <strong>is first</strong> child</p><p>test1</p>');

        start = firstNode.childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p></p>'
            , '3 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>]test1</p>');

        start = firstNode.childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 3);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>tes</p>'
            , '3 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>tes]t1</p>');

        start = firstNode.childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 5);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , '3 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1]</p>');

        start = firstNode.childNodes[0];
        end = firstNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p></p>'
            , '1 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>]test1</p>');

        start = firstNode.childNodes[0];
        end = firstNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.cloneContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , '1 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1]</p>');
    });
    
    test('测试剪切startContainer为TextNode节点的情况', function(){
        var firstNode, firstTxt, testHtml = '', frag, start, end, offset;

        function setup(){
            TestTools.setContent('<p><em>Th</em>is <strong>is first</strong> child</p><p>test1</p>');
            firstNode = editor.domUtil.$('p')[0];
            firstTxt  = firstNode.childNodes[0].childNodes[0];
            testHtml = '';
            editor.focus();
        }

        var rng = editor.selection.createRange();
        setup();
        rng.setStart(firstTxt, 0);
        rng.setEnd(firstTxt, firstTxt.nodeValue.length);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'Th'
            , 'Message: <p><em>[Th]</em>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em></em>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切后的HTML');

        
        setup();
        rng.setStart(firstTxt, 1);
        rng.setEnd(firstTxt, firstTxt.nodeValue.length);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'h'
            , 'Message: <p><em>T[h]</em>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em>T</em>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切后的HTML');

        setup();
        rng.setStart(firstTxt, 2);
        rng.setEnd(firstTxt, firstTxt.nodeValue.length);
        frag = rng.extractContents();
        equal(frag.hasChildNodes(), false
            , 'Message: <p><em>Th[]</em>is <strong>is first</strong> child</p><p>test1</p>');
        equal(rng.startContainer, firstTxt
            , 'Message: 测试剪切后的startContainer');

        setup();
        rng.setStart(firstTxt, 0);
        rng.setEnd(firstNode, 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);

        equal(testHtml,'<em>Th</em>'
            , 'Message: <p><em>[Th</em>]is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em></em>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 0);
        rng.setEnd(firstNode.childNodes[1], 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>i'
            , 'Message: <p><em>[Th</em>i]s <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em></em>s <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 1);
        rng.setEndAfter(firstNode.childNodes[0]);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>h</em>'
            , 'Message: <p><em>T[h</em>]is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em>T</em>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 2);
        rng.setEndAfter(firstNode.childNodes[0]);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em></em>'
            , 'Message: <p><em>Th[</em>]is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em>Th</em>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 0);
        rng.setEnd(firstNode, firstNode.childNodes.length - 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong>is first</strong>'
            , 'Message: <p><em>[Th</em>is <strong>is first</strong>] child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em></em> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 1);
        rng.setEnd(firstNode, firstNode.childNodes.length - 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>h</em>is <strong>is first</strong>'
            , 'Message: <p><em>T[h</em>is <strong>is first</strong>] child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em>T</em> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 2);
        rng.setEnd(firstNode, firstNode.childNodes.length - 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em></em>is <strong>is first</strong>'
            , 'Message: <p><em>Th[</em>is <strong>is first</strong>] child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em>Th</em> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 0);
        rng.setEnd(firstNode, firstNode.childNodes.length);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong>is first</strong> child'
            , 'Message: <p><em>[Th</em>is <strong>is first</strong> child]</p><p>test1</p>');
        equal(editor.getContent(),'<p><em></em></p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 1);
        rng.setEnd(firstNode, firstNode.childNodes.length);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>h</em>is <strong>is first</strong> child'
            , 'Message: <p><em>T[h</em>is <strong>is first</strong> child]</p><p>test1</p>');
        equal(editor.getContent(),'<p><em>T</em></p><p>test1</p>'
            , 'Message: 测试剪切结果');


        setup();
        rng.setStart(firstTxt, 2);
        rng.setEnd(firstNode, firstNode.childNodes.length);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em></em>is <strong>is first</strong> child'
            , 'Message: <p><em>Th</em></p><p>test1</p>');
        equal(editor.getContent(),'<p><em>Th</em></p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 0);
        rng.setEndAfter(firstNode);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<p><em>Th</em>is <strong>is first</strong> child</p>'
            , 'Message: <p><em>[Th</em>is <strong>is first</strong> child</p>]<p>test1</p>');
        equal(editor.getContent(),'<p><em></em></p><p>test1</p>'
            , 'Message: 测试剪切结果');

        
        setup();
        rng.setStart(firstTxt, 0);
        rng.setEndAfter(firstNode);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<p><em>Th</em>is <strong>is first</strong> child</p>'
            , 'Message: <p><em>[Th</em>is <strong>is first</strong> child</p>]<p>test1</p>');
        equal(editor.getContent(),'<p><em></em></p><p>test1</p>'
            , 'Message: 测试剪切结果');


        setup();
        rng.setStart(firstTxt, 1);
        rng.setEndAfter(firstNode);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<p><em>h</em>is <strong>is first</strong> child</p>'
            , 'Message: <p><em>T[h</em>is <strong>is first</strong> child</p>]<p>test1</p>');
        equal(editor.getContent(),'<p><em>T</em></p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        rng.setStart(firstTxt, 2);
        rng.setEndAfter(firstNode);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<p><em></em>is <strong>is first</strong> child</p>'
            , 'Message: <p><em>Th[</em>is <strong>is first</strong> child</p>]<p>test1</p>');
        equal(editor.getContent(),'<p><em>Th</em></p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        end = firstNode.childNodes[2].childNodes[0];
        offset = 0;
        rng.setStart(firstTxt, 0);
        rng.setEnd(end, offset);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong></strong>'
            , 'Message: <p><em>[Th</em>is <strong>]is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em></em><strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        end = firstNode.childNodes[2].childNodes[0];
        offset = 0;
        rng.setStart(firstTxt, 1);
        rng.setEnd(end, offset);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>h</em>is <strong></strong>'
            , 'Message: <p><em>T[h</em>is <strong>]is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em>T</em><strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        
        setup();
        end = firstNode.childNodes[2].childNodes[0];
        offset = 0;
        rng.setStart(firstTxt, 2);
        rng.setEnd(end, offset);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em></em>is <strong></strong>'
            , 'Message: <p><em>Th[</em>is <strong>]is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em>Th</em><strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        end = firstNode.childNodes[2].childNodes[0];
        offset = end.nodeValue.length-2;
        rng.setStart(firstTxt, 0);
        rng.setEnd(end, offset);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong>is fir</strong>'
            , 'Message: <p><em>[Th</em>is <strong>is fir]st</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em></em><strong>st</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        end = firstNode.childNodes[2].childNodes[0];
        offset = end.nodeValue.length;
        rng.setStart(firstTxt, 0);
        rng.setEnd(end, offset);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<em>Th</em>is <strong>is first</strong>'
            , 'Message: <p><em>[Th</em>is <strong>is first]</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><em></em><strong></strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
    });

    test('测试剪切1 == startContainer.nodeType的情况', function(){
        var firstNode, firstTxt, testHtml = '', frag, start, end, offset;

        function setup(){
            TestTools.setContent('<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
            firstNode = editor.domUtil.$('p')[0];
            firstTxt  = firstNode.childNodes[0].childNodes[0].childNodes[0];
            testHtml = '';
            editor.focus();
        }

        setup();
        editor.focus();
        
        var rng = editor.selection.createRange();

        start = firstNode;
        rng.setStart(start, 0);
        rng.setEnd(firstTxt, 0);

        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<strong><em></em></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>]Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<strong><em>T</em></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>T]h</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><em>h</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        start = firstNode;
        end = firstTxt;
        rng.setStart(start, 0);
        rng.setEnd(end, end.nodeValue.length);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        equal(testHtml,'<strong><em>Th</em></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th]</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><em></em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode;
        rng.setStart(start, 0);
        rng.setEndAfter(end);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>]is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>]is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>i</strong>'
            , 'Message: <p>[<strong><em>Th</em>i]s <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong>s <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, end.nodeValue.length);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is </strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is ]<span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.parentNode;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>]is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        setup();
        start = firstNode;
        end = firstTxt.parentNode.parentNode;
        rng.setStart(start, 0);
        rng.setEnd(end, 2);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is </strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is ]<span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span></span></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>]underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span></span></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>]underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 2);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>un</span></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>un]derline</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><span>derline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 9);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline]</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><span></span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstTxt.parentNode.nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline]</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><span></span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        
        setup();
        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong></strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>]is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');

        
        setup();
        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong>'
            , '1 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first]</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong></strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong></strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>]is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 2);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong>is</strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>is] first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong> first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode;
        end = firstNode.childNodes[0].nextSibling.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 8);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong>'
            , '3 == endContainer.nodeType Message: <p>[<strong><em>Th</em>is <span>underline</span></strong>is <strong>is first]</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong></strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        

        setup();
        start = firstNode.firstChild;
        end = start.firstChild.nextSibling.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<em>Th</em>is <span>underline</span>'
            , '1 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline]</span></strong>is <strong>is first</strong> child</p><p>test1</p>');
        equal(editor.getContent(),'<p><strong><span></span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode.childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p></p>'
            , '3 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>]test1</p>');
        equal(editor.getContent(),'<p><strong></strong></p><p>test1</p>'
            , 'Message: 测试剪切结果');

        
        setup();
        start = firstNode.childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 3);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>tes</p>'
            , '3 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>tes]t1</p>');
        equal(editor.getContent(),'<p><strong></strong></p><p>t1</p>'
            , 'Message: 测试剪切结果');

        
        setup();
        start = firstNode.childNodes[0];
        end = firstNode.nextSibling.childNodes[0];
        rng.setStart(start, 0);
        rng.setEnd(end, 5);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , '3 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1]</p>');
        equal(editor.getContent(),'<p><strong></strong></p><p></p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode.childNodes[0];
        end = firstNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 0);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p></p>'
            , '1 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>]test1</p>');
        equal(editor.getContent(),'<p><strong></strong></p><p>test1</p>'
            , 'Message: 测试剪切结果');
        
        setup();
        start = firstNode.childNodes[0];
        end = firstNode.nextSibling;
        rng.setStart(start, 0);
        rng.setEnd(end, 1);
        frag = rng.extractContents();
        testHtml = TestTools.getHtml(frag);
        //console.log(testHtml);
        equal(testHtml,'<p><strong><em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1</p>'
            , '1 == endContainer.nodeType Message: <p><strong>[<em>Th</em>is <span>underline</span></strong>is <strong>is first</strong> child</p><p>test1]</p>');
        equal(editor.getContent(),'<p><strong></strong></p><p></p>'
            , 'Message: 测试剪切结果');
    });

    
    test('Test insertNode to middle', function(){
        TestTools.setContent('<p>This is first child</p><p>This is second child</p>');
        editor.focus();
        var lastNode = editor.domUtil.$('p')[1];
        var sel = editor.selection;
        var rng = sel.createRange();
        rng.setStart(lastNode.firstChild, 5);
        rng.collapse(true);
        var node = editor.doc.createElement('p');
        node.innerHTML = 'This is insert node';
        rng.insertNode(node);
        equal(editor.getContent(),'<p>This is first child</p><p>This <p>This is insert node</p>is second child</p>', 'insert node to middle of text node');
    });
    
    module('Module-Plugins');
    
    asyncTest('测试加粗', function(){

        TestTools.setContent(initHtml);
        var $p = domUtil.$('p')[0].childNodes;
        var rng = selection.createRange();
        
        rng.setStart($p[0], 9);
        rng.setEnd($p[0], 13);
        rng.select();

        var task = new Task({delay:80});

        task.then(function(next){
            //QUnit.log('第一次点击加粗按钮');
            editor.exec('bold');
            next();
        }).then(function(next){
            equal($($p[1]).prop('outerHTML'),'<strong>去很中国</strong>', '测试在文本节点中加粗');
            
            QUnit.start();
            next();
        }).start();
    });


    editor.ready(function(){

        selection = editor.selection;
        domUtil = editor.domUtil;
        editor.setContent(initHtml);
        setTimeout(function(){
            
            start();
        }, 500);
    });
});
