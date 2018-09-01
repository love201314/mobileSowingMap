var banner = document.querySelector('.banner');
var ul = banner.querySelector('ul:first-of-type');
var firstli = ul.querySelector('li:first-of-type');
var lastli = ul.querySelector('li:last-of-type');


// 动态生成圆点
var ol = document.createElement('ol');
ol.style.cssText = 'position: absolute; left: 50%; bottom: 4px; transform: translateX(-50%);';
banner.appendChild(ol);

for (var i = 0; i < ul.children.length; i++) {
    var li = document.createElement('li');
    i == 0? li.classList.add('active') : li.classList.remove('active');
    li.style.cssText = 'width: 10px; height: 10px; border: 1px solid #fff; border-radius: 50%; float: left; margin: 0 2px;'
    ol.appendChild(li);
}

// 复制第一张图片放在最后， 最后一张图片， 放在最前面
ul.appendChild(firstli.cloneNode(true));
ul.insertBefore(lastli.cloneNode(true), ul.children[0]);

var lis = ul.children;
var bannerWidth = banner.offsetWidth;
// 重新设置ul的宽度
ul.style.width = lis.length * bannerWidth + 'px';
for (var i = 0; i < lis.length; i++) {
    lis[i].style.width = bannerWidth + 'px';
}
// 向左偏移一个banner的宽度， 显示第一张图片
ul.style.left = -bannerWidth + 'px';


// 改变窗口重新调整宽高， 其实在移动端无需这样
window.onresize = function () {
    ul.style.width = lis.length * bannerWidth + 'px';
    for (var i = 0; i < lis.length; i++) {
        lis[i].style.width = bannerWidth + 'px';
    }
    ul.style.left = -bannerWidth + 'px';
}


var index = 1;
var timerId = null;

// 动画函数
function startAnimation() {
    timerId = setInterval(function () {
        index++;
        ul.style.transition = 'left 0.5s ease-in-out';
        ul.style.left = -index * bannerWidth + 'px';

    }, 2000);
}
// 开始动画
startAnimation();



function setCircle(index) {
    for (var i = 0; i < ol.children.length; i++) {
        ol.children[i].classList.remove('active');
    }
    ol.children[index - 1].classList.add('active');
}




// 函数节流
var isEnd = true;// 动画执行结束了， 默认false

// 监听动画过渡结束
ul.addEventListener('webkitTransitionEnd', function () {

    //  轮播图画到最后一张， 跳到最后一张
    if (index == lis.length - 1) {
        index = 1;
        ul.style.transition = 'none';
        ul.style.left = -index * bannerWidth + 'px';
    }

    // 手动滑动轮播图
    if (index == 0) {
        // 显示倒数第二张
        index = lis.length - 2;
        ul.style.transition = 'none';
        ul.style.left = -index * bannerWidth + 'px';
    }
    isEnd = true;

    // 动画结束了， 改变导航的状态
    setCircle(index);
})

// tap 
var startX, moveX, distanceX;
ul.addEventListener('touchstart', function (e) {
    clearInterval(timerId);
    startX = e.targetTouches[0].clientX;
})

ul.addEventListener('touchmove', function (e) {
    if (isEnd)  {
        //如果没有清除过渡， 下一次手指滑动将感觉到很费劲， 不能顺畅滑动
        this.style.transition = 'none';
        moveX = e.targetTouches[0].clientX;
        distanceX = moveX - startX;
        // 需要加上之前移动过的距离
        ul.style.left = -index * bannerWidth + distanceX + 'px';
    }
})

ul.addEventListener('touchend', function (e) {

    isEnd = false;

    // 如果移动的距离大于100px 则进入下一张
    if (Math.abs(distanceX) > 100) {
        if (distanceX > 0) {
            index--;
        } else {
            index++;
        }
        ul.style.transition = 'left 0.5s ease-in-out'
        ul.style.left = -index * bannerWidth + 'px';
    } if (Math.abs(distanceX) > 0){
        ul.style.transition = 'left 0.5s ease-in-out'
        ul.style.left = -index * bannerWidth + 'px';
    }

    startX = 0; moveX = 0; distanceX = 0;

    startAnimation();
})
