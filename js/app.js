let customer = {
	table: '',
	time: '',
	order: [],
};

const categories = {
	1: 'meal',
	2: 'Drink',
	3: 'Dessert',
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

/**
 * Shows hidden sections by removing the 'd-none' class from them.
 */
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
		foodPlateName.classList.add('col-md-4');
		foodPlateName.textContent = name;

		const foodPlatePrice = document.createElement('DIV');
		foodPlatePrice.classList.add('col-md-3', 'fw-bold');
		foodPlatePrice.textContent = `$${price}`;

		const foodPlateCategory = document.createElement('DIV');
		foodPlateCategory.classList.add('col-md-3');
		foodPlateCategory.textContent = categories[category];

		const foodPlateOrder = document.createElement('INPUT');
		foodPlateOrder.classList.add('form-control');
		foodPlateOrder.type = 'number';
		foodPlateOrder.min = 0;
		foodPlateOrder.value = 0;
		foodPlateOrder.id = `foodPlate-${id}`;

		foodPlateOrder.onchange = function () {
			const quantity = parseInt(foodPlateOrder.value);
			addFoodPlateOrder({ ...foodPlate, quantity });
		};

		const foodPlateOrderContainer = document.createElement('DIV');
		foodPlateOrderContainer.classList.add('col-md-2');
		foodPlateOrderContainer.appendChild(foodPlateOrder);

		row.appendChild(foodPlateName);
		row.appendChild(foodPlatePrice);
		row.appendChild(foodPlateCategory);
		row.appendChild(foodPlateOrderContainer);

		content.appendChild(row);
	});
}

function addFoodPlateOrder(product) {
	let { order } = customer;

	if (product.quantity > 0) {
		if (order.some(item => item.id === product.id)) {
			const orderUpdated = order.map(item => {
				if (item.id === product.id) {
					item.quantity = product.quantity;
				}
				return item;
			});
			customer.order = [...orderUpdated];
		} else {
			customer.order = [...order, product];
		}
	} else {
		console.log('No es mayor a 0');
	}
	console.log(customer.order);
}
