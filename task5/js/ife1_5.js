function Vue(obj) {
    this.data = obj.data;
    this.ele = document.querySelector(obj.el);
    this.traversal(this.ele);
}
Vue.prototype.traversal = function(node) {
    //对node的处理  ,元素节点
    var i = 0,
        childNodes = node.childNodes,
        item;
    for (; i < childNodes.length; i++) {
        item = childNodes[i];
        //元素节点
        if (item.nodeType === 1) {
            //递归先序遍历子节点
            this.traversal(item);
            //文本节点
        } else if (item.nodeType === 3) {
            var cntText = item.textContent;
            var arryStr = item.textContent.match(/\{\{[^{]+\}\}/g);
            if (arryStr) {
                //遍历该节点内匹配的{{...}}字符串数组集合
                var j = 0;
                for (; j < arryStr.length; j++) {
                    var msg = arryStr[j];
                    var val = this.data;
                    
                    //获取绑定的具体对象值
                    var str = msg.match(/\{\{(.*)\}\}/)[1];
                    var propertyNames = str.split(".");
                    var h = 0;
                    for (; h < propertyNames.length; h++) {
                        val = val[propertyNames[h]];
                    }

                    //替换匹配的绑定值，保存替换后的结果
                    var cntText = cntText.replace(msg, val);
                }
                //为该节点的文本内容重新赋值
                item.textContent = cntText;
            }
        }
    }
};


let app = new Vue({
    el: '#app',
    data: {
        user: {
            name: 'youngwind',
            age: 25
        }
    }
});
