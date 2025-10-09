---
sidebar_position: 12
---

# React Patterns - Global Portals

## Global Portals  

- 모달 컴포넌트 등 DOM 최상단에 끌어올려야 하는 컴포넌트는 동일한 위치에 렌더링 된다.   
- 특정 위치를 컨텍스트로 가지고 있는 글로벌 포털이라는 컴포넌트를 사용하면 편리하다.  

⚠️ 주의  
- 1.Portal의 렌더링은 DOM트리의 특정 위치로 옮기지만, 이벤트는 본래 리액트 트리의 구조를 따라 이벤트 전파가 된다. 
  - 이에 대한 주의 (e.stopPropagation 등) 예외처리가 필요하다.  
- 2.div(id="global-portal-container")는 참조를 useRef가 아닌 useState에 저장하여 createPortal를 리렌더링을 트리거링 한다.  


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