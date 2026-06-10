import type {
  LangChainMessage,
  LangChainMessageChunk,
  LangChainToolCallChunk,
  MessageContentText,
} from "./types";
import { parsePartialJsonObject } from "assistant-stream/utils";

// tool_call_chunk의 부분 JSON 문자열을 assistant-ui가 렌더링할 수 있는 tool_call 형태로 정규화합니다.
const chunkToToolCall = (chunk: LangChainToolCallChunk) => {
  const partialJson = chunk.args ?? chunk.args_json ?? "";
  return {
    ...chunk,
    partial_json: partialJson,
    args: parsePartialJsonObject(partialJson) ?? {},
  };
};

/**
 * Merges an AIMessageChunk into a previous message. Chunks must have
 * `type: "AIMessageChunk"` — JS LangGraph servers send `type: "ai"`,
 * so callers should normalize the type before passing chunks here.
 */
export const appendLangChainChunk = (
  prev: LangChainMessage | undefined,
  curr: LangChainMessage | LangChainMessageChunk,
): LangChainMessage => {
  // 완성 메시지는 병합 대상이 아니므로 그대로 최신 상태로 사용합니다.
  if (curr.type !== "AIMessageChunk") {
    return curr;
  }

  // 첫 chunk가 도착했거나 이전 메시지가 AI 메시지가 아니면 chunk를 AI 메시지 골격으로 승격합니다.
  if (!prev || prev.type !== "ai") {
    const toolCalls = (curr.tool_call_chunks ?? []).map(chunkToToolCall);
    return {
      ...curr,
      type: curr.type.replace("MessageChunk", "").toLowerCase(),
      tool_call_chunks: undefined,
      ...(toolCalls.length > 0 && { tool_calls: toolCalls }),
    } as LangChainMessage;
  }

  const newContent =
    typeof prev.content === "string"
      ? [{ type: "text" as const, text: prev.content }]
      : [...prev.content];

  // 텍스트 chunk는 마지막 텍스트 블록에 이어 붙이고, 이미지 블록은 새 파트로 추가합니다.
  if (typeof curr?.content === "string") {
    const lastIndex = newContent.length - 1;
    if (newContent[lastIndex]?.type === "text") {
      (newContent[lastIndex] as MessageContentText).text =
        (newContent[lastIndex] as MessageContentText).text + curr.content;
    } else {
      newContent.push({ type: "text", text: curr.content });
    }
  } else if (Array.isArray(curr.content)) {
    const lastIndex = newContent.length - 1;
    for (const item of curr.content) {
      if (!("type" in item)) {
        continue;
      }

      if (item.type === "text") {
        if (newContent[lastIndex]?.type === "text") {
          (newContent[lastIndex] as MessageContentText).text =
            (newContent[lastIndex] as MessageContentText).text + item.text;
        } else {
          newContent.push({ type: "text", text: item.text });
        }
      } else if (item.type === "image_url") {
        newContent.push(item);
      }
    }
  }

  const newToolCalls = [...(prev.tool_calls ?? [])];
  // tool call args는 스트리밍 중 부분 JSON으로 들어오므로 id 또는 index 기준으로 같은 호출을 찾아 누적합니다.
  for (const chunk of curr.tool_call_chunks ?? []) {
    let idx = newToolCalls.findIndex(
      (tc) => tc.id != null && tc.id !== "" && tc.id === chunk.id,
    );
    if (idx === -1 && chunk.index != null) {
      idx = newToolCalls.findIndex(
        (tc) => tc.index === chunk.index && (!tc.id || !chunk.id),
      );
    }
    if (idx === -1) {
      newToolCalls.push(chunkToToolCall(chunk));
    } else {
      const existing = newToolCalls[idx]!;
      const partialJson =
        (existing.partial_json ?? "") + (chunk.args ?? chunk.args_json ?? "");
      newToolCalls[idx] = {
        ...chunk,
        ...existing,
        id: existing.id || chunk.id,
        partial_json: partialJson,
        args:
          parsePartialJsonObject(partialJson) ??
          ("args" in existing ? existing.args : {}),
      };
    }
  }

  return {
    ...prev,
    content: newContent,
    tool_calls: newToolCalls,
  };
};
