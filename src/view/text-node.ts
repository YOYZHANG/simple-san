import insertBefore from '../dom/insert-before';
import {LifeCycle, LifeCycleKEY, LifeCycleType} from '../helper/life-cycle';
import evalExpr from '../runtime/eval-expr';
import {changeExprCompare} from '../runtime/change-expr-compare';
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
        this.content = evalExpr(this.aNode.textExpr, this.scope, this.owner) || '';
        // Todo: 处理aNode.textExpr.original的情况
        this.el = document.createTextNode(this.content);
        insertBefore(this.el, parentEl)
    }

    public update(changes: any[]) {
        if (this.aNode.textExpr.value) {
            return;
        }

        var len = changes.length;
        while (len--) {
            if (changeExprCompare(changes[len].expr, this.aNode.textExpr)) {
                let text = evalExpr(this.aNode.textExpr, this.scope, this.owner);

                if (text == null) {
                    text = '';
                }

                if (text !== this.content) {
                    this.content = text;

                    this.el.textContent = text;
                }

            }
        }

    }
}