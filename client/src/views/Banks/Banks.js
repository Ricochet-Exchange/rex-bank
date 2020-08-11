import React, { useEffect, useContext } from "react";

import { Web3Context } from "../../contexts/RootContexts";
import { BankContext } from "../../contexts/BankContext";
import BankService from "../../utils/bank-service";
import BankStatusBar from "../../components/banks/BankStatusBar/BankStatusBar";
import BankDetails from "../../components/banks/BankDetails/BankDetails";
import Loading from "../../components/shared/Loader/Loader";

import "./Banks.scss";

const Banks = () => {
  const [web3] = useContext(Web3Context);
  const { state, dispatch } = useContext(BankContext);

  console.log("web3", web3);

  useEffect(() => {
    console.log("web3", web3);
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
          <div className="ContentTotal">
            <BankStatusBar />
          {renderBanks()}
          </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Banks;
