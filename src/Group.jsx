import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link } from "react-router-dom";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Tabs, Tab } from "@nextui-org/tabs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Select, SelectItem } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Group = ({
  groups,
  addExpense,
  expenses,
  updateGroup,
  deleteGroup,
  finalTransactions,
}) => {
  const { groupId } = useParams();
  const numericGroupId = parseInt(groupId, 10); // Ensure numeric ID
  const group = groups.find((group) => group.id === groupId);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const navigate = useNavigate();

  // State variables
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [payer, setPayer] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [updatedGroupName, setUpdatedGroupName] = useState(group.groupName);
  const [updatedUsers, setUpdatedUsers] = useState(group.users);
  const [newUserName, setNewUserName] = useState("");

  // Retrieve expenses and transactions
  const groupExpenses = expenses[groupId] || [];
  const groupTransactions = finalTransactions[groupId] || [];
  const sortedTransactions = [...groupTransactions].sort(
    (a, b) => b.amount - a.amount
  );

  const sortedGroupUsers = Object.entries(group.users).sort(
    ([, nameA], [, nameB]) => nameA.localeCompare(nameB)
  );

  useEffect(() => {
    if (isOpen) {
      // Select all users when the modal opens
      setParticipants(Object.keys(group.users));
    }
  }, [isOpen, group.users]);

  if (!group) {
    return <p>Group not found</p>;
  }

  const handleAddExpense = () => {
    if (amount !== "" && name !== "") {
      addExpense(group.id, name, amount, payer, participants);
      setName("");
      setAmount("");
      setPayer("");
      setParticipants([]);
      onOpenChange(); // Close modal after adding expense
    }
  };

  const handleSaveGroupChanges = () => {
    updateGroup(groupId, updatedGroupName, updatedUsers);
    setIsEditingGroup(false);
  };

  const handleAddNewUser = () => {
    if (newUserName) {
      setUpdatedUsers((prevUsers) => ({
        ...prevUsers,
        [uuidv4()]: newUserName,
      }));
      setNewUserName("");
    }
  };

  const handleDeleteGroup = () => {
    deleteGroup(groupId);
    onDeleteOpenChange(); // Close the confirm delete modal
    navigate('/');
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
                          <p key={id}>
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
                    <p>
                      {group.users[transaction.from]} owes{" "}
                      {group.users[transaction.to]} $
                      {transaction.amount.toFixed(2)}
                    </p>
                  </ListboxItem>
                ))}
              </Listbox>
            </Tab>
            <Tab title="Group">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <Listbox>
                    {sortedGroupUsers
                      .slice(0, Math.ceil(sortedGroupUsers.length / 2))
                      .map(([id, name]) => (
                        <ListboxItem key={id}>
                          <p>{name}</p>
                        </ListboxItem>
                      ))}
                  </Listbox>
                  <Listbox>
                    {sortedGroupUsers
                      .slice(Math.ceil(sortedGroupUsers.length / 2))
                      .map(([id, name]) => (
                        <ListboxItem key={id}>
                          <p>{name}</p>
                        </ListboxItem>
                      ))}
                  </Listbox>
                </div>

                <div className="flex justify-end">
                  <Button
                    onPress={() => setIsEditingGroup(true)}
                    variant="flat"
                    size="md"
                    radius="sm"
                    startContent={<EditIcon />}
                    className="text-black"
                  >
                    Edit
                  </Button>
                </div>
              </div>
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
                onClick={handleAddExpense}
                variant="flat"
                size="md"
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

        <Modal
          isOpen={isEditingGroup}
          onClose={() => setIsEditingGroup(false)}
          backdrop="blur"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>Edit Group</ModalHeader>
            <ModalBody>
              <Input
                variant="bordered"
                label="Group Name"
                value={updatedGroupName}
                onChange={(e) => setUpdatedGroupName(e.target.value)}
              />
              <div>
                {Object.entries(updatedUsers).map(([id, userName]) => (
                  <div key={id} className="flex items-center mb-2">
                    <Input
                      value={userName}
                      onChange={(e) => {
                        const newUsers = {
                          ...updatedUsers,
                          [id]: e.target.value,
                        };
                        setUpdatedUsers(newUsers);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  variant="flat"
                  size="sm"
                  label="New Member Name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddNewUser();
                    }
                  }}
                />
                <Button
                  isIconOnly
                  variant="flat"
                  size="lg"
                  radius="sm"
                  className="text-black"
                  onClick={handleAddNewUser}
                >
                  <AddIcon />
                </Button>
              </div>
              <div className="flex space-x-2">
              <Button
                variant="flat"
                size="md"
                radius="sm"
                fullWidth
                className="text-red-500"
                onPress={onDeleteOpen}
              >
                Delete Group
              </Button>
            </div>

            </ModalBody>
            <ModalFooter>
                
              <Button
                onPress={handleSaveGroupChanges}
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

        <Modal
          isOpen={isDeleteOpen}
          onClose={onDeleteOpenChange}
          backdrop="blur"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>Confirm Delete Group</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete this group? This action cannot
                be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="flat"
                size="md"
                radius="sm"
                className="text-black"
                onPress={onDeleteOpenChange}
              >
                Cancel
              </Button>
              <Button
                variant="flat"
                size="md"
                radius="sm"
                className="text-red-500"
                onPress={handleDeleteGroup}
              >
                Confirm Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Button
          onPress={onOpen}
          variant="flat"
          size="md"
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
