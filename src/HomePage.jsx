import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import AddIcon from "@mui/icons-material/Add";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function HomePage({ groups }) {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col ">
      <Navbar isBordered={true} isBlurred={true}>
        <NavbarBrand>
          <p className="font-bold text-inherit">Simplify Payments</p>
        </NavbarBrand>
      </Navbar>
      <div className="px-6 py-4">
        <Breadcrumbs>
          <BreadcrumbItem>Groups</BreadcrumbItem>
        </Breadcrumbs>

        <Listbox>
          {groups.map((group) => (
            <ListboxItem key={group.id} endContent={<ChevronRightIcon />} onClick={() => navigate(`/group/${group.id}`)}>
              <h2 className="text-xl font-bold">{group.groupName}</h2>
              <p> {Object.values(group.users).join(", ")}</p>
            </ListboxItem>
          ))}
        </Listbox>
      </div>

      <Link className="self-center" to="/create-group">
        <Button
          variant="flat"
          size="md"
          //   color="primary"
          radius="sm"
          startContent={<AddIcon />}
          className="text-black"
        >
          Create new group
        </Button>
      </Link>
    </div>
  );
}
