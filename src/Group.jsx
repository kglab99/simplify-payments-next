import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import { Button, ButtonGroup } from "@nextui-org/button";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link } from "react-router-dom";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { Tabs, Tab } from "@nextui-org/tabs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Select, SelectItem } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

const Group = ({ groups, addExpense, expenses, finalTransactions }) => {
  const { groupId } = useParams();
  const numericGroupId = parseInt(groupId, 10); // Ensure numeric ID
  const group = groups.find((group) => group.id === groupId);
  const [open, setOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // Retrieve expenses for the current groupId
  const groupExpenses = expenses[groupId] || [];
  const groupTransactions = finalTransactions[groupId] || [];

  // Sort transactions from largest to smallest amount
  const sortedTransactions = [...groupTransactions].sort(
    (a, b) => b.amount - a.amount
  );

  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [payer, setPayer] = useState("");

  const [participants, setParticipants] = useState([]);

  if (!group) {
    return <p>Group not found</p>;
  }

  const handleAddExpense = () => {
    if (amount != 0 && name != "") {
      addExpense(group.id, name, amount, payer, participants);
      setName("");
      setAmount("");
      setPayer("");
      setParticipants([]);
      setOpen(false);
      onOpenChange();
    }
  };

  const handleParticipantChange = (id) => {
    setParticipants((prevParticipants) =>
      prevParticipants.includes(id)
        ? prevParticipants.filter((participantId) => participantId !== id)
        : [...prevParticipants, id]
    );
  };

  return (
    <div className="flex flex-col ">
      <Navbar
        maxWidth="full"
        isBordered={true}
        isBlurred={true}
        className="pl-0"
      >
        <Link to="/">
          <Button isIconOnly variant="light" aria-label="Like">
            <ArrowBackIosNewIcon />
          </Button>
        </Link>
        <NavbarBrand>
          <p className="font-bold text-inherit">Simplify Payments</p>
        </NavbarBrand>
      </Navbar>

      <div className="flex flex-col gap-4 px-6 py-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Groups</BreadcrumbItem>
          <BreadcrumbItem>{group.groupName}</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex flex-col">
          <Tabs aria-label="Options" variant="solid" radius="sm" fullWidth>
            <Tab title="Expenses">
              <Listbox>
                {groupExpenses.map((expense, index) => (
                  <ListboxItem showDivider key={index}>
                    <Accordion>
                      <AccordionItem
                        className="custom-accordion-item"
                        title={expense.expenseName}
                        subtitle={`$${expense.amount} paid by ${
                          group.users[expense.creditor]
                        }`}
                      >
                        {Object.entries(expense.debtors).map(([id, share]) => (
                          <p key={id} className="">
                            {group.users[id]} owes ${share.toFixed(2)}
                          </p>
                        ))}
                      </AccordionItem>
                    </Accordion>
                  </ListboxItem>
                ))}
              </Listbox>
            </Tab>

            <Tab title="Settlements">
              <Listbox>
                {sortedTransactions.map((transaction, index) => (
                  <ListboxItem showDivider key={index}>
                    <p className="">
                      {group.users[transaction.from]} owes{" "}
                      {group.users[transaction.to]} $
                      {transaction.amount.toFixed(2)}
                    </p>
                  </ListboxItem>
                ))}
              </Listbox>
            </Tab>

            <Tab title="Group">
              <Listbox>
                {Object.entries(group.users).map(([id, name]) => (
                  <ListboxItem key={id}>
                    <p className="">{name}</p>
                  </ListboxItem>
                ))}
              </Listbox>
            </Tab>
          </Tabs>
        </div>
        <Modal
          backdrop="opaque"
          radius="none"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="bottom-center"
        >
          <ModalContent className="m-0 rounded-t-lg">
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
                value={payer}
                onChange={(event) => setPayer(event.target.value)}
                aria-label="Payer"
                placeholder="Select payer"
                className="h-12 min-h-12 select-input"
              >
                {Object.entries(group.users).map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </Select>
              <CheckboxGroup label="Participants" className="my-4">
                {Object.entries(group.users).map(([id, name]) => (
                  <Checkbox
                    key={id}
                    checked={participants.includes(id)}
                    onChange={() => handleParticipantChange(id)}
                    tabIndex={0}
                    value={id}
                    sx={{ minWidth: "100px" }}
                  >
                    {name}
                  </Checkbox>
                ))}
              </CheckboxGroup>

              <Button
                onClick={handleAddExpense}
                variant="flat"
                size="md"
                //   color="primary"
                radius="sm"
                startContent={<AddIcon />}
                className="text-black"
              >
                Add expense
              </Button>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
        <Button
          onPress={onOpen}
          variant="flat"
          size="md"
          //   color="primary"
          radius="sm"
          startContent={<AddIcon />}
          className="text-black"
        >
          Add expense
        </Button>
      </div>
    </div>
  );
};

export default Group;
