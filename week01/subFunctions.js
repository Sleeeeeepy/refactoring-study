// If new genre is added, than we should edit 'switch' part in 'calcPerfByPlayTypes' and 'calcCreditsByPlayTypes ' together.

/**
 * An object for setting value for each properties by play types.
 * For unify data convention, it would handle by json file as invocies and plays.
 */
const playtypeSetting = require("./playType.json");

/**
 *
 * @param {*} perf A performance from invoice.json's object, charged performance's id to customer.
 * @param {*} playType A type name from the value, pairing with key:playID.
 * @returns Charged fee classified by its play type.
 */
const calcPerfByPlayTypes = (perf, playType) => {
  if (playtypeSetting[playType] === undefined) {
    throw new Error(`알 수 없는 장르: ${playType}`);
  }

  let thisTypeInfo = playtypeSetting[playType];
  const {
    chargeAmount,
    chargeLimitAud,
    chargeDefault,
    chargePerOverAud,
    chargePerAud,
  } = thisTypeInfo;

  // set default amount and limit
  let thisBilling = chargeAmount;
  const isAudOverLimit = perf.audience - chargeLimitAud;

  // if amount of audience is over
  if (isAudOverLimit > 0) {
    thisBilling += chargeDefault + chargePerOverAud * isAudOverLimit;
  }

  if (chargePerAud != 0) {
    thisBilling += chargePerAud * perf.audience;
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

  let thisTypeInfo = playtypeSetting[playType];
  const { creditBonusPerAud } = thisTypeInfo;

  // if credit bonus is exist
  if (creditBonusPerAud != 0) {
    thisCredit += Math.floor(thisAudience / creditBonusPerAud);
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

  console.log("inputTagType", inputTagType, typeof inputTagType);

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
