export default function isDataChangeByElement(change, element, propName) {
    let changeTarget = change.option.target;
    const isDataChangeByElement = changeTarget!.node === element
        && (!propName || changeTarget.prop === propName);

    return isDataChangeByElement;
}