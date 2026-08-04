// ==========================================
// 1. SMART PASTE HANDLER
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('paste', function(e) {
    const target = e.target;
    const isCondition = target.classList.contains('condition-cell');
    const isMedication = target.classList.contains('medication-cell');

    if (isCondition || isMedication) {
      e.preventDefault(); // Stop default browser text injection
      
      const startRow = parseInt(target.getAttribute('data-row'), 10);
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData('text');
      
      // Split by newlines & clean up tabs
      const lines = pastedText.split(/\r?\n/)
          .map(line => line.replace(/\t/g, ' ').trim())
          .filter(line => line.length > 0);
      
      const targetClass = isCondition ? '.condition-cell' : '.medication-cell';
      
      // Distribute lines down rows sequentially
      lines.forEach((line, index) => {
          const currentRowNum = startRow + index;
          const cell = document.querySelector(`${targetClass}[data-row="${currentRowNum}"]`);
          if (cell) {
              if (cell.tagName === 'INPUT' || cell.tagName === 'SELECT') {
                cell.value = line;
              } else {
                cell.innerText = line;
              }
          }
      });
    }
  });
});

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

// Helper to extract medication name from object or string
function extractMedName(med) {
  if (!med) return "";
  if (typeof med === 'string') return med.trim();
  return (med.name || med.drugName || med.label || med.medication || "").trim();
}

// SEROTONIN SYNDROME RISK HELPER
function getSerotoninRiskMeds(activeMeds, medsByClass) {
  let detectedSerotoninMeds = [];
  const serotoninClasses = ["SSRI", "SNRI", "TRIPTAN", "MAOI", "TCA", "SARI", "TRAZODONE"];

  // Primary Check: Scan activeMeds array
  if (Array.isArray(activeMeds)) {
    activeMeds.forEach(med => {
      const rawName = extractMedName(med);
      if (!rawName) return;

      const upperName = rawName.toUpperCase();
      let isFlagged = false;
      let isClassMatch = false;

      if (typeof med === 'object' && med !== null) {
        isFlagged = med.serotonin_risk === true || med.serotoninRisk === true;
        const code = (med.class_code || med.classCode || "").toUpperCase().trim();
        isClassMatch = serotoninClasses.includes(code);
      }

      // Check specifically for Tramadol/Tapentadol by name if classified as OPIOID
      const isTramadolOrTapentadol = upperName.includes("TRAMADOL") || upperName.includes("TAPENTADOL");

      if (isFlagged || isClassMatch || isTramadolOrTapentadol) {
        if (!detectedSerotoninMeds.includes(upperName)) {
          detectedSerotoninMeds.push(upperName);
        }
      }
    });
  }

  // Secondary Check: Inspect medsByClass dictionary
  if (medsByClass && typeof medsByClass === 'object') {
    Object.keys(medsByClass).forEach(classKey => {
      const upperKey = classKey.toUpperCase().trim();
      const isSerotoninClass = serotoninClasses.includes(upperKey);

      const classList = medsByClass[classKey] || [];
      classList.forEach(med => {
        const rawName = extractMedName(med);
        if (!rawName) return;

        const upperName = rawName.toUpperCase();
        const isFlagged = typeof med === 'object' && med !== null && (med.serotonin_risk === true || med.serotoninRisk === true);
        const isTramadolOrTapentadol = upperName.includes("TRAMADOL") || upperName.includes("TAPENTADOL");

        if (isSerotoninClass || isFlagged || isTramadolOrTapentadol) {
          if (!detectedSerotoninMeds.includes(upperName)) {
            detectedSerotoninMeds.push(upperName);
          }
        }
      });
    });
  }

  return detectedSerotoninMeds;
}

