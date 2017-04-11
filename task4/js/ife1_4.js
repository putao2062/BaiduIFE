function Observer(obj, parent) {
    this.data = obj;
    this.data.handlers = {};
    if (parent) this.data.parent = parent;
   
    this.walk(obj); 


}
let p = Observer.prototype;
p.walk = function(obj) {
    let val;
    for (let key in obj) {
        //检查对象的自有属性  ，排除parent、handlers、和objectName
        if (obj.hasOwnProperty(key) && key != 'parent' && key != 'handlers' && key != 'objectName' ) {
            val = obj[key];
            //判断val的数据类型
            if (typeof val === "object") {
                val.objectName = key; //保存属性对象的原属性名称
                new Observer(val, obj); //将其父对象传递过去并保存
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
            var self = this;
           //触发事件并向上冒泡
            var property = key,
                obj = self;
            do {
                // 检查是否有监听该属性
                if (property in obj.handlers) {
                    for (var i = 0; i < obj.handlers[property].length; i++) {
                        obj.handlers[property][i].call(obj, newVal);
                    }
                }else{
                }
                property = obj.objectName;
                obj = obj.parent;
            } while (obj);
            //触发事件并向上冒泡结束
            
            if (newVal == val) return;
            val = newVal;
            // 如果设置的属性是一个对象则递归
            if (typeof newVal === "object") {
                new Observer(newVal, self);
            }
        }
    })
};
p.$watch = function(property, handler) {
    var self = this;
    if (!(property in self.data.handlers)) {
        self.data.handlers[property] = [];
    }
    // 给该属性绑定处理函数
    self.data.handlers[property].push(handler);
    return this;
}

let app1 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});


