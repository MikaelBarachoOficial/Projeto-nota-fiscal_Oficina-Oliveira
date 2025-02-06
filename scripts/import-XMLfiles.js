const importXMLfilesBtn = document.getElementById('import-XMLfiles');

const tableBody = document.querySelector('table tbody');
const tableHead = document.querySelector('table thead');

const clearTableBtn = document.getElementById('clear-table-btn');

const totalValueField = document.getElementById('total-value');
var totalValue = 0;

importXMLfilesBtn.addEventListener('click', async () => {
    const pickerOpts = {
        types: [
            {
                description: 'XML Files',
                accept: {
                    'application/xml': ['.xml']
                }
            }
        ],
        excludeAcceptAllOption: true,
        multiple: true
    };

    try {
        const files = await window.showDirectoryPicker(pickerOpts);
        for await (const entry of files.values()) {
            if (entry.kind === 'file' && entry.name.endsWith('.xml')) {
                const file = await entry.getFile();
                const text = await file.text();
                parseXML(text);
            }
        }
    } catch (err) {
        console.error('Error selecting files:', err);
    }

    toggleVisibility();
    totalValueField.value = `R$ ${totalValue.toFixed(2)}`;
});


function parseXML(xmlString) {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    const invoiceNumberElement = xmlDoc.querySelector('nNF');
    const invoiceValueElement = xmlDoc.querySelector('vNF');
    const invoiceDateElement = xmlDoc.querySelector('dhEmi');

    if (invoiceNumberElement && invoiceValueElement && invoiceDateElement) {

        const invoiceNumber = invoiceNumberElement.textContent;
        let invoiceValue = invoiceValueElement.textContent;
        const invoiceDateTime = invoiceDateElement.textContent;

        console.log(invoiceValue);

        invoiceValue = parseFloat(invoiceValue);
        if (!isNaN(invoiceValue)) {
            totalValue += invoiceValue;
            totalValue = parseFloat(totalValue.toFixed(2)); // Ensure totalValue is a number with 2 decimal places
            console.log(totalValue);
        }

        const invoiceDate = new Date(invoiceDateTime).toLocaleDateString('pt-BR');

        // Add the extracted invoice data to the table
        addInvoiceToTable(invoiceNumber, invoiceValue, invoiceDate);

    } else {
        console.error('Error: nNF element not found in the XML document');
    }

}

function addInvoiceToTable(number, value, date) {
    const tableBody = document.querySelector('table tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
             <td><input type="text" value="${number}" required readonly></td>
             <td><input type="text" value="R$ ${parseFloat(value).toFixed(2)}" id="invoiceValueField" required readonly></td>
             <td><input type="text" value="${date}" required readonly></td>
             <td><input class="delete-nota-btn" type="button"></td>
         `;

    tableBody.appendChild(row);
}

function deleteNota(event) {
    if (event.target.classList.contains('delete-nota-btn')) {
        const row = event.target.closest('tr');
        const valueCell = row.querySelector('td:nth-child(2) input');
        if (valueCell) {
            const value = parseFloat(valueCell.value.replace('R$', '').trim());
            if (!isNaN(value)) {
                totalValue -= value;
                totalValue = parseFloat(totalValue.toFixed(2)); // Ensure totalValue is a number with 2 decimal places
                console.log(totalValue);
            }
        }
        tableBody.removeChild(row);
        toggleVisibility(); // Ensure visibility is toggled after deleting a row
        totalValueField.value = `R$ ${totalValue.toFixed(2)}`; // Update total value display
    }
}

tableBody.addEventListener('click', deleteNota);

clearTableBtn.addEventListener('click', () => {
    tableBody.innerHTML = '';
    totalValue = 0;
    toggleVisibility();
})

function toggleVisibility() {
    if (tableBody.children.length === 0) {
        tableHead.classList.add('hidden');
        clearTableBtn.classList.add('hidden');
        totalValueField.classList.add('hidden');
    } else {
        tableHead.classList.remove('hidden');
        clearTableBtn.classList.remove('hidden');
        totalValueField.classList.remove('hidden');
    }
}