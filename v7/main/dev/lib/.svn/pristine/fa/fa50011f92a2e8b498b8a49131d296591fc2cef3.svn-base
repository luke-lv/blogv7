$import("lib/util/_util.js");
$import("lib/apply.js");
/**
 * @fileoverview 文件说明
 *
 * @create 2012-10-09
 * @author Qiangyee
 */
Lib.util.loopArray = function (arr){
    var currentIndex = 0;
    var _that = {
        /**
         * 从index处获取num个元素
         * @retrun {Array} 获取的num个元素
         */
        getArray : function(num, index){
            var len = arr.length;
            var result = [], tmp;
            for ( var i = 0; i < num; i++ ) {
                tmp = arr[(i+index)% len];
                result.push(tmp);
            }
            
            return result;
        }
        /**
         * 获取上num个元素
         * @retrun {Array} 获取的num个元素
         */
        ,previous : function(num){
            var len = arr.length;
            var index = (len + currentIndex - num) % len;
            var result = this.getArray(num, index);
            currentIndex = (len + currentIndex - num) % len;
            return result;
        }
        /**
         * 获取下num个元素
         * @retrun {Array} 获取的num个元素
         */
        ,next : function(num){
            var len = arr.length;
            var index = (len + currentIndex + num) % len;
            var result = this.getArray(num, index);
            currentIndex = (currentIndex + num) % len;
            return result;
        }
        
    };
    Lib.apply(this, _that);
};
