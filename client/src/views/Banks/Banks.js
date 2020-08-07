import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

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

    if (web3 && web3.service) {
      getBankData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  return (
    <div>
      {state.activeBank && state.activeBank.data ? (
        <div className="BankTotal">
          <BankStatusBar />
          <BankDetails />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Banks;
