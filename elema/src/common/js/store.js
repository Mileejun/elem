export function saveToLocal(id, key, value) {
    // __一般用于私有的
    let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        // JSON.parse 用于将一个 JSON 字符串转换为 JavaScript 对象
        seller = JSON.parse(seller);
        if(!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value; 
    // JSON.stringify 用于将 JavaScript 值转换为 JSON 字符串  
    window.localStorage.__seller__ = JSON.stringify(seller);
    // console.log(window.localStorage.__seller__);
};

export function loadFromLocal(id, key, def) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        return def;
    }
    seller = JSON.parse(seller)[id];
    if(!seller) {
        return def;
    }
    let ret = seller[key];
    return ret || def;
};