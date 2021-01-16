export default function on (el: any, eventName: any, listener: any, capture: any) {
    el.addEventListener(eventName, listener, capture);
}