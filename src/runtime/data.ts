/**
* @file Data
*/

import DataChangeType from '../runtime/data-change-type';
import {ExprType} from '../parser/expr-type';
interface Change {
    type: any,
    expr: any,
    value: any
}
export default class Data {
    public parent: any;
    public raw: {[key: string]: any};
    public listeners: any[];
    constructor(data: any, parent?: any) {
        this.parent = parent;
        this.raw = data || {};
        this.listeners = [];
    }

    public get(expr: {paths: any}) {
        let paths = expr.paths;
        let value = this.raw[paths[0].value];

        return value;
    }

    public set(expr: any, value: any) {
        // 赋值操作

        let newExpr = {
            type: ExprType.ACCESSOR,
            paths: [{
                type: ExprType.STRING,
                value: expr
            }]   
        }
        if (this.get(newExpr) === value) {
            return;
        }
        let prop = newExpr.paths[0].value;
        this.raw[prop] = value;
        // 派发事件
        this.fire({
            type: DataChangeType.SET,
            expr: newExpr,
            value: value
        });
    }


    public listen(listener: () => {}) {
        if (typeof listener === 'function') {
            this.listeners.push(listener);
        }
    }

    public fire(change: Change) {
        for (let listener of this.listeners) {
            listener.call(this, change);
        }
    }
}