import { Suspense } from "react";
import { useAppState } from "./useAppState";
import Loading from "./Loading";
import AppRoutes from "./Routes";

/*
 * Main App component that sets up the Suspense boundary and provides state to the AppRoutes component.
 */
export default function App() {
  const {
    groups,
    expenses,
    debts,
    addGroup,
    addExpense,
    updateGroup,
    updateExpense,
    finalTransactions,
    deleteGroup,
    selectedCurrency,
    updateCurrency,
  } = useAppState();

  return (
    <Suspense fallback={<Loading />}>
      <AppRoutes
        groups={groups}
        expenses={expenses}
        debts={debts}
        addGroup={addGroup}
        addExpense={addExpense}
        updateGroup={updateGroup}
        updateExpense={updateExpense}
        finalTransactions={finalTransactions}
        deleteGroup={deleteGroup}
        selectedCurrency={selectedCurrency}
        updateCurrency={updateCurrency}
      />
    </Suspense>
  );
}
