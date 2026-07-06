---
sidebar_position: 5
---

# 5.8 위크맵과 위크셋

위크맵과 위크셋
>https://ko.javascript.info/weakmap-weakset


## 참조값 복사 (copy by reference)  

```js
// john은 A라는 obj를 가르킨다.( objA )
let john = { name: "John" };

// john이라는 변수를 array[0]에 복사된다.  
let array = [ john ]; // copy by reference
// john이라는 변수를 john이라는 키값으로 value는 reference로 복사한다.  
let obj = { john }; // copy by reference

john = null; // 참조를 null로 덮어씀

// john을 나타내는 객체는 배열의 요소이기 때문에 가비지 컬렉터의 대상이 되지 않습니다.
// array[0]을 이용하면 해당 객체를 얻는 것도 가능합니다.

alert(JSON.stringify(array[0])); // 있다.!

alert(JSON.stringify(obj)); // 있다.!


```

## 위크맵 WeakMap

맵과 위크맵의 차이  
1.위크맵의 키가 반드시 객체여야 한다는 점  
2.위크맵은 반복 작업과 keys(), values(), entries() 메서드를 지원하지 않는다는 점입니다. 따라서 위크맵에선 키나 값 전체를 얻는 게 불가능.  


```js
let john = { name: "John" };

let weakMap = new WeakMap();
weakMap.set(john, "...");

john = null; // 참조를 덮어씀
// john을 나타내는 객체는 이제 메모리에서 지워집니다!
weakMap.get(john); // Null 

```

## Usecase

1.유스 케이스: 추가 데이터   
- visitsCountMap을 수동으로 청소해줄 필요가 없다.  

```js
weakMap.set(john, "비밀문서");
// john이 사망하면, 비밀문서는 자동으로 파기됩니다.
---
// 📁 visitsCount.js
let visitsCountMap = new WeakMap(); // 위크맵에 사용자의 방문 횟수를 저장함

// 사용자가 방문하면 방문 횟수를 늘려줍니다.
function countUser(user) {
  let count = visitsCountMap.get(user) || 0;
  visitsCountMap.set(user, count + 1);
}
```

2.유스 케이스: 캐싱  

```js
// 📁 cache.js
let cache = new WeakMap();

// 연산을 수행하고 그 결과를 위크맵에 저장합니다.
function process(obj) {
  if (!cache.has(obj)) {
    let result = /* 연산 수행 */ obj;

    cache.set(obj, result);
  }

  return cache.get(obj);
}

// 📁 main.js
let obj = {/* ... 객체 ... */};

let result1 = process(obj);
let result2 = process(obj);

// 객체가 쓸모없어지면 아래와 같이 null로 덮어씁니다.
obj = null;

// 이 예시에선 맵을 사용한 예시처럼 cache.size를 사용할 수 없습니다.
// 하지만 obj가 가비지 컬렉션의 대상이 되므로, 캐싱된 데이터 역시 메모리에서 삭제될 겁니다.
// 삭제가 진행되면 cache엔 그 어떤 요소도 남아있지 않을겁니다.
```

## 위크셋(WeakSet)

WeakMap처럼 부가적인 데이터를 보관하는데, 훨씬 더 간단한 데이터를 저장할 때 좋다. (boolean정도의 있다 없다.)   

```js
let visitedSet = new WeakSet();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

visitedSet.add(john); // John이 사이트를 방문합니다.
visitedSet.add(pete); // 이어서 Pete가 사이트를 방문합니다.
visitedSet.add(john); // 이어서 John이 다시 사이트를 방문합니다.

// visitedSet엔 두 명의 사용자가 저장될 겁니다.

// John의 방문 여부를 확인해보겠습니다.
alert(visitedSet.has(john)); // true

// Mary의 방문 여부를 확인해보겠습니다.
alert(visitedSet.has(mary)); // false

john = null;

// visitedSet에서 john을 나타내는 객체가 자동으로 삭제됩니다.

```