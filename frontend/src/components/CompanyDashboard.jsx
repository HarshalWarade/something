import { ThemeContext } from "@/ThemeContext";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { MoonIcon, SunIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./shared/Navbar";

const CompanyDashboard = () => {
  const { id } = useParams();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        setCompany(response.data.company);
      } catch (err) {
        setError("Failed to fetch company data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <div
          className={`flex items-center justify-center min-h-screen ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
            <p className="mt-4 text-lg">
              Jo paryant loading hot naahi to paryant... ⏳
            </p>
            <div className="mt-6 space-y-4">
              <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900"
        } p-6`}
      >
        {/* Navbar */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-semibold">Company Dashboard</h1>
          <button
            className="p-2 rounded-lg bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 transition"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {error && <p className="text-red-500">Error: {error}</p>}

        {company && (
          <div
            className={`p-6 rounded-lg shadow-md ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-bold">{company.name}</h2>
            <p className="text-gray-500">
              {company.description || "No description available"}
            </p>
            <p className="mt-2">📍 Location: {company.location || "Unknown"}</p>
            {company.website && (
              <p className="mt-2">
                🌐 Website:{" "}
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {company.website}
                </a>
              </p>
            )}
            {company.logo && (
              <img
                src={company.logo}
                alt="Company Logo"
                className="mt-4 w-24 h-24 rounded-lg"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyDashboard;
