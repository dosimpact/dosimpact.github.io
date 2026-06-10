---
sidebar_position: 0
---

# ChatGPT Prompt Engineering 2


## 기법 
https://slashpage.com/haebom/hitchhiker  

## 엔지니어링 프로세스  


1.궁극적인 목적을 생각하기    

어떻게 LLM이 답변했으면 좋을지 생각해보기.  
- 그 정답을 미리 만들어 보면서 10개정도 정답셋을 구축하기  
- *막연히 LLM이 알아서 출력해주겠지 생각하면, 실망하는 경우가 많다.
- Chat bot의 경우에는 System Prompt, User Prompt 중 System Prompt만 조작 가능하다.

2.프롬프트 작성하기  

문제점 
- 원하는 출력이 안되는 경우가 많음
  - Terms 문제 : 주로 사용하는 워딩이 아닌 경우  
  - 오판 문제 : 정성적 판단기준은 LLM은 모른다.  
  - 조건문 탑재 실패 : 수식으로 조건을 주는 순간 확률적으로 if문이 실행된다.  

3.평가 모델 작성하기  

문제점 : LLM은 확률언어 모델이므로, 어떻게 작동하는지 범위를 갸늠하기 어렵다.  
- 프롬프트를 작성해서 범위를 좁힐 수 있으나, 모든 input의 파라미터에 따라서 출력을 검증할 수 없다.     
- 100개의 데이터만 확인하면 되는가? 1000개까지 확인을 해야하는가?  
- 100개의 데이터를 누가 확인하면 되는가? 
  - 사람이 직접 봐야 하는가? 
  - LLM이 평가할 수 있을까? LLM을 믿지못해서 평가하는데 LLM을 다시 믿고 평가를 한다고?(순환참조오류)  

4.산출물  
- 1.input data (w/git)  
  - TC로 구성된 경계값 데이터 
  - 실 데이터  
  - LLM 입력, 요구사항 ( 정성적 평가 판단 기준, 업계 용어 등 )  
- 2.System Prompt, User Prompt (w/git)   
- 3.평가 Prompt (w/git)  
  - 평가 점수  
- 4.Human 평가
  - 평가 점수  


## 팁  


### 수식이나 연산대신에 언어 사용하기  

As Is
```
condition1. 10 > point : 
- 다시 도전하세요.

condition2. point > 20  : 
- 중수 입니다.

condition3. point > 30  : 
- 고수 입니다.
```

To Be
```
condition1. point가 10 미만인 경우에 : 
- 다시 도전하세요.

condition2. point가 20 초과인 경우에  : 
- 중수 입니다.

condition3. point가 30 초과인 경우에  : 
- 고수 입니다.
```

### 중요한 조건은 반복하기  

As Is
```
condition1. point가 10 미만인 경우에 : 
- 다시 도전하세요.

condition2. point가 20 초과인 경우에  : 
- 중수 입니다.

condition3. point가 30 초과인 경우에  : 
- 고수 입니다.
```

To Be
```

사용자의 득점(point)에 따라서 조건에 따른 문장을 골라야 합니다.
- point가 10 미만인 경우에 -> condition1.   
- point가 20 초과인 경우에 -> condition2.   
- point가 30 초과인 경우에 -> condition3.  

condition1. point가 10 미만인 경우에 : 
- 다시 도전하세요.
condition2. point가 20 초과인 경우에  : 
- 중수 입니다.
condition3. point가 30 초과인 경우에  : 
- 고수 입니다.
```