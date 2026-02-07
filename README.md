# BifurK8

A text editor with document processing capabilities, OCR support, and PDF export functionality. Built with CKEditor 5, Flask, and Node.js.

## Features

### Rich Text Editing
- CKEditor 5 integration with comprehensive formatting tools
- Multi-tab editing system (up to 5 concurrent tabs)
- Auto-save functionality with localStorage persistence
- Markdown support
- Tables, images, and links

### Document Processing
- File Upload Support: DOC, DOCX, PDF
- OCR Processing: 124+ language support via Tesseract
- Document Conversion: DOCX to PDF using LibreOffice

### Export Options
- PDF Export: Portrait and landscape orientations
- HTML Export: Raw HTML with timestamp
- Import: Load HTML files directly into editor

## Architecture

### Technology Stack

**Frontend:**
- CKEditor 5 (Decoupled Editor)
- Tailwind CSS (CDN)
- Split.js (Resizable panels)
- Vanilla JavaScript (ES6 Modules)

**Backend:**
- Python Flask (Web server)
- Node.js + Express (PDF generation)
- Puppeteer (HTML to PDF conversion)
- Tesseract OCR (Text recognition)
- LibreOffice (Document conversion)

**Infrastructure:**
- Docker Compose (Multi-container orchestration)
- Nginx (Reverse proxy)

### Project Structure

```
text-editor/
├── static/
│   ├── assets/          # Static assets (favicon, etc.)
│   ├── css/
│   │   ├── global.css   # Shadcn theme colors
│   │   └── ckeditor.css # Editor-specific styles
│   ├── js/
│   │   ├── ckeditor/    # CKEditor modules
│   │   │   ├── index.js    # Main initialization
│   │   │   ├── config.js   # Editor configuration
│   │   │   ├── plugins.js  # Plugin imports
│   │   │   ├── tabs.js     # Tab management
│   │   │   └── import.js   # File import
│   │   ├── components/  # UI components
│   │   │   └── sidebar.js
│   │   ├── layout/      # Layout managers
│   │   │   └── split-view.js
│   │   ├── views/       # View controllers
│   │   │   └── viewer.js
│   │   ├── utils/       # Utilities
│   │   │   ├── languages.js  # OCR languages
│   │   │   ├── upload.js     # File upload
│   │   │   └── export.js     # Export functions
│   │   └── main.js      # Entry point
│   └── templates/
│       └── index.html   # Main template
├── pdf-converter/       # Node.js PDF service
│   ├── index.js         # Express server
│   └── Dockerfile
├── nginx/
│   └── nginx.conf       # Reverse proxy config
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── Dockerfile          # Python service
└── docker-compose.yml  # Service orchestration
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vijaychandar186/BifurK8
   cd text-editor
   ```

2. Build and start services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   ```
   http://localhost
   ```

### Services

- nginx: Port 80 (Reverse proxy)
- python-server: Port 5000 (Flask backend)
- node-server: Port 3000 (PDF generation)

## Usage

### Basic Editing

- Create Tabs: Click the `+` button (max 5 tabs)
- Switch Tabs: Click on any tab
- Rename Tabs: Double-click tab name
- Close Tabs: Click the `×` button

### Document Upload

1. Open Settings (gear icon)
2. Choose a file (DOC, DOCX, or PDF)
3. Enable OCR if needed and select language
4. Click Upload

### Export

- PDF Export: Choose orientation (Portrait/Landscape)
- HTML Export: Exports with timestamp
- Import HTML: Load HTML files into editor

## Configuration

### File Size Limits

Default: 100MB (configurable in `app.py` and `nginx.conf`)

### Tab Limits

Default: 5 tabs (configurable in `/static/js/ckeditor/tabs.js`)

### Customization

- Theme Colors: Edit `/static/css/global.css`
- CKEditor Config: Modify `/static/js/ckeditor/config.js`
- OCR Languages: Update `/static/js/utils/languages.js`
- PDF Settings: Configure `/pdf-converter/index.js`

## Troubleshooting

- OCR Not Working: Check `docker-compose logs python-server`
- PDF Export Fails: Check `docker-compose logs node-server`
- Upload Errors: Verify file size limits and allowed extensions
- Tabs Not Persisting: Clear browser localStorage

## Dependencies

- Python: Flask, ocrmypdf
- Node.js: Express, Puppeteer
- Frontend: CKEditor 5, Tailwind CSS, Split.js

## Security

- File uploads validated by extension
- Max file size: 100MB
- No authentication system (add as needed)