// BLEEDING RISK DDI HELPER
function getBleedingRiskMeds(activeMeds, medsByClass) {
  let detectedBleedingMeds = [];
  const bleedingClasses = ["ANTIPLATELET", "ANTICOAGULANT", "NSAID", "ASPIRIN", "CLOPIDOGREL"];

  // 1. Primary Check: Scan activeMeds array
  if (Array.isArray(activeMeds)) {
    activeMeds.forEach(med => {
      const rawName = extractMedName(med);
      if (!rawName) return;

      let isFlagged = false;
      let isClassMatch = false;

      if (typeof med === 'object' && med !== null) {
        isFlagged = med.bleeding_risk === true || med.bleedingRisk === true;
        const code = (med.class_code || med.classCode || "").toUpperCase().trim();
        isClassMatch = bleedingClasses.includes(code);
      }

      if (isFlagged || isClassMatch) {
        const formattedName = rawName.toUpperCase();
        if (!detectedBleedingMeds.includes(formattedName)) {
          detectedBleedingMeds.push(formattedName);
        }
      }
    });
  }

  // 2. Secondary Check: Inspect medsByClass dictionary
  if (medsByClass && typeof medsByClass === 'object') {
    Object.keys(medsByClass).forEach(classKey => {
      const upperKey = classKey.toUpperCase().trim();
      const isBleedingClass = bleedingClasses.includes(upperKey) || upperKey.includes("BLEED");

      const classList = medsByClass[classKey] || [];
      classList.forEach(med => {
        const rawName = extractMedName(med);
        if (!rawName) return;

        const isFlagged = typeof med === 'object' && med !== null && (med.bleeding_risk === true || med.bleedingRisk === true);

        if (isBleedingClass || isFlagged) {
          const formattedName = rawName.toUpperCase();
          if (!detectedBleedingMeds.includes(formattedName)) {
            detectedBleedingMeds.push(formattedName);
          }
        }
      });
    });
  }

  return detectedBleedingMeds;
}

// RESPIRATORY DEPRESSION
function getRespDepMeds(activeMeds, medsByClass) {
  let detectedRespDepMeds = [];
  const respDepClasses = ["OPIOID", "BENZO", "MUSCLE_RELAXANT", "GABAPENTINOID"];

  // 1. Primary Check: Scan activeMeds array
  if (Array.isArray(activeMeds)) {
    activeMeds.forEach(med => {
      const rawName = extractMedName(med);
      if (!rawName) return;

      let isFlagged = false;
      let isClassMatch = false;

      if (typeof med === 'object' && med !== null) {
        isFlagged = med.resp_risk === true;
        const code = (med.class_code || med.classCode || "").toUpperCase().trim();
        isClassMatch = respDepClasses.includes(code);
      }

      if (isFlagged || isClassMatch) {
        const formattedName = rawName.toUpperCase();
        if (!detectedRespDepMeds.includes(formattedName)) {
          detectedRespDepMeds.push(formattedName);
        }
      }
    });
  }

  // 2. Secondary Check: Inspect medsByClass dictionary
  if (medsByClass && typeof medsByClass === 'object') {
    Object.keys(medsByClass).forEach(classKey => {
      const upperKey = classKey.toUpperCase().trim();
      const isRespDepClass = respDepClasses.includes(upperKey) || upperKey.includes("RESP");

      const classList = medsByClass[classKey] || [];
      classList.forEach(med => {
        const rawName = extractMedName(med);
        if (!rawName) return;

        const isFlagged = typeof med === 'object' && med !== null && (med.resp_risk === true);

        if (isRespDepClass || isFlagged) {
          const formattedName = rawName.toUpperCase();
          if (!detectedRespDepMeds.includes(formattedName)) {
            detectedRespDepMeds.push(formattedName);
          }
        }
      });
    });
  }

  return detectedRespDepMeds;
}

