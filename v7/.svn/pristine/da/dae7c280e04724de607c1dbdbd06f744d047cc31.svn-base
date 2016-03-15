/**
 * @fileoverview 用户识别一期
 * @author stoneCC | changchuan@staff.sina.com.cn
 * @created 2013-09-10
 */

$import("sina/utils/flash/swf.js");
$import("sina/utils/io/jsload.js");

$registJob("userIdentification", function() {
    var uniqueKey = "UerIndentifition";
    var timeKey = "UItimestamp";
    var waitForFlash = 5000;
    var maxTimes = 3;
    var cookie, indexeddb, localstorage, websql, userdata, lso;    
    //服务器接口  get  uniqneId
    var InterfaceGetUniqueId = "http://highway.blog.sina.com.cn/getSupperCookie";
    //服务器接口  log
    var InterfaceLog = "http://highway.blog.sina.com.cn/writeLog";
    //限制尾号
    var limitLastNum= "*";
    
    var screenWH = window.screen.width + "*" + window.screen.height;
    
    var uid="";
    
     
     cookie = {
        value : {},
        enable : false,
        length : 0,
        init : function() {
            cookie.enable = window.navigator.cookieEnabled;
            cookie.length = document.cookie.length;
        },
        get : function(key, callback) {
            var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
            if ( arr = document.cookie.match(reg))
                callback(unescape(arr[2]));
            else
                callback("");
        },
        set : function(key, value, callback) {
            callback = callback || function(){};
            var Days = 365;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
            callback(true);
        }
    };

    //indexddb
     indexeddb = {
        value : {},
        enable : false,
        name : "stonecc",
        table : "UserIndentifition",
        version : 2,
        db : null,
        init : function() {
            if (!!!window.indexedDB)
                return;
            var request = window.indexedDB.open(indexeddb.name, indexeddb.version);
            request.onsuccess = function(event) {
                indexeddb.db = request.result;
                indexeddb.enable = true;
            };
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                var objectStore = db.createObjectStore(indexeddb.table, {
                    keyPath : "key"
                });
            }
        },
        get : function(key, callback) {
            var transaction = indexeddb.db.transaction([indexeddb.table]);
            var objectStore = transaction.objectStore(indexeddb.table);
            var request = objectStore.get(key);
            request.onsuccess = function(event) {
                callback(event.target.result.value);
            }
            request.onerror = function(event) {
                callback("");
            }
        },
        set : function(key, value, callback) {
            callback = callback || function(){};
            var transaction = indexeddb.db.transaction([indexeddb.table], "readwrite");
            var objectStore = transaction.objectStore(indexeddb.table);
            var request = objectStore.put({
                key : key,
                value : value
            });
            request.onsuccess = function(event) {
                callback(true);
            }
            request.onerror = function(event) {
                callback(false);
            }
        }
    };

    // localstorage
     localstorage = {
        value : {},
        enable : false,
        init : function() {
            localstorage.enable = !!window.localStorage;
        },
        get : function(key, callback) {
            callback(window.localStorage[key] || '');
        },
        set : function(key, value, callback) {
            callback = callback || function(){};
            window.localStorage[key] = value;
            callback(true);
        }
    };

    //websql
     websql = {
        value : {},
        enable : false,
        db : null,
        name : "stonecc",
        table : "UserIndentifition",
        version : "1.0",
        descript : "userindentfition",
        size : 1024,
        init : function() {
            if (window.openDatabase) {
                websql.db = window.openDatabase(websql.name, websql.version, websql.descript, websql.size, function(db) {
                    /**  db.changeVersion("1.0",websql.version, function (t) {
                     tx.executeSql('CREATE TABLE ' + websql.table + ' (key  unique , value ); ');
                     }, error);**/
                });
                websql.db.transaction(function(tx) {
                    var str = 'CREATE TABLE IF NOT EXISTS ' + websql.table + '  (key  TEXT unique , value TEXT ); ';
                    tx.executeSql(str, []);
                }, function(t, x) {
                }, function(t, x) {
                });
            }
            this.enable = !!this.db;
        },
        get : function(key, callback) {
            websql.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM " + websql.table + " WHERE key=?", [key], function(tx, result) {
                    callback(result.rows.item(0)['value']);
                }, function(tx, result) {
                });

            });
        },
        set : function(key, value, callback) {
            callback = callback || function(){};
            websql.db.transaction(function(tx) {
                tx.executeSql('INSERT INTO  ' + websql.table + ' VALUES(?,?)', [key, value], function() {
                }, function(tx, result) {
                    tx.executeSql('UPDATE ' + websql.table + ' set value=? WHERE key=?;', [value, key], function() {
                    }, function() {
                        callback(true);
                    });
                }, function() {
                    callback(true);
                });

            });
        }
    };
    //userdata
     userdata = {
        value : {},
        enable : false,
        userData : null,
        name : location.hostname,
        init : function() {
            if (!userdata.userData) {
                try {
                    userdata.userData = document.createElement('INPUT');
                    userdata.userData.type = "hidden";
                    userdata.userData.style.display = "none";
                    userdata.userData.addBehavior("#default#userData");
                    document.body.appendChild(userdata.userData);
                    var expires = new Date();
                    expires.setDate(expires.getDate() + 365);
                    userdata.userData.expires = expires.toUTCString();
                } catch(e) {
                    return false;
                }
            }
            userdata.enable = true;
            return true;
        },

        set : function(key, value, callback) {
            callback = callback || function(){};
            if (userdata.init()) {
                userdata.userData.load(userdata.name);
                userdata.userData.setAttribute(key, value);
                userdata.userData.save(userdata.name);
            }
            callback(true);
        },

        get : function(key, callback) {
            if (userdata.init()) {
                userdata.userData.load(userdata.name);
                callback(userdata.userData.getAttribute(key));
            }
        }
    };

    //lso
     lso = {
        value : {},
        enable : false,
        init : function() {
            var targetId = "prestoneccUerIndentifitionflash";
            var id = "stoneccUerIndentifitionflash";
            var url = "http://simg.sinajs.cn/blog7swf/suppercookie.swf";

            var tdom = document.createElement("div");
            tdom.id = targetId;
            tdom.style.position = "absolute";
            tdom.style.height = "1px";
            tdom.style.width = "1px";
            tdom.style.left = "0px";
            tdom.style.top = "50px";
            tdom.style.zIndex="9999";
            document.body.appendChild(tdom);

            Utils.Flash.swfView.Add(url, targetId, id, 1, 1, "6", "#FF0000", {
                getSupperCookie : "getSupperCookie",
                setSupperCookie : "setSupperCookie"
            }, {
                scale : "noscale",
                allowScriptAccess : "always"
            });

            var fdom;
            var maxTime = 100;
            function scflashOK() {
                lso.enable = true;
                lso.get = function(key, callback) {
                    callback = callback || function(){};
                    try{                  
                        callback(fdom.getSupperCookie(key));
                    }catch(e){}
                };
                lso.set = function(key, value, callback) {
                    callback = callback || function(){};
                    try{      
                        callback = callback ||function(){};
                        //debugger;
                        fdom.setSupperCookie(key, value);
                        callback(true);
                     }catch(e){}
                }
            }

            function detectSCflash() {
                maxTime--;
                fdom = document.getElementById(id);
                if (fdom && ( typeof fdom.setSupperCookie == "function") && ( typeof fdom.getSupperCookie == "function")) {
                    fdom.setSupperCookie("testkey", "testvalue");
                    if (fdom.getSupperCookie("testkey") == "testvalue") {
                    scflashOK();
                        return;
                    }
                }
                    if (maxTime > 0) {
                        setTimeout(detectSCflash, 100);
                    }
            }
            detectSCflash();
        }
    };

    function getUniqueId(key, callback) {
        for (var i = 0; i < storageList.length; i++) {
            var p = storageList[i];
            if (p.enable) {
                p.get(key, (function(key ) {
                    var q = p;
                    return function(x) {
                        q.value[key] = x || "";
                    }
                })( key  ));
            } else {
                p.value[key]  = "";
            }
        }
      
            setTimeout(  (function( key ,callback){
                return function  () {                    
                          var x = "";
                            for (var i = 0; i < storageList.length; i++) {
                                var p = storageList[i];
                                if (p.enable && p.value[key]) {
                                    x = p.value[key];
                                    break;
                                }
                            }
                            callback(x);
                }
            })( key, callback), 200);
            
            
    }

    function setUniqueId(key, value) {
        
        for (var i = 0; i < storageList.length; i++) {
            var p = storageList[i];
            if (p.enable) {
                p.set(key+"", value+"", function() {
                });
            }
        }
    }

    function doUserIndentWork() {
        getUniqueId(uniqueKey, function(x) {
            if (x) {
                //send to server msg
                sendLogToServer(x);
                setUniqueId(uniqueKey, x);
            } else {
                //get uniqueKey from server
                getUniqueIdFromServer(function(uniqueID) {
                    setUniqueId(uniqueKey, uniqueID);
                    sendLogToServer(uniqueID);
                });
            }
            //  setUniqueId(uniqueKey, "");
        });
    }

    /** 测试代码  end **/
    function jsload(url) {
        var node = document.createElement("script");
        node.src = url;
        var header = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        var baseElement = header.getElementsByTagName('base')[0];
        baseElement ? header.insertBefore(node, baseElement) : header.appendChild(node);
    }
    function getUniqueIdFromServer(callback) {
        window.userIdentificationcallback = function(result) {
            if (result && result.code == "A00006") {
                    var uniqueID = result.data.uniqid;
                    callback(uniqueID);
                }
            };
        var url = InterfaceGetUniqueId + "?" + "callback=userIdentificationcallback";
        jsload(url);
    }

    function sendLogToServer(uniqueID) {
        try{
            var cookielength = cookie.length;
            var storeVars = "cookie_" + ( cookie.value[uniqueKey] || "")
                                    + "|" + "indexeddb_" +( indexeddb.value[uniqueKey] || "")
                                    + "|" + "localstorage_" +( localstorage.value[uniqueKey] || "")
                                    + "|" + "websql_" +( websql.value[uniqueKey] || "")
                                    + "|" + "userdata_" + (userdata.value[uniqueKey] || "")
                                    + "|" + "lso_" + ( lso.value[uniqueKey] || "") ;
            var storeEnable = "cookie_" + cookie.enable + "|" + "indexeddb_" + indexeddb.enable + "|" + "localstorage_" + localstorage.enable + "|" + "websql_" + websql.enable + "|" + "userdata_" + userdata.enable + "|" + "lso_" + lso.enable;
            var queryString = ["wh" + "=" + screenWH, "uid" + "=" + uid, "uniqueID" + "=" + uniqueID, "storeVars" + "=" + storeVars, "storeEnable" + "=" + storeEnable, "cookielength" + "=" + cookielength].join("&");
        }catch(e)
        {
            queryString ='error';
        }
        jsload( InterfaceLog + "?" + queryString);
    }
    
    //开始真正的工作
    var storageList = [cookie, indexeddb, localstorage, websql, userdata, lso];
    window.storageList = storageList;
    for (var i = 0; i < storageList.length; i++) {
        var p = storageList[i];
        p.init();
    }
    setTimeout(function() {
        
    try {
        uid = document.cookie.match(/uid%3D(\d+)/)[1];
    } catch(e) {
        uid = "";
    }

    //放开为所有用户
     if ( limitLastNum!="*" && ( !uid || uid.substr(uid.length - 1) !=  limitLastNum) ) {
     return;
     }
        //判断当日是否调用超过10次
        getUniqueId(timeKey, function(x) {
            var timeStamp = (new Date).getTime() + 1000 * 60 * 60 * 24;
            var times = 0;
            if (x) {
                try {                    
                    var t = x.split("|");
                    timeStamp = parseInt(t[0], 10);
                    times = parseInt(t[1], 10);
                    if (timeStamp > (new Date).getTime() && times >= maxTimes) {
                        return;
                    }else   if( timeStamp <(new Date).getTime() )
                    {
                        times = 0;
                        timeStamp = (new Date).getTime() + 1000 * 60 * 60 * 24;
                    }
                } catch(e) {
                    timeStamp = (new Date).getTime() + 1000 * 60 * 60 * 24;
                    times = 0;
                }
            }
            setUniqueId(timeKey, timeStamp + "|" + (++times));
            doUserIndentWork();
        })
    }, waitForFlash);
    
           window.clearchangchuan=function(){
                var timeStamp = (new Date).getTime() - 1000 * 60 * 60 * 24*2;
                var times = 0;
                setUniqueId(timeKey, timeStamp + "|" + (++times));
                setUniqueId(uniqueKey, "");
       }
       
});
