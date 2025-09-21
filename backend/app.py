import os
import json
import shutil
import re
from pathlib import Path
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
from dotenv import load_dotenv
import google.generativeai as genai
from flask import send_from_directory

# ---------------- Configuration ---------------- #
app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("[DEBUG] Gemini API key loaded successfully.")
else:
    print("[DEBUG] Warning: GEMINI_API_KEY not found in .env file.")

# Upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
print(f"[DEBUG] Upload folder set to: {UPLOAD_FOLDER}")

# ML Model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    print("[DEBUG] ML model loaded successfully.")
except Exception as e:
    print(f"[DEBUG] Warning: ML model not found or failed to load! {e}")
    model = None

# Feature order and defaults
FEATURE_ORDER = [
    "Haemoglobin", "Packed Cell Volume",
    "RBC Count", "MCV", "MCH", "MCHC", "Platelet Count", "MPV",
    "RDW", "Differential Neutrophils", "Lymphocytes", "Monocytes",
    "Eosinophils", "Basophils"
]

HEALTHY_DEFAULTS = {
    "Haemoglobin": 13.5, "Packed Cell Volume": 45,
    "RBC Count": 5.0, "MCV": 90, "MCH": 30, "MCHC": 34, "Platelet Count": 250000,
    "MPV": 10, "RDW": 13, "Differential Neutrophils": 55, "Lymphocytes": 35,
    "Monocytes": 6, "Eosinophils": 3, "Basophils": 1
}

ALLOWED_EXTENSIONS = {'pdf'}
MAX_FILE_SIZE_MB = 16

# ---------------- Helper Functions ---------------- #
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clear_upload_folder():
    print("[DEBUG] Clearing upload folder...")
    for f in os.listdir(UPLOAD_FOLDER):
        path = os.path.join(UPLOAD_FOLDER, f)
        if os.path.isfile(path) or os.path.islink(path):
            os.unlink(path)
            print(f"[DEBUG] Removed file: {path}")
        elif os.path.isdir(path):
            shutil.rmtree(path)
            print(f"[DEBUG] Removed folder: {path}")

# ---------------- Gemini PDF Extraction ---------------- #
def generate_model_data_from_pdf(pdf_file_path: str):
    if not GEMINI_API_KEY:
        print("[DEBUG] Gemini API key not configured.")
        return None

    try:
        print(f"[DEBUG] Uploading '{pdf_file_path}' to Gemini...")
        uploaded_file = genai.upload_file(path=pdf_file_path)
        print(f"[DEBUG] File uploaded: {uploaded_file.name}")

        prompt = """
You are an expert medical lab report analyst. Extract a JSON array for the following biomarkers:
Haemoglobin, Packed Cell Volume, Total Leucocyte Count (TLC), RBC Count, MCV, MCH, MCHC,
Platelet Count, MPV, RDW, Differential Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils.
Use the last reported value if duplicates exist. Fill missing values with the following defaults:
Haemoglobin: 13.5, Packed Cell Volume: 45, TLC: 7000, RBC Count: 5.0, MCV: 90, MCH: 30,
MCHC: 34, Platelet Count: 250000, MPV: 10, RDW: 13, Differential Neutrophils: 55,
Lymphocytes: 35, Monocytes: 6, Eosinophils: 3, Basophils: 1.
Return JSON with keys: Name, Value, Unit, HealthyRange. No extra text.
        """

        model_gemini = genai.GenerativeModel("gemini-1.5-flash")
        response = model_gemini.generate_content(prompt=prompt, files=[uploaded_file])

        print(f"[DEBUG] Gemini raw response:\n{response.text}")

        raw_text = response.text.strip()
        cleaned_text = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.DOTALL).strip()
        print(f"[DEBUG] Cleaned response text:\n{cleaned_text}")

        try:
            biomarker_data = json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            print("[DEBUG] JSON parse error:", e)
            return None

        features = {}
        for item in biomarker_data:
            name = item.get("Name")
            value = item.get("Value", HEALTHY_DEFAULTS.get(name, 0))
            try:
                features[name] = float(value)
            except (ValueError, TypeError):
                print(f"[DEBUG] Invalid value for {name}: {value}, using default.")
                features[name] = HEALTHY_DEFAULTS.get(name, 0)

        # Fill missing biomarkers with defaults
        for name in FEATURE_ORDER:
            if name not in features:
                features[name] = HEALTHY_DEFAULTS[name]
                print(f"[DEBUG] Missing biomarker {name}, using default: {HEALTHY_DEFAULTS[name]}")

        print(f"[DEBUG] Final extracted features: {features}")
        return features

    except Exception as e:
        print(f"[DEBUG] Gemini extraction failed: {e}")
        return None

# ---------------- Routes ---------------- #
@app.route("/", methods=["GET"])
def home():
    print("[DEBUG] Home route called.")
    return jsonify({"status": "Health Report API running", "timestamp": datetime.now().isoformat()})

