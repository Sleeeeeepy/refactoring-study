// seperation for export
const subFunctions = require("./subFunctions");
const {
  calcPerfByPlayTypes,
  calcCreditsByPlayTypes,
  formatBilling,
  addTagByType,
} = subFunctions;

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = "";

  let thisBilling = "";
  let resultBilling = "";

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let billing = 0;
    // 1. calculate play by this type.
    billing = calcPerfByPlayTypes(perf, play.type);
    // 2. calcuate and save credits by type of play.
    volumeCredits += calcCreditsByPlayTypes(perf, play.type);
    totalAmount += billing;
    // 3. Printing Bills
    thisBilling += ` ${play.name}: ${formatBilling(billing)} (${
      perf.audience
    }석)\n`;
    resultBilling += addTagByType(thisBilling, "li");
    thisBilling = "";
  }

  const resultTitle = `청구 내역 (고객명: ${invoice.customer})`;
  const resultTotal = `총액: ${formatBilling(totalAmount)}`;
  const resultCredits = `적립 포인트: ${volumeCredits}점`;

  result += addTagByType(resultTitle, "h1") + "\n";
  result += addTagByType(resultBilling, "ul") + "\n";
  result += addTagByType(resultTotal, "p") + "\n";
  result += addTagByType(resultCredits, "p") + "\n";

  // console.log(result);
  return result;
}

module.exports = statement;
