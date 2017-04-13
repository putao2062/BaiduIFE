    var ele = document.getElementById('contentMenu');
    var eleT = document.getElementById('contentMenuTarget')
    var mousePoint; //保存单击右键时的鼠标位置
    var menuSize = {}; //保存菜单元素实际大小信息；
    var clientSize = {}; //保存网页可见大小信息；
    menuSize.width = eleT.clientWidth + 2;
    menuSize.height = eleT.clientHeight + 2;
    clientSize.width = window.innerWidth;
    clientSize.height = window.innerHeight;
    
    // 给菜单绑定右击事件
    ele.addEventListener('contextmenu', function(e) {
        mousePoint = mousePosition(e);
        cancelBrowserContextMenu(e);
        showMenu();
        console.log(`鼠标位置x:${mousePoint.x},y:${mousePoint.y}`);
    }, false);
    //阻止菜单单击事件冒泡到文档。则单击菜单不会触发隐藏菜单操作
    eleT.addEventListener('click', function(e) {
        e.stopPropagation();
    }, false);

    // 给子菜单绑定单击事件
    var lis = eleT.getElementsByTagName('li');
    for (var i = lis.length - 1; i >= 0; i--) {
    	let val= lis[i].textContent;
        lis[i].addEventListener('click', function() {
        	alert(val);
        }, false);
    }

    function countPosition() {
        var x = mousePoint.x,
            y = mousePoint.y;
        // 右侧放不下
        if (mousePoint.x + menuSize.width > clientSize.width) {
            x = mousePoint.x - menuSize.width;
        }
        //下方放不下
        if (mousePoint.y + menuSize.height > clientSize.height) {
            y = mousePoint.y - menuSize.height;
        }
        return {
            x: x,
            y: y
        };
    }

    function showMenu() {
        eleT.style.visibility = 'visible';
        var position = countPosition();
        eleT.style.left = position.x + "px";
        eleT.style.top = position.y + "px";
        document.addEventListener('click', hiddenMenu, false);
    }

    function hiddenMenu() {
        eleT.style.visibility = 'hidden';
        document.removeEventListener('click', hiddenMenu, false);
    }

    function cancelBrowserContextMenu(e) {
        if (e && e.preventDefault) {
            //标准浏览器
            e.preventDefault();
        } else {
            //兼容ie
            window.event.returnValue = false;
        }
    }

    function mousePosition(ev) {
        //标准浏览器
        if (ev.pageX || ev.pageY) {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        }
        //兼容ie
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        };
    }