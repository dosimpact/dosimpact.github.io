---
sidebar_position: 12
---

# React Patterns - Portals

## Global Portals  

- 모달 컴포넌트 등 DOM 최상단에 끌어올려야 하는 컴포넌트는 동일한 목적지를 가진다.  
- 따라서 글로벌 포털이라는 컨테이너를 사용한다.  

⚠️ 주의  
- 실제 DOM 구조가 아닌 리액트 트리의 이벤트 전파를 따르니 이에 대한 예외처리가 필요하다.  
- div(id="global-portal-container")는 참조를 useRef가 아닌 useState에 저장하여 createPortal를 리렌더링 한다.  


```jsx
import { createContext, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

const PortalContext = createContext<HTMLDivElement | null>(null);

interface PortalProviderProps {
  children: ReactNode;
}

function PortalProvider({ children }: PortalProviderProps) {
  const [portalContainerRef, setPortalContainerRef] = useState<HTMLDivElement | null>(null);

  return (
    <PortalContext.Provider value={portalContainerRef}>
      {children}
      <div
        id="global-portal-container"
        ref={elem => {
          if (portalContainerRef !== null || elem === null) {
            return;
          }

          setPortalContainerRef(elem);
        }}
      />
    </PortalContext.Provider>
  );
}

interface PortalConsumerProps {
  children: ReactNode;
}

function PortalConsumer({ children }: PortalConsumerProps) {
  return (
    <PortalContext.Consumer>
      {portalContainerRef => {
        if (portalContainerRef === null) {
          return null;
        }

        return createPortal(children, portalContainerRef);
      }}
    </PortalContext.Consumer>
  );
}

export const GlobalPortal = {
  Provider: PortalProvider,
  Consumer: PortalConsumer,
};


```