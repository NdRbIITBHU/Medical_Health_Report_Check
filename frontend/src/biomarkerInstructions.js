// biomarkerInstructions.js

// Define healthy ranges for each biomarker
export const healthyRanges = {
  Haemoglobin: { min: 13, max: 17 },
  "Packed Cell Volume": { min: 40, max: 50 },
  "Total Leucocyte Count (TLC)": { min: 4000, max: 11000 },
  "RBC Count": { min: 4.5, max: 6.0 },
  MCV: { min: 80, max: 100 },
  MCH: { min: 27, max: 33 },
  MCHC: { min: 32, max: 36 },
  "Platelet Count": { min: 150000, max: 450000 },
  MPV: { min: 7, max: 12 },
  RDW: { min: 11, max: 15 },
  "Absolute Neutrophil Count": { min: 2000, max: 7000 },
};

// Generate instructions per biomarker (step by step, no loop)
export function generateBiomarkerInstructions(features) {
  const instructions = [];

  // Haemoglobin
  if (features["Haemoglobin"] < healthyRanges["Haemoglobin"].min) {
    instructions.push({
      name: "Haemoglobin",
      value: features["Haemoglobin"],
      min: healthyRanges["Haemoglobin"].min,
      max: healthyRanges["Haemoglobin"].max,
      advice: `Increase Haemoglobin content in body. Minimum healthy Haemoglobin is ${healthyRanges["Haemoglobin"].min}.`,
    });
  } else if (features["Haemoglobin"] > healthyRanges["Haemoglobin"].max) {
    instructions.push({
      name: "Haemoglobin",
      value: features["Haemoglobin"],
      min: healthyRanges["Haemoglobin"].min,
      max: healthyRanges["Haemoglobin"].max,
      advice: `Decrease Haemoglobin content in body. Maximum healthy Haemoglobin is ${healthyRanges["Haemoglobin"].max}.`,
    });
  }

  // Packed Cell Volume
  if (
    features["Packed Cell Volume"] < healthyRanges["Packed Cell Volume"].min
  ) {
    instructions.push({
      name: "Packed Cell Volume",
      value: features["Packed Cell Volume"],
      min: healthyRanges["Packed Cell Volume"].min,
      max: healthyRanges["Packed Cell Volume"].max,
      advice: `Increase Packed Cell Volume in body. Minimum healthy Packed Cell Volume is ${healthyRanges["Packed Cell Volume"].min}.`,
    });
  } else if (
    features["Packed Cell Volume"] > healthyRanges["Packed Cell Volume"].max
  ) {
    instructions.push({
      name: "Packed Cell Volume",
      value: features["Packed Cell Volume"],
      min: healthyRanges["Packed Cell Volume"].min,
      max: healthyRanges["Packed Cell Volume"].max,
      advice: `Decrease Packed Cell Volume in body. Maximum healthy Packed Cell Volume is ${healthyRanges["Packed Cell Volume"].max}.`,
    });
  }

  // Total Leucocyte Count (TLC)
  if (
    features["Total Leucocyte Count (TLC)"] <
    healthyRanges["Total Leucocyte Count (TLC)"].min
  ) {
    instructions.push({
      name: "Total Leucocyte Count (TLC)",
      value: features["Total Leucocyte Count (TLC)"],
      min: healthyRanges["Total Leucocyte Count (TLC)"].min,
      max: healthyRanges["Total Leucocyte Count (TLC)"].max,
      advice: `Increase Total Leucocyte Count (TLC) in body. Minimum healthy TLC is ${healthyRanges["Total Leucocyte Count (TLC)"].min}.`,
    });
  } else if (
    features["Total Leucocyte Count (TLC)"] >
    healthyRanges["Total Leucocyte Count (TLC)"].max
  ) {
    instructions.push({
      name: "Total Leucocyte Count (TLC)",
      value: features["Total Leucocyte Count (TLC)"],
      min: healthyRanges["Total Leucocyte Count (TLC)"].min,
      max: healthyRanges["Total Leucocyte Count (TLC)"].max,
      advice: `Decrease Total Leucocyte Count (TLC) in body. Maximum healthy TLC is ${healthyRanges["Total Leucocyte Count (TLC)"].max}.`,
    });
  }

  // RBC Count
  if (features["RBC Count"] < healthyRanges["RBC Count"].min) {
    instructions.push({
      name: "RBC Count",
      value: features["RBC Count"],
      min: healthyRanges["RBC Count"].min,
      max: healthyRanges["RBC Count"].max,
      advice: `Increase RBC Count in body. Minimum healthy RBC Count is ${healthyRanges["RBC Count"].min}.`,
    });
  } else if (features["RBC Count"] > healthyRanges["RBC Count"].max) {
    instructions.push({
      name: "RBC Count",
      value: features["RBC Count"],
      min: healthyRanges["RBC Count"].min,
      max: healthyRanges["RBC Count"].max,
      advice: `Decrease RBC Count in body. Maximum healthy RBC Count is ${healthyRanges["RBC Count"].max}.`,
    });
  }

  // MCV
  if (features["MCV"] < healthyRanges["MCV"].min) {
    instructions.push({
      name: "MCV",
      value: features["MCV"],
      min: healthyRanges["MCV"].min,
      max: healthyRanges["MCV"].max,
      advice: `Increase MCV in body. Minimum healthy MCV is ${healthyRanges["MCV"].min}.`,
    });
  } else if (features["MCV"] > healthyRanges["MCV"].max) {
    instructions.push({
      name: "MCV",
      value: features["MCV"],
      min: healthyRanges["MCV"].min,
      max: healthyRanges["MCV"].max,
      advice: `Decrease MCV in body. Maximum healthy MCV is ${healthyRanges["MCV"].max}.`,
    });
  }

  // MCH
  if (features["MCH"] < healthyRanges["MCH"].min) {
    instructions.push({
      name: "MCH",
      value: features["MCH"],
      min: healthyRanges["MCH"].min,
      max: healthyRanges["MCH"].max,
      advice: `Increase MCH in body. Minimum healthy MCH is ${healthyRanges["MCH"].min}.`,
    });
  } else if (features["MCH"] > healthyRanges["MCH"].max) {
    instructions.push({
      name: "MCH",
      value: features["MCH"],
      min: healthyRanges["MCH"].min,
      max: healthyRanges["MCH"].max,
      advice: `Decrease MCH in body. Maximum healthy MCH is ${healthyRanges["MCH"].max}.`,
    });
  }

  // MCHC
  if (features["MCHC"] < healthyRanges["MCHC"].min) {
    instructions.push({
      name: "MCHC",
      value: features["MCHC"],
      min: healthyRanges["MCHC"].min,
      max: healthyRanges["MCHC"].max,
      advice: `Increase MCHC in body. Minimum healthy MCHC is ${healthyRanges["MCHC"].min}.`,
    });
  } else if (features["MCHC"] > healthyRanges["MCHC"].max) {
    instructions.push({
      name: "MCHC",
      value: features["MCHC"],
      min: healthyRanges["MCHC"].min,
      max: healthyRanges["MCHC"].max,
      advice: `Decrease MCHC in body. Maximum healthy MCHC is ${healthyRanges["MCHC"].max}.`,
    });
  }

  // Platelet Count
  if (features["Platelet Count"] < healthyRanges["Platelet Count"].min) {
    instructions.push({
      name: "Platelet Count",
      value: features["Platelet Count"],
      min: healthyRanges["Platelet Count"].min,
      max: healthyRanges["Platelet Count"].max,
      advice: `Increase Platelet Count in body. Minimum healthy Platelet Count is ${healthyRanges["Platelet Count"].min}.`,
    });
  } else if (features["Platelet Count"] > healthyRanges["Platelet Count"].max) {
    instructions.push({
      name: "Platelet Count",
      value: features["Platelet Count"],
      min: healthyRanges["Platelet Count"].min,
      max: healthyRanges["Platelet Count"].max,
      advice: `Decrease Platelet Count in body. Maximum healthy Platelet Count is ${healthyRanges["Platelet Count"].max}.`,
    });
  }

  // MPV
  if (features["MPV"] < healthyRanges["MPV"].min) {
    instructions.push({
      name: "MPV",
      value: features["MPV"],
      min: healthyRanges["MPV"].min,
      max: healthyRanges["MPV"].max,
      advice: `Increase MPV in body. Minimum healthy MPV is ${healthyRanges["MPV"].min}.`,
    });
  } else if (features["MPV"] > healthyRanges["MPV"].max) {
    instructions.push({
      name: "MPV",
      value: features["MPV"],
      min: healthyRanges["MPV"].min,
      max: healthyRanges["MPV"].max,
      advice: `Decrease MPV in body. Maximum healthy MPV is ${healthyRanges["MPV"].max}.`,
    });
  }

  // RDW
  if (features["RDW"] < healthyRanges["RDW"].min) {
    instructions.push({
      name: "RDW",
      value: features["RDW"],
      min: healthyRanges["RDW"].min,
      max: healthyRanges["RDW"].max,
      advice: `Increase RDW in body. Minimum healthy RDW is ${healthyRanges["RDW"].min}.`,
    });
  } else if (features["RDW"] > healthyRanges["RDW"].max) {
    instructions.push({
      name: "RDW",
      value: features["RDW"],
      min: healthyRanges["RDW"].min,
      max: healthyRanges["RDW"].max,
      advice: `Decrease RDW in body. Maximum healthy RDW is ${healthyRanges["RDW"].max}.`,
    });
  }

  // Absolute Neutrophil Count
  if (
    features["Absolute Neutrophil Count"] <
    healthyRanges["Absolute Neutrophil Count"].min
  ) {
    instructions.push({
      name: "Absolute Neutrophil Count",
      value: features["Absolute Neutrophil Count"],
      min: healthyRanges["Absolute Neutrophil Count"].min,
      max: healthyRanges["Absolute Neutrophil Count"].max,
      advice: `Increase Absolute Neutrophil Count in body. Minimum healthy ANC is ${healthyRanges["Absolute Neutrophil Count"].min}.`,
    });
  } else if (
    features["Absolute Neutrophil Count"] >
    healthyRanges["Absolute Neutrophil Count"].max
  ) {
    instructions.push({
      name: "Absolute Neutrophil Count",
      value: features["Absolute Neutrophil Count"],
      min: healthyRanges["Absolute Neutrophil Count"].min,
      max: healthyRanges["Absolute Neutrophil Count"].max,
      advice: `Decrease Absolute Neutrophil Count in body. Maximum healthy ANC is ${healthyRanges["Absolute Neutrophil Count"].max}.`,
    });
  }

  return instructions;
}
