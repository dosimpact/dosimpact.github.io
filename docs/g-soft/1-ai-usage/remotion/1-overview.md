---
sidebar_position: 1
---

# Remotion 프로젝트 개요

Remotion은 React 컴포넌트를 영상의 프레임으로 렌더링하는 도구다. JSX와 CSS로 장면을 만들고, `useCurrentFrame()`으로 시간에 따른 움직임을 정의한다. 같은 코드로 Studio 미리보기와 MP4 렌더링을 수행할 수 있다.

## 기본 제작 흐름

```text
대본·데이터·미디어
       ↓
Composition과 장면 구성
       ↓
프레임 기반 애니메이션
       ↓
오디오·자막 동기화
       ↓
Studio 검수 → 최종 렌더
```

주요 개념은 다음과 같다.

- `Composition`: 해상도, FPS, 길이와 최상위 React 컴포넌트를 등록한다.
- `Sequence`: 요소나 장면이 등장하는 시작 프레임과 지속 시간을 정한다.
- `useCurrentFrame()`: 현재 프레임을 가져온다.
- `interpolate()`: 프레임 범위를 투명도, 위치, 크기 등의 값으로 변환한다.
- `staticFile()`: `public/` 아래의 오디오, 비디오, 이미지, 자막을 참조한다.
- `Audio`, `Video`: 미디어를 타임라인에 배치한다.

## Agent Skill 사용법

먼저 `$remotion-best-practices`를 호출하면 작업에 맞는 전문 스킬로 연결된다.

```text
$remotion-best-practices
이 MP3와 SRT를 사용해 1920x1080 강의 영상을 만들어줘.
장면은 별도 파일로 나누고 Studio에서 편집 가능하게 구성해줘.
```

주요 스킬의 역할은 다음과 같다.

| 스킬 | 사용 시점 |
|---|---|
| `remotion-create` | 새 프로젝트나 Composition 생성 |
| `remotion-markup` | React 장면, 애니메이션, 미디어 구성 |
| `remotion-interactivity` | Studio에서 선택·이동·편집 가능한 요소 구성 |
| `remotion-captions` | SRT 가져오기, 자막 표시, 음성 인식 |
| `remotion-multimedia` | 오디오·비디오 길이와 해상도 확인 |
| `remotion-maps` | 지도, 경로, 3D 지리 영상 |
| `remotion-studio` | Studio 실행과 포트 설정 |
| `remotion-render` | MP4, 스틸 이미지, 투명 영상 출력 |
| `remotion-docs` | 최신 공식 API 문서 확인 |
| `remotion-upgrade` | Remotion 관련 패키지 버전 정렬 |

영상 수정 요청에서도 가능한 한 구체적으로 Composition ID, 해상도, 자산 경로, 장면 수, 원하는 디자인을 함께 전달한다.

## 설치

새 프로젝트를 만드는 가장 간단한 방법은 다음과 같다.

```bash
npx create-video@latest --yes --blank my-video
cd my-video
npm install
```

기존 React 프로젝트에는 필요한 Remotion 패키지를 같은 버전으로 추가한다.

```bash
npx remotion add @remotion/media
npx remotion add @remotion/captions
npx remotion add @remotion/transitions
```

Studio를 실행한다.

```bash
npx remotion studio --no-open --port=3100
```

Composition을 선택해 최종 영상을 출력한다.

```bash
npx remotion render my-composition out/video.mp4
```

MP4 렌더링은 개발 중 매번 실행하기보다 Studio와 단일 프레임 렌더로 먼저 검수하는 편이 효율적이다.

