import React, { useEffect, useContext } from "react";

import { Web3Context } from "../../contexts/RootContexts";
import { BankContext } from "../../contexts/BankContext";
import BankService from "../../utils/bank-service";
import BankDetails from "../../components/banks/BankDetails/BankDetails";
import Loading from "../../components/shared/Loader/Loader";

import "./Banks.scss";

const Banks = () => {
  const [web3] = useContext(Web3Context);
  const { state, dispatch } = useContext(BankContext);

  useEffect(() => {
    const getBankData = async () => {
      let banks = {};
      for (const bankAddress of state.bankAddresses) {
        const bankService = new BankService(
          bankAddress,
          web3.service,
          web3.account
        );
        const bankState = await bankService.getBankState();
        banks[bankAddress] = { service: bankService, data: bankState };
      }

      dispatch({ type: "setBanks", payload: banks });
    };

    const hasWeb3 = web3 && web3.service;
    const needsData = !state.banks;
    if (hasWeb3 && needsData) {
      getBankData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3, state.banks]);

  const renderBanks = () => {
    return Object.keys(state.banks).map((address) => {
      return (
        <BankDetails
          key={address}
          address={address}
          bank={state.banks[address]}
        />
      );
    });
  };

  return (
    <div>
      {state.banks ? (
        <div className="ContentTotal">{renderBanks()}</div>
      ) : (
        <div className="fullframe">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Banks;
