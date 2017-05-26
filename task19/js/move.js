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
    options = Tools.extend(defau, options);
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
    var _this = this;
    //将属性键值对象转换成数组对象
    var propArr = Tools.convertOTA(args.props);
    var oStyle = this.ele.currentStyle ? this.ele.currentStyle : window.getComputedStyle(this.ele, null);
    var t = 0,
        b = [], //保存各属性的初始值
        c = [], //保存各属性的差值
        d = Math.abs(args.options.duration / 17);

    var easing = undefined;
     var counter = 1;// 动画计数器
    if (typeof args.options.easing == "string") {
        easing = Tween[args.options.easing] != undefined ? Tween[args.options.easing] : Tween['ease'];
    } else if (typeof args.options.easing == "function") {
        easing = args.options.easing;
    } else {
        easing = Tween['ease'];
    }
    // for (var key in args.props) {
    //     b=parseInt(oStyle[key].replace('px', ''));
    //     c = parseInt(args.props[key].replace('px', '')) - b;
    // }
    // 
    propArr.forEach(function(x) {
        var propValue= oStyle[x[0]];
        var base = typeof propValue == 'string' ? parseInt(propValue.match(/\d*/)[0]) : propValue;
        b.push(base);
        c.push(x[1] - base);
    });
    var step = function() {

        var value = []; //保存各属性的当前值
        // var value = Tween.linear(t, b, c, d);
        for (var i = 0; i < b.length; i++) {
            value.push(easing(t, b[i], c[i], d));
        }
        // _this.ele.style[key] = value+"px";
        for (var j = 0; j < propArr.length; j++) {

            _this.ele.style[propArr[j][0]] = value[j] + propArr[j][2];
        }

        t++;
        if (t <= d) {
            // 继续运动
            requestAnimationFrame(step);
        } else {
            counter++;
            if (args.options.loop == "infinity" || (args.options.loop != 1 && args.options.loop*2 > counter)) {
                // // 还原到初始状态
                // for (var k = 0; k < propArr.length; k++) {
                //     _this.ele.style[propArr[k][0]] = b[k] + propArr[k][2];
                // }
                // t=0;
                // step();
                // 还原到初始状态
                 
                 //交替动画
                    t=0;
                    b=value;
                    c=c.map(function(x){
                         return -x;
                    });
                step();
            }
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
    mod.extend = function(objA, objB) {
        for (var key in objB) {
            // 过滤a中没有的属性
            if (objA.hasOwnProperty(key)) {
                objA[key] = objB[key];
            } else {
                continue;
            }
        }
        return objA;
    };
    /**
     * 把props属性对象按键值对转换成数组方便调用
     * @param  {object} obj 属性键值对象
     * @return {array}     属性键值数组
     */
    mod.convertOTA = function(propsObj) {
        var arr = [];
        for (var key in propsObj) {
            var unit = typeof propsObj[key] == "string" ? propsObj[key].trim().replace(/\d/g, '') : 0; //保存属性值的单位
            var value = unit == 0 ? propsObj[key] : parseInt(propsObj[key].replace(unit, ''));
            arr.push([key, value, unit]);
        }
        return arr;
    }
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
    };
    mod.ease = function(t, b, c, d) { //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    };
    mod.easeIn = function(t, b, c, d) { //加速曲线
        return c * (t /= d) * t + b;
    };
    mod.easeOut = function(t, b, c, d) { //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    };
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
    // ele.animate.msg('hahah');
    ele.animate.add({
        width: '500px',
        height: '300px',
        opacity: 1,
        left: '200px'
    }, {
        duration: 1000,
        loop: 2,
        easing: 'easeOut'
    });
    var temp = ele.animate.queue[0];
}
