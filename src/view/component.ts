import initComponent from '../helper/init-component';
import Data from '../runtime/data';
import {LifeCycle, LifeCycleKEY, LifeCycleType} from '../helper/life-cycle';
import isDataChangeByElement from './data-change-by-el';
import {changeExprCompare, CompareResult} from '../runtime/change-expr-compare';
import createEl from '../dom/create-el';
import insertBefore from '../dom/insert-before';
import type {ANode} from 'san';
import createNode from './create-node';
class Component {
    static template: string;
    private contentReady: boolean;
    public data: any;
    public components: any;
    public lifeCycle: LifeCycleType;
    public tagName: string;
    public elementNode: any;
    public initData: () => any;
    public needUpdateRender: boolean;
    public aNode: ANode;
    public children: any [];
    constructor(options: {}) {
        const clazz = this.constructor;
        initComponent(clazz, this);
        this.toPhase(LifeCycleKEY.compiled);


        var initData = typeof this.initData === 'function' && this.initData() || {}
        this.data = new Data(initData);
        // this.initDataChanger();
        // this._sbindData = nodeSBindInit(this.aNode.directives.bind, this.data, this);
        this.toPhase(LifeCycleKEY.inited);

        this.tagName = this.tagName || 'div';
    }

    private toPhase(name: LifeCycleKEY) {
        if (!this.lifeCycle[name]) {
            this.lifeCycle = LifeCycle[name];
            if (typeof this[name] === 'function') {
                // 执行生命周期函数
                this[name]();
            }
        }
    }

    public attach(parentEl) {
        if (this.lifeCycle.attached) {
            return;
        }

        this.elementNode = this.elementNode || createEl(this.tagName);
        // 触发生命周期
        this.toPhase(LifeCycleKEY.created);

        insertBefore(this.elementNode, parentEl);
        // 处理子节点
        this.handleChildNodes();
        this.toPhase(LifeCycleKEY.attached);
    }

    private update(changes: []) {
        if (this.lifeCycle.disposed) {
            return;
        }
        if (changes) {
            for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
                let change: any = changes[changeIndex];
                let changeExpr = change.expr;
                for (let bindIndex = 0; bindIndex < this.binds.length; bindIndex++) {
                    let bindItem = this.binds[bindIndex];
                    let setExpr = bindItem.name;
                    let updateExpr = bindItem.expr;

                    if (!isDataChangeByElement(change, this, setExpr)) {
                        let relation = changeExprCompare(changeExpr, updateExpr, me.scope));
                        
                        // 变更表达式是目标表达式的子项
                        if (relation > CompareResult.EQUAL) {
                            // do something
                        }
                        else {
                            // do something
                            // this.data.set(setExpr);
                        }
                    }
                }
            }
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
            let child = createNode(childANode, this, this.data, this);
            this.children.push(child);

            child.attach(this.elementNode);
        }

        this.contentReady = true;
    }
}

export default Component;