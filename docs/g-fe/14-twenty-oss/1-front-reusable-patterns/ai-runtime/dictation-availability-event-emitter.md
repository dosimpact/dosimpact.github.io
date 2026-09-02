# Dictation Availability/Event Emitter

Web Speech API 지원 여부를 surface probe로 판정하고, engine lifecycle은 작은 event emitter로 UI에 publish하는 패턴이다.

핵심은 `Capability detection gates construction, emitter events drive UI state`다.

## 1. 모듈 코드

- `src/modules/ai/dictation/hooks/useDictationAvailability.ts`: browser surface와 remembered silent failure를 조합해 dictation 버튼 노출 여부를 계산한다.
- `src/modules/ai/dictation/utils/readDictationSurface.ts`: iOS, standalone mode, third-party iOS browser, secure context, media devices, SpeechRecognition 존재 여부를 읽는다.
- `src/modules/ai/dictation/utils/resolveDictationAvailability.ts`: surface snapshot을 boolean availability로 변환한다.
- `src/modules/ai/dictation/utils/createDictationEventEmitter.ts`: engine event를 subscribe/emit/clear 하는 작은 emitter를 만든다.
- `src/modules/ai/dictation/engines/createWebSpeechDictationEngine.ts`: Web Speech recognizer lifecycle을 `start/stop/cancel/dispose/subscribe` 엔진으로 감싼다.
- `src/modules/ai/dictation/components/AiChatDictationEffect.tsx`: engine을 생성하고 events를 editor callbacks, recording state, snackbar로 연결한다.
- `src/modules/ai/dictation/hooks/useDictation.ts`: button이 사용할 `isAvailable/isRecording/toggleDictation` API만 노출한다.

