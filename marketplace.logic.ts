import { describe, expect, it } from "vitest";
import { calculateCommission, calculateOrderBreakdown } from "../shared/marketplace";

describe("Bhartiya Bazar commission logic", () => {
  it("calculates a configurable UPI commission and shop payout", () => {
    expect(calculateCommission(1000, 5)).toEqual({ commission: 50, shopPayout: 950 });
    expect(calculateCommission(799, 7.5)).toEqual({ commission: 59.92, shopPayout: 739.08 });
  });

  it("does not charge commission on COD orders", () => {
    expect(calculateOrderBreakdown(1250, "COD", 5)).toEqual({
      total: 1250,
      commission: 0,
      shopPayout: 1250,
      paymentMode: "COD",
    });
  });

  it("uses the current commission percent for UPI orders", () => {
    expect(calculateOrderBreakdown(2400, "UPI", 3)).toEqual({
      total: 2400,
      commission: 72,
      shopPayout: 2328,
      paymentMode: "UPI",
    });
  });
});
