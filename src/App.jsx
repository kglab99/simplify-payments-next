import { Button, ButtonGroup } from "@nextui-org/button";
import AddIcon from "@mui/icons-material/Add";
import HomePage from "./HomePage";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { Routes, Route } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import { useAppState } from "./useAppState";
import Group from "./Group";

export default function App() {
  const navigate = useNavigate();
  const { groups, expenses, debts, addGroup, addExpense, updateGroup, finalTransactions } =
    useAppState();

  return (
    <NextUIProvider navigate={navigate}>
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
            />
          }
        />
      </Routes>
    </NextUIProvider>
  );
}
