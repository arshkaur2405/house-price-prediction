import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import matplotlib.pyplot as plt

model = model_pipeline.named_steps['model']
features = model_pipeline.named_steps['preprocessor'].get_feature_names_out()

importances = model.feature_importances_

plt.figure(figsize=(10,5))
plt.barh(features, importances)
plt.title("Feature Importance")
plt.savefig("outputs/feature_importance.png")


def execute_training():
    # ---------------------------
    # Load dataset
    # ---------------------------
    df = pd.read_csv('data/synthetic_housing.csv')

    X = df.drop('sale_price', axis=1)
    y = df['sale_price']

    # ---------------------------
    # Feature groups
    # ---------------------------
    numeric_features = ['sqft', 'bedrooms', 'bathrooms', 'age']
    categorical_features = ['neighborhood']

    # ---------------------------
    # Preprocessing (FIXED)
    # ---------------------------
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ]
    )

    # ---------------------------
    # Model
    # ---------------------------
    regressor = RandomForestRegressor(
        n_estimators=150,
        max_depth=12,
        random_state=42,
        n_jobs=-1
    )

    # ---------------------------
    # Pipeline
    # ---------------------------
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', regressor)
    ])

    # ---------------------------
    # Train-test split
    # ---------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("🚀 Training Random Forest model...")
    model_pipeline.fit(X_train, y_train)

    # ---------------------------
    # Evaluation
    # ---------------------------
    predictions = model_pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print(f"\n📊 Model Performance:")
    print(f"MAE: ₹{mae:,.2f}")
    print(f"R2 Score: {r2:.4f}")

    # ---------------------------
    # Save model
    # ---------------------------
    os.makedirs('models', exist_ok=True)

    joblib.dump(model_pipeline, 'models/house_predictor.joblib')

    print("\n✅ Model saved at: models/house_predictor.joblib")


if __name__ == "__main__":
    execute_training()
    # ---------------------------