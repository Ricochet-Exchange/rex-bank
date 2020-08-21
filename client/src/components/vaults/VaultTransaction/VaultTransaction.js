import React, { useContext, useState } from "react";
import { Button, Input } from "antd";

import { BankContext } from "../../../contexts/BankContext";
import { getVaultTxCalcValues } from "../../../utils/helpers";
import Loading from "../../shared/Loader/Loader";
import EtherscanLink from "../../shared/EtherscanLink/EthercanLink";
import ApproveToken from "../../shared/ApproveToken/ApproveToken";

import "./VaultTransaction.scss";

const VaultTransaction = ({
  activeTransaction,
  setActiveTransaction,
  bank,
  tx,
  setTx,
}) => {
  const { dispatch } = useContext(BankContext);
  const [newValue, setNewValue] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [localApproved, setLocalApproved] = useState();

  const handleAction = async () => {
    if (+newValue > 0) {
      setLoading(true);

      let res;
      if (activeTransaction === "withdraw") {
        res = await bank.service.withdraw(newValue, setTx);
      }

      if (activeTransaction === "deposit") {
        res = await bank.service.deposit(newValue, setTx);
      }

      if (activeTransaction === "borrow") {
        res = await bank.service.borrow(newValue, setTx);
      }

      if (activeTransaction === "repay") {
        res = await bank.service.repay(newValue, setTx);
      }

      if (res.error) {
        setError("Transaction Error");
        setLoading(false);
        setTx(null);
      } else {
        dispatch({ type: "refreshBanks" });
        setActiveTransaction(null);
      }
    }
  };

  const isCollateral =
    activeTransaction === "withdraw" || activeTransaction === "deposit";

  const handleCancel = () => {
    setNewValue(null);
    setActiveTransaction(null);
  };

  const handleChange = (e) => {
    setNewValue(e.target.value);
  };

  const needsRepayUnlock = () => {
    const isRepay = activeTransaction === "repay";
    const needsApproval =
      +bank.data.debtToken.unlockedAmount === 0 ||
      +newValue > +bank.data.debtToken.unlockedAmount;
    return isRepay && needsApproval && !localApproved;
  };

  const data = bank.data;
  const vaultTxCalcValues = getVaultTxCalcValues(
    data,
    activeTransaction,
    newValue
  );

  return (
    <div className="VaultTransaction">
      {loading ? (
        <>
          <Loading size="small" />
          {tx ? <EtherscanLink path="tx" hash={tx} /> : null}
        </>
      ) : (
        <>
          <div className="VaultTransaction__preview">
            <div>
              <p>New collateralization ratio</p>
              <p>{vaultTxCalcValues.newCollateralizationRatio} %</p>
            </div>
            <div>
              <p>New liquidation price</p>
              <p>
                {vaultTxCalcValues.newLiquidationPrice}{" "}
                {data.collateralToken.symbol}
                /USD
              </p>
            </div>
          </div>
          <div className="VaultTransaction__form">
            {needsRepayUnlock() ? (
              <>
                <p>Please give allowance for your repay to continue.</p>
                <ApproveToken
                  tokenAddress={bank.data.debtToken.address}
                  bankAddress={bank.service.contractAddr}
                  setError={setError}
                  setLocalApproved={setLocalApproved}
                />
              </>
            ) : (
              <>
                <p>
                  How much{" "}
                  {isCollateral
                    ? bank.data.collateralToken.symbol
                    : bank.data.debtToken.symbol}{" "}
                  do you wish to {activeTransaction}?
                </p>

                <Input
                  type="number"
                  size="large"
                  value={newValue}
                  onChange={handleChange}
                  addonAfter={
                    isCollateral
                      ? bank.data.collateralToken.symbol
                      : bank.data.debtToken.symbol
                  }
                />
              </>
            )}
          </div>
          <div className="VaultTransaction__buttons">
            <Button type="link" onClick={() => handleCancel()}>
              cancel
            </Button>
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={() => handleAction()}
              disabled={!newValue}
            >
              {activeTransaction}
            </Button>
          </div>

          {error ? (
            <div>
              <p>{error}</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default VaultTransaction;
