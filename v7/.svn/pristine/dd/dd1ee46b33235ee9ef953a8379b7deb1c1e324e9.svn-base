/**
公共组件，收集项目中最常用的组件。

- 用于在项目打包时合并常用模块，提供所有页面都需要使用的功能。
- 建议不要在这里编写具体逻辑，公共业务逻辑最好封装为公共业务模块，然后在这里引入。
- 构建打包系统时，这个文件列举的模块不应当再打包到模块文件中。
- 这个模块打包后应当与页面的公共文件合并，在页面内直接载入。

@mixin conf/global
**/
define('conf/global',function(require,exports,module){

	require('vendor/mustache/mustache');

	require('lib/mvc/base');
	require('lib/mvc/delegate');
	require('lib/mvc/model');
	require('lib/mvc/view');

	require('mods/common/header');

});

