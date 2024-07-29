import { useState, useEffect, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { Add as AddIcon } from "@mui/icons-material";

const EditExpenseModal = ({
  isEditingExpenseOpen,
  setIsEditingExpense,
  groupId,
  expenseId,
  onDeleteExpenseOpenChange,
  onDeleteExpenseOpen,
  editExpense,
  groupUsers,
  expenseToEdit,
  groupExpenses,
  groups,
  selectedCurrency,
}) => {
  // Find the group and the expense to edit
  const group = groups.find((group) => group.id === groupId);


  // Initialize state variables
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [creditor, setCreditor] = useState("");
  const [debtors, setDebtors] = useState({});

  useEffect(() => {
    if (expenseToEdit) {
      setExpenseName(expenseToEdit.expenseName);
      setAmount(expenseToEdit.amount);
      setCreditor(expenseToEdit.creditor);
      console.log(expenseToEdit.creditor);
      setDebtors(expenseToEdit.debtors);
    }
  }, [expenseToEdit]);

  // Calculate the share based on the number of debtors
  const share = useMemo(() => {
    const numberOfDebtors = Object.keys(debtors).length;
    return numberOfDebtors > 0 ? amount / numberOfDebtors : 0;
  }, [amount, debtors]);

  const handleSaveChanges = () => {
    const updatedExpense = {
      expenseName,
      amount,
      creditor,
      debtors: Object.keys(debtors).reduce((acc, debtorId) => {
        acc[debtorId] = share; // Update debtor share with the calculated value
        return acc;
      }, {}),
    };

    editExpense(groupId, expenseId, updatedExpense);
    setIsEditingExpense(false);
  };

  const handleDebtorsChange = (checkedValues) => {
    const newDebtors = {};
    checkedValues.forEach((debtorId) => {
      newDebtors[debtorId] = debtors[debtorId] || share; // Preserve existing shares or use the new calculated share
    });
    setDebtors(newDebtors);
  };

  return (
    <Modal
      isOpen={isEditingExpenseOpen}
      onClose={() => setIsEditingExpense(false)}
      scrollBehavior="inside"
      radius="none"
    >
      <ModalContent className="m-0 rounded-t-lg">
        <ModalHeader>Edit Expense</ModalHeader>
        <ModalBody>
          <Input
            label="Expense Name"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            fullWidth
          />
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
          <Select
            label="Payer"
            defaultSelectedKeys={[creditor]}
            value={creditor}
            onChange={(e) => setCreditor(e.target.value)}
            fullWidth
            aria-label="Select payer"
          >
            {Object.entries(groupUsers).map(([id, name]) => (
              <SelectItem key={id}>{name}</SelectItem>
            ))}
          </Select>
          <CheckboxGroup
            label="Debtors"
            value={Object.keys(debtors)}
            onChange={(checkedValues) => handleDebtorsChange(checkedValues)}
            className="my-4"
          >
            {Object.entries(groupUsers).map(([id, name]) => (
              <Checkbox key={id} value={id} sx={{ minWidth: "100px" }}>
                {name}
              </Checkbox>
            ))}
          </CheckboxGroup>
          <div className="flex space-x-2">
            <Button
              variant="flat"
              size="md"
              radius="sm"
              fullWidth
              className="text-red-500"
              onPress={onDeleteExpenseOpen}
            >
              Delete Expense
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={handleSaveChanges}
            variant="flat"
            size="md"
            fullWidth
            radius="sm"
            startContent={<AddIcon />}
            className="text-black"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditExpenseModal;
