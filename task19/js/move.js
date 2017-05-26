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
 * [animating description]
 * @param  {object} args 动画队列项
 * @return {void}      返回null
 */
Animate.prototype.animating = function(args) {
	var _this=this;
    var t = 0,
        b = 0,
        c = 100,
        d = args.options.duration;
    for (var key in args.props) {
        var  oStyle = this.ele.currentStyle? this.ele.currentStyle : window.getComputedStyle(this.ele, null);
        // b=oStyle.getPropertyValue(key);
        b=parseInt(oStyle[key].replace('px', ''));
        c = parseInt(args.props[key].replace('px', '')) - b;
    }
    var step = function() {
        // value就是当前的位置值
        // 例如我们可以设置DOM.style.left = value + 'px'实现定位
        var value = Tween.linear(t, b, c, d);
        _this.ele.style[key] = value+'px';
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
        width: '500px'
    }, {
        duration: 500,
        loop: 2
    });
    var temp = ele.animate.queue[0];
}
