let customer = {
	table: '',
	time: '',
	order: [],
};

const btnSaveCustomer = document.querySelector('#saveCustomer');
btnSaveCustomer.addEventListener('click', saveCustomer);

function saveCustomer() {
	const table = document.querySelector('#table').value;
	const time = document.querySelector('#time').value;

	const emptyFields = [table, time].some(field => field === '');

	if (emptyFields) {
		const alertExist = document.querySelector('.invalid-feedback');

		if (!alertExist) {
			const alert = document.createElement('DIV');
			alert.classList.add('invalid-feedback', 'd-block', 'text-center');
			alert.textContent = 'All fields are required';
			document.querySelector('.modal-body form').appendChild(alert);

			setTimeout(() => {
				alert.remove();
			}, 3000);
		}
		return;
	}
	customer = { ...customer, table, time };

	const modalForm = document.querySelector('#form');
	const modal = bootstrap.Modal.getInstance(modalForm);
	modal.hide();

	showSections();
	getFoodPlates();
}

function showSections() {
	const hideSections = document.querySelectorAll('.d-none');
	hideSections.forEach(section => section.classList.remove('d-none'));
}

function getFoodPlates() {
    const url = 'http://localhost:3000/foodPlates';
    
    fetch(url)
        .then(response => response.json())
        .then(data => showFoodPlates(data))
        .catch(error => console.log(error));
}
