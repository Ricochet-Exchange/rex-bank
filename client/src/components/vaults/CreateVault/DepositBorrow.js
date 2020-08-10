import React from "react";
import { Button, Input } from "antd";

import ApproveToken from "../../shared/ApproveToken/ApproveToken";

import "./CreateVault.scss";

const DepositBorrow = ({ vaultData, setVaultData, setStep, bank }) => {
  const handleChange = (e) => {
    const update = { [e.target.name]: e.target.value };
    setVaultData((prevState) => {
      return { ...prevState, ...update };
    });
  };

  const handleNextClick = () => {
    //some validation and
    setStep(4);
    //kickoff transaction
  };

  const needsUnlock =
    +vaultData.depositAmount > +bank.data.collateralToken.unlockedAmount;

  return (
    <>
      <p>
        How much {vaultData.collateralToken} do you want to lock up as
        collateral?
      </p>
      <Input
        type="number"
        name="depositAmount"
        value={vaultData.depositAmount}
        onChange={handleChange}
        addonAfter={vaultData.collateralToken}
      />

      {needsUnlock ? (
        <>
          <p>Please give allowance for your collateral to continue.</p>
          <ApproveToken
            tokenAddress={bank.data.collateralToken.address}
            bankAddress={bank.service.contractAddr}
          />
        </>
      ) : null}

      <p>How much {vaultData.debtToken} do you want to borrow?</p>
      <Input
        type="number"
        name="borrowAmount"
        value={vaultData.borrowAmount}
        onChange={handleChange}
        addonAfter={vaultData.debtToken}
      />

      {/* <Button disabled={needsUnlock} onClick={() => handleNextClick()}> */}
      <Button disabled={needsUnlock} onClick={() => handleNextClick()}>
        next
      </Button>
    </>
  );
};

export default DepositBorrow;
