/**
 * 把feed内容转化为文本html内容替换为文本包括表情
 */
$import("lib/commentv2/_comment.js");
CommentV2.ToFeedText = function(html) {
    function parseHTML(html) {
        var b = /[^<>]+|<(\/?)([A-Za-z0-9]+)([^<>]*)>/g,
            c, d, e = [];
        while (c = b.exec(html)) {
            var f = [];
            for (d = 0; d < c.length; d += 1) f.push(c[d]);
            e.push(f)
        }
        return e
    }
    if (typeof html !== 'string') {
        throw '[CommentV2.ToFeedText]:need string as first parameter';
    }
    var list = parseHTML(html);
    var buffer = [];
    for (var i = 0, len = list.length; i < len; i += 1) {
        if (!list[i][2]) {
            buffer.push(list[i][0]);
        } else if (list[i][2].toLowerCase() === 'img') {
            var alt = list[i][3].match(/(?:alt\s*=\s*["|']?([^"|'|\s]+)["|']?)/);
            var brand_face = list[i][3].match(/(?:brand_face\s*=\s*["|']?([^"|'|\s]+)["|']?)/);
            if (brand_face) {
                buffer.push(brand_face[1]);
            } else if (alt) {
                buffer.push(alt[1]); //获取alt属性
            }
        }
    }
    return buffer.join('');
};