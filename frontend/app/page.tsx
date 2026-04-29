"use client";

import { useState } from "react";

// Chart imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [formData, setFormData] = useState({
    sqft: 2000,
    bedrooms: 3,
    bathrooms: 2,
    age: 10,
    neighborhood: "Suburbs",
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (error) {
      alert("Backend error! Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  // Chart Data
  const chartData = {
    labels: ["Sqft", "Bedrooms", "Bathrooms", "Age"],
    datasets: [
      {
        label: "Property Features",
        data: [
          formData.sqft,
          formData.bedrooms,
          formData.bathrooms,
          formData.age,
        ],
        backgroundColor: "#2563eb",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 flex flex-col items-center p-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
        🏠 House Price Predictor
      </h1>

      {/* FORM CARD */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-5">

        {/* INPUT STYLE CLASS */}
        {/* NOTE: strong contrast + focus glow */}

        {/* SQFT */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Living Area (Sqft)
          </label>
          <input
            type="number"
            placeholder="Enter sqft"
            className="w-full p-3 rounded-lg border-2 border-blue-600 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onChange={(e) =>
              setFormData({ ...formData, sqft: Number(e.target.value) })
            }
          />
        </div>

        {/* BEDROOMS */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Bedrooms
          </label>
          <input
            type="number"
            placeholder="Enter bedrooms"
            className="w-full p-3 rounded-lg border-2 border-blue-600 bg-white text-black focus:outline-none focus:ring-4 focus:ring-blue-300"
            onChange={(e) =>
              setFormData({ ...formData, bedrooms: Number(e.target.value) })
            }
          />
        </div>

        {/* BATHROOMS */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Bathrooms
          </label>
          <input
            type="number"
            placeholder="Enter bathrooms"
            className="w-full p-3 rounded-lg border-2 border-blue-600 bg-white text-black focus:outline-none focus:ring-4 focus:ring-blue-300"
            onChange={(e) =>
              setFormData({ ...formData, bathrooms: Number(e.target.value) })
            }
          />
        </div>

        {/* AGE */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            House Age
          </label>
          <input
            type="number"
            placeholder="Enter age"
            className="w-full p-3 rounded-lg border-2 border-blue-600 bg-white text-black focus:outline-none focus:ring-4 focus:ring-blue-300"
            onChange={(e) =>
              setFormData({ ...formData, age: Number(e.target.value) })
            }
          />
        </div>

        {/* NEIGHBORHOOD */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Neighborhood
          </label>
          <select
            className="w-full p-3 rounded-lg border-2 border-blue-600 bg-white text-black focus:outline-none focus:ring-4 focus:ring-blue-300"
            onChange={(e) =>
              setFormData({ ...formData, neighborhood: e.target.value })
            }
          >
            <option value="Suburbs">Suburbs</option>
            <option value="Downtown">Downtown</option>
            <option value="Rural">Rural</option>
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={handlePredict}
          className="bg-blue-700 hover:bg-blue-900 text-white font-bold w-full py-3 rounded-lg shadow-md transition"
        >
          {loading ? "Predicting..." : "🚀 Predict Price"}
        </button>
      </div>

      {/* RESULT */}
      {prediction !== null && (
        <div className="mt-8 bg-yellow-300 text-black px-8 py-6 rounded-2xl shadow-xl text-center">
          <h2 className="text-lg font-semibold">Estimated Property Value</h2>
          <p className="text-3xl font-bold mt-2">
            ₹{prediction.toLocaleString()}
          </p>
        </div>
      )}

      {/* CHART */}
      {prediction !== null && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4 text-blue-900">
            📊 Feature Overview
          </h2>
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
}
// This code defines a React component for a house price prediction app. It includes a form for inputting property features, a button to trigger the prediction, and displays the predicted price along with a bar chart of the input features. The UI is styled using Tailwind CSS for a modern look.