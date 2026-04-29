"use client";

import { useState } from "react";

export default function PredictionDashboard() {
  // ✅ MISSING STATE (this was causing most errors)
  const [formData, setFormData] = useState({
    sqft: 2000,
    bedrooms: 3,
    bathrooms: 2,
    age: 10,
    neighborhood: "Suburbs",
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED FUNCTION
  const handleValuation = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error(error);
      alert("Backend not working");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>House Price Prediction</h1>

      {/* SQFT */}
      <input
        type="number"
        value={formData.sqft}
        onChange={(e) =>
          setFormData({ ...formData, sqft: Number(e.target.value) })
        }
      />

      {/* BEDROOMS */}
      <input
        type="number"
        value={formData.bedrooms}
        onChange={(e) =>
          setFormData({ ...formData, bedrooms: Number(e.target.value) })
        }
      />

      {/* BATHROOMS */}
      <input
        type="number"
        value={formData.bathrooms}
        onChange={(e) =>
          setFormData({ ...formData, bathrooms: Number(e.target.value) })
        }
      />

      {/* AGE */}
      <input
        type="number"
        value={formData.age}
        onChange={(e) =>
          setFormData({ ...formData, age: Number(e.target.value) })
        }
      />

      {/* LOCATION */}
      <select
        value={formData.neighborhood}
        onChange={(e) =>
          setFormData({ ...formData, neighborhood: e.target.value })
        }
      >
        <option value="Suburbs">Suburbs</option>
        <option value="Downtown">Downtown</option>
        <option value="Rural">Rural</option>
      </select>

      <br /><br />

      {/* BUTTON */}
      <button onClick={handleValuation}>
        {loading ? "Loading..." : "Predict"}
      </button>

      {/* RESULT */}
      <h2>
        Prediction:{" "}
        {prediction !== null ? `₹${prediction}` : "No prediction yet"}
      </h2>
    </div>
  );
}
// This code defines a React component for a house price prediction app. It includes a form for inputting property features, a button to trigger the prediction, and displays the predicted price along with a bar chart of the input features. The UI is styled using Tailwind CSS for a modern look.
// ......