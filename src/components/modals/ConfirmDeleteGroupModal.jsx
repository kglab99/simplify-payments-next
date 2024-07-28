import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@nextui-org/react";
  
  const ConfirmDeleteGroupModal = ({
    isDeleteOpen,
    onDeleteOpenChange,
    handleDeleteGroup,
  }) => {
    return (
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteOpenChange}
        scrollBehavior="inside"
        radius="none"
      >
        <ModalContent className="m-0 rounded-t-lg">
          <ModalHeader>Confirm Delete Group</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this group? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <div className="justify-items-stretch">
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
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ConfirmDeleteGroupModal;
  