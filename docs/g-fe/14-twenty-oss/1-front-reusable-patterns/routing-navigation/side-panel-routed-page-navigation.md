# Side Panel Routed Page Navigation

일반 route path를 앱의 main router 대신 side panel navigation stack item으로 변환해 embedded page처럼 여는 패턴이다.

핵심은 `Route stays reusable, navigator decides the surface`다.

## 1. 모듈 코드

- `src/modules/side-panel/routing/utils/toSidePanelLocation.ts`: string path를 side panel stack에 저장 가능한 routed location 객체로 바꾼다.
- `src/modules/side-panel/states/sidePanelNavigationStackState.ts`: purpose-built page와 routed page를 같은 side panel stack item union으로 관리한다.
- `src/modules/side-panel/routing/hooks/useOpenRoutedPageInSidePanel.ts`: path 검증, routed location 생성, replace/reset 처리, routed flow scope 유지까지 묶어 side panel page를 연다.
- `src/modules/side-panel/routing/components/SidePanelRouteNavigatorProvider.tsx`: side panel 안에서 발생한 React Router navigation을 다시 side panel stack navigation으로 가로챈다.
- `src/modules/side-panel/routing/components/SidePanelRoutedPage.tsx`: side panel stack의 current routed location으로 기존 workspace routes를 side panel surface에 렌더링한다.

