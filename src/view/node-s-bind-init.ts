import evalExpr from '../runtime/eval-expr';

export default function nodeSBindInit(sBind: {value: any}, scope: any, owner: any) {
    if (sBind && scope) {
        return evalExpr(sBind.value, scope, owner);
    }
}