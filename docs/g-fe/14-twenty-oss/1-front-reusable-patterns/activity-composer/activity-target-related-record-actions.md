# Activity Target Related Record Actions

Record context에서 task, note, file, email, calendar action을 같은 action binding 형태로 수집하는 패턴이다.

핵심은 `each feature owns its availability and execution, the menu only renders bindings`이다.

## 1. 모듈 코드

- `src/modules/activities/types/RelatedRecordAction.ts`: 관련 record action의 공통 UI/execute contract를 정의한다.
- `src/modules/activities/hooks/useRelatedRecordActions.ts`: feature별 action hook을 호출해 action binding 배열로 모은다.
- `src/modules/activities/hooks/useCreateActivityRelatedRecordAction.ts`: task/note 생성 action을 activity create hook에 연결한다.
- `src/modules/activities/files/hooks/useAttachFileRelatedRecordAction.tsx`: hidden file input support element와 attach action을 함께 반환한다.
- `src/modules/activities/emails/hooks/useComposeEmailRelatedRecordAction.ts`: permission과 default recipient resolution을 compose email action으로 감싼다.
- `src/modules/activities/calendar/hooks/useComposeCalendarEventRelatedRecordAction.ts`: calendar account/recipient 상태를 disabled reason까지 포함한 action으로 감싼다.

