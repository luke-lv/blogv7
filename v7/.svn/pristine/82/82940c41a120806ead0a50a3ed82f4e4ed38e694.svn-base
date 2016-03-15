/**
 * @fileoverview | 正文页关注的赛事
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */

$import('sina/sina.js');
$import("sina/ui/template.js");
$import("worldcup/info/teamsMsg.js");
$import("sina/utils/io/jsload.js");

$registJob('favGames', function () {

    if (typeof(attentionWorldCup) == "undefined") return;
    if (!attentionWorldCup.show_attentiongame.length) return;

    if (scope.wc_match_info) {
        init();
    } else {
        Utils.Io.JsLoad.request("http://blog.sina.com.cn/2010worldcup/worldcup.js", {
            onComplete: function () {
                scope.wc_match_info = wc_match_info;
                scope.wc_teams_info = wc_team_info;
                init();
            }
        });
    }

    //初始化
    function init() {
        var gameHash = scope.wc_match_info;								//接口。
        var teamHash = scope.wc_teams_info;
        var gameInfo = attentionWorldCup.show_attentiongame;			//来自页面。
        var teamInfo = attentionWorldCup.show_attentionteam;
        var showQuali = 6;

        var gameExcel = [
            '<table border="0" cellpadding="0" cellspacing="1">', '<tr>', '<th scope="col" class="w1">日期</th>',
            '<th scope="col" class="w2">时间</th>', '<th scope="col">对阵</th>', '</tr>#{itemLines}', '</table>'].join("");

        var gameItem = [
            '<tr>', '<td>#{date}</td>', '<td class="wdc_ta">#{time}</td>',
            '<td class="wdc_te"><span class="matchL">#{army1}</span><span class="vs wdc_ta"> VS </span><span class="matchR">#{army2}</span></td>',
            '</tr>'].join("");

        var gameExcelBox = $E("favGames");
        var temp = "";
        var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        var i, k;
        var seqTime = [];
        var tempTime = [];
        var idxTime = [];

        //先通过页面变量，取出 attentionGame 的完整数据。
        var userGameHash = [];
        for (i = 0; i < gameInfo.length; i++) {
            trace("userGameHash " + gameHash[gameInfo[i]].score + "////" + i);
            userGameHash.push(gameHash[gameInfo[i]]);
        }

        //取没有比分的六个。
        var userLastMatch = getElemIfHasProp(userGameHash, "score", showQuali, true);
        trace("length: " + userLastMatch.length);

        //然后排序。使用 join 和 split 和 sort。这儿用不着了。json 不好使。
        for (i = 0; i < userLastMatch.length; i++) {
            trace(i);
            var preDate = (userLastMatch[i].time.split(" ")[0]).split("-");
            var preTime = (userLastMatch[i].time.split(" ")[1]).split(":")[0];		//取小时。
            var d = new Date();
            d.setMonth(preDate[1] - 1);
            d.setDate(preDate[2]);
            d.setHours(preTime);
            seqTime[i] = d.getTime();
        }
        tempTime = tempTime.concat(seqTime);

        var tt;
        var ttid;
        var arraged = [];
        for (k = 0; k < seqTime.length; k++) {
            tt = seqTime[0];
            ttid = 0;
            for (i = 1; i < seqTime.length; i++) {
                if (seqTime[i] < tt) {
                    tt = seqTime[i];
                    ttid = i;
                }
            }
            arraged.push(ttid);
            //seqTime.splice(ttid, 1);
            seqTime[ttid] = Infinity;
        }

        for (i = 0; i < seqTime.length; i++) {
            var preDate = (userLastMatch[arraged[i]].time.split(" ")[0]).split("-");
            var d = new Date();
            d.setMonth(preDate[1] - 1);
            d.setDate(preDate[2]);
            var w = d.getDay();
            //d = d.toLocaleDateString().slice(5);			//chrome 竟然不支持本地化！
            d = (d.getMonth() + 1) + "月" + d.getDate() + "日";
            temp += new Ui.Template(gameItem).evaluate({
                army1: teamHash[userLastMatch[arraged[i]].teams[0]].name,			//呃，必须由 gameInfo 出来。
                army2: teamHash[userLastMatch[arraged[i]].teams[1]].name,
                date: d + " " + week[w],
                time: userLastMatch[arraged[i]].time.split(" ")[1].slice(0, -3)
            });
        }

        gameExcelBox.innerHTML = new Ui.Template(gameExcel).evaluate({
            itemLines: temp
        });
    }

    //取到纯净的集合，要么全有比分，要么全没有。
    function getElemIfHasProp(arr, pName, num, reverse) {
        var i;
        var pureArr = []
        var result = [];

        //先取出所有有比分或没比分的
        for (i = 0; i < arr.length; i++) {
            if (reverse ? !arr[i][pName] : arr[i][pName]) {
                pureArr.push(arr[i]);
            }
        }

        //默认取向，是否可以设计成让修改？设计成可接受一个比较函数。
        //然后按需挑出。
        for (i = 0; i < num; i++) {
            if (!pureArr[i]) {
                trace("src not enough");
                break;
            }
            result.push(pureArr[i]);
        }

        return result;
    }

});





