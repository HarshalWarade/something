import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const skillsData = {
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
    "c++",
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
    "c++",
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
    "c++",
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

const SkillsAnalyser = ({ userSkills, theme }) => {
  const [times, setTimes] = useState(10);

  const [analysis, setAnalysis] = useState(null);

  const analyzeSkills = () => {
    let matchedFields = {};
    let missingSkills = {};
    let matchPercentages = {};

    Object.entries(skillsData).forEach(([field, skills]) => {

      let formattedUserSkills = userSkills.map((skill) =>
        skill.toLowerCase().replace(/_/g, " ").trim()
      );

      let formattedFieldSkills = skills.map((skill) =>
        skill.toLowerCase().replace(/_/g, " ").trim()
      );

      let matches = formattedUserSkills.filter((skill) =>
        formattedFieldSkills.includes(skill)
      );

      if (matches.length > 0) {
        matchedFields[field] = matches;
        missingSkills[field] = formattedFieldSkills.filter(
          (skill) => !formattedUserSkills.includes(skill)
        );
        matchPercentages[field] = (
          (matches.length / skills.length) *
          100
        ).toFixed(2);
      }
    });

    const primaryInterest =
      Object.keys(matchPercentages).length > 0
        ? Object.keys(matchPercentages).reduce(
            (prev, curr) =>
              matchPercentages[curr] > (matchPercentages[prev] || 0)
                ? curr
                : prev,
            Object.keys(matchPercentages)[0]
          )
        : "No strong match found";

    setAnalysis({
      matchedFields,
      missingSkills,
      matchPercentages,
      primaryInterest,
    });

    // console.log("Matched Fields:", matchedFields);
    // console.log("Missing Skills:", missingSkills);
    // console.log("Match Percentages:", matchPercentages);
    // console.log("Primary Interest:", primaryInterest);
  };

  return (
    <div>
      <div className={`flex items-center gap-4`}>
        <Button
          onClick={analyzeSkills}
          className={`${
            theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : ""
          }`}
        >
          Analyse in depth
        </Button>
        {/* <p>
          <span
            className={`font-semibold ${
              (times >= 7 ? "text-green-500" : "", times)
            }`}
          >
            {times}
          </span>{" "}
          free trails available
        </p> */}
      </div>

      {analysis && (
        <div
          className="mt-10 rounded-lg transition-all duration-500 ease-in-out"
          style={{
            background: theme === "dark" ? "#2B2B2B" : "#fff",
            borderColor: theme === "dark" ? "#444" : "#fff",
            boxShadow: theme === "dark" ? "" : "",
          }}
        >
          <h2
            className={`text-lg font-bold ${
              theme === "dark" ? "text-red-400" : "text-gray-700"
            }`}
          >
            Your Skill Analysis
          </h2>

          {analysis.primaryInterest && (
            <p className={`mt-2 text-sm ${theme === "dark" ? "" : "text-gray-700"}`}>
              Your primary area of interest appears to be:{" "}
              <span className="font-semibold text-blue-500">
                {analysis.primaryInterest}
              </span>
            </p>
          )}

          <div className={`mt-4 ${theme === "dark" ? "" : "text-gray-800"}`}>
            <h3 className="font-semibold text-md">Matched Skills:</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(analysis.matchedFields).map(([field, skills]) => (
                <div key={field} className="mt-2">
                  <h4 className="text-sm font-semibold capitalize">
                    {field} ({analysis.matchPercentages[field]}%)
                  </h4>
                  <div className="flex mt-2 flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className={`px-3 py-1 text-sm ${
                          theme === "dark"
                            ? "bg-green-500 text-white"
                            : "bg-black text-white font-normal cursor-pointer"
                        }`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-4 ${theme === "dark" ? "" : "text-gray-600"}`}>
            <h3 className="font-semibold text-md">Skills to Improve:</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(analysis.missingSkills).map(([field, skills]) => (
                <div key={field} className="mt-2">
                  <h4 className="text-sm font-semibold capitalize">
                    {field} (Missing Skills)
                  </h4>
                  <div className="flex flex-wrap mt-2 gap-2">
                    {skills.slice(0, 5).map((skill, index) => (
                      <Badge
                        key={index}
                        className={`px-3 py-1 text-sm ${
                          theme === "dark"
                            ? "bg-red-500 text-white"
                            : "bg-black text-white font-normal cursor-pointer"
                        }`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsAnalyser;
