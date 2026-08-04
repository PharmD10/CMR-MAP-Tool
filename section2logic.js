document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('medicationsTableBody');

    // 1. Build options HTML from lookupMed once
    const medicationOptionsHtml = lookupMed
        .map(item => `<option value="${item.name}">${item.name}</option>`)
        .join('');

    // 2. Generate the 25 rows dynamically
    let rowsHtml = '';
    for (let i = 1; i <= 25; i++) {
        rowsHtml += `
            <tr>
                <td>${i}</td>
                <td>
                    <select class="medication-select" data-row="${i}">
                        <option value="">-- Select Medication --</option>
                        ${medicationOptionsHtml}
                    </select>
                </td>
                <td class="class-cell" id="class-row-${i}"></td>
            </tr>
        `;
    }
    tableBody.innerHTML = rowsHtml;

    // 3. Listen for changes on individual dropdowns
    tableBody.addEventListener('change', (event) => {
        if (event.target.classList.contains('medication-select')) {
            const rowNum = event.target.getAttribute('data-row');
            const selectedName = event.target.value;
            const targetClassCell = document.getElementById(`class-row-${rowNum}`);

            if (!selectedName) {
                targetClassCell.innerText = "";
                return;
            }

            const matchedDrug = lookupMed.find(item => item.name && item.name.toUpperCase() === selectedName.toUpperCase());

            if (matchedDrug) {
                targetClassCell.innerText = matchedDrug.class_label;
            } else {
                targetClassCell.innerText = "Unknown — verify class";
            }
        }
    });

    // 4. Paste event listener
    document.addEventListener('paste', (event) => {
        const clipboardData = (event.clipboardData || window.clipboardData).getData('text');
        if (!clipboardData) return;

        const lines = clipboardData
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (lines.length === 0) return;

        event.preventDefault();

        const selects = Array.from(document.querySelectorAll('.medication-select'));

        // Find which row is currently focused/clicked, default to first row if none
        const activeElement = document.activeElement;
        let startIndex = selects.findIndex(sel => sel === activeElement);
        if (startIndex === -1) startIndex = 0;

        lines.forEach((pastedName, offset) => {
            const targetIndex = startIndex + offset;
            if (targetIndex < selects.length) {
                const select = selects[targetIndex];
                const targetUpper = pastedName.toUpperCase();

                // Look for an exact case-insensitive match in lookupMed/options
                let matchingOption = Array.from(select.options).find(
                    opt => opt.value.toUpperCase() === targetUpper
                );

                if (matchingOption) {
                    select.value = matchingOption.value;
                } else {
                    // IF NO MATCH: Add dynamically as a new custom option so text isn't lost
                    const newOption = document.createElement('option');
                    newOption.value = pastedName;
                    newOption.textContent = `${pastedName} (Unmatched)`;
                    select.appendChild(newOption);
                    select.value = pastedName;
                }

                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
});
