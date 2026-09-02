# Data Model Select Option Bulk Parser

Select option list와 textarea bulk input을 서로 변환하면서 기존 option metadata를 보존하는 패턴이다.

핵심은 `Parse labels, preserve matching option identity`다.

## 1. 모듈 코드

- `src/modules/settings/data-model/fields/forms/select/utils/convertBulkTextToOptions.ts`: 줄 단위 label을 option 배열로 바꾸고 같은 label의 기존 option은 id/color/value를 재사용한다.
- `src/modules/settings/data-model/fields/forms/select/utils/convertOptionsToBulkText.ts`: option 배열을 textarea용 줄 단위 텍스트로 바꾼다.
- `src/modules/settings/data-model/fields/forms/select/utils/generateNewSelectOption.ts`: 새 option의 id, color, value, position을 생성한다.
- `src/modules/settings/data-model/fields/forms/select/components/SettingsDataModelFieldSelectForm.tsx`: dropdown으로 single/bulk mode를 전환하고 textarea 변경을 form state에 반영한다.

```tsx
// 큰 흐름: Select option list와 textarea bulk input을 서로 변환하면서 기존 option metadata를 보존하는 패턴이다.
// 핵심 기준: `Parse labels, preserve matching option identity`다.

// filepath: src/modules/settings/data-model/fields/forms/select/utils/convertBulkTextToOptions.ts
import { isDefined } from 'twenty-shared/utils';

import { type FieldMetadataItemOption } from '@/object-metadata/types/FieldMetadataItem';
import { generateNewSelectOption } from '@/settings/data-model/fields/forms/select/utils/generateNewSelectOption';

export const convertBulkTextToOptions = (
  text: string,
  currentOptions: FieldMetadataItemOption[],
): FieldMetadataItemOption[] => {
  const parsedBulkTextOptions = text
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const newBulkSelectOptions: FieldMetadataItemOption[] = [];

  for (
    let optionIndex = 0;
    optionIndex < parsedBulkTextOptions.length;
    optionIndex++
  ) {
    const label = parsedBulkTextOptions[optionIndex];

    // try to find an existing option with the same label, so we can keep its id, color, value, and label
    const existingOption = currentOptions.find(
      (option) => option.label.toLowerCase() === label.toLowerCase(),
    );

    if (isDefined(existingOption)) {
      // reuse existing option meta (including original label), just update position
      newBulkSelectOptions.push({
        ...existingOption,
        position: optionIndex,
      });
    } else {
      newBulkSelectOptions.push({
        ...generateNewSelectOption(newBulkSelectOptions, label),
        position: optionIndex,
      });
    }
  }

  return newBulkSelectOptions;
};

// filepath: src/modules/settings/data-model/fields/forms/select/utils/convertOptionsToBulkText.ts
import { type FieldMetadataItemOption } from '@/object-metadata/types/FieldMetadataItem';

export const convertOptionsToBulkText = (
  options: FieldMetadataItemOption[],
): string => {
  return options.map((option) => option.label).join('\n');
};

// filepath: src/modules/settings/data-model/fields/forms/select/utils/generateNewSelectOption.ts
import { v4 } from 'uuid';

import { type FieldMetadataItemOption } from '@/object-metadata/types/FieldMetadataItem';
import { generateNewSelectOptionLabel } from '@/settings/data-model/fields/forms/select/utils/generateNewSelectOptionLabel';
import { MAIN_COLOR_NAMES } from 'twenty-ui/theme';
import { getNextThemeColor } from 'twenty-ui/theme-constants';
import { computeOptionValueFromLabel } from '~/pages/settings/data-model/utils/computeOptionValueFromLabel';

export const generateNewSelectOption = (
  options: FieldMetadataItemOption[],
  label?: string,
): FieldMetadataItemOption => {
  const newOptionLabel = label ?? generateNewSelectOptionLabel(options);

  return {
    color: getNextThemeColor(
      MAIN_COLOR_NAMES,
      options[options.length - 1]?.color,
    ),
    id: v4(),
    label: newOptionLabel,
    position: options.length,
    value: computeOptionValueFromLabel(newOptionLabel),
  };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Data Model Select Option Bulk Parser 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/settings/data-model/fields/forms/select/components/SettingsDataModelFieldSelectForm.tsx
import { convertBulkTextToOptions } from '@/settings/data-model/fields/forms/select/utils/convertBulkTextToOptions';
import { convertOptionsToBulkText } from '@/settings/data-model/fields/forms/select/utils/convertOptionsToBulkText';
import { TextArea } from '@/ui/input/components/TextArea';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const SettingsDataModelFieldSelectForm = ({ disabled = false }) => {
  const { control } = useFormContext<SettingsDataModelFieldSelectFormValues>();
  const [isBulkInputMode, setIsBulkInputMode] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');

  const OPTIONS_DROPDOWN_ID =
    'settings-data-model-field-select-options-dropdown';
  const { closeDropdown: closeOptionsDropdown } = useCloseDropdown();

  return (
    <Controller
      name="options"
      control={control}
      render={({ field: { onChange, value: options } }) => (
        <>
          <Dropdown
            dropdownId={OPTIONS_DROPDOWN_ID}
            dropdownComponents={
              <MenuItem
                text={isBulkInputMode ? 'Single edit' : 'Bulk edit'}
                onClick={() => {
                  if (!isBulkInputMode) {
                    setBulkInputText(convertOptionsToBulkText(options));
                  }
                  setIsBulkInputMode((currentInputMode) => !currentInputMode);
                  closeOptionsDropdown(OPTIONS_DROPDOWN_ID);
                }}
              />
            }
          />

          {isBulkInputMode && (
            <TextArea
              textAreaId="bulk-options-input"
              placeholder="Enter one option per line"
              value={bulkInputText}
              onChange={(nextOptionAsText) => {
                if (disabled) {
                  return;
                }

                const nextOptions = convertBulkTextToOptions(
                  nextOptionAsText,
                  options,
                );

                onChange(nextOptions);
                setBulkInputText(nextOptionAsText);
              }}
              minRows={5}
              maxRows={15}
              disabled={disabled}
            />
          )}
        </>
      )}
    />
  );
};
```
