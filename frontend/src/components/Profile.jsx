import React, { useContext, useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { ThemeContext } from "@/ThemeContext";
import { toast } from "sonner";
import SkillsAnalyser from "./SkillsAnalyser";
import DashboardFirstDiv from "./DashboardFirstDiv";
import MatchingJobs from "./MatchingJobs";
import ChatComponent from "./ChatComponent";

const isResume = true;

const Profile = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const userSkills = user?.profile?.skills || [];

  const [displaySkills, setDisplaySkills] = useState([]);

  const [something, setSomething] = useState(true);

  const [showAll, setShowAll] = useState(false);
  const visibleSkills = showAll ? userSkills : userSkills.slice(0, 10);

  const handleAnalyseResume = () => {
    if (userSkills.length > 0) {
      setDisplaySkills(userSkills);
      toast.success("Skills extracted from your profile!");
    } else {
      toast.error("No skills found in your resume.");
    }
    setSomething(false);
  };

  return (
    <>
      <Navbar />
      <div
        className={`p-8 gap-5 grid grid-cols-12 min-h-screen ${
          theme === "dark" ? "bg-[#191919] text-gray-200" : ""
        }`}
      >
        <div
          className={`flex flex-col gap-4 col-span-8 min-h-screen ${
            theme === "dark" ? "bg-[#191919]" : ""
          }`}
        >
          <div
            className={`w-full mx-auto rounded-xl p-8 ${
              theme === "dark"
                ? "bg-[#2B2B2B] text-gray-300"
                : "bg-white shadow-[5px_5px_20px_5px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt="profile"
                  />
                </Avatar>
                <div className={`flex flex-col gap-2`}>
                  <h1
                    className={`font-semibold text-xl ${
                      theme === "dark" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {user?.fullname}
                  </h1>
                  <p
                    className={`text-md tracking-wide ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {user?.profile?.bio}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className={`rounded-full h-12 w-12 text-right outline-none border-none ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                variant="outline"
              >
                <Pen className="text-sm" />
              </Button>
            </div>
            <div className="my-5">
              <div className="flex items-center gap-3 my-2">
                <Mail />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 my-2">
                <Contact />
                <span>{user?.phoneNumber}</span>
              </div>
            </div>
            <div className="my-5 flex flex-col gap-2">
              <h1>Skills</h1>

              <div className="w-full">
                <div className="flex flex-wrap w-full items-center gap-2 justify-center md:justify-start rounded-md">
                  {userSkills.length !== 0 ? (
                    visibleSkills.map((item, index) => (
                      <Badge
                        className={`transition delay-[0.3s] duration-500 cursor-pointer font-normal px-3 py-1 rounded-full text-sm ${
                          theme === "dark"
                            ? "bg-gray-100 text-black hover:bg-gray-100 hover:text-black"
                            : "bg-black text-white hover:bg-none hover:text-none"
                        }`}
                        key={index}
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-700">
                      Resume is not available
                    </span>
                  )}
                </div>

                {userSkills.length > 10 && (
                  <div className="mt-3 flex justify-center md:justify-start">
                    <Button
                      onClick={() => setShowAll(!showAll)}
                      className={`px-4 py-2 text-sm font-semibold rounded-md ${
                        theme === "dark"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                      }`}
                    >
                      {showAll ? "Show Less" : "More Skills"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label className="text-md font-bold">Resume</Label>
              {isResume ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${user?.profile?.resume}?fl_attachment=false`}
                  className="text-blue-500 w-full hover:underline cursor-pointer"
                >
                  {user?.profile?.resumeOriginalName || "View Resume"}
                </a>
              ) : (
                <span>NA</span>
              )}
            </div>
          </div>

          {/* <DashboardFirstDiv isResume={isResume} user={user} theme={theme} setOpen={setOpen} /> */}

          <div
            className={`p-8 rounded-xl ${
              theme === "dark"
                ? "bg-[#2B2B2B] text-gray-300"
                : "bg-white shadow-[5px_5px_20px_5px_rgba(0,0,0,0.08)]"
            }`}
          >
            <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
            <AppliedJobTable />
          </div>
          <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>

        <div
          className={`p-8 h-min max-w-4xl mx-auto rounded-lg col-span-4  ${
            theme === "dark"
              ? "bg-[#2B2B2B] text-gray-300"
              : "bg-white shadow-[5px_5px_20px_5px_rgba(0,0,0,0.08)]"
          }`}
        >
          <MatchingJobs theme={theme} />
        </div>

        <div className={`col-span-8 text-gray-200`}>
          <div
            className={`p-8 rounded-xl ${
              theme === "dark"
                ? "bg-[#2B2B2B] text-gray-300"
                : "bg-white shadow-[5px_5px_20px_5px_rgba(0,0,0,0.08)]"
            }`}
          >
            {something ? (
              <Button onClick={handleAnalyseResume}>Analyse my skills</Button>
            ) : (
              ""
            )}

            {displaySkills.length > 0 && (
              <div
                className={`flex flex-col gap-4 justify-center ${
                  theme === "dark"
                    ? "text-gray-300"
                    : "bg-white border-gray-300"
                } transition-all duration-500 ease-in-out`}
              >
                <h2
                  className={`text-lg flex justify-between items-center font-bold mb-3 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  <p>Extracted Skills</p>
                  <Button
                    className={`rounded-sm h-8 w-8 bg-red-500 hover:bg-red-600`}
                    onClick={() => {
                      setDisplaySkills([]);
                      setSomething(true);
                    }}
                  >
                    x
                  </Button>
                </h2>

                <div className="flex flex-wrap gap-3">
                  {displaySkills.map((skill, index) => (
                    <Badge
                      key={index}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        theme === "dark"
                          ? "text-white bg-gray-700 font-semibold hover:bg-gray-600 cursor-pointer"
                          : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <SkillsAnalyser userSkills={userSkills} theme={theme} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
