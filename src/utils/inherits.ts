export default function inherits(subClass: any, superClass: any) {
    /* jshint -W054 */
    var subClassProto = subClass.prototype;
    var F = new Function();
    F.prototype = superClass.prototype;
    // @ts-ignore
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    for (var key in subClassProto) {
        /* istanbul ignore else  */
        if (subClassProto.hasOwnProperty(key)) {
            var value = subClassProto[key];
            if (typeof value !== 'undefined') {
                subClass.prototype[key] = value;
            }
        }
    }
}