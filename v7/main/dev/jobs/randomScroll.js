/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 随便逛逛
 * @update liming9@ 2012年5月25日 把随机地址从后台请求文件
 */
$import("other/randomScroll.js");
$import("sina/core/events/addEvent.js");
//$import("lib/sendLog.js");
$import("sina/utils/io/jsload.js");

$registJob("randomScroll", function () {
    //请求后台文件获取数据
    Utils.Io.JsLoad.request('http://blog.sina.com.cn/lm/rndurllist.js', {
        onComplete : function(){
            if( typeof RND_URL_LIST==="undefined" || !RND_URL_LIST || !RND_URL_LIST.length ){
                return;
            }
            var rand = new Lib.RandomStroll(RND_URL_LIST);
            rand.load({
                target: "_self",
                URL: ""
            });
        }
    });

    /*
    var randomTime = new Date().getTime();
    var link_url = "http://qing.weibo.com";
    //var url_4_blog = "http://blog.sina.com.cn/myblog/rankuidview.php?time="+randomTime;
    var url_4_blog = "http://blogtj.sinajs.cn/api/rankuidview.php";//随便看看的新接口

    var uidlist = ["1642307592", "1776436963", "2011737750", "1745855243", "1052690963", "2307037011", "2477293754", "2428596402", "2217613795", "2159132192", "1793782980", "2305264314", "2201019311", "1762699633", "1787959937", "1682089864", "1691694414", "1643012580", "2210330677", "2472871330", "1829043365", "2309971847", "1684927203", "2140557323", "2118946603", "1224010405", "1650382264", "2460856874", "1444179951", "1296478197", "1299566930", "1810448851", "2515640494", "1660293320", "2315482287", "2406192744", "2033172132", "2339748807", "1738844272", "1889828002", "1595799043", "1304303872", "2272568451", "1240779204", "1647171904", "2151641792", "1730404821", "1679760995", "1665521742", "1240956021", "1737366441", "1646053882", "1604300451", "2419040670", "1686553147", "1770897864", "1923461141", "1351866463", "2441201170", "1216681563", "1785165884", "1903935815", "1154814271", "1756704015", "2182339254", "2045750915", "2134341503", "2280339501", "1954608830", "1775869723", "1955204701", "1792580327", "1899095893", "1864510283", "2343963017", "1664909963", "1116864983", "2306112285", "1303160971", "2035536863", "1139847021", "1980057627", "2303012142", "1099670950", "1917201645", "1771765700", "1749610313", "1366358095", "1248584111", "1895223293", "2068957384", "1560980831", "2132672885", "2346989115", "1346496240", "2179565352", "2393980691", "1768430624", "1751868735", "2427312325", "1352505702", "1752908232", "1584640253", "1450645694", "1909681044", "1869041472", "1617805930", "2386921833", "2249559122", "1797965422", "1399746707", "1364321764", "1939192091", "1664477787", "1268983770", "2403974777", "1595196717", "1796948085", "1730970511", "1247545425", "1406448997", "2286087513", "1774370935", "1302400214", "1189463264", "1771938322", "2254623380", "1821343032", "2162508004", "1243074503", "2302576405", "1291998243", "1401737045", "2117055531", "1829569561", "1197180102", "1653369695", "1400861442", "1339286760", "1295728794", "1804998292", "1595391220", "1745118484", "1897183794", "1786226457", "1862259130", "2119508083", "2288458224", "2392346572", "1259295385", "1879214117", "2268643663", "2410957884", "2421375487", "2139620763", "2192129650", "2303649763", "2336239453", "1841700611", "1627123660", "2181096401", "1848018385", "1286293690", "1935562947", "2318758941", "2264623237", "2182744804", "2093356273", "2005309387", "1781480631", "1747096253", "1725974615", "1075274504", "2415748723", "2354245133", "2196997092", "2181011263", "2074501384", "2005925615", "1917369903", "1890612420", "1864837281", "1815070622", "1743510185", "1711622675", "1687296407", "1682765674", "1662439861", "1642248710", "1400833791", "1238415971", "1013377161", "2429631235", "2299464431", "2261697941", "2257822932", "2208282022", "2197004190", "2173381380", "2104012551", "1985472661", "1749953001", "1678325381", "1592735982", "1442083870", "1296492473", "1260818987", "1196293651", "2385560294", "2188413274", "2153615700", "2130119195", "1912400821", "1857390910", "1773403622", "1652307577", "1504025813", "1407533040", "1136287533", "1059359892", "2426724325", "2296161901", "2177548342", "2146827183", "2142009227", "2130272762", "2130042585", "1932008071", "1896525593", "1852444703", "1750520863", "1744345523", "1732756857", "1687672150", "1636129965", "1449062435", "1348998262", "1287699512", "1236633455", "1187929111", "1096169080", "2371845741", "2212283867", "2207177167", "2130440035", "1979491770", "1859109721", "1839065643", "1768928910", "1763462041", "1747370201", "1710643120", "1581231143", "1432151257", "1408284302", "2397841304", "2359355714", "2348228857", "2204023184", "2119378577", "2088029872", "2084419304", "1892618067", "1874400400", "1849996424", "1823209013", "1805416131", "1784519861", "1746656551", "1710464867", "1705615410", "1691955143", "1673391922", "1654241802", "1417274962", "1316015827", "1292479857", "1281008384", "1230304152", "1223838975", "1220982280", "1098513441", "2440088497", "2423607333", "2400272771", "2204708263", "2194731883", "2152975480", "2130550151", "2097682950", "1839606182", "1826125227", "1791668515", "1783543665", "1749835520", "1742924093", "1730502924", "1725836070", "1719619023", "1704754840", "1680479827", "1661036170", "1655152487", "1644293393", "1620983647", "1581359141", "1391960832", "1346216670", "1344792201", "1263328980", "1212731847", "2464998685", "2308493023", "2273393634", "2256215294", "2237824664", "2216287862", "2180990587", "2168755684", "2152971052", "2147488705", "2110741170", "2104286177", "2096936242", "2056418502", "2030496165", "1894091913", "1868057382", "1845211552", "1838628030", "1837616913", "1822520053", "1805005201", "1744950647", "1724035317", "1707665385", "1689332323", "1666188743", "1656034595", "1651736477", "1649233437", "1648348222", "1629756430", "1628452424", "1619634952", "1504787812", "1462491644", "1429378714", "1426545245", "1407731411", "1403114061", "1401320687", "1287979072", "1233491051", "1230601550", "1213712105", "1204832102", "1197564054", "1097403457", "1093860992", "2480783844", "2215995482", "2181492011", "2173527673", "2158630171", "2155910600", "2132408853", "2130226391", "2016976970", "1884519603", "1833494222", "1821697965", "1814493825", "1786632752", "1786004183", "1769139842", "1768225860", "1749887093", "1686495452", "1685997855", "1670537187", "1668305513", "1667610281", "1658427261", "1413408643", "1401888735", "1264453705", "1241648265", "1227573190", "2435253471", "2424846142", "2359114103", "2293263565", "2270484545", "2255269211", "2205124112", "2197956294", "2188410110", "2179778683", "2168832012", "2155975672", "2132209527", "2131369937", "2130171701", "2065009575", "2063125972", "2003931597", "1952247327", "1940978550", "1900275443", "1869211323", "1851709653", "1851222827", "1834677267", "1826577753", "1775351220", "1770841812", "1746271912", "1744135164", "1742787020", "1733317020", "1730672660", "1724960712", "1712542823", "1680846884", "1680080463", "1664603331", "1657053107", "1648823797", "1629873714", "1614043744", "1587878132", "1585662485", "1574046745", "1569870444", "1567532907", "1459164723", "1455165757", "1347501002", "1308202145", "1305082711", "1224920724", "1220824437", "1218363903", "1199712261", "2457741673", "2451305742", "2434397624", "2407101395", "2353178815", "2287794131", "2188286700", "2185251684", "2152980882", "2141692131", "2130786877", "2129869803", "2129387007", "1950507870", "1934271922", "1929460915", "1886680244", "1884725593", "1866413355", "1856158043", "1844915512", "1841922103", "1826206704", "1800031007", "1784761540", "1770382500", "1747561043", "1747334895", "1728282004", "1698171735", "1687048485", "1674637544", "1674156313", "1651674202", "1649523107", "1648752687", "1640172871", "1630620851", "1576387227", "1522814721", "1449951791", "1376906047", "1374940340", "1294306492", "1250260200", "1250107394", "1247820694", "1026426267", "1008257890", "2482079715", "2452255852", "2424863385", "2374844275", "2372508355", "2285108177", "2266114182", "2246747214", "2242636177", "2203119600", "2184794232", "2168256942", "2168016793", "2140515023", "2129928597", "2127943525", "2110457141", "2103187765", "2058350102", "2010413673", "1973627865", "1958818721", "1911298807", "1884743001", "1864970741", "1860859280", "1826529790", "1804434802", "1796679103", "1789513533", "1788727784", "1768682454", "1761580560", "1740496594", "1730547367", "1727739092", "1684643431", "1667242920", "1663238074", "1662037473", "1661211704", "1658223887", "1649596620", "1648680841", "1643124201", "1629649247", "1612734457", "1606337887", "1576980852", "1575471135", "1560956354", "1559526301", "1549547683", "1473097393", "1401354250", "1400314314", "1377324201", "1305972435", "1305062955", "1286033230", "1264516801", "1224829851", "1224232815", "1223019274", "1217963144", "1213615937", "1180563444", "1144706874", "1096460712", "1068803873", "2410407164", "2394860785", "2354073885", "2352273650", "2326197090", "2311724707", "2301275681", "2255849132", "2247536724", "2218423250", "2214260121", "2135708652", "2132163427", "2104488244", "2102790251", "2097108202", "2083137773", "2058936134", "2054686495", "2006141775", "2003316022", "2000016260", "1996187543", "1995322581", "1992617143", "1955987771", "1930881465", "1908364682", "1886817571", "1860371540", "1847834681", "1845984670", "1833134763", "1829872243", "1820821325", "1812907527", "1807676010", "1799735253", "1785749160", "1783583493", "1774468585", "1764684354", "1742091973", "1736397251", "1734527422", "1733448931", "1733308643", "1731704574", "1731531310", "1722334190", "1718770701", "1704240614", "1696393284", "1692802252", "1669786221", "1662851157", "1661746227", "1658913867", "1644807922", "1644368395", "1639034515", "1628073650", "1610906583", "1494848464", "1492537703", "1450649847", "1416265031", "1402716263", "1402215071", "1401350733", "1352282060", "1327951404", "1303203131", "1288567462", "1275431403", "1256740627", "1254881933", "1247097790", "1245856511", "1238247555", "1216497273", "1179500473", "1173097184", "1168308133", "1068465981"]; 

    var rand = new Lib.RandomStroll(link_url, uidlist);
    rand.load({
        target: "_self",
        URL: ""
    });
    */
	/*
	Core.Events.addEvent("ramdomVisitDiv", function(){
		trace("点击了随便逛逛的div");
		e = Core.Events.fixEvent(Core.Events.getEvent());
		trace("事件是："+e.type+";");
		trace("点击的按钮是："+e.button);
		v7sendLog("79_01_14", scope.$pageid, "");
		
		//写成多个if else是为了方便阅读的人看判读条件
		if (e.button == 1&&$IE) {
			Lib.RandomStroll.GoUrlByConfig.go(scope.blog_randomstroll_config);
			Lib.RandomStroll.getRandomURL(url_4_blog, link_url, rand, true);
			
		}else if(e.button==0 && ($MOZ||$FF2)){//BLOGBUG-5679 
			Lib.RandomStroll.GoUrlByConfig.go(scope.blog_randomstroll_config);
			Lib.RandomStroll.getRandomURL(url_4_blog, link_url, rand, true);
		}else if($OPERA||$SAFARI){
			Lib.RandomStroll.GoUrlByConfig.go(scope.blog_randomstroll_config);
			Lib.RandomStroll.getRandomURL(url_4_blog, link_url, rand, true);
		}
		else{
			Core.Events.stopEvent();
		}
	}, $FF ? "click" : "mousedown");
	*/
});
