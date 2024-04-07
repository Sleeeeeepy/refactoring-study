# 장르가 추가될 때를 고려한 설계

[Review](https://github.com/Sleeeeeepy/refactoring-study/pull/1#discussion_r1554545034)

## Before

```javascript
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
```

## Description

현재 코드는 새 장르가 추가된다면 두 함수 모두 내부에 추가하는 로직을 적어야 합니다. 이 점을 보완하기 위해 타입별로 분기처리하는 `if`나 `switch` 가 작성되어있는 통합 함수를 작성하는 방법도 고려해보았으나 그 경우 billing을 계산하는 로직과 credit을 계산하는 로직이 하나의 함수에 모여 현재 코드보다 응집도가 낮아진다고 생각했습니다. 따라서 현재 각각의 목적에 충길한, 높은 응집도와 낮은 결합도를 보인(다고 생각하는) 개별 함수 로직을 유지하면서 수정 시 한 곳만 수정해야 한다는 요구사항을 만족하기 위하여 세팅 정보를 `json` 파일에 담아 저장하여 관리하는 방향을 생각하였습니다. 본래 `subFunctions.js` 파일 내부에 객체로 저장해두었다가, 다른 `invoices`나 `plays` 들이 `json`으로 관리되기에 해당 파일도 `json`으로 관리하는 것이 어울릴 것이라 판단하였습니다.

```json
{
  "tragedy": {
    "chargeAmount": 40000,
    "chargeDefault": 0,
    "chargeLimitAud": 30,
    "chargePerAud": 0,
    "chargePerOverAud": 1000,
    "creditBonusPerAud": 0
  },
  "comedy": {
    "chargeAmount": 30000,
    "chargeDefault": 10000,
    "chargeLimitAud": 20,
    "chargePerAud": 300,
    "chargePerOverAud": 500,
    "creditBonusPerAud": 5
  }
}
```

이로써 새 장르가 추가되어도 해당 데이터를 한 곳(`playType.json`)에서 관리 가능하며, type별 청구요금과 추가 포인트 로직 또한 각각 함수에서 공통적으로 핸들링할 수 있습니다.

# `test.each()` 반영

[Review](https://github.com/Sleeeeeepy/refactoring-study/pull/1#discussion_r1554547073)

## Before

```javascript
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
```

## Description

배열을 따로 만들어 관리하는 대신 조언 받은 `test.each`를 활용하여 수정하였습니다. 맨 아래의 tag 관련 테스트 외에는 json파일을 사용하므로 사용하던 헬퍼 함수를 수정하거나 제거하지 않았습니다.

```javascript
test.each([
  [content, "p", "<p>test</p>"],
  [content, "h1", "<h1>test</h1>"],
  [content, "ol", "<ol>test</ol>"],
  [content, "nope", "<div>test</div>"],
])("4. addTagByType checker", (ctn, tag, expected) => {
  expect(addTagByType(ctn, tag)).toBe(expected);
});
```

# 테스트 정렬

[Review](https://github.com/Sleeeeeepy/refactoring-study/pull/1#discussion_r1554548364)

## Before

```javascript
describe("함수 단위 테스트", () => {
  test("1. calcPerfByPlayTypes", () => {
    //expect(insertJson()).toBe([65000, 58000, 50000]);
    expect(insertJson(calcPerfByPlayTypes, testData)).toEqual([    65000, 58000, 50000,
    ]);
  });
}

```

현재 테스트 코드의 헬퍼 함수, `insertJson()` 내부에서 for문을 반복하며 테스트할 객체를 만드는 `Arrange` 단계를 거치고, callback으로 전달받은 테스트 대상 함수를 실행시킵니다. 현재 두 개의 테스트에서 해당 함수를 사용중이므로 첫번째 테스트 코드에서만 가독성을 높이는 방향으로 코드를 수정하였습니다. (arr, act, assert 주석 추가)
