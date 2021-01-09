class Data {
    public parent;
    public raw;
    public listeners: [];
    constructor(data, parent) {
        this.parent = parent;
        this.raw = data || {};
        this.listeners = [];
    }

    public get(expr: string | Object, callee?: any) {
        let value = this.raw[expr];
        return value;
    }

    public set(expr, value) {
        // 赋值操作
        this.raw[expr] = value;
        // 派发事件
        this.fire({
            type: DataChangeType.SET,
            expr: expr,
            value: value
        });
    }


    public listen(listener) {
        if (typeof listener === 'function') {
            this.listeners.push(listener);
        }
    }

    public fire(change) {
        for (let listener of this.listeners) {
            listener.call(this, change);
        }
    }
}