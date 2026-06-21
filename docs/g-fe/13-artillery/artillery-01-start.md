---
sidebar_position: 1
title: Artillery 시작하기
---

# Artillery Developer Enablement Kit

## 1. 목적과 범위

목적 : Artillery 테스트 

- Node.js REST API 서버에 대한 load, stress, soak, spike 테스트 작성
- 인증이 필요한 API 흐름 테스트
- 테스트 결과 해석 (latency, RPS, error rate...)
- 테스트 환경 (Docker, Docker Compose, GitHub Actions, GitLab CI  실행)
- Prometheus, Grafana, Loki 기반 서버 관측 데이터와 Artillery 결과를 함께 분석


## 2. Artillery 기본 개념

Artillery는 성능 테스트 도구다.
- YAML 또는 JS 기반 테스트 스크립트로 가상 사용자를 생성하고 HTTP, WebSocket, Socket.IO 등의 프로토콜에 부하 준다.
- `npx`로 바로 실행할 수 있으며, CI/CD에 넣기 쉽다.


### 테스트 유형

| 유형 | 목적 | Artillery 표현 방식 |
| --- | --- | --- |
| Load test | 평상시 또는 목표 트래픽에서 정상 동작 확인 | 일정한 `arrivalRate`로 충분한 시간 실행 |
| Stress test | 한계점과 장애 양상 확인 | 단계적으로 `arrivalRate`를 올리고 실패 지점 확인 |
| Soak test | 장시간 안정성, 메모리 누수, 커넥션 누수 확인 | 낮거나 중간 수준의 부하를 긴 `duration`으로 실행 |
| Spike test | 갑작스러운 트래픽 급증 대응 확인 | 짧은 시간에 높은 `arrivalRate`로 급증 후 감소 |

*arrivalRate : 초당 몇 명의 새로운 사용자가 유입되냐?  
- duration: 60, arrivalRate: 10 => 60초 동안 매초 새로운 사용자 10명 시작 => 총 600명의 사용자가 생성됨  

예시:

```yaml
config:
  target: "http://localhost:3000"
  phases:
    # Load test: 기준 부하
    - name: "baseline"
      duration: 300
      arrivalRate: 20

    # Stress test: 점진 증가
    - name: "ramp-up"
      duration: 300
      arrivalRate: 20
      rampTo: 100

    # Spike test: 급증
    - name: "spike"
      duration: 60
      arrivalRate: 300

    # Ramp-down: 회복 확인
    - name: "recovery"
      duration: 180
      arrivalRate: 30
```

## 3. 설치와 실행

```bash
# npx로 실행 (프로젝트에 설치하지 않고 빠르게 실행한다.)
npx artillery run tests/performance/api.yml

# devDependency로 설치
npm install --save-dev artillery
npm pkg set scripts.loadtest="artillery run tests/performance/api.yml"
npm run loadtest

# 빠른 단일 URL 테스트
npx artillery quick --count 100 --num 10 http://localhost:3000/health
# `quick`은 매우 간단한 확인용이다. 실제 프로젝트에서는 YAML 스크립트를 사용한다.
```


## 4. 권장 디렉터리 구조

```text
tests/
  performance/
    api.yml
    websocket.yml
    socketio.yml
    processor.js
    payloads/
      users.csv
reports/
  .gitkeep
```

`tests/performance`에는 테스트 시나리오와 보조 스크립트를 둔다. `reports`에는 CI 실행 결과 JSON/HTML을 저장한다.

### 온보딩 예제 프로젝트


```bash
# 이 플레이북의 내용을 직접 실행해 볼 수 있는 예제 프로젝트는 다음 위치에 있다.
cd /Users/studio/workspace/Research/Artillery/example-project
npm install
npm start
# 다른 터미널에서 smoke test부터 실행한다.
npm run test:smoke
npm run test:load
npm run report:load
```

예제 프로젝트는 테스트 대상 Node.js 서버와 Artillery 시나리오를 모두 포함한다.

- 서버: `example-project/src/server.js`
- 시나리오: `example-project/tests/performance/*.yml`
- processor: `example-project/tests/performance/processor.js`
- 실행 가이드: `example-project/README.md`

## 5. 기본 YAML 구조

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - name: "warmup"
      duration: 60
      arrivalRate: 5
      rampTo: 20
    - name: "steady"
      duration: 300
      arrivalRate: 20
  defaults:
    headers:
      content-type: "application/json"
  ensure:
    maxErrorRate: 1
    thresholds:
      - http.response_time.p95: 500
      - http.response_time.p99: 1000

scenarios:
  - name: "basic API flow"
    flow:
      - get:
          url: "/health"
          expect:
            - statusCode: 200
      - think: 1
      - get:
          url: "/api/items"
          expect:
            - statusCode: 200
```

주요 키:

- `target`: 테스트 대상 서버의 기본 URL
- `phases`: 부하 패턴
- `arrivalRate`: 초당 새로 시작되는 가상 사용자 수
- `rampTo`: phase 동안 `arrivalRate`를 점진적으로 변경
- `scenarios`: 가상 사용자가 수행할 흐름
- `flow`: HTTP 요청, 대기, 반복, 함수 호출의 순서
- `think`: 사용자의 대기 시간 흉내
- `expect`: 응답 코드나 응답 조건 검증
- `ensure`: 테스트 실패 기준

## 6. Node.js REST API 실전 예시

아래 예시는 `health check -> login -> list 조회 -> create 요청` 흐름을 테스트한다.

```yaml
config:
  target: "{{ $processEnvironment.TARGET_URL }}"
  phases:
    - name: "warmup"
      duration: 60
      arrivalRate: 5
      rampTo: 20
    - name: "load"
      duration: 300
      arrivalRate: 20
    - name: "stress"
      duration: 300
      arrivalRate: 20
      rampTo: 100
  defaults:
    headers:
      content-type: "application/json"
  processor: "./processor.js"
  ensure:
    maxErrorRate: 1
    thresholds:
      - http.response_time.p95: 500
      - http.response_time.p99: 1200

scenarios:
  - name: "authenticated CRUD flow"
    beforeScenario: "setRandomUser"
    flow:
      - get:
          url: "/health"
          expect:
            - statusCode: 200

      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.accessToken"
              as: "token"
          expect:
            - statusCode: 200

      - think: 1

      - get:
          url: "/api/items"
          headers:
            authorization: "Bearer {{ token }}"
          expect:
            - statusCode: 200

      - post:
          url: "/api/items"
          headers:
            authorization: "Bearer {{ token }}"
          json:
            title: "{{ itemTitle }}"
            description: "created by artillery"
          expect:
            - statusCode: 201
```

실행:

```bash
TARGET_URL=http://localhost:3000 npx artillery run tests/performance/api.yml
```
