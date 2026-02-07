import os
import subprocess
from flask import Flask, request, render_template, jsonify, send_from_directory
import threading
import time
import json

app = Flask(__name__, template_folder='static/templates')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = "uploads"
app.config['OUTPUT_FOLDER'] = "outputs"
app.config['TASK_STATUS_FOLDER'] = "task_status"

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)
os.makedirs(app.config['TASK_STATUS_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'docx', 'doc', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_task_status(task_id, status, message=""):
    status_file = os.path.join(app.config['TASK_STATUS_FOLDER'], f"{task_id}.json")
    with open(status_file, 'w') as f:
        json.dump({
            'status': status,
            'message': message,
            'timestamp': time.time()
        }, f)

def process_ocr(file_path, languages, task_id):
    try:
        save_task_status(task_id, "processing", "OCR processing in progress...")
        ocrmypdf_command = [
            'ocrmypdf',
            '--language', languages,
            '--force-ocr',
            '--output-type', 'pdf',
            file_path,
            file_path
        ]
        subprocess.run(ocrmypdf_command, check=True)
        save_task_status(task_id, "completed", "OCR processing completed successfully")
    except subprocess.CalledProcessError as e:
        save_task_status(task_id, "failed", f"OCR processing failed: {str(e)}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    document = request.files['file']
    filename = document.filename

    if not allowed_file(filename):
        return jsonify({"error": f"Only {', '.join(ALLOWED_EXTENSIONS)} files are allowed."}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    document.save(file_path)

    ocr_enabled = request.form.get('ocrCheckbox') == 'on'
    languages = request.form.get('languages', 'eng').strip() or 'eng'

    if filename.endswith('.pdf'):
        if ocr_enabled:
            task_id = f"task_{int(time.time())}"
            thread = threading.Thread(target=process_ocr, args=(file_path, languages, task_id))
            thread.start()
            return jsonify({
                "task_id": task_id,
                "status": "processing",
                "message": "OCR processing started",
                "html_url": f"/uploads/{filename}"
            })
        return jsonify({"html_url": f"/uploads/{filename}"})

    if filename.endswith('.doc') or filename.endswith('.docx'):
        output_pdf = os.path.join(app.config['OUTPUT_FOLDER'], filename.rsplit('.', 1)[0] + '.pdf')
        try:
            convert_command = [
                'soffice',
                '--headless',
                '--convert-to', 'pdf:writer_pdf_Export',
                '--outdir', app.config['OUTPUT_FOLDER'],
                file_path
            ]
            subprocess.run(convert_command, check=True)
        except subprocess.CalledProcessError as e:
            return jsonify({"error": f"Error converting to PDF: {str(e)}"}), 500
        return jsonify({"html_url": f"/outputs/{filename.rsplit('.', 1)[0]}.pdf"})

    return jsonify({"error": "Unsupported file format for processing."}), 400

@app.route('/task-status/<task_id>')
def task_status(task_id):
    status_file = os.path.join(app.config['TASK_STATUS_FOLDER'], f"{task_id}.json")
    if not os.path.exists(status_file):
        return jsonify({"error": "Task not found"}), 404
    with open(status_file, 'r') as f:
        status = json.load(f)
    return jsonify(status)

@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/outputs/<filename>')
def serve_output(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')