# Stripe Promise/Payment Flow

Stripe publishable key를 cached promise로 로드하고, Elements form 안에서 setup/payment intent 확인까지 처리하는 패턴이다.

핵심은 `Cache Stripe loading outside render, confirm intents inside Elements`다.

## 1. 모듈 코드

- `src/modules/settings/billing/utils/getStripePromise.ts`: publishable key별 Stripe promise를 memoize하고 실패한 promise는 제거해 재시도 가능하게 한다.
- `src/modules/settings/billing/hooks/useStripePromise.ts`: billing config의 publishable key가 있을 때만 Stripe promise를 반환한다.
- `src/modules/settings/billing/components/AddPaymentMethodForm.tsx`: Elements provider, PaymentElement, setup intent 생성, `confirmSetup` flow를 묶는다.
- `src/modules/settings/billing/hooks/useSubmitSubscriptionPayment.ts`: subscription payment/setup intent 생성 후 Stripe confirm API로 제출한다.

```tsx
// 큰 흐름: Stripe publishable key를 cached promise로 로드하고, Elements form 안에서 setup/payment intent 확인까지 처리하는 패턴이다.
// 핵심 기준: `Cache Stripe loading outside render, confirm intents inside Elements`다.

// filepath: src/modules/settings/billing/utils/getStripePromise.ts
import { type Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { isDefined } from 'twenty-shared/utils';

const stripePromiseByKey = new Map<string, Promise<Stripe | null>>();

export const getStripePromise = (
  publishableKey: string,
): Promise<Stripe | null> => {
  const existingPromise = stripePromiseByKey.get(publishableKey);

  if (isDefined(existingPromise)) {
    return existingPromise;
  }

  const stripePromise = loadStripe(publishableKey);

  stripePromiseByKey.set(publishableKey, stripePromise);

  // Drop failed loads so a later call can retry
  stripePromise.catch(() => {
    stripePromiseByKey.delete(publishableKey);
  });

  return stripePromise;
};

// filepath: src/modules/settings/billing/hooks/useStripePromise.ts
import { billingState } from '@/client-config/states/billingState';
import { getStripePromise } from '@/settings/billing/utils/getStripePromise';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isNonEmptyString } from '@sniptt/guards';
import { type Stripe } from '@stripe/stripe-js';

export const useStripePromise = (): Promise<Stripe | null> | null => {
  const billing = useAtomStateValue(billingState);
  const publishableKey = billing?.stripePublishableKey;

  return isNonEmptyString(publishableKey)
    ? getStripePromise(publishableKey)
    : null;
};

// filepath: src/modules/settings/billing/components/AddPaymentMethodForm.tsx
const AddPaymentMethodFormContent = ({
  finalRedirectPath,
  onPaymentMethodAdded,
}: AddPaymentMethodFormContentProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const customerEmail = useAtomStateValue(currentUserState)?.email;

  const [createBillingPaymentMethodSetupIntent] = useMutation(
    CreateBillingPaymentMethodSetupIntentDocument,
  );

  const isStripeReady = isDefined(stripe) && isDefined(elements);

  const buildReturnUrl = () => {
    const basePath =
      finalRedirectPath ?? `${location.pathname}${location.search}`;
    const returnUrl = new URL(basePath, window.location.origin);

    returnUrl.searchParams.set(
      START_SUBSCRIPTION_AFTER_PAYMENT_METHOD_QUERY_PARAM,
      'true',
    );

    return returnUrl.toString();
  };

  const handleSubmit = async () => {
    if (!isStripeReady) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: submitError } = await elements.submit();
      if (isDefined(submitError)) {
        enqueueErrorSnackBar({
          message:
            submitError.message ??
            t`Your payment details are incomplete. Please review and retry.`,
        });
        setIsSubmitting(false);
        return;
      }

      const { data } = await createBillingPaymentMethodSetupIntent();
      const clientSecret =
        data?.createBillingPaymentMethodSetupIntent?.clientSecret;

      if (!isDefined(clientSecret)) {
        enqueueErrorSnackBar({
          message: t`Subscription error. Please retry or contact Twenty team`,
        });
        setIsSubmitting(false);
        return;
      }

      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        clientSecret,
        confirmParams: { return_url: buildReturnUrl() },
        redirect: 'if_required',
      });

      if (isDefined(error)) {
        enqueueErrorSnackBar({
          message:
            error.message ??
            t`We couldn't confirm your payment method. Please retry.`,
        });
        setIsSubmitting(false);
        return;
      }

      if (setupIntent?.status === 'succeeded') {
        await onPaymentMethodAdded();
      }
    } catch (error) {
      if (CombinedGraphQLErrors.is(error)) {
        enqueueErrorSnackBar({ apolloError: error });
      } else {
        enqueueErrorSnackBar({
          message: t`Subscription error. Please retry or contact Twenty team`,
        });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <StyledFormContainer>
      <PaymentElement
        options={{
          defaultValues: isDefined(customerEmail)
            ? { billingDetails: { email: customerEmail } }
            : undefined,
        }}
      />
      <Button
        title={t`Add credit card`}
        onClick={handleSubmit}
        isLoading={isSubmitting}
        disabled={!isStripeReady || isSubmitting}
      />
    </StyledFormContainer>
  );
};

