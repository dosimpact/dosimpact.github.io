---
sidebar_position: 2
---

# Remotion 예제

## 예제 1: my-first-remotion

Claude의 디자인 언어를 설명하는 약 47초 길이의 내레이션 영상이다.

```text
public/my-first-remotion/
├── claude_design.mp3
└── claude_design.srt

src/remotion/my-first-remotion/
├── MyFirstRemotion.tsx
├── SceneCanvas.tsx
├── Captions.tsx
└── scenes/
    ├── TrustScene.tsx
    ├── WarmthScene.tsx
    ├── WhitespaceScene.tsx
    ├── SafetyScene.tsx
    └── ConversationScene.tsx
```

핵심 구현은 다음과 같다.

- 1920×1080, 30FPS, 1,424프레임 Composition
- MP3 내레이션을 최상위에서 한 번만 재생
- `TransitionSeries.Sequence`로 다섯 장면 연결
- SRT를 `Caption[]`으로 변환해 현재 프레임의 문장 표시
- 아이보리, 테라코타, 넓은 여백으로 Claude 스타일 재해석
- 각 장면의 대화 카드, 팔레트, 문서 블록, 안전 링을 `Interactive.Div`로 구성

Composition 등록 예시:

```tsx
<Composition
  id="my-first-remotion"
  component={MyFirstRemotion}
  durationInFrames={1424}
  fps={30}
  width={1920}
  height={1080}
/>
```

Studio에서 바로 여는 주소는 다음 형식이다.

```text
http://localhost:3100/my-first-remotion
```

## 예제 2: my-second-stock

원자재 투자를 설명하는 장시간 강의 영상이다. 인트로, 일곱 개 포인트, 아웃트로를 데이터 기반으로 구성한다.

```text
public/my-second-stock/
├── captions.json
└── commodities.srt

src/remotion/my-second-stock/
├── MySecondStock.tsx
├── IntroOutro.tsx
├── PointScene.tsx
├── Captions.tsx
├── data.ts
└── designSystems.ts
```

핵심 구현은 다음과 같다.

- 1920×1080, 30FPS, 24,751프레임 Composition
- `data.ts`의 일곱 개 강의 포인트를 동일한 `PointScene`으로 렌더링
- 장면 시작 위치와 길이를 프레임 배열로 관리
- 문장 길이와 예상 읽기 속도로 SRT와 Caption JSON 생성
- 프레임 기준으로 현재 자막을 찾고 단어 단위 색상 강조
- 장면마다 서로 다른 디자인 토큰 적용

`designSystems.ts`는 다음 값을 프리셋으로 관리한다.

```ts
type SceneDesignSystem = {
  name: string;
  background: string;
  foreground: string;
  muted: string;
  panel: string;
  border: string;
  accent: string;
  radius: number;
  fontFamily: string;
  backgroundImage: string;
};
```

예제에 포함된 프리셋은 Modern Classroom, Industrial Commodity, Data Journalism, Technical Blueprint, Financial Newsroom, Premium Research, Dark Terminal이다. 콘텐츠 구조를 유지하면서 토큰만 바꿔 장면별 시각 언어를 변경한다.

자막 생성 스크립트:

```bash
node scripts/generate-my-second-stock-captions.mjs
```

Composition 등록 예시:

```tsx
<Composition
  id="my-second-stock"
  component={MySecondStock}
  durationInFrames={24751}
  fps={30}
  width={1920}
  height={1080}
/>
```

두 예제의 차이는 `my-first-remotion`이 장면별 컴포넌트를 강조하고, `my-second-stock`은 데이터와 디자인 토큰을 재사용해 많은 장면을 생성한다는 점이다.