function getCnsDepMeds(activeMeds, medsByClass) {
  let detectedCnsDepMeds = [];
  const cnsDepClasses = ["OPIOID", "BENZO", "MUSCLE_RELAXANT", "GABAPENTINOID", "SSRI", "SNRI", "TRAZODONE", "TCA", "ZHYPNO"];

  // 1. Primary Check: Scan activeMeds array
  if (Array.isArray(activeMeds)) {
    activeMeds.forEach(med => {
      const rawName = extractMedName(med);
      if (!rawName) return;

      let isFlagged = false;
      let isClassMatch = false;

      if (typeof med === 'object' && med !== null) {
        isFlagged = med.resp_risk === true;
        const code = (med.class_code || med.classCode || "").toUpperCase().trim();
        isClassMatch = cnsDepClasses.includes(code);
      }

      if (isFlagged || isClassMatch) {
        const formattedName = rawName.toUpperCase();
        if (!detectedCnsDepMeds.includes(formattedName)) {
          detectedCnsDepMeds.push(formattedName);
        }
      }
    });
  }

  // 2. Secondary Check: Inspect medsByClass dictionary
  if (medsByClass && typeof medsByClass === 'object') {
    Object.keys(medsByClass).forEach(classKey => {
      const upperKey = classKey.toUpperCase().trim();
      const isCnsDepClass = cnsDepClasses.includes(upperKey) || upperKey.includes("CNS");

      const classList = medsByClass[classKey] || [];
      classList.forEach(med => {
        const rawName = extractMedName(med);
        if (!rawName) return;

        const isFlagged = typeof med === 'object' && med !== null && (med.cns_risk === true);

        if (isCnsDepClass || isFlagged) {
          const formattedName = rawName.toUpperCase();
          if (!detectedCnsDepMeds.includes(formattedName)) {
            detectedCnsDepMeds.push(formattedName);
          }
        }
      });
    });
  }

  return detectedCnsDepMeds;
}
// Safe datalist populator
function populateDatalist() {
  let datalist = document.getElementById("healthConditionsList");
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = "healthConditionsList";
    document.body.appendChild(datalist);
  }

  const data = window.mapOutputData || (typeof mapOutputData !== "undefined" ? mapOutputData : null);

  if (data && Array.isArray(data) && datalist.children.length === 0) {
    const sortedData = [...data]
      .filter(item => {
        if (!item || !item.mapCategory) return false;
        const cat = item.mapCategory.toLowerCase();
        
        // Exclude Vaccines, K-Sparing, and DDI categories from Section 3 search dropdown
        const isVaccine = cat === "vaccines";
        const isPot = cat.includes("potassium");
        const isDDI = cat.startsWith("ddi") || cat.includes("drug-drug interaction");
        
        return !isVaccine && !isDDI && !isPot;
      })
      .sort((a, b) => a.mapCategory.localeCompare(b.mapCategory));

    datalist.innerHTML = sortedData
      .map(item => `<option value="${item.mapCategory}">`)
      .join("");
  }
}

