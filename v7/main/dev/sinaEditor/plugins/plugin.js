/**
 *
 * 插件管理器
 */
SinaEditor.regist('PluginManager', function (SE) {
    var Util = SE.Util;
    var PluginManager = {
        __PLUGINS: {},
        /**
         * 注册插件
         * @param name
         * @param func
         */
        register: function (name, func) {
            var name = name.toLowerCase();
            if (this.__PLUGINS[name]) {
                throw new Error('重复定义插件：' + name);
            }
            this.__PLUGINS[name] = func;
        },
        /**
         * 初始化插件<br>
         * 插件初始化完成后在编辑器上触发 plugin.pluginname事件
         * @param pluginConf
         */
        /**
         * 初始化插件<br>
         * 插件初始化完成后在编辑器上触发 plugin.pluginname事件
         * @param {JSON} pluginConf 插件配置
         * @param {Editor} editor
         */
        initPlugin: function (pluginConf, editor) {
            var plugin = PluginManager.__PLUGINS[pluginConf.name.toLowerCase()];

            editor = editor || this;

            if (!pluginConf || !plugin) {
                return;
            }

            var name = pluginConf.name.toLowerCase();
            if (editor.plugins[name] instanceof plugin) {
//            console.log('没有找到插件:', name);
                return;
            }
            editor.plugins[name] = new plugin(pluginConf.params || {}, editor);
            editor.fire('plugin.' + name, editor.plugins[name], pluginConf.params);
        },
        /**
         * 初始化许多插件，初始化完成后在editor上触发pluginOnLoaded事件<br>
         * 此方法为异步方法。
         * @param {array} plugins 插件配置数组
         * @param {Editor} editor 插件所属的编辑器
         */
        initPlugins: function (plugins, editor) {
            var self = this, level0 = [], level1 = [], level2 = [], count = 0;

            for (var p = 0, len = plugins.length; p < len; p++) {
                var pluginConf = plugins[p];
                switch (pluginConf.level) {
                    case 0:
                        level0.push(pluginConf);
                        break;
                    case  2:
                        level2.push(pluginConf);
                        break;
                    default :
                        level1.push(pluginConf);
                }

            }

            // 初始化各级别插件
            function init(deffered, plugins) {
                var currentCount = 0;
                if (!plugins.length) {
                    deffered.next();
                }
                for (var p = 0, currentLength = plugins.length; p < currentLength; p++) {
                    var pluginConf = plugins[p];
                    (function (conf) {
                        // 预防插件初始化出错及一次渲染大量节点
                        setTimeout(function () {
                            currentCount++;
                            count++;
                            self.initPlugin.call(editor, conf);
                            if (currentLength <= currentCount) {
                                deffered.next()
                            }
                            if (len <= count) {
                                editor.fire('pluginOnLoaded');
                            }
                        }, 15);
                    })(pluginConf);
                }
            }

            Util.Deffer(function (d) {
                init(d, level0);
            }).then(function (d) {
                init(d, level1);
            }).then(function (d) {
                init(d, level2);
            }).start();
        },

        /**
         * 向编辑添加插件
         * @param pluginConf
         * @param {Editor} editor 可选参数，插件配置所属的编辑器
         */
        addPlugin: function (pluginConf, editor) {
            PluginManager.initPlugin.call(editor || this, pluginConf, editor);
        }
    }
    return PluginManager;
});

