---
sidebar_position: 2
---

# 2.Qdrant Quick Start  

- [2.Qdrant Quick Start](#2qdrant-quick-start)
  - [Index](#index)
  - [Quickstart](#quickstart)
  - [Load Data into a Collection from a Remote Snapshot](#load-data-into-a-collection-from-a-remote-snapshot)
  - [Basic Filtering - Clauses and Conditions](#basic-filtering---clauses-and-conditions)


## Index
Setup Guide
- Quickstart - Create a collection, upsert vectors, and run a search.
- Load Data - Load a prepared dataset snapshot into your collection.

Vector Search
- Filtering - Beginner - Filter search results using basic payload conditions.
- Filtering - Advanced - Try advanced filtering based on nested payload conditions.
- Filtering - Full Text - Search for substrings, tokens, or phrases within text fields.
- Multivector Search - Work with data represented by ColBERT multivectors.
- Sparse Vector Search - Use sparse vectors to get specific search results.
- Hybrid Search - Combine dense and sparse vectors for more accurate search results.

Manage Data
- Multitenancy - Manage multiple users within a single collection.  

---

## Quickstart

```js
// 백터 크기가 4인 콜렉션을 만들고 유사도 검색은 Dot Product 사용  
PUT collections/star_charts
{
  "vectors": {
    "size": 4,    /
    "distance": "Dot"  
  }
}
---
// Point는 Vector + Payload의 자료형이다.  
// 위에서 닷 연산자는 백터에 대해서 

PUT collections/star_charts/points
{
  "points": [
    {
      "id": 1,
      "vector": [0.05, 0.61, 0.76, 0.74],
      "payload": {
        "colony": "Mars"
      }
    },
    {
      "id": 2,
      "vector": [0.19, 0.81, 0.75, 0.11],
      "payload": {
        "colony": "Jupiter"
      }
    },
    {
      "id": 3,
      "vector": [0.36, 0.55, 0.47, 0.94],
      "payload": {
        "colony": "Venus"
      }
    },
    {
      "id": 4,
      "vector": [0.18, 0.01, 0.85, 0.80],
      "payload": {
        "colony": "Moon"
      }
    },
    {
      "id": 5,
      "vector": [0.24, 0.18, 0.22, 0.44],
      "payload": {
        "colony": "Pluto"
      }
    }
  ]
}
---
// 유사한것 3개 찾아와 http://snapshots.qdrant.io/midlib.snapshot
POST collections/star_charts/points/search
{
  "vector": [0.2, 0.1, 0.9, 0.7],
  "limit": 3,
  "with_payload": true
}



``` 
참고로 검색 가능한 방법은 4가지 
- Dot product: Dot - https://en.wikipedia.org/wiki/Dot_product
- Cosine similarity: Cosine - https://en.wikipedia.org/wiki/Cosine_similarity
- Euclidean distance: Euclid - https://en.wikipedia.org/wiki/Euclidean_distance
- Manhattan distance: Manhattan*- https://en.wikipedia.org/wiki/Taxicab_geometry *Available as of v1.7

1. Dot Product (내적):
 - 사용 상황: 두 벡터 간의 방향성이나 상관성을 확인할 때 유용합니다. 주로 벡터 간의 일치도나 상관 관계를 계산할 때 사용됩니다.
 - 예시:
   - 추천 시스템: 사용자의 선호도와 아이템의 특성을 비교할 때. 아이템의 특성 벡터와 사용자의 선호도 벡터 간 내적을 구하여 유사도를 계산하고 추천하는 경우.
   - 정보 검색: 쿼리와 문서의 내적을 통해 관련성을 계산하여 관련 있는 문서를 찾을 때.
   - 자연어 처리: 텍스트 임베딩에서 단어 간 유사도나 문서 간 유사도를 구할 때 사용될 수 있습니다.

2. Cosine Similarity (코사인 유사도):
 - 사용 상황: 벡터 간의 방향성만 중요하고 크기는 무시할 때 유용합니다.  
 - 특징: 벡터 간의 각도를 기준으로 유사도를 계산하며, 값은 -1 (반대 방향) 에서 1 (같은 방향) 사이의 범위를 가집니다. 0은 완전히 직각, 즉 유사하지 않음을 의미합니다.
 - 예시:
   - 추천 시스템: 사용자나 아이템의 속성이나 선호도 벡터 간의 유사도를 계산하여 추천할 때.
   - 문서 검색: 쿼리와 문서 벡터의 유사도를 계산하여 관련 문서를 찾을 때. 문서의 길이나 단어 수가 많으면 크기가 커지므로(내적값 커진다.) 코사인 유사도 사용.  
   - 자연어 처리: 단어 임베딩이나 문서 임베딩에서 크기의 차이를 무시하고 의미의 유사성만을 비교할 때.

3. Euclidean Distance (유클리드 거리):
 - 사용 상황: 두 벡터 간의 직선 거리를 측정하고자 할 때 사용됩니다. 벡터 간의 물리적인 거리나 직선 경로가 중요한 경우에 적합합니다.
 - 특징: 벡터의 크기와 방향을 모두 고려하며, 실제 거리 계산에 사용됩니다. 값이 작을수록 두 벡터가 유사하고, 값이 클수록 차이가 크다는 것을 의미합니다.
 - 예시:
   - 이미지 검색: 이미지 벡터 간의 직선 거리를 계산하여 유사한 이미지를 찾을 때.
   - 추천 시스템: 사용자와 아이템 간의 유사도를 계산할 때, 아이템 간의 실제 거리가 중요한 경우에 유용합니다.
   - 클러스터링: 벡터들을 군집화할 때, 각 벡터 간의 거리를 계산하여 군집을 형성할 때 사용됩니다.

4. Manhattan Distance (맨해튼 거리):
 - 사용 상황: 격자형 경로를 따르는 경우에 유용하며, 각 차원별로 독립적인 변화가 중요한 경우에 사용됩니다. 벡터 간의 차원별 이동을 고려하는 상황에서 사용됩니다.
 - 특징: 각 차원별 절대적인 차이를 합산하여 거리 계산을 합니다. 직선이 아닌 격자형 경로를 따를 때 유용합니다.
 - 예시:
   - 텍스트 분석: 단어 벡터에서 각 차원이 독립적일 때, 각 차원 간의 차이를 격자 형태로 측정하여 유사도를 계산할 때.
   - 추천 시스템: 사용자의 특성이나 이산적 요소를 비교할 때, 예를 들어 장르나 카테고리와 같은 항목을 비교할 때 맨해튼 거리가 유리할 수 있습니다.
   - GPS 위치 기반 서비스: 위치 정보를 계산할 때, 격자형 경로로 이동하는 경우에 유용합니다. 예를 들어, 도로 시스템에서 좌표 간 이동이 맨해튼 거리와 비슷한 방식으로 이뤄질 때.

## Load Data into a Collection from a Remote Snapshot


```
// 스냅샷을 이용해서 콜렉션을 백업 할 수 있다.  
PUT /collections/midjourney/snapshots/recover
{
  "location": "http://snapshots.qdrant.io/midlib.snapshot"
}
// 잘들어왔는지 확인하자.  
POST /collections/midjourney/points/count
{
  "result": {
    "count": 5417
  },
  "status": "ok",
  "time": 0.000776667
}
```

## Basic Filtering - Clauses and Conditions

```js
// 콜렉션 만들기 ( 백터 크기 4, 거리계산은 내적 )  
PUT collections/terraforming
{
  "vectors": {
    "size": 4,
    "distance": "Dot"
  }
}
---
// 시드 데이터 넣기  
PUT collections/terraforming/points
{
  "points": [
    {
      "id": 1,
      "vector": [0.1, 0.2, 0.3, 0.4],
      "payload": {"land": "forest", "color": "green", "life": true, "humidity": 40}
    },
    {
      "id": 2,
      "vector": [0.2, 0.3, 0.4, 0.5],
      "payload": {"land": "lake", "color": "blue", "life": true, "humidity": 100}
    },
    {
      "id": 3,
      "vector": [0.3, 0.4, 0.5, 0.6],
      "payload": {"land": "steppe", "color": "green", "life": false, "humidity": 25}
    },
    {
      "id": 4,
      "vector": [0.4, 0.5, 0.6, 0.7],
      "payload": {"land": "desert", "color": "red", "life": false, "humidity": 5}
    },
    {
      "id": 5,
      "vector": [0.5, 0.6, 0.7, 0.8],
      "payload": {"land": "marsh", "color": "black", "life": true, "humidity": 90}
    },
    {
      "id": 6,
      "vector": [0.6, 0.7, 0.8, 0.9],
      "payload": {"land": "cavern", "color": "black", "life": false, "humidity": 15}
    }
  ]
}
--- 
// 필터링 예제  
// - payload 매칭 결과  
POST collections/terraforming/points/scroll
{
  "filter": {
    "must": [
      { "key": "color", "match": { "value": "black" } }
    ]
  },
  "limit": 3,
  "with_payload": true
}
---
// 필터링 예제  
// - 2개 and 조건 
POST collections/terraforming/points/scroll
{
  "filter": {
    "must": [
      { "key": "life", "match": { "value": true } },
      { "key": "color", "match": { "value": "green" } }
    ]
  },
  "limit": 3,
  "with_payload": true
}
---
// 필터링 예제  
// should : 적어도 1개 만족하는 포인트들 검색  
// - 2개 조건 만족한 포인트가 먼저 검색되지는 않는다.   
POST collections/terraforming/points/scroll
{
  "filter": {
    "should": [
      {
        "key": "life",
        "match": { "value": false }
      }, {
        "key": "color",
        "match": { "value": "black" }
      }
    ]
  }
}
---
// must 의 not 버전  
POST collections/terraforming/points/scroll
{
  "filter": {
    "must_not": [
      {
       "key": "life",
       "match": { "value": false }
      }
    ]
  },
  "limit": 3,
  "with_payload": true
}
---
// range filter 
POST collections/terraforming/points/scroll
{
  "filter": {
    "must": [
      {
       "key": "humidity",
       "range": {
         "gte": 40,
         "lte": 40
       }
      }
    ]
  },
  "limit": 3,
  "with_payload": true
}
--- 

```