```tsx
// 큰 흐름: Web Speech API 지원 여부를 surface probe로 판정하고, engine lifecycle은 작은 event emitter로 UI에 publish하는 패턴이다.
// 핵심 기준: `Capability detection gates construction, emitter events drive UI state`다.

// filepath: src/modules/ai/dictation/hooks/useDictationAvailability.ts
export const useDictationAvailability = (): boolean => {
  const hasWebSpeechProvenSilent = useAtomStateValue(
    hasWebSpeechProvenSilentState,
  );

  const isSurfaceCapable = useMemo(
    () => resolveDictationAvailability(readDictationSurface()),
    [],
  );

  return isSurfaceCapable && !hasWebSpeechProvenSilent;
};

// filepath: src/modules/ai/dictation/utils/readDictationSurface.ts
export const readDictationSurface = (): DictationSurface => {
  const userAgent = navigator.userAgent;

  return {
    isIOS: getIsIOS(userAgent),
    isStandaloneDisplayMode: getIsStandaloneDisplayMode(),
    isThirdPartyIOSBrowser: THIRD_PARTY_IOS_BROWSER_PATTERN.test(userAgent),
    hasSpeechRecognition: isDefined(getSpeechRecognitionConstructor()),
    hasMediaDevices: isDefined(navigator.mediaDevices?.getUserMedia),
    isSecureContext: window.isSecureContext,
  };
};

// filepath: src/modules/ai/dictation/utils/resolveDictationAvailability.ts
export const resolveDictationAvailability = (
  surface: DictationSurface,
): boolean =>
  surface.isSecureContext &&
  surface.hasSpeechRecognition &&
  surface.hasMediaDevices &&
  !(
    surface.isIOS &&
    (surface.isStandaloneDisplayMode || surface.isThirdPartyIOSBrowser)
  );

// filepath: src/modules/ai/dictation/utils/createDictationEventEmitter.ts
export const createDictationEventEmitter = (): DictationEventEmitter => {
  const listeners = new Set<DictationEngineListener>();

  return {
    emit: (event) => {
      for (const listener of Array.from(listeners)) {
        listener(event);
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    clear: () => {
      listeners.clear();
    },
  };
};

// filepath: src/modules/ai/dictation/engines/createWebSpeechDictationEngine.ts
export const createWebSpeechDictationEngine = ({
  isIOS,
  getLanguage,
}: {
  isIOS: boolean;
  getLanguage: () => string;
}): DictationEngine => {
  const emitter = createDictationEventEmitter();
  let recognition: WebSpeechRecognitionInstance | null = null;
  let isActive = false;
  let isRecognizerRunning = false;
  let sessionGeneration = 0;

  const buildRecognition = () => {
    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();

    if (!isDefined(SpeechRecognitionConstructor)) {
      return null;
    }

    const instance = new SpeechRecognitionConstructor();
    instance.continuous = !isIOS;
    instance.interimResults = true;
    instance.onresult = (event) => {
      const { finalText, interimText } = readTranscripts(event);

      if (isNonEmptyString(finalText)) {
        emitter.emit({ type: 'final', text: finalText });
      }

      emitter.emit({ type: 'interim', text: interimText });
    };
    instance.onerror = (event) => {
      const reason = mapSpeechRecognitionError(event.error);

      if (isDefined(reason)) {
        emitter.emit({ type: 'error', reason });
      }

      endSession();
    };
    instance.onend = () => {
      isRecognizerRunning = false;
      endSession();
    };

    return instance;
  };

  return {
    start: async () => {
      if (isActive) {
        return;
      }

      const generation = ++sessionGeneration;
      emitter.emit({ type: 'state', state: 'recording' });

      await warmUpMicrophone();

      if (generation !== sessionGeneration) {
        emitter.emit({ type: 'state', state: 'idle' });
        return;
      }

      recognition = recognition ?? buildRecognition();
      recognition.lang = getLanguage();
      recognition.start();
      isActive = true;
      isRecognizerRunning = true;
    },
    stop: () => requestSessionEnd('stop'),
    cancel: () => requestSessionEnd('abort'),
    dispose: () => {
      requestSessionEnd('abort', { evenWhenIdle: true });
      emitter.clear();
    },
    subscribe: emitter.subscribe,
  };
};

// filepath: src/modules/ai/dictation/components/AiChatDictationEffect.tsx
export const AiChatDictationEffect = ({ onInterimText, onFinalText }) => {
  const isSupported = useDictationAvailability();
  const [dictationEngine, setDictationEngine] =
    useAtomState(dictationEngineState);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const createdEngine = createWebSpeechDictationEngine({
      isIOS,
      getLanguage: () => getDictationLanguage(locale),
    });

    setDictationEngine(createdEngine);

    return () => {
      createdEngine.dispose();
      setDictationEngine(null);
    };
  }, [isSupported, isIOS, setDictationEngine]);

  useEffect(() => {
    if (!isDefined(dictationEngine)) {
      return;
    }

    return dictationEngine.subscribe((event) => {
      if (event.type === 'interim') onInterimText(event.text);
      if (event.type === 'final') onFinalText(event.text);
      if (event.type === 'state') setIsDictationRecording(event.state === 'recording');
      if (event.type === 'error') enqueueErrorSnackBar({ message });
    });
  }, [dictationEngine, onInterimText, onFinalText]);

  useListenToBrowserEvent({
    eventName: AGENT_CHAT_SEND_MESSAGE_EVENT_NAME,
    onBrowserEvent: () => dictationEngine?.cancel(),
  });

  return null;
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Dictation Availability/Event Emitter 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/ai/components/AiChatEditorSection.tsx
export const AiChatEditorSection = () => {
  const { editor } = useAiChatEditor();
  const insertDictatedText = useInsertDictatedText(editor);
  const [dictationInterimText, setDictationInterimText] = useState('');

  return (
    <>
      <AiChatDictationEffect
        onInterimText={setDictationInterimText}
        onFinalText={insertDictatedText}
      />
      <EditorContent editor={editor} />
      <AiChatDictationHint interimText={dictationInterimText} />
      <AiChatDictationButton />
    </>
  );
};

// filepath: src/modules/ai/dictation/components/AiChatDictationButton.tsx
export const AiChatDictationButton = () => {
  const { isAvailable, isRecording, toggleDictation } = useDictation();

  if (!isAvailable) {
    return null;
  }

  return (
    <IconButton
      Icon={isRecording ? IconMicrophoneOff : IconMicrophone}
      onClick={toggleDictation}
    />
  );
};
```
