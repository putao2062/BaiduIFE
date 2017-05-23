function MarkDownParser() {
	 checkInstance(this, MarkDownParser);
    this.init();
}
var parserP = MarkDownParser.prototype;
parserP.init = function(){
    // 正则模式
    this.markPattern = {
        //分隔符号
        separator: {
            regex: /^[\-=\*]{3,}/,
            template: '<hr>',
            singleLine: true, //独占一行
            lineStart: true,
        },
        //强调 
        emphasis: {
            regex: /[\*_]([^\*_]+?)[\*_](?!\*)/,
            template: '<em>$1</em>', //$1 子集中匹配的内容
            singleLine: false
        },
        //粗体
        strongEm: {
            regex: /[\*_]{2}(.*?)[\*_]{2}/,
            template: '<strong>$1</strong>',
            singleLine: false
        },
        //删除线
        strikeThrough: {
            regex: /~{2}(.*?)~{2}/,
            template: '<del>$1</del>',
            singleLine: false
        },
        //无序列表
        ul: {
            regex: /^[\*\-\+]\s([^\n]+)/,
            template: '<ul>$1</ul>',
            singleLine: false,
            lineStart: true
        },
        //有序列表
        ol: {
            regex: /^\d+\.\s([^\n]+)/,
            template: '<ol>$1</ol>',
            singleLine: false,
            lineStart: true
        },
        //链接
        link: {
            regex: /(?:[^!]|^)\[([^\]]+?)\]\(([^\)]+?)\)/,
            template: '<a href="$2">$1</a>',
            singleLine: false
        },
        //图片
        img: {
            regex: /!\[([^\]]*?)\]\(([^\)]+?)\)/,
            template: '<img alt="$1" src="$2">',
            singleLine: false
        },
        //块引用
        blockquote: {
            regex: /^\>\s([^\n]+)/,
            template: '<blockquote>$1</blockquote>',
            singleLine: false,
            lineStart: true
        },
        //代码
        code: {
            regex: /`([^`\n]+)`/,
            template: '<code>$1</code>',
            singleLine: false
        },
        // 代码预览
        pre: {
            regex: /```(\w+)([^`]+?)```/,
            template: '<pre class="$1">$2</pre>',
            singleLine: false
        }
    }

    // 标题1-6
    for (let i = 1; i <= 6; i++) {
        const reg = '^\s*?' + '#'.repeat(i) + '\\s([^\\n]+)\s*#*\s*(?:\n+|$)';
        this.markPattern['h' + i] = {
            regex: new RegExp(reg),
            template: `<h${i}>$1</h${i}>`,
            singleLine: false,
            lineStart: true
        };
    }
};
parserP.parse = function(text) {
    var _this=this;
    var lines = text.split(/\n{2,}/); //按两个换行符进行分割，便于解析列表块

    var linesParsed=lines.map(function(line){
           return _this.parseLine(line);
    });
    return linesParsed.join('\n');
};
parserP.parseLine = function(line) {
	var _this=this;
    var isBlockEle = false;
    var isQuoteEle = false;
    for (var key in this.markPattern) {
        var pattern = this.markPattern[key];
        // 如果该行没有匹配项则跳出当前循环进入下一循环
        if (!pattern.regex.test(line)) {
            continue;
        }
        // 解析hr
        if (pattern.singleLine) {
            line = line.replace(pattern.regex, pattern.template);
            return line;
        }
        //如果是块元素则另起一行 
        if (pattern.lineStart) {
            //解析blockquote 、ol、ul
            if (['blockquote', 'ol', 'ul'].indexOf(key) >= 0) {
                var list = [];
                var lines = line.split('\n');
                lines.forEach(function(x) {
                    if (key ==='blockquote') {
                        x = x.replace(/>\s/, '');
                        //递归解析
                        list.push(_this.parseLine(x));
                    } else {
                        x = x.replace(/[\*\-\+]\s|\d+\.\s/, '');
                        list.push(`<li>${x}</li>`);
                    }
                  
                  
                });
                  // 将模板中的$1替换成被解析后的文本
                    line = pattern.template.replace('$1', list.join(''));
              
            } else {
                //解析h1-h6
                var filtered = pattern.template.replace('{data}', RegExp.$1);

                line = line.replace(new RegExp(pattern.regex), pattern.template);
                isBlockEle = true;
                continue;
            }
        } else {
            //解析行内元素
            line = line.replace(new RegExp(pattern.regex, 'g'), pattern.template);
        }
    }
    // 循环完毕 如果是纯文本则将line包在p标签中
    if (!isBlockEle) {
        return `<p>${line}</p>`;
    } else {
        // 如果有块元素 则直接返回
        return line;
    }
};

