  var player = {
      listContainer:$(".list")[0],
      path: 'res/music/',
      data: null,
      audio: $('#audio')[0],//获取audio需要[0]||.get(0)，因为js操作获得的是audio对象，jQuery选择器获得的是jQuery对象，[0]对象的才是对应的节点对象，所以不能直接使用jQuery对象去操作。
      currentIndex: -1,
      init: function() {
          // 数据一般来自服务器端,通过ajax 加载数据,这里是模拟
          player.data = [{
              name: "名族配乐",
              pic: "images/timg.jpg",
              res: "2097.mp3"
          }, {
              name: "舒缓音乐",
              pic: "images/timg2.jpg",
              res: "3596.mp3"
          }, {
              name: "爸爸去哪儿",
              pic: "images/timg3.jpg",
              res: "8563.mp3"
          }];
      }
  }
  player.init();
  drawTree(player.data, player.listContainer);
  activePlayBtn();
  activeLoopBtn();
  activeVolumeBtn();
  activeSpeedBtn();
  autoPlay();
  showDurartion();
  showProgress();

/**
 * activePlayBtn 播放暂停按钮
 * @return {null} 返回空
 */
  function activePlayBtn() {
     var play = false;
      $('.play').click(
          function() {
              if (!play) {
                  player.audio.play();
                  play = true;
                  $(this).text('暂停');
              } else {
                  player.audio.pause();
                  play = false;
                  $(this).text('播放');
              }

          }
      );
  }
/**
 * loopFun循环播放
 * @return {null} 返回空
 */
  function loopFun() {
      player.audio.load();
      player.audio.play();
  }
/**
 * orderFun顺序播放
 * @return {null} 返回空
 */
  function orderFun() {
      player.audio.removeEventListener("ended", loopFun, false);
      player.audio.addEventListener("ended", next, false);
  }
/**
 * autoPlay 自动播放
 * @return {null} 返回空
 */
  function autoPlay() {
      next();
      $('.play').click();
      orderFun();
  }
/**
 * lightCurLi 高亮当前列表项
 * @param  {index} index 列表索引值
 * @return {null}       返回空
 */
  function lightCurLi(index) {
      var lis = $('.list').find('li');
      lis.eq(index).addClass('cur').siblings().removeClass('cur');
  }
/**
 * addlistClickListener 给播放列表绑定单击事件
 * @return {null}     返回空
 */
  function addlistClickListener() {
      var lis = $('.list').find('li');
      lis.click(function() {
          next($(this).index());
          console.log($(this).index());
      });
  }
/**
 * next 播放下一首
 * @param  {Number}   index 播放索引值
 * @return {null}     返回空
 */
  function next(index) {
      if (player.currentIndex == -1) {
          player.currentIndex = 0;
      } else if (player.currentIndex == (player.data.length - 1)) {
          player.currentIndex = 0;
      } else {
          player.currentIndex++;
      }
      if (typeof index === "number") {
          player.currentIndex = index;
      }
      console.log(typeof index);
      lightCurLi(player.currentIndex);
      player.audio.src = player.path + player.data[player.currentIndex].res;
      player.audio.play();
      $('.name').text(player.data[player.currentIndex].name);
      $('#pic').attr('src', player.data[player.currentIndex].pic);
      $('#pic').attr('alt', player.data[player.currentIndex].name);

  }
  // 单曲循环  

  function activeLoopBtn() {
      var loop = false;
      var patternEle = $('.pattern').eq(0);
      $('.loop').click(function() {
          if (!loop) {
              player.audio.addEventListener("ended", loopFun, false);
              player.audio.removeEventListener("ended", next, false);
              $(this).text('顺序播放');
              patternEle.text("单曲循环");
              loop = true;
          } else {
              orderFun();
              $(this).text('单曲循环');
              patternEle.text("顺序播放");
              loop = false;
          }

      });
  }

  /**
   * volume 调节音量
   * @return {null} 返回空
   */
  function activeVolumeBtn() {

      $('input[type="range"]').change(function() {
          var val = $(this).val();
          player.audio.volume = val / 100;
      });

  }
  //快进
  /**
   * speed 快进
   * @return {null} 返回空
   */
  function activeSpeedBtn() {
      $('.speed').click(function() {
          player.audio.currentTime += 5;
          console.log(player.audio.currentTime);
      })
  }

  /**
   * showDurartion 显示播放时长
   * @return {null} 返回空
   */
  function showDurartion() {
      player.audio.addEventListener("durationchange", function() {
          var time = formatTime(player.audio.duration);
          $('.time').html(time);
          console.log(time);
      }, false);
  }
  /**
   * showProgress 显示播放进度
   * @return {null} 返回空
   */
  function showProgress() {
      // 显示进度
      var progress = $('.progress');
      player.audio.addEventListener("timeupdate", function() {
          progress.css('width', player.audio.currentTime / player.audio.duration * 100 + "%");
      }, false)
  }


  /*
   * 将秒数格式化时间
   * @param {Number} seconds: 整数类型的秒数
   * @return {String} time: 格式化之后的时间
   */
  function formatTime(seconds) {
      seconds = Math.ceil(seconds);
      var min = Math.floor(seconds / 60),
          second = seconds % 60,
          hour, newMin, time;
      if (min > 60) {
          hour = Math.floor(min / 60);
          newMin = min % 60;
      }
      if (second < 10) {
          second = '0' + second;
      }
      if (min < 10) {
          min = '0' + min;
      }
      return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
  }
  /**
   * drawList 动态生成播放列表
   * @return {null} 返回空
   */
  function drawTree(nodes, container) {

      var ul = document.createElement('ul');
      for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i]
          var li = document.createElement('li');

          var text = document.createTextNode(node.name);
          li.appendChild(text);
          ul.appendChild(li);
      }
      container.appendChild(ul);

      addlistClickListener();
  }
