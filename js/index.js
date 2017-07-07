function getStyle(obj,attr){
    var val = obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
    return parseInt(val);
}
// 水平拖动组件.  监听对象,移动对象
function dragComponent(addEvent,target){

        // 开始的偏移
    var startX = 0,
        // 保存的偏移
        translateX = 0,
        // 手指坐标
        startFinger = 0,
        maxWidth = target.offsetWidth - addEvent.offsetWidth,
        lastTime = 0; //按下的时间
    cssTransform(target,'translateX',0);
    cssTransform(target,'translateZ',0);
    cssTransform(target,'translateY',0);
    console.log(maxWidth);
    addEvent.addEventListener('touchstart',function (e) {
        e.stopPropagation();
        startFinger = e.changedTouches[0].clientX;
        target.style.WebkitTransition = target.style.transition = '';
        startX = cssTransform(target,'translateX');
        lastTime = Date.now();
        console.log(lastTime);
    });
    addEvent.addEventListener('touchmove',function (e) {
        e.stopPropagation();
        var nowFinger = e.changedTouches[0].clientX,
            distance = nowFinger - startFinger;
        var translateX = distance + startX;
        // 弹性
        if(translateX > 0 ){ //拖动系数. 拉力的感觉
            translateX *= 0.3;
        }else if( translateX < -maxWidth){  //最后.
            translateX = distance*0.3 + startX;
        }
        cssTransform(target,'translateX',translateX);
    })
    addEvent.addEventListener('touchend',function (e) {
         /*
            惯性原理:
            产生的速度 = 移动距离 / 移动时间
            距离 = 松开的坐标 - 上次的坐标  (距离差)
            时间 = 松开的时间 - 按下的时间  (时间差)
         */
        var nowFinger = e.changedTouches[0].clientX,
            distance = nowFinger - startFinger,  //距离差
            timeDis = Date.now() - lastTime,  //时间差
            speed = (distance / timeDis)*100;
        console.log(speed);  //很小 *倍数
        // 惯性
        var translateX = cssTransform(target,'translateX');
        translateX += speed;

        // 边界 ,弹回去
        if(translateX > 0){
            translateX = 0;
        }else if(translateX < -maxWidth){
            translateX = -maxWidth;
        }
        // 添加贝塞尔曲线
        target.style.WebkitTransition = target.style.transition = 'transform 400ms cubic-bezier(0.1, 0.57, 0.1, 1)';
        cssTransform(target,'translateX',translateX);
    });
}

// header h-nav监听 nav拖动
(function(){
    var slide = document.querySelector('.header .h-nav'),
        nav = document.querySelector('.header .nav');
    // 水平拖动组件
    dragComponent(slide,nav);
})();

// banner轮播
(function () {
    var slide = document.querySelector('.banner'),
        oUl = document.querySelector('.banner ul'),
        tab = document.querySelectorAll('.dot span'),
        startFinger = 0,
        startX = 0,
        width = slide.offsetWidth,
        num = 0,
        timer = null,
        onoff = true,
        first = true;
    // 初始
    cssTransform(oUl,'translateX',0);
    cssTransform(oUl,'translateZ',0);
    oUl.innerHTML += oUl.innerHTML;
    var length = oUl.children.length;
    oUl.style.width = length+'00%';
    tab[0].className = 'on';
    // 绑定
    slide.addEventListener('touchstart',function (e) {
        clearInterval(timer);
        startFinger = e.changedTouches[0];
        oUl.style.WebkitTransition = oUl.style.transition = "";
        // 判断 第一张时, 最后一张时
        if(num === 0){
            cssTransform(oUl,'translateX',-tab.length*width);
        }else if( num === length-1){
            cssTransform(oUl,'translateX',-(tab.length-1)*width);
        }
        startX = cssTransform(oUl,'translateX');
        onoff = true;
        first = true;
    });
    slide.addEventListener('touchmove',function (e) {
        e.stopPropagation();
        if(!onoff){
            return;
        }
        var nowFinger = e.changedTouches[0],
            disY = nowFinger.pageY - startFinger.pageY,
            disX = nowFinger.pageX - startFinger.pageX;
        console.log(disX,disY);
        // 第一次移动 看是水平的还是竖直方向的
        // 转向不移动  添加开关
        //竖直方向移动距离大于水平方向==> 不移动
        if(first){
            first = false; //只判断第一次移动, 为可动 不可动.
            if(Math.abs(disY) > Math.abs(disX)){
                onoff = false;
                // return;
            }
        }

        if(onoff){
            cssTransform(oUl,'translateX',disX + startX);
        }
    });
    slide.addEventListener('touchend',function (e) {
        num = Math.round( - cssTransform(oUl,'translateX')/width);
        change();
        auto();
    })
    auto();
    // 自动
    function auto(){
        timer = setInterval(function(){
            num++;
            if(num === length-1){
                change(function(){
                    setTimeout(function(){  //切换后改变.给予切换的时间.
                        num = tab.length-1;
                        oUl.style.WebkitTransition = oUl.style.transition = "";
                        cssTransform(oUl,'translateX',-num*width);
                    },500);
                });
            }else{
                change();
            }

        },3000);
    }
    function change(callback){
        oUl.style.WebkitTransition = oUl.style.transition = ".5s";
        cssTransform(oUl,'translateX',-num*width);
        for (var i = 0; i < tab.length; i++) {
            tab[i].className = '';
        }
        tab[num%tab.length].className = 'on';
        callback&&callback();
    }
})();


