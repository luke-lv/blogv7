/*
 * @fileoverview 固定广告box组件
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

/*** 固定广告box组件 ***/
SinaBlog680.PPTBoxHelper = {
    count: 0,
    instance: {},
    getId: function() { return '_ppt_box-' + (this.count++); }
}

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
    var xpos = parseInt(elem.style.left);
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
}

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
        var slotid = this.sourceid+"_contentbox";
        var sudakey = this.sudakey;
        var sudavalue = this.sudavalue;
        for(var i=0;i<this._box.length;i++){
            var parame = this._box[i];
            flashbox += this.renderHTML(parame,this.width,this.height,i);
            // imageHTML ="<div class='bitdiv "+((i==0)?"curimg":"defimg")+"' title ="+parame.title+" src='bit01.gif' "+picstyle+" onclick = \""+eventstr+".clickPic("+i+")\"  onmouseover=\""+eventstr+".mouseoverPic("+i+")\"></div>" + imageHTML;
        }
        //有广告数据
        if(flashbox != '') {
            // this._createMainBox();
            if(this.slot.style.display == 'none') {
                this.slot.style.display = '';
            }
            flashboxel = SinaBlog680.utils.htmlToDom(flashbox);
            // if(this._$(slotid)) {
            //     this._$(slotid).appendChild(flashboxel[0]);
            // }
            if(this.slot) {
                this.slot.appendChild(flashboxel[0]);
                // 曝光布码
                window.setTimeout(function() {
                    if(typeof SUDA != 'undefined' && sudakey && sudavalue) {
                        SUDA.uaTrack(sudakey, sudavalue);
                    }
                }, 3000);
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
        //materialtype 物料类型
        //1,图片 2,文字
        if(this.materialtype === 1) {
            var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";
            var style = "";
            if(parame.a_href) {
                style = "cursor:pointer"
            }
            // html="<img "+parame.a_c_suda+" title='"+parame.a_title+"' src='"+parame.imgurl+"' style='width:"+width+"px;height:"+height+"px;"+style+"' onclick = \""+eventstr+".clickPic("+idx+")\"/>";
            // html="<a href="+parame.a_href+" target='_blank'><img "+parame.a_c_suda+" title="+parame.a_title+" src="+parame.imgurl+" style='width:"+width+"px;height:"+height+"px;"+style+"' /></a>";
            html = '<a target="_blank" href="'+parame.a_href+'">'+ '<img '+ parame.a_c_suda + ' title="'+ parame.a_title +'" src="'+ parame.imgurl +'" style="width:'+width+'px;height:'+height+'px;">' + '</a>';
        }else if(this.materialtype === 2) {
            var style = "";
            if(parame.a_style) {
                style = parame.a_style;
            }
            html = '<a style="'+style+'" title="'+parame.a_title+'" href="'+parame.a_href+'" '+parame.a_c_suda+' target="_blank">'+parame.words+'</a>';
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
        if(parame.a_href&&parame.a_href!=""){
            window.open(parame.a_href,this.target);
        }
    },
    add : function (imgParam){
        this._box[this._box.length] = imgParam;
    },
    show : function () {
        if(!this.slot) {
            return;
        }
        this._init();
        if(this.autoplayer>0){
           var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
           this._autoplay = setInterval(eventstr,this.autoplayer*1000);
        }
    }
}
/*** 固定广告box组件 **