---
sidebar_position: 2
---

# TS 2 Union

- [TS 2 Union](#ts-2-union)
  - [Union discrimination Object](#union-discrimination-object)



## Union discrimination Object  

```js

export type PickKeys<T> = keyof T;
export type PickValues<T> = T[PickKeys<T>];

// 1.
// union discrimination 선언.  
export const NewsTypeEnum = {
  Eco: 'Eco',
  Quick: 'Quick',
  Global: 'Global',
} as const;

// "Eco" | "Quick" | "Global"
export type NewsType = PickKeys<typeof NewsTypeEnum>;

// Point.1
type ContentRecord = {
  Eco: { ecotitle: string };
  Quick: { headline: string; };
  Global: { title: string, price: string; };
};

// 위 타입과 동일
type ContentByNewsType = {
  [K in NewsType]: ContentRecord[K];
};

// Point.2
// type ContentDebugRecord = {
//   Eco: any;
//   Global: any;
//   Quick: any;
// };

type ContentDebugByNewsType = {
  [K in NewsType]: any;
};


// --- 


// x
// export type NewsCardNoGeneric = {
//   id: number;
//   newsType: NewsType;
//   version?: string;
//   content: ContentByNewsType[NewsType]
//   debugContent?: ContentDebugByNewsType[NewsType];
//   logId?: string;
//   relatedCards?: NewsCard<NewsType>[];
// };

// o
export type NewsCardNoGeneric2 = ({
  id: number;
  version?: string;
  logId?: string;
  relatedCards?: NewsCardNoGeneric2[];
}) & (
    {
      newsType: "Eco";
      content: ContentByNewsType["Eco"]
      debugContent?: ContentDebugByNewsType["Eco"];
    } | {
      newsType: "Quick";
      content: ContentByNewsType["Quick"]
      debugContent?: ContentDebugByNewsType["Quick"];
    } | {
      newsType: "Global";
      content: ContentByNewsType["Global"]
      debugContent?: ContentDebugByNewsType["Global"];
    }
  )

const newsCard2: NewsCardNoGeneric2 = {
  id: 2,
  newsType: "Eco",
  content: { ecotitle: 'ㅅ1' }// autocomplete to Eco
}

const newsCard3: NewsCardNoGeneric2 = {
  id: 2,
  newsType: "Global",
  content: { price: "12", title: "t" } // autocomplete to Global
}

// Point.3
// 유니온은 Generic으로 줄여 쓰기 가능 
export type NewsCard<R extends NewsType> = {
  id: number;
  newsType: R;
  version?: string;
  content?: ContentByNewsType[R];
  debugContent?: ContentDebugByNewsType[R];
  logId?: string;
  relatedCards?: NewsCard<NewsType>[];
};

const newsCard: NewsCard<"Eco"> = {
  id: 1,
  newsType: "Eco",
  content: { ecotitle: 'ㅅ' }, // autocomplete to Eco
}

```