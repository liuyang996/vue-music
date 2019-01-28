export  function getData(el,name,val) {
    const prefix = 'data-';
    if(val) {
        return el.setAttribute(prifix+name,val);
    }
    return el.getAttribute(prefix+name);
}


let elementStyle = document.createElement('div').style

let vendor = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }

    for(let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key
        }
    }

    return false
})()

export function prefixStyle(style) {
    if (vendor === false) {
        return false
    }

    if (vendor === 'strandard') {
        return style
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}