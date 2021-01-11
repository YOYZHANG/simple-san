import insertBefore from '../dom/insert-before';
import {LifeCycle, LifeCycleKEY, LifeCycleType} from '../helper/life-cycle';
import createNode from './create-node';
import createEl from '../dom/create-el';

export default class Element {
    public tagName: string;
    public lifeCycle: LifeCycleType;
    public contentReady: boolean;
    public aNode: any;
    public owner?: any;
    public scope?: any;
    public parent?: any;
    public children: any;
    public el: any;


    constructor (aNode: any, parent: any, scope: any, owner: any) {
        this.aNode = aNode;
        this.tagName = aNode.tagName || 'div';
        this.lifeCycle = LifeCycle.inited;
        this.parent = parent;
        this.scope = scope;
        this.owner = owner;
        this.children = [];
    }

    public attach(parentEl: any) {
        if (this.lifeCycle.attached) {
            return;
        }

        if (!this.el) {
            this.el = createEl(this.tagName);
            this.lifeCycle = LifeCycle.created;
        }

        insertBefore(this.el, parentEl);

        this.handleChildNodes();
        this.lifeCycle = LifeCycle.attached;
    }

    private handleChildNodes() {
        if (!this.contentReady) {
            return;
        }

        for (let i = 0; i < this.aNode.children.length; i++) {
            let childANode = this.aNode.children[i];
            let child = createNode(childANode, this, this.scope, this.owner);
            this.children.push(child);
            
            child.attach(this.el);
        }

        this.contentReady = true;
    }
}