const exportBtn = document.querySelector('input[value="Exportar para .xlsx"]');
const table = document.querySelector('table');
const totalValueField = document.getElementById('total-value');

exportBtn.addEventListener('click', () => {
    const workbook = XLSX.utils.book_new();
    const wsData = [];

    // Add table headers
    const headers = [];
    table.querySelectorAll('thead th').forEach(th => {
        headers.push(th.textContent);
    });
    wsData.push(headers);

    // Add table rows
    table.querySelectorAll('tbody tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td input').forEach(input => {
            row.push(input.value);
        });
        wsData.push(row);
    });

    // Add total value
    wsData.push(['', '', 'Total', totalValueField.value]);

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notas Fiscais');

    XLSX.writeFile(workbook, 'notas_fiscais.xlsx');
    
// Adjust column widths
const maxLengths = headers.map((header, i) => Math.max(header.length, ...wsData.slice(1).map(row => row[i].length)));
worksheet['!cols'] = maxLengths.map(length => ({ wch: length + 2 })); // Adding some padding

XLSX.writeFile(workbook, 'notas_fiscais.xlsx');
});