---
sidebar_position: 3
---

# 3.Qdrant Quick Start - 2

- [3.Qdrant Quick Start - 2](#3qdrant-quick-start---2)
  - [Index](#index)
  - [Filtering - Advanced](#filtering---advanced)
  - [Filtering - Full Text](#filtering---full-text)
  - [Multivector Search](#multivector-search)
  - [Sparse Vector Search](#sparse-vector-search)
  - [Hybrid Search](#hybrid-search)


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

## Filtering - Advanced 

Try advanced filtering based on nested payload conditions.  

```json
PUT collections/dinosaurs
{
  "vectors": {
    "size": 4,
    "distance": "Dot"
  }
}
--- 
PUT collections/dinosaurs/points
{
  "points": [
    {
      "id": 1,
      "vector": [0.1, 0.2, 0.3, 0.4],
      "payload": {
        "dinosaur": "t-rex",
        "diet": [
          { "food": "leaves", "likes": false },
          { "food": "meat", "likes": true }
        ]
      }
    },
    {
      "id": 2,
      "vector": [0.2, 0.3, 0.4, 0.5],
      "payload": {
        "dinosaur": "diplodocus",
        "diet": [
          { "food": "leaves", "likes": true },
          { "food": "meat", "likes": false }
        ]
      }
    }
  ]
}

--- 
// 필터의 키값에는 배열안의 객체키값 가능 - diet[].food  
POST /collections/dinosaurs/points/scroll
{
  "filter": {
    "must": [
      {
        "key": "diet[].food",
        "match": {
          "value": "meat"
        }
      },
      {
        "key": "diet[].likes",
        "match": {
          "value": true
        }
      }
    ]
  }
}
---
// 아니면 nested object가능  
// - 참고) has_id 는 nested 필드 안에 불가능   
POST /collections/dinosaurs/points/scroll
{
  "filter": {
    "must": [
      {
        "nested": {
          "key": "diet",
          "filter": {
            "must": [
              {
                "key": "food",
                "match": {
                  "value": "meat"
                }
              },
              {
                "key": "likes",
                "match": {
                  "value": true
                }
              }
            ]
          }
        }
      }
    ]
  }
}

```

## Filtering - Full Text

Search for substrings, tokens, or phrases within text fields.  

```json
PUT /collections/star_charts
{
  "vectors": {
    "size": 4,
    "distance": "Dot"
  }
}
--- 
PUT collections/star_charts/points
{
  "points": [
    {
      "id": 1,
      "vector": [0.05, 0.61, 0.76, 0.74],
      "payload": {
        "colony": "Mars",
        "supports_life": true,
        "description": "The red planet, Mars, has a cold desert climate and may have once had conditions suitable for life."
      }
    },
    {
      "id": 2,
      "vector": [0.19, 0.81, 0.75, 0.11],
      "payload": {
        "colony": "Jupiter",
        "supports_life": false,
        "description": "Jupiter is the largest planet in the solar system, known for its Great Red Spot and hostile gas environment."
      }
    },
    {
      "id": 3,
      "vector": [0.36, 0.55, 0.47, 0.94],
      "payload": {
        "colony": "Venus",
        "supports_life": false,
        "description": "Venus, Earth’s twin in size, has an extremely thick atmosphere and surface temperatures hot enough to melt lead."
      }
    },
    {
      "id": 4,
      "vector": [0.18, 0.01, 0.85, 0.80],
      "payload": {
        "colony": "Moon",
        "supports_life": true,
        "description": "Earth’s Moon, long visited by astronauts, is a barren, airless world but could host colonies in its underground caves."
      }
    },
    {
      "id": 5,
      "vector": [0.24, 0.18, 0.22, 0.44],
      "payload": {
        "colony": "Pluto",
        "supports_life": false,
        "description": "Once considered the ninth planet, Pluto is a small icy world at the edge of the solar system."
      }
    }
  ]
}
---
// full text searching 지원 
POST /collections/star_charts/points/scroll
{
  "filter": {
    "must": [
      {
        "key": "description",
        "match": {
          "text": "host colonies"
        }
      }
    ]
  },
  "limit": 2,
  "with_payload": true
}
---
// description 텍스트 부분을 토큰화 하여 인덱싱 가능  
// - 5 and 20 characters will be indexed.  
// - 
PUT /collections/star_charts/index
{
    "field_name": "description",
    "field_schema": {
        "type": "text",
        "tokenizer": "word",
        "lowercase": true
    }
}
---
POST /collections/star_charts/points/scroll
{
  "filter": {
    "must": [
      {
        "key": "description",
        "match": {
          "text": "cave colonies"
        }
      }
    ]
  },
  "limit": 2,
  "with_payload": true
}


```

## Multivector Search 

- Work with data represented by ColBERT multivectors.  

```json
// 다중 백터 모드로 콜렉션을 넣을 수 있다.  
PUT collections/multivector_collection
{
  "vectors": {
    "size": 4,
    "distance": "Dot",
    "multivector_config": {
      "comparator": "max_sim"
    }
  }
}
---
// 백터의 크기는 4로 동일하다.  
PUT collections/multivector_collection/points
{
  "points": [
    {
      "id": 1,
      "vector": [
        [-0.013,  0.020, -0.007, -0.111],
        [-0.030, -0.015,  0.021,  0.072],
        [0.041,  -0.004, 0.032,  0.062]
      ],
      "payload": {
        "name": "Mars",
        "type": "terrestrial"
      }
    },
    {
      "id": 2,
      "vector": [
        [0.011,  -0.050,  0.007,  0.101],
        [0.031,  0.014,  -0.032,  0.012]
      ],
      "payload": {
        "name": "Jupiter",
        "type": "gas giant"
      }
    },
    {
      "id": 3,
      "vector": [
        [0.041,  0.034,  -0.012, -0.022],
        [0.040,  -0.095,  0.021,  0.032],
        [-0.030,  0.025,  0.011,  0.082],
        [0.021,  -0.044,  0.032, -0.032]
      ],
      "payload": {
        "name": "Venus",
        "type": "terrestrial"
      }
    },
    {
      "id": 4,
      "vector": [
        [-0.015,  0.020,  0.045,  -0.131],
        [0.041,   -0.024, -0.032,  0.072]
      ],
      "payload": {
        "name": "Neptune",
        "type": "ice giant"
      }
    }
  ]
}
---
// max_sim 스코어 값이 높은것을 가져온다. 
// - 다중 백터중 높은값을 기준으로 계산한다.  
POST collections/multivector_collection/points/query
{
  "query": [
    [-0.015,  0.020,  0.045,  -0.131],
    [0.030,   -0.005, 0.001,   0.022],
    [0.041,   -0.024, -0.032,  0.072]
  ],
  "with_payload": true
}
```

## Sparse Vector Search 

- Use sparse vectors to get specific search results.   

Sparse Vector Search 란?
- Sparse Vector Search는 대부분의 값이 0인 드문(Sparse) 형태의 벡터를 이용해 검색하는 방법  
- 일반적인 Dense Vector Search는 모든 차원에 값이 “꽉 차있는” 부동소수(double/float) 벡터를 사용  
- 반면, Sparse Vector는 대부분의 값이 0이고, 소수의 값만 중요한 형태.
  - 예를 들면: {"word1": 0.8, "word5": 0.6, "word300": 0.9} 같이 특정 위치만 값이 있어요.
- 장점 : TF-IDF 같은 전통적 검색 방법과 비슷한 효과
  - >	•	Dense Vector Search는 의미(semantic)를 잡아주고, Sparse Vector Search는 정확한 키워드  
  - 2가지 방식을 혼용한 Hybrid Search (Dense + Sparse) 도 많이 사용한다.

```json
 "keywords": {
    "indices": [10, 42], // 10차원, 42 차원에만 값이 있다. 나머지는 0이다.  
    "values": [0.3, 0.5]
}
// 메모리를 아끼고, 계산 속도를 빠르게
// 위 데이터 포인트의 경우 "indices": [10, 50] 을 검색하면 -> 10차원만 보면 된다.  
```  

```json  
// sparse vectors 로 컬렉션 정의  
PUT /collections/sparse_charts
{
    "sparse_vectors": {
        "keywords": {}
    }
}
--- 
// indices : 벡터 공간에서 0이 아닌 값의 위치입니다.   
// values : 해당 위치에 해당하는 값으로, 각 키워드 또는 기능의 중요도나 가중치를 나타냅니다.  
PUT /collections/sparse_charts/points
{
    "points": [
        {
            "id": 1,
            "vector": {
                "keywords": {
                    "indices": [1, 42],
                    "values": [0.22, 0.8]
                }
            }
        },
        {
            "id": 2,
            "vector": {
                "keywords": {
                    "indices": [2, 35],
                    "values": [0.15, 0.65]
                }
            }
        },
        {
            "id": 3,
            "vector": {
                "keywords": {
                    "indices": [10, 42],
                    "values": [0.3, 0.5]
                }
            }
        },
        {
            "id": 4,
            "vector": {
                "keywords": {
                    "indices": [0, 3],
                    "values": [0.4, 0.3]
                }
            }
        },
        {
            "id": 5,
            "vector": {
                "keywords": {
                    "indices": [2, 4],
                    "values": [0.9, 0.8]
                }
            }
        }
    ]
}
---
// 백터 검색, 원하는 차원만 indices 필드에 넣어서 검색할 수 있다.  
POST /collections/sparse_charts/points/query
{
    "query": {
        "indices": [1, 42],
        "values": [0.22, 0.8]
    },
    "using": "keywords"
}
---
// 
POST /collections/sparse_charts/points/query
{
    "query": {
        "indices": [0, 2, 4],
        "values": [0.4, 0.9, 0.8]
    },
    "using": "keywords"
}


```

## Hybrid Search

 - Combine dense and sparse vectors for more accurate search results.  

- 2가지 방식을 혼용한 Hybrid Search (Dense + Sparse) 예제이다.  

```json
// Dense 백터 정의 크기 4, 코사인 유사도 사용  
// Sparse 백터 정의  for keyword-based indexing.    
PUT /collections/terraforming_plans
{
    "vectors": {
        "size": 4,  
        "distance": "Cosine"  
    },
    "sparse_vectors": {
        "keywords": { }
    }
}
---
PUT /collections/terraforming_plans/points
{
    "points": [
        {
            "id": 1,  
            "vector": {
                "": [0.02, 0.4, 0.5, 0.9],   // Dense vector
                "keywords": {
                   "indices": [1, 42],    // Sparse for "rocky" and "Mars"
                   "values": [0.22, 0.8]  // Weights for these keywords
                }
            },
            "payload": {
                "description": "Plans about Mars colonization."
            }
        },
        {
            "id": 2,  
            "vector": {
                "": [0.3, 0.1, 0.6, 0.4],   
                "keywords": {
                   "indices": [2, 35],    // Sparse for "gas giant" and "icy"
                   "values": [0.15, 0.65]  // Weights for these keywords
                }
            },
            "payload": {
                "description": "Study on Jupiter gas composition."
            }
        },
        {
            "id": 3,  
            "vector": {
                "": [0.7, 0.5, 0.3, 0.8],   
                "keywords": {
                   "indices": [10, 42],    // Sparse for "Venus" and "rocky"
                   "values": [0.3, 0.5]    // Weights for these keywords
                }
            },
            "payload": {
                "description": "Venus geological terrain analysis."
            }
        }
    ]
}

---
// keyword-based (sparse) and semantic (dense) search 
// Reciprocal Rank Fusion (RRF) 방식으로 점수를 취합한다.  
// - 단순히 두 백터 점수를 합산하는것이 아니다.  
//    - Keyword-based query: sparse vector semantic similarity search 
//    - Dense vector query: Uses the dense vector for semantic similarity search.
//    -> 둘 중 하나라도 상위권이면 점수 높게 (RFF)  
// - 물론 아레 컨셉처럼 다양한 변형이 가능하다.  


POST /collections/terraforming_plans/points/query
{
    "prefetch": [
        {
            "query": { 
                "indices": [1, 42],   
                "values": [0.22, 0.8]  
            },
            "using": "keywords",
            "limit": 20
        },
        {
            "query": [0.01, 0.45, 0.67, 0.89],
            "using": "",
            "limit": 20
        }
    ],
    "query": { "fusion": "rrf" },  // Reciprocal rank fusion
    "limit": 10,
    "with_payload": true
}

// 컨셉  
// Multi-stage queries : 2단계로 나누어서 쿼리한다. 빠르게 후보자를 찾고, 그 다음 스코어링을 진행  
// Score boosting : 특정 문자가 있는경우 더 높은 점수를 준다.  

---
POST /collections/terraforming_plans/points/query
{
    "prefetch":  {
            "query": { 
                "indices": [1, 42],   
                "values": [0.22, 0.8]  
            },
            "using": "keywords",
            "limit": 20
        },
    "query": [0.01, 0.45, 0.67, 0.89]
    "limit": 10,
    "with_payload": true
}
```