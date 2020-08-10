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

  useEffect(() => {
    const getBankData = async () => {
      console.log("state", state);

      let banks = {};
      for (const bankAddress of state.bankAddresses) {
        const bankService = new BankService(bankAddress, web3.service);
        console.log("bankService", bankService);
        const bankState = await bankService.getBankState();

        banks[bankAddress] = { service: bankService, data: bankState };
      }

      console.log("after", banks);

      dispatch({ type: "setBanks", payload: banks });
    };

    if (web3 && web3.service) {
      getBankData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  return (
    <div>
      {state.banks ? (
        <div className="BankTotal">
          <BankStatusBar />
          {/* <BankDetails /> */}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Banks;
