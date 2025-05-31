---
sidebar_position: 4
---

# 디렉터리 패턴 - 1 내 사례  

## 함수형 MVC Pattern   

- React

원칙  
- 1.데이터의 흐름 
  - 데이터의 흐름에 맞게 3단계로 구분해서 설계한다.   
- 2.응집도 및 결합도  
  - 결합도 : Model - Controller - View 3단 구조만 결합을 가져간다.   
  - 응집도 : 나머지는 해당 모듈 내에서 응집도를 가져간다.     
- 3.아래 로직 분리는 조금 더 고민이 필요하다. 
  - 도메인 로직 : 
  - 서비스 로직 : 

### 사례)상품 대시보드 

```
- Model
  - states  
  - store  
- Controller 
  - controller.ts  
  - /logging  
  - /validator  
  - /useQuery..  
- Context API  
- View  
  - elements : view Layer에서 공통으로 사용하는 순수 ui   
  - table : 
    - hooks
  - create-Modal
    - hooks
```