@app.route("/upload", methods=["POST"])
def upload():
    print("[DEBUG] Upload route called.")
    if "file" not in request.files:
        print("[DEBUG] No file part in request.")
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "" or not allowed_file(file.filename):
        print(f"[DEBUG] Invalid file: {file.filename}")
        return jsonify({"error": "Invalid file"}), 400

    # Check file size
    file.seek(0, os.SEEK_END)
    size_mb = file.tell() / (1024 * 1024)
    file.seek(0)
    if size_mb > MAX_FILE_SIZE_MB:
        print(f"[DEBUG] File too large: {size_mb} MB")
        return jsonify({"error": "File too large"}), 400

    clear_upload_folder()
    save_path = os.path.join(UPLOAD_FOLDER, "report.pdf")
    file.save(save_path)
    backend_dir = os.path.dirname(__file__)  # C:\Users\singh\OneDrive\Desktop\frontfull\backend

# Target frontend src folder
    frontend_src_dir = os.path.join(backend_dir, "..", "frontend", "src")
    frontend_src_dir = os.path.abspath(frontend_src_dir)  # Converts to absolute path

# Save the uploaded file there
    save_path = os.path.join(frontend_src_dir, "report.pdf")
    file.save(save_path)
    
    print(f"[DEBUG] File saved to: {save_path}")
    return jsonify({"message": "File uploaded", "path": save_path})
@app.route("/features", methods=["GET"])
def get_features():
    features_path = os.path.join(os.path.dirname(__file__), "features.json")
    return send_from_directory(directory=os.path.dirname(features_path), path="features.json")
@app.route("/predict", methods=["GET","POST"])
def predict():
    print("[DEBUG] Predict route called.")
    pdf_path = os.path.join(UPLOAD_FOLDER, "report.pdf")

    if not os.path.exists(pdf_path):
        print("[DEBUG] No PDF files found in upload folder.")
        return jsonify({"error": "No uploaded PDF found"}), 400

    if not model:
        print("[DEBUG] ML model not loaded.")
        return jsonify({"error": "ML model not loaded"}), 500

    # Extract features
    features = generate_model_data_from_pdf(pdf_path)
    if not features:
        print("[DEBUG] Gemini extraction failed or returned None. Using defaults.")
        features = HEALTHY_DEFAULTS.copy()

    # Save features.json
    features_path = os.path.join(BASE_DIR, "features.json")
    try:
        json_data = [{"Name": k, "Value": v} for k, v in features.items()]
        with open(features_path, "w") as f:
            json.dump(json_data, f, indent=2)
        print(f"[DEBUG] Features saved to {features_path}")
    except Exception as e:
        print(f"[DEBUG] Failed to write features.json: {e}")

    # Build feature vector
    feature_vector = [features.get(name, HEALTHY_DEFAULTS.get(name, 0)) for name in FEATURE_ORDER]
    X = np.array(feature_vector).reshape(1, -1)
    print(f"[DEBUG] Feature vector for ML model: {feature_vector}")

    # Predict
    try:
        prediction = model.predict(X)
        pred_class_num = int(prediction[0])
        print(f"[DEBUG] Prediction result (numeric): {pred_class_num}")
    except Exception as e:
        print(f"[DEBUG] Prediction failed: {e}")
        return jsonify({"error": "Prediction failed"}), 500

    # Map numeric prediction to disease name
    class_map = {
        0: 'Acute Bacterial Sepsis',
        1: 'Acute Infection',
        2: 'Allergic Asthma',
        3: 'Anemia (General)',
        4: 'Anemia of Chronic Disease',
        5: 'Aplastic Anemia',
        6: 'Bacterial Infection',
        7: 'Chronic Bacterial Infection',
        8: 'Chronic Viral Infection',
        9: 'Dehydration',
        10: 'Dual Deficiency Anemia',
        11: 'Folate/B12 Deficiency',
        12: 'Healthy',
        13: 'Healthy Status',
        14: 'Hypochromic Anemia',
        15: 'Iron Deficiency Anemia',
        16: 'Iron Deficiency Suspected',
        17: 'Macrocytic Anemia',
        18: 'Megaloblastic Anemia',
        19: 'Myeloproliferative Disorder (v2)',
        20: 'Nutritional Anemia',
        21: 'Pancytopenia',
        22: 'Polycythemia Vera',
        23: 'Secondary Polycythemia',
        24: 'Sepsis',
        25: 'Subacute Infection',
        26: 'Thalassemia Trait',
        27: 'Viral Exanthema',
        28: 'Viral Illness',
        29: 'Viral Suppression',
        30: 'Vitamin B12 Deficiency'
    }

    pred_class_name = class_map.get(pred_class_num, "Unknown")
    print(f"[DEBUG] Prediction result (name): {pred_class_name}")

    return jsonify({
        "prediction_numeric": pred_class_num,
        "prediction_name": pred_class_name,
        "features_saved": features_path,
        "features_used": dict(zip(FEATURE_ORDER, feature_vector))
    })

if __name__ == "__main__":
    print("[DEBUG] Health Report Checker API Starting...")
    app.run(host="0.0.0.0", port=5000, debug=True)