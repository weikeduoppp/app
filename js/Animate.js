/**
 *
 * @authors weikeduopupu
 * @date    2017-03-26 17:15:57
 * @version $Id$
 */

/*
    obj, 元素对象
    json, 改变的属性attr 和值
        {
            width: 100, height:100,left:300,opacity:100.....
        }
    time,===>duration持续时间
    mc,  运动曲线
            linear,easeIn...
    callBack

 */
// 时间版
(function(win){
    function move(obj,json,time,mc,callBack){
     //一般定时器 结束后要清除
     clearInterval(obj.timer);
     var cur = {};
     var end = {};
     var mc = mc || 'easeIn';
     var mark = true;
     for(var attr in json){
         if(attr=="opacity"){
             cur[attr] = getStyle(obj,attr)*100 || 0;
         }else{
             cur[attr] = parseInt(getStyle(obj,attr)) || 0;
         }
         end[attr] = json[attr];
     };
     var sTime = new Date();
     /*
             t, b, c, d
             time             : current time==>(nTime-sTime)现在过去的时间
             beginning value  : cur
             change in value  : 变化量(end-cur)
             duration         : 持续时间 time
      */
     obj.timer = setInterval(function(){
         // var sTime = new Date();
         var t = new Date() - sTime;
         //duration 持续时间
         if(t>=time){
             t = time;
             clearInterval(obj.timer);
             // callBack&&callBack.call(obj);
         }
         var s = undefined;
         for(var attr in json){
             //var s = prop * (end[attr] - cur[attr]) + cur[attr];
             var b = cur[attr];
             var c = end[attr]-b;
             s = Tween[mc](t,b,c,time);
             if(attr=="opacity"){
                 obj.style.filter = "alpha(opacity="+s+")";
                 obj.style[attr] = s/100 ;
             }else{
                obj.style[attr] = s + "px";
             }
         };
         if(t = time){
            if(mark){ //只执行一次
                callBack&&callBack.call(obj);
                mark = false;
            }
         }
     },13);
     var Tween = {
         linear: function (t, b, c, d){  //匀速
             return c*t/d + b;   //  t/d = prop;
         },
         easeIn: function(t, b, c, d){  //加速曲线
             return c*(t/=d)*t + b;
         },
         easeOut: function(t, b, c, d){  //减速曲线
             return -c *(t/=d)*(t-2) + b;
         },
         easeBoth: function(t, b, c, d){  //加速减速曲线
             if ((t/=d/2) < 1) {
                 return c/2*t*t + b;
             }
             return -c/2 * ((--t)*(t-2) - 1) + b;
         },
         easeInStrong: function(t, b, c, d){  //加加速曲线
             return c*(t/=d)*t*t*t + b;
         },
         easeOutStrong: function(t, b, c, d){  //减减速曲线
             return -c * ((t=t/d-1)*t*t*t - 1) + b;
         },
         easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
             if ((t/=d/2) < 1) {
                 return c/2*t*t*t*t + b;
             }
             return -c/2 * ((t-=2)*t*t*t - 2) + b;
         },
         elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
             if (t === 0) {
                 return b;
             }
             if ( (t /= d) == 1 ) {
                 return b+c;
             }
             if (!p) {
                 p=d*0.3;
             }
             if (!a || a < Math.abs(c)) {
                 a = c;
                 var s = p/4;
             } else {
                 var s = p/(2*Math.PI) * Math.asin (c/a);
             }
             return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
         },
         elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
             if (t === 0) {
                 return b;
             }
             if ( (t /= d) == 1 ) {
                 return b+c;
             }
             if (!p) {
                 p=d*0.3;
             }
             if (!a || a < Math.abs(c)) {
                 a = c;
                 var s = p / 4;
             } else {
                 var s = p/(2*Math.PI) * Math.asin (c/a);
             }
             return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
         },
         elasticBoth: function(t, b, c, d, a, p){
             if (t === 0) {
                 return b;
             }
             if ( (t /= d/2) == 2 ) {
                 return b+c;
             }
             if (!p) {
                 p = d*(0.3*1.5);
             }
             if ( !a || a < Math.abs(c) ) {
                 a = c;
                 var s = p/4;
             }
             else {
                 var s = p/(2*Math.PI) * Math.asin (c/a);
             }
             if (t < 1) {
                 return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                         Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
             }
             return a*Math.pow(2,-10*(t-=1)) *
                     Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
         },
         backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
             if (typeof s == 'undefined') {
                s = 1.70158;
             }
             return c*(t/=d)*t*((s+1)*t - s) + b;
         },
         backOut: function(t, b, c, d, s){
             if (typeof s == 'undefined') {
                 s = 3.70158;  //回缩的距离
             }
             return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
         },
         backBoth: function(t, b, c, d, s){
             if (typeof s == 'undefined') {
                 s = 1.70158;
             }
             if ((t /= d/2 ) < 1) {
                 return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
             }
             return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
         },
         bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
             return c - Tween['bounceOut'](d-t, 0, c, d) + b;
         },
         bounceOut: function(t, b, c, d){
             if ((t/=d) < (1/2.75)) {
                 return c*(7.5625*t*t) + b;
             } else if (t < (2/2.75)) {
                 return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
             } else if (t < (2.5/2.75)) {
                 return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
             }
             return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
         },
         bounceBoth: function(t, b, c, d){
             if (t < d/2) {
                 return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
             }
             return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
         }
     };
    }
    win.AnimateTime = move;
})(window);

// 速度版
(function(win){
    function move(dom,json,callBack){
        clearInterval(dom.timer);
        dom.timer = setInterval(function(){
            var mark = true;
            for(var attr in json){
                var cur = null;
                var speed = null;
                var target = json[attr];
                if(attr == "opacity"){
                    // 传入格式为 opacity: 1;的情况
                    cur = getStyle(dom,attr)*100;
                    target = target*100;
                    speed = ( target - cur)*0.2;
                }else{
                    //如果没写 默认填充成0
                    cur = parseInt(getStyle(dom,attr))||0;
                    speed = (target - cur)*0.2;
                }
                //console.log(cur);
                speed = speed>0?Math.ceil(speed):Math.floor(speed);
                if(cur != target){
                    if(attr == "opacity"){
                        //IE opacity兼容问题
                        dom.style.filter = "alpha(opacity="+(cur+speed)+")";
                        dom.style[attr] = (cur + speed)/100;
                    }else{
                        dom.style[attr] = cur + speed + "px";
                    }
                    mark = false;
                };
            }
            if(mark){
                clearInterval(dom.timer);
                callBack && callBack.call(dom);
            }
        },1000/30);
    }
    win.AnimateSpeed = move;
})(window);

 function getStyle(obj,attr){
     return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,null)[attr];
 }

