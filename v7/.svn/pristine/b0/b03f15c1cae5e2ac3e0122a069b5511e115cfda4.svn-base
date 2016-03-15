/*
   @ author shaomin |shaomin@staff.sina.com.cn
   @ desc define vote body here
*/

   var voteDom = {

       build : '  '+    
                         '<div class="state1" id="newStatus">'+
                          '<div class="voteBox1">'+
                            '<table border="0" cellspacing="0" cellpadding="0">'+
                              '<tr>'+
                                '<th><span>投票主题：</span></th>'+
                                '<td><input type="hidden" id="voteId" name="voteId" value="" /><input type="hidden" name="blogVote" value="yes" /> <input type="hidden" name="voteType" id="voteType" value="1" />'+
'<input type="text" id="voteTitle" name="voteTitle" class="Fm_input2" style="width:365px;" tabindex="500" /></td>'+
                              '</tr>'+
                              '<tr>'+
                                '<th><span>投票选项：</span><ul id="chooseIndex" class="ul2"></ul></th>'+
                                '<td><span class="SG_txtc note1">每行填写一个选项，最多可填写15个选项。</span>'+
                                  '<ul class="ul1" id="voteItems">'+
                                    '<li>'+
                                      '<input type="text" name="voteData[]" tabindex="501" class="Fm_input2" style="width:345px;" />'+
                                      '<a class="del" id="delItem1" href="javascript:void(0);" onclick="return false;"><img width="15" height="15" align="absmiddle" title="删除" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon43"/></a></li>'+
                                    '<li>'+
                                      '<input type="text" name="voteData[]" tabindex="501" class="Fm_input2" style="width:345px;" />'+
                                      '<a class="del" id="delItem2" href="javascript:void(0);" onclick="return false;"><img width="15" height="15" align="absmiddle" title="删除" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon43"/></a></li>'+
                                    '<li>'+
                                      '<input type="text" name="voteData[]" tabindex="501"  class="Fm_input2" style="width:345px;" />'+
                                       '<a class="del" id="delItem3" href="javascript:void(0);" onclick="return false;"><img width="15" height="15" align="absmiddle" title="删除" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon43"/></a></li>'+
                                  '</ul>'+
                                  '<div class="addbtn"><a href="javascript:void(0)" onclick="return false;" id="newOne" tabindex="502">+ 增加选项</a></div></td>'+
                              '</tr>'+
                              '<tr>'+
                                '<th>&nbsp;</th>'+
                                '<td><a class="SG_aBtn SG_aBtnB" href="#" onclick="return false;" id="saveBtn" tabindex="509"><cite>保存</cite></a></td>'+
                              '</tr>'+
                            '</table>'+
                          '</div>'+
                          '<div class="voteBox2">'+
                            '<table border="0" cellspacing="0" cellpadding="0">'+
                              '<tr>'+
                                '<th><span>投票方式：</span></th>'+
                                '<td><div class="voteMethod"> <span>'+
           '<input type="radio" name="rad" id="rad1" tabIndex="503" onclick="changeType(false);" checked/>'+
                                    '<label for="rad1">单选</label>'+
                                    '</span> <span>'+
           '<input type="radio" name="rad" id="rad2" tabIndex="503" onclick="changeType(true);"/>'+
                                    '<label for="rad2">多选</label>'+
           '<select id="mutiple" style="display:none;" tabIndex="504" onchange="document.getElementById(\'voteType\').value=this.value">'+
                                      '<option value=\'2\'>最多选2项</option>'+
                                      '<option value=\'3\'>最多选3项</option>'+
                                      '<option value=\'4\'>最多选4项</option>'+
                                      '<option value=\'5\'>最多选5项</option>'+
                                      '<option value=\'6\'>最多选6项</option>'+
                                      '<option value=\'7\'>最多选7项</option>'+
                                    '</select>'+
                                    '</span> </div></td>'+
                              '</tr>'+
							  '<tr>'+
									'<th><span>投票位置：</span></th>'+
									'<td><div class="voteMethod">'+
										'<span><input type="radio" tabIndex="504" id="votePos1" name="votePos" value="1"/><label for="votePos1">在博文开始</label></span>'+
										'<span><input type="radio" tabIndex="504" id="votePos2" name="votePos" checked="true" value="0"/><label for="votePos2">在博文末尾</label></span>'+
									'</div></td>'+
							  '</tr>'+
                              '<tr>'+
                                '<th><span>截止日期：</span></th>'+
                                '<td class="td1"><div class="time">'+
                                    '<select id="year" name="voteYear" tabIndex="505">'+
                                    '</select>'+
                                    '<em>年</em>'+
                                    '<select id="month" name="voteMonth" tabIndex="506">'+
                                    '</select>'+
                                    '<em>月</em>'+
                                    '<select id="day" name="voteDay" tabIndex="507">'+
                                    '</select>'+
                                    '<em>日</em>'+
                                    '<select id="hh" name="voteHour" tabIndex="508">'+
                                   ' </select>'+
                                   ' <em>时</em></div></td>'+
                              '</tr>'+
                            '</table>'+
                           '</div>'+
                        '</div>'+
                      '<div class="state2" id="saveStatus" style="display:none;">'+
                                 
  '</div>'+
                      '<div class="clearit"></div>'+
                    '' ,
       newItem : '<input type="text" tabIndex="501" class="Fm_input2" style="width:365px;" name="voteData[]"/><a href="javascript:;" onclick="return false;" class="del" id={0}><img class="SG_icon SG_icon43" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="删除" align="absmiddle" tabIndex="449" /></a>',
       saveItem : '<dl><dt><span id="vote_expired">{0}</span><a href="javascript:void(0);" onclick="return false;" id="editBtn" class="CP_a_fuc">[<cite>修改</cite>]</a></dt><dd id="voteArea"></dd></dl>'
  } 