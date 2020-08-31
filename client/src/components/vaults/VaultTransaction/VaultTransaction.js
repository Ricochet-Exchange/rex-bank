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

  const handleMaxRepay = () => {
    setNewValue(+bank.data.vault.debtAmount / 1e18);
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
            <div className="VaultDetail">
              <p>New collateralization ratio</p>
              <h3>
                {vaultTxCalcValues.newCollateralizationRatio === Infinity
                  ? ""
                  : vaultTxCalcValues.newCollateralizationRatio.toFixed(2)}{" "}
                %
              </h3>
            </div>
            <div className="VaultDetail">
              <p>New liquidation price</p>
              <h3>
                {vaultTxCalcValues.newLiquidationPrice.toFixed(4)}{" "}
                {data.collateralToken.symbol}
                /USD
              </h3>
            </div>
          </div>
          <div className="VaultTransaction__form__Total">
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
              {activeTransaction === "repay" ? (
                <Button type="link" onClick={() => handleMaxRepay()}>
                  repay max
                </Button>
              ) : null}
              <Button type="link" onClick={() => handleCancel()}>
                cancel
              </Button>
              <Button
                type="primary"
                shape="round"
                size="large"
                className="purplebutton"
                onClick={() => handleAction()}
                disabled={!newValue}
              >
                {activeTransaction}
              </Button>
            </div>
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
