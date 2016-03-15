 var switchMemo = function(str,flag){

     if (flag) {
	 	return str.replace(/(<br>|&nbsp;|&amp;|&lt;|&gt;|&|<|>| |\r\n|\n)/gi, function(b){
	 		switch (b.toLowerCase()) {
	 			case "<br>":
	 				return "\r\n";
	 			case "&nbsp;":
	 				return " ";
	 			case "&amp;":
	 				return "&";
	 			case "&lt;":
	 				return "<";
	 			case "&gt;":
	 				return ">";
	 		}
	 	});
	 }
	 else {
	 	return str.replace(/(&|<|>| |\r\n|\n)/g, function(b){
	 		switch (b) {
	 			case "\r\n":
	 			case "\n":
	 			return "<br>";
	 			case " ":
	 			return "&nbsp;";
	 			case "&":
	 			return "&amp;";
	 			case "<":
	 			return "&lt;";
	 			case ">":
	 			return "&gt;";
	 		}
	 	});
	}
 };