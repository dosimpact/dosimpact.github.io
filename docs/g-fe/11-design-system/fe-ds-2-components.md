---
sidebar_position: 2  
---

# Design System Components #1  


## MUI Component Overview  

✅ Buttons
- Buttons
- Button groups
- Extended FABs
- FAB menu
- Floating action buttons (FABs)
- Icon buttons
- Segmented buttons
- Split buttons

✅ Date & Time Pickers
- Date pickers
- Time pickers

✅ Loading & Progress
- Loading indicator
- Progress indicators

✅ Navigation
- Navigation bar
- Navigation drawer
- Navigation rail

✅ Sheets
- Bottom sheets
- Side sheets

✅ Other Components
- App bars
- Badges
- Cards
- Carousel
- Checkbox
- Chips
- Dialogs
- Divider
- Lists
- Menus
- Radio button
- Search
- Sliders
- Snackbar
- Switch
- Tabs
- Text fields
- Toolbars
- Tooltips  

## 컴포넌트 스펙 정립

목적 : OO을 하기 위한 컴포넌트이다.  
원칙 : UX Write, 컬러 타입 등 주의 사항 정리  
구조 : 컴포넌트의 물리적 구조  
스펙 : 색상, 인터렉션 등 상세 스펙
컬러 : 색상 별 가이드라인   


## Message Box (Info Box)  

목적 : 사용자가 확인해야 할 콘텐츠의 안내 목적   
구조 : 아이콘 + 타이틀 + 콘텐츠 + (버튼)     
스펙  
- CTA 버튼, 하단의 버튼이 있다면 메시지를 읽고 후속 행동을 하도록 유도할 수 있다.  
- 아이콘은 메시지 박스의 내용의 특성을 직관적으로 알 수 있게 도와준다.  
- 색상은 log level 처럼 우선순위를 나타낸다.  
  - 애러(red), 주의(orange), 성공(green), 정보(teal, yellow), 보조설명(bluegray)   
- 콘텐츠 내용은 길어지게 되면 말줄임표를 넣지 않는다. 너무 길어지는 경우라면 접기/펼치기를 넣는다. 내용이 짤려서 확인하지 못하는 경우를 없다.  
주의  
- 토스트 박스 같은 경우 n초뒤 사라진다. 중요한 정보는 메시지 박스로 표기하는것이 맞다.   