// Build Section 3 Health Conditions Table Rows
function buildTableRows(rowCount) {
  const tbody = document.getElementById("conditionsTableBody");
  if (!tbody) return;

  populateDatalist();

  let rowsHTML = '';
  for (let i = 1; i <= rowCount; i++) {
    rowsHTML += `
      <tr>
        <td style="text-align: center;">${i}</td>
        <td>
          <input 
            type="text" 
            list="healthConditionsList" 
            name="condition_${i}" 
            data-row="${i}"
            class="condition-cell condition-input" 
            placeholder="Type or select condition..."
            onfocus="populateDatalist();"
            style="width: 98%; padding: 4px;"
          />
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = rowsHTML;
}

// STRICT & SMART MATCHING FOR MAPDATA
function findMapData(categoryName) {
  const data = window.mapOutputData || (typeof mapOutputData !== "undefined" ? mapOutputData : null);
  if (!data || !categoryName) return null;
  
  const query = categoryName.toLowerCase().trim();

  // 1. Try exact match first
  let match = data.find(item => item && item.mapCategory && item.mapCategory.toLowerCase().trim() === query);
  if (match) return match;

  // 2. Try mapCode or category inclusion match
  return data.find(item => {
    if (!item || !item.mapCategory) return false;
    const cat = item.mapCategory.toLowerCase().trim();
    return cat.includes(query) || query.includes(cat);
  });
}

// Master Helper to apply all dynamic drug replacements to text strings
function applyMedicationReplacements(discussText, planText) {
  const { medsByClass, activeMeds } = typeof getActiveMedicationData === "function" 
    ? getActiveMedicationData() 
    : { medsByClass: {}, activeMeds: [] };

  // 1. Insulin Conditional Line Logic
  const insulinList = medsByClass && Array.isArray(medsByClass["INSULIN"]) ? medsByClass["INSULIN"] : [];
  const hasInsulin = insulinList.length > 0;
  const insulinInstruction = "Use the correct insulin type and dose; make sure to rotate injection sites.";
  if (hasInsulin) {
    discussText = discussText.replaceAll("{{INSULIN_INSTRUCTION}}", insulinInstruction);
    planText = planText.replaceAll("{{INSULIN_INSTRUCTION}}", insulinInstruction);
  } else {
    discussText = discussText.replaceAll("{{INSULIN_INSTRUCTION}}", "");
    planText = planText.replaceAll("{{INSULIN_INSTRUCTION}}", "");
  }

  // 2. Clopidogrel + PPI dynamic replacements
  const clopMeds = medsByClass["CLOPIDOGREL"] || [];
  const pantoMeds = medsByClass["PPI_PANTO"] || [];
  const h2Meds = medsByClass["H2RA"] || [];
  const otherPPIMeds = medsByClass["PPI_OTHER"] || [];
  const activePPIs = [...new Set([...pantoMeds, ...h2Meds, ...otherPPIMeds])];

  const clopName = clopMeds.length > 0 ? clopMeds.map(extractMedName).join(", ") : "clopidogrel";
  const ppiName = activePPIs.length > 0 ? activePPIs.map(extractMedName).join(", ") : "proton pump inhibitor (PPI)";

  discussText = discussText.replaceAll("{{CLOPIDOGREL}}", clopName).replaceAll("{{PPI}}", ppiName).replaceAll("_PPI_", ppiName);
  planText = planText.replaceAll("{{CLOPIDOGREL}}", clopName).replaceAll("{{PPI}}", ppiName).replaceAll("_PPI_", ppiName);

  // 3. Potassium-sparing meds
  const aceiMeds = medsByClass["ACEI"] || [];
  const arbMeds = medsByClass["ARB"] || [];
  const kSparingMeds = medsByClass["K_SPARING"] || [];
  const activeKSparing = [...new Set([...aceiMeds, ...arbMeds, ...kSparingMeds])];
  const kSparingName = activeKSparing.length > 0 
    ? activeKSparing.map(extractMedName).join(", ") 
    : "blood pressure or potassium-sparing medication";

  discussText = discussText.replaceAll("{{kSparingMed}}", kSparingName);
  planText = planText.replaceAll("{{kSparingMed}}", kSparingName);

  // BLEEDING RISK PLACEHOLDER REPLACEMENTS
  const detectedBleedingMeds = getBleedingRiskMeds(activeMeds, medsByClass);

  if (detectedBleedingMeds.length >= 2) {
    const bleedA = detectedBleedingMeds[0];
    const bleedB = detectedBleedingMeds.slice(1).join(" and ");

    discussText = discussText.replaceAll("{{BLEED_A}}", bleedA).replaceAll("{{BLEED_B}}", bleedB);
    planText = planText.replaceAll("{{BLEED_A}}", bleedA).replaceAll("{{BLEED_B}}", bleedB);
  } else {
    discussText = discussText.replaceAll("{{BLEED_A}}", "blood thinner").replaceAll("{{BLEED_B}}", "NSAID/antiplatelet");
    planText = planText.replaceAll("{{BLEED_A}}", "blood thinner").replaceAll("{{BLEED_B}}", "NSAID/antiplatelet");
  }

  // SEROTONIN SYNDROME RISK REPLACEMENTS
  const detectedSerotoninMeds = getSerotoninRiskMeds(activeMeds, medsByClass);

  if (detectedSerotoninMeds.length >= 2) {
    const seroA = detectedSerotoninMeds[0];
    const seroB = detectedSerotoninMeds.slice(1).join(" and ");

    discussText = discussText.replaceAll("{{SEROSYN_A}}", seroA).replaceAll("{{SEROSYN_B}}", seroB);
    planText = planText.replaceAll("{{SEROSYN_A}}", seroA).replaceAll("{{SEROSYN_B}}", seroB);
  } else {
    discussText = discussText.replaceAll("{{SEROSYN_A}}", "your serotonergic medication").replaceAll("{{SEROSYN_B}}", "another serotonergic medication");
    planText = planText.replaceAll("{{SEROSYN_A}}", "your serotonergic medication").replaceAll("{{SEROSYN_B}}", "another serotonergic medication");
  }
  // RESPIRATORY DEPRESSION RISK REPLACEMENTS
  const detectedRespDepMeds = getRespDepMeds(activeMeds, medsByClass);

  if (detectedRespDepMeds.length >= 2) {
    const respDepA = detectedRespDepMeds[0];
    const respDepB = detectedRespDepMeds.slice(1).join(" and ");

    discussText = discussText.replaceAll("{{respDepA}}", respDepA).replaceAll("{{respDepB}}", respDepB);
    planText = planText.replaceAll("{{respDepA}}", respDepA).replaceAll("{{respDepB}}", respDepB);
  } else {
    discussText = discussText.replaceAll("{{respDepA}}", "your respiratory depressant").replaceAll("{{respDepB}}", "another respiratory depressant");
    planText = planText.replaceAll("{{respDepA}}", "your respiratory depressant").replaceAll("{{respDepB}}", "another respiratory depressant");
  }

  // CNS DEPRESSION RISK REPLACEMENTS
  const detectedCnsDepMeds = getCnsDepMeds(activeMeds, medsByClass);

  if (detectedRespDepMeds.length >= 2) {
    const cnsDepA = detectedCnsDepMeds[0];
    const cnsDepB = detectedCnsDepMeds.slice(1).join(" and ");

    discussText = discussText.replaceAll("{{cnsDepA}}", cnsDepA).replaceAll("{{cnsDepB}}", cnsDepB);
    planText = planText.replaceAll("{{cnsDepA}}", cnsDepA).replaceAll("{{cnsDepB}}", cnsDepB);
  } else {
    discussText = discussText.replaceAll("{{cnsDepA}}", "your CNS depressant").replaceAll("{{cnsDepB}}", "another CNS depressant");
    planText = planText.replaceAll("{{cnsDepA}}", "your CNS depressant").replaceAll("{{cnsDepB}}", "another CNS depressant");
  }

  // 5. Global Replacement Loop for all direct class_codes
  if (medsByClass) {
    Object.keys(medsByClass).forEach(classCode => {
      const placeholder = `{{${classCode}}}`;
      const drugNames = medsByClass[classCode].map(extractMedName).join(", ");

      discussText = discussText.replaceAll(placeholder, drugNames);
      planText = planText.replaceAll(placeholder, drugNames);
    });
  }

  // 6. Defaults for unselected common classes
  const fallbacks = {
    "{{STATIN}}": "statin",
    "{{PPI}}": "proton pump inhibitor (PPI)",
    "_PPI_": "proton pump inhibitor (PPI)",
    "{{kSparingMed}}": "blood pressure or potassium-sparing medication",
    "{{BISPHOSPHONATE}}": "bisphosphonate medication"
  };

  Object.entries(fallbacks).forEach(([placeholder, fallbackValue]) => {
    discussText = discussText.replaceAll(placeholder, fallbackValue);
    planText = planText.replaceAll(placeholder, fallbackValue);
  });

  return { discussText, planText };
}

// Copy plain text to clipboard (Goal + Plan)
function copyTableToClipboard(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const wrapper = table.closest('.cmr-table-wrapper');
  const categoryName = wrapper ? wrapper.dataset.category : '';

  const matchedData = findMapData(categoryName);
  if (!matchedData) return;

  let discussText = matchedData.mapDiscuss;
  let planText = matchedData.mapPlan;

  // 1. Diabetes Device Replacement
  if (matchedData.mapCategory.toLowerCase() === "diabetes") {
    const { devName, devType, glycemicGoal } = typeof getDeviceValues === "function" 
      ? getDeviceValues() 
      : { devName: "", devType: "", glycemicGoal: "< 7%" };

    discussText = discussText.replaceAll("{{GLYCEMIC_GOAL}}", glycemicGoal);

    planText = planText
      .replaceAll("{{DEVICE_NAME}}", devName)
      .replaceAll("{{DEVICE_TYPE}}", devType)
      .replaceAll("{{GLYCEMIC_GOAL}}", glycemicGoal);
  }

  // 2. Vaccines logic
  if (matchedData.mapCategory.toLowerCase() === "vaccines") {
    const vaccineSelector = '#vaxflu, #vaxcovid, #vaxrsv, #vaxpneu, #vaxshin, #vaxhepb, #vaxtet';
    const checkedVaccineBoxes = document.querySelectorAll(vaccineSelector);

    const selectedVaccines = Array.from(checkedVaccineBoxes)
      .filter(cb => cb.checked)
      .map(cb => {
        const label = document.querySelector(`label[for="${cb.id}"]`);
        return label ? label.textContent.trim() : '';
      })
      .filter(name => name !== '');

    if (selectedVaccines.length > 0) {
      planText = `Schedule online at walgreens.com or walk in to your local Walgreens to receive the following vaccine(s): ${selectedVaccines.join(", ")}.`;
    }
  }

  // 3. Apply Medication Replacements
  const updatedTexts = applyMedicationReplacements(discussText, planText);
  discussText = updatedTexts.discussText;
  planText = updatedTexts.planText;

  // Clean empty lines
  const cleanPlanText = planText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join("\n");

  const plainTextOutput = `${discussText}\n\n${cleanPlanText}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(plainTextOutput).then(() => {
      alert("Text copied to clipboard!");
    }).catch(() => fallbackCopyText(plainTextOutput));
  } else {
    fallbackCopyText(plainTextOutput);
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    alert("Text copied to clipboard!");
  } catch (err) {
    alert("Copy failed. Please manually highlight and copy.");
  }

  document.body.removeChild(textarea);
}

