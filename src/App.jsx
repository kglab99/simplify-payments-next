import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppState } from "./useAppState";
import Loading from "./Loading";
const HomePage = React.lazy(() => import("./HomePage"));
const CreateGroup = React.lazy(() => import("./CreateGroup"));
const Group = React.lazy(() => import("./Group"));

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
  } = useAppState();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route exact path="/" element={<HomePage groups={groups} />} />
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
              debts={debts}
              finalTransactions={finalTransactions}
              updateGroup={updateGroup}
              updateExpense={updateExpense}
              deleteGroup={deleteGroup}
            />
          }
        />
      </Routes>
    </Suspense>
  );
}
