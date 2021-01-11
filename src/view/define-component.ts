import inherits from '../utils/inherits';
import Component from './component';

/**
 * 创建组件类
 *
 * @param {Object} proto 组件类的方法表
 * @param {Function=} SuperComponent 父组件类
 * @return {Function}
 */
export default function defineComponent(proto: {template: string, initData?: () => object}) {
    if (typeof proto !== 'object') {
        throw new Error('[FAKESAN FATAL]: defineComponent need a plain object.');
    }

    function ComponentClass(option: any) {
        Component.call(this, option);
    }

    ComponentClass.prototype = proto;
    inherits(ComponentClass, Component);
    return ComponentClass;
}