

    function validPhone() {
        phoneInfo = document.getElementById("phone").value
        if(!phoneInfo) return false;
        var number = parseInt(phoneInfo);
        msg.textContent = phoneReg.test(number);
    }
    function validStr() {
        strInfo = document.getElementById('str').value;
         if(!strInfo) return false;
        var words = strInfo.match(wordReg);
        var result;
        for (var i = 0; i <words.length; i++) {
            var element = words[i];
            // 先判断是否有相同字符串
            var pattern0 = new RegExp('(' + element + ')', "g");
            var wordL = strInfo.match(pattern0).length;
            //有相同字符再判断是否相邻
            if (wordL >= 2) {
                var pattern = new RegExp('(' + element + ')\\s+' + '\\1', "g");
                var a = strInfo.match(pattern)&&strInfo.match(pattern).length||0;
                // 有相邻字符串则循环终止
                if (a >= 1) {
                    result = 'true';
                    break;
                } else {
                    result = 'false  有重复单词但是不相邻';
                }
            } else {
                result = 'false '
            }
        }
        msg2.textContent = result;
    }

    var phoneReg = /^1[3|4|5|8]\d{9}$/; //粗略匹配
    var phoneInfo = '';
    var msg = document.getElementById('phoneRes');
    var wordReg = /(\b\w+\b)/g;
    var strInfo = '';
    var msg2 = document.getElementById('strRes');


    document.getElementById('phoneTest').addEventListener('click', validPhone, false);
    document.getElementById('strTest').addEventListener('click', validStr, false);