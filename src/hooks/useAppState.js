import { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "./useLocalStorage";
import {
  cleanExpenses,
  calculateDebts,
  calculateCanceledReverseDebts,
  generateFinalTransactions,
} from "../utils/utils";

export function useAppState() {
  const [groups, setGroups] = useLocalStorage("groups", []);
  const [expenses, setExpenses] = useLocalStorage("expenses", {});

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");
    return storedCurrency ? storedCurrency : "USD";
  });

  const creditedExpenses = useMemo(() => cleanExpenses(expenses), [expenses]);

  const debts = useMemo(() => calculateDebts(creditedExpenses), [creditedExpenses]);

  const canceledReversedDebts = useMemo(() => calculateCanceledReverseDebts(debts), [debts]);

  const finalTransactions = useMemo(() => generateFinalTransactions(canceledReversedDebts), [canceledReversedDebts]);

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("selectedCurrency", selectedCurrency);
  }, [groups, expenses, selectedCurrency]);

  const addGroup = (groupName, users) => {
    const usersWithIds = users.reduce((acc, user) => {
      acc[uuidv4()] = user;
      return acc;
    }, {});

    const newGroup = { id: uuidv4(), groupName, users: usersWithIds };
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const updateGroup = (groupId, updatedGroupName, updatedUsers) => {
    setGroups((prevGroups) => {
      return prevGroups.map((group) => {
        if (group.id === groupId) {
          const newUsers = { ...group.users, ...updatedUsers };
          return { ...group, groupName: updatedGroupName, users: newUsers };
        }
        return group;
      });
    });
  };

  const addExpense = (groupId, expenseName, amount, payer, participants) => {
    const numParticipants = participants.length;
    const share = amount / numParticipants;

    const newExpense = {
      expenseName,
      amount,
      creditor: payer,
      debtors: participants.reduce((acc, id) => {
        acc[id] = share;
        return acc;
      }, {}),
    };

    setExpenses((prevExpenses) => {
      const updatedExpenses = {
        ...prevExpenses,
        [groupId]: [newExpense, ...(prevExpenses[groupId] || [])],
      };
      return updatedExpenses;
    });
  };

  const updateExpense = (groupId, oldExpenseName, newExpense) => {
    setExpenses((prevExpenses) => {
      const updatedExpenses = {
        ...prevExpenses,
        [groupId]: prevExpenses[groupId].map((expense) =>
          expense.expenseName === oldExpenseName ? newExpense : expense
        ),
      };
      return updatedExpenses;
    });
  };

  const deleteGroup = (groupId) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    setExpenses((prevExpenses) => {
      const { [groupId]: deleted, ...remainingExpenses } = prevExpenses;
      return remainingExpenses;
    });
  };

  const updateCurrency = (currency) => {
    setSelectedCurrency(currency);
  };

  return {
    groups,
    expenses,
    creditedExpenses,
    debts,
    updateGroup,
    canceledReversedDebts,
    finalTransactions,
    updateExpense,
    addGroup,
    addExpense,
    deleteGroup,
    selectedCurrency,
    updateCurrency,
  };
}
