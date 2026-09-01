# Email Recipient Parse/Merge/Serialize Pipeline

Email composer의 free text, chips, pasted addresses를 같은 recipient 배열 모델로 정규화하는 패턴이다.

핵심은 `parse at the edge, merge by normalized key, serialize only when sending`이다.

## 1. 모듈 코드

- `src/modules/activities/emails/recipients/utils/parseEmailRecipients.ts`: 줄바꿈과 address-list text를 `EmailRecipient[]`로 변환한다.
- `src/modules/activities/emails/recipients/utils/getEmailRecipientKey.ts`: address 비교용 normalized key를 만든다.
- `src/modules/activities/emails/recipients/utils/mergeEmailRecipients.ts`: 중복 recipient를 제거하고 display name upgrade와 duplicate feedback key를 계산한다.
- `src/modules/activities/emails/recipients/utils/serializeEmailRecipients.ts`: mutation에 넘길 comma-separated address string으로 되돌린다.
- `src/modules/activities/emails/recipients/hooks/useEmailRecipientsField.ts`: input commit, chip edit/delete/selection 상태를 recipient pipeline 위에 얹는다.

```tsx
// filepath: src/modules/activities/emails/recipients/utils/parseEmailRecipients.ts
import { isNonEmptyString } from '@sniptt/guards';
import { parseEmailAddressList } from 'twenty-shared/utils';

import { type EmailRecipient } from '@/activities/emails/recipients/types/EmailRecipient';

export const parseEmailRecipients = (rawText: string): EmailRecipient[] => {
  const normalizedText = rawText.replace(/\r?\n/g, ',');

  return parseEmailAddressList(normalizedText).map((parsedAddress) =>
    isNonEmptyString(parsedAddress.address)
      ? {
          address: parsedAddress.address,
          displayName: isNonEmptyString(parsedAddress.name)
            ? parsedAddress.name
            : undefined,
        }
      : { address: parsedAddress.name },
  );
};

// filepath: src/modules/activities/emails/recipients/utils/getEmailRecipientKey.ts
export const getEmailRecipientKey = (address: string): string =>
  address.trim().toLowerCase();

// filepath: src/modules/activities/emails/recipients/utils/mergeEmailRecipients.ts
import { isNonEmptyString } from '@sniptt/guards';

import { type EmailRecipient } from '@/activities/emails/recipients/types/EmailRecipient';
import { getEmailRecipientKey } from '@/activities/emails/recipients/utils/getEmailRecipientKey';
import { toSpliced } from '~/utils/array/toSpliced';

type MergeEmailRecipientsResult = {
  mergedRecipients: EmailRecipient[];
  duplicateKeys: string[];
};

export const mergeEmailRecipients = (
  baseRecipients: EmailRecipient[],
  addedRecipients: EmailRecipient[],
  insertAtIndex: number,
): MergeEmailRecipientsResult => {
  const baseRecipientKeys = new Set(
    baseRecipients.map((baseRecipient) =>
      getEmailRecipientKey(baseRecipient.address),
    ),
  );

  const uniqueAddedRecipients: EmailRecipient[] = [];
  const uniqueAddedRecipientsByKey = new Map<string, EmailRecipient>();
  const duplicateKeys: string[] = [];
  const displayNameUpgrades = new Map<string, string>();

  for (const addedRecipient of addedRecipients) {
    const recipientKey = getEmailRecipientKey(addedRecipient.address);

    if (baseRecipientKeys.has(recipientKey)) {
      duplicateKeys.push(recipientKey);

      if (isNonEmptyString(addedRecipient.displayName)) {
        displayNameUpgrades.set(recipientKey, addedRecipient.displayName);
      }
      continue;
    }

    const alreadyAddedRecipient = uniqueAddedRecipientsByKey.get(recipientKey);

    if (alreadyAddedRecipient !== undefined) {
      duplicateKeys.push(recipientKey);

      if (
        isNonEmptyString(addedRecipient.displayName) &&
        !isNonEmptyString(alreadyAddedRecipient.displayName)
      ) {
        alreadyAddedRecipient.displayName = addedRecipient.displayName;
      }
      continue;
    }

    const uniqueAddedRecipient = { ...addedRecipient };
    uniqueAddedRecipientsByKey.set(recipientKey, uniqueAddedRecipient);
    uniqueAddedRecipients.push(uniqueAddedRecipient);
  }

  const upgradedBaseRecipients = baseRecipients.map((baseRecipient) => {
    const upgradedDisplayName = displayNameUpgrades.get(
      getEmailRecipientKey(baseRecipient.address),
    );

    return upgradedDisplayName !== undefined &&
      !isNonEmptyString(baseRecipient.displayName)
      ? { ...baseRecipient, displayName: upgradedDisplayName }
      : baseRecipient;
  });

  return {
    mergedRecipients: toSpliced(
      upgradedBaseRecipients,
      insertAtIndex,
      0,
      ...uniqueAddedRecipients,
    ),
    duplicateKeys,
  };
};

// filepath: src/modules/activities/emails/recipients/utils/serializeEmailRecipients.ts
import { type EmailRecipient } from '@/activities/emails/recipients/types/EmailRecipient';

export const serializeEmailRecipients = (
  recipients: EmailRecipient[],
): string => recipients.map((recipient) => recipient.address).join(', ');

// filepath: src/modules/activities/emails/recipients/hooks/useEmailRecipientsField.ts
export const useEmailRecipientsField = ({
  recipients,
  onChange,
}: UseEmailRecipientsFieldArgs) => {
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [chipSelection, setChipSelection] = useState<ChipSelection | null>(
    null,
  );
  const [chipFlash, setChipFlash] = useState<ChipFlash | null>(null);

  const addRecipients = (
    addedRecipients: EmailRecipient[],
    replacedIndex: number | null,
  ) => {
    const baseRecipients =
      replacedIndex === null
        ? recipients
        : toSpliced(recipients, replacedIndex, 1);

    const { mergedRecipients, duplicateKeys } = mergeEmailRecipients(
      baseRecipients,
      addedRecipients,
      replacedIndex ?? baseRecipients.length,
    );

    onChange(mergedRecipients);

    const firstDuplicateKey = duplicateKeys[0];
    if (firstDuplicateKey !== undefined) {
      setChipFlash((previousFlash) => ({
        chipKey: firstDuplicateKey,
        nonce: (previousFlash?.nonce ?? 0) + 1,
      }));
    }
  };

  const commitRecipients = (committedRecipients: EmailRecipient[]) => {
    if (editingIndex !== null && committedRecipients.length === 0) {
      onChange(toSpliced(recipients, editingIndex, 1));
    } else if (committedRecipients.length > 0) {
      addRecipients(committedRecipients, editingIndex);
    }

    setEditingIndex(null);
    setInputValue('');
  };

  const commitInput = () => {
    commitRecipients(parseEmailRecipients(inputValue));
  };

  return {
    inputValue,
    setInputValue,
    editingIndex,
    chipSelection,
    chipFlash,
    commitInput,
    addRecipients,
    commitRecipients,
  };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/activities/emails/recipients/components/EmailRecipientsFieldInput.tsx
const {
  inputValue,
  setInputValue,
  commitInput,
  addRecipient,
  addRecipients,
  beginEditingChip,
  removeRecipientAtIndex,
} = useEmailRecipientsField({ recipients, onChange });

const handleInputPaste = (event: ClipboardEvent<HTMLInputElement>) => {
  const pastedText = event.clipboardData.getData('text/plain');
  const parsedRecipients = parseEmailRecipients(pastedText);

  const shouldCommitAsChips =
    parsedRecipients.length > 1 ||
    (parsedRecipients.length === 1 &&
      (isNonEmptyString(parsedRecipients[0].displayName) ||
        isValidEmailRecipientAddress(parsedRecipients[0].address)));

  if (!shouldCommitAsChips) {
    return;
  }

  event.preventDefault();
  addRecipients(parsedRecipients, null);
};

const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  switch (event.key) {
    case 'Enter':
    case 'Tab':
    case ',':
    case ';': {
      event.preventDefault();
      commitInput();
      return;
    }
  }
};

// filepath: src/modules/activities/emails/hooks/useEmailComposerState.ts
const [to, setTo] = useState<EmailRecipient[]>(() =>
  parseEmailRecipients(initialTo),
);

const handleSend = async () => {
  await sendEmail({
    connectedAccountId,
    to: serializeEmailRecipients(to),
    cc: serializeEmailRecipients(cc) || undefined,
    bcc: serializeEmailRecipients(bcc) || undefined,
    subject,
    body,
  });
};
```
