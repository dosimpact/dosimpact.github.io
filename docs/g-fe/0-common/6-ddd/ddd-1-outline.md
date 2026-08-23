---
sidebar_position: 1
---

# React로 이해하는 도메인 주도 개발

이 문서는 Google Ads 캠페인 설정을 하나의 연속 예제로 사용해 DDD의 핵심 개념과 React 적용 방법을 학습하기 위한 안내서다.

각 장의 핵심 구현은 동일한 업무 규칙을 **OOP 기반 모델**과 **함수형 모델**로 함께 보여 준다. OOP 예제는 상태와 행위를 객체에 캡슐화하고, 함수형 예제는 불변 데이터와 순수 함수, `Result`를 사용한다. 두 방식의 문법보다 비즈니스 규칙과 경계를 같은 위치에 보존하는 원리를 비교한다.

## 1. 목차

1. DDD가 필요한 이유
2. 비즈니스 경계 나누기
3. 도메인 모델 만들기
4. React와 도메인 연결하기
5. 실전 적용과 검증

## 2. 각 목차의 핵심 내용

### 2.1 DDD가 필요한 이유

- DDD와 도메인 모델의 의미
- 단순 CRUD와 복잡한 비즈니스 로직의 차이
- React 컴포넌트에 조건문과 정책이 흩어질 때 발생하는 문제
- 광고 캠페인 요구사항에서 비즈니스 규칙을 식별하는 방법

### 2.2 비즈니스 경계 나누기

- 기획자와 개발자가 같은 업무 용어를 사용하는 Ubiquitous Language
- 캠페인, 입찰, 타기팅, 광고 소재를 구분하는 Bounded Context
- 페이지가 아닌 비즈니스 의미를 기준으로 모듈을 나누는 방법
- Context 사이의 의존성과 모델 공유를 최소화하는 기준

### 2.3 도메인 모델 만들기

- 식별자와 생명주기를 가지는 Campaign Entity
- 예산 규칙을 표현하는 CampaignBudget Value Object
- 상태 변경의 일관성을 보호하는 Aggregate와 Aggregate Root
- 캠페인 게시 조건과 상태 전이를 도메인 행동으로 표현하는 방법
- 객체의 메서드와 함수형 순수 전이 함수로 같은 규칙을 표현하는 방법

### 2.4 React와 도메인 연결하기

- Domain, Application, Infrastructure, UI의 역할과 의존성 방향
- Hexagonal Architecture의 중심, Port, Adapter
- Repository를 이용한 도메인 로직과 API 통신의 분리
- Google Ads DTO와 도메인 모델을 변환하는 Mapper
- React Query, React Hook Form, Zod와 도메인 모델의 책임 구분
- class 기반 Port/Adapter와 함수 레코드 기반 Port/Adapter의 비교

### 2.5 실전 적용과 검증

- Draft 생성부터 게시까지 이어지는 광고 캠페인 설정 흐름
- 예산, 입찰, 전환 추적, 광고 소재가 결합된 복합 정책 처리
- 도메인 규칙, Use Case, Adapter, UI를 구분한 테스트
- 기존 React 프로젝트에 DDD와 Hexagonal Architecture를 점진적으로 도입하는 순서
- 비즈니스 복잡도보다 추상화 비용이 커지는 것을 피하는 기준
