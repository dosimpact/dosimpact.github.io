import type {
  LangChainMessage,
  LangChainMessageChunk,
  LangChainToolCallChunk,
} from "./types";

// LangGraph messages tuple 이벤트는 서버/버전에 따라 type과 tool_call_chunk 모양이 조금씩 다릅니다.
// 이 파일은 이후 병합 로직이 처리하기 쉽도록 chunk와 완성 메시지를 한 가지 형태로 정리합니다.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object";

const normalizeToolCallChunk = (
  value: unknown,
): LangChainToolCallChunk | null => {
  // index가 없는 값은 스트리밍 tool call chunk로 식별하기 어렵기 때문에 버립니다.
  if (!isRecord(value)) return null;
  if (typeof value.index !== "number") return null;

  const id = typeof value.id === "string" ? value.id : "";
  const name = typeof value.name === "string" ? value.name : "";

  const args =
    typeof value.args === "string"
      ? value.args
      : typeof value.args_json === "string"
        ? value.args_json
        : "";

  return {
    ...(value as LangChainToolCallChunk),
    id,
    name,
    args,
  };
};

const normalizeLangChainMessageChunk = (
  value: Record<string, unknown>,
): LangChainMessageChunk | null => {
  // JS LangGraph 서버가 "ai"로 보내는 chunk도 내부에서는 AIMessageChunk로 통일합니다.
  if (value.type !== "AIMessageChunk" && value.type !== "ai") return null;
  if (value.id !== undefined && typeof value.id !== "string") return null;
  if (
    value.content !== undefined &&
    typeof value.content !== "string" &&
    !Array.isArray(value.content)
  ) {
    return null;
  }
  if (
    value.tool_call_chunks !== undefined &&
    !Array.isArray(value.tool_call_chunks)
  ) {
    return null;
  }

  const normalizedToolCallChunks = value.tool_call_chunks?.flatMap((chunk) => {
    const normalized = normalizeToolCallChunk(chunk);
    return normalized ? [normalized] : [];
  });

  return {
    ...(value as LangChainMessageChunk),
    type: "AIMessageChunk",
    ...(normalizedToolCallChunks && {
      tool_call_chunks: normalizedToolCallChunks,
    }),
  };
};

const isLangChainMessage = (
  value: Record<string, unknown>,
): value is LangChainMessage => {
  return (
    value.type === "system" ||
    value.type === "human" ||
    value.type === "tool" ||
    value.type === "ai"
  );
};

export type NormalizedLangGraphTupleMessage =
  | {
      kind: "chunk";
      message: LangChainMessageChunk;
    }
  | {
      kind: "message";
      message: LangChainMessage;
    };

export const normalizeLangGraphTupleMessage = (
  value: unknown,
): NormalizedLangGraphTupleMessage | null => {
  // chunk를 먼저 판별해야 "ai" type chunk가 완성 AI 메시지로 오인되지 않습니다.
  if (!isRecord(value)) return null;

  const normalizedChunk = normalizeLangChainMessageChunk(value);
  if (normalizedChunk) {
    return {
      kind: "chunk",
      message: normalizedChunk,
    };
  }

  if (isLangChainMessage(value)) {
    return {
      kind: "message",
      message: value,
    };
  }

  return null;
};
