# Simplify Payments Next

## [Live preview](https://simplify-payments.netlify.app/)

**Simplify Payments Next** is a modern web application designed to streamline the management of group expenses and transactions. With this application, users can easily create and manage groups, track and settle expenses, and handle transactions with ease. Built using React, this app leverages NextUI for a sleek user interface and React Router for seamless navigation.

## Features

### Group Management
- Create, edit, and delete groups.
- Manage group members and track expenses.

### Expense Tracking
- Add, update, and delete expenses within each group.
- View detailed expense breakdowns.

### Automatic Calculations
- Automatically calculate debts and settlements between group members.

### Currency Management
- Select and update the currency for transactions.

### Responsive Design
- Enjoy a responsive and user-friendly interface built with NextUI and TailwindCSS.

### Persistent State
- Local storage is used to persist group and expense data, ensuring that your information is saved between sessions.


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
