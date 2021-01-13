export default function nodeOwnCreateStump() {
    this.el = this.el || document.createComment(this.id);
}