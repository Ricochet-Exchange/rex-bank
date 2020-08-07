import React from "react";
import { Modal } from "antd";

import "./CreateVault.scss";

const CreateVault = ({ visible, setVisible }) => {
  return (
    <>
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        footer={null}
      >
        <h2>Creating a Vault</h2>
        <p>Configure your vault for east management.</p>
        <p>This only has to be done once.</p>
      </Modal>
    </>
  );
};

export default CreateVault;
