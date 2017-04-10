 function DrawLine(startPoint, width, heigth, ctx) {

     this.startPoint = startPoint;
     this.width = width;
     this.height = heigth;
     this.endPoint = [
         this.startPoint[0] + this.width,
         this.startPoint[1] + this.height
     ];
     this.ctx = ctx;
     this.len = 0;
     //利用递归函数、延迟定时器实现
     this.draw = function hehe(that) {

         var length = that.width / 2;

         if (that.len > length) {

             window.clearTimeout(TIMTID);
             return false;
         }
         that.ctx.moveTo(that.startPoint[0] + length - that.len, that.startPoint[1]);
         that.ctx.lineTo(that.startPoint[0] + length + that.len, that.startPoint[1]);
         that.ctx.stroke();
         TIMTID = setTimeout(function() {
             hehe(that);
         }, 5);
         that.len++;
     };
     // 对象私有函数
     function draw2(that) {
         var length = that.width / 2;

         if (that.len > length) {
             window.clearInterval(drawID);
             return false;
         }
         that.ctx.moveTo(that.startPoint[0] + length - that.len, that.startPoint[1]);
         that.ctx.lineTo(that.startPoint[0] + length + that.len, that.startPoint[1]);
         that.ctx.stroke();
         that.len++;
     };
     //对象私有变量
     var drawID = 0;
     //利用间隔定时器实现
     this.activeDraw2 = function() {
         var that = this;
         if (clearID) clearInterval(clearID);
         drawID = setInterval(draw2, 5, that);
     };
     var clearID = 0;

     function clear(that) {

         var length = that.width / 2;
         if (that.len >= 0) {
             that.ctx.clearRect(that.startPoint[0], that.startPoint[1], that.startPoint[0] + length - that.len, that.ctx.lineWidth);
             that.ctx.clearRect(that.endPoint[0] - length + that.len, that.startPoint[1], length - that.len, that.ctx.lineWidth);
             that.len--;
         } else {
             clearInterval(clearID);
         }
     }
     this.activeClear = function() {
         var that = this;
         that.len;
         if (drawID) clearInterval(drawID);
         clearID = setInterval(clear, 5, that);
     };

 }
 var cas = document.getElementById("streamline");
 var ctx = cas.getContext("2d");
 ctx.lineWidth = 8;
 ctx.strokeStyle = "#f9f2ed";
 var draw1 = new DrawLine([0, 0], 276, 0, ctx);

 cas.addEventListener("mouseover", function() {
     draw1.activeDraw2();
 }, false);
 cas.addEventListener("mouseout", function() {
     draw1.activeClear();
 }, false);


 