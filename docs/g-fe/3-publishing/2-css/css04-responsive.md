---
sidebar_position: 4
---

# Responsive Layout

디자인 파악하기  
1.UI안에서는 가변하는 부분이 있다.  
- 다국어 지원에 의해서 변하는 부분  
- DB에서 불러온 데이터의 경우 ( 금액, 포스팅 이름 등 )  
- 이러한 가변적인 경우에 UI가 어떻게 대응해야할지 고민한다.  

2.길어지는 경우 고려하기  
- 대부분의 경우 너비는 고정되어 있다. 
- 웹사이트는 아래로 스크롤 하여 보는데 이것은 사실 높이에 대해서는 비교적 유연하다는 말이다. 
- 그래서 보통 텍스트가 길어지는 경우에는 개행이 되어 내려가거나 
- 반응형 UI에서 공간이 부족한 경우 wrap (요소자체를 개행) 해버린다.  



## 길어지는 텍스트 관리하기   

시나리오 : 벳지 + 텍스트가 한줄로 있는데, 텍스트가 길어지는 경우 요소를 개행하기  

시나리오 : 높이가 고정된 쉘의 경우 말줄임표가 필요하다.   

시나리오 : 2줄까지는 개행을 하되, 3줄부터는 말줄임표로 넣는다.  

사니라오 : 반드시 모든 텍스트가 보여야 하는 경우  
- 텍스트를 클렌징하여 다른 워딩으로 변경  
- 폰트 사이즈 줄이기   
- 레이아웃 변경하기  


## 버그 케이스 관리하기
- span 태그에서 - line height 조정  


## 챗 화면 레이아웃

### width 반응형  
![Alt text](image.png)
https://excalidraw.com/#json=6zXxBddXK6_eedBqqUUvz,LA-iKY6rc0HDBusJZmNjSA  

1.가변 너비 적용 : width:full + fit-content + max-width  

2.정렬 적용 : margin-left:auto, margin-rigth:auto  


### height 반응형  

![Alt text](image-1.png)
https://play.tailwindcss.com/KouIC0NGnM

1.최상위 부모 너비 100dvh
2.부모 높이 승계 height 100%  
3.하단의 고정형 인풋영역은 제외한 모든 공간 차지하기
  - container - h-full flex, flex-col
  - child1 - flex-1 *overflow-hidden*
  - child2 - h-4
  - * flex:1과 overflow-hidden이 만나면 flex1이 무한정 늘어나는것을 방지할 수 있다.
4.부모 높이 승계 h-full, overflow-y-auto
  - * 하위 요소에서 안보이는 영역들을 스크롤링 할 수 있다.  

### height 반응형 Ver2 ( with top nav )  

![Alt text](image-2.png)
https://play.tailwindcss.com/6sv9K7HGLz

5.
- 위 원리와 동일하게 Nav , Chat Container 에도 flex-1 + overflow-hidden으로 가변 높이를 만들어야 한다.   



## 참고
- https://www.daleseo.com/css-screen-height/
- https://www.daleseo.com/css-width/