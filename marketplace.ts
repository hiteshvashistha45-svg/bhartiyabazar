export function calculateCommission(amount: number, commissionPercent: number) {
  const commission = Number((amount * (commissionPercent / 100)).toFixed(2));
  return {
    commission,
    shopPayout: Number((amount - commission).toFixed(2)),
  };
}

export function calculateOrderBreakdown(total: number, paymentMode: "UPI" | "COD", commissionPercent: number) {
  if (paymentMode === "COD") {
    return { total, commission: 0, shopPayout: total, paymentMode };
  }
  const { commission, shopPayout } = calculateCommission(total, commissionPercent);
  return { total, commission, shopPayout, paymentMode };
}
