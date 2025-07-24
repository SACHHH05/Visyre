# Visyre

A mobile-friendly full-stack app that lets users **upload an image** and extracts **text** from it using OCR. Built with a clean mobile UI.

---

##  Features
- Upload an image (camera or gallery)
- Extract printed or handwritten text using (EasyOCR)
- Simple, fast, mobile-friendly UI (React Native with Expo)
- Backend built with Flask + OpenCV

---

## Tech Stack
| Part | Tech |
|------|------|
| Frontend | React Native (Expo) |
| Backend | Flask |
| OCR Engine | EasyOCR + OpenCV |
| Language | Python + JavaScript |

---

## Setup Instructions

### Frontend (Expo)
```bash
cd frontend
npm install
npx expo start
```
---
### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
----
