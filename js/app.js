let customer = {
	table: '',
	time: '',
	order: '',
};

const btnSaveCustomer = document.getElementById('saveCustomer');
btnSaveCustomer.addEventListener('click', saveCustomer);

function saveCustomer() {
    const table = document.getElementById('table');
    const time = document.getElementById('time');

    const emptyFields = [table, time].some(field => field.value === '');

    if (emptyFields) {
        console.log('At least one field is empty');
    } else {
        console.log('All fields are filled');
    }
}