export const AddPaymentMethodForm = ({
  finalRedirectPath,
  onPaymentMethodAdded,
}: AddPaymentMethodFormProps) => {
  const stripePromise = useStripePromise();
  const appearance = useStripeAppearance();

  if (!isDefined(stripePromise)) {
    return <Info accent="danger" text={t`Card payment is currently unavailable.`} />;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ mode: 'setup', currency: 'usd', appearance }}
    >
      <AddPaymentMethodFormContent
        finalRedirectPath={finalRedirectPath}
        onPaymentMethodAdded={onPaymentMethodAdded}
      />
    </Elements>
  );
};

// filepath: src/modules/settings/billing/hooks/useSubmitSubscriptionPayment.ts
export const useSubmitSubscriptionPayment = ({
  plan,
  recurringInterval,
}: UseSubmitSubscriptionPaymentParams) => {
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSubscriptionPaymentIntent] = useMutation(
    CreateSubscriptionPaymentIntentDocument,
  );

  const isStripeReady = isDefined(stripe) && isDefined(elements);

  const submit = async () => {
    if (!isDefined(stripe) || !isDefined(elements)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: submitError } = await elements.submit();
      if (isDefined(submitError)) {
        enqueueErrorSnackBar({
          message:
            submitError.message ??
            t`Your payment details are incomplete. Please review and retry.`,
        });
        setIsSubmitting(false);
        return;
      }

      const idempotencyKey = crypto.randomUUID();
      const { data } = await createSubscriptionPaymentIntent({
        variables: { recurringInterval, plan, idempotencyKey },
      });

      const paymentIntent = data?.createSubscriptionPaymentIntent;
      if (!isDefined(paymentIntent?.clientSecret)) {
        enqueueErrorSnackBar({
          message: t`Subscription error. Please retry or contact Twenty team`,
        });
        setIsSubmitting(false);
        return;
      }

      const returnUrl = new URL(
        AppPath.PlanRequiredSuccess,
        window.location.origin,
      ).toString();

      const { error } =
        paymentIntent.paymentIntentType === 'setup'
          ? await stripe.confirmSetup({
              elements,
              clientSecret: paymentIntent.clientSecret,
              confirmParams: { return_url: returnUrl },
            })
          : await stripe.confirmPayment({
              elements,
              clientSecret: paymentIntent.clientSecret,
              confirmParams: { return_url: returnUrl },
            });

      if (isDefined(error)) {
        enqueueErrorSnackBar({
          message:
            error.message ??
            t`We couldn't confirm your payment method. Please retry.`,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      if (CombinedGraphQLErrors.is(error)) {
        enqueueErrorSnackBar({ apolloError: error });
      } else {
        enqueueErrorSnackBar({
          message: t`Subscription error. Please retry or contact Twenty team`,
        });
      }
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, isStripeReady };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Stripe Promise/Payment Flow 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/settings/billing/components/AddCreditCardModal.tsx
import { AddPaymentMethodForm } from '@/settings/billing/components/AddPaymentMethodForm';
import { ModalStatefulWrapper } from '@/ui/layout/modal/components/ModalStatefulWrapper';
import { useModal } from '@/ui/layout/modal/hooks/useModal';

type AddCreditCardModalProps = {
  modalInstanceId: string;
  finalRedirectPath?: string;
  onPaymentMethodAdded: () => Promise<void>;
};

export const AddCreditCardModal = ({
  modalInstanceId,
  finalRedirectPath,
  onPaymentMethodAdded,
}: AddCreditCardModalProps) => {
  const { closeModal } = useModal();

  // Close only after activation so the form keeps its loading state visible
  const handlePaymentMethodAdded = async () => {
    await onPaymentMethodAdded();
    closeModal(modalInstanceId);
  };

  return (
    <ModalStatefulWrapper modalInstanceId={modalInstanceId}>
      <AddPaymentMethodForm
        finalRedirectPath={finalRedirectPath}
        onPaymentMethodAdded={handlePaymentMethodAdded}
      />
    </ModalStatefulWrapper>
  );
};
```
