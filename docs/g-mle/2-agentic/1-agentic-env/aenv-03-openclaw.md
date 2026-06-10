---
sidebar_position: 3
---

# 3. OpenClaw 온보딩 (Ollama 연동)

Ollama 로컬 모델을 OpenClaw와 함께 쓰기 위한 온보딩 문서입니다.

## 1. 선행 점검

```bash
# 1-1. Ollama 런타임 상태 확인
ollama --version
ollama list
curl -s http://127.0.0.1:11434/api/tags

# 1-2. OpenClaw 런타임 준비 확인
openclaw --version
openclaw config validate

# 1-3. 게이트웨이 상태 확인
openclaw gateway status
openclaw health

# 1-4. 연결 실패 시 서버 재기동
ollama serve
openclaw gateway restart

# 1-5. Ollama provider 가시성 확인
OLLAMA_API_KEY=ollama-local \
  openclaw models list --all --local --provider ollama
```

참고: 위 블록은 OpenClaw와 Ollama 연동 전, 한 번에 돌려서 환경을 점검하는 기본 실행 흐름입니다.

## 2. OpenClaw 기본 상태 확인

```bash
openclaw --version
openclaw config validate
openclaw gateway status
openclaw health
```

확인:
- OpenClaw 버전 출력
- `gateway status`가 `running`이면 통신 경로 OK

## 3. Ollama provider 모델 발견

```bash
OLLAMA_API_KEY=ollama-local \
  openclaw models list --all --local --provider ollama
```

확인:
- 모델명이 `ollama/gemma4:12b-mlx` 형식으로 보임

모델이 안 보이면:
- `ollama list`에서 모델 존재 확인
- base URL이 `http://127.0.0.1:11434`인지 확인

## 4. Direct inference로 먼저 검증

```bash
OLLAMA_API_KEY=ollama-local \
  openclaw infer model run \
    --local \
    --model ollama/gemma4:12b-mlx \
    --prompt "Reply with exactly: pong" \
    --json
```

체크:
- `ok: true`
- `provider: "ollama"`
- 텍스트에 `pong` 포함

## 5. OpenClaw 기본 모델을 Ollama로 지정(선택)

```bash
openclaw config set models.providers.ollama.apiKey ollama-local
openclaw config set models.providers.ollama.baseUrl http://127.0.0.1:11434
openclaw models set ollama/gemma4:12b-mlx
openclaw config validate
openclaw gateway restart
```

체크:

```bash
openclaw models status
openclaw gateway status
openclaw health
```

주의:
- OpenClaw Ollama는 OpenAI 호환 경로(`/v1`)가 아니라 native 경로 기반으로 동작합니다.
- `baseUrl`은 `http://127.0.0.1:11434`로 유지합니다.

## 6. Codex(OpenAI provider)와 병행 사용

기본은 기존 `openai/gpt-5.5`를 유지하고, Ollama는 명시 호출로 필요 시만 사용.

```bash
openclaw models set openai/gpt-5.5
OLLAMA_API_KEY=ollama-local \
  openclaw infer model run \
    --local \
    --model ollama/gemma4:12b-mlx \
    --prompt "안녕하세요 한 줄로 답해줘."
```

돌아갈 때:

```bash
openclaw models set openai/gpt-5.5
openclaw gateway restart
```

## 7. 운영 체크리스트(권장 순서)

1. Ollama 모델 확인/다운로드
2. `openclaw models list --all --local --provider ollama`
3. direct inference로 `pong` 테스트
4. provider 설정 저장
5. `openclaw models status`, `openclaw gateway status`, `openclaw health` 체크
6. 기본 모델은 필요 시점에만 변경

## 8. 인증 관련 오류 대응

`No API key found for provider "ollama"`가 나올 때:

```bash
openclaw models auth list --provider ollama --json
openclaw config set models.providers.ollama.apiKey ollama-local
openclaw config set models.providers.ollama.baseUrl http://127.0.0.1:11434
openclaw onboard --auth-choice ollama --workspace /Users/studio/workspace
```

체크:

```bash
openclaw models auth list --provider ollama --json
```

`ollama:default`가 보이면 auth 매핑은 정상입니다.

## 9. 자주 쓰는 상태 점검 명령

```bash
openclaw models list --all --local --provider ollama
openclaw models status
openclaw gateway status
openclaw health
openclaw config validate
ollama ps
curl -s http://127.0.0.1:11434/api/tags
```

문제 지속 시:

```bash
openclaw gateway restart
openclaw doctor --repair
```

## 10. 정리

OpenClaw 기본 경로는 기존 provider를 유지하고, Ollama는 필요할 때 명시적으로 호출해 로컬 실험을 분리 운영하는 것이 가장 안정적인 온보딩 방식입니다.

```bash
openclaw infer model run \
  --local \
  --model ollama/gemma4:12b-mlx \
  --prompt "Reply with exactly: pong"
```

## 공식 문서

- Ollama provider: https://docs.openclaw.ai/providers/ollama
- Authentication: https://docs.openclaw.ai/gateway/authentication
- Models CLI: https://docs.openclaw.ai/cli/models
