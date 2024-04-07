# Week 01 Refectoring Statement Index

- [Tree](#tree)
  - [Description](#description)
- [Codes](#codes)
  - [1. `calcPerByPlayTypes()`](#1--calcperbyplaytypes---)
    - [Before](#before)
    - [After : Separation into functions](#after---separation-into-functions)
    - [Description](#description-1)
    - [Variable](#variable)
    - [Params](#params)
    - [Return](#return)
  - [2. `calcCreditsByPlayTypes()`](#2--calccreditsbyplaytypes---)
    - [Before](#before-1)
    - [After](#after)
    - [Description](#description-2)
    - [Variable](#variable-1)
    - [Params](#params-1)
    - [Return](#return-1)
  - [3. `formatBilling`](#3--formatbilling-)
    - [Before](#before-2)
    - [After](#after-1)
    - [Description](#description-3)
    - [Params](#params-2)
  - [4. `addTagByType()`](#4--addtagbytype---)
    - [Before](#before-3)
    - [After](#after-2)
    - [Description](#description-4)
    - [Variable](#variable-2)
    - [Params](#params-3)
    - [Return](#return-2)
  - [[Test Code](./test.spec.js)](#-test-code---testspecjs-)
    - [Description](#description-5)
- [etc. | original `statement.js` code](#etc---original--statementjs--code)
  - [Before :: Original Result](#before----original-result)
  - [After :: Current Result](#after----current-result)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Tree

```
refactoring-study
└─ week01
   ├─ invoices.json
   ├─ main.js
   ├─ plays.json
   ├─ readme.md
   ├─ statement.js
   ├─ subFunctions.js //new
   ├─ test.spec.js
   ├─ testFunctions.js //new
   └─ Week01_Refectoring.md //this doc

```

## Description

- `main.js`를 수정하지 않고 테스트를 진행하기 위해 `statement.js`에서 기능을 분리해 만든 함수를 따로 모듈화하는 방향으로 리펙토링하였습니다. `statement.js` 내부에서 함수를 정의할 수 있었으나, 테스트코드의 작성과 향후 유지보수를 위해서 `subFunction.js`로 분리하여 관리하는 것이 유용할 것이라 판단하였습니다.
- `test.spec.js`에서 함수 테스트에 필요한 함수들을 `testFunctions.js`로 모듈화하였습니다. 이유는 동일합니다.

# Codes

## 1. `calcPerByPlayTypes()`

### Before

```javascript
function statement(invoice, plays) {
  let totalAmount = 0;
  //...

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }
    // 포인트를 적립한다.
    // 희극 관객 5명마다 추가 포인트를 제공한다.

    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
    //...
  }
  //...
}
```

### After : Separation into functions

```javascript
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
```

> play type과 청중 수에 따라 개별 performance의 청구액을 계산하는 함수.

### Description

- 기능을 분리한 이유: statement 의 큰 맥락에 세부적으로 계산하는 함수가 들어가니 한눈에 들어오지 않아 분리하였습니다.

### Variable

- `thisAmount` 변수명 변경: amount를 보았을 때 무엇을 뜻하는 것인지 한눈에 알아보기 어려워, 함수 내에서 `thisBilling`으로 변경하고 함수 밖으로 리턴하는 값을 담을 때에는 `billing`이라고 표기하였습니다.

### Params

- `perf`, 순회하고 있는 공연 객체 전체
  - `perf.audience` 자체를 전달할 수 있으나, audience라고 전달하면 함수 내 코드를 읽을 때 개별 공연(performance)의 audience라는 맥락을 놓칠 수 있다고 생각하여 `perf.audience`로 전달하였습니다. 더 직관적인 변수 이름을 생각할 수 있다면, 업그레이드 할 수 있는 요소라고 생각합니다.
- `perf.playID`, 공연의 이름을 key로 찾은 해당 공연의 type을 전달합니다.

### Return

- 인자로 받은 단일 공연의 청구 금액.

## 2. `calcCreditsByPlayTypes()`

### Before

```javascript
// 포인트를 적립한다.
volumeCredits += Math.max(perf.audience - 30, 0);
// 희극 관객 5명마다 추가 포인트를 제공한다.
if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
```

### After

```javascript
/**
 *
 * @param {*} perf A performance from invoice.json's object, charged performance's id to customer.
 * @param {*} playType An object which has name and type as the value pairing with performance's's id.
 * @returns Credits of this preformance's play
 */

const calcCreditsByPlayTypes = (perf, play) => {
  const thisAudience = perf.audience;
  // 포인트를 적립한다.
  let thisCredit = Math.max(thisAudience - 30, 0);

  const playType = play.type;
  switch (playType) {
    case "comedy": // 희극 관객 5명마다 추가 포인트를 제공한다.
      thisCredit += Math.floor(thisAudience / 5);
      break;
    default:
      break;
  }

  return thisCredit;
};
```

> 극의 종류에 따라 적립할 포인트를 계산하는 함수

### Description

- 기능을 분리한 이유: billing과 함께 한 줄로 함께 처리하기 위해 분리하였습니다. 또한 현재는 희극 관객만을 대상으로 하지만, 타 장르에 대한 포인트 적립을 대비하여 swtich 문으로 작성하였습니다.

### Variable

- `thisAudience` 변수명 변경 : 상단의 `calcPerfByPlayTypes` 에서와 같이 당장 처리 중인 관객을 `perf.audience`로 받았으나, 코드 가독성을 높이기 위해 `thisAudience`로 명명한 변수에 담아 switch문에 사용하였습니다.

### Params

- `perf`, 순회하고 있는 공연 객체 전체
  - 위 함수와 같은 이유로, 상단의 `calcPerfByPlayTypes` 에서와 같이 당장 처리 중인 관객을 `perf.audience`로 받고, 일관적인 코드 작성을 위해 객체 자체를 함께 전달하였습니다.
- `playType`: `play.type`으로 타입을 받았으나 코드 가독성을 높이기 위해 `playType`라는 이름으로 인자를 받아 switch문에 사용하였습니다.

### Return

- 해당 공연에 타입에 맞는 추가 포인트를 계산하여 리턴하였습니다.

## 3. `formatBilling`

### Before

```javascript
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    //...
    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }
}
```

### After

```javascript
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
```

### Description

> 청구금액을`Intl.NumbeFormat`을 사용하여 USD 형식으로 포맷팅하는 함수.

- 기존 `format`이 `billing/100`과 깉이 100을 나누는 영역을 함수 내부에서 사용합니다.
- `statement` 함수 전반부에 `format` 형태로 존재하였으나 `statement`의 코드 가독성을 높이기 위해 분리하였습니다.

### Params

- 청구 금액을 인자로 받습니다. 기존의 `/100` 은 함수 내부에서 처리합니다.

## 4. `addTagByType()`

### Before

```javascript
//..
{
  // 청구 내역을 출력한다.
  result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`;
  totalAmount += thisAmount;
}

result += `총액: ${format(totalAmount / 100)}\n`;
result += `적립 포인트: ${volumeCredits}점\n`;
return result;
```

### After

```javascript
/**
 *
 * @param {*} content : string inside of tags
 * @param {*} inputTagType : specific html tag chosen by user
 * @returns
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
```

### Description

- `html`태그를 추가하는 함수입니다. 인자로 문자열인 내용과 어떤 태그를 쓸 것인지를 문자열로 받습니다. 입력시 함수 내부의 사용가능한 태그와 두번째 인자로 받은 태그 알파벳의 존재 여부를 확인한 후 javascript의 템플릿 리터럴을 활용하여 문자열 형태의 `html` 태그를 반환합니다.

### Variable

- `tagsArr` : 태그 검증용 배열입니다. 이곳에 존재하지 않을 시 `div`태그를 붙여 반환합니다.

### Params

- `content` & `inputTagType` : `html`태그 내부에 사용될 문자열. `toLowerCase()` 매서드로 일괄 소문자로 처리한 후, 사용 가능한 태그의 배열 내부에 입력 받은 문자열(태그)가 존재하는지`Array.includes()`로 검사합니다. 사용 가능한 태그가 아닌 다른 문자열을 입력 받았을 시, `div` 태그로 감싼 `html` 태그 코드를 반환합니다.

### Return

`javascript`의 템플릿 리터럴을 활용하여 `<${tag}>${content}</${tag}>` 형식으로 문자열 형태로 반환합니다.

## [Test Code](./test.spec.js)

### Description

- `statement` 를 쪼개어 내부에서 작동하는 함수들을 검증하는 테스트 코드입니다.
- `testFunction.js`에서 테스트에 쓰이는 부가 함수를 구현해 import하였습니다.
- `insertJson`에 callback으로 테스트할 함수들을 각 `test`내부에서 전달한 후 결과를 배열의 경우 `toEqual`을 사용해 비교하였습니다.

```javascript
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
```

# etc. | original `statement.js` code

```javascript
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

module.exports = statement;
```

## Before :: Original Result

```
$ node main.js

청구 내역 (고객명: BigCo)
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점

```

## After :: Current Result

```
$ node main.js
<h1>청구 내역 (고객명: BigCo)</h1>
<ul><li> Hamlet: $650.00 (55석)
</li><li> As You Like It: $580.00 (35석)
</li><li> Othello: $500.00 (40석)
</li></ul>
<p>총액: $1,730.00</p>
<p>적립 포인트: 47점</p>
```