var parser=new MarkDownParser();
var defaultVal = '# h1\n\n\n## h2\n\n### h3\n\n#### h4\n\n##### h5\n\n###### h6\n\n---\n\n代码: `code`, em: *em*, 加粗: **strong**, 删除线: ~~through~~\n\n---\n\n[百度链接](https://www.baidu.com)\n\n![图片链接](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495515107952&di=ff8a55b4560eea5b6ca8333b59b80ce8&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2015%2Fgha%2F09%2F1002%2F09.jpg)\n\n> 仿代码的成果 \n> 有学到些东西!\n\n---\n\npre:\n\n```javascript\nalert(1)\n```\n\n---\n\n- 无序列表 list1\n- list1\n- list1\n- list1\n\n1. ordered list\n2. ordered list\n3. ordered list\n4. ordered list\n\n';

function MarkDown(obj) {
    var _this = this;
    if (!obj.editor || !obj.output) throw new Error('实例化Markdown，传入的参数不正确');
    checkInstance(this, MarkDown);
    this.editor = getEle(obj.editor);
    this.output = getEle(obj.output);
    this.init();
}

var p = MarkDown.prototype;

function getEle(arg) {
    return typeof arg == "string" ? document.querySelector(arg) : arg;
}

function checkInstance(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('不能将构造函数当普通函数调用');
    }
}
/**
 * 美化行,为了使编辑区的文本好看......可编辑区域p标签后按回车会自动生成p元素
 * @param  {string} line)( 一串字符串
 * @return {string}        按行包裹了p标签的字符串
 */
function wrapPTag(lines) {
    var newArr = lines.split('\n').map(function(line) {
        return '<p>' + line + '</p>'
    })
    return newArr.join('');
}
/**
 * MarkDown 初始化函数，给编辑器赋初始值
 * @return {[type]} [description]
 */
p.init = function() {
    var _this = this;
    this.editor.innerHTML = wrapPTag(defaultVal);
    this.mutation = new MutationObserver(function(mutations) {
        //获取该节点内的文本内容，返会nums,text,html
        var newContent = _this.getContent();
        _this.update(newContent);
    });

    //节点变化,观察,文本
    this.mutation.observe(this.editor, {
        childList: true, //观察子节点的变动
        characterData: true, //节点内容或节点文本的变动
        subtree: true //所有后代节点的变动。
    });
    this.output.innerHTML=this.parser.parse(defaultVal);
    // this.output.innerHTML=this.parser.parse(this.getContent().text);
}

p.update = function(newVal) {
    // this.output.innerHTML = wrapPTag(newVal.text);
    this.output.innerHTML = this.parser.parse(newVal.text);
}
p.getContent = function() {
    //Array.from:将类数组对象或可枚举对象转变为array
    var lines = Array.from(this.editor.querySelectorAll('p'));
    //将美化过的行还原成带换行符的文本字符串;
    var text = lines.reduce(function(str, line) {
        return str + line.innerText + '\n';
    }, '');
    return {
        nums: lines.length,
        text: text,
        html: this.editor.innerHTML
    };
};

p.parser=parser;


