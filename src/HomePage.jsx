import {
  Navbar,
  NavbarBrand,
  Breadcrumbs,
  BreadcrumbItem,
  Listbox,
  ListboxItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { useState } from "react";

const availableCurrencies = ["USD", "EUR", "GBP"];

export default function HomePage({ groups, selectedCurrency, updateCurrency }) {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState(selectedCurrency);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    updateCurrency(newCurrency);
  };

  return (
    <div className="flex flex-col">
      <Navbar maxWidth="full" isBordered isBlurred>
        <NavbarBrand>
          <p className="font-bold text-inherit">Simplify Payments</p>
        </NavbarBrand>
      </Navbar>

      <div className="flex flex-col gap-4 px-6 py-4">
        <Breadcrumbs>
          <BreadcrumbItem>Groups</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex flex-col">
          <Tabs aria-label="Options" variant="solid" radius="sm" fullWidth>
            <Tab title="Groups">
              {groups.length > 0 ? (
                <Listbox>
                  {groups.map((group) => (
                    <ListboxItem
                      key={group.id}
                      showDivider
                      // endContent={<ChevronRightIcon />}
                    >
                      <Accordion>
                        <AccordionItem
                          className="custom-accordion-item"
                          title={group.groupName}
                          subtitle={Object.values(group.users).join(", ")}
                          // hideIndicator
                          // disableAnimation
                          onPress={() => navigate(`/group/${group.id}`)}
                        ></AccordionItem>
                      </Accordion>
                    </ListboxItem>
                  ))}
                </Listbox>
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
                  onSelectionChange={(selected) =>
                    handleCurrencyChange(selected.currentKey)
                  }
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
      </div>

      <Link className="self-center" to="/create-group">
        <Button
          variant="flat"
          size="md"
          radius="sm"
          startContent={<AddIcon />}
          className="text-black"
          aria-label="Create new group"
        >
          Create new group
        </Button>
      </Link>
    </div>
  );
}
