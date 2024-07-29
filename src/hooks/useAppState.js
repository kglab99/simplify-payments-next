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
  const [groups, setGroups] = useLocalStorage("groups", [], exampleGroups);
  const [expenses, setExpenses] = useLocalStorage("expenses", {}, exampleExpenses);

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");
    return storedCurrency ? storedCurrency : "$";
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

const exampleGroups = [
  {
    id: "a51a7884-b885-470b-b127-a8100cf973d1",
    groupName: "Example: Berlin",
    users: {
      "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": "Pawel",
      "94ffbea7-f6e0-4b57-9a26-134d23d5025a": "Aga",
      "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8": "John",
      "465ba762-869d-49fb-8938-47941fbc16ba": "Lukas",
      "51cf8cd6-09e0-48dc-95e4-f3952f7cb844": "Adam",
      "1e4e2cef-885e-444d-83da-ed6a8bbdeadd": "Robert",
    },
  },
];

const exampleExpenses = {
  "a51a7884-b885-470b-b127-a8100cf973d1": [
      {
          "id": "f3f13270-f85b-407e-b2d4-e151fe204460",
          "expenseName": "Groceries",
          "amount": 87,
          "creditor": "94ffbea7-f6e0-4b57-9a26-134d23d5025a",
          "debtors": {
              "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": 21.75,
              "94ffbea7-f6e0-4b57-9a26-134d23d5025a": 21.75,
              "51cf8cd6-09e0-48dc-95e4-f3952f7cb844": 21.75,
              "1e4e2cef-885e-444d-83da-ed6a8bbdeadd": 21.75
          }
      },
      {
          "id": "1811f32c-ac0a-4a24-b6ca-e6989e0dbc16",
          "expenseName": "Pineapple",
          "amount": 8,
          "creditor": "465ba762-869d-49fb-8938-47941fbc16ba",
          "debtors": {
              "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": 2,
              "94ffbea7-f6e0-4b57-9a26-134d23d5025a": 2,
              "51cf8cd6-09e0-48dc-95e4-f3952f7cb844": 2,
              "1e4e2cef-885e-444d-83da-ed6a8bbdeadd": 2
          }
      },
      {
          "id": "143c981e-fe07-4d6c-a30c-b56c980aba33",
          "expenseName": "Donuts",
          "amount": 12,
          "creditor": "f313dd73-7f67-4c3b-960b-d083b7a5ab0c",
          "debtors": {
              "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": 6,
              "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8": 6
          }
      },
      {
          "id": "d5ec4f37-db0f-4282-bc9d-911b0704892f",
          "expenseName": "Drinks",
          "amount": 29,
          "creditor": "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8",
          "debtors": {
              "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": 4.833333333333333,
              "94ffbea7-f6e0-4b57-9a26-134d23d5025a": 4.833333333333333,
              "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8": 4.833333333333333,
              "465ba762-869d-49fb-8938-47941fbc16ba": 4.833333333333333,
              "51cf8cd6-09e0-48dc-95e4-f3952f7cb844": 4.833333333333333,
              "1e4e2cef-885e-444d-83da-ed6a8bbdeadd": 4.833333333333333
          }
      },
      {
          "id": "80ff1b2b-a55a-42c6-9230-ec21d10a89e9",
          "expenseName": "Beer",
          "amount": 28,
          "creditor": "1e4e2cef-885e-444d-83da-ed6a8bbdeadd",
          "debtors": {
              "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": 7,
              "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8": 7,
              "465ba762-869d-49fb-8938-47941fbc16ba": 7,
              "1e4e2cef-885e-444d-83da-ed6a8bbdeadd": 7
          }
      },
      {
          "id": "92d1e945-9e5e-4147-815b-71201c4b7592",
          "expenseName": "Dinner day 1",
          "amount": 78,
          "creditor": "94ffbea7-f6e0-4b57-9a26-134d23d5025a",
          "debtors": {
              "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": 13,
              "94ffbea7-f6e0-4b57-9a26-134d23d5025a": 13,
              "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8": 13,
              "465ba762-869d-49fb-8938-47941fbc16ba": 13,
              "51cf8cd6-09e0-48dc-95e4-f3952f7cb844": 13,
              "1e4e2cef-885e-444d-83da-ed6a8bbdeadd": 13
          }
      },
      {
          "id": "1ef28e53-fc42-4c07-8a6b-3855b40e4209",
          "expenseName": "Hotel",
          "amount": 382,
          "creditor": "465ba762-869d-49fb-8938-47941fbc16ba",
          "debtors": {
              "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": 63.666666666666664,
              "94ffbea7-f6e0-4b57-9a26-134d23d5025a": 63.666666666666664,
              "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8": 63.666666666666664,
              "465ba762-869d-49fb-8938-47941fbc16ba": 63.666666666666664,
              "51cf8cd6-09e0-48dc-95e4-f3952f7cb844": 63.666666666666664,
              "1e4e2cef-885e-444d-83da-ed6a8bbdeadd": 63.666666666666664
          }
      },
      {
          "id": "0e553788-9982-4915-8a5a-5a2cb7a649ea",
          "expenseName": "Gas to Berlin",
          "amount": 80,
          "creditor": "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8",
          "debtors": {
              "f313dd73-7f67-4c3b-960b-d083b7a5ab0c": 13.333333333333334,
              "94ffbea7-f6e0-4b57-9a26-134d23d5025a": 13.333333333333334,
              "99d9d03b-3adb-40cf-b56e-c68db8ec4ff8": 13.333333333333334,
              "465ba762-869d-49fb-8938-47941fbc16ba": 13.333333333333334,
              "51cf8cd6-09e0-48dc-95e4-f3952f7cb844": 13.333333333333334,
              "1e4e2cef-885e-444d-83da-ed6a8bbdeadd": 13.333333333333334
          }
      }
  ]
}