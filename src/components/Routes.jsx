import React from "react";
import { Routes, Route } from "react-router-dom";

const HomePage = React.lazy(() => import("./HomePage"));
const CreateGroup = React.lazy(() => import("./CreateGroup"));
const Group = React.lazy(() => import("./Group"));

/*
 * Component to define the application's routes and pass necessary props to route components.
 */
export default function AppRoutes({
  groups,
  expenses,
  debts,
  addGroup,
  addExpense,
  updateGroup,
  updateExpense,
  finalTransactions,
  deleteGroup,
  deleteExpense,
  editExpense,
  selectedCurrency,
  updateCurrency,
  calculateTotalGroupExpenses
}) {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <HomePage
            groups={groups}
            selectedCurrency={selectedCurrency}
            updateCurrency={updateCurrency}
          />
        }
      />
      <Route
        path="/create-group"
        element={<CreateGroup addGroup={addGroup} />}
      />
      <Route
        path="/group/:groupId"
        element={
          <Group
            groups={groups}
            addExpense={addExpense}
            expenses={expenses}
            editExpense={editExpense}
            debts={debts}
            finalTransactions={finalTransactions}
            updateGroup={updateGroup}
            updateExpense={updateExpense}
            deleteGroup={deleteGroup}
            deleteExpense={deleteExpense}
            selectedCurrency={selectedCurrency}
            calculateTotalGroupExpenses={calculateTotalGroupExpenses}
          />
        }
      />
    </Routes>
  );
}
