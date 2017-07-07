/*
    2个参数获取 transform 的值
    3个 设置
 */

function cssTransform(obj,attr,val){
    if(!obj.transform){
        obj.transform = {};
    }
    if(arguments.length === 3){
        obj.transform[attr] = val;
        var strVal = '';
        for(var key in obj.transform){
            switch(key){
                case 'translate':
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    strVal += key+"("+obj.transform[key]+"px) ";
                    break;
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'skewY':
                case 'skewX':
                    strVal += key+"("+obj.transform[key]+"deg) ";
                    break;
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                    strVal += key + '('+obj.transform[key]+') ';
                    break;
            }
        }
        obj.style.WebkitTransform = obj.style.transform = strVal;

    }else{//获取
        val = obj.transform[attr];
        if ( typeof val === 'undefined'){
            if( attr === 'scale' || attr === 'scaleX' || attr === 'scaleY') {
                val = 1;
            }else{
                val = 0;
            }
        }
        return val;
    }
}