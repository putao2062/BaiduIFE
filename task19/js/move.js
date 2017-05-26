/**
 * 动画 构造函数
 * @param {object or string} obj 元素对象或元素选择器字符串
 */
function Animate(obj) {
    this.ele = typeof obj === 'string' ? document.querySelector(obj) : obj;
    this.queue = [];
}
/**
 * 动画 添加
 * @param {object} props   元素属性键值对象
 * @param {object} options 动画选项对象
 */
Animate.prototype.add = function(props, options) {
    var defau = {
        duration: 1000,
        delay: 500,
        easing: 'linear',
        loop: 1
    };
    options=Tools.extend(defau, options);
    this.queue.push({
        props: props,
        options: options
    });
    this.animating({
        props: props,
        options: options
    });
    // body...
};

/**
 * 把props属性对象按键值对转换成数组方便调用
 * @param  {object} obj 属性键值对象
 * @return {array}     属性键值数组
 */
function convertOTA(obj){
    var arr=[];
    for(var key in obj){
        arr.push([key,obj[key]]);
    }
    return arr;
}
/**
 * [animating description]
 * @param  {object} args 动画队列项
 * @return {void}      返回null
 */
Animate.prototype.animating = function(args) {
    var _this=this;
    //将属性键值对象转换成数组对象
    var propArr=convertOTA(args.props);
    var  oStyle = this.ele.currentStyle? this.ele.currentStyle : window.getComputedStyle(this.ele, null);
    var t = 0,
        b = [],  //保存各属性的初始值
        c = [],  //保存各属性的差值
        d = args.options.duration;
    
   
    // for (var key in args.props) {
    //     b=parseInt(oStyle[key].replace('px', ''));
    //     c = parseInt(args.props[key].replace('px', '')) - b;
    // }
    // 
    propArr.forEach(function(x){
    var base=parseInt(oStyle[x[0]].replace('px', ''));
       b.push(base);
       c.push(parseInt(x[1].replace('px', ''))-base);
    });
    var step = function() {

        var value=[]; //保存各属性的当前值
        // var value = Tween.linear(t, b, c, d);
        for (var i=0;i<b.length;i++) {
            value.push(Tween.linear(t,b[i],c[i],d));
        }
        // _this.ele.style[key] = value+"px";
        for(var j=0;j<propArr.length;j++){

        _this.ele.style[propArr[j][0]] = value[j]+"px";
        }

        t++;
        if (t <= d) {
            // 继续运动
            requestAnimationFrame(step);
        } else {
            // 动画结束
        }

    };
    step();
};
/**
 * 动画 弹出信息
 * @param  {string} str 信息字符串
 * @return {void}     返回null
 */
Animate.prototype.msg = function(str) {
    alert(str);
};
/**
 * 工具模块
 * @param  {object} mod) {               mod.extend 用新属性值覆盖旧属性值
 * @return {object}      返回工具模块
 */
var Tools = (function(mod) {
    mod.extend = function(a, b) {
        for (var key in b) {
            // 过滤a中没有的属性
            if (a.hasOwnProperty(key)) {
                a[key] = b[key];
            } else {
                continue;
            }
        }
        return a;
    };
    return mod;
})(window.Tools || {});
/**
 * 补间动画缓动函数模块
 * @param  {object} mod) {               mod.Linear 线性函数
 * @return {object}      返回函数模块
 */
var Tween = (function(mod) {
    mod.linear = function(t, b, c, d) {
        return c * t / d + b;
    }
    return mod;
})(window.Tween || {});
/**
 * 模仿jquery的选择器函数
 * @param  {DOMstring} selector 选择器字符串
 * @return {element}          dom元素
 */
function $(selector) {
    var ele = document.querySelector(selector);
    if (Animate) {
        ele.animate = new Animate(ele);
    }
    return ele;
}
/**
 * 监听窗口对象文档加载完毕事件
 */
window.addEventListener("load", test, false);
/**
 * 测试函数
 * @return {void} 返回null
 */
function test() {
    var ele = $('.m1 .item');
    ele.animate.msg('hahah');
    ele.animate.add({
        width: '500px',
        height:'300px'
    }, {
        duration: 500,
        loop: 2
    });
    var temp = ele.animate.queue[0];
}
