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

/**
 * Saves the customer information and performs validation on the input fields.
 * If any field is empty, it displays an error message.
 * Otherwise, it updates the customer object with the table and time values,
 * hides the modal form, and calls the showSections and getFoodPlates functions.
 */
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

/**
 * Fetches food plates from the server and displays them.
 */
function getFoodPlates() {
	const url = 'http://localhost:3000/foodPlates';

	fetch(url)
		.then(response => response.json())
		.then(data => showFoodPlates(data))
		.catch(error => console.log(error));
}

/**
 * Renders the food plates on the webpage.
 *
 * @param {Array} foodPlates - An array of food plates to be displayed.
 */
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

/**
 * Adds a food plate order to the customer's order list.
 * @param {Object} product - The product to be added to the order.
 */
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

	if (customer.order.length) {
		updateSummary();
	} else {
		resetDOM();
	}
}

/**
 * Updates the summary section with the customer's table, time, and list of dishes consumed.
 */
function updateSummary() {
	const content = document.querySelector('#summary .content');

	const summary = document.createElement('DIV');
	summary.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

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
		deleteButton.classList.add('btn', 'btn-danger');
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

	summary.appendChild(heading);
	summary.appendChild(table);
	summary.appendChild(time);
	summary.appendChild(group);

	content.appendChild(summary);

	tipForm();
}

/**
 * Removes all child elements from the 'content' element in the HTML document.
 */
function cleanHTML() {
	const content = document.querySelector('#summary .content');
	while (content.firstChild) {
		content.removeChild(content.firstChild);
	}
}

/**
 * Calculates the subtotal based on the price and quantity.
 * @param {number} price - The price of the item.
 * @param {number} quantity - The quantity of the item.
 * @returns {string} The subtotal formatted as a string.
 */
function calculateSubtotal(price, quantity) {
	return `$${price * quantity}`;
}

/**
 * Deletes a product from the customer's order.
 * @param {number} id - The ID of the product to be deleted.
 */
function deleteProduct(id) {
	const { order } = customer;
	const result = order.filter(item => item.id !== id);
	customer.order = [...result];

	cleanHTML();

	if (customer.order.length) {
		updateSummary();
	} else {
		resetDOM();
	}

	const input = document.querySelector(`#foodPlate-${id}`);
	input.value = 0;
}

/**
 * Resets the DOM by adding a text element to the summary content.
 */
function resetDOM() {
	const content = document.querySelector('#summary .content');

	const text = document.createElement('P');
	text.classList.add('text-center');
	text.textContent = 'Add order items';

	content.appendChild(text);
}

/**
 * Creates and appends a tip form to the DOM.
 */
function tipForm() {
	const content = document.querySelector('#summary .content');

	const tipForm = document.createElement('DIV');
	tipForm.classList.add('col-md-6', 'form');

	const formDiv = document.createElement('DIV');
	formDiv.classList.add('card', 'py-2', 'px-3', 'shadow');

	const heading = document.createElement('H3');
	heading.classList.add('my-4', 'text-center');
	heading.textContent = 'Tip';

	const tip10 = document.createElement('INPUT');
	tip10.type = 'radio';
	tip10.name = 'tip';
	tip10.value = '10';
	tip10.classList.add('form-check-input');
	tip10.onclick = calculateTip;

	const tip10Label = document.createElement('LABEL');
	tip10Label.textContent = '10%';
	tip10Label.classList.add('form-check-label');

	const tip10Div = document.createElement('DIV');
	tip10Div.classList.add('form-check');

	const tip25 = document.createElement('INPUT');
	tip25.type = 'radio';
	tip25.name = 'tip';
	tip25.value = '25';
	tip25.classList.add('form-check-input');
	tip25.onclick = calculateTip;

	const tip25Label = document.createElement('LABEL');
	tip25Label.textContent = '25%';
	tip25Label.classList.add('form-check-label');

	const tip25Div = document.createElement('DIV');
	tip25Div.classList.add('form-check');

	const tip50 = document.createElement('INPUT');
	tip50.type = 'radio';
	tip50.name = 'tip';
	tip50.value = '50';
	tip50.classList.add('form-check-input');
	tip50.onclick = calculateTip;

	const tip50Label = document.createElement('LABEL');
	tip50Label.textContent = '50%';
	tip50Label.classList.add('form-check-label');

	const tip50Div = document.createElement('DIV');
	tip50Div.classList.add('form-check');

	tip10Div.appendChild(tip10);
	tip10Div.appendChild(tip10Label);

	tip25Div.appendChild(tip25);
	tip25Div.appendChild(tip25Label);

	tip50Div.appendChild(tip50);
	tip50Div.appendChild(tip50Label);

	formDiv.appendChild(heading);
	formDiv.appendChild(tip10Div);
	formDiv.appendChild(tip25Div);
	formDiv.appendChild(tip50Div);
	tipForm.appendChild(formDiv);

	content.appendChild(tipForm);
}

/**
 * Calculates the tip amount and total bill based on the customer's order.
 */
function calculateTip() {
	const { order } = customer;
	let subtotal = 0;

	order.forEach(item => {
		const { price, quantity } = item;
		subtotal += price * quantity;
	});

	const tipSelect = document.querySelector('input[name="tip"]:checked').value;

	const tip = ((subtotal * parseInt(tipSelect)) / 100).toFixed(2);

	const total = (subtotal + parseFloat(tip)).toFixed(2);

	showTotal(subtotal, tip, total);
}

/**
 * Displays the subtotal, tip, and total amounts on the page.
 * 
 * @param {number} subtotal - The subtotal amount.
 * @param {number} tip - The tip amount.
 * @param {number} total - The total amount.
 */
function showTotal(subtotal, tip, total) {
	const divTotal = document.createElement('DIV');
	divTotal.classList.add('total-pay', 'my-3');

	const subtotalElement = document.createElement('P');
	subtotalElement.classList.add('fw-bold', 'fs-3', 'mt-4');
	subtotalElement.textContent = `Subtotal: `;

	const subtotalSpan = document.createElement('SPAN');
	subtotalSpan.classList.add('fw-normal');
	subtotalSpan.textContent = `$${subtotal}`;

	const tipElement = document.createElement('P');
	tipElement.classList.add('fw-bold', 'fs-3', 'mt-4');
	tipElement.textContent = `Tip: `;

	const tipSpan = document.createElement('SPAN');
	tipSpan.classList.add('fw-normal');
	tipSpan.textContent = `$${tip}`;

	const totalElement = document.createElement('P');
	totalElement.classList.add('fw-bold', 'fs-3', 'mt-4');
	totalElement.textContent = `Total: `;

	const totalSpan = document.createElement('SPAN');
	totalSpan.classList.add('fw-normal');
	totalSpan.textContent = `$${total}`;

	const totalPayDiv = document.querySelector('.total-pay');

	if (totalPayDiv) {
		totalPayDiv.remove();
	}

	subtotalElement.appendChild(subtotalSpan);
	tipElement.appendChild(tipSpan);
	totalElement.appendChild(totalSpan);

	divTotal.appendChild(subtotalElement);
	divTotal.appendChild(tipElement);
	divTotal.appendChild(totalElement);

	const form = document.querySelector('.form > div');
	form.appendChild(divTotal);
}
