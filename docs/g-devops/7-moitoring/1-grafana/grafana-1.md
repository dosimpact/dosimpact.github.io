---
sidebar_position: 1
---

# Grafana 


## Grafana Alerting  

- Grafana Alerting은 Contact Point → Notification Policy → Alert Rule 3단 구조이다.
- 그 이유는 유연성과 재사용성 때문.  

1. Contact Point
- 역할: 알림을 보낼 대상과 채널을 정의 (예: Slack, Email, PagerDuty).
- 왜 분리?
  - 같은 알림 채널을 여러 알림 규칙에서 재사용 가능.
  - 예: Slack 채널 하나를 여러 Alert Rule에서 사용.

2. Notification Policy  
- 역할: 알림 전송 전략을 정의 
  - Contact Point를 지정 가능.  
  - Override general timings에 얼럿 인터벌 옵션들이 있다.
    - 1.Group wait : 얼럿 트리거링 이후 n초 후 보낸다.  
    - 2.Group interval : 얼럿 후 n초 이후 보낸다.    
    - 3.Repeat interval : 동일 한하여 n초 이후 보낸다.  
- 왜 분리?
  - 알림 빈도, 그룹화 방식은 채널과는 별개로 관리해야 함.
  - 예: Slack 알림은 10분마다 반복, Email은 1시간마다 반복 → 정책으로 분리하면 유연함.

3. Alert Rule    
- 역할: 어떤 조건에서 알람을 발생시킬지 정의 (예: Loki 쿼리, 임계값).
- 주요 고려 사항  
  - Query를 작성해서 Count값으로 최종 출력을 만들어야 한다. (데이터 소스마다 쿼리가 다르다.)  
  - No Data의 경우 Normal 처리 결정  
- 왜 분리?
  - 알람 조건은 정책이나 채널과 독립적이어야 함.
  - 예: CPU > 90% 알람과 DB 연결 실패 알람이 같은 Slack 채널로 가지만, 반복 주기는 다를 수 있음.  

