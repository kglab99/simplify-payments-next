# Simplify Payments Next

## [Live preview](https://simplify-payments.netlify.app/)

**Simplify Payments Next** is a web application that helps users manage group expenses and simplify transactions. The app allows users to create groups, add expenses, and settle debts easily. This project is built with React, using NextUI for the UI components and React Router for routing.

## Features

- Create and manage groups.
- Add and update expenses for groups.
- Calculate debts and settlements automatically.
- Select and update the currency for transactions.
- Responsive UI using NextUI components.
- Persistant stage management using local storage.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **NextUI**: A React component library with a focus on simplicity and ease of use.
- **React Router**: A library for handling routing in React applications.
- **Vite**: A modern build tool for faster development.
- **TailwindCSS**: A utility-first CSS framework for custom designs.
- **UUID**: A library for generating unique identifiers.

## Project structure

### Custom hooks

- useLocalStorage: Custom hook to manage state synchronized with localStorage.

### Utility Functions:

- cleanExpenses: Cleans up expense data by removing the creditor's share.
- calculateDebts: Calculates debts for each group.
- calculateCanceledReverseDebts: Adjusts debts by canceling out mutual debts.
- generateFinalTransactions: Generates final transactions for debt settlement.

### Components

- HomePage: Main page displaying the list of groups and settings.
- Group: Detailed view of a specific group with expenses and settlements.
- AddExpenseModal: Modal for adding new expenses.
- EditGroupModal: Modal for editing group details.
- ConfirmDeleteGroupModal: Modal for confirming group deletion.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v14 or later)
- npm (v6 or later) or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/simplify-payments.git
   cd simplify-payments

   ```

2. Install the dependencies:

   npm install

   # or

   yarn install

### Running the Application

To start the application locally:

    npm start
    # or
    yarn start

The app will be available at http://localhost:3000.
