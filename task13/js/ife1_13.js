/**
 * carousel 3d 旋转木马
 * @type {Object}
 */
    var carousel = {
        containerEle: undefined, //容器元素
        count: 0,                //子元素数量
        setp: 0,                 //旋转一次的步长
        oldIndex: 0,             //上一次点击元素的索引值
        oldRotVal:0,             //上一次的旋转值
        rot: function(index) {
        	console.log(`上一个索引值${carousel.oldIndex}`);
        	console.log(`当前索引值${index}`);
        	console.log(`上一个旋转值${carousel.oldRotVal}`);
            // intervalVal下一次旋转前的旋转增量
            var intervalVal=this.step *(carousel.oldIndex-index);
            //到达首尾衔接点 ，被点击的为首，当前元素为尾
        	if(index==0&&carousel.oldIndex==(carousel.count-1)){
                intervalVal=this.step*(-1);
            
            //到达首尾衔接点 被点击的为尾，当前元素为首
        	}else if (index==(carousel.count-1)&&carousel.oldIndex==0) {
        		intervalVal=this.step*1;
        	}
        	var rotVal= intervalVal + carousel.oldRotVal;
        	//rotval负值左滚，正值右滚
        	console.log(`当前旋转值${rotVal}`);
        	console.log(`旋转差值${rotVal-carousel.oldRotVal}`);
            carousel.containerEle.style.transform = 'rotateY(' +rotVal+ 'deg)';
            carousel.oldRotVal=rotVal;
            console.log(`当前tranform值${carousel.containerEle.style.transform}`);

        }
    };
    //旋转子元素集合
    var items = document.querySelectorAll('.sliderWrap li');
    
    carousel.containerEle = document.querySelector('.sliderWrap ul');
    // var st = window.getComputedStyle(containerEle, null);
    // var tr = st.getPropertyValue("transform") ||"FAIL";

    carousel.count = items.length;
    carousel.step = 360 / carousel.count;


    items.forEach(function(element, index) {
    	// 将元素在集合中的索引值保存在元素中
        element.index = index;
        element.addEventListener('click', function() {
            var index=this.index;
            carousel.rot(index);
            // 保存上一个元素的索引
            carousel.oldIndex=index;
        }, false);
    });