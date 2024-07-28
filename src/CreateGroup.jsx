import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import { Button, ButtonGroup } from "@nextui-org/button";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link } from "react-router-dom";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";

export default function CreateGroup({ addGroup }) {
  const [groupName, setGroupName] = useState("");
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleAddUser = () => {
    if (userName.trim() !== "") {
      setUsers([...users, userName]);
      setUserName("");
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() !== "" && users.length >= 2) {
      addGroup(groupName, users);
      setGroupName("");
      setUsers([]);
      navigate("/");
    }
  };

  const isCreateButtonDisabled = groupName.trim() === "" || users.length < 2;

  return (
    <div className="flex flex-col ">
      <Navbar isBordered={true} isBlurred={true} className="pl-0">
        <Link to="/">
          <Button isIconOnly variant="light" aria-label="Back">
            <ArrowBackIosNewIcon />
          </Button>
        </Link>
      </Navbar>

      <div className="flex flex-col gap-4 px-6 py-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Groups</BreadcrumbItem>
          <BreadcrumbItem>Create Group</BreadcrumbItem>
        </Breadcrumbs>
        <Input
          variant="flat"
          isRequired
          size="sm"
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <Input
            variant="flat"
            size="sm"
            label="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button
            isIconOnly
            variant="flat"
            size="lg"
            radius="sm"
            className="text-black"
            onClick={handleAddUser}
          >
            <AddIcon />
          </Button>
        </div>

        {users.length > 0 && (
          <Listbox>
            {users.map((user, index) => (
              <ListboxItem key={index}>{user}</ListboxItem>
            ))}
          </Listbox>
        )}

        {isCreateButtonDisabled && (
          <p className="text-zinc-500 text-sm px-2">
            Add a group name and a minimum of two users.
          </p>
        )}
      </div>
      <Button
        variant="flat"
        size="md"
        radius="sm"
        startContent={<AddIcon />}
        className="text-black self-center"
        onClick={handleCreateGroup}
        isDisabled={isCreateButtonDisabled}
      >
        Create group
      </Button>
    </div>
  );
}
