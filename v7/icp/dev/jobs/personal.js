/**
 * @fileoverview 个人档案
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-14
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");

$import("lib/dialogConfig.js");
$import("lib/component/platformTray/platformTray.js");

$import("product/personal/basicInfo.js");
$import("product/personal/experience.js");
$import("product/personal/resume.js");
$import("product/personal/searchPeople.js");


/**
 * 个人档案
 */
scope.Personal=Core.Class.create();
scope.Personal.prototype={
	
	/**
	 * 初始化
	 */
	initialize:function(){
		this.initBasicInfo();
		this.initExperience();
		this.initResume();
		this.initSearchPeople();
	},
	
	/**
	 * 初始化基本信息
	 */
	initBasicInfo:function(){
		scope.BasicInfo.initialize();
	},
	
	/**
	 * 初始化个人经历
	 */
	initExperience:function(){
		scope.Experience.initialize();
	},
	
	/**
	 * 初始化个人简介
	 */
	initResume:function(){
		scope.Resume.initialize();
	},
	
	/**
	 * 是否开启搜人的项目
	 */
	initSearchPeople : function() {
		scope.SearchPeople.initialize();
	}
	
};

$registJob("personal", function(){
	var personal=new scope.Personal();

	//xy 2009-12-07  
		
	if(false && $E('pop1') &&   scope.$pageid=='personalM'){
			if (Utils.Cookie.getCookie("pinxa") == "") {
				$E('pop1').style.display = "";
				$E('pop2').style.display = "";
			}
			
			Core.Events.addEvent($E('popbtn'),function(){
				if($E('pop1')){
					$E('pop1').style.display="none";
					$E('pop2').style.display="none";
					if (Utils.Cookie.getCookie("pinxa") == "") {
                    	Utils.Cookie.setCookie("pinxa", "1", 5000000, "/", "profile.blog.sina.com.cn");
               	 	}
				}
			});
	}
});
