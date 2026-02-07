function generateTimestamp() {
    const now = new Date();
    return now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '-' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');
}

function downloadFile(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

async function exportToPDF() {
    const editorContent = document.getElementById("editor").innerHTML;
    const orientation = document.querySelector('input[name="pdf-view"]:checked').value;

    const activeTabElement = document.querySelector(".tab.active-tab .tab-name");
    const activeTabName = activeTabElement ? activeTabElement.textContent.trim() : "Untitled";
    const fileName = `${activeTabName}_export.pdf`;

    try {
        const response = await fetch("/generate-pdf?orientation=" + orientation, {
            method: "POST",
            headers: { "Content-Type": "text/html" },
            body: editorContent
        });

        if (response.ok) {
            const blob = await response.blob();
            downloadFile(blob, fileName);
        } else {
            console.error("Failed to generate PDF:", response.statusText);
        }
    } catch (error) {
        console.error("Error while generating PDF:", error);
    }
}

async function exportRawFile() {
    const editorContent = document.getElementById("editor").innerHTML;

    try {
        const timestamp = generateTimestamp();
        const blob = new Blob([editorContent], { type: "text/html" });
        downloadFile(blob, `RAW-${timestamp}.html`);
    } catch (error) {
        console.error("Error while exporting raw file:", error);
    }
}

window.exportToPDF = exportToPDF;
window.exportRawFile = exportRawFile;