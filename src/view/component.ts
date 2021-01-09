import {ComponentConstructor} from './types';
import {initComponent} from './helper/init-component';
import Data from './runtime/data';

class Component {
    static template: string;

    public _cmptReady: boolean;
    public data;
    public components;
    constructor(options: {}) {
        const clazz = this.constructor;
        initComponent(clazz, this);
        this.toPhase('compiled');


        var initData = typeof this.initData === 'function' && this.initData() || {}
        this.data = new Data(initData);
        // this.initDataChanger();
        // this._sbindData = nodeSBindInit(this.aNode.directives.bind, this.data, this);
        this.toPhase('inited');

        // this.tagName = this.tagName || 'div';
    }

    public attach($appOrView) {
        if (this.lifeCycle.attached) {
            return;
        }
    }
}