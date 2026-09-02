# Navigation Mode Switcher

Home, AI, Settings처럼 서로 배타적인 navigation drawer mode를 route 상태와 memorized location 상태에 맞춰 전환하는 패턴이다.

핵심은 `Route-owned modes win, stored tab fills the gaps`다.

## 1. 모듈 코드

- `src/modules/ui/navigation/states/navigationDrawerTabs.ts`: navigation drawer가 지원하는 mode literal과 타입을 정의한다.
- `src/modules/ui/navigation/states/navigationDrawerActiveTabState.ts`: route가 mode를 결정하지 않는 경우 사용할 마지막 active tab을 저장한다.
- `src/modules/navigation/hooks/useActiveNavigationDrawerMode.ts`: settings route, AI route, stored tab 순서로 현재 mode를 계산한다.
- `src/modules/navigation/utils/getNavigationDrawerHomeDestination.ts`: mode 전환 후 돌아갈 main destination이 다른 mode path로 새지 않게 정리한다.
- `src/modules/navigation/hooks/useSwitchNavigationDrawerMode.ts`: mode별 side effect, route 이동, drawer 상태 복원을 하나의 명령형 API로 묶는다.

```tsx
// 큰 흐름: Home, AI, Settings처럼 서로 배타적인 navigation drawer mode를 route 상태와 memorized location 상태에 맞춰 전환하는 패턴이다.
// 핵심 기준: `Route-owned modes win, stored tab fills the gaps`다.

// filepath: src/modules/ui/navigation/states/navigationDrawerTabs.ts
export const NAVIGATION_DRAWER_TABS = {
  NAVIGATION_MENU: 'home',
  AI_CHAT_HISTORY: 'chat',
  SETTINGS: 'settings',
} as const;

export type NavigationDrawerActiveTab =
  (typeof NAVIGATION_DRAWER_TABS)[keyof typeof NAVIGATION_DRAWER_TABS];

// filepath: src/modules/ui/navigation/states/navigationDrawerActiveTabState.ts
import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

import {
  type NavigationDrawerActiveTab,
  NAVIGATION_DRAWER_TABS,
} from '@/ui/navigation/states/navigationDrawerTabs';

export const navigationDrawerActiveTabState =
  createAtomState<NavigationDrawerActiveTab>({
    key: 'navigationDrawerActiveTab',
    defaultValue: NAVIGATION_DRAWER_TABS.NAVIGATION_MENU,
  });

// filepath: src/modules/navigation/hooks/useActiveNavigationDrawerMode.ts
import { useLocation } from 'react-router-dom';

import { useIsSettingsDrawer } from '@/navigation/hooks/useIsSettingsDrawer';
import { navigationDrawerActiveTabState } from '@/ui/navigation/states/navigationDrawerActiveTabState';
import {
  type NavigationDrawerActiveTab,
  NAVIGATION_DRAWER_TABS,
} from '@/ui/navigation/states/navigationDrawerTabs';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isAiChatPath } from '~/utils/isAiChatPath';

export const useActiveNavigationDrawerMode = (): NavigationDrawerActiveTab => {
  const { pathname } = useLocation();
  const isSettingsDrawer = useIsSettingsDrawer();
  const navigationDrawerActiveTab = useAtomStateValue(
    navigationDrawerActiveTabState,
  );

  if (isSettingsDrawer) {
    return NAVIGATION_DRAWER_TABS.SETTINGS;
  }

  if (
    isAiChatPath(pathname) ||
    navigationDrawerActiveTab === NAVIGATION_DRAWER_TABS.AI_CHAT_HISTORY
  ) {
    return NAVIGATION_DRAWER_TABS.AI_CHAT_HISTORY;
  }

  return NAVIGATION_DRAWER_TABS.NAVIGATION_MENU;
};

// filepath: src/modules/navigation/utils/getNavigationDrawerHomeDestination.ts
import { isNonEmptyString } from '@sniptt/guards';

import { isAiChatPath } from '~/utils/isAiChatPath';
import { isSettingsPath } from '~/utils/isSettingsPath';

type GetNavigationDrawerHomeDestinationParams = {
  memorizedUrl: string | null | undefined;
  defaultHomePagePath: string;
};

export const getNavigationDrawerHomeDestination = ({
  memorizedUrl,
  defaultHomePagePath,
}: GetNavigationDrawerHomeDestinationParams) => {
  if (!isNonEmptyString(memorizedUrl)) {
    return defaultHomePagePath;
  }

  const [pathname] = memorizedUrl.split('?');

  return isSettingsPath(pathname) || isAiChatPath(pathname)
    ? defaultHomePagePath
    : memorizedUrl;
};

// filepath: src/modules/navigation/hooks/useSwitchNavigationDrawerMode.ts
import { useLocation, useNavigate } from 'react-router-dom';
import { SettingsPath } from 'twenty-shared/types';

import { useReturnFromExpandedAiChat } from '@/ai/hooks/useReturnFromExpandedAiChat';
import { useSwitchToNewAiChat } from '@/ai/hooks/useSwitchToNewAiChat';
import { getExpandedAiChatReturnLocation } from '@/ai/utils/getExpandedAiChatReturnLocation';
import { useActiveNavigationDrawerMode } from '@/navigation/hooks/useActiveNavigationDrawerMode';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { useIsSettingsDrawer } from '@/navigation/hooks/useIsSettingsDrawer';
import { currentMobileNavigationDrawerState } from '@/navigation/states/currentMobileNavigationDrawerState';
import { getNavigationDrawerHomeDestination } from '@/navigation/utils/getNavigationDrawerHomeDestination';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { navigationDrawerActiveTabState } from '@/ui/navigation/states/navigationDrawerActiveTabState';
import { navigationDrawerExpandedMemorizedState } from '@/ui/navigation/states/navigationDrawerExpandedMemorizedState';
import {
  type NavigationDrawerActiveTab,
  NAVIGATION_DRAWER_TABS,
} from '@/ui/navigation/states/navigationDrawerTabs';
import { navigationMemorizedUrlState } from '@/ui/navigation/states/navigationMemorizedUrlState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { isAiChatPath } from '~/utils/isAiChatPath';

export const useSwitchNavigationDrawerMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigateSettings = useNavigateSettings();

  const activeNavigationDrawerMode = useActiveNavigationDrawerMode();
  const isSettingsDrawer = useIsSettingsDrawer();
  const isAiChatPage = isAiChatPath(location.pathname);

  const navigationMemorizedUrl = useAtomStateValue(navigationMemorizedUrlState);
  const navigationDrawerExpandedMemorized = useAtomStateValue(
    navigationDrawerExpandedMemorizedState,
  );
  const setIsNavigationDrawerExpanded = useSetAtomState(
    isNavigationDrawerExpandedState,
  );
  const setCurrentMobileNavigationDrawer = useSetAtomState(
    currentMobileNavigationDrawerState,
  );
  const setNavigationDrawerActiveTab = useSetAtomState(
    navigationDrawerActiveTabState,
  );

  const { defaultHomePagePath } = useDefaultHomePagePath();
  const { switchToNewChat } = useSwitchToNewAiChat({
    shouldOpenInFullPage: true,
  });
  const returnFromExpandedAiChat = useReturnFromExpandedAiChat({
    reopenSidePanel: false,
    destinationPath: getNavigationDrawerHomeDestination({
      memorizedUrl: getExpandedAiChatReturnLocation(location.state),
      defaultHomePagePath,
    }),
  });

  const switchToNavigationMenu = () => {
    setNavigationDrawerActiveTab(NAVIGATION_DRAWER_TABS.NAVIGATION_MENU);

    if (isSettingsDrawer) {
      setCurrentMobileNavigationDrawer('main');
      setIsNavigationDrawerExpanded(navigationDrawerExpandedMemorized);
      navigate(
        getNavigationDrawerHomeDestination({
          memorizedUrl: navigationMemorizedUrl,
          defaultHomePagePath,
        }),
        { replace: true },
      );
      return;
    }

    if (isAiChatPage) {
      returnFromExpandedAiChat();
    }
  };

  const switchToAiChat = () => {
    setCurrentMobileNavigationDrawer('main');
    setNavigationDrawerActiveTab(NAVIGATION_DRAWER_TABS.AI_CHAT_HISTORY);
    switchToNewChat();
  };

  const switchNavigationDrawerMode = (mode: NavigationDrawerActiveTab) => {
    switch (mode) {
      case NAVIGATION_DRAWER_TABS.NAVIGATION_MENU:
        if (
          activeNavigationDrawerMode === NAVIGATION_DRAWER_TABS.NAVIGATION_MENU
        ) {
          return;
        }
        switchToNavigationMenu();
        break;
      case NAVIGATION_DRAWER_TABS.AI_CHAT_HISTORY:
        if (isAiChatPage) {
          return;
        }
        switchToAiChat();
        break;
      case NAVIGATION_DRAWER_TABS.SETTINGS:
        if (isSettingsDrawer) {
          return;
        }
        navigateSettings(SettingsPath.ProfilePage);
        break;
    }
  };

  return { switchNavigationDrawerMode };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Navigation Mode Switcher 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/navigation/components/MainNavigationDrawerModeSwitcher.tsx
export const MainNavigationDrawerModeSwitcher = () => {
  const activeNavigationDrawerMode = useActiveNavigationDrawerMode();
  const { switchNavigationDrawerMode } = useSwitchNavigationDrawerMode();

  const modes: NavigationDrawerMode[] = [
    {
      Icon: IconHome,
      label: t`Home`,
      mode: NAVIGATION_DRAWER_TABS.NAVIGATION_MENU,
    },
    {
      Icon: IconComment,
      label: t`AI`,
      mode: NAVIGATION_DRAWER_TABS.AI_CHAT_HISTORY,
    },
    {
      Icon: IconSettings,
      label: t`Settings`,
      mode: NAVIGATION_DRAWER_TABS.SETTINGS,
    },
  ];

  return (
    <StyledSwitcher role="group" aria-label={t`Navigation modes`}>
      {modes.map(({ Icon, label, mode }) => {
        const isActive = mode === activeNavigationDrawerMode;

        return (
          <StyledMode
            key={mode}
            type="button"
            isActive={isActive}
            aria-current={isActive}
            onClick={() => switchNavigationDrawerMode(mode)}
          >
            <StyledModeIcon>
              <Icon size={theme.icon.size.md} />
            </StyledModeIcon>
            <StyledModeLabel isActive={isActive}>
              <StyledModeLabelText>{label}</StyledModeLabelText>
            </StyledModeLabel>
          </StyledMode>
        );
      })}
    </StyledSwitcher>
  );
};

// filepath: src/modules/navigation/components/MainNavigationDrawer.tsx
export const MainNavigationDrawer = ({ className }: { className?: string }) => {
  const activeNavigationDrawerMode = useActiveNavigationDrawerMode();
  const hasAiPermission = useHasPermissionFlag(PermissionFlagType.AI);

  const showAiChatContent =
    hasAiPermission &&
    activeNavigationDrawerMode === NAVIGATION_DRAWER_TABS.AI_CHAT_HISTORY;

  return (
    <NavigationDrawer className={className}>
      <NavigationDrawerFixedContent>
        <MainNavigationDrawerModeSwitcher />
      </NavigationDrawerFixedContent>

      <NavigationDrawerScrollableContent>
        <NavigationDrawerTabbedContent
          showAiChatContent={showAiChatContent}
          shouldMountAiChatContent={hasAiPermission}
          navigationContent={<MainNavigationDrawerNavigationContent />}
        />
      </NavigationDrawerScrollableContent>
    </NavigationDrawer>
  );
};
```
