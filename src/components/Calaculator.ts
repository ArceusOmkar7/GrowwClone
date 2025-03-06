export const calculateSIP = (
  expectedReturnRate: number,
  timePeriod: number,
  monthlyInvestment: number,
  setInvestedAmount: React.Dispatch<React.SetStateAction<number>>,
  setEstimatedReturns: React.Dispatch<React.SetStateAction<number>>,
  setTotalValue: React.Dispatch<React.SetStateAction<number>>
) => {
  const monthlyRate = expectedReturnRate / (12 * 100);
  const totalMonths = timePeriod * 12;
  const invested = monthlyInvestment * totalMonths;
  const totalVal =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate)) /
      monthlyRate);
  const returns = totalVal - invested;

  setInvestedAmount(Math.round(invested));
  setEstimatedReturns(Math.round(returns));
  setTotalValue(Math.round(totalVal));
};
