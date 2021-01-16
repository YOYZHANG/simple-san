import evalExpr from './eval-expr';

export default function evalArgs(args: any, data: any, owner?: any) {
    let result = [];
    for (let i = 0; i < args.length; i++) {
        result.push(evalExpr(args[i], data, owner));
    }

    return result;
}