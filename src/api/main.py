from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os

from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# Initialize FastAPI
# -----------------------------
app = FastAPI()

# -----------------------------
# Enable CORS (IMPORTANT)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load Model
# -----------------------------
MODEL_PATH = "models/house_predictor.joblib"

if not os.path.exists(MODEL_PATH):
    print("❌ Model file not found!")
    model = None
else:
    try:
        model = joblib.load(MODEL_PATH)
        print("✅ Model loaded successfully")
    except Exception as e:
        print("❌ Error loading model:", e)
        model = None

# -----------------------------
# Input Schema
# -----------------------------
class HouseData(BaseModel):
    sqft: int
    bedrooms: int
    bathrooms: float
    age: int
    neighborhood: str

# -----------------------------
# Health Check Route
# -----------------------------
@app.get("/health")
def health():
    return {"status": "API is running"}

# -----------------------------
# Home Route (optional)
# -----------------------------
@app.get("/")
def home():
    return {"message": "House Price Prediction API Running"}

# -----------------------------
# Prediction Route
# -----------------------------
@app.post("/predict")
def predict(data: HouseData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Convert input to DataFrame
        input_df = pd.DataFrame([{
            "sqft": data.sqft,
            "bedrooms": data.bedrooms,
            "bathrooms": data.bathrooms,
            "age": data.age,
            "neighborhood": data.neighborhood
        }])

        # Predict
        prediction = model.predict(input_df)

        # ✅ FIX: Extract value from array
        pred_value = float(prediction[0])

        return {
            "prediction": round(pred_value, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {str(e)}")
    
    # ✅ FIX: Ensure we return a valid response even if something goes wrong