//place
(function () {
    var str = '',
        placeDom = document.querySelector('.place'),
        // 点击加载更多
        more = document.querySelector('.allPlace .more'),
        num = 9;
    create(num);
    function create(num){
        for (var i = 0; i < num; i++) {
            str += `
                <a href="#">
                    <img src="./img/place${i}.jpg" alt="" width="100%" height="100%">
                    <span class="placeName">${data.placeName[i]}</span>
                    <span class="Name">${data.Pinyin[i]}</span>
                </a>
            `;
        }
        placeDom.innerHTML = str;
    }
    more.onclick = function(){
        num +=3;
        num = num > data.placeName.length?data.placeName.length:num;
        if(num >= data.placeName.length){
            more.style.display = 'none';
        }
        str = '';
        create(num);
    };

})();

// 景点
(function () {
    var recommend = document.querySelectorAll('.recommend .list li'),
        length = recommend.length,
        oUl = document.querySelector('.scenic ul'),
        more = document.querySelector('.allScenic .more'),
        num = 0,
        boundaryValue = data.AllScenicSpot.length - 5;
    for (var i = 0; i < length; i++) {
        recommend[i].onclick = function () {
            change(this);
        }
    }
    function change(obj){
        for (var i = 0; i < length; i++) {
            recommend[i].className = '';
        }
        obj.className = 'on';
    }
    addData(num);
    function addData(num){
        // 每次5条
        for (var i = num; i < num+5; i++) {
            create(i);
        }
    }
    function create(i){
        var Li = document.createElement('li');
        Li.innerHTML = `
            <a href="#" class="clearfix">
                <img src="./img/scenic${i+1}.jpg" alt="" class="fl" width="100%" height="100%">
                <div class="fl introduce">
                    <p class="s-title">${data.AllScenicSpot[i].place}</p>
                    <p class="des">${data.AllScenicSpot[i].Scenic}</p>
                </div>
            </a>
        `;
        oUl.appendChild(Li);
    }
    more.onclick = function(){
        num +=5;
        console.log(num,boundaryValue);
        num = num >= boundaryValue?boundaryValue:num;
        if(num >= boundaryValue){
            more.style.display = 'none';
        }
        addData(num);
    };
})();

