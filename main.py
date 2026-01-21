"""
FastAPI Backend - Simple and Minimal
"""
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