/**
 * @fileoverview
 *    专辑联播页控制当前播放的视频列表，返回下一个应该播放的视频
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */
$import("sina/core/array/foreach.js");
$import("sina/core/class/create.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");

$import("lib/app.js");
$import("lib/interface.js");

App.playlist = Core.Class.create();

App.playlist.prototype = {
    // 默认每页10条数据
    "pageSize": 10

    // 记录当前专辑的总视频数
    , "total": 0

    // 当前播放页码，默认第一页开始播放
    , "currentPgNum": 1

    // 当前播放视频在页码中的指针，默认播放第一页第一个视频
    , "currentIndex": 0

    // 当前播放页中的视频信息
    , "currentPlist": null

    // 缓存已加载过的页码
    , "cachelist": {}, "initialize": function (sTid, sUid) {
        this.tid = sTid;
        this.uid = sUid;
        this.cachelist = {};
    }

    // 取得下一个要播放的视频
    , "getNextVideo": function (fCallBack) {
        // 如果当前页码无数据
        if (this.cachelist[this.currentPgNum] == null) {
            // Debug.log("正在加载第 " + this.currentPgNum + " 页数据");
            this.loadDataFromPage(this.currentPgNum, Core.Function.bind3(this.getNextVideo, this, [fCallBack]));
        } else {
            // 下一个应该播放的视频
            var currentVideo;
            // 判断当前是否已经播放了所有视频
            this.isEnd = (this.currentPgNum - 1) * this.pageSize + this.currentIndex >= this.total;
            // 如果尚未到最后一个视频
            if (this.isEnd == false) {
                var video = this.cachelist[this.currentPgNum][this.currentIndex];
                currentVideo = [video.vid, video.uid];
                // 如果当前页已经是最后一条，就跳页
                if (this.currentIndex + 1 == this.pageSize) {
                    this.currentIndex = 0;
                    this.currentPgNum += 1;
                } else {
                    this.currentIndex++;
                }
                Debug.log(((this.currentPgNum - 1) * this.pageSize + this.currentIndex) + " / " + this.total + "，播放完毕 : " + this.isEnd);
            } else {
                currentVideo = [-1, -1];
                Debug.log("全部播放完毕，展示推荐列表");
            }
            var paginationInfo = this.currentIndex != 1 ? null : {  data: this.cachelist[this.currentPgNum], page: this.currentPgNum, totalPage: this.totalPage
            };
            fCallBack(currentVideo, paginationInfo);
        }
    }
    // 设置某一视频为当前视频
    , "setAsCurrent": function (sVid, sUid, nPage) {
        this.currentPgNum = nPage;
        // 遍历当前页，看正在播放的视频是第几个，把指针指向它的下一个
        var list = this.cachelist[this.currentPgNum];
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].vid == sVid && list[i].uid == sUid) {
                this.currentIndex = i + 1;
                // 如果当前是当页最后一个视频，则下一个是新的一页
                if (this.currentIndex > 9) {
                    this.currentIndex = 0;
                    this.currentPgNum += 1;
                }
                Debug.log(((this.currentPgNum - 1) * this.pageSize + this.currentIndex) + " / " + this.total + "，播放完毕 : " + this.isEnd);
                break;
            }
        }
    }
    // 获取第几页数据
    , "getPageInfo": function (nPage, fCallBack) {
        // 改成每次都去读取接口来获取当前页的列表
        this.loadDataFromPage(nPage, fCallBack);
    }
    // 载入第几页的数据，并回调
    , "loadDataFromPage": function (nPage, fCallBack) {
        // 如果没有设定某个专辑，就读取最新视频列表
        if (this.tid == 0) {
            // Debug.log("读取最新视频列表");
            var param = {
                "uid": this.uid,
                "channelId": "",
                "page": nPage || 1,
                "varname": "requestId_vl_" + this.uid
            };
            new Interface("http://you.video.sina.com.cn/api/videoList.php", "jsload").request({
                GET: param,
                onSuccess: Core.Function.bind2(function (oData) {
                    // 视频数
                    this.total = oData.count;
                    // 页码数
                    this.totalPage = Math.ceil(this.total / this.pageSize);
                    // 解析数据格式与专辑列表的接口格式统一
                    for (var i = 0, len = oData.videoList.length; i < len; i++) {
                        oData.videoList[i].vid = oData.videoList[i].videoid;
                        oData.videoList[i].uid = oData.videoList[i].up_userid;
                        oData.videoList[i].nick = oData.videoList[i].up_username;
                        oData.videoList[i].name = oData.videoList[i].nameAll;
                        oData.videoList[i].creatdate = oData.videoList[i].creatTime;
                        oData.videoList[i].image = oData.videoList[i].videoImage;
                    }
                    // 缓存当前页数据
                    this.cachelist[nPage] = oData.videoList;
                    fCallBack({
                        data: this.cachelist[nPage], page: nPage, totalPage: this.totalPage
                    });
                }, this)
            });
        } else {
            // Debug.log("读取专辑 " + this.tid + " 列表");
            var oData = {
                "uid": this.uid,
                "tid": this.tid,
                "page": nPage || 1,
                "pagesize": this.pageSize,
                "type": 1, // 播放顺序，按加入时间顺序
                "varname": "requestId_cv_" + this.uid
            };
            new Interface("http://you.video.sina.com.cn/api/catevideoList.php", "jsload").request({
                GET: oData,
                onSuccess: Core.Function.bind2(function (oData) {
                    // 视频数
                    this.total = oData.count;
                    // 页码数
                    this.totalPage = Math.ceil(this.total / this.pageSize);
                    // 缓存当前页数据
                    this.cachelist[nPage] = oData.videoList;
                    fCallBack({
                        data: this.cachelist[nPage], page: nPage, totalPage: this.totalPage
                    });
                }, this)
            });
        }
    }
};