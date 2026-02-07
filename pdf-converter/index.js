const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.text({ type: 'text/html', limit: '50mb' }));

function getTimestamp() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function getViewportDimensions(orientation) {
    return {
        width: orientation === 'landscape' ? 1687 : 1192,
        height: orientation === 'landscape' ? 1192 : 1687,
    };
}

function getStyleContent(orientation) {
    return `
        @page {
            margin-bottom: 12mm;
            margin-top: 3mm;
            size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
        }

        body {
            margin: 0;
            padding: 0;
            width: 100%;
            box-sizing: border-box;
        }

        .content-wrapper {
            box-sizing: border-box;
            width: 100%;
        }

        table {
            table-layout: auto;
            border-collapse: collapse !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        th, td {
            border: 1px solid black;
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            overflow: hidden;
        }

        th {
            background-color: #f2f2f2;
        }
    `;
}

async function applyPageStyles(page) {
    await page.evaluate(() => {
        document.querySelectorAll('figure').forEach(fig => fig.style.width = '');
        document.querySelectorAll('.marker-yellow').forEach(el => el.style.backgroundColor = '#FFFF99');
        document.querySelectorAll('.marker-green').forEach(el => el.style.backgroundColor = '#CCFFCC');
        document.querySelectorAll('.marker-pink').forEach(el => el.style.backgroundColor = '#FFCCEB');
        document.querySelectorAll('.marker-blue').forEach(el => el.style.backgroundColor = '#CCFFFF');
        document.querySelectorAll('.pen-red').forEach(el => {
            el.style.color = 'red';
            el.style.backgroundColor = 'transparent';
        });
        document.querySelectorAll('.pen-green').forEach(el => {
            el.style.color = 'green';
            el.style.backgroundColor = 'transparent';
        });
    });
}

async function wrapContent(page) {
    await page.evaluate(() => {
        const body = document.body;
        const wrapper = document.createElement('div');
        wrapper.className = 'content-wrapper';
        while (body.firstChild) {
            wrapper.appendChild(body.firstChild);
        }
        body.appendChild(wrapper);
    });

    await page.evaluate(() => {
        document.querySelectorAll('.ck-widget__selection-handle, .ck-fake-selection-container, .ck-widget__type-around, .ck-icon__selected-indicator, .ck-table-column-resizer').forEach(el => el.remove());
    });
}

async function generatePDF(htmlContent, orientation = 'portrait') {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setViewport(getViewportDimensions(orientation));
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        await applyPageStyles(page);
        await page.addStyleTag({ content: getStyleContent(orientation) });
        await wrapContent(page);

        await page.evaluate(() => {
            document.title = 'BifurK8 Export';
        });

        const timestamp = getTimestamp();

        const pdfOptions = {
            format: 'A4',
            printBackground: true,
            margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
            landscape: orientation === 'landscape',
            displayHeaderFooter: true,
            footerTemplate: `
                <div style="font-size:10px; width:100%; padding:0 10mm; position:relative; box-sizing: border-box;">
                    <span style="float:left;">${timestamp}</span>
                    <span style="position:absolute; left:50%; transform:translateX(-50%);">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
                </div>
            `,
            headerTemplate: '<div></div>',
        };

        const pdfBuffer = await page.pdf(pdfOptions);
        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

app.post('/generate-pdf', async (req, res) => {
    try {
        const pdfBuffer = await generatePDF(req.body, req.query.orientation);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