// 名人
(function () {
    var oUl = document.querySelector('.celebrity .list'),
        last = oUl.querySelector('.last'),
        details = document.querySelector('.allCelebrity .details'),
        targetData = data.AllCelebrity;
        // <li class='last'><a href="javascript:void(0)"><span>等等</span></a></li>
    for (var i = 0; i < targetData.length; i++) {
        create(targetData[i],i);
    }
    function create(obj,i){
        var li = document.createElement('li');
        li.index = i;
        li.innerHTML = `
            <a href="javascript:void(0)"><i></i><span>${obj.name}</span></a>
        `;
        oUl.insertBefore(li,last);
    }
    oUl.addEventListener('touchmove',click,true);
    oUl.addEventListener('touchend',click,true);

    function click(e){
        switch(e.type){
            case 'touchmove':
                this.on = true;
                break;
            case 'touchend':
                if(!this.on){
                    var target = e.target || e.srcElement;
                    console.log(target);
                    if(target.tagName.toLowerCase() === 'span') {
                        // 拿到li;
                        var parent = target.parentNode.parentNode;
                        createDetail(parent.index);
                    }
                };
                this.on = false;
                break;
        }

    }
    /*
        <img src='./img/celebrity1.gif' alt="" width="100%" height='100%'>
        <div class="des">
            <p></p>
        </div>
        <div class="close"></div>
     */
    function createDetail(i) {
        // 阻止默认滚轮事件
        // document.addEventListener('touchmove',move,false);
        var str = `
            <img src='./img/celebrity${i+1}.gif' alt="" width="100%" height='100%'>
            <div class="des">
                <p>${targetData[i].experience}</p>
            </div>
        `;
        details.innerHTML = str;
        // 关闭按钮 事件.
        var close = document.createElement('div');
        close.className = 'close';
        // 防止误触 ,点透问题.
        var start = {x:0,y:0},end = {x:0,y:0};
        close.addEventListener('touchstart',function(e){
            start.x = e.changedTouches[0].pageX;
            start.y = e.changedTouches[0].pageY;
        });
        close.addEventListener('touchend',function(e){
            end.x = e.changedTouches[0].pageX;
            end.y = e.changedTouches[0].pageY;
            if(end.x === start.x && end.y === start.y){
                e.stopPropagation();
                var timer = null;
                AnimateTime(details,{opacity:0},'500','easeIn',function(){
                    clearTimeout(timer);
                    timer = setTimeout(function(obj){
                        obj.innerHTML = '';
                        obj.style.display = 'none';
                        obj.style.marginTop = '0';
                    },500,this);
                })
                // 恢复默认滚轮事件
                document.removeEventListener('touchmove',move,false);
            }
        })
        details.appendChild(close);
        // 显示
        AnimateTime(details,{opacity:100},'500','easeIn',function(){
            this.style.display = 'block';
            //添加details 拖动事件
            addEvent(this);
        })
    }
    // 默认滚轮事件
    function move(e){
        e.preventDefault();
    }
    // details 拖动事件
    function addEvent(obj){
        console.log(details.offsetHeight); //总高
        console.log(window.screen.height/scale); //缩放过的屏幕高
        // 边界值 = 总高 - 缩放过的屏幕高
        var start = {
            y:0
        },end = {
            y:0
        },
        startTime = 0
        // marginTop 值
        val = 0,
        // 下拉的边界值. 负值
        boundaryValue = details.offsetHeight-window.screen.height;

        obj.addEventListener('touchstart',touch,false);
        obj.addEventListener('touchmove',touch,false);
        obj.addEventListener('touchend',touch,false);
        function touch(e){
            var distance = 0;
            switch(e.type){

                case 'touchstart':
                e.stopPropagation();
                start.y = e.changedTouches[0].pageY;
                this.style.WebkitTransition = this.style.transition = '';
                // 初始化
                console.log(getStyle(this,'marginTop'));
                this.startY = getStyle(this,'marginTop');
                startTime = Date.now();
                    break;

                case 'touchmove':
                e.stopPropagation();
                //阻止默认拖动事件
                e.preventDefault();
                end.y = e.changedTouches[0].pageY;
                val = end.y - start.y + this.startY;
                // 边界限制
                if(val > 0 ){ //拖动系数. 拉力的感觉
                    val *= 0.2;
                }else if( val < -boundaryValue){  //最后.
                    val = (end.y - start.y)*0.2 + this.startY;
                }
                this.style.marginTop = val + 'px';
                    break;

                case 'touchend':
                e.stopPropagation();
                this.style.WebkitTransition = this.style.transition = '.5s';
                // 防止点击. 重新获取
                end.y = e.changedTouches[0].pageY;
                /*惯性*/
                var T = Date.now()-startTime;
                    S =  end.y - start.y;
                    v = (S/T)*100;
                console.log(v);
                val +=v;
                 // 边界值 = 总高 - 缩放过的屏幕高
                 // console.log(val ,boundaryValue);
                 if(val > 0){
                    val = 0
                 }else if(val <= -boundaryValue ){
                    val = - boundaryValue;
                 }
                 this.style.marginTop = val + 'px';
                    break;
            }
        }

    }
})();


