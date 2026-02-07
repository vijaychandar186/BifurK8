function getOrCreateViewerContainer() {
    const viewer = document.querySelector('.viewer');
    let contentContainer = viewer.querySelector('.viewer-content');

    if (!contentContainer) {
        contentContainer = document.createElement('div');
        contentContainer.className = 'viewer-content';
        viewer.appendChild(contentContainer);
    }

    return contentContainer;
}

function displayPDF(contentContainer, url) {
    contentContainer.innerHTML = `
        <object class="pdf"
                data="${url}"
                type="application/pdf"
                width="100%"
                height="100%">
            <p>The requested URL was not found on the server. Please upload the file again.</p>
        </object>`;
}

function displayIframe(contentContainer, url) {
    let iframe = contentContainer.querySelector('iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        contentContainer.appendChild(iframe);
    }
    iframe.src = url;
}

function displayContent(url) {
    const contentContainer = getOrCreateViewerContainer();

    if (url.endsWith('.pdf')) {
        displayPDF(contentContainer, url);
    } else {
        displayIframe(contentContainer, url);
    }

    localStorage.setItem('viewerContentUrl', url);
}

function restoreViewerContent() {
    const savedViewerContentUrl = localStorage.getItem('viewerContentUrl');
    if (savedViewerContentUrl) {
        displayContent(savedViewerContentUrl);
    }
}

window.addEventListener('load', restoreViewerContent);

window.displayContent = displayContent;
window.getOrCreateViewerContainer = getOrCreateViewerContainer;
window.displayPDF = displayPDF;
