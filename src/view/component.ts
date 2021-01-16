import initComponent from './init-component';
import Data from '../runtime/data';
import {LifeCycle, LifeCycleKEY, LifeCycleType} from '../helper/life-cycle';
import isDataChangeByElement from './data-change-by-el';
import {changeExprCompare} from '../runtime/change-expr-compare';
import createEl from '../dom/create-el';
import insertBefore from '../dom/insert-before';
// @ts-ignore
import type {ANode} from 'san';
import createNode from './create-node';
import nextTick from '../utils/next-tick';
import evalExpr from '../runtime/eval-expr';
import nodeSBindInit from './node-s-bind-init';
import getEventListener from './get-event-listener';
import elementOwnAttached from './element-own-attached';
class Component {
    static template: string;
    private contentReady: boolean;
    private dataChangeArr: any[] | null;
    private sbindData: any;
    private rootNode: any;
    private source: any;
    private listeners: any;
    private nativeEvents: any[];
    public data: any;
    public components: any;
    public lifeCycle: LifeCycleType;
    public tagName: string;
    public el: any;
    public initData: () => any;
    public needUpdateRender: boolean;
    public aNode: ANode;
    public binds: any;
    public children: any [];
    public scope: any;
    public owner: any;
    constructor(options: {}) {
        this.lifeCycle = LifeCycle.start;
        this.children = [];
        this.binds = [];

        const clazz = this.constructor;
        // 解析 aNode 并初始化子 components
        initComponent(clazz, this);
        // this.initEvents();
        this.toPhase(LifeCycleKEY.compiled);


        var initData = typeof this.initData === 'function' && this.initData() || {}
        this.data = new Data(initData);
        this.initDataChanger();
        // TODO: 实现s-bind
        this.sbindData = nodeSBindInit(this.aNode.directives.bind, this.data, this);
        this.toPhase(LifeCycleKEY.inited);

        this.tagName = this.aNode.tagName || 'div';
    }

    private initDataChanger() {
        const me = this;
        function dataChanger(change: any) {
            if(!me.dataChangeArr) {
                nextTick(me.update, me);
                me.dataChangeArr = [];
            }

            me.dataChangeArr.push(change);
        }

        this.data.listen(dataChanger);
    }

    private toPhase(name: LifeCycleKEY) {
        if (!this.lifeCycle[name]) {
            this.lifeCycle = LifeCycle[name];
            // @ts-ignore
            if (typeof this[name] === 'function') {
                // 执行生命周期函数
                // @ts-ignore
                this[name]();
            }
        }
    }

    public attach(parentEl: any) {
        if (this.lifeCycle.attached) {
            return;
        }

        let hasRootNode = this.aNode.hotspot.hasRootNode

        if (hasRootNode) {
            this.rootNode = this.rootNode || createNode(this.aNode, this, this.data, this);
            this.rootNode.attach(parentEl);
            this.toPhase(LifeCycleKEY.created);
        }
        else {
            this.el = this.el || createEl(this.tagName);
            let props = this.aNode.props;
            this.handleAttributes(props);
            // 触发生命周期
            this.toPhase(LifeCycleKEY.created);

            insertBefore(this.el, parentEl);
            // 处理子节点
            this.handleChildNodes();
            elementOwnAttached.call(this);
        }
        this.toPhase(LifeCycleKEY.attached);
    }

    public on(name: string, listener: any, declaration?: any) {
        if (typeof listener === 'function') {
            if (!this.listeners[name]) {
                this.listeners[name] = [];
            }

            this.listeners[name].push({fn: listener, declaration: declaration});
        }
    }

    private update(changes: any[]) {
        if (this.lifeCycle.disposed) {
            return;
        }
        // 不太明白，但先这种方式传入
        changes = this.dataChangeArr;

        // if (changes) {
        //     for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
        //         let change: any = changes[changeIndex];
        //         let changeExpr = change.expr;
        //         for (let bindIndex = 0; bindIndex < this.binds.length; bindIndex++) {
        //             let bindItem = this.binds[bindIndex];
        //             let setExpr = bindItem.name;
        //             let updateExpr = bindItem.expr;

        //             if (!isDataChangeByElement(change, this, setExpr)) {
        //                 // TODO: let relation = changeExprCompare(changeExpr, updateExpr);
        //                 this.data.set(setExpr, evalExpr(updateExpr, this.scope, this.owner), {
        //                     target: {
        //                         node: this.owner
        //                     }
        //                 });
                        
        //             }
        //         }
        //     }
        // }

        let dataChanges = this.dataChangeArr;
        dataChanges && (this.dataChangeArr = null);

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].update(dataChanges);
        }


        this.toPhase(LifeCycleKEY.updated);
    }

    private handleChildNodes() {
        if (this.contentReady) {
            return;
        }

        // 疑问： children 的生命周期什么时候触发？
        for (let i = 0; i < this.aNode.children.length; i++ ) {
            let childANode = this.aNode.children[i];
            let child =  childANode.Clazz
                ? new childANode.Clazz(childANode, this, this.data, this)
                : createNode(childANode, this, this.data, this);
            this.children.push(child);
            child.attach(this.el);
        }

        this.contentReady = true;
    }

    private handleAttributes(props: any) {
        for (var i = 0, l = props.length; i < l; i++) {
            var prop = props[i];
            var value = evalExpr(prop.expr, this.data, this);
            if (value) {
                prop.handler(this.el, value, prop.name, this);
            }
        }
    }

    private initEvents() {
        if (!this.source) {
            return;
        }

        for (let i = 0; i < this.source.events.length; i++) {
            let eventBind = this.source.events[i];
            if (eventBind.modifier.native) {
                this.nativeEvents.push(eventBind);
            }
            else {
                this.on(
                    eventBind.name,
                    getEventListener(eventBind, this.owner, this.scope, true),
                    eventBind
                );
            }
        }
    }
}

export default Component;