import React, { useContext, useState } from "react";
import { Button } from "antd";
import TokenService from "../../../utils/token-service";
import { Web3Context } from "../../../contexts/RootContexts";
import Loading from "../Loader/Loader";

const ApproveToken = ({ tokenAddress, bankAddress, setError }) => {
  const [web3] = useContext(Web3Context);
  const [loading, setLoading] = useState();

  const handleClick = async () => {
    setLoading(true);

    const tokenService = new TokenService(tokenAddress, web3.service);
    const approval = await tokenService.approve(web3.account, bankAddress);

    console.log("approval", approval);
    if (approval.error) {
      setError("Error approving token allowance");
    }
    //approval.error or its' good
    // alert("wip - coming soon");

    setLoading(false);
  };
  return (
    <div className="ApproveToken">
      {loading ? (
        <Loading />
      ) : (
        <Button onClick={() => handleClick()}>give allowance</Button>
      )}
    </div>
  );
};

export default ApproveToken;
