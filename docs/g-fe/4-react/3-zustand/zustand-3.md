---
sidebar_position: 3
---

# 3.Zustand Patterns


### vanlia debounce, debounced state  

```js
export function debounce<T>(func: (args: T) => void, delay: number) {
  let timer: number;

  return (args: T) => {
    if (timer) clearTimeout(timer);

    timer = window.setTimeout(() => {
      func(args);
    }, delay);
  };
}
---
import { debounce } from "@/utils/debounce";
import { create } from "zustand";

interface SearchAreaStore {
  keywordInput: string;
  setKeywordInput: (keywordInput: string) => void;
  debouncedKeyword: string;
  setDebouncedKeyword: (keywordInput: string) => void;
  reset: () => void;
}

const defaultState: Pick<SearchAreaStore, "keywordInput" | "debouncedKeyword"> =
  {
    keywordInput: "",
    debouncedKeyword: "",
  };

export const useStoreSearchArea = create<SearchAreaStore>((set, get) => ({
  keywordInput: "",
  setKeywordInput: (keywordInput: string) => {
    set({ keywordInput });
    get().setDebouncedKeyword(keywordInput);
  },
  debouncedKeyword: "",
  setDebouncedKeyword: debounce((keywordInput: string) => {
    set({ debouncedKeyword: keywordInput });
  }, 500),
  reset: () => {
    set({ ...defaultState });
  },
}));

```


### Fetch (create, AbortController, AxiosError, debouncedFetch)    

기존의 요청을 취소하고 새로운 요청을 보내는 로직.  
- abort를 호출했다면 AbortController를 다시 생성해야한다.  
- 그렇지 않으면, 기존요청 및 새로운 요청에 대해서 모두 취소 된다.  

```js
import { create } from "zustand";
import { debounce } from "lodash-es";
import axios, { AxiosError } from "axios";

// https://api.thecatapi.com/v1/images/search?limit=1
interface RandomCatState {
  id: string;
  url: string;
  width: number;
  height: number;
  loading: boolean;
  error: null | AxiosError;
  fetchData: (id?: string) => void;
  debouncedFetch: () => void;
}

export const useRandomCatStore = create<RandomCatState>((set, get) => {
  let controller = new AbortController();

  return {
    id: "0",
    url: "",
    width: 0,
    height: 0,
    loading: false,
    error: null,
    fetchData: async (id?: string) => {
      if (get().loading) controller.abort();

      controller = new AbortController();
      set({ loading: true });
      try {
        const result = await axios.get(
          "https://api.thecatapi.com/v1/images/search?limit=1",
          {
            signal: controller.signal,
          }
        );
        set({ ...result.data?.[0], loading: false });
      } catch (error) {
        assertAxiosError(error);
        if (error?.code === "ERR_CANCELED") {
          return;
        }
        set({ loading: false, error });
      }
    },
    debouncedFetch: debounce(() => get().fetchData(), 200), // debouncing
  };
});

```