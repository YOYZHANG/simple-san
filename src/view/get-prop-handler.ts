
const elementPropHandlers = {

} as {[key: string]: any}

const defaultElementPropHandlers = {
    style: function (el: any, value: any) {
        el.style.cssText = value;
    },
    'class': function (el: any, value: any) {
        if (
            el.className !== value
        ) {
            el.className = value;
        }
    }
} as {[key: string]: any}



export default function getPropHandler(tagName: string, attrName: string) {
    let tagPropHandlers = elementPropHandlers[tagName] || {};
    
    let propHandler = tagPropHandlers[attrName];
    if (!propHandler) {
        propHandler = defaultElementPropHandlers[attrName] || defaultElementPropHandlers;
        tagPropHandlers[attrName] = propHandler;
    }

    return propHandler;
}