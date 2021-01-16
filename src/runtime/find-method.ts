import evalExpr from '../runtime/eval-expr';

export default function findmethod(source: any, nameExpr: any, data: any) {
    let method = source;
    for (let i = 0; i < nameExpr.paths.length; i++) {
        if (method == null) {
            break;
        }

        method = method[evalExpr(nameExpr.paths[i], data)];
    }

    return method;
}