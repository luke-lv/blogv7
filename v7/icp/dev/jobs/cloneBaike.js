/**
 * @author meichun1@staff.sina.com.cn
 * 克隆名人组件
 */
$registJob("cloneBaike", function(){

        if ($E('addbaike')) {
                $E('addbaike').onclick = function(){
						Core.Events.stopEvent();
                        Lib.Component.clone(119, 210);
						
                }
                
        }
})
