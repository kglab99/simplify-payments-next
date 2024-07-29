import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Button,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { Add as AddIcon } from "@mui/icons-material";

const AddExpenseModal = ({
  isOpen,
  onOpenChange,
  name,
  setName,
  amount,
  setAmount,
  payer,
  setPayer,
  participants,
  setParticipants,
  group,
  handleAddExpense,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setParticipants(Object.keys(group.users));
    }
  }, [isOpen, group.users, setParticipants]);

  const handleButtonClick = () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      handleAddExpense();
      setTimeout(() => setIsSubmitting(false), 300); // Debounce to avoid multiple submissions
    }
  };

  const handleButtonKeyDown = (event) => {
    if (event.key === "Enter" && !isSubmitting) {
      event.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click(); // Trigger the click handler
      }
    }
  };

  return (
    <Modal
      backdrop="opaque"
      radius="none"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom-center"
    >
      <ModalContent tabIndex={0} className="m-0 rounded-t-lg">
        <ModalHeader>Add expense</ModalHeader>
        <ModalBody>
          <Input
            variant="flat"
            size="sm"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            variant="flat"
            size="sm"
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          />
          <Select
            size="md"
            variant="flat"
            radius="sm"
            className="h-12 min-h-12 select-input"
            value={payer}
            onChange={(event) => setPayer(event.target.value)}
            aria-label="Payer"
            placeholder="Select payer"
          >
            {Object.entries(group.users).map(([id, name]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </Select>
          <CheckboxGroup
            label="Participants"
            className="my-4"
            value={participants}
            onChange={(checkedValues) => setParticipants(checkedValues)}
          >
            {Object.entries(group.users).map(([id, name]) => (
              <Checkbox key={id} value={id} sx={{ minWidth: "100px" }}>
                {name}
              </Checkbox>
            ))}
          </CheckboxGroup>

          <Button
            ref={buttonRef}
            onClick={handleButtonClick}
            onKeyDown={handleButtonKeyDown}
            variant="flat"
            size="md"
            radius="sm"
            startContent={<AddIcon />}
          >
            Add Expense
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddExpenseModal;
