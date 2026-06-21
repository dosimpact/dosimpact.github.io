---
sidebar_position: 3
title: Artillery 운영과 관측
---

## 12. 결과 리포트 저장

```bash
# JSON 리포트 저장
mkdir -p reports
npx artillery run tests/performance/api.yml --output reports/api-report.json

# HTML 리포트 생성
npx artillery report reports/api-report.json --output reports/api-report.html

# JSON 리포트 및 HTML 리포트 생성
"TARGET_URL=${TARGET_URL:-http://localhost:2929} artillery run tests/performance/load.yml --output reports/load.json && artillery report reports/load.json --output reports/load.html",
```

CI에서는 JSON과 HTML을 artifact로 저장한다.

## 13. Docker 실행

### Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tests ./tests

ENV TARGET_URL=http://host.docker.internal:3000

CMD ["npx", "artillery", "run", "tests/performance/api.yml", "--output", "reports/api-report.json"]
```

### docker-compose.yml

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: test

  artillery:
    image: node:22-alpine
    working_dir: /app
    depends_on:
      - api
    volumes:
      - .:/app
    environment:
      TARGET_URL: http://api:3000
    command: sh -c "npm ci && npx artillery run tests/performance/api.yml --output reports/api-report.json"
```

실행:

```bash
docker compose run --rm artillery
npx artillery report reports/api-report.json --output reports/api-report.html
```

## 14. Prometheus, Grafana, Loki와 함께 보기

Artillery는 클라이언트 관점의 결과를 제공한다. Prometheus, Grafana, Loki는 서버 관점의 상태를 보여준다. 둘을 같은 시간축에서 비교해야 병목을 찾을 수 있다.

### Node.js 서버에서 남길 권장 메트릭

Prometheus:

- `http_requests_total{method,route,status}`
- `http_request_duration_seconds_bucket{method,route,status}`
- `process_cpu_user_seconds_total`
- `process_resident_memory_bytes`
- `nodejs_eventloop_lag_seconds`
- `nodejs_gc_duration_seconds`
- active connection 수

Loki:

- request id
- route
- status code
- latency ms
- user id 또는 test user marker
- error stack
- upstream timeout 여부

Artillery 요청에 `x-request-id`와 `x-load-test-run-id`를 넣으면 로그와 테스트 결과를 연결하기 쉽다.

```yaml
config:
  defaults:
    headers:
      x-load-test-run-id: "{{ $processEnvironment.LOAD_TEST_RUN_ID }}"
```

실행:

```bash
LOAD_TEST_RUN_ID=$(date +%Y%m%d%H%M%S) TARGET_URL=https://staging.example.com \
  npx artillery run tests/performance/api.yml --output reports/api-report.json
```

예제 프로젝트 Docker Compose 구성:

| 서비스 | 포트 | 역할 |
| --- | --- | --- |
| `target-server` | `2929 -> 3000` | Artillery가 부하를 주는 Node.js 테스트 대상 서버 |
| `prometheus` | `2930 -> 9090` | `target-server:/metrics`를 수집하는 메트릭 저장소 |
| `grafana` | `2931 -> 3000` | Prometheus 메트릭과 Loki 로그를 보는 대시보드 |
| `loki` | `2932 -> 3100` | 컨테이너 로그 저장소 |
| `promtail` | `2933 -> 9080` | Docker 로그를 읽어서 Loki로 전달 |
| `artillery-load` | 없음 | `load.yml`을 실행하고 JSON/HTML 리포트를 생성하는 일회성 컨테이너 |
| `artillery-stress` | 없음 | `stress.yml`을 실행하고 JSON/HTML 리포트를 생성하는 일회성 컨테이너 |

```bash
docker-compose up -d --build target-server prometheus grafana loki promtail
docker-compose run --rm artillery-load
docker-compose run --rm artillery-stress
```

### Grafana에서 같이 볼 패널

- RPS: Artillery observed RPS vs server `rate(http_requests_total[1m])`
- Latency: Artillery p95/p99 vs server histogram p95/p99
- Error: Artillery error rate vs server 5xx/4xx
- Runtime: CPU, memory, event loop lag, GC duration
- Logs: `x-load-test-run-id` 기준 Loki 검색

### 해석 기준

- Artillery latency만 높고 서버 latency는 낮으면 네트워크, DNS, TLS, load generator 자원 부족을 의심한다.
- 서버 latency도 함께 높으면 애플리케이션 또는 의존성 병목이다.
- 서버 CPU가 낮은데 RPS가 더 오르지 않으면 connection limit, reverse proxy, rate limit, 외부 의존성을 확인한다.
- event loop lag가 증가하면 CPU-bound 작업, JSON 직렬화, 동기 I/O를 의심한다.

## 15. 최소 도입 체크리스트

- `tests/performance/api.yml` 생성
- 작은 부하로 로컬 실행 성공
- staging 대상 smoke load test 성공
- JWT 또는 인증 흐름 반영
- p95, p99, error rate 기준 정의
- JSON/HTML 리포트 생성
- CI artifact 저장
- Prometheus/Grafana/Loki에서 같은 시간대 서버 지표 확인
- 운영 대상 테스트 안전장치 문서화


## 참고 문서

- Artillery Test Script Reference: https://www.artillery.io/docs/reference/test-script
- Artillery HTTP Engine: https://www.artillery.io/docs/reference/engines/http
- Artillery WebSocket Engine: https://www.artillery.io/docs/reference/engines/websocket
- Artillery Socket.IO Engine: https://www.artillery.io/docs/reference/engines/socketio
- Artillery GitHub Actions Guide: https://www.artillery.io/docs/cicd/github-actions
