---
sidebar_position: 3
---

# React Component Patterns    

- [React Component Patterns](#react-component-patterns)
  - [Funnel Patterns](#funnel-patterns)
  - [Stack Patterns](#stack-patterns)


## Funnel Patterns  

```js
import { type ReactElement, type ReactNode, useEffect, useState } from "react";

interface FunnelStepProps {
  name: string;
  children: ReactNode;
}

export function useFunnel<T extends string>() {
  const [step, setStep] = useState<T | undefined>(undefined);

  const Step = (props: FunnelStepProps) => {
    return <>{props.children}</>;
  };

  const Funnel = ({
    children,
  }: { children: ReactElement<FunnelStepProps>[] }) => {
    // name이 현재 step 상태와 동일한 Step만 렌더링
    const targetStep = children.find(
      (childStep) => childStep.props.name === step,
    );

    if (!targetStep) return null;

    return targetStep;
  };

  Funnel.Step = Step;

  return [Funnel, setStep] as const;
}

```

```js

// 가입방식 컴포넌트 정의
const 가입방식 = ({ onNext }: { onNext: () => void }) => {
  return (
    <div>
      <h1>가입방식 선택</h1>
      <button type="button" onClick={onNext}>
        다음
      </button>
    </div>
  );
};

// 주민번호 컴포넌트 정의
const 주민번호 = ({ onNext }: { onNext: () => void }) => {
  return (
    <div>
      <h1>주민번호 입력</h1>
      <button type="button" onClick={onNext}>
        다음
      </button>
    </div>
  );
};

export const Sample = () => {
  const [Funnel, setStep] = useFunnel<
    "가입방식" | "주민번호" | "집주소" | "가입성공"
  >();

  useEffect(() => {
    setStep("가입방식");
  }, [setStep]);

  return (
    <Funnel>
      <Funnel.Step name="가입방식">
        <가입방식 onNext={() => setStep("주민번호")} />
      </Funnel.Step>
      <Funnel.Step name="주민번호">
        <주민번호 onNext={() => setStep("집주소")} />
      </Funnel.Step>
    </Funnel>
  );
};
```

## Stack Patterns


```js
import { useState, useEffect } from "react";
import type { ReactNode, ReactElement, HTMLAttributes } from "react";

type StackItemName = "preview" | (string & {});

interface StackItemProps {
  name: StackItemName;
  children: ReactNode;
}

interface StackComponent extends HTMLAttributes<HTMLDivElement> {
  (
    props: {
      children: ReactElement<StackItemProps>[];
    } & HTMLAttributes<HTMLDivElement>,
  ): ReactElement | null;
  StackItem: (props: StackItemProps) => ReactElement;
  PreviewItem: (props: { children: ReactNode }) => ReactElement;
}

interface StackActions<T> {
  push: () => void;
  pop: () => void;
  clear: () => void;
  currentIndex: number;
}

export function useStack<T extends StackItemName>(allStackNames: T[] = []) {
  const [currentStackNames, setCurrentStackNames] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const push = () => {
    if (currentIndex < allStackNames.length - 1) {
      const name = allStackNames[currentIndex + 1];
      setCurrentStackNames((prev) => [...prev, name]);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const pop = () => {
    setCurrentStackNames((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);
  };

  const clear = () => {
    setCurrentStackNames([]);
    setCurrentIndex(-1);
  };

  const StackItem = (props: StackItemProps) => {
    return <>{props.children}</>;
  };

  const PreviewItem = (props: { children: ReactNode }) => {
    return <StackItem name="preview">{props.children}</StackItem>;
  };

  const Stack: StackComponent = ({ children, ...props }) => {
    const targetStackItems = children.filter(
      (childItem) =>
        childItem.props.name === "preview" ||
        currentStackNames.includes(childItem.props.name as T),
    );

    if (!targetStackItems.length) return null;

    return <div {...props}>{targetStackItems}</div>;
  };

  Stack.StackItem = StackItem;
  Stack.PreviewItem = PreviewItem;

  const actions: StackActions<T> = {
    push,
    pop,
    clear,
    currentIndex,
  };

  return [Stack, actions] as const;
}
```

```js
// Stack 예제 컴포넌트들
const WelcomeMessage = () => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-lg font-bold mb-2">환영합니다!</h2>
      <p className="text-gray-300">
        서비스를 이용하기 전에 몇 가지 정보를 입력해주세요.
      </p>
    </div>
  );
};

const UserInfo = () => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-lg font-bold mb-2">사용자 정보</h2>
      <p className="text-gray-300">이름과 이메일을 입력해주세요.</p>
    </div>
  );
};

const TermsAgreement = () => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-lg font-bold mb-2">이용약관</h2>
      <p className="text-gray-300">서비스 이용약관에 동의해주세요.</p>
    </div>
  );
};

export const StackExample = () => {
  type StackNames = "welcome" | "userInfo" | "terms";

  const [Stack, { push, pop, currentIndex }] = useStack<StackNames>([
    "welcome",
    "userInfo",
    "terms",
  ]);

  const handleNext = () => {
    push();
  };

  const handlePrev = () => {
    if (currentIndex > -1) {
      pop();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 rounded-xl">
      <Stack className="flex flex-col gap-4">
        <Stack.StackItem name="preview">
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              {currentIndex === -1
                ? "시작하려면 다음 버튼을 클릭하세요"
                : `현재 단계: ${currentIndex + 1}/3`}
            </p>
          </div>
        </Stack.StackItem>

        <Stack.StackItem name="welcome">
          <div className="space-y-4">
            <WelcomeMessage />
          </div>
        </Stack.StackItem>

        <Stack.StackItem name="userInfo">
          <div className="space-y-4">
            <UserInfo />
          </div>
        </Stack.StackItem>

        <Stack.StackItem name="terms">
          <div className="space-y-4">
            <TermsAgreement />
          </div>
        </Stack.StackItem>
      </Stack>

      <div className="mt-4 flex justify-end">
        {currentIndex > -1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="mr-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            이전
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className={`px-4 py-2 text-white rounded-lg transition-colors ${
            currentIndex === 2
              ? "bg-green-600 hover:bg-green-500"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {currentIndex === 2 ? "완료" : "다음"}
        </button>
      </div>
    </div>
  );
};
```