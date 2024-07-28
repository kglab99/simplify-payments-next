import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@nextui-org/react";
import { Add as AddIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

const EditGroupModal = ({
  isEditingGroup,
  setIsEditingGroup,
  groupId,
  updatedGroupName,
  setUpdatedGroupName,
  updatedUsers,
  setUpdatedUsers,
  newUserName,
  setNewUserName,
  handleAddNewUser,
  handleSaveGroupChanges,
  onDeleteOpen,
}) => {
  return (
    <Modal
      isOpen={isEditingGroup}
      onClose={() => setIsEditingGroup(false)}
      scrollBehavior="inside"
      radius="none"
    >
      <ModalContent className="m-0 rounded-t-lg">
        <ModalHeader>Edit Group</ModalHeader>
        <ModalBody>
          <Input
            size="sm"
            variant="bordered"
            label="Group Name"
            value={updatedGroupName}
            onChange={(e) => setUpdatedGroupName(e.target.value)}
          />
          <div>
            <div className="flex flex-col gap-3">
              {Object.entries(updatedUsers).map(([id, userName]) => (
                <div key={id} className="flex items-center">
                  <Input
                    variant="flat"
                    radius="sm"
                    value={userName}
                    label={`Member`}
                    className="content-stretch	select-input"
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
  );
};

export default EditGroupModal;
