export const DEFAULT_FILTERS = {
    _xclass: function(outer: string | [], inner?: any): any {
        if (outer instanceof Array) {
            outer = outer.join(' ');
        }

        if (outer) {
            if (inner) {
                return inner + ' ' + outer;
            }

            return outer;
        }

        return inner;
    }

} as {[key: string]: any}