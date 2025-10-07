---
sidebar_position: 1
---

# Directory Structure  

## 1단계: 기본적인 역할 분리

초기 단계에서 관심사에 따라 디렉토리를 나누어 기본적인 역할을 정의

| 디렉토리 | 역할 및 내용 |
| :--- | :--- |
| api | API 엔드포인트 정의 및 통신 관련 로직 |
| assets | 이미지, 폰트, 동영상 등 정적 리소스 파일 |
| components | 재사용 가능한 UI 컴포넌트 (프레젠테이셔널) |
| config | 환경 변수, 애플리케이션 설정 파일 |
| constants | 애플리케이션 전반에서 사용되는 상수 (e.g., 에러 코드, 경로) |
| context | React Context 정의 및 관련 로직 |
| utils | 비즈니스 로직과 무관한 범용 유틸리티 함수 |
| hooks | 애플리케이션 전반에서 사용되는 공통 Custom Hooks |
| intl | 국제화(i18n) 관련 파일 및 설정 |
| layout | 애플리케이션의 전체 레이아웃을 구성하는 컴포넌트 |
| services | 비즈니스 로직을 처리하는 부분 (렌더링 무관, 데이터 처리/가공) |
| store | 상태 관리 라이브러리(e.g., Redux, Zustand) 관련 저장소 파일 |
| styles | 전역 스타일, 테마 설정, CSS 변수 등 |
| types | TypeScript 타입 정의 파일 (e.g., 인터페이스, 타입 별칭) |
| views | 라우팅되는 페이지를 구성하는 최상위 JSX 파일 |

---

## 2단계: 관심사 및 도메인 기반 분리

- 비즈니스 로직 vs. 서비스 로직 (비즈니스 로직이 있는지 없는지 구분)   
- 모듈 의존성 (import의 방향으로 레이어를 나누어 구성)   
- 데이터 흐름 (데이터의 워터폴 흐름으로 레이어를 나누어 구성)  

### 1. Common (공통 모듈)

애플리케이션 전반에서 재사용되는, 특정 도메인에 종속되지 않는 모듈을 모읍니다.

| 디렉토리 | 역할 및 내용 |
| :--- | :--- |
| common/ |  |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ components | 범용적인 UI 컴포넌트 (e.g., Button, Modal) |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ constants | 전역 상수 |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ hocs | High-Order Components |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ hooks | 공통 Custom Hooks |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ types | 전역 타입 정의 (e.g., `common/types/models`에 데이터 모델 정의) |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ remotes (or apis) | 외부 API 통신 관련 로직 및 설정 |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ utils | 비즈니스 로직 무관 유틸리티 함수 (e.g., 날짜 포맷) |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ services (or libs) | 외부 서비스/라이브러리 통합 모듈 |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ supabase | 데이터베이스 접근 로직 |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ react-query | 데이터 패칭/캐싱 설정 |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ logger | 로깅 처리 모듈 |

### 2. Feature (기능/도메인 모듈)

특정 도메인 또는 기능에 관련된 모든 요소를 하나의 디렉토리에 묶어 응집도를 높입니다. 이를 통해 모듈 간 의존성을 명확히 하고 유지보수를 용이하게 합니다.

| 디렉토리 | 역할 및 내용 |
| :--- | :--- |
| pages | 라우팅되는 최상위 진입점 컴포넌트 (페이지 경로와 1:1 매칭) |
| containers | Feature Level의 로직 및 상태 관리 담당 컴포넌트 |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ auth | 인증 도메인 관련 모든 파일 (컴포넌트, 훅, 타입, API 로직 등) |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ home | 홈 도메인 관련 모든 파일 |
| &nbsp;&nbsp;&nbsp;&nbsp;ㄴ product | 상품 도메인 관련 모든 파일 |