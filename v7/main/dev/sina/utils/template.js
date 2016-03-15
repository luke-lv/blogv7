/** 
 * @fileoverview 将数据列表渲染到模板的函数
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-07-24
 * @forcopy $import("sina/utils/template.js");
 */
$import("sina/utils/utils.js");

/**
 * 将数据列表渲染到模板的函数
 * @method
 * @param {String} tpl 待渲染的模板
 * @param {Array<JSON>} arrData 渲染到模板里的数据
 * @param {Function} mix 混合数据的函数（数据预处理函数，渲染之前对数据进行处理）
 * @type String
 * @example
        //tpl例子1（模板放在页面的html里）：
<script id="tpl" type="text/templete">  
    <div id="luck_box">  
        <div id="ava_list">  
            <div id="aa1023">{head}</div>  
            <div id="aa1023">{name}</div>  
            {$.isOdd ? [  
            <div id="aa10211"><img src="logo.jpg" />isOddxxxxxxxxxxxxx</div>  
            <div id="aa10212"><img src="logo.jpg" /></div>]  
            : [  
            <div id="aa1024"><img src="logo.jpg" />no isOdd</div>  
            <div id="aa1025"><img src="logo.jpg" /></div>  
            ]  
            }  
        </div>  
    </div>  
</script>

        //tpl例子2（模板放在JS代码里）：
var tpl = '<li>'  
    + '<div class="headPic"><a href="{domain}" title="{name}"><span></span></a>'  
        + '<img alt="" src="{head}" width="60" height="60"/>'  
    + '</div>'  
    + '<div class="feedCon">'  
            + '<span>{$.isOdd?[这是奇数行]+$.name:[偶的]}</span>'  
            + '<span>{ $.abc===5 ? [是5] : [是]+$.abc }</span>'  
    + '</div>'  
+ '</li>';  

        //arrData例子：
var datas = [  
    {domain:'domainshit', name:'FLM', head:'headdffdddd',ab:3},  
    {domain:'dodshit', name:'FLMMjj', head:'he788ddd',ab:2},  
    {domain:'dode3errrrrtshit', name:'FL4MMjj', head:'he78y70008ddd',ab:5},  
    {domain:'dors2dshit', name:'FL3MMjj', head:'he78811ddd',ab:2},  
    {domain:'doma', name:'FffLM', head:'he2addd',ab:3}  
];

        //mix例子：
//data: 数据列表里的单条数据
//i: 该条数据在整个列表中的序号，从0开始
function mix(data, i){  
    var dm = domain.replace('shit',''); //在这里可以进行任何数据处理
    //最后返回一个JSON对象，该数据将覆盖添加到对应的数据里面
    return {
        domain: dm, //覆盖原来的domain值
        isOdd: i&1, //是不是奇数行
        abc: data.ab+2 //将每条数据的ab值加2
    };  
}  
        //渲染数据
        //var html = Utils.template(document.getElementById('tpl').innerHTML, datas, mix);
        var html = Utils.template(tpl, datas, mix);
 */
Utils.template = function(tpl, arrData, mix){
    if( !arrData || !arrData.length ){
        return '';
    }
    tpl = tpl.replace(/[\r\n\t]/g,'').replace(/\'/g,"\\\'").split('{');
    
    var ret = '',
        hasMix = mix!==undefined,
        i, len = tpl.length,
        evaluate,
        sous,
        source = "return '"+tpl[0]+"'",
        datai, mixdata, p;

    for(i=1; i<len; i++){
        sous = tpl[i].split('}');
        source = source +(sous[0].indexOf('$')===-1?"+$."+sous[0]:
            "+("+sous[0].replace(/\[|\]/g,"'")+")")+"+'"+sous[1]+"'";
    }
    //trace(source);
    evaluate = new Function('$', source);

    for(i = 0, len = arrData.length; i<len; i++){
        datai = arrData[i];
        
        if(hasMix){
            mixdata = mix(datai, i);
            for(p in mixdata){
                datai[p] = mixdata[p];
            }
        }
        
        ret += evaluate(datai);
    }
    return ret;
};
