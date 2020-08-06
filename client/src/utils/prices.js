import axios from "axios";

const geckoURL = "https://api.coingecko.com/api/v3/simple/token_price";

export const getUsd = async (tokenAddress) => {
  const instance = axios.create({
    baseURL: geckoURL,
    headers: { "Content-Type": "application/json" },
  });

  try {
    return await instance.get(
      `/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
    );
  } catch (err) {
    throw new Error(err);
  }
};
