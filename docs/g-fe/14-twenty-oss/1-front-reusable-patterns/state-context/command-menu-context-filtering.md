# Command Menu Context Filtering

Command menu item 목록을 현재 화면, object, 선택 상태, preview 상태에 맞게 provider 안에서 필터링하는 패턴이다.

핵심은 `Provider derives available items, consumers only render them`이다.

## 1. 모듈 코드

- `src/modules/command-menu-item/contexts/CommandMenuContext.ts`: command menu consumer가 사용할 display type, container type, filtered items, context API를 정의한다.
- `src/modules/command-menu-item/contexts/CommandMenuContextProvider.tsx`: 현재 command menu API를 읽고 workflow record인 경우 enrichment provider로 분기한다.
- `src/modules/command-menu-item/contexts/CommandMenuContextProviderContent.tsx`: atom state와 context API를 조합해 실제 표시 가능한 command menu item만 필터링한다.

```tsx
// 큰 흐름: Command menu item 목록을 현재 화면, object, 선택 상태, preview 상태에 맞게 provider 안에서 필터링하는 패턴이다.
// 핵심 기준: `Provider derives available items, consumers only render them`이다.

// filepath: src/modules/command-menu-item/contexts/CommandMenuContext.ts
import { EMPTY_COMMAND_MENU_CONTEXT_API } from '@/command-menu-item/constants/EmptyCommandMenuContextApi';
import { CommandMenuItemContainerType } from '@/command-menu-item/types/CommandMenuItemContainerType';
import { createContext } from 'react';
import { type CommandMenuContextApi } from 'twenty-shared/types';
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

export type CommandMenuContextType = {
  displayType: 'button' | 'listItem' | 'dropdownItem';
  containerType: CommandMenuItemContainerType;
  commandMenuItems: CommandMenuItemFieldsFragment[];
  commandMenuContextApi: CommandMenuContextApi;
  isInPreviewMode: boolean;
};

export const CommandMenuContext = createContext<CommandMenuContextType>({
  containerType: CommandMenuItemContainerType.CommandMenuList,
  displayType: 'button',
  commandMenuItems: [],
  commandMenuContextApi: EMPTY_COMMAND_MENU_CONTEXT_API,
  isInPreviewMode: false,
});

// filepath: src/modules/command-menu-item/contexts/CommandMenuContextProvider.tsx
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { type CommandMenuContextType } from '@/command-menu-item/contexts/CommandMenuContext';
import { useCurrentCommandMenuContextApi } from '@/command-menu-item/hooks/useCurrentCommandMenuContextApi';

import { CommandMenuContextProviderContent } from './CommandMenuContextProviderContent';
import { CommandMenuContextProviderWithWorkflowEnrichment } from './CommandMenuContextProviderWithWorkflowEnrichment';

type CommandMenuContextProviderProps = {
  displayType: CommandMenuContextType['displayType'];
  containerType: CommandMenuContextType['containerType'];
  children: React.ReactNode;
  isInPreviewMode?: boolean;
};

export const CommandMenuContextProvider = ({
  displayType,
  containerType,
  children,
  isInPreviewMode = false,
}: CommandMenuContextProviderProps) => {
  const commandMenuContextApi = useCurrentCommandMenuContextApi();

  const currentObjectNameSingular =
    commandMenuContextApi.objectMetadataItem.nameSingular;

  const isWorkflow =
    currentObjectNameSingular === CoreObjectNameSingular.Workflow;

  const selectedWorkflowRecordIds = isWorkflow
    ? commandMenuContextApi.selectedRecords
        .map((record) => record.id)
        .filter(isDefined)
    : [];

  if (selectedWorkflowRecordIds.length > 0) {
    return (
      <CommandMenuContextProviderWithWorkflowEnrichment
        displayType={displayType}
        containerType={containerType}
        commandMenuContextApi={commandMenuContextApi}
        selectedWorkflowRecordIds={selectedWorkflowRecordIds}
        isInPreviewMode={isInPreviewMode}
      >
        {children}
      </CommandMenuContextProviderWithWorkflowEnrichment>
    );
  }

  return (
    <CommandMenuContextProviderContent
      displayType={displayType}
      containerType={containerType}
      commandMenuContextApi={commandMenuContextApi}
      isInPreviewMode={isInPreviewMode}
    >
      {children}
    </CommandMenuContextProviderContent>
  );
};

// filepath: src/modules/command-menu-item/contexts/CommandMenuContextProviderContent.tsx
import {
  CommandMenuContext,
  type CommandMenuContextType,
} from '@/command-menu-item/contexts/CommandMenuContext';
import { commandMenuItemsDraftState } from '@/command-menu-item/edit/states/commandMenuItemsDraftState';
import { commandMenuItemsSelector } from '@/command-menu-item/states/commandMenuItemsSelector';
import { doesCommandMenuItemMatchObjectMetadataId } from '@/command-menu-item/utils/doesCommandMenuItemMatchObjectMetadataId';
import { doesCommandMenuItemMatchPageLayoutId } from '@/command-menu-item/utils/doesCommandMenuItemMatchPageLayoutId';
import { doesCommandMenuItemMatchPageType } from '@/command-menu-item/utils/doesCommandMenuItemMatchPageType';
import { doesCommandMenuItemMatchSelectionState } from '@/command-menu-item/utils/doesCommandMenuItemMatchSelectionState';
import {
  currentPageLayoutIdState,
  PageLayoutIdContext,
} from '@/page-layout/states/currentPageLayoutIdState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useContext, useMemo } from 'react';
import { type CommandMenuContextApi } from 'twenty-shared/types';
import { evaluateConditionalAvailabilityExpression } from 'twenty-shared/utils';

type CommandMenuContextProviderContentProps = {
  displayType: CommandMenuContextType['displayType'];
  containerType: CommandMenuContextType['containerType'];
  children: React.ReactNode;
  commandMenuContextApi: CommandMenuContextApi;
  isInPreviewMode: boolean;
};

export const CommandMenuContextProviderContent = ({
  displayType,
  containerType,
  children,
  commandMenuContextApi,
  isInPreviewMode,
}: CommandMenuContextProviderContentProps) => {
  const commandMenuItems = useAtomStateValue(commandMenuItemsSelector);
  const commandMenuItemsDraft = useAtomStateValue(commandMenuItemsDraftState);
  const currentPageLayoutId = useAtomStateValue(currentPageLayoutIdState);
  const pageLayoutIdFromContext = useContext(PageLayoutIdContext);
  const effectivePageLayoutId =
    pageLayoutIdFromContext === undefined
      ? currentPageLayoutId
      : pageLayoutIdFromContext;

  const filteredCommandMenuItems = useMemo(() => {
    const currentObjectMetadataItemId =
      commandMenuContextApi.objectMetadataItem.id;
    const hasSelectedRecords =
      commandMenuContextApi.numberOfSelectedRecords > 0;
    const commandMenuItemsToDisplay = isInPreviewMode
      ? (commandMenuItemsDraft ?? commandMenuItems)
      : commandMenuItems;

    return commandMenuItemsToDisplay
      .filter(
        doesCommandMenuItemMatchObjectMetadataId(currentObjectMetadataItemId),
      )
      .filter(doesCommandMenuItemMatchPageType(commandMenuContextApi.pageType))
      .filter(doesCommandMenuItemMatchSelectionState(hasSelectedRecords))
      .filter(doesCommandMenuItemMatchPageLayoutId(effectivePageLayoutId))
      .filter((item) =>
        evaluateConditionalAvailabilityExpression(
          item.conditionalAvailabilityExpression,
          commandMenuContextApi,
        ),
      )
      .sort(
        (firstItem, secondItem) => firstItem.position - secondItem.position,
      );
  }, [
    commandMenuContextApi,
    commandMenuItems,
    commandMenuItemsDraft,
    effectivePageLayoutId,
    isInPreviewMode,
  ]);

  return (
    <CommandMenuContext.Provider
      value={{
        displayType,
        containerType,
        commandMenuItems: filteredCommandMenuItems,
        commandMenuContextApi,
        isInPreviewMode,
      }}
    >
      {children}
    </CommandMenuContext.Provider>
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Command Menu Context Filtering 패턴을 실제 호출부에서 조합한다.

// Provider 사용
<CommandMenuContextProvider
  displayType="dropdownItem"
  containerType={CommandMenuItemContainerType.CommandMenuList}
>
  <CommandMenuItems />
</CommandMenuContextProvider>;

// Consumer 사용
import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { useContext } from 'react';

export const CommandMenuItems = () => {
  const { commandMenuItems, displayType } = useContext(CommandMenuContext);

  return commandMenuItems.map((commandMenuItem) => (
    <CommandMenuItem
      key={commandMenuItem.id}
      commandMenuItem={commandMenuItem}
      displayType={displayType}
    />
  ));
};
```
