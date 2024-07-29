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

  const calculateTotalGroupExpenses = (groupId) => {
    // Check if the groupId is valid and exists in expenses
    if (!expenses[groupId]) {
      console.error(`Group with ID ${groupId} does not exist or has no expenses.`);
      return {
        totalExpenses: 0,
        totalExpensesByCreditor: {},
        totalOwedByDebtor: {},
      };
    }
  
    // Retrieve the expenses for the specified group
    const groupExpenses = expenses[groupId];
  
    // Calculate the total amount spent by each creditor and the overall total
    let totalExpenses = 0;
    const totalExpensesByCreditor = {};
    const totalOwedByDebtor = {};
  
    // Use the canceledReversedDebts to adjust the amounts
    const { creditors, debtors } = canceledReversedDebts[groupId] || {
      creditors: {},
      debtors: {},
    };
  
    groupExpenses.forEach((expense) => {
      const amount = typeof expense.amount === "string" ? parseFloat(expense.amount) : expense.amount;
      totalExpenses += amount; // Add to the overall total
  
      // Calculate total spent by each creditor
      if (!totalExpensesByCreditor[expense.creditor]) {
        totalExpensesByCreditor[expense.creditor] = 0;
      }
      totalExpensesByCreditor[expense.creditor] += amount;
    });
  
    // Calculate the total owed by each debtor using canceledReversedDebts
    Object.entries(debtors).forEach(([debtorId, amount]) => {
      if (!totalOwedByDebtor[debtorId]) {
        totalOwedByDebtor[debtorId] = 0;
      }
      totalOwedByDebtor[debtorId] += amount;
    });
  
    // Sort totalExpensesByCreditor from highest to lowest amount
    const sortedTotalExpensesByCreditor = Object.fromEntries(
      Object.entries(totalExpensesByCreditor).sort(([, a], [, b]) => b - a)
    );
  
    // Sort totalOwedByDebtor from highest to lowest amount
    const sortedTotalOwedByDebtor = Object.fromEntries(
      Object.entries(totalOwedByDebtor).sort(([, a], [, b]) => b - a)
    );
  
    return { 
      totalExpenses, 
      totalExpensesByCreditor: sortedTotalExpensesByCreditor, 
      totalOwedByDebtor: sortedTotalOwedByDebtor 
    };
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
    calculateTotalGroupExpenses,
  };
}
