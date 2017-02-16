// 解析url参数
// @example ?id=12345&a=b
// @return Object {id:12345,a:b}
export function urlParse() {
    let url = window.location.search;
    console.log(url);
    
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    console.log('arr '+arr);
    //['?id=12345','&a=b']
    if(arr){
        arr.forEach((item)=>{
            let tempArr = item.substring(1).split('=');
            // decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
            console.log('obj '+obj);
        });
    }
    return obj;
};