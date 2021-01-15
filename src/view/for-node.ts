import {ExprType} from "../parser/expr-type";
import evalExpr from "../runtime/eval-expr";
import createNode from "./create-node";
import insertBefore from '../dom/insert-before';
import inherits from "../utils/inherits";
import Data from "../runtime/data";
import {changeExprCompare} from "../runtime/change-expr-compare";
import changesIsInDataRef from "../runtime/changes-is-in-dataRef";
import { NodeType } from "san/types";
import DataChangeType from "../runtime/data-change-type";
export default class ForNode {
    private id: any;
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
        this.children = [];

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

    attach(parentEl: any) {
        this.el = this.el || document.createComment(this.id);
        insertBefore(this.el, parentEl);
        this.listData = evalExpr(this.param.value, this.scope, this.owner);
        this.createChildren();
    }

    update(changes: any) {
        let listData = evalExpr(this.param.value, this.scope, this.owner);
        // let isOldArr = this.listData instanceof Array;
        // let isNewArr = listData instanceof Array;

        if (this.children.length) {
            // 
            // if (oldIsArr !== newIsArr || !newIsArr) {
            //     this.listData = listData;

            //     let isListChanged;
            //     for (let i = 0; i < changes.length; i++) {
            //         if (isListChanged) {
            //             break;
            //         }
            //         isListChanged = changeExprCompare(changes[i].expr, this.param.value);
            //     }

            //     var dataHotspot = this.aNode.hotspot.data;
            //     if (isListChanged || dataHotspot && changesIsInDataRef(changes, dataHotspot)) {
            //         var me = this;
            //         this.disposeChildren(null, function() {
            //             me.createChildren();
            //         });
            //     }
            // }
            // else {
            this.updateArray(changes, listData);
            this.listData = listData;
            // }
        }
        else {
            this.listData = listData;
            this.createChildren();
        }

    }

    disposeChildren(children: any, callback: any) {
        let parentEl = this.el.parentNode;
        let parentFirstChild = parentEl.firstChild;
        let parentLastChild = parentEl.lastChild;

        if (!children) {
            children = this.children;
            this.children = [];
        }

        let disposedChildCount = 0;

        for (var i = 0; i < children.length; i++) {
            let disposeChild = children[i];
            if (disposeChild) {
                disposeChild.ondisposed = childDisposed;
                disposeChild.dispose();
            }
            else {
                childDisposed();
            }
        }        

        function childDisposed() {
            disposedChildCount++;
            if (disposedChildCount >= children.length) {
                callback && callback();
            }
        }
    }

    updateArray(changes: any, newList: any[]) {
        let oldChildrenLen = this.children.length;
        let childrenChanges = new Array(oldChildrenLen);
        let disposeChildren = [];
        var getItemKey = this.aNode.hotspot.getForKey;
        let newLen = newList.length;
        // 控制列表是否整体更新的变量
        let isChildrenRebuild;
        for (let cIndex = 0; cIndex < changes.length; cIndex++) {
            let change = changes[cIndex];
            let relation = changeExprCompare(change.expr, this.param.value);
            if (!relation) {}
            else {
                if (relation > 2) {}
                else if (isChildrenRebuild){}
                else if (relation === 2 && change.type === DataChangeType.SPLICE) {}
                else {
                    if (getItemKey && newLen && oldChildrenLen) {}
                    else {
                        if (oldChildrenLen > newLen) {

                        }

                        for (let i = 0; i < newLen; i++) {
                            if (this.children[i]) {
                                if (this.children[i].scope.raw[this.param.item] !== newList[i]) {
                                    this.children[i].scope.raw[this.param.item] = newList[i];
                                    (childrenChanges[i] = childrenChanges[i] || []).push({
                                        type: DataChangeType.SET,
                                        option: change.option,
                                        expr: this.itemExpr,
                                        value: newList[i]
                                    });
                                }
                            }
                            else {
                                this.children[i] = 0;
                            }
                        }
                    }
                }
            }
        }

        if (disposeChildren.length === 0) {
            doCreateAndUpdate.bind(this);
        }

        function doCreateAndUpdate() {
            var beforeEl = this.el;
            var parentEl = beforeEl.parentNode;
    
            for (var i = 0; i < newLen; i++) {
                let child = this.children[i];
    
                if (child) {}
                else {
                    this.children[i] = createNode(this.aNode.forRinsed, this, new ForItemData(this, newList[i], i), this.owner);
                    this.children[i].attach(parentEl, beforeEl || this.el);
                }
            }
        }
    }

    createChildren() {
        let parentEl = this.el.parentNode;
        let listData = this.listData;
        if (listData instanceof Array) {
            for (let i = 0; i < listData.length; i++) {
                let childANode = this.aNode.forRinsed;
                var child = childANode.Clazz
                    ? new childANode.Clazz(childANode, this, new ForItemData(this, listData[i], i), this.owner)
                    : createNode(childANode, parent, new ForItemData(this, listData[i], i), this.owner);
                this.children.push(child);
                child.attach(parentEl);
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

inherits(ForItemData, Data);