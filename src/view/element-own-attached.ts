import addEventListener from './element-own-on-el';
import getEventListener from './get-event-listener';
export default function elementOwnAttached() {
    if (this.rootNode) {
        return;
    }
    
    var owner = this;
    for (var i = 0, l = this.aNode.events.length; i < l; i++) {
        var eventBind = this.aNode.events[i];
        let el = this.el;
        addEventListener(
            el,
            eventBind.name,
            getEventListener(eventBind, owner, this.data, eventBind.modifier),
            eventBind.modifier.capture
        );
    }
}