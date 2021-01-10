export default function insertBefore(targetEl, parentEl) {
    if (parentEl) {
        parentEl.appendChild(targetEl);
    }
}