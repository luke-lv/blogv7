/**
 * 加载测试脚本测试
 *
 */
function include(path) {
    var isLoaded = document.readyState === 'complete';
    var url = location.href;
    url = url.split('test')[0];
    url = url.split('sinaEditor')[0];
    if (isLoaded) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = url + path;
    } else {
        document.write('<sc' + 'ript src="' + url + path + '"></scri' + 'pt>');
    }
}

$import = include;
