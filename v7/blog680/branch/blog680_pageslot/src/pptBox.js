/*
 * @fileoverview 固定广告box组件
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

/*** 固定广告box组件 ***/
SinaBlog680.PPTBoxHelper = {
    count: 0,
    instance: {},
    getId: function() { return '_ppt_box-' + (this.count++); }
};

SinaBlog680.moveElement = function(elementID,final_x,interval) {
    if (!document.getElementById) return false;
    if (!document.getElementById(elementID)) return false;
        var elem = document.getElementById(elementID);
        if (elem.movement) {
        clearTimeout(elem.movement);
    }
    if (!elem.style.left) {
        elem.style.left = "0px";
    }
    var xpos = parseInt(elem.style.left, 10);
    if (xpos == final_x ) {
        return true;
    }
    if (xpos < final_x) {
        var dist = Math.ceil((final_x - xpos)/5);
        xpos = xpos + dist;
    }
    if (xpos > final_x) {
        var dist = Math.ceil((xpos - final_x)/5);
        xpos = xpos - dist;
    }
    elem.style.left = xpos + "px";
    var repeat = "SinaBlog680.moveElement('"+elementID+"',"+final_x+","+interval+")";
    elem.movement = setTimeout(repeat,interval);
};

//PPT盒子
function PPTBox() {
    this.uid = SinaBlog680.PPTBoxHelper.getId();
    SinaBlog680.PPTBoxHelper.instance[this.uid] = this;
    this._$ = function(id){return document.getElementById(id);};
    this.width = 400;       //宽度
    this.height = 300;      //高度
    this.picWidth = 15;     //小图宽度
    this.picHeight = 12;    //小图高度
    this.autoplayer = 0;    //自动播放间隔（秒）
    this.target = "_blank";
    this._box = [];
    this._curIndex = 0;
    this.materialtype = 1;  //物料类型
    this.slot = null;       //资源位dom元素
    this.slottype = 1;      //资源位类型，1固定，2漂浮，3弹窗
    this.sourceid = null;
    this.sudakey = null;
    this.sudavalue = null;
}
PPTBox.prototype = {
    _createMainBox : function (){
        var flashBoxWidth = this.width * this._box.length;
        var html="<div id='"+this.sourceid+"_mainbox' class='mainbox'  style='overflow:hidden;position:relative;width:"+(this.width)+"px;height:"+(this.height)+"px;'>";
        html += "<div id='"+this.sourceid+"_contentbox' class='flashbox' style='overflow:hidden;position:relative;width:"+flashBoxWidth+"px;height:"+(this.height)+"px;'></div>";
        // html += "<div id='"+this.sourceid+"_imagebox' class='imagebox' style='display: none;width:"+this.width+"px;height:"+(this.picHeight+2)+"px;top:-"+(this.picHeight+20)+"px;'></div>";
        html += "</div>";
        var el = SinaBlog680.utils.htmlToDom(html);
        this.slot.appendChild(el[0]);
        // this.slot.innerHTML = html;        
    },
    _init : function (){
        var picstyle= "";
        var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";
        var imageHTML="";
        var flashbox = "";
        var flashboxel;
        var sudakey = this.sudakey;
        var sudavalue = this.sudavalue;
        for(var i=0;i<this._box.length;i++){
            var parame = this._box[i];
            flashbox += this.renderHTML(parame,this.width,this.height,i);
            // imageHTML ="<div class='bitdiv "+((i==0)?"curimg":"defimg")+"' title ="+parame.title+" src='bit01.gif' "+picstyle+" onclick = \""+eventstr+".clickPic("+i+")\"  onmouseover=\""+eventstr+".mouseoverPic("+i+")\"></div>" + imageHTML;
        
            //有广告数据
            if(flashbox !== '') {
                // this._createMainBox();
                if(this.slot.style.display == 'none') {
                    this.slot.style.display = '';
                }
                flashboxel = SinaBlog680.utils.htmlToDom(flashbox);
                
                if(this.slot) {
                    var slotdom = this.slot;

                    if(this.sourceid == 'SLOT_41' || this.sourceid == 'SLOT_42') {
                        if(slotdom.parentNode.style.display == 'none') {
                            slotdom.parentNode.style.display = '';
                        }
                        slotdom.parentNode.innerHTML = flashbox;
                    }else {
                        // slotdom.appendChild(flashboxel[0]);
                        slotdom.innerHTML = flashbox;
                        try {
                            if(slotdom.getAttribute('id') == 'loginBarActivity') {
                                slotdom.onmouseover = function() {
                                    slotdom.getElementsByTagName('a')[0].setAttribute('href', parame.a_href);
                                };
                                slotdom.onmouseout = function() {
                                    var href = parame.a_href.match(/url=(.+)/)[1];
                                    slotdom.getElementsByTagName('a')[0].setAttribute('href', href);
                                };
                            }
                        }catch(e){}
                    }

                    // 曝光布码
                    window.setTimeout(function() {
                        if(typeof SUDA != 'undefined' && sudakey && sudavalue) {
                            SUDA.uaTrack(sudakey, sudavalue);
                        }
                    }, 3000);
                }
            }
        }
        
        // this._$(this.sourceid+"_contentbox").innerHTML = flashbox;
        // this._$(this.sourceid+"_imagebox").innerHTML = imageHTML;

    },
    _play : function(){
        clearInterval(this._autoplay);
        var idx = this._curIndex+1;
        if(idx>=this._box.length){idx=0;}
        this.changeIndex(idx);
        var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
        this._autoplay = setInterval(eventstr,this.autoplayer*1000);

    },
    renderHTML : function(parame,width,height,idx) {
        // var isFlash = url.substring(url.lastIndexOf('.')+1).toLowerCase()=="swf";
        var html = "";
        var slotdom = this.slot;
        var tpl_xg1 = '<p class="atcTitCell_tit SG_dot">'
                    +   '<a {{a_c_suda}} href="{{a_href}}" target="_blank" title="{{a_title}}">{{words}}</a>'
                    + '</p>'
                    + '<p class="atcTitCell_nm">'
                    +   '<a {{a_c_suda}} href="{{a_href}}" class="SG_linkb" target="_blank">{{author}}</a>'
                    + '</p>';
        
        var tpl_xg2 = '<span class="blogname">'
                    + '<a {{a_c_suda}} onclick="v7sendLog(\'41_01_07\');" href="{{a_href}}" target="_blank" title="{{a_title}}">{{words}}</a>'
                    + '</span>'
                    + '<span class="bloguser">'
                    + '<a {{a_c_suda}} onclick="v7sendLog(\'41_01_07\');" class="SG_linkb" href="{{a_href}}" target="_blank">{{author}}</a>'
                    + '</span>';

        var tpl_searchqing = '<a target="_blank" {{a_c_suda}} href="{{a_href}}"><img title="{{a_title}}" src="{{imgurl}}" alt="{{a_title}}"></a>' 
                            + '<span><a target="_blank" {{a_c_suda}} href="{{a_href}}">{{a_title}}</a></span>';

        var tpl_meishilink = '<span class="SG_dot"></span><a target="_blank" {{a_c_suda}} title="{{a_title}}" href="{{a_href}}">{{a_title}}</a>';
                    
        //materialtype 物料类型
        //1,图片 2,文字 3,相关博文 4,搜索浮层 5,美食组件文字链
        if(this.materialtype === 1) {
            var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";
            var style = "";
            if(parame.a_href) {
                style = "cursor:pointer";
            }
            // 大家看浮层图片链接添加点击对比布码
            if(this.sourceid == 'SLOT_98') {
                var sendlog = "v7sendLog('30_01_02')";
                html = '<a '+ parame.a_c_suda +' onmousedown="'+ sendlog +'" target="_blank" href="'+parame.a_href+'">'+ '<img titlelink="'+parame.a_href+'" destxt="'+(parame.words || '')+'" title="'+ parame.a_title +'" src="'+ parame.imgurl +'" />' + '</a>';
            }else {
                html = '<a '+ parame.a_c_suda +' target="_blank" href="'+parame.a_href+'">'+ '<img titlelink="'+parame.a_href+'" destxt="'+(parame.words || '')+'" title="'+ parame.a_title +'" src="'+ parame.imgurl +'" />' + '</a>';
            }
        }else if(this.materialtype === 2) {
            var style = "";
            if(parame.a_style) {
                style = parame.a_style;
            }
            // 顶托文字链
            if(slotdom.getAttribute('id') === 'loginBarActivity') {
                if(/sina.allyes.com/g.test(parame.a_href)){
                    var href = parame.a_href.match(/url=(.+)/)[1];
                }else{
                    var href = parame.a_href;
                }
                var sendlog = "v7sendLog('41_01_11')";
                html = '<a onmousedown="'+ sendlog +'" style="'+style+'" title="'+parame.a_title+'" href="'+href+'" '+parame.a_c_suda+' target="_blank">'+parame.words+'</a>';
            }else {
                html = '<a style="'+style+'" title="'+parame.a_title+'" href="'+parame.a_href+'" '+parame.a_c_suda+' target="_blank">'+parame.words+'</a>';
            }
        }else if(this.materialtype === 3) {
            if(location.href.indexOf('tj=2') != -1) {
                html = SinaBlog680.utils.tplToData(tpl_xg2, parame);
            }else {
                html = SinaBlog680.utils.tplToData(tpl_xg1, parame);
            }
        }else if(this.materialtype === 4) {
            html = SinaBlog680.utils.tplToData(tpl_searchqing, parame);
        }else if(this.materialtype === 5) {
            html = SinaBlog680.utils.tplToData(tpl_meishilink, parame);
        }

        // else if(this.materialtype === 3) {
        //     html = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' "
        //     + "codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0' width='"+width+"' height='"+height+"'>"
        //     + "<param name=\"movie\" value=\""+url+"\" />"
        //     + "<param name='quality' value='high' />"
        //     + "<param name='wmode' value='transparent'>"
        //     + "<embed src='"+url+"' quality='high' wmode='opaque' pluginspage='http://www.macromedia.com/go/getflashplayer'"
        //     +"  type='application/x-shockwave-flash' width="+width+" height='"+height+"'></embed>"
        //     +"  </object>";
        // }

        return html;
    },
    changeIndex : function(idx){
        var parame = this._box[idx];
        SinaBlog680.moveElement(this.sourceid+"_contentbox",-(idx*this.width),1);
        // var imgs = this._$(this.sourceid+"_imagebox").getElementsByTagName("div");
        // imgs[this._box.length-1-this._curIndex].className = "bitdiv defimg";
        // imgs[this._box.length-1-idx].className = "bitdiv curimg";
        this._curIndex = idx;
    },
    mouseoverPic : function(idx){
        this.changeIndex(idx);
        if(this.autoplayer>0){
           clearInterval(this._autoplay);
           var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
           this._autoplay = setInterval(eventstr,this.autoplayer*1000);
        }
    },
    clickPic : function(idx){
        var parame = this._box[idx];
        if(parame.a_href&&parame.a_href !== ""){
            window.open(parame.a_href,this.target);
        }
    },
    add : function (imgParam){
        this._box[this._box.length] = imgParam;
    },
    show : function () {
        var that = this;
        if(!this.slot) {
            return;
        }
        this._init();

        // if(this.autoplayer>0){
        //    var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
        //    this._autoplay = setInterval(eventstr,this.autoplayer*1000);
        // }
    }
};
/*** 固定广告box组件 **/