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

// Build Section 3 Health Conditions Table Rows
function buildTableRows(rowCount) {
  const tbody = document.getElementById("conditionsTableBody");
  if (!tbody) return;

  // 1. Create or update the datalist separately
  let datalist = document.getElementById("healthConditionsList");
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = "healthConditionsList";
    document.body.appendChild(datalist); // Append to body so it doesn't break tbody rendering
  }

  if (typeof mapOutputData !== "undefined" && Array.isArray(mapOutputData)) {
    const sortedData = [...mapOutputData]
      .filter(item => item.mapCategory && item.mapCategory.toLowerCase() !== "vaccines")
      .sort((a, b) => a.mapCategory.localeCompare(b.mapCategory));

    datalist.innerHTML = sortedData
      .map(item => `<option value="${item.mapCategory}">`)
      .join("");
  }

  // 2. Build rows only for tbody
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
            style="width: 98%; padding: 4px;"
          />
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = rowsHTML;
}

// Find items by exact match OR partial match in mapOutputData
function findMapData(categoryName) {
  if (typeof mapOutputData === "undefined") return null;
  const query = categoryName.toLowerCase().trim();
  return mapOutputData.find(item => {
    if (!item.mapCategory) return false;
    const cat = item.mapCategory.toLowerCase();
    return cat === query || cat.includes(query) || query.includes(cat);
  });
}

// Copy plain text to clipboard (Goal + Plan)
function copyTableToClipboard(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const wrapper = table.closest('.cmr-table-wrapper');
  const categoryName = wrapper ? wrapper.dataset.category : '';

  if (typeof mapOutputData === "undefined") return;

  const matchedData = findMapData(categoryName);
  if (!matchedData) return;

  let planText = matchedData.mapPlan;

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

  const plainTextOutput = `${matchedData.mapDiscuss}\n\n${planText}`;

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
  // 1. ALWAYS build Section 3 table rows first!
  buildTableRows(25);

  // 2. Main Submit Button Logic
  const submitBtn = document.getElementById("submitBtn");
  const ptContainer = document.getElementById("ptContainer");

  if (!submitBtn) {
    console.warn("submitBtn not found in DOM");
    return;
  }
  submitBtn.addEventListener("click", () => {
    // --- Part A: Handle Patient Info & Warnings ---
    const smokeStatus = document.getElementById("ptSmoke");
    if (smokeStatus && smokeStatus.selectedOptions.length > 0) {
      const displayVal = document.getElementById("displayValue");
      if (displayVal) displayVal.textContent = smokeStatus.selectedOptions[0].text;
    }

    const ageInput = document.getElementById("ptage");
    const warningDisplay = document.getElementById("beersWarning");
    if (ageInput && warningDisplay) {
      const ptAge = Number(ageInput.value);
      warningDisplay.textContent = ptAge >= 65 ? "⚠️ Action Required: Use Beer's Criteria" : "";
    }

    // --- Part B: Handle Vaccine Summary Display ---
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

    if (typeof mapOutputData === "undefined") {
      alert("Error: mapData.js is not loaded.");
      return;
    }

    const inputs = document.querySelectorAll(".condition-input");
    const selectedCategories = Array.from(inputs)
      .map(input => input.value.trim())
      .filter(val => val !== "");

    // Get checked vaccine boxes for mapping
    const vaccineSelector = '#vaxflu, #vaxcovid, #vaxrsv, #vaxpneu, #vaxshin, #vaxhepb, #vaxtet';
    const checkedVaccineBoxes = document.querySelectorAll(vaccineSelector);
    const selectedVaccineNames = Array.from(checkedVaccineBoxes)
      .filter(cb => cb.checked)
      .map(cb => {
        const label = document.querySelector(`label[for="${cb.id}"]`);
        return label ? label.textContent.trim() : '';
      })
      .filter(name => name !== '');

    if (selectedVaccineNames.length > 0) {
      selectedCategories.push("Vaccines");
    }

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
        let planText = matchedData.mapPlan;

        if (matchedData.mapCategory.toLowerCase() === "vaccines" && selectedVaccineNames.length > 0) {
          planText = `Schedule online at walgreens.com or walk in to your local Walgreens to receive the following vaccine(s): ${selectedVaccineNames.join(", ")}.`;
        }

        const planItems = planText
          .split("\n")
          .map(item => item.trim())
          .filter(item => item !== "")
          .map(item => `<li>${item}</li>`)
          .join("");

        const tableId = `cmr-table-${index}`;

        outputHTML += `
          <div class="cmr-table-wrapper" style="margin-bottom: 30px;" data-category="${categoryName}">
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
                    ${matchedData.mapDiscuss}
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