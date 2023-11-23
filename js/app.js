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
		const result = order.filter(item => item.id !== product.id);
		customer.order = [...result];
	}
	cleanHTML();

	updateSummary();
}

function updateSummary() {
	const content = document.querySelector('#summary .content');

	const summary = document.createElement('DIV');
	summary.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

	const table = document.createElement('P');
	table.classList.add('fw-bold');
	table.textContent = `Table: `;

	const tableSpan = document.createElement('SPAN');
	tableSpan.classList.add('fw-normal');
	tableSpan.textContent = customer.table;

	const time = document.createElement('P');
	time.classList.add('fw-bold');
	time.textContent = `time: `;

	const timeSpan = document.createElement('SPAN');
	timeSpan.classList.add('fw-normal');
	timeSpan.textContent = customer.time;

	table.appendChild(tableSpan);
	time.appendChild(timeSpan);

	const heading = document.createElement('H3');
	heading.classList.add('my-4', 'text-center');
	heading.textContent = 'Dishes consumed';

	const group = document.createElement('UL');
	group.classList.add('list-group');

	const { order } = customer;
	order.forEach(item => {
		const { name, price, quantity, id } = item;

		const listItem = document.createElement('LI');
		listItem.classList.add('list-group-item');

		const nameElement = document.createElement('H4');
		nameElement.classList.add('my-3');
		nameElement.textContent = name;

		const quantityElement = document.createElement('P');
		quantityElement.classList.add('fw-bold');
		quantityElement.textContent = `Quantity: `;

		const quantitySpan = document.createElement('SPAN');
		quantitySpan.classList.add('fw-normal');
		quantitySpan.textContent = quantity;

		const priceElement = document.createElement('P');
		priceElement.classList.add('fw-bold');
		priceElement.textContent = `Price: `;

		const priceSpan = document.createElement('SPAN');
		priceSpan.classList.add('fw-normal');
		priceSpan.textContent = `$${price}`;

		const subtotal = document.createElement('P');
		subtotal.classList.add('fw-bold');
		subtotal.textContent = `Subtotal: `;

		const subtotalSpan = document.createElement('SPAN');
		subtotalSpan.classList.add('fw-normal');
		subtotalSpan.textContent = calculateSubtotal(price, quantity);

		const deleteButton = document.createElement('BUTTON');
		deleteButton.classList.add('btn', 'btn-danger', 'float-end');
		deleteButton.textContent = 'Delete dish';

		deleteButton.onclick = function () {
			deleteProduct(id);
		};

		quantityElement.appendChild(quantitySpan);
		priceElement.appendChild(priceSpan);
		subtotal.appendChild(subtotalSpan);

		listItem.appendChild(nameElement);
		listItem.appendChild(quantityElement);
		listItem.appendChild(priceElement);
		listItem.appendChild(subtotal);
		listItem.appendChild(deleteButton);

		group.appendChild(listItem);
	});

	summary.appendChild(table);
	summary.appendChild(time);
	summary.appendChild(heading);
	summary.appendChild(group);

	content.appendChild(summary);
}

function cleanHTML() {
	const content = document.querySelector('#summary .content');
	while (content.firstChild) {
		content.removeChild(content.firstChild);
	}
}

function calculateSubtotal(price, quantity) {
	return `$${price * quantity}`;
}

function deleteProduct(id) {
	const { order } = customer;
	const result = order.filter(item => item.id !== id);
	customer.order = [...result];

	cleanHTML();
	updateSummary();
}
