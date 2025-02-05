const dateInput = document.getElementById('date-input');

document.addEventListener('DOMContentLoaded', e => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    dateInput.value = `${day}/${month}/${year}`;
});

