---
sidebar_position: 1
---

# jest 정리  

- [jest 정리](#jest-정리)
  - [Install](#install)
  - [01.코드 전후에 필요한 코드를 작성할 수 있다](#01코드-전후에-필요한-코드를-작성할-수-있다)
  - [02.Matcher](#02matcher)
  - [03.Matcher](#03matcher)

## Install

```
yarn init -y  
yarn add jest -D  
npx jest 01.test.js

```

1.Mocking
2.Assertion 
- expect    
3.Matcher
- toBe  

4. **모킹**: Jest는 함수의 모킹을 지원합니다. `jest.fn()`을 사용하여 모킹 함수를 생성하고, `mockReturnValue` 또는 `mockImplementation`을 사용하여 모킹 함수의 동작을 정의할 수 있습니다:

```javascript
const mockFn = jest.fn();
mockFn.mockReturnValue('mock value');
```


6. **비동기 테스팅**: Jest는 비동기 코드의 테스팅을 지원합니다. `async/await` 또는 `done` 콜백을 사용하여 비동기 테스트를 작성할 수 있습니다:
```javascript
test('async test', async () => {
  const data = await fetchData();
  expect(data).toBe('expected data');
});
```
7. **설정**: Jest는 다양한 설정 옵션을 제공합니다. `jest.config.js` 파일을 생성하여 Jest의 동작을 커스터마이즈할 수 있습니다.

---

## 01.코드 전후에 필요한 코드를 작성할 수 있다

test case vs suite 
- test case : 각각의 테스트 모듈 - test 함수를 이용  
- test suite : test case를 관계별로 묶어놓은 것 - describe 함수를 이용  
- test procedure : test case와 test suite를 테스팅 시나리오에 맞게 동작하도록 만들어 놓은 스크립트


```md
규칙 - before/after-All은 Each를 감싼다.
규칙 - outterEach는 innerEach를 감싼다.
순서 - beforeAll(Outter) - beforeAll(Inner) - * -  afterAll(Inner) - afterAll(Outter)
  * = beforeEach(Outter) - beforeEach(Inner) - test -  afterEach(Inner) - afterEach(Outter)

beforeAll (Outter)
  beforeAll (Inner)
    beforeEach (Outter)
      beforeEach (Inner)
          test()
      afterEach (Inner)
    afterEach (Outter)
  afterAll (Inner)
afterAll (Outter)
```

```js
beforeAll(() => {
  console.log("outter beforeAll");
});
afterAll(() => {
  console.log("outter afterAll");
});

beforeEach(() => {
  console.log("outter beforeEach");
});
afterEach(() => {
  console.log("outter afterEach");
});

describe("inner test", () => {
  let counter = 0;

  beforeAll(() => {
    console.log("inner beforeAll");
    counter = 0;
  });
  afterAll(() => {
    console.log("inner afterAll");
    counter = -1;
  });

  beforeEach(() => {
    console.log("inner beforeEach");
    counter += 1;
  });

  afterEach(() => {
    console.log("inner afterEach");
    console.log("done #", counter);
  });

  test(`inner test #${counter}`, () => {
    expect(0).toBe(0);
    console.log("counter", counter);
  });

});
```


## 02.Matcher  

- tobe, not.tobe
- tobe
- toEqual
- toStrictEqual
- toBeNull
- toBeUndefined
- toBeDefined
- toBeTruthy
- toBeFalsy
- toBeGreaterThan
- toBeGreaterThanOrEqual
- toBeLessThan
- toBeLessThanOrEqual
- toBeCloseTo  


```js
//fn.js
const add = (a, b) => a + b;

const makeUser = (name, age) => ({
  name,
  age,
  gender: undefined,
});

module.exports = {
  add,
  makeUser,
};

```

```js

const fn = require("./fn");

// tobe, not.tobe
describe("matcher 01 - primitive type ", () => {
  test("1 tobe 1", () => {
    expect(1).toBe(1);
  });
  test("1+2 tobe 3", () => {
    expect(fn.add(1, 2)).toBe(3);
  });
  test("1+2 not tobe 5", () => {
    expect(fn.add(1, 2)).not.toBe(5);
  });
});

// tobe
// toEqual
// toStrictEqual
describe("matcher 02 - object", () => {
  let goalUser;
  beforeAll(() => {
    goalUser = { name: "dodo", age: 20 };
  });
  //✅ 객체를 비교할때는, 프로퍼티까지 같은지 봐야 하므로 , toEqual을 사용한다.
  // - 하지만 undefiend (초기선언상태)의 프로퍼티는 검사 제외
  test("object not tobe (diff addr)", () => {
    expect(fn.makeUser("dodo", 20)).not.toBe(goalUser);
  });

  // ✅ 분명 프로퍼티 중 key:undfined 가 있는데 테스트 통과 된다.
  // - 단,null은 검사를 한다. (의도적 빈 값)
  test("object toEqual (deep equality)", () => {
    expect(fn.makeUser("dodo", 20)).toEqual(goalUser);
  });

  // ✅ undefined 프로퍼티까지 일치하는지 확인할땐 toStrictEqual
  test("object toEqual (deep equality)", () => {
    expect(fn.makeUser("dodo", 20)).not.toStrictEqual(goalUser);
  });
});

// toBeNull
// toBeUndefined
// toBeDefined
describe("matcher 03 ", () => {
  test("null toBeNull", () => {
    expect(null).toBeNull();
  });
  test("undefined toBeUndefined", () => {
    expect(undefined).toBeUndefined();
  });
  test("defined toBeDefined", () => {
    //✅ null 은 객체이고, 값에 정의가 되어져 있는 상태
    expect(null).toBeDefined();
    expect(undefined).not.toBeDefined();
  });
});

// toBeTruthy
// toBeFalsy
describe("matcher 04 ", () => {
  test("toBeTruthy", () => {
    expect(true).toBeTruthy();
    expect([]).toBeTruthy();
    expect({}).toBeTruthy();
  });
  test("toBeTruthy", () => {
    expect(false).toBeFalsy();
    expect("").toBeFalsy();
    expect(!!false).toBeFalsy();
    expect(!!undefined).toBeFalsy();
    expect(!!null).toBeFalsy();
  });
});

// toBeGreaterThan
// toBeGreaterThanOrEqual
// toBeLessThan
// toBeLessThanOrEqual
// toBeCloseTo
describe("matcher 05", () => {
  test("10 > 3", () => {
    expect(10).toBeGreaterThan(3);
  });
  test("10 >= 3", () => {
    expect(10).toBeGreaterThanOrEqual(3);
  });
  test("3 < 10 ", () => {
    expect(3).toBeLessThan(10);
  });
  test("3 <= 10 ", () => {
    expect(3).toBeLessThanOrEqual(10);
  });
  test("3.1 + 7.0 ~~= 10.1", () => {
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });
});

```


## 03.Matcher  

- toMatch
- toContain
- toThrow
- 비동기 1 - 콜백
- 비동기 2 - Promise then,catch
- resolves,rejects
- 비동기 3 - async,await


```js
const fn = require("./fn");

// toMatch
describe("matcher 01 - RegExpress ", () => {
  test("startwith H", () => {
    expect("Hell world").toMatch(/^H/);
  });
  test("startwith H or h", () => {
    expect("Hell world").toMatch(/^h/i);
  });
});

// toContain
describe("matcher 02 - array", () => {
  test("[A,B,C] Contain A", () => {
    expect(["A", "B", "C"]).toContain("A");
  });
});

// toThrow
describe("matcher 03 - Error", () => {
  test("must throw Error", () => {
    expect(() => {
      throw new Error();
    }).toThrow();
  });

  test("must throw Error with Message", () => {
    expect(() => {
      throw new Error("Message");
    }).toThrow("Message");
  });
});

// 비동기 1 - 콜백
describe("matcher 04 - callback", () => {
  const getUser = (cb) => {
    setTimeout(() => {
      cb("dodo");
    }, 500);
  };

  test("callback eval", (done) => {
    const callback = (name) => {
      expect(name).toBe("dodo");
      done();
    };
    // ✅ 콜백함수를 쓴다면 done으로 테스트종료를 명시할 것
    getUser(callback);
  });
});

// 비동기 2 - Promise then,catch
// resolves
// rejects

//❌ https://ko.javascript.info/promise-error-handling
// -- Promise안의 setTimeout의 애러는 못잡는다,
// -- 애러는 executor(실행자, 실행 함수)가 실행되는 동안이 아니라 나중에 발생합니다.
// -- 따라서 프라미스는 에러를 처리할 수 없습니다.

describe("matcher 05 - Promise", () => {
  const getUser = async () =>
    new Promise((res, rej) => {
      setTimeout(() => {
        res("dodo");
      }, 500);
    });

  test("Promise return then", () => {
    // return expect(getUser()).toBe("dodo");
    // ✅ 반드시 (Promise).then.catch 를 리턴하도록 해야 검사된다.
    return getUser().then((name) => {
      expect(name).toBe("dodo");
    });
  });

  test("Promise resolves dodo", () => {
    expect(Promise.resolve("dodo")).resolves.toBe("dodo");
  });

  test("Promise rejects korea", () => {
    expect(Promise.reject("korea")).rejects.toBe("korea");
  });

  test("rejects to octopus", () => {
    return expect(Promise.reject(new Error("octopus"))).rejects.toThrow(
      "octopus"
    );
  });
});

// 비동기 3 - async,await
describe("matcher 06 - async,await", () => {
  const getUser = async () =>
    new Promise((res, rej) => {
      res("dodo");
    });
  test("async result is dodo", async () => {
    const res = await getUser();
    expect(res).toBe("dodo");
  });
});

```