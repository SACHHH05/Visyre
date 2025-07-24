import easyocr
import cv2
import numpy as np

def contrast_enhanced_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)
    return cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)

def extract_text(img):
    reader = easyocr.Reader(['en'], gpu=False)
    return reader.readtext(img)

if __name__ == "__main__":
    raw_img = cv2.imread("img.jpg")
    enhanced_img = contrast_enhanced_image("img.jpg")

    # Try both
    raw_text = extract_text(raw_img)
    enhanced_text = extract_text(enhanced_img)

    print("\n--- Raw Image Text ---")
    for bbox, text, conf in raw_text:
        if conf > 0.5:
            print(f"{text.strip()} (conf: {conf:.2f})")

    print("\n--- Enhanced Image Text ---")
    for bbox, text, conf in enhanced_text:
        if conf > 0.5:
            print(f"{text.strip()} (conf: {conf:.2f})")
