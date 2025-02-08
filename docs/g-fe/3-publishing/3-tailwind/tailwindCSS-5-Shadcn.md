---
sidebar_position: 5
---

# Shadcn Install

TailwindCSS 기반의 디자인 시스템이다. Radix 컴포넌트로 만들어짐.

## Install 

## shadcn/ui 설정   

install : https://ui.shadcn.com/docs/installation/next


- pnpm dlx shadcn@latest init
- pnpm dlx shadcn@latest add button
- pnpm dlx shadcn@latest add dropdown-menu

## Dark Mode

dark mode : https://ui.shadcn.com/docs/dark-mode/next
- ThemeProvider로 다크모드를 지원한다. 
- 첫화면 랜더링에서 hydration 오류가 잔존한다.(nextjs 15 버전, suppressHydrationWarning 으로 가이드 되고 있음)

Image darkmode -> invert 
```
        <Image
                className="dark:invert"
                src="https://nextjs.org/icons/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
```

## shadcn-Theming

Theming : https://ui.shadcn.com/docs/theming#css-variables  
- 2가지 방식 (CSS Variables, Utility classes)으로 테밍 가능.  
  - 전자는 CSS 변수를 정의하고 이를 tailwind 의 클래스로 사용하는 방식.  
  - 후자는 tailwind의 사전에 정의된 클래스 이름을 사용하는 방식이며 컬러 파레트 변경 가능.    
- CSS Variables 방식으로 진행
  - suffix 변수명 컨벤션 : background는 배경색, foreground는 텍스트 색 
    - 실제 변수 정의는 foreground 만 suffix 적용.  
- 변수를 추가하려면 globals.css 에 추가 후 tailwind.config.ts 에 추가 필요.  


Theme Preset 사용 : https://ui.shadcn.com/themes  
- CSS Variables 에 대한 사전 설정을 고를 수 있다.  

### 📕 tailwind는 레이어 디렉티브 개념을 사용한다. `예, @layer base `    
- CSS 파일 어디든 작성해도 `적용 우선 순위` 보장.  

Tailwind의 레이어 우선순위  
	1.	Base: 기본 스타일 (HTML 태그 초기화 및 전역 스타일)
	2.	Components: 재사용 가능한 컴포넌트 스타일
	3.	Utilities: 유틸리티 클래스 스타일 (가장 강력하며, 다른 스타일을 덮어씀)

2.2 `@layer` 라는 디렉티브로 css파일에 적용한다.  

## shadcn-blocks

blocks 개념 : https://ui.shadcn.com/docs/blocks 
- 재사용 가능한 tailwind 컴포넌트를 만들고, 컴포넌트 단위로 레지스트리를 관리하는 프레임워크이다.  
- 로컬에서 구동해서 확인 가능 하며 개인화된 라이브러리를 만들어서 파는 사람도 존재.! 
- https://www.tailwindawesome.com/resources/shadcnblocks-com

예제
- npx shadcn@latest add sidebar-07 사용  
