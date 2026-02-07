function initializeSplitView() {
    Split(['.viewer', '.editor'], {
        sizes: [42, 58],
        minSize: 200,
        gutterSize: 5,
        cursor: 'col-resize'
    });
}

window.addEventListener('DOMContentLoaded', initializeSplitView);
