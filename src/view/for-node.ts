import {ExprType} from "../parser/expr-type";
import evalExpr from "../runtime/eval-expr";
export default class ForNode {
    public aNode: any;
    public owner: any;
    public scope: any;
    public parent: any;
    public param: any;
    public itemPaths: any;
    public itemExpr: any;
    public el: any;
    public listData: any[];
    public children: any[];
    constructor(aNode: any, parent: any, scope: any, owner: any) {
        this.aNode = aNode;
        this.owner = owner;
        this.scope = scope;
        this.parent = parent;
        this.param = aNode.directives['for'];

        console.log(this.param, 'sfor param');

        this.itemPaths = [
            {
                type: ExprType.STRING,
                value: this.param.item
            }
        ];

        this.itemExpr = {
            type: ExprType.STRING,
            paths: this.itemPaths,
            raw: this.param.item
        };  
    }

    attach() {
        this.listData = evalExpr(this.param.value, this.scope, this.owner);
        this.createChildren();
    }

    createChildren() {
        let parentEl = this.el.parentNode;
        let listData = this.listData;

        if (listData instanceof Array) {
            for (let i = 0; i < listData.length; i++) {
                let childANode = this.aNode.forRinsed;
                var child = new childANode.Clazz(childANode, this, new ForItemData(this, listData[i], i), this.owner);
                this.children.push(child);
                child.attach(parentEl, this.el);
            }
        }
    }
}

class ForItemData {
    public parent: any;
    public raw: any;
    public listeners: [];
    public directive: any;
    public indexName: string;
    constructor(forElement: any, item: any, index: any) {
        this.parent = forElement.scope;
        this.raw = {};
        this.listeners = [];

        this.directive = forElement.aNode.directives['for'];
        this.indexName = this.directive.index || '$index';

        this.raw[this.directive.item] = item;
        this.raw[this.indexName] = index;
    }
}