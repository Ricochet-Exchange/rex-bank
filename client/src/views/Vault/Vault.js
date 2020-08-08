import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "antd";
import { BankOutlined } from "@ant-design/icons";

import { BankContext } from "../../contexts/BankContext";
import { Web3Context } from "../../contexts/RootContexts";
import BankService from "../../utils/bank-service";
import BankStatusBar from "../../components/banks/BankStatusBar/BankStatusBar";
import VaultDetails from "../../components/vaults/VaultDetails/VaultDetails";
import Loading from "../../components/shared/Loader/Loader";

import "./Vault.scss";
import Icons from "../../Icons";


const Vault = () => {
  const [web3] = useContext(Web3Context);
  const { state, dispatch } = useContext(BankContext);
  const params = useParams();

  useEffect(() => {
    const getBankData = async () => {
      const bankService = new BankService(params.contractAddress, web3.service);
      const bankState = await bankService.getBankState();

      console.log("bankState", bankState);

      dispatch({
        type: "setActiveBank",
        payload: {
          service: bankService,
          address: params.contractAddress,
          data: bankState,
        },
      });
    };

    const hasWeb3 = web3 && web3.service;
    const hasBank = state.activeBank.address === params.contractAddress;

    if (hasWeb3 && !hasBank) {
      getBankData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3, state.activeBank]);

  return (
    <div>
      {state.activeBank && state.activeBank.data ? (
        <>
          {state.activeBank.data.vault.hasVault ? (
            <>
              <BankStatusBar />
              <VaultDetails />
            </>
          ) : (
            <div className="Vault__Empty">
              <p>You didn't create a vault yet.<br /><strong>Choose a bank to create a vault with.</strong></p>
              <Link to="/">
              <Button
                className="heavyshadow"
                size="large"
              >
                <Icons.Bank fill="#4F56B5"/>
                view banks
              </Button>
              </Link>
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Vault;
