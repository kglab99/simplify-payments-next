import {
  Navbar,
  NavbarBrand,
  Breadcrumbs,
  BreadcrumbItem,
  Listbox,
  ListboxItem,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Accordion,
  AccordionItem
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const availableCurrencies = ["$", "£"];

const GroupList = ({ groups, navigate }) => (
  <Listbox>
    {groups.map((group) => (
      <ListboxItem key={group.id} showDivider>
        <Accordion>
          <AccordionItem
            className="custom-accordion-item"
            title={group.groupName}
            subtitle={Object.values(group.users).join(", ")}
            onPress={() => navigate(`/group/${group.id}`)}
          />
        </Accordion>
      </ListboxItem>
    ))}
  </Listbox>
);

export default function HomePage({ groups, selectedCurrency, updateCurrency }) {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState(selectedCurrency);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    updateCurrency(newCurrency);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar maxWidth="full" isBordered>
        <NavbarBrand>
          <p className="font-bold text-inherit">Simplify Payments</p>
        </NavbarBrand>
      </Navbar>

      <div className="flex flex-col gap-4 px-6 py-4 flex-grow">
        <Breadcrumbs>
          <BreadcrumbItem>Groups</BreadcrumbItem>
        </Breadcrumbs>

        <Tabs aria-label="Options" variant="solid" radius="sm" fullWidth>
          <Tab title="Groups">
            {groups.length > 0 ? (
              <GroupList groups={groups} navigate={navigate} />
            ) : (
              <div className="py-4">
                <p>No groups found. Create a new group to get started!</p>
              </div>
            )}
          </Tab>

          <Tab title="Settings">
            <Select
              placeholder={selectedCurrency}
              selectedKeys={currency}
              onSelectionChange={(selected) => handleCurrencyChange(selected.currentKey)}
            >
              {availableCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </Select>
          </Tab>
        </Tabs>
      </div>

      <Link to="/create-group">
        <Button
          variant="flat"
          size="md"
          radius="sm"
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          startContent={<AddIcon />}
          aria-label="Create new group"
        >
          Create new group
        </Button>
      </Link>
    </div>
  );
}
