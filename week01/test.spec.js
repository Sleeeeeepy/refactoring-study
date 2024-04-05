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
    //expect(insertJson()).toBe([65000, 58000, 50000]);
    expect(insertJson(calcPerfByPlayTypes, testData)).toEqual([
      65000, 58000, 50000,
    ]);
  });

  test("2. calcCreditsByPlayTypes", () => {
    const nums = insertJson(calcCreditsByPlayTypes, testData);
    let sum = 0;
    nums.forEach((num) => {
      sum += num;
    });
    expect(sum).toBe(47);
  });

  test("3. formatBilling", () => {
    const billings = insertJson(calcPerfByPlayTypes, testData);
    const converted = [];
    billings.forEach((billing) => {
      converted.push(formatBilling(billing));
    });

    expect(converted).toEqual(["$650.00", "$580.00", "$500.00"]);
  });

  test("4. addTagByType", () => {
    const content = "test";
    const tags = ["p", "h1", "ol", "nope"];
    const addedRes = [];
    for (let tag of tags) {
      addedRes.push(addTagByType(content, tag));
    }

    const tobeArr = [
      "<p>test</p>",
      "<h1>test</h1>",
      "<ol>test</ol>",
      "<div>test</div>",
    ];

    expect(addedRes).toEqual(tobeArr);
  });
});