```tsx
// 큰 흐름: Record context에서 task, note, file, email, calendar action을 같은 action binding 형태로 수집하는 패턴이다.
// 핵심 기준: `each feature owns its availability and execution, the menu only renders bindings`이다.

// filepath: src/modules/activities/types/RelatedRecordAction.ts
import { type ReactNode } from 'react';
import { type IconComponent } from 'twenty-ui/icon';

export type RelatedRecordAction = {
  id:
    | 'create-task'
    | 'create-note'
    | 'attach-file'
    | 'compose-email'
    | 'create-calendar-event';
  label: string;
  Icon: IconComponent;
  isVisible: boolean;
  disabled: boolean;
  disabledReason?: string;
  execute: () => void;
};

export type RelatedRecordActionBinding = {
  action: RelatedRecordAction;
  supportElement?: ReactNode;
};

// filepath: src/modules/activities/hooks/useRelatedRecordActions.ts
export const useRelatedRecordActions = ({
  targetRecord,
  onFileUploadComplete,
}: UseRelatedRecordActionsParams): RelatedRecordActionBinding[] => {
  const taskAction = useCreateActivityRelatedRecordAction({
    targetRecord,
    activityObjectNameSingular: CoreObjectNameSingular.Task,
  });
  const noteAction = useCreateActivityRelatedRecordAction({
    targetRecord,
    activityObjectNameSingular: CoreObjectNameSingular.Note,
  });
  const fileAction = useAttachFileRelatedRecordAction({
    targetRecord,
    onUploadComplete: onFileUploadComplete,
  });
  const emailAction = useComposeEmailRelatedRecordAction({ targetRecord });
  const calendarEventAction =
    useComposeCalendarEventRelatedRecordAction(targetRecord);

  return [taskAction, noteAction, fileAction, emailAction, calendarEventAction];
};

// filepath: src/modules/activities/hooks/useCreateActivityRelatedRecordAction.ts
export const useCreateActivityRelatedRecordAction = ({
  targetRecord,
  activityObjectNameSingular,
}: UseCreateActivityRelatedRecordActionParams): RelatedRecordActionBinding => {
  const { canCreateActivity, createActivity } =
    useCreateActivityForTargetRecord({
      targetRecord,
      activityObjectNameSingular,
    });

  const isTask = activityObjectNameSingular === CoreObjectNameSingular.Task;

  return {
    action: {
      id: isTask ? 'create-task' : 'create-note',
      label: isTask ? t`Create task` : t`Create note`,
      Icon: isTask ? IconCheckbox : IconNotes,
      isVisible: canCreateActivity,
      disabled: false,
      execute: createActivity,
    },
  };
};

// filepath: src/modules/activities/files/hooks/useAttachFileRelatedRecordAction.tsx
export const useAttachFileRelatedRecordAction = ({
  targetRecord,
  onUploadComplete,
}: UseAttachFileRelatedRecordActionParams): RelatedRecordActionBinding => {
  const { canUploadFiles } = useCanUploadAttachmentFiles(targetRecord);
  const inputFileRef = useRef<HTMLInputElement>(null);

  return {
    action: {
      id: 'attach-file',
      label: t`Attach file`,
      Icon: IconPaperclip,
      isVisible: canUploadFiles,
      disabled: false,
      execute: () => inputFileRef.current?.click(),
    },
    supportElement: (
      <AttachmentFileInput
        ref={inputFileRef}
        targetableObject={targetRecord}
        onUploadComplete={onUploadComplete}
      />
    ),
  };
};

// filepath: src/modules/activities/emails/hooks/useComposeEmailRelatedRecordAction.ts
export const useComposeEmailRelatedRecordAction = ({
  targetRecord,
  isPermissionGated = true,
}: UseComposeEmailRelatedRecordActionParams): RelatedRecordActionBinding => {
  const { openComposer, loading } =
    useComposeEmailForTargetRecord(targetRecord);
  const canComposeEmail = useHasPermissionFlag(
    PermissionFlagType.SEND_EMAIL_TOOL,
  );

  return {
    action: {
      id: 'compose-email',
      label: t`Compose email`,
      Icon: IconMail,
      isVisible: !isPermissionGated || canComposeEmail,
      disabled: loading,
      execute: openComposer,
    },
  };
};

// filepath: src/modules/activities/calendar/hooks/useComposeCalendarEventRelatedRecordAction.ts
export const useComposeCalendarEventRelatedRecordAction = (
  targetRecord: ActivityTargetableObject,
): RelatedRecordActionBinding => {
  const { openComposer, disabled, loading } =
    useComposeCalendarEventForTargetRecord(targetRecord);
  const canCreateCalendarEvent = useHasPermissionFlag(
    PermissionFlagType.CREATE_CALENDAR_EVENT_TOOL,
  );

  const disabledReason = (() => {
    if (!disabled || loading) {
      return undefined;
    }

    switch (targetRecord.targetObjectNameSingular) {
      case CoreObjectNameSingular.Person:
        return t`Add an email to this person first`;
      case CoreObjectNameSingular.Company:
        return t`Add a person with an email to this company first`;
      case CoreObjectNameSingular.Opportunity:
        return t`Add an email to the point of contact first`;
      default:
        return t`Calendar events cannot be linked to this record type`;
    }
  })();

  return {
    action: {
      id: 'create-calendar-event',
      label: t`Create calendar event`,
      Icon: IconCalendarEvent,
      isVisible: canCreateCalendarEvent,
      disabled,
      disabledReason,
      execute: openComposer,
    },
  };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Activity Target Related Record Actions 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/side-panel/pages/create-related-record/components/SidePanelCreateRelatedRecordPage.tsx
const actionBindings = useRelatedRecordActions({
  targetRecord,
  onFileUploadComplete: closeSidePanel,
});

const visibleActionBindings = actionBindings.filter(
  ({ action }) => action.isVisible,
);

return (
  <>
    {visibleActionBindings.map(({ action }) => (
      <MenuItem
        key={action.id}
        text={action.label}
        LeftIcon={action.Icon}
        disabled={action.disabled}
        onClick={action.execute}
      />
    ))}
    {visibleActionBindings.map(({ action, supportElement }) => (
      <Fragment key={`${action.id}-support`}>{supportElement}</Fragment>
    ))}
  </>
);

// filepath: src/modules/activities/emails/hooks/useComposeEmailForTargetRecord.ts
const openComposer = () => {
  if (!isDefined(connectedAccountId)) {
    navigateSettings(SettingsPath.NewAccount);
    return;
  }

  openComposeEmailInSidePanel({
    connectedAccountId,
    defaultTo,
    contextRecord: {
      objectNameSingular: targetRecord.targetObjectNameSingular,
      recordId: targetRecord.id,
    },
  });
};
```
