import Element from './element';
import TextNode from './text-node';

export default function createNode(aNode: any, parent: any, scope: any, owner: any) {
    if (aNode.textExpr) {

    }
    return aNode.hasOwnProperty('textExpr')
        ? new TextNode(aNode, parent, scope, owner)
        : new Element(aNode, parent, scope, owner);
}