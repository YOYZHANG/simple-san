export default function changesIsInDataRef(changes: any[], dataRef: []) {
    if (dataRef) {
        for (var i = 0; i < changes.length; i++) {
            let change = changes[i];
            let paths = change.expr.paths;
            change.overview = paths[0].value;

            if (dataRef[change.overview]) {
                return true;
            }
        }
    }
}