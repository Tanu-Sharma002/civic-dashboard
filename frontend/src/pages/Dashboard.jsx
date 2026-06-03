import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AQICard from "../components/AQICard";
import InsightBox from "../components/InsightBox";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);
function Dashboard() {
    const [location, setLocation] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // 🔍 Search
    const handleSearch = async () => {
        if (!location.trim()) {
            alert("Enter location");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `https://civic-dashboard-vicc.onrender.com/api/data?location=${location}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setData(res.data);
        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }

            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };
    // 📍 Detect Current Location
    const detectLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                setLoading(true);
                setError("");

                try {
                    const token = localStorage.getItem("token");

                    const res = await axios.get(
                        `https://civic-dashboard-vicc.onrender.com/api/data?location=${pos.coords.latitude},${pos.coords.longitude}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    setData(res.data);
                } catch (err) {
                    console.error(err);

                    if (err.response?.status === 401) {
                        localStorage.clear();
                        navigate("/login");
                    }

                    setError("Location fetch failed");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                if (err.code === 1) {
                    setError("Location permission denied");
                } else {
                    setError("Unable to get location");
                }
            }
        );
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // 🌫 AQI Label
    function getAQILabel(aqi) {
        switch (aqi) {
            case 1:
                return "Good";
            case 2:
                return "Fair";
            case 3:
                return "Moderate";
            case 4:
                return "Poor";
            case 5:
                return "Very Poor";
            default:
                return "Unknown";
        }
    }

    // 🧠 Smart Insights
    const getInsights = () => {
        if (!data) return [];

        let insights = [];

        if (data.aqi === 1) {
            insights.push("🌿 Air quality is excellent. Enjoy outdoor activities!");
        } else if (data.aqi === 2) {
            insights.push("🙂 Air quality is acceptable.");
        } else if (data.aqi === 3) {
            insights.push("😷 Sensitive people should wear masks.");
            insights.push("🏃 Limit prolonged outdoor exertion.");
        } else if (data.aqi === 4) {
            insights.push("⚠️ Poor air quality.");
            insights.push("😷 Wear a mask outdoors.");
            insights.push("🏠 Stay indoors if possible.");
        } else if (data.aqi === 5) {
            insights.push("🚨 Very poor air quality!");
            insights.push("😷 Avoid going outside.");
            insights.push("🏠 Use air purifiers.");
        }

        if (data.pollution?.pm2_5 > 50) {
            insights.push("⚠️ High PM2.5 levels detected.");
        }

        return insights;
    };

    // 📊 Pollution Chart
    const pollutionChart = data?.pollution && {
        labels: ["PM2.5", "PM10", "CO", "NO2", "O3"],
        datasets: [
            {
                label: "Pollution Levels",
                data: [
                    data.pollution.pm2_5,
                    data.pollution.pm10,
                    data.pollution.co / 100,
                    data.pollution.no2,
                    data.pollution.o3
                ],
                backgroundColor: "rgba(33,150,243,0.6)"
            }
        ]
    };

    // 📈 History Chart
    const historyChart = data?.history?.length && {
        labels: data.history.map((d) => d.date),
        datasets: [
            {
                label: "AQI Trend (7 Days)",
                data: data.history.map((d) => d.aqi),
                borderColor: "#2196f3",
                backgroundColor: "rgba(33,150,243,0.2)",
                tension: 0.4,
                fill: true
            }
        ]
    };

    return (
        <div
            className={`flex min-h-screen transition-all duration-300 ${darkMode
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-black"
                }`}
        >
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex-1 p-4 md:p-6">

                {/* Navbar */}
                <Navbar />

                {/* Controls */}
                <div className="mt-6 flex flex-col lg:flex-row gap-3 items-center">

                    {/* Search Input */}
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                        className="px-4 py-3 rounded-xl border shadow-md w-full lg:w-80 text-black"
                    />

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
                    >
                        Search
                    </button>

                    {/* Current Location */}
                    <button
                        onClick={detectLocation}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition"
                    >
                        My Location
                    </button>

                    {/* Dark Mode */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl shadow-md transition"
                    >
                        {darkMode ? "☀ Light" : "🌙 Dark"}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-md transition"
                    > Logout </button>

                </div>

                {/* Loading */}
                {loading && (
                    <p className="mt-6 text-lg font-semibold">
                        Loading...
                    </p>
                )}

                {/* Error */}
                {error && (
                    <p className="mt-6 text-red-500 font-semibold">
                        {error}
                    </p>
                )}

                {/* DATA */}
                {data && (
                    <div className="mt-8">

                        {/* Title */}
                        <h2 className="text-3xl font-bold mb-6">
                            {data.location}
                        </h2>

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <AQICard
                                title="AQI"
                                value={data.aqi}
                                subtitle={getAQILabel(data.aqi)}
                                color={
                                    data.aqi <= 2
                                        ? "bg-green-500"
                                        : data.aqi === 3
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                }
                            />

                            <AQICard
                                title="Civic Score"
                                value={Math.round(data.civicScore)}
                                subtitle="Environmental Health"
                                color="bg-blue-500"
                            />

                        </div>

                        {/* Insights */}
                        <div className="mt-6">
                            <InsightBox insights={getInsights()} />
                        </div>

                        {/* Coordinates */}
                        <div className={`mt-6 p-5 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                            }`} >

                            <h3 className="text-xl font-bold mb-2"> Coordinates </h3>
                            <p>Latitude: {data.latitude}</p>
                            <p>Longitude: {data.longitude}</p>
                        </div>

                        {/* Pollution Chart */}
                        {pollutionChart && (
                            <div className={`mt-6 p-5 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                                }`} >

                                <h3 className="text-2xl font-bold mb-4">
                                    Pollution Levels
                                </h3>

                                <Bar data={pollutionChart} />

                            </div>
                        )}

                        {/* History Chart */}
                        {historyChart && (
                            <div
                                className={`mt-6 p-5 rounded-2xl shadow-lg ${darkMode
                                    ? "bg-gray-800 text-white"
                                    : "bg-white text-black"
                                    }`}
                            >
                                <h3 className="text-2xl font-bold mb-4">
                                    AQI Trend (7 Days)
                                </h3>

                                <Line data={historyChart} />
                            </div>
                        )}
                        {/* Pollution Table */}
                        {data.pollution && (
                            <div
                                className={`mt-6 overflow-x-auto rounded-2xl shadow-lg p-5 ${darkMode
                                    ? "bg-gray-800 text-white"
                                    : "bg-white text-black"
                                    }`}
                            >
                                <h3 className="text-2xl font-bold mb-4">
                                    🌫 Pollution Details
                                </h3>

                                <table className="w-full border-collapse">

                                    <thead>
                                        <tr className="bg-blue-600 text-white">
                                            <th className="p-3">Pollutant</th>
                                            <th className="p-3">Value</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Object.entries(data.pollution).map(([k, v]) => (
                                            <tr
                                                key={k}
                                                className={`border-b text-center ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                <td className="p-3 font-semibold">
                                                    {k.toUpperCase()}
                                                </td>

                                                <td className="p-3">
                                                    {v}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        )}

                        {/* Map */}
                        <div
                            className={`mt-6 p-5 rounded-2xl shadow-lg ${darkMode
                                ? "bg-gray-800 text-white"
                                : "bg-white text-black"
                                }`}
                        >

                            <h3 className="text-2xl font-bold mb-4">
                                🌍 Location Map
                            </h3>

                            <MapContainer
                                center={[data.latitude, data.longitude]}
                                zoom={10}
                                className="h-[400px] w-full rounded-2xl z-0"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Marker position={[data.latitude, data.longitude]}>
                                    <Popup>
                                        {data.location}
                                        <br />
                                        AQI: {data.aqi}
                                    </Popup>
                                </Marker>

                            </MapContainer>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
export default Dashboard;