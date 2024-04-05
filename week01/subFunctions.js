/**
 *
 * @param {*} perf A performance from invoice.json's object, charged performance's id to customer.
 * @param {*} playType A type name from the value, pairing with key:playID.
 * @returns Charged fee classified by its play type.
 */
const calcPerfByPlayTypes = (perf, playType) => {
  let thisBilling = 0;

  switch (playType) {
    case "tragedy":
      thisBilling = 40000;
      if (perf.audience > 30) {
        thisBilling += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy":
      thisBilling = 30000;
      if (perf.audience > 20) {
        thisBilling += 10000 + 500 * (perf.audience - 20);
      }
      thisBilling += 300 * perf.audience;
      break;

    default:
      throw new Error(`알 수 없는 장르: ${playType}`);
  }

  return thisBilling;
};

/**
 *
 * @param {*} perf A performance from invoice.json's object, charged performance's id to customer.
 * @param {*} playType An object which has name and type as the value pairing with performance's's id.
 * @returns Credits of this preformance's play
 */

const calcCreditsByPlayTypes = (perf, playType) => {
  const thisAudience = perf.audience;
  // 포인트를 적립한다.
  let thisCredit = Math.max(thisAudience - 30, 0);

  switch (playType) {
    case "comedy": // 희극 관객 5명마다 추가 포인트를 제공한다.
      thisCredit += Math.floor(thisAudience / 5);
      break;
    default:
      break;
  }

  return thisCredit;
};

/**
 *
 * @param {*} billing : A billing amount of a play
 * @returns :
 */
const formatBilling = (billing) => {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  return format(billing / 100);
};

/**
 *
 * @param {*} content : string inside of tags
 * @param {*} inputTagType : specific html tag chosen by user
 * @returns : html tags
 */
const addTagByType = (content, inputTagType) => {
  let tag;
  let result = "";

  tagType = inputTagType.toLowerCase();
  const tagsArr = ["p", "ul", "ol", "li", "h1", "h2", "h3"];
  const exists = tagsArr.includes(tagType);

  if (!exists) tag = "div";
  else tag = tagType;
  result += `<${tag}>${content}</${tag}>`;

  return result;
};

module.exports = {
  calcPerfByPlayTypes,
  calcCreditsByPlayTypes,
  formatBilling,
  addTagByType,
};
