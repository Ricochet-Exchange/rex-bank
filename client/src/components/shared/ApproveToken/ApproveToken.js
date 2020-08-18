import React, { useContext, useState } from "react";
import { Button } from "antd";

import { Web3Context } from "../../../contexts/RootContexts";
import TokenService from "../../../utils/token-service";
import Loading from "../Loader/Loader";

const ApproveToken = ({
  tokenAddress,
  bankAddress,
  setError,
  setLocalApproved,
}) => {
  const [web3] = useContext(Web3Context);
  const [loading, setLoading] = useState();

  const handleClick = async () => {
    setLoading(true);

    const tokenService = new TokenService(tokenAddress, web3.service);
    const approval = await tokenService.approve(web3.account, bankAddress);

    console.log("approval", approval);
    if (approval.error) {
      setError("Error approving token allowance");
    } else {
      setLocalApproved(true);
    }

    setLoading(false);
  };
  return (
    <div className="ApproveToken">
      {loading ? (
        <Loading size="small" />
      ) : (
        <Button
          shape="round"
          size="large"
          className="purpleoutlined"
          onClick={() => handleClick()}
        >
          give allowance
        </Button>
      )}
    </div>
  );
};

export default ApproveToken;
