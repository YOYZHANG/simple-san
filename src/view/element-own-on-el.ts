import on from '../dom/on';

export default function(el: any, name: string, listener: any, capture: any) {
    on(el, name, listener, !!capture);
}