// 民俗文化
(function () {
    var slide = document.querySelector('.c-nav'),
        oUl = document.querySelector('.c-nav ul.list'),
        targetData = data.Culture;
    // 给予宽度
    oUl.style.width = 120.5 * targetData.length + 'px';
    for (var i = 0; i < targetData.length; i++) {
        addDom(i);
    }
    // 拖动
    dragComponent(slide,oUl);
    function addDom(i){
        var liDom = document.createElement('li');
        liDom.innerHTML = `
            <a href="javascript:void(0);">
                <img src="./img/culture${i+1}.gif" alt="" width="100%" height="100%">
                <p>${targetData[i]}</p>
            </a>
        `;
        oUl.appendChild(liDom);
    }
})();



//日常  daily
(function () {
    var content = document.querySelectorAll('.daily .content'),
        tab = document.querySelectorAll('.daily .tab-title'),
        targetData = data.daily,
        num = 0;
        /*
        <div class='box'>
            <a href="#">
                <img src="./img/cate1.jpg" alt="" width="100%" height="100%">
                <p class="name MultiLineEllipsis">光明农场四大美食之一，以润、滑、甜、嫩为特点，滋味浓鲜。烹制的“光明乳鸽</p>
                <div class='detail'>
                    <p class=' fl'> 乳鸽</p>
                    <span class='position fr'>广州</span>
                </div>
            </a>
        </div>
         */
    // tab事件
    for (var j = 0; j < tab.length; j++) {
        tab[j].index = j;
        tab[j].addEventListener('touchmove',tabtouch,false);
        tab[j].addEventListener('touchend',tabtouch,false);
    }
    function tabtouch(e){
        switch(e.type){
            case 'touchmove':
                this.on = true;
                break;
            case 'touchend':
                if(!this.on){
                   for (var i = 0; i < tab.length; i++) {
                       tab[i].className = 'tab-title';
                       content[i].className = 'content';
                   }
                   this.className = 'tab-title on';
                   content[this.index].className = 'content page-on';
                }
                this.on = false;
                break;
        }
    }
    // 添加Dom
    for (var i = 0; i < content.length; i++) {
        var nowdata = i?targetData.travels:targetData.cate;
        var imgName = i?'travels':'cate';
        // 数据条目数
        content[i].num = 0;
        addData(content[i],nowdata,imgName,4);
    }
    //step加载几条数据
    function addData(obj,nowdata,imgName,step){
        var num = obj.num + step;
        for (var i = obj.num; i < num; i++) {
            create(obj,nowdata,i,imgName)
        }
        obj.num = num;
    }
    function create(obj,nowdata,i,imgName){
        var box = document.createElement('div');
        box.className = 'box';
        box.innerHTML = `
            <a href="#">
                <img src="./img/${imgName}${i+1}.jpg" alt="" width="100%" height="100%">
                <p class="name MultiLineEllipsis">${nowdata[i].detail}</p>
                <div class='detail'>
                    <p class='fl'> ${nowdata[i].name}</p>
                    <span class='position fr'>${nowdata[i].position}</span>
                </div>
            </a>
        `;
        box.style.opacity = 0;
        obj.appendChild(box);
        AnimateTime(box,{opacity:100},300,'easeIn')
    };
    // 下拉加载
    window.addEventListener('scroll',function(){
        // 滚动到底部加载新数据
        //   屏幕高+10 > 页面总高 - 滚动高度
        var wH = window.screen.height,
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            dH = document.body.scrollHeight - scrollTop;
        if(wH + 55 > dH ){
            var target = document.querySelector('.daily .tab-title.on'),
                i = target.index,
                nowdata = i?targetData.travels:targetData.cate;
                imgName = i?'travels':'cate';
            if(content[i].num < nowdata.length){
                addData(content[i],nowdata,imgName,1);
            }
        }
        // console.log(dH,wH,scale);
    },false);
})();


(function () {
    var page = $('.page'),
        tab = $('.h-nav ul li');
    tab.click(function () {
        var index = $(this).index();
        $('body,html').stop().animate({
            scrollTop: $(page[index]).offset().top - 80
        },300)
    })
})();
















