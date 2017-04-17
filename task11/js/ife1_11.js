    var editEle = document.getElementById('edit');
    var showEle = document.getElementById('show');

    function save() {
        showEle.innerHTML = compile(editEle.textContent);
    }

    function compile(str) {
        str=compileTitle(str);
        str=compileUl(str);
        str=compileOl(str);
        return str;
    }

    function compileTitle(str) {
        var titleReg = /\#{1,6}\w+\s+/g;
        var res = str.match(titleReg);
        var titleReg1 = /\#/g;
        var titleReg2 = /\#+(\w+)/;
        res && res.forEach(
            function(element) {
                var num = element.match(titleReg1).length;
                var val = element.match(titleReg2)[1];
                var newStr = "<h" + num + ">" + val + '</h' + num + ">";
                str = str.replace(element, newStr);
            }
        );
        return str;
    }
    function compileUl(str){

    	var ulReg=/\-\s+\w+\s+/g;
    	var res=str.match(ulReg);
    	var ulreg1=/\-\s+(\w+)/;
    	res&&res.forEach(function(element){
            var val=element.match(ulreg1)[1];
            var newStr="<li>" + val + "</li>";
             str = str.replace(element, newStr);
    	});
    	return str;
    }

    function compileOl(str){
    	var olReg=/([0-9]+\.)+\D+\s/g;
    	var res=str.match(olReg);
    	var olReg1=/[0-9]+\.\s+(.+)/;
    	res&&res.forEach(function(element){
            var val=element.match(olReg1)[1];
            var newStr="<li>" + val + "</li>";
             str = str.replace(element, newStr);
    	});

    	return str;
    }
    editEle.addEventListener('keyup', save, false);