```tsx
// filepath: src/modules/side-panel/routing/utils/toSidePanelLocation.ts
import { parsePath } from 'react-router-dom';
import { v4 } from 'uuid';

import { type SidePanelRoutedLocation } from '@/side-panel/states/sidePanelNavigationStackState';

export const toSidePanelLocation = (
  path: string,
  state: unknown = null,
): SidePanelRoutedLocation => ({
  pathname: '',
  search: '',
  hash: '',
  ...parsePath(path),
  state,
  key: v4(),
});

// filepath: src/modules/side-panel/states/sidePanelNavigationStackState.ts
import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';
import { type PurposeBuiltSidePanelPage } from '@/side-panel/types/SidePanelPage';
import { type Location } from 'react-router-dom';
import type { SidePanelPages } from 'twenty-shared/types';
import { type IconComponent } from 'twenty-ui/icon';

type SidePanelNavigationStackItemBase = {
  pageTitle: string;
  pageIcon: IconComponent;
  pageIconColor?: string;
  pageId: string;
  routedFlowStateScopeId?: string;
};

export type SidePanelRoutedLocation = Pick<
  Location,
  'pathname' | 'search' | 'hash' | 'state' | 'key'
>;

export type SidePanelNavigationStackItem =
  | (SidePanelNavigationStackItemBase & {
      page: SidePanelPages.RoutedPage;
      routedLocation: SidePanelRoutedLocation;
    })
  | (SidePanelNavigationStackItemBase & {
      page: PurposeBuiltSidePanelPage;
      routedLocation?: never;
    });

export const sidePanelNavigationStackState = createAtomState<
  SidePanelNavigationStackItem[]
>({
  key: 'side-panel/sidePanelNavigationStackState',
  defaultValue: [],
});

// filepath: src/modules/side-panel/routing/hooks/useOpenRoutedPageInSidePanel.ts
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { SidePanelPages } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { IconDotsVertical } from 'twenty-ui/icon';
import { v4 } from 'uuid';

import { useWorkspaceRouteObjects } from '@/app/routing/components/WorkspaceRouteObjectsProvider';
import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { isSidePanelRoutedLocation } from '@/side-panel/routing/utils/isSidePanelRoutedLocation';
import { releaseRemovedRoutedFlowStateScopes } from '@/side-panel/routing/utils/releaseRemovedRoutedFlowStateScopes';
import { toSidePanelLocation } from '@/side-panel/routing/utils/toSidePanelLocation';
import { sidePanelNavigationStackState } from '@/side-panel/states/sidePanelNavigationStackState';

export const useOpenRoutedPageInSidePanel = () => {
  const store = useStore();
  const routeObjects = useWorkspaceRouteObjects();
  const { navigateSidePanel } = useNavigateSidePanel();

  const openRoutedPageInSidePanel = useCallback(
    ({
      path,
      state,
      pageTitle,
      resetNavigationStack = false,
      replaceCurrent = false,
      routedFlowStateScopeId,
    }: {
      path: string;
      state?: unknown;
      pageTitle?: string;
      resetNavigationStack?: boolean;
      replaceCurrent?: boolean;
      routedFlowStateScopeId?: string;
    }) => {
      if (!path.startsWith('/') || path.startsWith('//')) {
        return null;
      }

      let routedLocation = toSidePanelLocation(path, state);

      if (!isSidePanelRoutedLocation(routeObjects, routedLocation)) {
        return null;
      }

      const title = pageTitle ?? routedLocation.pathname;

      if (replaceCurrent) {
        const navigationStack = store.get(sidePanelNavigationStackState.atom);
        const currentItem = navigationStack.at(-1);

        if (
          !isDefined(currentItem) ||
          currentItem.page !== SidePanelPages.RoutedPage
        ) {
          return null;
        }

        routedLocation = {
          ...routedLocation,
          key: currentItem.routedLocation.key,
        };

        const updatedCurrentItem = {
          ...currentItem,
          pageTitle: title,
          routedLocation,
        };

        store.set(
          sidePanelNavigationStackState.atom,
          resetNavigationStack
            ? [updatedCurrentItem]
            : [...navigationStack.slice(0, -1), updatedCurrentItem],
        );

        if (resetNavigationStack) {
          releaseRemovedRoutedFlowStateScopes({
            removedItems: navigationStack.slice(0, -1),
            remainingItems: [updatedCurrentItem],
          });
        }

        return currentItem.pageId;
      }

      const pageComponentInstanceId = v4();

      navigateSidePanel({
        page: SidePanelPages.RoutedPage,
        pageTitle: title,
        pageIcon: IconDotsVertical,
        pageId: pageComponentInstanceId,
        routedFlowStateScopeId:
          routedFlowStateScopeId ?? pageComponentInstanceId,
        routedLocation,
        resetNavigationStack,
      });

      return pageComponentInstanceId;
    },
    [navigateSidePanel, routeObjects, store],
  );

  return { openRoutedPageInSidePanel };
};

// filepath: src/modules/side-panel/routing/components/SidePanelRouteNavigatorProvider.tsx
import { useWorkspaceRouteObjects } from '@/app/routing/components/WorkspaceRouteObjectsProvider';
import { useSidePanelHistory } from '@/side-panel/hooks/useSidePanelHistory';
import { useSidePanelMenu } from '@/side-panel/hooks/useSidePanelMenu';
import { useOpenSettingsMenu } from '@/navigation/hooks/useOpenSettings';
import { useOpenRoutedPageInSidePanel } from '@/side-panel/routing/hooks/useOpenRoutedPageInSidePanel';
import { isSidePanelRoutedLocation } from '@/side-panel/routing/utils/isSidePanelRoutedLocation';
import { toSidePanelLocation } from '@/side-panel/routing/utils/toSidePanelLocation';
import { sidePanelNavigationStackState } from '@/side-panel/states/sidePanelNavigationStackState';
import { useStore } from 'jotai';
import { type ReactNode, useContext, useMemo } from 'react';
import {
  createPath,
  type NavigateOptions,
  type Navigator,
  type To,
  UNSAFE_NavigationContext,
} from 'react-router-dom';

const getPathFromTo = (to: To) =>
  typeof to === 'string' ? to : createPath(to);

export const SidePanelRouteNavigatorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const parentNavigationContext = useContext(UNSAFE_NavigationContext);
  const parentNavigator = parentNavigationContext.navigator;
  const routeObjects = useWorkspaceRouteObjects();
  const store = useStore();
  const { openRoutedPageInSidePanel } = useOpenRoutedPageInSidePanel();
  const { closeSidePanelMenu } = useSidePanelMenu();
  const { openSettingsMenu } = useOpenSettingsMenu();
  const { goBackFromSidePanel, navigateSidePanelHistory } =
    useSidePanelHistory();

  const navigator = useMemo<Navigator>(() => {
    const navigate = (
      method: 'push' | 'replace',
      to: To,
      state?: unknown,
      options?: NavigateOptions,
    ) => {
      const shouldNavigateMain = options?.surface === 'main';
      const path = getPathFromTo(to);
      const location = toSidePanelLocation(path, state);

      if (
        !shouldNavigateMain &&
        isSidePanelRoutedLocation(routeObjects, location)
      ) {
        const currentNavigationItem = store
          .get(sidePanelNavigationStackState.atom)
          .at(-1);

        openRoutedPageInSidePanel({
          path,
          state,
          replaceCurrent: method === 'replace',
          routedFlowStateScopeId:
            currentNavigationItem?.routedFlowStateScopeId ??
            currentNavigationItem?.pageId,
        });
        return;
      }

      void closeSidePanelMenu();
      if (location.pathname.startsWith('/settings')) {
        openSettingsMenu();
      }
      parentNavigator[method](to, state, options);
    };

    return {
      createHref: (to) => parentNavigator.createHref(to),
      encodeLocation: parentNavigator.encodeLocation
        ? (to) => parentNavigator.encodeLocation!(to)
        : undefined,
      push: (to, state, options) => navigate('push', to, state, options),
      replace: (to, state, options) => navigate('replace', to, state, options),
      go: (delta) => {
        if (delta === -1) {
          goBackFromSidePanel();
          return;
        }

        if (delta >= 0) {
          void closeSidePanelMenu();
          parentNavigator.go(delta);
          return;
        }

        const navigationStack = store.get(sidePanelNavigationStackState.atom);
        const targetIndex = navigationStack.length - 1 + delta;

        if (targetIndex < 0) {
          void closeSidePanelMenu();
          return;
        }

        navigateSidePanelHistory(targetIndex);
      },
    };
  }, [
    closeSidePanelMenu,
    goBackFromSidePanel,
    navigateSidePanelHistory,
    openRoutedPageInSidePanel,
    openSettingsMenu,
    parentNavigator,
    routeObjects,
    store,
  ]);

  const navigationContextValue = useMemo(
    () => ({ ...parentNavigationContext, navigator }),
    [navigator, parentNavigationContext],
  );

  return (
    <UNSAFE_NavigationContext.Provider value={navigationContextValue}>
      {children}
    </UNSAFE_NavigationContext.Provider>
  );
};

// filepath: src/modules/side-panel/routing/components/SidePanelRoutedPage.tsx
import { Suspense, useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';

import { WorkspaceRoutes } from '@/app/routing/components/WorkspaceRoutes';
import { WorkspaceRouteUnavailable } from '@/app/routing/components/WorkspaceRouteUnavailable';
import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SidePanelRouteNavigatorProvider } from '@/side-panel/routing/components/SidePanelRouteNavigatorProvider';
import { useCurrentSidePanelRoutedLocation } from '@/side-panel/routing/hooks/useCurrentSidePanelRoutedPath';
import { SidePanelPageComponentInstanceContext } from '@/side-panel/states/contexts/SidePanelPageComponentInstanceContext';
import { WorkspaceSurfaceContext } from '@/ui/layout/contexts/WorkspaceSurfaceContext';
import { useWorkspaceSurface } from '@/ui/layout/hooks/useWorkspaceSurface';
import { useComponentInstanceStateContext } from '@/ui/utilities/state/component-state/hooks/useComponentInstanceStateContext';

const SidePanelRouteErrorFallback = () => <WorkspaceRouteUnavailable />;

export const SidePanelRoutedPage = () => {
  const location = useCurrentSidePanelRoutedLocation();
  const sidePanelPageInstanceId = useComponentInstanceStateContext(
    SidePanelPageComponentInstanceContext,
  )?.instanceId;
  const workspaceSurface = useWorkspaceSurface();

  const contextStoreValue = useMemo(
    () => ({ instanceId: sidePanelPageInstanceId ?? '' }),
    [sidePanelPageInstanceId],
  );
  const routedWorkspaceSurface = useMemo(
    () => ({ ...workspaceSurface, ownsRouteLocation: true }),
    [workspaceSurface],
  );

  if (!isDefined(location) || !isDefined(sidePanelPageInstanceId)) {
    return <WorkspaceRouteUnavailable />;
  }

  return (
    <WorkspaceSurfaceContext.Provider value={routedWorkspaceSurface}>
      <ContextStoreComponentInstanceContext.Provider value={contextStoreValue}>
        <AppErrorBoundary
          key={location.key}
          FallbackComponent={SidePanelRouteErrorFallback}
          resetOnLocationChange={false}
        >
          <SidePanelRouteNavigatorProvider>
            <Suspense fallback={<SettingsSkeletonLoader />}>
              <WorkspaceRoutes
                surface="side-panel"
                location={location}
                fallback={<WorkspaceRouteUnavailable />}
              />
            </Suspense>
          </SidePanelRouteNavigatorProvider>
        </AppErrorBoundary>
      </ContextStoreComponentInstanceContext.Provider>
    </WorkspaceSurfaceContext.Provider>
  );
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/side-panel/hooks/useOpenRecordInSidePanel.ts
const recordPath = getAppPath(AppPath.RecordShowPage, {
  objectNameSingular,
  objectRecordId: recordId,
});
const recordPathWithTab = isDefined(tab)
  ? `${recordPath}#${encodeURIComponent(tab)}`
  : recordPath;

const pageComponentInstanceId = openRoutedPageInSidePanel({
  path: recordPathWithTab,
  pageTitle: isNewRecord ? t`New ${objectMetadataItem.labelSingular}` : undefined,
  resetNavigationStack,
});

if (!isDefined(pageComponentInstanceId)) {
  return null;
}

// filepath: src/modules/object-record/record-show/hooks/useRecordShowPagePagination.ts
const destinationPageInstanceId = openRoutedPageInSidePanel({
  path: indexPath,
  resetNavigationStack: false,
});

if (isDefined(destinationPageInstanceId)) {
  store.set(
    lastShowPageRecordIdState.atomFamily({
      instanceId: destinationPageInstanceId,
    }),
    objectRecordId,
  );
}
```
