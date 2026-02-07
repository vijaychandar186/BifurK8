FROM python:3.11-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libreoffice libreoffice-writer \
    fonts-noto \
    ghostscript tesseract-ocr \
    tesseract-ocr-all \
    curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
ENV NAME=DocumentViewer
CMD ["python", "app.py"]
