import React, { useRef, useState, useEffect } from "react";
import {
  Shield,
  Upload,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { generateBiomarkerInstructions } from "./biomarkerInstructions";
import { generateInsights } from "./insightsEngine";
function App() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [featuresArray, setFeaturesArray] = useState([]);

  // Suppose features is the object you got from features_np after prediction
  // Convert array to object
  const features = {};
  featuresArray.forEach((item) => {
    features[item.Name] = item.Value;
  });

  const insights = generateInsights(features);
  const biomarkerInstructions = generateBiomarkerInstructions(features);
  useEffect(() => {
    fetch("http://localhost:5000/features")
      .then((res) => res.json())
      .then((data) => setFeaturesArray(data))
      .catch((err) => console.error("Error fetching features.json:", err));
  }, []);

  // Handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadMessage("");

      // Perform actual file upload
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setUploadMessage(data.message || "File uploaded successfully!");
        } else {
          setUploadMessage(data.error || "Error uploading file");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadMessage("Error connecting to server");
      }
      setIsUploading(false);
    }
  };

  // Open file dialog
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Shield size={24} color="#3b82f6" />
          <span
            style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}
          >
            Health Report Checker
          </span>
        </div>

        <nav style={{ display: "flex", gap: "2rem" }}>
          {["Dashboard", "Reports", "Insights", "History"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                color: activeTab === tab ? "#3b82f6" : "#64748b",
                fontSize: "0.875rem",
                fontWeight: activeTab === tab ? "600" : "400",
                cursor: "pointer",
                padding: "0.5rem 0",
                borderBottom: activeTab === tab ? "2px solid #3b82f6" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            color: "#64748b",
          }}
        >
          ?
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "2rem" }}>
        {/* Welcome Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            Hello!
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            Upload your health report to get started and receive insights.
          </p>
        </div>

        {/* Upload Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "2px dashed #cbd5e1",
            padding: "3rem 2rem",
            textAlign: "center",
            marginBottom: "3rem",
            maxWidth: "600px",
            margin: "0 auto 3rem auto",
          }}
        >
          <Upload size={48} color="#94a3b8" style={{ marginBottom: "1rem" }} />

          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            Click to upload your health report
          </h3>

          <p
            style={{
              color: "#64748b",
              fontSize: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            We support PDF, DOCX, and image files
          </p>

          <button
            onClick={handleButtonClick}
            disabled={isUploading}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.6 : 1,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              if (!isUploading) e.target.style.backgroundColor = "#2563eb";
            }}
            onMouseOut={(e) => {
              if (!isUploading) e.target.style.backgroundColor = "#3b82f6";
            }}
          >
            {isUploading ? "Uploading..." : "Upload Report"}
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          {fileName && (
            <p
              style={{
                marginTop: "1rem",
                color: "#059669",
                fontSize: "0.875rem",
              }}
            >
              Selected file: {fileName}
            </p>
          )}

          {uploadMessage && (
            <p
              style={{
                marginTop: "1rem",
                color: uploadMessage.includes("Error") ? "#dc2626" : "#059669",
                fontSize: "0.875rem",
              }}
            >
              {uploadMessage}
            </p>
          )}
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div>
            <h2>General Instructions</h2>
            {biomarkerInstructions.map((item) => (
              <div key={item.name} style={{ marginBottom: "1rem" }}>
                <h3>
                  {item.name}: {item.value}
                </h3>
                <p>{item.advice}</p>
              </div>
            ))}
          </div>

          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "1.5rem",
              }}
            >
              Insights
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {insights.map((item, index) => {
                const isAlert = item.type === "alert";

                const bgColor = isAlert ? "#fef3c7" : "#d1fae5";
                const borderColor = isAlert ? "#f59e0b" : "#10b981";
                const textColor = isAlert ? "#92400e" : "#065f46";
                const Icon = isAlert ? AlertTriangle : CheckCircle;

                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Icon size={16} color={textColor} />
                      <h3
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: textColor,
                          margin: 0,
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {item.status && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: textColor,
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {item.status}
                      </p>
                    )}

                    <p
                      style={{
                        color: textColor,
                        fontSize: "0.75rem",
                        lineHeight: "1.4",
                        margin: 0,
                      }}
                    >
                      {item.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
