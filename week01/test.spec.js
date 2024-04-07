/// <reference types="jest" />

const invoices = require("./invoices.json");
const plays = require("./plays.json");
const statement = require("./statement.js");
const target = require("./subFunctions.js");
const subFunctions = require("./testFunctions.js");

// setting variables for test
const {
  calcPerfByPlayTypes,
  calcCreditsByPlayTypes,
  formatBilling,
  addTagByType,
} = target;

const testData = { invoices, plays };
const { insertJson } = subFunctions;

// test codes
describe("함수 단위 테스트", () => {
  test("1. calcPerfByPlayTypes", () => {
    // arr + act
    const targetObj = insertJson(calcPerfByPlayTypes, testData);
    // assert
    expect(targetObj).toEqual([65000, 58000, 50000]);
  });

  test("2. calcCreditsByPlayTypes", () => {
    const nums = insertJson(calcCreditsByPlayTypes, testData); //arr
    let sum = 0;
    //act
    nums.forEach((num) => {
      sum += num;
    });
    //assert
    expect(sum).toBe(47);
  });

  test("3. formatBilling", () => {
    //arr
    const billings = insertJson(calcPerfByPlayTypes, testData);
    const converted = [];
    //act
    billings.forEach((billing) => {
      converted.push(formatBilling(billing));
    });
    //assert
    expect(converted).toEqual(["$650.00", "$580.00", "$500.00"]);
  });

  const content = "test";
  test.each([
    [content, "p", "<p>test</p>"],
    [content, "h1", "<h1>test</h1>"],
    [content, "ol", "<ol>test</ol>"],
    [content, "nope", "<div>test</div>"],
  ])("4. addTagByType checker", (ctn, tag, expected) => {
    expect(addTagByType(ctn, tag)).toBe(expected);
  });
});
