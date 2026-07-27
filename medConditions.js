document.addEventListener('DOMContentLoaded', () => {
    // 1. Target Section 3 table body
    const conditionsTableBody = document.getElementById('conditionsTableBody'); 
    // Make sure your Section 3 <tbody> has id="conditionsTableBody"

    if (!conditionsTableBody) return;

    // 2. Build datalist options from lookupCon
    const conditionOptionsHtml = lookupCon
        .map(item => `<option value="${item.name}">`)
        .join('');

    // 3. Generate rows with inputs tied to the datalist
    let rowsHtml = '';
    for (let i = 1; i <= 25; i++) {
        rowsHtml += `
            <tr>
                <td>${i}</td>
                <td>
                    <input type="text" list="conditions-list" class="condition-input" data-row="${i}" placeholder="Type condition...">
                </td>
            </tr>
        `;
    }

    // Attach shared datalist
    rowsHtml += `<datalist id="conditions-list">${conditionOptionsHtml}</datalist>`;
    conditionsTableBody.innerHTML = rowsHtml;
});