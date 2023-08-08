const power = require("./power");

it("2-ning 3-darajasi 8", () => {
  const result = power(2, 3);
  expect(result).toBe(8);
});

it("2 soni 1 dan katta", () => {
  expect(2 > 1).toBe(true);
  expect(2).toBeGreaterThan(1);
});
