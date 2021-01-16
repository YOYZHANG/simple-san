/**
 * @file 预热
 */

import TextNode from './text-node';
import ForNode from './for-node';
import createEl from '../dom/create-el'; 
import {ExprType} from '../parser/expr-type';
import getPropHandler from './get-prop-handler';

export default function preheatAnode(aNode: any) {
    let stack: any = [];

    if(aNode) {
        analyseANodeHotspot(aNode, stack);
    }

}

/* aNode格式：
aNode = {
    hotspot: {
        dynamicProps: [],
        xProps: [],
        props: {},
        binds: [{
            name,
            expr,
            x,
            noValue
        }],
        sourceNode: sourceNode,
        getForKey
    },
    Clazz,
    directives: {
        for: {
            value,
            trackBy,
            trackByRaw,
            item
        }
    },
    elses: [

    ],
    children: []
    
} */ 
function analyseANodeHotspot(aNode: any, stack: any[]) {
    if (!aNode.hotspot) {
        stack.push(aNode);

        if (aNode.textExpr) {
            aNode.hotspot = {};
            aNode.Clazz = TextNode;
            recordHotspotData(aNode.textExpr, stack);
        }
        else {
            let sourceNode: any;
            if (aNode.tagName) {
                sourceNode = createEl(aNode.tagName);
            }

            aNode.hotspot = {
                dynamicProps: [],
                xProps: [],
                props: {},
                binds: [],
                sourceNode: sourceNode
            };

            aNode.props.forEach((prop: { name: any; noValue: any; expr: any; x: any; }) => {
                aNode.hotspot.binds.push({
                    name: prop.name,
                    expr: prop.noValue != null
                        ? {type: ExprType.BOOL, value: true}
                        : prop.expr,
                    x: prop.x,
                    noValue: prop.noValue
                });
                recordHotspotData(prop.expr, stack);
            });



            for (let key in aNode.directives) {
                if (aNode.directives.hasOwnProperty(key)) {
                    let directive = aNode.directives[key];
                    recordHotspotData(directive.value, stack, !/^(html|bind)$/.test(key));

                    initTrackByFunction(key, directive, aNode);
                }
            }

            aNode.elses && aNode.elses.forEach((child: any) => {
                analyseANodeHotspot(child, stack);
            });

            aNode.children && aNode.children.forEach((child: any) => {
                analyseANodeHotspot(child, stack);
            });

            // ------data analyse end

            // ------props start

            aNode.props.forEach((prop: any, index: any) => {
                aNode.hotspot.props[prop.name] = index;
                prop.handler = getPropHandler(aNode.tagName, prop.name);

                if (prop.expr.value !=null) {
                    if (sourceNode) {
                        prop.handler(sourceNode, prop.expr.value, prop.name, aNode);
                    }
                }

            });

            if (aNode.directives['for']) {
                aNode.forRinsed = {
                    children: aNode.children,
                    props: aNode.props,
                    events: aNode.events,
                    tagName: aNode.tagName,
                    vars: aNode.vars,
                    hotspot: aNode.hotspot,
                    directives: Object.assign({}, aNode.directives)
                }

                aNode.hotspot.hasRootNode = true;
                aNode.Clazz = ForNode;
                // 这个捏
                aNode.forRinsed.directives['for'] = null;
                aNode = aNode.forRinsed;
            }
        }

        stack.pop();
    }
}

function recordHotspotData(expr: any, stack: any, notContentData?: boolean) {
    let refs = analyseExprDataHotspot(expr);

    if (refs.length) {
        // ? 这里为什么要为stack里的每一项都赋值 data
        for (var i = 0, len = stack.length; i < len; i++) {
            if (!notContentData || i !== len - 1) {
                let data = stack[i].hotspot.data;
                if (!data) {
                    data = stack[i].hotspot.data = {};
                }

                refs.forEach(ref => {
                    data[ref] = 1;
                });

            }
        }
    }
}

function analyseExprDataHotspot(expr: any, accessorMeanDynamic?: boolean) {
    let refs: any[] = [];
    let isDynamic: boolean;

    function analyseExprs(exprs: any, accessorMeanDynamic?: boolean) {
        for (var i = 0; i < exprs.length; i++) {
            refs = refs.concat(analyseExprDataHotspot(exprs[i], accessorMeanDynamic));
            isDynamic = isDynamic || exprs[i].dynamic;
        }
    }

    switch (expr.type) {
        case ExprType.TEXT:
            analyseExprs(expr.segs, accessorMeanDynamic);
            break;
    }

    // 这里若子节点有变化，那么根节点的dynamic就为true
    isDynamic && (expr.dynamic = true);

    // 这个refs是做什么的呢？
    return refs;
}


function initTrackByFunction(key: string, directive: any, aNode: any) {
    if (key === 'for') {
        let trackBy = directive.trackBy;
        if (trackBy 
            && trackBy.type === ExprType.ACCESSOR
            && trackBy.paths[0].value === directive.item
        ) {
            aNode.hotspot.getForKey = new Function(
                directive.item,
                'return' + directive.trackByRaw
            )
        }

    }
}
