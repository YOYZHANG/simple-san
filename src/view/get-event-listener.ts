import Data from "../runtime/data";
import evalArgs from "../runtime/eval-args";
import findMethod from "../runtime/find-method";
export default function getEventListener(eventBind: any, owner: any, data: any, isComponentEvent?: boolean) {
    let args = eventBind.expr.args;
    return function (e: any) {
        e = isComponentEvent ? e :  e || window.event;

        let method = findMethod(owner, eventBind.expr.name, data);
        if (typeof method === 'function') {
            method.apply(
                owner, 
                args.length ? evalArgs(args, new Data({$event: e}, data)) : []
            );
        }   
    };
}
