export default function insertBefore(targetEl: any, parentEl: any) {
    if (parentEl) {
        parentEl.appendChild(targetEl);
    }
}