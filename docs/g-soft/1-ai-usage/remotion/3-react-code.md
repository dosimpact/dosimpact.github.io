---
sidebar_position: 3
---

# Remotion React 코드

Remotion 컴포넌트는 일반 React 컴포넌트지만 시간은 초가 아니라 프레임으로 다룬다. CSS `transition`이나 `animation` 대신 현재 프레임으로 모든 상태를 계산해야 최종 렌더에서도 동일하게 재현된다.

## Composition 등록

```tsx
import {Composition} from "remotion";
import {LectureVideo} from "./LectureVideo";

export const RemotionRoot = () => (
  <Composition
    id="lecture-video"
    component={LectureVideo}
    durationInFrames={30 * 60}
    fps={30}
    width={1920}
    height={1080}
  />
);
```

`durationInFrames={30 * 60}`은 30FPS 기준 60초를 의미한다.

## 프레임 애니메이션

```tsx
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Title = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <Interactive.Div
      name="Main title"
      style={{
        opacity: interpolate(frame, [0, 0.8 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(
          frame,
          [0, 0.8 * fps],
          ["0px 40px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        ),
        fontSize: 96,
      }}
    >
      프레임으로 만드는 영상
    </Interactive.Div>
  );
};
```

`Interactive.Div`에 명확한 `name`을 부여하면 Studio 타임라인에서 요소를 찾고 편집하기 쉽다. `transform` 문자열보다 `translate`, `scale`, `rotate` 속성을 사용한다.

## 장면 배치

```tsx
import {AbsoluteFill, Sequence} from "remotion";

export const LectureVideo = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={150} name="Intro">
      <IntroScene />
    </Sequence>

    <Sequence from={150} durationInFrames={300} name="Main point">
      <MainScene />
    </Sequence>
  </AbsoluteFill>
);
```

각 `Sequence` 안에서 `useCurrentFrame()`은 해당 장면 시작점을 기준으로 계산된다. 장면이 많으면 파일을 분리하고, 시작 프레임과 지속 시간을 데이터로 관리한다.

## 오디오와 비디오

```tsx
import {Audio, Video} from "@remotion/media";
import {staticFile} from "remotion";

export const MediaLayer = () => (
  <>
    <Audio src={staticFile("lecture/narration.mp3")} />

    <Video
      src={staticFile("lecture/demo.mp4")}
      from={5 * 30}
      durationInFrames={8 * 30}
      trimBefore={2 * 30}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </>
);
```

- `from`: Composition 또는 부모 Sequence에서 등장할 프레임
- `durationInFrames`: 화면에 유지할 프레임 수
- `trimBefore`: 원본 미디어 앞부분에서 건너뛸 프레임 수
- `muted`: 내레이션과 MP4 음성이 겹치는 것을 방지

## 자막 표시

```tsx
const currentTimeMs = (frame / fps) * 1000;
const currentCaption = captions.find(
  (caption) =>
    caption.startMs <= currentTimeMs &&
    caption.endMs > currentTimeMs,
);

return currentCaption ? <div>{currentCaption.text}</div> : null;
```

자막은 다음 형태의 데이터를 사용한다.

```ts
type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};
```

SRT는 `parseSrt()`로 변환할 수 있다. 긴 영상은 미리 Caption JSON을 생성해 `public/`에 두면 파싱 로직과 자막 생성 과정을 분리하기 쉽다.

## 권장 구조

```text
src/remotion/video-name/
├── Video.tsx
├── Captions.tsx
├── data.ts
├── designSystem.ts
└── scenes/
    ├── IntroScene.tsx
    ├── MainScene.tsx
    └── OutroScene.tsx

public/video-name/
├── narration.mp3
├── captions.json
├── subtitles.srt
└── media/
```

고정된 내용은 장면 파일 안에 두고, 반복되는 콘텐츠는 데이터, 색상·폰트·간격은 디자인 토큰으로 분리한다. 오디오는 최상위에서 한 번만 마운트해 장면 전환 때 재생이 다시 시작되지 않게 한다.

