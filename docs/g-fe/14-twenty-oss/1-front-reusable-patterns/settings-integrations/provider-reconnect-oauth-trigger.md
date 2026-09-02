# Provider Reconnect OAuth Trigger

Connected account provider에 따라 local settings route 또는 external OAuth redirect를 선택하는 reconnect trigger 패턴이다.

핵심은 `Normalize reconnect intent before provider-specific navigation`이다.

## 1. 모듈 코드

- `src/modules/settings/accounts/hooks/useTriggerProviderReconnect.ts`: IMAP/SMTP/CALDAV는 settings route로, OAuth provider는 OAuth trigger로 분기한다.
- `src/modules/settings/accounts/hooks/useTriggerApiOAuth.ts`: transient token을 발급하고 provider별 auth endpoint로 redirect한다.
- `src/modules/settings/accounts/components/SettingsAccountsRowDropdownMenu.tsx`: account 상태에서 reconnect 메뉴를 노출하고 hook을 호출한다.

```tsx
// 큰 흐름: Connected account provider에 따라 local settings route 또는 external OAuth redirect를 선택하는 reconnect trigger 패턴이다.
// 핵심 기준: `Normalize reconnect intent before provider-specific navigation`이다.

// filepath: src/modules/settings/accounts/hooks/useTriggerProviderReconnect.ts
import { useCallback } from 'react';
import { ConnectedAccountProvider, SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';

import { useTriggerApisOAuth } from '@/settings/accounts/hooks/useTriggerApiOAuth';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const useTriggerProviderReconnect = () => {
  const { triggerApisOAuth } = useTriggerApisOAuth();
  const navigate = useNavigateSettings();

  const triggerProviderReconnect = useCallback(
    async (
      provider: ConnectedAccountProvider,
      accountId?: string,
      options?: Parameters<typeof triggerApisOAuth>[1],
    ) => {
      if (provider === ConnectedAccountProvider.IMAP_SMTP_CALDAV) {
        if (!accountId) {
          navigate(SettingsPath.NewImapSmtpCaldavConnection);
          return;
        }

        navigate(SettingsPath.EditImapSmtpCaldavConnection, {
          connectedAccountId: accountId,
        });
        return;
      }

      await triggerApisOAuth(provider, {
        ...options,
        redirectLocation: getSettingsPath(SettingsPath.Accounts),
      });
    },
    [triggerApisOAuth, navigate],
  );

  return { triggerProviderReconnect };
};

// filepath: src/modules/settings/accounts/hooks/useTriggerApiOAuth.ts
import { useMutation } from '@apollo/client/react';
import {
  type MessageChannelVisibility,
  type CalendarChannelVisibility,
} from '~/generated/graphql';
import { useCallback } from 'react';
import { type AppPath, ConnectedAccountProvider } from 'twenty-shared/types';

import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { CustomError } from 'twenty-shared/utils';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { GenerateTransientTokenDocument } from '~/generated-metadata/graphql';

const getProviderUrl = (provider: ConnectedAccountProvider) => {
  switch (provider) {
    case ConnectedAccountProvider.GOOGLE:
      return 'google-apis';
    case ConnectedAccountProvider.MICROSOFT:
      return 'microsoft-apis';
    default:
      throw new CustomError(
        `Provider ${provider} is not supported`,
        'UNSUPPORTED_PROVIDER',
      );
  }
};

export const useTriggerApisOAuth = () => {
  const [generateTransientToken] = useMutation(GenerateTransientTokenDocument);
  const { redirect } = useRedirect();

  const triggerApisOAuth = useCallback(
    async (
      provider: ConnectedAccountProvider,
      {
        redirectLocation,
        messageVisibility,
        calendarVisibility,
        loginHint,
        skipMessageChannelConfiguration,
      }: {
        redirectLocation?: AppPath | string;
        messageVisibility?: MessageChannelVisibility;
        calendarVisibility?: CalendarChannelVisibility;
        loginHint?: string;
        skipMessageChannelConfiguration?: boolean;
      } = {},
    ) => {
      const authServerUrl = REACT_APP_SERVER_BASE_URL;
      const transientToken = await generateTransientToken();
      const token =
        transientToken.data?.generateTransientToken.transientToken.token;

      let params = `transientToken=${token}`;

      params += redirectLocation
        ? `&redirectLocation=${encodeURIComponent(redirectLocation)}`
        : '';
      params += calendarVisibility
        ? `&calendarVisibility=${calendarVisibility}`
        : '';
      params += messageVisibility
        ? `&messageVisibility=${messageVisibility}`
        : '';
      params += loginHint ? `&loginHint=${loginHint}` : '';
      params += skipMessageChannelConfiguration
        ? `&skipMessageChannelConfiguration=${skipMessageChannelConfiguration}`
        : '';

      redirect(`${authServerUrl}/auth/${getProviderUrl(provider)}?${params}`);
    },
    [generateTransientToken, redirect],
  );

  return { triggerApisOAuth };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Provider Reconnect OAuth Trigger 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/settings/accounts/components/SettingsAccountsRowDropdownMenu.tsx
import { useTriggerProviderReconnect } from '@/settings/accounts/hooks/useTriggerProviderReconnect';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { ConnectedAccountProvider } from 'twenty-shared/types';
import { IconRefresh } from 'twenty-ui/icon';
import { MenuItem } from 'twenty-ui/navigation';

export const SettingsAccountsRowDropdownMenu = ({ account }) => {
  const dropdownId = `settings-account-row-${account.id}`;
  const { closeDropdown } = useCloseDropdown();
  const { triggerProviderReconnect } = useTriggerProviderReconnect();

  return (
    <Dropdown
      dropdownId={dropdownId}
      dropdownComponents={
        <>
          {account.authFailedAt && (
            <MenuItem
              LeftIcon={IconRefresh}
              text="Reconnect"
              onClick={() => {
                triggerProviderReconnect(account.provider, account.id);
                closeDropdown(dropdownId);
              }}
            />
          )}
          <MenuItem
            text="Reconnect Google"
            onClick={() => {
              triggerProviderReconnect(ConnectedAccountProvider.GOOGLE, account.id, {
                loginHint: account.handle,
              });
            }}
          />
        </>
      }
    />
  );
};
```
