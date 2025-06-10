---
sidebar_position: 2
---

# NextJS Essential TS, Etc

- [NextJS Essential TS, Etc](#nextjs-essential-ts-etc)
  - [Typescript Guide](#typescript-guide)
    - [PropsPass](#propspass)
  - [metadata](#metadata)

---

## Typescript Guide

### PropsPass

```js
import React from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  children,
}) => {}

```

## metadata

```js
// layout.tsx
export const metadata: Metadata = {
  title: "Spotify",
  description: "Listen to music",
};
```
