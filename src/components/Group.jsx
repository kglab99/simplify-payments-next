import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Navbar,
  Breadcrumbs,
  BreadcrumbItem,
  Input,
  Button,
  Listbox,
  ListboxItem,
  Tabs,
  Tab,
  useDisclosure,
  Accordion,
  AccordionItem,
  NavbarBrand,
} from "@nextui-org/react";
import {
  Add as AddIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import AddExpenseModal from "./modals/AddExpenseModal";
import EditGroupModal from "./modals/EditGroupModal";
import ConfirmDeleteGroupModal from "./modals/ConfirmDeleteGroupModal";
import EditExpenseModal from "./modals/EditExpenseModal";
import ConfirmDeleteExpenseModal from "./modals/ConfirmDeleteExpenseModal";

const Group = ({
  groups,
  addExpense,
  expenses,
  updateGroup,
  deleteGroup,
  deleteExpense,
  editExpense,
  finalTransactions,
  selectedCurrency,
}) => {
  const { groupId } = useParams();
  const group = groups.find((group) => group.id === groupId);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const navigate = useNavigate();
  const {
    isOpen: isDeleteExpenseOpen,
    onOpen: onDeleteExpenseOpen,
    onOpenChange: onDeleteExpenseOpenChange,
  } = useDisclosure();
  // State variables
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [payer, setPayer] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [updatedGroupName, setUpdatedGroupName] = useState(group.groupName);
  const [updatedUsers, setUpdatedUsers] = useState(group.users);
  const [newUserName, setNewUserName] = useState("");
  const [isEditingExpenseOpen, setIsEditingExpense] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const groupUsers = group ? group.users : {};

  // Retrieve expenses and transactions
  const groupExpenses = expenses[groupId] || [];
  const groupTransactions = finalTransactions[groupId] || [];
  const sortedTransactions = [...groupTransactions].sort(
    (a, b) => b.amount - a.amount
  );

  const [expenseToEditContent, setExpenseToEditContent] = useState(null);

  useEffect(() => {
    const foundExpense = groupExpenses.find(
      (expense) => expense.id === expenseToEdit
    );
    setExpenseToEditContent(foundExpense);
  }, [expenseToEdit, groupExpenses]);

  const sortedGroupUsers = Object.entries(group.users).sort(
    ([, nameA], [, nameB]) => nameA.localeCompare(nameB)
  );

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
      onOpenChange();
    }
  };

  const handleSaveGroupChanges = () => {
    updateGroup(groupId, updatedGroupName, updatedUsers);
    setIsEditingGroup(false);
  };

  const handleDeleteExpense = () => {
    if (expenseToEdit) {
      console.log(groupId);
      deleteExpense(groupId, expenseToEdit);
      setExpenseToEdit(null);
      onDeleteExpenseOpenChange();
      setIsEditingExpense(false);
    }
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
    onDeleteOpenChange();
    navigate("/");
  };

  return (
    <div className="flex flex-col">
      <Navbar
        maxWidth="full"
        isBordered={true}
        isBlurred={true}
        className="pl-0"
      >
        <Link to="/">
          <Button isIconOnly variant="light" aria-label="Back">
            <ArrowBackIosNewIcon />
          </Button>
        </Link>
        <NavbarBrand>
          <p className="font-bold text-inherit">Simplify Payments</p>
        </NavbarBrand>
      </Navbar>

      <div className="flex flex-col gap-4 px-6 py-4">
        <Breadcrumbs>
          <BreadcrumbItem>
            <Link to="/">Groups</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{group.groupName}</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex flex-col">
          <Tabs
            aria-label="Options"
            variant="solid"
            radius="sm"
            size="sm"
            fullWidth
          >
            <Tab title="Expenses">
              <Listbox>
                {groupExpenses.map((expense, index) => (
                  <ListboxItem showDivider key={index}>
                    <Accordion>
                      <AccordionItem
                        className="custom-accordion-item"
                        title={expense.expenseName}
                        subtitle={`${selectedCurrency}${
                          expense.amount
                        } paid by ${group.users[expense.creditor]}`}
                      >
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            {Object.entries(expense.debtors).map(
                              ([id, share]) => (
                                <p key={id}>
                                  {group.users[id]} owes {selectedCurrency}
                                  {share.toFixed(2)}
                                </p>
                              )
                            )}
                          </div>
                          <div className="flex justify-end">
                            <Button
                              onPress={() => {
                                setIsEditingExpense(true);
                                setExpenseToEdit(expense.id);
                              }}
                              variant="light"
                              isIconOnly
                              size="md"
                              radius="sm"
                              startContent={<EditIcon />}
                            ></Button>
                          </div>
                        </div>
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
                      {group.users[transaction.to]} {selectedCurrency}
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
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Tab>
            <Tab title="Stats"></Tab>
          </Tabs>
        </div>
        <AddExpenseModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          name={name}
          setName={setName}
          amount={amount}
          setAmount={setAmount}
          payer={payer}
          setPayer={setPayer}
          participants={participants}
          setParticipants={setParticipants}
          group={group}
          handleAddExpense={handleAddExpense}
        />

        <EditExpenseModal
          isEditingExpenseOpen={isEditingExpenseOpen}
          setIsEditingExpense={setIsEditingExpense}
          onDeleteExpenseOpen={onDeleteExpenseOpen}
          editExpense={editExpense}
          expenseId={expenseToEdit}
          expenseToEdit={expenseToEditContent}
          groupId={groupId}
          groupExpenses={groupExpenses}
          groupUsers={groupUsers}
          groups={groups}
        />

        <ConfirmDeleteGroupModal
          isDeleteOpen={isDeleteOpen}
          onDeleteOpenChange={onDeleteOpenChange}
          handleDeleteGroup={handleDeleteGroup}
        />

        <ConfirmDeleteExpenseModal
          isDeleteExpenseOpen={isDeleteExpenseOpen}
          onDeleteExpenseOpenChange={onDeleteExpenseOpenChange}
          handleDeleteExpense={handleDeleteExpense}
        />

        <EditGroupModal
          isEditingGroup={isEditingGroup}
          setIsEditingGroup={setIsEditingGroup}
          groupId={groupId}
          updatedGroupName={updatedGroupName}
          setUpdatedGroupName={setUpdatedGroupName}
          updatedUsers={updatedUsers}
          setUpdatedUsers={setUpdatedUsers}
          newUserName={newUserName}
          setNewUserName={setNewUserName}
          handleAddNewUser={handleAddNewUser}
          handleSaveGroupChanges={handleSaveGroupChanges}
          onDeleteOpen={onDeleteOpen}
        />

        <Button
          onPress={onOpen}
          variant="flat"
          size="md"
          radius="sm"
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          startContent={<AddIcon />}
        >
          Add expense
        </Button>
      </div>
    </div>
  );
};

export default Group;
