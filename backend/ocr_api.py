from flask import Flask, request, jsonify
import easyocr
import cv2
import numpy as np
import os

app = Flask(__name__)
reader = easyocr.Reader(['en'], gpu=False)

def enhance_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)
    return cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)

def extract_text(image):
    results = reader.readtext(image)
    extracted = []
    for bbox, text, conf in results:
        if conf > 0.5:
            extracted.append({
                "text": text.strip(),
                "confidence": round(conf, 2)
            })
    return extracted

@app.route("/", methods=["GET"])
def home():
    return "OCR API is running. Use POST /extract_text to upload an image."

@app.route("/extract_text", methods=["POST"])
def ocr_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    file_path = "img.jpg"
    file.save(file_path)

    # Read and enhance
    image = cv2.imread(file_path)
    enhanced = enhance_image(image)

    # Extract from both
    raw_results = extract_text(image)
    enhanced_results = extract_text(enhanced)
    
    return jsonify({
        "raw_results": raw_results,
        "enhanced_results": enhanced_results
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
