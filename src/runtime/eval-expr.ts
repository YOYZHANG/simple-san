import {ExprType} from '../parser/expr-type';

import {DEFAULT_FILTERS} from './default-filters';

export default function evalExpr(expr: any, data: any, owner?: any): any {
    if (expr.value != null) {
        return expr.value;
    }

    let value;
    switch (expr.type) {
        case ExprType.ACCESSOR:
            return data.get(expr);
        
        case ExprType.INTERP:
            value = evalExpr(expr.expr, data, owner);

            if (owner) {
                for (let i = 0; i < expr.filters.length; i++) {
                    let filter = expr.filters[i];
                    let filterName = filter.name.paths[0].value;

                    switch (filterName) {
                        case '_xclass':
                            value = DEFAULT_FILTERS[filterName](value, evalExpr(filter.args[0], data, owner));
                            break;
                    }
                }
            }

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