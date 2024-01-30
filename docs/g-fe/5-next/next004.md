---
sidebar_position: 4
---

# NextJS + Zustand

- App의 전역상태관리가 가능  

## usage

```js
import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
---
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

```js
// define store, setter
import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useAuthModal;
---
  const authModal = useAuthModal();
  <Button  onClick={authModal.onOpen} />

```

## example

```
dialog만들기 
https://www.radix-ui.com/primitives/docs/components/dialog


```

## ref

github : https://github.com/pmndrs/zustand
React 상태 관리 라이브러리 Zustand의 코드를 파헤쳐보자 : https://ui.toast.com/weekly-pick/ko_20210812
zustand deep dive : https://www.nextree.io/zustand/