// ==========================================
// 3. MAIN APP INITIALIZATION & SUBMIT LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Build Section 3 table rows
  buildTableRows(25);

  // 2. Main Submit / Generate Button Logic
  const submitBtn = document.getElementById("submitBtn");
  const ptContainer = document.getElementById("ptContainer");

  if (!submitBtn) {
    console.warn("submitBtn not found in DOM");
    return;
  }

  submitBtn.addEventListener("click", () => {
    // --- Part A: Handle Section 1 Patient Info & Warnings ---
    const smokingSelect = document.getElementById("ptSmoke");
    const smokingValue = smokingSelect ? smokingSelect.value : "smokenon";

    const displayVal = document.getElementById("displayValue");
    if (displayVal && smokingSelect && smokingSelect.selectedOptions.length > 0) {
      displayVal.textContent = smokingSelect.selectedOptions[0].text;
    }

    const ageInput = document.getElementById("ptage");
    const warningDisplay = document.getElementById("beersWarning");
    if (ageInput && warningDisplay) {
      const ptAge = Number(ageInput.value);
      warningDisplay.textContent = ptAge >= 65 ? "⚠️ Action Required: Use Beer's Criteria" : "";
    }

    // --- Part B: Handle Section 4 Vaccine Summary Display ---
    const vaccineListContainer = document.getElementById("vaxList");
    if (vaccineListContainer) {
      vaccineListContainer.innerHTML = "";
      const vaccineData = [
        { id: "vaxflu", name: "Flu" },
        { id: "vaxcovid", name: "COVID-19" },
        { id: "vaxrsv", name: "RSV" },
        { id: "vaxpneu", name: "PNEUMONIA" },
        { id: "vaxshin", name: "SHINGLES" },
        { id: "vaxhepb", name: "HEPATITIS B" },
        { id: "vaxtet", name: "TETANUS" }
      ];

      const recommendedVaxes = [];
      vaccineData.forEach(vax => {
        const cb = document.getElementById(vax.id);
        if (cb && cb.checked) recommendedVaxes.push(vax.name);
      });

      const span = document.createElement("span");
      span.textContent = recommendedVaxes.length === 0 ? "No vaccines selected" : recommendedVaxes.join("; ");
      vaccineListContainer.appendChild(span);
    }

    // --- Part C: Generate CMR Tables from mapData.js ---
    if (!ptContainer) return;

    const data = window.mapOutputData || (typeof mapOutputData !== "undefined" ? mapOutputData : null);
    if (!data) {
      alert("Error: mapData.js is not loaded properly.");
      return;
    }

    // Collect Section 3 manual inputs
    const inputs = document.querySelectorAll(".condition-input");
    let selectedCategories = Array.from(inputs)
      .map(input => input.value.trim())
      .filter(val => val !== "");

    // Get active medication state from Section 2
    const { medsByClass, activeMeds } = typeof getActiveMedicationData === "function" 
      ? getActiveMedicationData() 
      : { medsByClass: {}, activeMeds: [] };

    // --- Auto-Trigger 1: Tobacco Use ---
    const hasTobaccoCategory = selectedCategories.some(cat => cat.toLowerCase().includes("tobacco") || cat.toLowerCase().includes("smoking"));
    if (!hasTobaccoCategory && smokingValue !== "smokenon") {
      selectedCategories.push("Tobacco Use / Smoking Cessation");
    }

    // --- Auto-Trigger 2: Vaccines ---
    const vaccineSelector = '#vaxflu, #vaxcovid, #vaxrsv, #vaxpneu, #vaxshin, #vaxhepb, #vaxtet';
    const checkedVaccineBoxes = document.querySelectorAll(vaccineSelector);
    const selectedVaccineNames = Array.from(checkedVaccineBoxes)
      .filter(cb => cb.checked)
      .map(cb => {
        const label = document.querySelector(`label[for="${cb.id}"]`);
        return label ? label.textContent.trim() : '';
      })
      .filter(name => name !== '');

    if (selectedVaccineNames.length > 0 && !selectedCategories.includes("Vaccines")) {
      selectedCategories.push("Vaccines");
    }

    // --- Auto-Trigger 3: Potassium/Kidney Monitoring ---
    const aceiMeds = (medsByClass && medsByClass["ACEI"]) || [];
    const arbMeds = (medsByClass && medsByClass["ARB"]) || [];
    const kSparingMeds = (medsByClass && medsByClass["K_SPARING"]) || [];

    if ((aceiMeds.length + arbMeds.length + kSparingMeds.length) > 0) {
      const kMonCategory = "Potassium/Kidney Monitoring";
      if (!selectedCategories.includes(kMonCategory)) {
        selectedCategories.push(kMonCategory);
      }
    }

    // --- Auto-Trigger 4: DDI Bleeding Risk ---
    const detectedBleedingMeds = getBleedingRiskMeds(activeMeds, medsByClass);

    if (detectedBleedingMeds.length >= 2) {
      const bleedingItem = data.find(item => {
        if (!item || !item.mapCategory) return false;
        const cat = item.mapCategory.toLowerCase();
        return cat.includes("bleeding") || cat.includes("bleed");
      });

      const bleedCategory = bleedingItem ? bleedingItem.mapCategory : "DDI: Bleeding Risk";

      if (!selectedCategories.includes(bleedCategory)) {
        selectedCategories.push(bleedCategory);
      }
    }

    // --- Auto-Trigger 5: DDI Serotonin Syndrome ---
    const detectedSerotoninMeds = getSerotoninRiskMeds(activeMeds, medsByClass);

    if (detectedSerotoninMeds.length >= 2) {
      const serotoninItem = data.find(item => {
        if (!item || !item.mapCategory) return false;
        const cat = item.mapCategory.toLowerCase();
        return cat.includes("serotonin");
      });

      const serotoninCategory = serotoninItem ? serotoninItem.mapCategory : "DDI: Serotonin Syndrome";

      if (!selectedCategories.includes(serotoninCategory)) {
        selectedCategories.push(serotoninCategory);
      }
    }

    // --- Auto-Trigger 6: Clopidogrel + PPI DDI ---
    const hasClopidogrel = medsByClass["CLOPIDOGREL"] && medsByClass["CLOPIDOGREL"].length > 0;
    const pantoMeds = medsByClass["PPI_PANTO"] || [];
    const otherPPIMeds = medsByClass["PPI_OTHER"] || [];
    const hasActivePPI = (pantoMeds.length + otherPPIMeds.length) > 0;

    if (hasClopidogrel && hasActivePPI) {
      const ppiDdiData = data.find(item => item.mapCategory && item.mapCategory.toLowerCase().includes("clopidogrel"));
      const ppiCategory = ppiDdiData ? ppiDdiData.mapCategory : "DDI: Clopidogrel + PPI";

      if (!selectedCategories.includes(ppiCategory)) {
        selectedCategories.push(ppiCategory);
      }
    }

    // --- Auto-Trigger 7: DDI Respiratory Depression ---
    const detectedRespDepMeds = getRespDepMeds(activeMeds, medsByClass);

    if (detectedRespDepMeds.length >= 2) {
      const respDepItem = data.find(item => {
        if (!item || !item.mapCategory) return false;
        const cat = item.mapCategory.toLowerCase();
        return cat.includes("resp");
      });

      const respDepCategory = respDepItem ? respDepItem.mapCategory : "DDI: Respiratory Depression";

      if (!selectedCategories.includes(respDepCategory)) {
        selectedCategories.push(respDepCategory);
      }
    }

    // --- Auto-Trigger 7: DDI Respiratory Depression ---
    const detectedCnsDepMeds = getCnsDepMeds(activeMeds, medsByClass);

    if (detectedCnsDepMeds.length >= 2) {
      const cnsDepItem = data.find(item => {
        if (!item || !item.mapCategory) return false;
        const cat = item.mapCategory.toLowerCase();
        return cat.includes("cns");
      });

      const cnsDepCategory = cnsDepItem ? cnsDepItem.mapCategory : "DDI: CNS Depression";

      if (!selectedCategories.includes(cnsDepCategory)) {
        selectedCategories.push(cnsDepCategory);
      }
    }

    // Guard Check: Stop if no categories or auto-triggers were selected
    if (selectedCategories.length === 0) {
      ptContainer.innerHTML = "<p><em>No conditions or vaccines selected.</em></p>";
      return;
    }

    // Sort categories by mapOrder
    selectedCategories.sort((a, b) => {
      const itemA = findMapData(a);
      const itemB = findMapData(b);
      const orderA = itemA && itemA.mapOrder !== undefined ? itemA.mapOrder : 999;
      const orderB = itemB && itemB.mapOrder !== undefined ? itemB.mapOrder : 999;
      return orderA - orderB;
    });

    let outputHTML = "";
    selectedCategories.forEach((categoryName, index) => {
      const matchedData = findMapData(categoryName);
      if (matchedData) {
        let discussText = matchedData.mapDiscuss;
        let planText = matchedData.mapPlan;

        // 1. Diabetes device values
        if (matchedData.mapCategory.toLowerCase() === "diabetes") {
          const { devName, devType, glycemicGoal } = typeof getDeviceValues === "function" 
            ? getDeviceValues() 
            : { devName: "", devType: "", glycemicGoal: "< 7%" };

          discussText = discussText.replaceAll("{{GLYCEMIC_GOAL}}", glycemicGoal);
          planText = planText
            .replaceAll("{{DEVICE_NAME}}", devName)
            .replaceAll("{{DEVICE_TYPE}}", devType)
            .replaceAll("{{GLYCEMIC_GOAL}}", glycemicGoal);
        }

        // 2. Tobacco history adjustments
        if (matchedData.mapCategory.toLowerCase().includes("tobacco") || matchedData.mapCategory.toLowerCase().includes("smoking")) {
          if (smokingValue === "smokefor") {
            discussText = "Discussed tobacco history and strategies for maintaining long-term abstinence.";
            planText = "Continue to abstain from smoking and avoid exposure to secondhand smoke.";
          } else if (smokingValue === "smokenon") {
            return; // Skip table for non-smokers
          }
        }

        // 3. Vaccine selection plan update
        if (matchedData.mapCategory.toLowerCase() === "vaccines" && selectedVaccineNames.length > 0) {
          planText = `Schedule online at walgreens.com or walk in to your local Walgreens to receive the following vaccine(s): ${selectedVaccineNames.join(", ")}.`;
        }

        // 4. Run master replacements
        const updatedTexts = applyMedicationReplacements(discussText, planText);
        discussText = updatedTexts.discussText;
        planText = updatedTexts.planText;

        // 5. Build HTML output
        const planItems = planText
          .split("\n")
          .map(item => item.trim())
          .filter(item => item.length > 0)
          .map(item => `<li>${item}</li>`)
          .join("");

        const tableId = `cmr-table-${index}`;

        outputHTML += `
          <div class="cmr-table-wrapper" style="margin-bottom: 30px;" data-category="${matchedData.mapCategory}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="margin: 0;">${matchedData.mapCategory} <span style="color: #666; font-size: 0.85em;">(${matchedData.mapCode})</span></h3>
              <button type="button" class="copy-btn" onclick="copyTableToClipboard('${tableId}')" style="padding: 5px 10px; cursor: pointer;">
                📋 Copy Text
              </button>
            </div>

            <table id="${tableId}" border="1" style="border-collapse: collapse; width: 100%; text-align: left; font-family: Arial, sans-serif;">
              <tbody>
                <tr>
                  <th style="background-color: #f2f2f2; padding: 8px; width: 25%; vertical-align: top;">
                    What did I discuss with the patient / Goal?
                  </th>
                  <td class="copyable-discuss" style="padding: 10px; width: 75%; vertical-align: top;">
                    ${discussText}
                  </td>
                </tr>
                <tr>
                  <th style="background-color: #f2f2f2; padding: 8px; width: 25%; vertical-align: top;">
                    What action does the patient need to take?
                  </th>
                  <td class="copyable-plan" style="padding: 10px; width: 75%; vertical-align: top;">
                    <ul style="margin: 0; padding-left: 20px;">
                      ${planItems}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      } else {
        outputHTML += `
          <div class="cmr-table-wrapper" style="margin-bottom: 25px;">
            <h3>${categoryName}</h3>
            <p><em>No matching guidelines found in mapData.js.</em></p>
          </div>
        `;
      }
    });

    ptContainer.innerHTML = outputHTML;
  });
});
