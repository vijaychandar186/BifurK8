const SIDEBAR_CONFIG = {
    title: "Configurations",
    sections: [
        {
            id: "upload",
            title: "Upload File",
            icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>`,
            collapsed: true,
            items: [
                {
                    type: "file-input",
                    id: "file-upload",
                    label: "Choose file",
                    accept: "*"
                },
                {
                    type: "button",
                    id: "upload-button",
                    label: "Upload",
                    variant: "primary",
                    onClick: "handleUpload"
                }
            ]
        },
        {
            id: "ocr",
            title: "OCR",
            icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
            collapsed: true,
            items: [
                {
                    type: "checkbox",
                    id: "ocr-checkbox",
                    label: "Enable OCR"
                },
                {
                    type: "multi-select-search",
                    id: "ocr-languages",
                    label: "OCR Languages (Select Multiple)",
                    placeholder: "Search languages..."
                }
            ]
        },
        {
            id: "pdf-export",
            title: "PDF Export",
            icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`,
            collapsed: true,
            items: [
                {
                    type: "radio-group",
                    name: "pdf-view",
                    options: [
                        { id: "portrait", value: "portrait", label: "Portrait" },
                        { id: "landscape", value: "landscape", label: "Landscape", checked: true }
                    ]
                }
            ]
        },
        {
            id: "export-import",
            title: "Export/Import",
            icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>`,
            collapsed: true,
            items: [
                {
                    type: "button",
                    label: "Import HTML File",
                    onClick: "importRawFile",
                    variant: "secondary"
                },
                {
                    type: "button",
                    label: "Export HTML File",
                    onClick: "exportRawFile",
                    variant: "secondary"
                },
                {
                    type: "button",
                    label: "Export PDF",
                    onClick: "exportToPDF",
                    variant: "secondary"
                }
            ]
        }
    ]
};

// Export for use in other files
window.SIDEBAR_CONFIG = SIDEBAR_CONFIG;
