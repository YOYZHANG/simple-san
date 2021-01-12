import {ExprType} from '../parser/expr-type';


export default function evalExpr(expr: any, data: any, owner: any): any {
    if (expr.value != null) {
        return expr.value;
    }

    let value;
    switch (expr.type) {
        case ExprType.ACCESSOR:
            return data.get(expr);
        
        case ExprType.INTERP:
            value = evalExpr(expr.expr, data, owner);

            if (value == null) {
                value = '';
            }

            return value;
        
        case ExprType.TEXT:
            let buf = '';
            for (var i = 0, l = expr.segs.length; i < l; i++) {
                let seg = expr.segs[i];
                buf += seg.value || evalExpr(seg, data, owner);
            }
            return buf;

    }

    return value;
}