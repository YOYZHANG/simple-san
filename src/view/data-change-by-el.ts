export default function isDataChangeByElement(change: any, element: any, propName: string) {
    let changeTarget = change.option.target;
    const isDataChangeByElement = changeTarget!.node === element
        && (!propName || changeTarget.prop === propName);

    return isDataChangeByElement;
}