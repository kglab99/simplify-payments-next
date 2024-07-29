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

  const debts = useMemo(
    () => calculateDebts(creditedExpenses),
    [creditedExpenses]
  );

  const canceledReversedDebts = useMemo(
    () => calculateCanceledReverseDebts(debts),
    [debts]
  );

  const finalTransactions = useMemo(
    () => generateFinalTransactions(canceledReversedDebts),
    [canceledReversedDebts]
  );

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
      id: uuidv4(),
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

  const deleteExpense = (groupId, expenseId) => {
    setExpenses((prevExpenses) => {
      const updatedExpenses = prevExpenses[groupId].filter(
        (expense) => expense.id !== expenseId
      );
      return {
        ...prevExpenses,
        [groupId]: updatedExpenses,
      };
    });
  };

  const editExpense = (groupId, expenseId, updatedExpense) => {
    setExpenses((prevExpenses) => {
      // Debug logs
      console.log("Previous Expenses:", prevExpenses);
      console.log("Group ID:", groupId);
      console.log("Expense ID:", expenseId);
      console.log("Updated Expense:", updatedExpense);

      // Check if the group exists
      if (!prevExpenses[groupId]) {
        console.error(`Group with ID ${groupId} does not exist.`);
        return prevExpenses; // No change if group does not exist
      }

      // Update the expense within the group
      const updatedGroupExpenses = prevExpenses[groupId].map((expense) => {
        if (expense.id === expenseId) {
          return { ...expense, ...updatedExpense }; // Update the expense
        }
        return expense; // Keep other expenses unchanged
      });

      // Return the updated expenses object
      return {
        ...prevExpenses,
        [groupId]: updatedGroupExpenses,
      };
    });
  };

  // New function to calculate total amount of expenses for a specific group
  const calculateTotalGroupExpenses = (groupId) => {
    // Check if the groupId is valid and exists in expenses
    if (!expenses[groupId]) {
      console.error(
        `Group with ID ${groupId} does not exist or has no expenses.`
      );
      return;
    }

    // Retrieve the expenses for the specified group
    const groupExpenses = expenses[groupId];

    // Calculate the total amount of all expenses in this group
    const totalExpenses = groupExpenses.reduce((total, expense) => {
      // Convert amount to a number if it's a string
      const amount =
        typeof expense.amount === "string"
          ? parseFloat(expense.amount)
          : expense.amount;
      return total + amount;
    }, 0);

    // Log the total amount of expenses with the selected currency
    console.log(
      `Total amount of expenses for group ${groupId}: ${selectedCurrency}${totalExpenses.toFixed(
        2
      )}`
    );

    return totalExpenses
  };

  const deleteGroup = (groupId) => {
    setGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== groupId)
    );
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
    addGroup,
    addExpense,
    editExpense,
    deleteGroup,
    deleteExpense,
    selectedCurrency,
    updateCurrency,
    calculateTotalGroupExpenses
  };
}
