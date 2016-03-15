/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 设置
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/utils/form/_form.js");

Utils.Form.Radio = {};
/**
 * 设置一组radio
 * @param {HTML collectioin} radioObj 一组radio的引用，Array或者是HTML collection
 */
Utils.Form.Radio.get = function(radioObj){
    if (!radioObj) 
        return "";
    var radioLength = radioObj.length;
    if (radioLength == undefined) 
        if (radioObj.checked) 
            return radioObj.value;
        else 
            return "";
    for (var i = 0; i < radioLength; i++) {
        if (radioObj[i].checked) {
            return radioObj[i].value;
        }
    }
    return "";
};

/**
 * 设置一个新值
 * @param {HTML collectioin} radioObj 一组radio的引用，Array或者是HTML collection
 * @param {Object} newValue 新值
 */
Utils.Form.Radio.set = function(radioObj, newValue){
    if (!radioObj) 
        return;
    var radioLength = radioObj.length;
    if (radioLength == undefined) {
        radioObj.checked = (radioObj.value == newValue.toString());
        return;
    }
    for (var i = 0; i < radioLength; i++) {
        radioObj[i].checked = false;
        if (radioObj[i].value == newValue.toString()) {
            radioObj[i].checked = true;
        }
    }
};

