import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@nextui-org/react";
  
  const ConfirmDeleteExpenseModal = ({
    isDeleteExpenseOpen,
    onDeleteExpenseOpenChange,
    handleDeleteExpense,
  }) => {
    return (
      <Modal
        isOpen={isDeleteExpenseOpen}
        onClose={onDeleteExpenseOpenChange}
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
                onPress={onDeleteExpenseOpenChange}
              >
                Cancel
              </Button>
              <Button
                variant="flat"
                size="md"
                radius="sm"
                className="text-red-500"
                onPress={handleDeleteExpense}
              >
                Confirm Delete
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ConfirmDeleteExpenseModal;
  