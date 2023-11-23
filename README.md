```markdown
# Consumption and Tips Calculator

A web application for calculating consumption and tips, built using JSON Server and Bootstrap.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Introduction

This project is a Consumption and Tips Calculator web application. It allows users to create orders, add food plates to their order, calculate tips, and view a summary of their consumption.

The application uses [JSON Server](https://github.com/typicode/json-server) as a mock REST API and [Bootstrap](https://getbootstrap.com/) for styling.

## Features

- Create new orders with table and time information.
- Add various food plates to the order with quantities.
- Calculate subtotal, tips, and total based on the order.
- Responsive user interface with Bootstrap styling.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TrujiDev/TipsCalculatorJSON-Server.git
   ```

2. Install dependencies:

   ```bash
   cd your-repository
   npm install
   ```

## Usage

1. Start the JSON Server:

   ```bash
   npm run json-server
   ```

   This will start the JSON Server and serve the `db.json` file as a mock API.

2. Open the `index.html` file in a web browser or host the project using a web server.

3. Interact with the Consumption and Tips Calculator web application.

## API Endpoints

- `GET /foodPlates`: Retrieve the list of food plates.
- `POST /customer`: Create a new customer order.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
