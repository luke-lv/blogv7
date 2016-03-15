$import('sina/core/system/_system.js');

Core.System.keyValue = function(string, key) {
  var arr = string.match(new RegExp("(\\?|&)"+key+"=([^&]*)(&|$)"));
  if(arr != null) return arr[2]; return null;
};
