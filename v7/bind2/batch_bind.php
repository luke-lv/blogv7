<?php 
header('Content-Type: text/plain; Charset=UTF-8');
function listDirTree($dirName = null, $filterRule = null, &$file_tree, $source_path) {
    if ( empty($dirName))
        exit("IBFileSystem:directoryisempty.");
    if (is_dir($dirName)) {
        if ($dh = opendir($dirName)) {
            $tree = array();
            while (($file = readdir($dh)) !== false) {
                if ($file != "." && $file != "..") {
                    $filePath = realpath($dirName."/".$file);
                    if (substr($file, 0, 1) != '.') {
                        if (is_dir($filePath)) {
                            $tree[$file] = listDirTree($filePath, $filterRule, $file_tree, $source_path);
                        }
                        else {
                            if ($filterRule == null || $filterRule == '' || $filterRule == '*') {
                                $tree[] = $file;
                                $file_tree[] = array($filePath, $file);
                            }
                            else {
                                $file_suffix = explode('*', $filterRule);
                                $file_suffix_count = count($file_suffix);
                                if ($file_suffix_count == 1) {
                                    if ($file_suffix[0] == $file) {
                                        $tree[] = $file;
                                        $file_tree[] = array($filePath, $file);
                                    }
                                }
                                else {
                                    array_shift($file_suffix);
                                    $file_suffix = implode('*', $file_suffix);
                                    
                                    if (substr($file, -strlen($file_suffix)) == $file_suffix) {
                                        $tree[] = $file;
                                        $file_tree[] = array($filePath, substr($file, 0, -strlen($file_suffix)));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            closedir($dh);
        }
        else {
            exit("IBFileSystem:cannotopendirectory$dirName.");
        }
        return array($tree_file, $tree);
    }
    else {
        exit("IBFileSystem:$dirNameisnotadirectory.");
    }
}
$file_tree = array();
/*
 论坛的操作模式模板
 js/conf/*.dev.js		js/*.js				pack
 css/*.css				css/*.css			pack
 images/*				images/*			copy
 tpl/*					tpl/*				copy
 static/*				static/*			copy
 tpl/*.css				tpl/*.css			pack
 js/boot.js				js/boot.js			replace&pack
 */

$base_url = 'D:/My Works/EditorAPI/tiezi/';
$cmd = '/css/';

listDirTree($base_url . $cmd, '*.css', $file_tree, 'D:/My Works/EditorAPI/tiezi/');
//listDirTree('D:/My Works/EditorAPI/tiezi/' . 'css/', '*.css', $file_tree);
//listDirTree('D:/My Works/EditorAPI/tiezi/' . 'js', 'boot.js', $file_tree);

$_CONFIG = array(
	array(
		'cmd'=>'js/conf/*.dev.js,js/*.js,pack',
		'source'=>'D:/My Works/EditorAPI/dev/tiezi/js/conf',
		'target'=>'D:/My Works/EditorAPI/online/tiezi/js/',
		'data'=>array(
			array('editor.dev.js', 'editor.js'),
			array('editor/editor.dev.js', 'editor/editor.js')
		)
	),
	array(
		'cmd'=>'css/*.css,css/*.css,pack',
		'source'=>'D:/My Works/EditorAPI/dev/tiezi/css',
		'target'=>'D:/My Works/EditorAPI/online/tiezi/css/',
		'data'=>array(
			array('editor.dev.js', 'editor.js'),
			array('editor/editor.dev.js', 'editor/editor.js')
		)
	)
);

//var_dump($file_tree);
//var_dump( pathinfo('D:/\\\My Works\EditorAPI/asdfbasdf/asdfasdf/asdfi.dev.js'));
/*
 js/conf/*.dev.js js/*.js js
 */

