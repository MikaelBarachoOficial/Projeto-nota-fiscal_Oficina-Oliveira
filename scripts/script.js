document.addEventListener('DOMContentLoaded', () => {
    const addNotaButton = document.querySelector('.inputs input[type="submit"]');
    const notaNumberInput = document.querySelector('.inputs input[placeholder="Número da nota"]');
    const notaValueInput = document.querySelector('.inputs input[placeholder="Valor da nota"]');
    const dateInput = document.getElementById('date-input');
    const tableBody = document.querySelector('table tbody');
    
    dateInput.value = new Date().toLocaleDateString('pt-BR');

    // Function to add a new nota
    function addNota() {
        const notaNumber = notaNumberInput.value;
        const notaValue = notaValueInput.value;
        const notaDate = new Date().toLocaleDateString('pt-BR');

        dateInput.value = notaDate;

        if (notaNumber && notaValue) {
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td><input type="text" value="${notaNumber}" required></td>
                <td><input type="text" value="R$ ${notaValue}" required></td>
                <td><input type="text" value="${notaDate}" required></td>
                <td><input class="delete-nota-btn" type="button"></td>
            `;

            tableBody.appendChild(newRow);
            clearInputs();
        }
    }

    // Function to clear input fields
    function clearInputs() {
        notaNumberInput.value = '';
        notaValueInput.value = '';
    }

    // Function to delete a nota
    function deleteNota(event) {
        if (event.target.classList.contains('delete-nota-btn')) {
            const row = event.target.closest('tr');
            tableBody.removeChild(row);
        }
    }

    // Event listener for adding a nota
    addNotaButton.addEventListener('click', (event) => {
        event.preventDefault();
        addNota();
    });

    // Event listener for deleting a nota
    tableBody.addEventListener('click', deleteNota);
});