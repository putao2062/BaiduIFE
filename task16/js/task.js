var page = require('webpage').create();
 phantom.outputEncoding = "gbk";
 //获取页面开始加载的时间
 page.onLoadStarted = function () {
    page.startTime = new Date();
};
 var searchStr = "哈哈",
     url = "https://www.baidu.com/baidu?tn=monline_3_dg&ie=utf-8&wd=" + encodeURI(searchStr),
     result={};
     result.code=0;
     result.msg="抓取失败";
     result.time=0;
     result.word=searchStr;
     result.dataList=[];
 page.open(url, function(status) {
     if (status === "success") {
         // 异步加载
         page.includeJs("http://apps.bdimg.com/libs/jquery/1.8.3/jquery.min.js", function() {
             var data = page.evaluate(function() {
                 var data=[];
                 var results=$('.result');
                 results.each(function(e) {
                     var obj={};
                     obj.title=$(this).find('.t a').text();
                     obj.info=$(this).find('.c-abstract').text();
                     obj.link=$(this).find('.t a').attr('href');
                     obj.pic=$(this).find('.c-img').attr('src');
                     data.push(obj);
                 });
                 return data;
             });
             result.dataList=data;
             var t = Date.now()- page.startTime; //页面加载完成后的当前时间减去页面开始加载的时间，为整个页面加载时间
             console.log('firstLoadPage time :' + t + 'ms');
             result.time=t;
             result.code=1;
             result.msg="抓取成功";
             console.log(JSON.stringify(result));
             console.log("end");
             // 关闭页面  放在includJs回调函数中，避免页面提前关闭
             setTimeout(function() {
                 page.close();
                 phantom.exit();
             }, 0);
         });
     } else {
         console.log("Page failed to load.");
         console.log(JSON.stringify(result));
     }
 });
