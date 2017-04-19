    var nodes = [{
        name: "父节点1",
        children: [{
            name: "子节点1"
        }, {
            name: "子节点2"
        }]
    }, {
        name: "父节点2",
        children: [{
            name: "子节点3"
        }, {
            name: "子节点4",
            children: [{
                name: "子节点5"
            }]
        }]
    }];
    // 获取目录树容器
    var container = document.querySelector('.newWrap');
    //画目录树
    drawTree(nodes, container);
    //为目录树对应节点添加close类
    addCloseClass();
    var closeE = document.querySelectorAll('.close');
    bindToggleClickListener(closeE, "open");


/**
 * addCloseClass 文件夹元素添加close类，
 */
    function addCloseClass() {
        var trees = document.querySelectorAll('.tree');
        trees &&
            trees.forEach(function(element, index) {
                var nextSbiling = element.nextElementSibling;
                nextSbiling &&
                    nextSbiling.className.indexOf('node') >= 0 &&
                    addClass(element, 'close');
            });
    }
/**
 * bindToggleClickListener        文件夹单击切换折叠
 * @param  {object} eles          被单击元素
 * @param  {string} toggleClsName 切换添加的类名
 * @return {null}                 不返回值
 */
    function bindToggleClickListener(eles, toggleClsName) {
        eles &&
            eles.forEach(function(element, index) {
                element.addEventListener('click', function(e) {
                    toggleClass(e.target, toggleClsName);
                }, false);
            });
    }

    function hasClass(element, csName) {
        var a = element.className.match(RegExp('(\\s|^)' + csName + '(\\s|$)'));
        return　 a; //使用正则检测是否有相同的样式
    }　　　　　　　
    function addClass(element, csName) {
        if (!hasClass(element, csName)) {
            element.className += ' ' + csName;
        }
    }

    function deleteClass(element, csName) {
        if (hasClass(element, csName)) {
            element.className = element.className.replace(RegExp('(\\s|^)' + csName + '(\\s|$)'), ' '); //利用正则捕获到要删除的样式的名称，然后把他替换成一个空白字符串，就相当于删除了
        }
    }

    function toggleClass(element, csName) {
        if (hasClass(element, csName)) {
            deleteClass(element, csName);
        } else {
            addClass(element, csName);
        }
    }
/**
 * drawTree 根据nodes对象画文档树
 * @param  {object} nodes     带有节点信息的对象
 * @param  {object} container 装文档树的容器元素
 * @return {null}             不返回值
 */
    function drawTree(nodes, container) {

        var ul = document.createElement('ul');
        ul.setAttribute('class', 'node');
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i]
            var li = document.createElement('li');
            for (key in node) {
                //如果对象属性值为字符串则直接追加div元素到li里
                if (typeof node[key] === 'string') {
                    var div = document.createElement('div');
                    div.setAttribute('class', 'tree');
                    var text = document.createTextNode(node[key]);
                    div.appendChild(text);
                    li.appendChild(div);
                }
                //如果对象属性值为数组，则递归遍历
                if (node[key] instanceof Array) {
                    drawTree(node[key], li);
                }
                // console.log(typeof node[key]);
            }
            ul.appendChild(li);
        }
        container.appendChild(ul);
    }

 // drawTree函数最终画出的dom结构：

           // <div class="nodeWrap">
           //      <ul class="node">
           //          <li>
           //              <div class="tree ">
           //                  父节点1
           //              </div>
           //              <ul class="node">
           //                  <li>
           //                      <div class="tree"> 子节点1</div>
           //                      <div class="tree"> 子节点2 </div>
           //                  </li>
           //              </ul>
           //          </li>
           //          <li>
           //              <div class="tree">
           //                  父节点2
           //              </div>
           //              <ul class="node">
           //                  <li>
           //                      <div class="tree">子节点3</div>
           //                  </li>
           //                  <li>
           //                      <div class="tree">
           //                          子节点4
           //                      </div>
           //                      <ul class="node">
           //                          <li>
           //                              <div class="tree">子节点5</div>
           //                          </li>
           //                      </ul>
           //                  </li>
           //              </ul>
           //          </li>
           //      </ul>
           //  </div> 
