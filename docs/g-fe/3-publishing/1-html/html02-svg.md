---
sidebar_position: 2
---

# Html01

## SVG 컴포넌트 패턴 가이드

### 1. 비율 유지하며 크기 조절하는 SVG 컴포넌트

```tsx
// components/icons/ExampleIcon.tsx
export const ExampleIcon: React.FC<{ size?: number }> = ({
  size = 50,
}) => {
  // 원본 비율 계산: viewBox="0 0 121 50" → 121:50 = 2.42:1
  const width = size * 2.42;
  const height = size;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 121 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Example Icon</title>
      <path
        d="M29.23 33.4099L29.95 39.0699C28.65 39.6499..."
        fill="currentColor"
      />
      {/* 추가 path 요소들... */}
    </svg>
  );
};
```

**사용법:**
```tsx
// 기본 크기 (height: 50px, width: 121px)
<ExampleIcon />

// 작은 크기 (height: 30px, width: 72.6px)
<ExampleIcon size={30} />

// 큰 크기 (height: 100px, width: 242px)
<ExampleIcon size={100} />
```

**핵심 포인트:**
- `size` prop은 height 기준으로 설정
- `width = size * (원본비율)`로 계산
- `viewBox`는 원본 크기 그대로 유지

---

### 2. currentColor로 색상 상속받는 SVG 컴포넌트

```tsx
// components/icons/ColorableIcon.tsx
export const ColorableIcon: React.FC<{ size?: number }> = ({
  size = 50,
}) => {
  const width = size * 2.42;
  const height = size;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 121 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Colorable Icon</title>
      {/* 모든 path의 fill을 currentColor로 변경 */}
      <path
        d="M29.23 33.4099L29.95 39.0699C28.65 39.6499..."
        fill="currentColor"  {/* #3CFF00 → currentColor */}
      />
      <path
        d="M40.3601 39.17H32.3401L35.8901 13.63..."
        fill="currentColor"  {/* #3CFF00 → currentColor */}
      />
      {/* 나머지 path들도 동일하게 변경 */}
    </svg>
  );
};
```

**사용법:**
```tsx
// 1. 기본 색상 (브라우저 기본)
<div>
  <ColorableIcon size={50} />
</div>

// 2. 빨간색으로 변경
<div style={{ color: 'red' }}>
  <ColorableIcon size={50} />
</div>

// 3. 파란색으로 변경 (직계 자식이 아니어도 됨)
<div style={{ color: 'blue' }}>
  <span>
    <ColorableIcon size={50} />
  </span>
</div>

// 4. CSS 클래스 사용
<div className="text-green-500">
  <ColorableIcon size={50} />
</div>

// 5. 중간에 색상 재정의
<div style={{ color: 'red' }}>
  <span style={{ color: 'purple' }}>
    <ColorableIcon size={50} /> {/* 보라색 사용 */}
  </span>
</div>
```

**핵심 포인트:**
- 모든 `path` 요소의 `fill="#3CFF00"`를 `fill="currentColor"`로 변경
- CSS 상속 체인을 따라 가장 가까운 부모의 `color` 속성을 사용
- 직계 자식 관계가 아니어도 상속 가능
- 부모에 `color` 속성이 없으면 브라우저 기본 색상 사용

---

### 3. 두 패턴을 결합한 완전한 예시

```tsx
// components/icons/CompleteIcon.tsx
export const CompleteIcon: React.FC<{ size?: number }> = ({
  size = 50,
}) => {
  // 비율 계산
  const width = size * 2.42;
  const height = size;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 121 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Complete Icon</title>
      <path
        d="M29.23 33.4099L29.95 39.0699C28.65 39.6499..."
        fill="currentColor"
      />
      {/* 추가 path들... */}
    </svg>
  );
};
```

이 패턴을 사용하면 크기와 색상을 모두 유연하게 조절할 수 있는 재사용 가능한 SVG 컴포넌트를 만들 수 있습니다!

