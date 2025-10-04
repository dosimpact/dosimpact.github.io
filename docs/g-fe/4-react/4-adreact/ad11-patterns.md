---
sidebar_position: 11
---

# React Patterns 2

## As props Pattern

```jsx
// Before
// 아래 버튼 컴포넌트를 a태그처럼 쓰고싶은데 확장이 어렵다.
<Button href="/" size="lg" >
Link
</Button>
---
// After
const Button = ({As = "button", size="lg", ...props})=>{
    // (size 와 같은 스타일 로직 있음)
    return (
        <As {...props} className={`${styles.button} ${styles[size]}`} />
    )
}
// 아래처럼 As Props를 통해서 Button의 스타일을 그대로 사용하면서 프리미티브 태그를 사용할 수 있다.
<Button As="a" size="lg" href="/">
Link
</Button>
```

### asChild Pattern

```jsx
const Button = ({ asChild, children, className, ...props }) => {
  if (asChild) {
    // 자식 요소를 클론하고 props를 병합
    return React.cloneElement(children, {
      ...props,
      className: `${styles.button} ${className || ''}`,
    });
  }

  // React.createElement(type, props, ...children)
  return React.createElement(
    'button',
    {
      className: `${styles.button} ${className || ''}`,
      ...props,
    },
    children,
  );
};
```