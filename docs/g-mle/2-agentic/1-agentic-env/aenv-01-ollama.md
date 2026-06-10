---
sidebar_position: 1
---

# 1. Ollama 온보딩 가이드

이 문서는 **명령 실행 → 확인** 순서로 Ollama를 바로 사용할 수 있도록 정리했습니다.

## 목차

- [1. Ollama 온보딩 가이드](#1-ollama-온보딩-가이드)
  - [목차](#목차)
  - [1. 설치 및 실행](#1-설치-및-실행)
  - [2. 모델 설치/검증/실행](#2-모델-설치검증실행)
  - [3. API 호출 체크](#3-api-호출-체크)
    - [Generate](#generate)
    - [Chat](#chat)
    - [Embeddings](#embeddings)
  - [4. OpenAI 호환 엔드포인트](#4-openai-호환-엔드포인트)
    - [Chat Completions](#chat-completions)
    - [Text Completions](#text-completions)
    - [Embeddings](#embeddings-1)
    - [List Models](#list-models)
  - [5. 런타임 옵션](#5-런타임-옵션)
  - [6. 속도 측정](#6-속도-측정)
    - [속도 밴치마킹 해보기](#속도-밴치마킹-해보기)
  - [API 요약표](#api-요약표)
    - [Native API](#native-api)
    - [OpenAI 호환 API](#openai-호환-api)
  - [공식 문서](#공식-문서)

Ollama는 로컬에서 LLM을 다운로드하고 실행할 수 있는 런타임입니다.
- 로컬 모델을 빠르게 테스트할 수 있습니다.
- `http://127.0.0.1:11434` 기반으로 Claude Code 같은 도구에서 연결할 수 있습니다.

## 1. 설치 및 실행

```bash
# [설치]
# 1-1. 설치 (Homebrew 기준)
brew install ollama

# 1-2. 앱 직접 설치 시 참고
# https://ollama.com/download

# 1-3. 설치 확인
ollama --version

# 출력이 나오면 설치 완료

# 1-4. 설치 실패 시 점검 포인트
# - PATH 미등록: which ollama
# - 권한 문제: sudo 없이 brew 설정 확인
# - 네트워크 정책: brew update && brew reinstall ollama

# [실행]
# brew services 등록으로 실행 
brew services
brew services start ollama
brew services stop ollama
brew services restart ollama

# 1회성 실행
ollama serve
# 실행확인
curl -s http://127.0.0.1:11434
```

## 2. 모델 설치/검증/실행

```bash
# 모델 목록 
ollama list
# 현재 실행 중인 Ollama 모델 프로세스 상태    
ollama ps

# 모델 다운로드/삭제
ollama pull <모델명>
ollama rm <모델명>
ollama pull gemma4:12b-mlx
ollama pull gemma4:e2b-mlx
ollama pull nomic-embed-text-v2-moe

ollama show gemma4:12b-mlx
# tui chat
ollama run gemma4:12b-mlx
# 단건 질의 실행
ollama run gemma4:12b-mlx "한국어로 한 문장 자기소개해줘."
ollama run gemma4:e2b-mlx "한국어로 한 문장 자기소개해줘."

# API 실행
curl -s http://127.0.0.1:11434/api/generate -d '{
  "model": "gemma4:12b-mlx",
  "prompt": "한국어로 한 문장 자기소개해줘.",
  "stream": false
}'

curl -s http://127.0.0.1:11434/api/generate -d '{
  "model": "gemma4:e2b-mlx",
  "prompt": "한국어로 한 문장 자기소개해줘.",
  "stream": false
}'

```

## 3. API 호출 체크

### Generate

```bash
curl -s http://127.0.0.1:11434/api/generate -d '{
  "model": "gemma4:12b-mlx",
  "prompt": "한국어로 자기소개해줘.",
  "stream": false
}'
```

### Chat

```bash
curl -s http://127.0.0.1:11434/api/chat -d '{
  "model": "gemma4:12b-mlx",
  "messages": [
    {"role": "system", "content": "답변은 짧고 정확하게 해."},
    {"role": "user", "content": "Ollama가 뭐야?"}
  ],
  "stream": false
}'
```

### Embeddings

```bash
curl -s http://127.0.0.1:11434/api/embed -d '{
  "model": "nomic-embed-text-v2-moe",
  "input": "Hello world"
}'
```

다건 입력 테스트:

```bash
curl -s http://127.0.0.1:11434/api/embed -d '{
  "model": "nomic-embed-text-v2-moe",
  "input": ["첫 번째 문장", "두 번째 문장"]
}'
```

## 4. OpenAI 호환 엔드포인트


OpenAI 호환 엔드포인트 ? : URL/필드 규격을 OpenAI API와 동일하게 받아들이는 서버 인터페이스
- OpenAI SDK가 그대로 동작할 수 있게 되게된다.  
- Ollama의 Native API(/api/*)와 별개 경로  

```text
http://127.0.0.1:11434/v1
```

### Chat Completions

```bash
curl -s http://127.0.0.1:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma4:12b-mlx",
    "messages": [
      {"role": "user", "content": "한국어로 자기소개해줘."}
    ],
    "stream": false
  }'
```

Python(OpenAI SDK) 실행 예:

```python
from openai import OpenAI
client = OpenAI(
    base_url="http://127.0.0.1:11434/v1",
    api_key="ollama",
)
response = client.chat.completions.create(
    model="gemma4:12b-mlx",
    messages=[{"role": "user", "content": "한국어로 자기소개해줘."}],
)

print(response.choices[0].message.content)
```

### Text Completions

```bash
curl -s http://127.0.0.1:11434/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma4:12b-mlx",
    "prompt": "한국어로 자기소개해줘.",
    "stream": false
  }'
```

### Embeddings

```bash
curl -s http://127.0.0.1:11434/v1/embeddings \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nomic-embed-text-v2-moe",
    "input": "Hello world"
  }'
```

### List Models

```bash
curl -s http://127.0.0.1:11434/v1/models
```

## 5. 런타임 옵션

실행 예시(Generate와 함께 보내서 확인):

```bash
curl -s http://127.0.0.1:11434/api/generate -d '{
  "model": "gemma4:e2b-mlx",
  "prompt": "짧게 요약해줘: 오늘 할 일 정리",
  "stream": false,
  "options": {
    "temperature": 0.1,
    "top_k": 40,
    "top_p": 0.9,
    "num_predict": 300
  }
}'
```

주요 옵션 체크:
- `temperature`: 낮을수록 결정적
- `top_p`: 확률 질량 컷오프
- `top_k`: 후보 토큰 수 제한
- `num_ctx`: 컨텍스트 길이
- `num_predict`: 최대 출력 토큰
- `seed`: 재현성
- `keep_alive`: 모델 상주 시간

## 6. 속도 측정  
- 총 토큰 수 : eval_count: 4222
- 시간 : eval_duration: 141872191666 ns
- 초당 토큰 수 : speed: 4222 / 141.87 = 29.8 tokens/sec


```bash
curl -s http://127.0.0.1:11434/api/generate -d '{
  "model": "gemma4:12b-mlx",
  "prompt": "한국어로 300자 정도로 로컬 LLM의 장단점을 설명해줘.",
  "stream": false
}'

eval_count: 4222
eval_duration: 141872191666 ns
speed: 4222 / 141.87 = 29.8 tokens/sec
```

참고 응답 필드:

```text
total_duration
load_duration
prompt_eval_count
prompt_eval_duration
eval_count
eval_duration
```

### 속도 밴치마킹 해보기  

직접 측정한 로컬 모델 순차 결과 (항상 동일한 프롬프트, `num_predict` 제한 적용):

- 프롬프트: `1문장 자기소개해줘.`
- 예시 옵션: `num_predict: 128`
- 계산식: `tokens/sec = eval_count / (eval_duration / 1_000_000_000)`

```text
MODEL                                      EVAL_COUNT        EVAL_MS   TOKENS_SEC       STATUS
----                                       ----------     ----------   ----------       ------
nomic-embed-text-v2-moe:latest                      -              -            -         FAIL
gemma4:e2b-mlx                                    128        1800.23        71.10           OK
gemma4:12b-mlx                                    128        4036.09        31.71           OK
```

결론:

- 지금 환경에서는 `gemma4:e2b-mlx`가 상대적으로 빠름
- `nomic-embed-text-v2-moe`는 `/api/generate` 성능 지표를 바로 뽑기 어렵고, 임베딩 모델 특성상 생성 지표(`eval_count`, `eval_duration`)로 비교하지 않는 게 맞음




## API 요약표

### Native API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/generate` | 텍스트 생성 |
| `POST` | `/api/chat` | 메시지 기반 응답 |
| `POST` | `/api/create` | Modelfile 기반 모델 생성 |
| `GET` | `/api/tags` | 로컬 모델 목록 |
| `POST` | `/api/show` | 모델 메타정보 조회 |
| `POST` | `/api/copy` | 모델 이름 복사 |
| `DELETE` | `/api/delete` | 모델 삭제 |
| `POST` | `/api/pull` | 모델 다운로드 |
| `POST` | `/api/push` | 모델 업로드 |
| `POST` | `/api/embed` | Embedding 생성 |
| `POST` | `/api/embeddings` | 레거시 Embedding |
| `GET` | `/api/ps` | 실행 중인 모델 조회 |
| `GET` | `/api/version` | 서버 버전 조회 |
| `HEAD` | `/api/blobs/:digest` | blob 존재 여부 |
| `POST` | `/api/blobs/:digest` | blob 업로드 |

### OpenAI 호환 API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/v1/chat/completions` | chat completions |
| `POST` | `/v1/completions` | text completions |
| `POST` | `/v1/embeddings` | embeddings |
| `GET` | `/v1/models` | 모델 목록 |

## 공식 문서

- Installation: https://ollama.com/download
- macOS: https://docs.ollama.com/macos
- Linux: https://docs.ollama.com/linux
- Windows: https://docs.ollama.com/windows
- Native API: https://docs.ollama.com/api
- OpenAI compatibility: https://docs.ollama.com/openai
