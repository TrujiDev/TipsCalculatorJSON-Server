let customer = {
	table: '',
	time: '',
	order: [],
};

const categories = {
    1: 'meal',
    2: 'Drink',
    3: 'Dessert',
}

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

function showFoodPlates(foodPlates) { 
    const content = document.querySelector('#foodPlates .content');

    foodPlates.forEach(foodPlate => { 
        const { id, name, price, category } = foodPlate;

        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const foodPlateName = document.createElement('DIV');
        foodPlateName.classList.add('col-md-4',);
        foodPlateName.textContent = name;

        const foodPlatePrice = document.createElement('DIV');
        foodPlatePrice.classList.add('col-md-3', 'fw-bold');
        foodPlatePrice.textContent = `$${price}`;

        const foodPlateCategory = document.createElement('DIV');
        foodPlateCategory.classList.add('col-md-3');
        foodPlateCategory.textContent = categories[category];

        row.appendChild(foodPlateName);
        row.appendChild(foodPlatePrice);
        row.appendChild(foodPlateCategory);

        content.appendChild(row);
    });
}
