import { Button, Modal } from "antd";
import { useState } from "react";

interface Props {
  state: {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
  };
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
}

export const ConfirmModal = ({ title, state, onConfirm, onCancel }: Props) => {
  const { isOpen, setOpen } = state;

  const handleOk = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    }
    setOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <p>Are you sure you want to perform this action?</p>
    </Modal>
  );
};
