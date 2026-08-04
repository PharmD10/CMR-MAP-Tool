// section5.js - Section 5 Diabetic Testing Device Logic

// Check if "Diabetes" is in Section 3 and toggle Section 5 state
function checkDiabetesPresence() {
  const conditionsTable = document.getElementById("conditionsTableBody");
  const section5Fieldset = document.getElementById("section5Fieldset");
  if (!conditionsTable || !section5Fieldset) return;

  const inputs = conditionsTable.querySelectorAll(".condition-input");
  const hasDiabetes = Array.from(inputs).some(input => 
    input.value.trim().toLowerCase().includes("diabetes")
  );

  if (hasDiabetes) {
    section5Fieldset.removeAttribute("disabled");
    section5Fieldset.style.opacity = "1.0";
  } else {
    section5Fieldset.setAttribute("disabled", "disabled");
    section5Fieldset.style.opacity = "0.5";
  }
}

// Helper function to extract formatted device name, type, and glycemic goal
function getDeviceValues() {
  const devNameInput = document.getElementById("dmdevname");
  const devTypeSelect = document.getElementById("dmdevtype");

  const devName = devNameInput && devNameInput.value.trim() !== "" 
    ? devNameInput.value.trim() 
    : "glycemic device";

  const devTypeVal = devTypeSelect ? devTypeSelect.value : "dmcgm";
  const devType = devTypeSelect && devTypeSelect.selectedIndex !== -1
    ? devTypeSelect.options[devTypeSelect.selectedIndex].text 
    : "CGM";

  // Set goal based on CGM vs SMBG selection
  const glycemicGoal = devTypeVal === "dmcgm" || devType.toUpperCase().includes("CGM")
    ? "time in range >70%"
    : "A1c <7%";

  return { devName, devType, glycemicGoal };
}

// Attach event listeners on DOM load
document.addEventListener("DOMContentLoaded", () => {
  const conditionsTable = document.getElementById("conditionsTableBody");
  
  if (conditionsTable) {
    conditionsTable.addEventListener("input", checkDiabetesPresence);
    conditionsTable.addEventListener("change", checkDiabetesPresence);
  }

  // Initial state check on load
  checkDiabetesPresence();
});
