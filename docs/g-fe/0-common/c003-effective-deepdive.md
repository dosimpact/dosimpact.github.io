---
sidebar_position: 3
---

# 효과적으로 삽질하기  

배경  
- ReactNative에서 웹뷰 앱에서나오는 이슈들을 보고있는데 어렵다. (삽질이 오래걸린다.)  
- 잘 정리하면서, 가설을 세우고 배우고 다시 시도하면서 나아가야 한다.  
  - 바닥 까지내려가면 반드시 해결하게 되어 있다. 추상화된 특정 라이브러리나 기능들에 그 길이 막혀있다고 느낄뿐.  

이유  
- 1.[지식] 안드로이드 관련된 도메인 지식이 없다. 인텐트 지식, intent:// 스킴처리, 딥링크 등등 -> 작은 개념들을 천천히 조사하자.   

- 2.[생태계] 인터넷, GPT를 찾아봐도 정답이 없다. -> 방향성을 제공해주나, 정확한 코드까지는 해결책이 없다.  
  - 답이 없는 문제를 해결하기 위한 프레임워크  
  - 2.1 작은 단위로 문제를 단계적으로 해체시킨다.  
  - 2.2 충분한 배경지식을 바탕으로 가설을 도출한다.
  - 2.3 이슈를 해결해보고, 다음 가설을 다듬고 진행한다.     

- 3.[환경] 이슈 재현환경 구성 셋팅 -> 개발환경셋팅도 많이 걸린다. (실제폰, 에뮬레이터, 빌드 시스템 등 인프라) -> 인프라셋업은 시간을 투자해야 한다.  
