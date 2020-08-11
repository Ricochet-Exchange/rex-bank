import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import { BankContext } from "../../contexts/BankContext";
import { Web3Context } from "../../contexts/RootContexts";
import BankService from "../../utils/bank-service";
import BankStatusBar from "../../components/banks/BankStatusBar/BankStatusBar";
import VaultDetails from "../../components/vaults/VaultDetails/VaultDetails";
import Loading from "../../components/shared/Loader/Loader";
import Icons from "../../Icons";

import "./Vault.scss";
import Web3SignIn from "../../components/account/Web3SignIn";

const Vault = () => {
  const [web3] = useContext(Web3Context);
  const { state, dispatch } = useContext(BankContext);
  const [hasVault, setHasVault] = useState();

  useEffect(() => {
    const getBankData = async () => {
      let banks = {};
      for (const bankAddress of state.bankAddresses) {
        const bankService = new BankService(
          bankAddress,
          web3.service,
          web3.account !== ""
        );
        const bankState = await bankService.getBankState();
        banks[bankAddress] = { service: bankService, data: bankState };
      }

      dispatch({ type: "setBanks", payload: banks });
    };

    if (web3 && web3.service && !state.banks) {
      getBankData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  useEffect(() => {
    if (state.banks) {
      setHasVault(
        Object.keys(state.banks).some(
          (address) => state.banks[address].data.vault.hasVault
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.banks]);

  const renderVaults = () => {
    return Object.keys(state.banks).map((address) => {
      return (
        <VaultDetails
          key={address}
          address={address}
          bank={state.banks[address]}
        />
      );
    });
  };

  return (
    <>
      {web3 && web3.account ? (
        <>
          {state.banks ? (
            <div className="ContentTotal">
              <BankStatusBar />
              {!hasVault ? (
                <>{renderVaults()}</>
              ) : (
                <div className="Vault__Empty">
                  <p>
                    You didn't create a vault yet.
                    <br />
                    <strong>Choose a bank to create a vault with.</strong>
                  </p>
                  <Link to="/">
                    <Button className="heavyshadow" size="large">
                      <Icons.Bank fill="#4F56B5" />
                      view banks
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Loading />
          )}
        </>
      ) : (
        <div className="Vault__Empty">
          <p>Sign in to see your vaults</p>
          <Web3SignIn />
        </div>
      )}
    </>
  );
};

export default Vault;
