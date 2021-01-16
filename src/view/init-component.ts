// @ts-ignore
import {parseComponentTemplate, defineComponent} from 'san';
import preheatANode from './preheat-a-node';

export default function initComponent (
    clazz: any,
    comIns: any
) {
    const proto = clazz.prototype;
    if (!proto.hasOwnProperty('_cmptReady')) {
        proto.components = proto.components || {};
        const components = proto.components;

        for (var key in components) {
            const cmptClass = components[key];
            if (typeof cmptClass === 'object') {
                components[key] = defineComponent(cmptClass);
            }
        }

        proto._cmptReady = true;
        clazz.trimWhitespace = 'all';
    }

    if (!proto.hasOwnProperty('aNode')) {
        proto.aNode = parseComponentTemplate(clazz);
        preheatANode(proto.aNode);
    }    
}