import { ALL_USERS_API } from "@/utils/constant";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@/ThemeContext";

const AllUsers = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const profilePic =
    "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(ALL_USERS_API, {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-[#191919] min-h-screen text-gray-200"
          : "bg-white text-black"
      }`}
    >
      <Navbar />
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <>
          <div
            className={`max-w-7xl mx-auto py-8 ${
              theme === "dark" ? "bg-[#191919]" : ""
            }`}
          >
            <h2
              className={`text-3xl mb-8 text-center font-semibold ${
                theme === "dark" ? "" : ""
              }`}
            >
              All Users
            </h2>

            <div className={`flex gap-4`}>
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`p-6 rounded-2xl shadow-lg w-[33%] h-min mx-auto ${
                    theme === "dark"
                      ? "bg-[#2b2b2b] text-white"
                      : "bg-white text-gray-800 border shadow-sm"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={user?.profile?.profilePhoto ?? profilePic}
                      alt="Profile"
                      className="w-24 h-24 rounded-full"
                    />

                    <h2 className="text-xl text-center font-semibold mt-4">
                      {user.fullname}
                    </h2>
                    <p
                      className={`mt-3 text-center ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {user?.profile?.bio}
                    </p>
                    <button
                      className="mt-4 bg-[#ec2525] hover:bg-[#d92121] text-white px-4 py-2 rounded-lg transition-all"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllUsers;
