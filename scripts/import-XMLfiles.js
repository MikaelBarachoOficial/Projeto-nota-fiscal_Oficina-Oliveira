document.getElementById('import-XMLfiles').addEventListener('click', async () => {
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
});

function parseXML(xmlString) {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    const invoiceNumberElement = xmlDoc.querySelector('nNF');
    const invoiceValueElement = xmlDoc.querySelector('vNF');
    const invoiceDateElement = xmlDoc.querySelector('dhEmi');

    if (invoiceNumberElement && invoiceValueElement && invoiceDateElement) {

        const invoiceNumber = invoiceNumberElement.textContent;
        const invoiceValue = invoiceValueElement.textContent;
        const invoiceDateTime = invoiceDateElement.textContent;

        const invoiceDate = new Date(invoiceDateTime).toLocaleDateString('pt-BR');

        console.log(invoiceNumber);
        console.log(invoiceValue);
        console.log(invoiceDate);

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
             <td><input type="text" value="R$ ${value}" required readonly></td>
             <td><input type="text" value="${date}" required readonly></td>
             <td><input class="delete-nota-btn" type="button"></td>
         `;

    tableBody.appendChild(row);
}