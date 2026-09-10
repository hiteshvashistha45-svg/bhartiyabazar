export function calculateCommission(price, percent){
  const commission = price * percent / 100
  return { commission, shopPayout: price - commission }
}
