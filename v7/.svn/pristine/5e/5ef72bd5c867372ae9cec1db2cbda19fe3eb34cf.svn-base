/**
 * @fileoverview 用户向导的job
 * @author xy xinyu@staff.sina.com.cn
 */
$import("pageSet/initialVars.js");
$import("pageSet/guide/guide.js");

$registJob('guide', function(){
    new guideTabs($E('userGuideUL'));
    var hiddendiv = $E('hiddendiv');
    if (!hiddendiv) {
        hiddendiv = $C('div');
        hiddendiv.id = 'hiddendiv';
        hiddendiv.style.display = "none";
        document.body.appendChild(hiddendiv);
    }
});
