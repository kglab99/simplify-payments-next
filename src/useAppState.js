import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Function to clean expenses
const cleanExpenses = (expenses) => {
  const cleanedExpenses = {};

  for (const [groupId, expenseList] of Object.entries(expenses)) {
    cleanedExpenses[groupId] = expenseList.map((expense) => {
      const { creditor, debtors, amount } = expense;

      // Create a new debtors object excluding the creditor if present
      const updatedDebtors = { ...debtors };
      let creditorShare = 0;

      if (updatedDebtors.hasOwnProperty(creditor)) {
        // Deduct the creditor's share from the total amount
        creditorShare = updatedDebtors[creditor];
        delete updatedDebtors[creditor];
      }

      // Adjust the amount by subtracting the creditor's share
      const updatedAmount = amount - creditorShare;

      // Return a new expense object with the updated debtors list and amount
      return {
        ...expense,
        amount: updatedAmount,
        debtors: updatedDebtors,
      };
    });
  }

  return cleanedExpenses;
};

// Function to calculate debts
const calculateDebts = (creditedExpenses) => {
  const debts = {};

  for (const [groupId, expenses] of Object.entries(creditedExpenses)) {
    const creditors = {};
    const debtors = {};

    expenses.forEach((expense) => {
      const { creditor, debtors: expenseDebtors, amount } = expense;

      // Add creditor's total credited amount
      if (!creditors[creditor]) {
        creditors[creditor] = 0;
      }
      creditors[creditor] += amount;

      // Add each debtor's total lent amount
      for (const [debtor, share] of Object.entries(expenseDebtors)) {
        if (!debtors[debtor]) {
          debtors[debtor] = 0;
        }
        debtors[debtor] += share;
      }
    });

    const allUsers = new Set([
      ...Object.keys(creditors),
      ...Object.keys(debtors),
    ]);

    debts[groupId] = {
      creditors: {},
      debtors: {},
    };

    allUsers.forEach((userId) => {
      debts[groupId].creditors[userId] = creditors[userId] || 0;
      debts[groupId].debtors[userId] = debtors[userId] || 0;
    });
  }

  return debts;
};

export function useAppState() {
  const [groups, setGroups] = useState(() => {
    const storedGroups = localStorage.getItem("groups");
    return storedGroups ? JSON.parse(storedGroups) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const storedExpenses = localStorage.getItem("expenses");
    return storedExpenses ? JSON.parse(storedExpenses) : {};
  });

  const [creditedExpenses, setCreditedExpenses] = useState(() => {
    const storedCreditedExpenses = localStorage.getItem("creditedExpenses");
    return storedCreditedExpenses ? JSON.parse(storedCreditedExpenses) : {};
  });

  const [debts, setDebts] = useState(() => {
    const storedDebts = localStorage.getItem("debts");
    return storedDebts ? JSON.parse(storedDebts) : {};
  });

  const [canceledReversedDebts, setCanceledReversedDebts] = useState(() => {
    const storedCanceledReversedDebts = localStorage.getItem(
      "canceledReversedDebts"
    );
    return storedCanceledReversedDebts
      ? JSON.parse(storedCanceledReversedDebts)
      : {};
  });

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");
    return storedCurrency ? (storedCurrency) : "USD" // Default currency
  });

  const [finalTransactions, setFinalTransactions] = useState(() => {
    const storedFinalTransactions = localStorage.getItem("finalTransactions");
    return storedFinalTransactions ? JSON.parse(storedFinalTransactions) : {};
  });

  useEffect(() => {
    const saveData = () => {
      localStorage.setItem("groups", JSON.stringify(groups));
      localStorage.setItem("expenses", JSON.stringify(expenses));

      const cleanedExpenses = cleanExpenses(expenses);
      localStorage.setItem("creditedExpenses", JSON.stringify(cleanedExpenses));

      const calculatedDebts = calculateDebts(cleanedExpenses);
      setDebts(calculatedDebts);
      localStorage.setItem("debts", JSON.stringify(calculatedDebts));

      const canceledReversedDebts =
        calculateCanceledReverseDebts(calculatedDebts);
      setCanceledReversedDebts(canceledReversedDebts);
      localStorage.setItem(
        "canceledReversedDebts",
        JSON.stringify(canceledReversedDebts)
      );

      localStorage.setItem("selectedCurrency", selectedCurrency);

      const transactions = generateFinalTransactions(canceledReversedDebts);
      setFinalTransactions(transactions);
      localStorage.setItem("finalTransactions", JSON.stringify(transactions));
    };

    saveData();
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

    // Update creditedExpenses
    setCreditedExpenses((prevCreditedExpenses) => {
      const updatedCreditedExpenses = {
        ...prevCreditedExpenses,
        [groupId]: [newExpense, ...(prevCreditedExpenses[groupId] || [])],
      };
      return updatedCreditedExpenses;
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
      const { [groupId]: _, ...remainingExpenses } = prevExpenses;
      return remainingExpenses;
    });
  };

  const logFinalTransactionsWithNames = () => {
    const userIdToName = getUserIdToNameMapping(groups);
    const transactionsWithNames = transformTransactionsToNames(
      finalTransactions,
      userIdToName
    );
    console.log(transactionsWithNames);
  };

  // Optional: Call this function whenever you need to log transactions with names
  useEffect(() => {
    logFinalTransactionsWithNames();
  }, [finalTransactions]);

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
    logFinalTransactionsWithNames,
    selectedCurrency,
    updateCurrency,
  };
}

