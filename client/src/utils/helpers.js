export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
};

export const getVaultCalcValues = (data) => {
  const cR = +data.collateralizationRatio / 100;
  const aD = +data.vault.debtAmount / 10 ** +data.debtToken.decimals;
  const pD = +data.debtToken.price / +data.debtToken.granularityPrice;
  const aC =
    +data.vault.collateralAmount / 10 ** +data.collateralToken.decimals;
  const pC =
    +data.collateralToken.price / +data.collateralToken.granularityPrice;
  const liquidationPrice = (cR * aD * pD) / aC;
  const withdrawAvailable = aC - (cR * aD * pD) / pC;
  const borrowAvailable = (aC * pC) / pD / cR - aD;

  return {
    liquidationPrice,
    withdrawAvailable,
    borrowAvailable,
  };
};

export const getVaultTxCalcValues = (data, activeTransaction, newValue) => {
  const cR = +data.collateralizationRatio / 100;
  let aD = +data.vault.debtAmount / 10 ** +data.debtToken.decimals;
  aD = getAdModifier(aD, activeTransaction, newValue);
  const pD = +data.debtToken.price / +data.debtToken.granularityPrice;
  let aC = +data.vault.collateralAmount / 10 ** +data.collateralToken.decimals;
  aC = getAcModifier(aC, activeTransaction, newValue);
  const pC =
    +data.collateralToken.price / +data.collateralToken.granularityPrice;

  const newLiquidationPrice = (cR * aD * pD) / aC;
  const newCollateralizationRatio = ((aC * pC) / aD) * pD;

  return {
    newLiquidationPrice: newLiquidationPrice,
    newCollateralizationRatio: !+newValue
      ? +data.vault.collateralizationRatio / 100
      : newCollateralizationRatio * 100,
  };
};

const getAcModifier = (aC, activeTransaction, newValue) => {
  if (
    activeTransaction === "borrow" ||
    activeTransaction === "repay" ||
    !+newValue
  ) {
    return aC;
  } else if (activeTransaction === "widthdraw") {
    return aC - +newValue;
  } else {
    return aC + +newValue;
  }
};

const getAdModifier = (aD, activeTransaction, newValue) => {
  if (
    activeTransaction === "widthdraw" ||
    activeTransaction === "deposit" ||
    !+newValue
  ) {
    return aD;
  } else if (activeTransaction === "borrow") {
    return aD + +newValue;
  } else {
    return aD - +newValue;
  }
};
