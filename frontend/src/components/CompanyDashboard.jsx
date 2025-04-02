import { ThemeContext } from "@/ThemeContext";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { MoonIcon, SunIcon, RefreshCwIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./shared/Navbar";

const CompanyDashboard = () => {
  const { id } = useParams();
  const { theme, toggleTheme } = useContext(ThemeContext)
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompany = async () => {
    try {
      setLoading(true)
      setError(null);
      const response = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, { withCredentials: true });
      setCompany(response.data.company);
    } catch (err) {
      setError("Failed to fetch company data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompany()
    }
  }, [id]);

  return (
    <>
      <Navbar />

      <div
        className={`min-h-screen p-6 flex items-center justify-center transition-all ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-semibold">Company Dashboard</h1>
            <button
              className="p-2 rounded-lg bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 transition"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
          </div>

          {(loading || !company) && (
            <div className="animate-fadeIn">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
              <p className="mt-4 text-lg text-center">Jo paryant loading hot naahi to paryant... ⏳</p>
              <div className="mt-6 space-y-4">
                <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={fetchCompany}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <RefreshCwIcon className="w-5 h-5" />
                Retry
              </button>
            </div>
          )}

          {company && !loading && !error && (
            <div className={`p-6 rounded-lg shadow-md animate-fadeIn ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-xl font-bold">{company.name}</h2>
              <p className="text-gray-500">{company.description || "No description available"}</p>
              <p className="mt-2">📍 Location: {company.location || "Unknown"}</p>
              {company.website && (
                <p className="mt-2">
                  🌐 Website:{" "}
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {company.website}
                  </a>
                </p>
              )}
              {company.logo && <img src={company.logo} alt="Company Logo" className="mt-4 w-24 h-24 rounded-lg" />}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyDashboard;
