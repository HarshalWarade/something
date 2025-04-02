import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, X } from "lucide-react";

const skillset = {
  "Web Development": [
    "html",
    "css",
    "javascript",
    "react",
    "nextjs",
    "vue",
    "angular",
    "nodejs",
    "express",
    "mongodb",
    "typescript",
    "tailwindcss",
    "sass",
    "bootstrap",
    "graphql",
    "redux",
    "vite",
    "webpack",
    "firebase",
    "websockets",
    "astro",
    "remix",
    "svelte",
    "prisma",
  ],
  "Cyber Security": [
    "penetration_testing",
    "network_security",
    "ethical_hacking",
    "cryptography",
    "firewall_configuration",
    "intrusion_detection",
    "digital_forensics",
    "malware_analysis",
    "reverse_engineering",
    "wireshark",
    "metasploit",
    "kali_linux",
    "osint",
    "siem",
    "security_operations",
    "vulnerability_assessment",
    "risk_management",
    "burpsuite",
    "nmap",
    "tcp/ip",
    "zero_day_exploits",
    "identity_and_access_management",
  ],
  "Machine Learning and AI": [
    "python",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "numpy",
    "pandas",
    "matplotlib",
    "seaborn",
    "deep_learning",
    "nlp",
    "computer_vision",
    "reinforcement_learning",
    "neural_networks",
    "cnn",
    "rnn",
    "transformers",
    "xgboost",
    "llms",
    "opencv",
    "huggingface",
    "fastai",
    "mlflow",
    "bayesian_learning",
    "generative_ai",
  ],
  "Data Science": [
    "python",
    "r",
    "sql",
    "pandas",
    "numpy",
    "matplotlib",
    "seaborn",
    "scikit-learn",
    "big_data",
    "hadoop",
    "spark",
    "etl",
    "data_wrangling",
    "data_visualization",
    "predictive_modeling",
    "powerbi",
    "tableau",
    "statistics",
    "data_mining",
    "time_series_analysis",
    "ab_testing",
    "data_pipeline",
    "dbt",
  ],
  "Software Engineering": [
    "c",
    "cpp",
    "java",
    "dsa",
    "data structures and algorithms",
    "python",
    "c#",
    "golang",
    "rust",
    "kotlin",
    "swift",
    "oop",
    "design_patterns",
    "agile",
    "git",
    "docker",
    "kubernetes",
    "ci/cd",
    "microservices",
    "rest_api",
    "graphql",
    "solid_principles",
    "test_driven_development",
    "refactoring",
  ],
  "Cloud Computing": [
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "terraform",
    "cloud_security",
    "serverless",
    "lambda",
    "cloud_storage",
    "ec2",
    "s3",
    "cloud_networking",
    "devops",
    "ansible",
    "ci/cd",
    "cloud_monitoring",
    "elastic_kibana",
    "fargate",
    "istio",
  ],
  "Block Chian and Web3": [
    "solidity",
    "ethereum",
    "smart_contracts",
    "web3",
    "nft",
    "metamask",
    "defi",
    "cryptography",
    "truffle",
    "hardhat",
    "hyperledger",
    "bitcoin",
    "polygon",
    "rust",
    "substrate",
    "staking",
    "cosmos",
    "dapps",
    "solana",
    "ipfs",
    "zk_snarks",
  ],
  "Game Development": [
    "unity",
    "unreal_engine",
    "c#",
    "cpp",
    "godot",
    "game_physics",
    "shader_programming",
    "opengl",
    "directx",
    "blender",
    "3d_modeling",
    "animation",
    "ai_in_games",
    "multiplayer_networking",
    "ray_tracing",
    "procedural_generation",
    "vr",
    "ar",
  ],
  "DevOps and Site Reliability Engineering": [
    "docker",
    "kubernetes",
    "ci/cd",
    "jenkins",
    "ansible",
    "terraform",
    "prometheus",
    "grafana",
    "helm",
    "aws",
    "azure",
    "gcp",
    "site_reliability_engineering",
    "monitoring",
    "logging",
    "cloud_native",
    "new_relic",
    "incident_response",
  ],
  "Mobile Development": [
    "flutter",
    "react_native",
    "swift",
    "kotlin",
    "android",
    "ios",
    "dart",
    "xamarin",
    "jetpack_compose",
    "cordova",
    "ionic",
    "firebase",
    "graphql",
    "sqlite",
    "realm",
    "native_script",
  ],
  "Embedded System and IOT": [
    "arduino",
    "raspberry_pi",
    "microcontrollers",
    "c",
    "cpp",
    "embedded_c",
    "verilog",
    "fpga",
    "rtos",
    "mqtt",
    "iot_security",
    "wireless_protocols",
    "sensor_fusion",
    "pcb_design",
  ],
  "Networking and System Administration": [
    "linux",
    "windows_server",
    "dns",
    "dhcp",
    "tcp/ip",
    "network_configuration",
    "firewall_setup",
    "load_balancing",
    "active_directory",
    "vpn",
    "bash_scripting",
    "powershell",
    "shell_scripting",
  ],
  "Database Management": [
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "redis",
    "cassandra",
    "dynamodb",
    "elasticsearch",
    "neo4j",
    "oracle_db",
    "firebase_firestore",
    "couchdb",
  ],
  "UI/UX Design": [
    "figma",
    "adobe_xd",
    "sketch",
    "wireframing",
    "prototyping",
    "usability_testing",
    "design_systems",
    "user_research",
    "motion_design",
    "visual_hierarchy",
  ],
  "3-D Modelling and Animation": [
    "blender",
    "maya",
    "3ds_max",
    "zbrush",
    "substance_painter",
    "uv_mapping",
    "rigging",
    "motion_capture",
    "cinema_4d",
    "houdini",
  ],
  "Video Editing and Production": [
    "adobe_premiere_pro",
    "final_cut_pro",
    "davinci_resolve",
    "after_effects",
    "color_grading",
    "vfx",
    "motion_graphics",
    "sound_design",
  ],
  "Digital Marketing and SEO": [
    "seo",
    "google_ads",
    "facebook_ads",
    "email_marketing",
    "content_marketing",
    "social_media_management",
    "conversion_rate_optimization",
    "affiliate_marketing",
    "google_analytics",
  ],
  "Finance and Trading": [
    "financial_modeling",
    "stock_trading",
    "forex",
    "cryptocurrency_trading",
    "technical_analysis",
    "fundamental_analysis",
    "risk_management",
    "algo_trading",
  ],
  "Legal and Compliance": [
    "contract_law",
    "intellectual_property",
    "corporate_governance",
    "data_privacy",
    "gdpr",
    "cyber_law",
    "regulatory_compliance",
  ],
};

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
    requirements: [],
  });

  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const skillChangeHandler = (e) => {
    const value = e.target.value;
    setShowDropdown(true);

    if (value === "") {
      setSkillSuggestions([]);
      return;
    }

    const allSkills = Object.values(skillset).flat();
    const filteredSkills = allSkills.filter((requirements) =>
      requirements.toLowerCase().includes(value.toLowerCase())
    );

    setSkillSuggestions(filteredSkills);
  };

  const selectSkill = (requirements) => {
    if (!input.requirements.includes(requirements)) {
      setInput({ ...input, requirements: [...input.requirements, requirements] });
    }
    setShowDropdown(false);
  };

  const removeSkill = (requirements) => {
    setInput({ ...input, requirements: input.requirements.filter((s) => s !== requirements) });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            {/* Skill Selection */}
            <div className="relative">
              <Label>Required Skills</Label>
              <Input
                type="text"
                onChange={skillChangeHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter skill..."
              />
              {showDropdown && skillSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md shadow-md">
                  {skillSuggestions.map((requirements, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => selectSkill(requirements)}
                    >
                      {requirements}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {input.requirements.map((requirements, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded-md flex items-center"
                  >
                    {requirements}
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={() => removeSkill(requirements)}
                    />
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            {companies.length > 0 && (
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((company) => (
                      <SelectItem
                        key={company._id}
                        value={company?.name?.toLowerCase()}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Post New Job
            </Button>
          )}
          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
