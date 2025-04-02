import React, { useContext, useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import { ThemeContext } from "@/ThemeContext";

const JobDescription = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen h-max mx-auto px-[8%] pt-10 pb-10 ${
          theme === "dark" ? "text-gray-300 bg-[#191919]" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className="flex items-center gap-2 mt-4">
              <Badge
                className={`text-yellow-600 font-bold ${
                  theme === "dark"
                    ? "text-yellow-400 border-yellow-400 shadow-lg shadow-yellow-500/30"
                    : ""
                }`}
                variant="ghost"
              >
                {singleJob?.position} Positions
              </Badge>
              <Badge
                className={`text-green-600 font-bold ${
                  theme === "dark"
                    ? "text-green-400 border-green-400 shadow-lg shadow-green-500/30"
                    : ""
                }`}
                variant="ghost"
              >
                {singleJob?.jobType}
              </Badge>
              <Badge
                className={`text-blue-600 font-bold ${
                  theme === "dark"
                    ? "text-blue-400 border-blue-400 shadow-lg shadow-blue-500/30"
                    : ""
                }`}
                variant="ghost"
              >
                {singleJob?.salary}LPA
              </Badge>
            </div>
          </div>
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
          Job Description
        </h1>
        <div className="my-4">
          <dl className="space-y-2">
            <div className="flex gap-2">
              <dt
                className={`font-bold ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                Role:
              </dt>
              <dd className="font-normal">{singleJob?.title}</dd>
            </div>

            <div className="flex gap-2">
              <dt
                className={`font-bold ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                Location:
              </dt>
              <dd className="font-normal">{singleJob?.location}</dd>
            </div>

            <div className="flex gap-2">
              <dt
                className={`font-bold ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                Description:
              </dt>
              <dd className="font-normal">{singleJob?.description}</dd>
            </div>

            <div className="flex gap-2">
              <dt
                className={`font-bold ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                Experience:
              </dt>
              <dd className="font-normal">
                {singleJob?.experienceLevel == 0
                  ? "No prior experience required"
                  : `${singleJob?.experienceLevel} yrs`}
              </dd>
            </div>

            <div className="flex gap-2">
              <dt
                className={`font-bold ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                Salary:
              </dt>
              <dd className="font-normal">{singleJob?.salary} LPA</dd>
            </div>

            <div className="flex gap-2">
              <dt
                className={`font-bold ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                Total Applicants:
              </dt>
              <dd className="font-normal">{singleJob?.applications?.length}</dd>
            </div>

            <div className="flex gap-2">
              <dt
                className={`font-bold ${
                  theme === "dark" ? "text-white" : ""
                }`}
              >
                Posted Date:
              </dt>
              <dd className="font-normal">
                {singleJob?.createdAt.split("T")[0]}
              </dd>
            </div>

            {/* {singleJob?.requirements?.length > 0 && (
              <div className="mt-4">
                <dt
                  className={`text-lg font-semibold tracking-wide mb-2 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  📌 Requirements:
                </dt>
                <dd>
                  <ul className="space-y-2">
                    {singleJob.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg shadow-md border transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
                            : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        <span className="text-green-500 text-lg">✅</span>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )} */}

            {/* {singleJob?.requirements?.length > 0 && (
              <div
                className="mt-6 p-6 rounded-2xl shadow-xl border-2 transition-all duration-300
    bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
    border-gray-300 dark:border-gray-700"
              >
                <dt
                  className="text-2xl font-extrabold uppercase tracking-wide text-center relative
      text-gray-800 dark:text-white
      before:absolute before:content-[''] before:-bottom-1 before:left-1/2 before:w-20 before:h-1
      before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:transform before:-translate-x-1/2"
                >
                  📌 Requirements
                </dt>

                <dd className="mt-4">
                  <ul className="space-y-3">
                    {singleJob.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg border shadow-lg backdrop-blur-md
              transition-all duration-500 cursor-pointer select-none
              dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200
              bg-gray-100 text-gray-900 border-gray-300
              hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white
              dark:hover:from-purple-600 dark:hover:to-blue-500"
                      >
                        <span className="text-2xl animate-pulse">🚀</span>
                        <span className="text-lg font-medium">
                          {requirement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )} */}
            <br />
            {singleJob?.requirements?.length > 0 && (
              <div
                className={`mt-6 p-5 rounded-xl border shadow-md transition-all duration-300 
      ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-gray-100 border-gray-300 text-gray-900"
      }`}
              >
                {/* Header */}
                <dt
                  className={`text-xl font-semibold mb-3 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  📌 Requirements
                </dt>

                <dd>
                  <ul className="space-y-2">
                    {singleJob.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300
              ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
                  : "border-gray-300 bg-white text-gray-800 hover:bg-gray-200 hover:border-gray-400"
              }`}
                      >
                        <span className="text-lg">✔️</span>
                        <span className="text-base">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </>
  );
};

export default JobDescription;
