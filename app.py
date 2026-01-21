from fastapi import FastAPI, File, UploadFile
import tensorflow as tf
import numpy as np
import os
import requests
import zipfile
from PIL import Image
import io

app = FastAPI()

# ===============================
# MODEL DOWNLOAD CONFIG
# ===============================
MODEL_DIR = "models"
MODEL_ZIP_PATH = "models/resnet_final.zip"
MODEL_FILE_PATH = "models/resnet_final.keras"

MODEL_URL = "https://drive.google.com/uc?export=download&id=1qIKWggK9hm66SoEhWNe1qEToCbQfgUN5"

# ===============================
# DOWNLOAD & EXTRACT MODEL
# ===============================
if not os.path.exists(MODEL_FILE_PATH):
    os.makedirs(MODEL_DIR, exist_ok=True)
    print("⬇️ Downloading model from Google Drive...")

    response = requests.get(MODEL_URL)
    with open(MODEL_ZIP_PATH, "wb") as f:
        f.write(response.content)

    print("📦 Extracting model...")
    with zipfile.ZipFile(MODEL_ZIP_PATH, "r") as zip_ref:
        zip_ref.extractall(MODEL_DIR)

    os.remove(MODEL_ZIP_PATH)
    print("✅ Model ready!")

# ===============================
# LOAD MODEL
# ===============================
print("🔄 Loading ResNet model...")
model = tf.keras.models.load_model(MODEL_FILE_PATH)
print("✅ Model loaded successfully")

# ===============================
# ROUTES
# ===============================
@app.get("/")
def root():
    return {"message": "ThoraxSense API Running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))

    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    result = np.argmax(prediction)

    labels = ["Normal", "Pneumonia", "Tuberculosis"]

    return {
        "prediction": labels[result]
    }


from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from predict import MedicalAIModel
import os

# Initialize FastAPI app
app = FastAPI(
    title="Medical Diagnosis API",
    description="AI-powered chest X-ray diagnosis",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI model
try:
    ai_model = MedicalAIModel(models_dir="models")
except Exception as e:
    print(f"⚠️ Failed to load models: {e}")
    ai_model = None

@app.get("/")
async def root():
    return {"message": "Medical Diagnosis API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "models_loaded": ai_model is not None}

@app.post("/api/predict")
async def predict_xray(file: UploadFile = File(...)):
    """Upload X-ray image and get AI diagnosis"""
    
    if ai_model is None:
        raise HTTPException(status_code=500, detail="AI models not loaded")
    
    # Check if file is an image
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Get prediction
        result = ai_model.predict(file.file)
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Prediction failed"))
        
        return JSONResponse(content=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    finally:
        file.file.close()

@app.get("/api/recent-scans")
async def get_recent_scans():
    """Get recent scan history (simplified - in real app, use database)"""
    # Mock data for now - replace with database in production
    return [
        {
            "date": "2024-01-15",
            "patient": "PT-00123",
            "diagnosis": "PNEUMONIA",
            "confidence": "87%"
        },
        {
            "date": "2024-01-14",
            "patient": "PT-00119",
            "diagnosis": "NORMAL",
            "confidence": "92%"
        }
    ]

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True

    )
