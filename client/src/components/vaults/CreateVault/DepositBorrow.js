import React, { useState } from "react";
import { Button, Input } from "antd";

import ApproveToken from "../../shared/ApproveToken/ApproveToken";
import Loading from "../../shared/Loader/Loader";
import EtherscanLink from "../../shared/EtherscanLink/EthercanLink";

import "./CreateVault.scss";

const DepositBorrow = ({ vaultData, setVaultData, setStep, bank }) => {
  const [error, setError] = useState();
  const [tx, setTx] = useState();
  const [loading, setLoading] = useState();

  const handleChange = (e) => {
    const update = { [e.target.name]: e.target.value };
    setVaultData((prevState) => {
      return { ...prevState, ...update };
    });
  };

  const handleNextClick = async () => {
    //TODO: some validation to ensure balance of collateral token?
    if (+vaultData.depositAmount > 0) {
      setLoading(true);
      const depositRes = await bank.service.deposit(
        vaultData.depositAmount,
        setTx
      );

      if (depositRes.error) {
        setError("Error depositing token");
      }
      setLoading(false);
      setTx(null);
    }

    if (+vaultData.borrowAmount > 0) {
      setLoading(true);
      const borrowRes = await bank.service.borrow(
        vaultData.borrowAmount,
        setTx
      );

      if (borrowRes.error) {
        setError("Error borrowing token");
      }

      setLoading(false);
      setTx(null);
    }

    setStep(3);
  };

  const needsUnlock =
    +vaultData.depositAmount > +bank.data.collateralToken.unlockedAmount;

  return (
    <>
      {loading ? (
        <>
          <Loading size="small" />
          {tx ? <EtherscanLink path="tx" hash={tx} /> : null}
        </>
      ) : (
        <div className="CreateVault__Steps">
          <div className="CreateVault__Step">
            <p>
              How much {vaultData.collateralToken} do you want to lock up as
              collateral?
            </p>
            <Input
              type="number"
              name="depositAmount"
              size="large"
              value={vaultData.depositAmount}
              onChange={handleChange}
              addonAfter={vaultData.collateralToken}
            />

            {needsUnlock ? (
              <>
                <p className="smalltxt">
                  Please give allowance for your collateral to continue.
                </p>
                <ApproveToken
                  tokenAddress={bank.data.collateralToken.address}
                  bankAddress={bank.service.contractAddr}
                  setError={setError}
                />
              </>
            ) : null}
          </div>
          <div className="CreateVault__Step">
            <p className={needsUnlock && "disabled"}>
              How much {vaultData.debtToken} do you want to borrow?
            </p>
            <Input
              type="number"
              name="borrowAmount"
              size="large"
              disabled={needsUnlock}
              value={vaultData.borrowAmount}
              onChange={handleChange}
              addonAfter={vaultData.debtToken}
            />

            {error ? (
              <div>
                <p>{error}</p>
              </div>
            ) : null}
          </div>
          <div className="CreateVault__Submitter">
            <Button
              shape="round"
              size="large"
              className="purplebutton"
              disabled={needsUnlock}
              onClick={() => handleNextClick()}
            >
              submit
            </Button>
            <p className={"smalltxt " + (needsUnlock && "disabled")}>
              Upon submitting, 2 transactions will be initiated.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DepositBorrow;
