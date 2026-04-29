import pandas as pd
import numpy as np
import os

def generate_market_data(samples=2000):
    """
    Simulates a housing market with structural and locational correlations.
    """
    np.random.seed(42)
    
    # ---------------------------
    # Structural features
    # ---------------------------
    sqft_living = np.random.normal(1800, 600, samples).clip(400, 6000)
    
    bedrooms = (
        sqft_living / 600 + np.random.randint(0, 2, samples)
    ).astype(int).clip(1, 6)
    
    bathrooms = (
        bedrooms * 0.7 + np.random.normal(0, 0.3, samples)
    ).clip(1, 4).round(1)
    
    year_built = np.random.randint(1950, 2024, samples)
    house_age = 2024 - year_built
    
    # ---------------------------
    # Location influence (FIXED)
    # ---------------------------
    neighborhoods = ["Downtown", "Suburbs", "Rural"]   # ✅ FIX
    
    nb_weights = [1.8, 1.2, 0.7]
    nb_choice = np.random.choice(range(3), samples)
    
    location_multiplier = np.array([nb_weights[i] for i in nb_choice])
    
    # ---------------------------
    # Price calculation
    # ---------------------------
    base_price = 45000
    sqft_value = sqft_living * 145
    room_value = (bedrooms * 12000) + (bathrooms * 15000)
    age_penalty = house_age * 950
    
    final_price = (
        base_price + sqft_value + room_value - age_penalty
    ) * location_multiplier
    
    # Add market noise
    final_price += np.random.normal(0, 20000, samples)
    
    # ---------------------------
    # Create DataFrame
    # ---------------------------
    df = pd.DataFrame({
        "sqft": sqft_living.astype(int),
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "age": house_age,
        "neighborhood": [neighborhoods[i] for i in nb_choice],
        "sale_price": final_price.astype(int)
    })
    
    # ---------------------------
    # Save file
    # ---------------------------
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/synthetic_housing.csv", index=False)
    
    print(f"✅ Successfully generated {samples} records in data/synthetic_housing.csv")


if __name__ == "__main__":
    generate_market_data()
    # ---------------------------