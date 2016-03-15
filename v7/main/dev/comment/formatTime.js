/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 格式化时间
 * 取得当前时间 格式 2009-08-24 17:06:04
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("comment/_comment.js");

Comment.formatTime = function(time){

    var s = new Date();
    
    if (time) {
        s.setTime(s);
    }
    
    var month = (s.getMonth() + 1) >= 10 ? (s.getMonth() + 1) : "0" + (s.getMonth() + 1);
    var date = s.getDate() >= 10 ? s.getDate() : "0" + s.getDate();
    var time = new Date().toTimeString().split(" ")[0];
    var t = s.getFullYear() + "-" +
    month +
    "-" +
    date +
    " " +
    time;
    return t;
};


