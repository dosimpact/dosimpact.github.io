# Email Composer State Hook

Email composer의 sender, recipients, content, attachments, validation, send action을 하나의 hook return contract로 묶는 패턴이다.

핵심은 `form component renders fields, state hook owns send readiness and mutation payload`다.

## 1. 모듈 코드

- `src/modules/activities/emails/hooks/useEmailComposerState.ts`: draft/default 값을 state로 초기화하고 send 가능 여부와 mutation payload를 계산한다.
- `src/modules/activities/emails/types/EmailComposerState.ts`: hook return type을 컴포넌트 props 타입으로 재사용한다.
- `src/modules/activities/emails/components/EmailComposerFields.tsx`: composer state contract를 받아 recipient field, subject, body, attachments UI에 연결한다.

```tsx
// filepath: src/modules/activities/emails/hooks/useEmailComposerState.ts
export const useEmailComposerState = ({
  connectedAccountId: initialConnectedAccountId,
  draftPrefill,
  defaultTo = '',
  defaultSubject = '',
  defaultInReplyTo,
  onSent,
}: UseEmailComposerStateArgs) => {
  const initialTo = draftPrefill?.to ?? defaultTo;
  const initialCc = draftPrefill?.cc ?? '';
  const initialBcc = draftPrefill?.bcc ?? '';
  const initialSubject = draftPrefill?.subject ?? defaultSubject;
  const initialBody = draftPrefill?.body ?? '';

  const [sender, setSender] = useState<ConnectedAccountSender>({
    connectedAccountId: initialConnectedAccountId,
  });
  const [previousConnectedAccountId, setPreviousConnectedAccountId] = useState(
    initialConnectedAccountId,
  );

  if (previousConnectedAccountId !== initialConnectedAccountId) {
    setPreviousConnectedAccountId(initialConnectedAccountId);
    setSender({ connectedAccountId: initialConnectedAccountId });
  }

  const { connectedAccountId, fromHandle } = sender;
  const [to, setTo] = useState<EmailRecipient[]>(() =>
    parseEmailRecipients(initialTo),
  );
  const [cc, setCc] = useState<EmailRecipient[]>(() =>
    parseEmailRecipients(initialCc),
  );
  const [bcc, setBcc] = useState<EmailRecipient[]>(() =>
    parseEmailRecipients(initialBcc),
  );
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [showCcBcc, setShowCcBcc] = useState(
    initialCc.length > 0 || initialBcc.length > 0,
  );
  const [files, setFiles] = useState<EmailAttachment[]>([]);

  const { sendEmail, loading } = useSendEmail();

  const recipientCount = to.length + cc.length + bcc.length;
  const exceedsRecipientLimit = recipientCount > MAX_EMAIL_RECIPIENTS;
  const hasInvalidRecipients = useMemo(
    () =>
      hasInvalidRecipient(to) ||
      hasInvalidRecipient(cc) ||
      hasInvalidRecipient(bcc),
    [to, cc, bcc],
  );

  const canSend =
    to.length > 0 &&
    connectedAccountId.length > 0 &&
    !loading &&
    !exceedsRecipientLimit &&
    !hasInvalidRecipients;

  const handleSend = useCallback(async () => {
    if (!canSend) {
      return;
    }

    const serializedCc = serializeEmailRecipients(cc);
    const serializedBcc = serializeEmailRecipients(bcc);

    const { success, messageThreadId } = await sendEmail({
      connectedAccountId,
      fromHandle,
      to: serializeEmailRecipients(to),
      cc: serializedCc || undefined,
      bcc: serializedBcc || undefined,
      subject,
      body,
      inReplyTo: defaultInReplyTo,
      draftMessageId: draftPrefill?.messageId,
      files: files.length > 0 ? files : undefined,
    });

    if (success) {
      onSent?.(messageThreadId);
    }
  }, [canSend, connectedAccountId, fromHandle, to, cc, bcc, subject, body]);

  return {
    connectedAccountId,
    fromHandle,
    setSender,
    to,
    setTo,
    cc,
    setCc,
    bcc,
    setBcc,
    subject,
    setSubject,
    body,
    setBody,
    showCcBcc,
    setShowCcBcc,
    files,
    setFiles,
    handleSend,
    loading,
    canSend,
    initialSubject,
    initialBody,
    recipientCount,
    exceedsRecipientLimit,
    maxRecipients: MAX_EMAIL_RECIPIENTS,
  };
};

// filepath: src/modules/activities/emails/types/EmailComposerState.ts
import { type useEmailComposerState } from '@/activities/emails/hooks/useEmailComposerState';

export type EmailComposerState = ReturnType<typeof useEmailComposerState>;

// filepath: src/modules/activities/emails/components/EmailComposerFields.tsx
type EmailComposerFieldsProps = {
  composerState: EmailComposerState;
  contextRecord?: EmailComposerContextRecord | null;
  onAttachFiles?: () => void;
};

export const EmailComposerFields = ({
  composerState,
  contextRecord,
  onAttachFiles,
}: EmailComposerFieldsProps) => {
  const recipientsByFieldId: EmailRecipientsByFieldId = {
    to: composerState.to,
    cc: composerState.cc,
    bcc: composerState.bcc,
  };

  const handleRecipientsByFieldIdChange = (
    nextRecipientsByFieldId: EmailRecipientsByFieldId,
  ) => {
    composerState.setTo(nextRecipientsByFieldId.to);
    composerState.setCc(nextRecipientsByFieldId.cc);
    composerState.setBcc(nextRecipientsByFieldId.bcc);

    if (
      nextRecipientsByFieldId.cc.length > 0 ||
      nextRecipientsByFieldId.bcc.length > 0
    ) {
      composerState.setShowCcBcc(true);
    }
  };

  return (
    <>
      <EmailRecipientsFieldInput
        fieldId="to"
        recipients={composerState.to}
        onChange={composerState.setTo}
        onSubmit={composerState.handleSend}
        contextRecord={contextRecord}
      />
      {composerState.showCcBcc && (
        <>
          <EmailRecipientsFieldInput
            fieldId="cc"
            recipients={composerState.cc}
            onChange={composerState.setCc}
            onSubmit={composerState.handleSend}
            contextRecord={contextRecord}
          />
          <EmailRecipientsFieldInput
            fieldId="bcc"
            recipients={composerState.bcc}
            onChange={composerState.setBcc}
            onSubmit={composerState.handleSend}
            contextRecord={contextRecord}
          />
        </>
      )}
      <StyledComposerTextInput
        defaultValue={composerState.initialSubject}
        onChange={(event) => composerState.setSubject(event.target.value)}
      />
      <FormAdvancedTextFieldInput
        defaultValue={composerState.initialBody}
        onChange={composerState.setBody}
        onImageUpload={uploadEmailImage}
      />
      {composerState.files.length > 0 && (
        <EmailAttachmentsField
          files={composerState.files}
          onChange={composerState.setFiles}
        />
      )}
    </>
  );
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/side-panel/pages/compose-email/components/SidePanelComposeEmailPage.tsx
const composerState = useEmailComposerState({
  connectedAccountId: composeEmailConnectedAccountId ?? '',
  defaultTo: composeEmailDefaultTo ?? '',
  defaultSubject: composeEmailDefaultSubject ?? '',
  defaultInReplyTo: composeEmailDefaultInReplyTo ?? undefined,
  onSent: goBackFromSidePanel,
});

const { openAttachmentPicker, isUploadingAttachments } = useAttachEmailFiles({
  onFilesAttached: composerState.setFiles,
});

const canSend = composerState.canSend && !isUploadingAttachments;

return (
  <>
    <EmailComposerFields
      composerState={composerState}
      contextRecord={composeEmailContextRecord}
    />
    <Button
      title={t`Send`}
      Icon={IconSend}
      onClick={composerState.handleSend}
      disabled={!canSend}
    />
    <IconButton
      Icon={IconPaperclip}
      ariaLabel={t`Attach files`}
      onClick={openAttachmentPicker}
    />
  </>
);

// filepath: src/modules/page-layout/widgets/email-thread/components/EmailThreadComposer.tsx
const composerState = useEmailComposerState({
  connectedAccountId: replyContext.connectedAccountId,
  draftPrefill,
  defaultTo: replyContext.to,
  defaultSubject: replyContext.subject,
  defaultInReplyTo: replyContext.inReplyTo,
  onSent: handleReplySent,
});

return (
  <>
    <EmailComposerFields
      composerState={composerState}
      contextRecord={contextRecord}
      onAttachFiles={openAttachmentPicker}
    />
    <Button
      title={t`Send`}
      onClick={composerState.handleSend}
      disabled={!composerState.canSend}
    />
  </>
);
```
