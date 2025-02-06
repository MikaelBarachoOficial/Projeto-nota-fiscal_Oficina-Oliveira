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
        tr.querySelectorAll('td input').forEach((input, index) => {
            let value = input.value;
            if (index === 2) { // Assuming the price value is in the third column
                value = parseFloat(formatNumberToXLSX(value));
            }
            row.push(value);
        });
        wsData.push(row);
    });

    // Add total value
    let totalValue = formatNumberToXLSX(totalValueField.value);
    wsData.push(['', 'Total:', totalValue]);

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

 // Format the price cells as currency
 const priceColumnIndex = 2; // Assuming the price value is in the second column
 wsData.forEach((row, rowIndex) => {
     if (rowIndex > 0 && row[priceColumnIndex] !== undefined) { // Skip the header row
         const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: priceColumnIndex });
         if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
         worksheet[cellAddress].t = 'n'; // Set cell type to number
         worksheet[cellAddress].z = 'R$ #,##0.00'; // Set cell format to currency
     }
 });

 // Format the total value cell as currency
 const totalValueCellAddress = XLSX.utils.encode_cell({ r: wsData.length - 1, c: 2 });
 if (!worksheet[totalValueCellAddress]) worksheet[totalValueCellAddress] = {};
 worksheet[totalValueCellAddress].t = 'n'; // Set cell type to number
 worksheet[totalValueCellAddress].z = 'R$ #,##0.00'; // Set cell format to currency
 
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notas Fiscais');

    XLSX.writeFile(workbook, 'notas_fiscais.xlsx');
    
// Adjust column widths
const maxLengths = headers.map((header, i) => Math.max(header.length, ...wsData.slice(1).map(row => row[i] !== undefined ? row[i].toString().length : 0)));
worksheet['!cols'] = maxLengths.map(length => ({ wch: length + 2 })); // Adding some padding

XLSX.writeFile(workbook, 'notas_fiscais.xlsx');
});

function formatNumberToXLSX(value) {
    return value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
}