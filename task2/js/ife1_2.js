function Observer(obj) {
    this.data = obj;
    this.walk(obj); //创建新对象时就执行这个函数，用于递归
}

let p = Observer.prototype;
p.walk = function(obj) {
    let val;
    for (let key in obj) {
        //检查对象的自有属性
        if (obj.hasOwnProperty(key)) {
            val = obj[key];

            //判断val的数据类型
            if (typeof val === "object") {
                new Observer(val);
            }
            this.convert(key, val); //执行转换函数
        }
    }
};
p.convert = function(key, val) {
    //重新设置对象属性的属性  利用Object.defineProperty(obj, prop, descriptor)方法，
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            console.log('你访问了' + key);
            return val;
        },
        set: function(newVal) {
            console.log('你设置了' + key);
            console.log('新的' + key + '=' + newVal);
            if (newVal == val) return;
            val = newVal;
        }
    })

}

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

let app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