// Function to calculate canceled reversed debts
const calculateCanceledReverseDebts = (debts) => {
  const canceledReversedDebts = {};

  for (const [groupId, { creditors, debtors }] of Object.entries(debts)) {
    canceledReversedDebts[groupId] = {
      creditors: {},
      debtors: {},
    };

    // Get all unique user IDs from creditors and debtors
    const allUsers = new Set([
      ...Object.keys(creditors),
      ...Object.keys(debtors),
    ]);

    // Initialize net balances and categorize users
    allUsers.forEach((userId) => {
      const creditedAmount = creditors[userId] || 0;
      const owedAmount = debtors[userId] || 0;
      const netBalance = creditedAmount - owedAmount;

      // Categorize the user based on their net balance
      if (netBalance > 0) {
        canceledReversedDebts[groupId].creditors[userId] = netBalance;
      } else if (netBalance < 0) {
        canceledReversedDebts[groupId].debtors[userId] = -netBalance;
      }
    });
  }

  return canceledReversedDebts;
};

// Function to generate final transactions based on canceled reversed debts
const generateFinalTransactions = (canceledReversedDebts) => {
  const finalTransactions = {};

  for (const [groupId, { creditors, debtors }] of Object.entries(
    canceledReversedDebts
  )) {
    finalTransactions[groupId] = [];

    // Create lists from creditors and debtors
    const creditorsList = Object.entries(creditors).map(([id, amount]) => ({
      id,
      amount,
    }));
    const debtorsList = Object.entries(debtors).map(([id, amount]) => ({
      id,
      amount,
    }));

    let creditorIndex = 0;
    let debtorIndex = 0;

    // Settle debts by matching creditors and debtors
    while (
      creditorIndex < creditorsList.length &&
      debtorIndex < debtorsList.length
    ) {
      const creditor = creditorsList[creditorIndex];
      const debtor = debtorsList[debtorIndex];
      const transactionAmount = Math.min(creditor.amount, debtor.amount);

      // Create transaction
      finalTransactions[groupId].push({
        from: debtor.id,
        to: creditor.id,
        amount: transactionAmount,
      });

      // Update amounts
      creditorsList[creditorIndex].amount -= transactionAmount;
      debtorsList[debtorIndex].amount -= transactionAmount;

      // Move to the next creditor or debtor if their amount is settled
      if (creditorsList[creditorIndex].amount === 0) {
        creditorIndex++;
      }
      if (debtorsList[debtorIndex].amount === 0) {
        debtorIndex++;
      }
    }
  }

  return finalTransactions;
};

// Function to create a mapping of user IDs to names
const getUserIdToNameMapping = (groups) => {
  const userIdToName = {};

  groups.forEach((group) => {
    Object.entries(group.users).forEach(([id, name]) => {
      userIdToName[id] = name;
    });
  });

  return userIdToName;
};

// Function to convert final transactions from IDs to names
const transformTransactionsToNames = (finalTransactions, userIdToName) => {
  const transactionsWithNames = {};

  for (const [groupId, transactions] of Object.entries(finalTransactions)) {
    transactionsWithNames[groupId] = transactions.map((transaction) => ({
      from: userIdToName[transaction.from] || transaction.from,
      to: userIdToName[transaction.to] || transaction.to,
      amount: transaction.amount,
    }));
  }

  return transactionsWithNames;
};
