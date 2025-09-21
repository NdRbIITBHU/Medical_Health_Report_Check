// insightsEngine.js
// Generates structured insights array for direct UI rendering

// Reference ranges for biomarkers

const HEALTHY_RANGES = {
  Hemoglobin: [13.5, 17.5],
  PCV: [41, 53],
  TLC: [4000, 11000],
  "RBC Count": [4.7, 6.1],
  MCV: [80, 100],
  MCH: [27, 33],
  MCHC: [32, 36],
  "Platelet Count": [150000, 450000],
  MPV: [7.5, 11.5],
  RDW: [11.5, 14.5],
  "Absolute Neutrophil Count": [1500, 8000],
};

// Biomarker advice messages
const BIOMARKER_MESSAGES = {
  Hemoglobin: {
    low: "Slightly low — consider iron-rich foods like spinach, lentils, or red meat.",
    normal: "Normal. Oxygen-carrying capacity is healthy.",
    high: "Higher than normal — can be due to dehydration or smoking; monitor regularly.",
  },
  TLC: {
    low: "Low WBC count — immunity may be weakened; avoid infections.",
    normal: "Normal WBC count.",
    high: "Elevated WBC — possible infection or inflammation; monitor symptoms.",
  },
  "Platelet Count": {
    low: "Low platelet count — risk of bleeding; avoid injuries.",
    normal: "Normal platelet count.",
    high: "High platelet count — monitor for clotting risk.",
  },
  MPV: {
    low: "Low MPV — platelets are smaller than usual; consult doctor if persistent.",
    normal: "Normal MPV.",
    high: "High MPV — platelets are larger; could indicate clotting tendency.",
  },
};

// Disease rules
function getDiseaseInsights(report) {
  const diseases = [];

  if (
    (report.Hemoglobin < 12 && report.MCV < 80) ||
    (report.Hemoglobin < 12 && report.MCH < 27)
  ) {
    diseases.push({ name: "Iron-deficiency Anemia", likelihood: "High" });
  } else if (report.Hemoglobin < 13.5) {
    diseases.push({ name: "Iron-deficiency Anemia", likelihood: "Medium" });
  }

  if (report.TLC > 11000 && report["Absolute Neutrophil Count"] > 7000) {
    diseases.push({ name: "Bacterial Infection", likelihood: "High" });
  } else if (report.TLC > 10000) {
    diseases.push({ name: "Bacterial Infection", likelihood: "Medium" });
  }

  if (report["Platelet Count"] > 400000 && report.MPV > 11) {
    diseases.push({ name: "Clotting Disorder Risk", likelihood: "High" });
  } else if (report["Platelet Count"] > 350000) {
    diseases.push({ name: "Clotting Disorder Risk", likelihood: "Medium" });
  }

  return diseases;
}

// Generate biomarker insights
function getBiomarkerInsights(report) {
  const insights = [];
  for (const [key, value] of Object.entries(report)) {
    if (!HEALTHY_RANGES[key]) continue;
    const [low, high] = HEALTHY_RANGES[key];
    let type = "normal";
    let status = "Within healthy range";
    let message = BIOMARKER_MESSAGES[key]?.normal || "Normal value";

    if (value < low) {
      type = "alert";
      status = "Action recommended";
      message = BIOMARKER_MESSAGES[key]?.low || "Low value detected";
    } else if (value > high) {
      type = "alert";
      status = "Action recommended";
      message = BIOMARKER_MESSAGES[key]?.high || "High value detected";
    }

    insights.push({ type, title: key, status, message });
  }
  return insights;
}

// Generate lifestyle / preventive advice
function getLifestyleAdvice(report) {
  const advice = [];

  if (report.Hemoglobin < 12) {
    advice.push(
      "Increase iron-rich foods and vitamin C for better absorption."
    );
  }
  if (report.TLC > 11000) {
    advice.push(
      "Monitor for infection symptoms like fever; consult a doctor if persistent."
    );
  }
  if (report["Platelet Count"] > 400000) {
    advice.push(
      "Stay hydrated, avoid smoking, and consult a doctor for clotting risk."
    );
  }

  advice.push(
    "Maintain balanced diet, exercise regularly, and schedule routine checkups."
  );

  // Convert to structured array for UI
  return advice.map((msg) => ({
    type: "normal",
    title: "Lifestyle / Preventive Tip",
    status: "",
    message: msg,
  }));
}

// Main function: returns full structured array ready for React
export function generateInsights(report) {
  const diseaseData = getDiseaseInsights(report).map((d) => ({
    type: "alert",
    title: d.name,
    status: `Likelihood: ${d.likelihood}`,
    message: "Please consult your doctor for further evaluation.",
  }));

  const biomarkerData = getBiomarkerInsights(report);
  const lifestyleData = getLifestyleAdvice(report);

  // Combine all into single array for UI
  return [...diseaseData, ...biomarkerData, ...lifestyleData];
}
