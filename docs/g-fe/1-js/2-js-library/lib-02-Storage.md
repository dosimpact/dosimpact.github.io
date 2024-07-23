---
sidebar_position: 2
---

# Browser Storage 

- [Browser Storage](#browser-storage)
  - [useSessionStorage](#usesessionstorage)
  - [useInMemoryStorage](#useinmemorystorage)


## useSessionStorage

```js
import React, { useState } from 'react';

const useSessionStorage = ({ key = 'org:common' }) => {
  const [data, _setData] = useState(window.sessionStorage?.getItem(key) ?? null);

  const setData = value => {
    window.sessionStorage.setItem(key, value);
    _setData(value);
  };

  return [data, setData];
};

export default useSessionStorage;

```

## useInMemoryStorage


```js
import React, { useState } from 'react';

(() => {
  if (window?.memoryStorage) {
  } else {
    window.memoryStorage = {
      storage: {},
      getItem(key) {
        return this.storage[key];
      },
      setItem(key, value) {
        this.storage[key] = value;
        return value;
      }
    };
  }
})();

const useInMemoryStorage = ({ key = 'org:common' }) => {
  const [data, _setData] = useState(window?.memoryStorage?.getItem(key) ?? null);

  const setData = value => {
    window?.memoryStorage?.setItem(key, value);
    _setData(value);
  };

  return [data, setData];
};

export default useInMemoryStorage;

```