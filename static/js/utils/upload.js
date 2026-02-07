async function checkTaskStatus(taskId, htmlUrl, spinner) {
    try {
        const statusResponse = await fetch(`/task-status/${taskId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === "processing") {
            setTimeout(() => checkTaskStatus(taskId, htmlUrl, spinner), 2000);
        } else if (statusData.status === "completed") {
            spinner.style.display = 'none';
            const contentContainer = window.getOrCreateViewerContainer();
            window.displayPDF(contentContainer, htmlUrl);
            localStorage.setItem('viewerContentUrl', htmlUrl);
        } else if (statusData.status === "failed") {
            spinner.style.display = 'none';
            await showAlert("OCR processing failed: " + statusData.message, "OCR Failed");
        }
    } catch (error) {
        console.error("Error checking OCR status:", error);
        spinner.style.display = 'none';
        await showAlert("Error checking OCR status. Please refresh the page.", "Status Check Error");
    }
}

async function handleFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const ocrCheckbox = document.getElementById('ocr-checkbox').checked;
    const formData = new FormData();

    if (fileInput.files.length === 0) {
        await showAlert("Please select a file to upload.", "No File Selected");
        return;
    }

    formData.append('file', fileInput.files[0]);
    formData.append('ocrCheckbox', ocrCheckbox ? 'on' : 'off');
    const ocrLanguages = document.getElementById('ocr-languages').value.trim() || 'eng';
    formData.append('languages', ocrLanguages);

    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'flex';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            const contentContainer = window.getOrCreateViewerContainer();

            if (result.task_id && result.html_url.endsWith('.pdf')) {
                checkTaskStatus(result.task_id, result.html_url, spinner);
            } else {
                window.displayContent(result.html_url);
                spinner.style.display = 'none';

                if (result.html_url.endsWith('.html')) {
                    location.reload();
                }
            }
        } else {
            spinner.style.display = 'none';
            await showAlert(result.error || "Failed to upload and process the document.", "Upload Failed");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        spinner.style.display = 'none';
        await showAlert("An error occurred while uploading the file. Please try again.", "Upload Error");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload-button');
    if (uploadButton) {
        uploadButton.addEventListener('click', handleFileUpload);
    }
});
