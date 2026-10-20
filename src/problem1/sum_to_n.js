// Three ways to sum the integers from 1 to n, e.g. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15.
// Negative n mirrors positive n: sum_to_n(-5) === -15.

// Build the list [1, 2, …, n] and add it up.
var sum_to_n_a = function (n) {
  // The last number in 1..lastNumber, which is also how many numbers are added.
  const lastNumber = Math.abs(n);
  // [1, 2, …, lastNumber]: the slot at index i holds the number i + 1.
  const numbers = Array.from({ length: lastNumber }, (_, index) => index + 1);
  // Add each number onto the running total, starting from 0.
  const sum = numbers.reduce((runningTotal, number) => runningTotal + number, 0);
  // 1 for positive n, -1 for negative n, 0 for n = 0.
  const sign = Math.sign(n);

  return sign * sum;
};

// Gauss's formula: n(n + 1) / 2. Halving the even factor first keeps the result a whole number.
var sum_to_n_b = function (n) {
  // The last number in 1..lastNumber, which is also how many numbers are added.
  const lastNumber = Math.abs(n);
  // Pairing first with last (1 + lastNumber, 2 + (lastNumber - 1), …), every pair adds up to this.
  const pairSum = lastNumber + 1;

  // lastNumber and pairSum are consecutive, so exactly one of them is even.
  const isLastNumberEven = lastNumber % 2 === 0;
  const evenFactor = isLastNumberEven ? lastNumber : pairSum;
  const oddFactor = isLastNumberEven ? pairSum : lastNumber;

  const sum = (evenFactor / 2) * oddFactor;
  // 1 for positive n, -1 for negative n, 0 for n = 0.
  const sign = Math.sign(n);

  return sign * sum;
};

// Split the range in half, sum each half, and add them together, until a range is a single number.
var sum_to_n_c = function (n) {
  // Adds every whole number from low to high, inclusive.
  const rangeSum = (low, high) => {
    // Empty range (only when n = 0): nothing to add.
    if (low > high) {
      return 0;
    }

    // A single number: the sum is that number.
    if (low === high) {
      return low;
    }

    const middle = Math.floor((low + high) / 2);
    const lowerHalfSum = rangeSum(low, middle);
    const upperHalfSum = rangeSum(middle + 1, high);

    return lowerHalfSum + upperHalfSum;
  };

  // Positive n sums 1..n; negative n sums n..-1, e.g. -3 + -2 + -1.
  const isNegative = n < 0;
  const firstNumber = isNegative ? n : 1;
  const lastNumber = isNegative ? -1 : n;

  return rangeSum(firstNumber, lastNumber);
};

// Self-check: run `node src/problem1/sum_to_n.js` to compare all three against known results.
const cases = [
  [0, 0],
  [1, 1],
  [2, 3],
  [3, 6],
  [5, 15],
  [10, 55],
  [100, 5050],
  [1000, 500500],
  [-1, -1],
  [-5, -15],
  [-100, -5050],
];

console.table(
  cases.map(([n, expected]) => {
    const [a, b, c] = [sum_to_n_a(n), sum_to_n_b(n), sum_to_n_c(n)];

    return { n, expected, a, b, c, status: a === expected && b === expected && c === expected ? 'PASS' : 'FAIL' };
  }),
);
