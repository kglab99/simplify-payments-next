const cleanExpenses = (expenses) => {
    const cleanedExpenses = {};
  
    for (const [groupId, expenseList] of Object.entries(expenses)) {
      cleanedExpenses[groupId] = expenseList.map((expense) => {
        const { creditor, debtors, amount } = expense;
  
        const updatedDebtors = { ...debtors };
        let creditorShare = 0;
  
        if (Object.prototype.hasOwnProperty.call(updatedDebtors, creditor)) {
          creditorShare = updatedDebtors[creditor];
          delete updatedDebtors[creditor];
        }
  
        const updatedAmount = amount - creditorShare;
  
        return {
          ...expense,
          amount: updatedAmount,
          debtors: updatedDebtors,
        };
      });
    }
  
    return cleanedExpenses;
  };
  
  const calculateDebts = (creditedExpenses) => {
    const debts = {};
  
    for (const [groupId, expenses] of Object.entries(creditedExpenses)) {
      const creditors = {};
      const debtors = {};
  
      expenses.forEach((expense) => {
        const { creditor, debtors: expenseDebtors, amount } = expense;
  
        if (!creditors[creditor]) {
          creditors[creditor] = 0;
        }
        creditors[creditor] += amount;
  
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
  
  const calculateCanceledReverseDebts = (debts) => {
    const canceledReversedDebts = {};
  
    for (const [groupId, { creditors, debtors }] of Object.entries(debts)) {
      canceledReversedDebts[groupId] = {
        creditors: {},
        debtors: {},
      };
  
      const allUsers = new Set([
        ...Object.keys(creditors),
        ...Object.keys(debtors),
      ]);
  
      allUsers.forEach((userId) => {
        const creditedAmount = creditors[userId] || 0;
        const owedAmount = debtors[userId] || 0;
        const netBalance = creditedAmount - owedAmount;
  
        if (netBalance > 0) {
          canceledReversedDebts[groupId].creditors[userId] = netBalance;
        } else if (netBalance < 0) {
          canceledReversedDebts[groupId].debtors[userId] = -netBalance;
        }
      });
    }
  
    return canceledReversedDebts;
  };
  
  const generateFinalTransactions = (canceledReversedDebts) => {
    const finalTransactions = {};
  
    for (const [groupId, { creditors, debtors }] of Object.entries(
      canceledReversedDebts
    )) {
      finalTransactions[groupId] = [];
  
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
  
      while (
        creditorIndex < creditorsList.length &&
        debtorIndex < debtorsList.length
      ) {
        const creditor = creditorsList[creditorIndex];
        const debtor = debtorsList[debtorIndex];
        const transactionAmount = Math.min(creditor.amount, debtor.amount);
  
        finalTransactions[groupId].push({
          from: debtor.id,
          to: creditor.id,
          amount: transactionAmount,
        });
  
        creditorsList[creditorIndex].amount -= transactionAmount;
        debtorsList[debtorIndex].amount -= transactionAmount;
  
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
  
  export {
    cleanExpenses,
    calculateDebts,
    calculateCanceledReverseDebts,
    generateFinalTransactions,
  };
  