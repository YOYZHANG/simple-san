export const CompareResult = {
    NO_RELATION: 0,
    PARENT: 1,
    EQUAL: 2,
    CHILD: 3
};

/**
 *
 * 比较变更表达式与目标表达式之间的关系，用于视图更新判断
 * 视图更新需要根据其关系，做出相应的更新行为
 *
 * 0: 完全没关系
 * 1: 变更表达式是目标表达式的母项(如a与a.b) 或 表示需要完全变化
 * 2: 变更表达式是目标表达式相等
 * >2: 变更表达式是目标表达式的子项，如a.b.c与a.b 
 * 
 * @param changeExpr 
 * @param expr 
 */
export function changeExprCompare(changeExpr: any, expr: any) {
    const paths = expr.paths;
    const pathsLen = paths.length;
    const changePaths = changeExpr.paths;
    const changeLen = changePaths.length;
    for (let i = 0; i < pathsLen; i++) {
        let path = paths[i];
        let changePath = changePaths[i];
        if (changePath !== path) {
            if (changePath === undefined) {
                return CompareResult.PARENT;
            }

            return CompareResult.NO_RELATION;

        }
    }
    if (changeLen > pathsLen) {
        return CompareResult.CHILD;
    }
    return CompareResult.EQUAL;

}