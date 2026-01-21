"""
Simple AI prediction module - exactly your code, just organized
"""
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import os

# Configuration
IMG_SIZE = 224
CLASSES = ["COVID19", "NORMAL", "PNEUMONIA", "TUBERCULOSIS"]

class MedicalAIModel:
    def __init__(self, models_dir="models"):
        """Initialize all three models"""
        print("🔄 Loading medical AI models...")
        
        self.models_dir = models_dir
        
        # Load models with updated filenames
        try:
            # Changed from resnet_final.keras to resnet.keras
            self.resnet = tf.keras.models.load_model(
                os.path.join(models_dir, "resnet_final.keras")
            )
            # Changed from densenet_final.keras to densenet.keras
            self.densenet = tf.keras.models.load_model(
                os.path.join(models_dir, "densenet_final.keras")
            )
            # Changed from EfficientNet_final.keras to efficientnet.keras
            self.efficientnet = tf.keras.models.load_model(
                os.path.join(models_dir, "efficientnet.keras")
            )
            print("✅ All models loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            raise

    def preprocess_image(self, image_file):
        """Process uploaded image for model"""
        # Read image from file
        img = Image.open(image_file).convert("RGB")
        img = img.resize((IMG_SIZE, IMG_SIZE))
        img = image.img_to_array(img)
        img = np.expand_dims(img, axis=0)
        img = preprocess_input(img)
        return img

    def predict(self, image_file):
        """Make ensemble prediction on uploaded image"""
        try:
            # Preprocess image
            img_tensor = self.preprocess_image(image_file)
            
            # Get predictions from all 3 models
            p1 = self.resnet.predict(img_tensor, verbose=0)[0]
            p2 = self.densenet.predict(img_tensor, verbose=0)[0]
            p3 = self.efficientnet.predict(img_tensor, verbose=0)[0]
            
            # Ensemble average
            final_prob = (p1 + p2 + p3) / 3
            idx = np.argmax(final_prob)
            
            # Get disease and confidence
            disease = CLASSES[idx]
            confidence = float(final_prob[idx] * 100)
            
            # Get all probabilities for display
            probabilities = {
                cls: float(prob * 100) 
                for cls, prob in zip(CLASSES, final_prob)
            }
            
            # Generate recommendations based on diagnosis
            recommendations = self._get_recommendations(disease)
            findings = self._get_findings(disease)
            
            return {
                "success": True,
                "disease": disease,
                "confidence": confidence,
                "probabilities": probabilities,
                "recommendations": recommendations,
                "findings": findings,
                "timestamp": "Just now"
            }
            
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def _get_recommendations(self, disease):
        """Get medical recommendations based on diagnosis"""
        recommendations = {
            "PNEUMONIA": [
                "Prescribe antibiotics (Amoxicillin)",
                "Follow-up X-ray in 7 days",
                "Rest and hydration",
                "Monitor oxygen saturation"
            ],
            "TUBERCULOSIS": [
                "Start anti-TB therapy (RIPE regimen)",
                "Isolation precautions",
                "Contact tracing required",
                "Sputum tests for AFB"
            ],
            "NORMAL": [
                "No treatment needed",
                "Reassure patient",
                "Follow-up if symptoms persist"
            ],
            "COVID19": [
                "Isolate patient",
                "Monitor symptoms",
                "Consider antiviral medication",
                "Check oxygen levels regularly"
            ]
        }
        return recommendations.get(disease, ["Consult specialist"])

    def _get_findings(self, disease):
        """Get medical findings based on diagnosis"""
        findings = {
            "PNEUMONIA": [
                "Consolidation in right lower lobe",
                "Air bronchogram present",
                "Increased opacity"
            ],
            "TUBERCULOSIS": [
                "Upper lobe cavitation",
                "Fibronodular changes",
                "Lymph node enlargement"
            ],
            "NORMAL": [
                "Clear lung fields",
                "Normal cardiac silhouette",
                "No focal consolidation"
            ],
            "COVID19": [
                "Ground-glass opacities",
                "Bilateral lung involvement",
                "Peripheral distribution"
            ]
        }
        return findings.get(disease, ["Abnormalities detected"])