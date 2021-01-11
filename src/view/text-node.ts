import insertBefore from '../dom/insert-before';
import {LifeCycle, LifeCycleKEY, LifeCycleType} from '../helper/life-cycle';
import createNode from './create-node';

export default class TextNode {
    public tagName: string;
    public lifeCycle: LifeCycleType;
    public contentReady: boolean;
    public aNode: any;
    public owner?: any;
    public scope?: any;
    public parent?: any;
    public children: any;
    public el: any;
    public content: string;


    constructor (aNode: any, parent: any, scope: any, owner: any) {
        this.aNode = aNode;
        this.tagName = aNode.tagName || 'div';
        this.lifeCycle = LifeCycle.inited;
        this.parent = parent;
        this.scope = scope;
        this.owner = owner;
        this.children = [];
        this.content;
    }

    public attach(parentEl: any) {
        this.content = this.aNode.textExpr!.value;
        // evalExpr(this.aNode.textExpr, this.scope, this.owner) || '';

        // Todo: 处理aNode.textExpr.original的情况
        this.el = document.createTextNode(this.content);
        insertBefore(this.el, parentEl)
    }
}