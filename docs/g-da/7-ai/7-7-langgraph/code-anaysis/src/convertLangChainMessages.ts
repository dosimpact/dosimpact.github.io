"use client";

import type {
  DataMessagePart,
  MessageTiming,
  ThreadAssistantMessage,
  ThreadUserMessage,
  ToolCallMessagePart,
} from "@assistant-ui/core";
import type { useExternalMessageConverter } from "@assistant-ui/core/react";
import type {
  LangChainMessage,
  LangChainToolCall,
  LangChainToolCallChunk,
  UIMessage,
} from "./types";
import {
  parsePartialJsonObject,
  type ReadonlyJSONObject,
} from "assistant-stream/utils";

// LangChain/LangGraph 메시지를 assistant-ui ThreadMessage 형식으로 변환하는 파일입니다.
// content part, tool call, Generative UI, timing metadata를 assistant-ui가 렌더링 가능한 파트로 풀어냅니다.
type LangGraphMessageConverterMetadata =
  useExternalMessageConverter.Metadata & {
    toolArgsKeyOrderCache?: Map<string, Map<string, string[]>>;
    uiMessagesByParent?: Map<string, UIMessage[]>;
    messageTiming?: Record<string, MessageTiming>;
  };

const uiMessageToDataPart = (ui: UIMessage): DataMessagePart => ({
  type: "data",
  name: ui.name,
  data: ui.props,
});

const hasOwn = (value: object, key: string) => Object.hasOwn(value, key);

const stabilizeToolArgsValue = (
  value: unknown,
  path: string,
  keyOrderByPath: Map<string, string[]>,
): unknown => {
  // 스트리밍 중 부분 JSON의 key 순서가 흔들리면 tool args 텍스트가 계속 재정렬됩니다.
  // path별 이전 key 순서를 기억해 렌더링 diff가 안정적으로 보이게 합니다.
  if (Array.isArray(value)) {
    return value.map((item, idx) =>
      stabilizeToolArgsValue(item, `${path}[${idx}]`, keyOrderByPath),
    );
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const currentKeys = Object.keys(record);
    const previousOrder = keyOrderByPath.get(path) ?? [];
    const previousOrderSet = new Set(previousOrder);
    const nextOrder = [
      ...previousOrder.filter((key) => hasOwn(record, key)),
      ...currentKeys.filter((key) => !previousOrderSet.has(key)),
    ];
    keyOrderByPath.set(path, nextOrder);

    return Object.fromEntries(
      nextOrder.map((key) => [
        key,
        stabilizeToolArgsValue(record[key], `${path}.${key}`, keyOrderByPath),
      ]),
    );
  }

  return value;
};

const getToolArgsKeyOrder = (
  keyOrderCache: Map<string, Map<string, string[]>> | undefined,
  cacheKey: string,
): Map<string, string[]> => {
  const keyOrderByPath = keyOrderCache?.get(cacheKey) ?? new Map();
  keyOrderCache?.set(cacheKey, keyOrderByPath);
  return keyOrderByPath;
};

const trackToolArgsKeyOrder = (
  keyOrderCache: Map<string, Map<string, string[]>> | undefined,
  cacheKey: string,
  args: ReadonlyJSONObject,
) => {
  const keyOrderByPath = getToolArgsKeyOrder(keyOrderCache, cacheKey);
  stabilizeToolArgsValue(args, "$", keyOrderByPath);
};

const stableStringifyToolArgs = (
  keyOrderCache: Map<string, Map<string, string[]>> | undefined,
  cacheKey: string,
  args: ReadonlyJSONObject,
): string => {
  const keyOrderByPath = getToolArgsKeyOrder(keyOrderCache, cacheKey);
  const stableArgs = stabilizeToolArgsValue(
    args,
    "$",
    keyOrderByPath,
  ) as ReadonlyJSONObject;
  return JSON.stringify(stableArgs);
};

const getToolArgsCacheKey = (
  messageId: string | undefined,
  kind: "tool" | "computer",
  toolCallId: string,
) => `${messageId ?? "unknown"}:${kind}:${toolCallId}`;

const resolveToolCallArgs = ({
  chunk,
  matchingToolCallChunk,
  messageId,
  toolArgsKeyOrderCache,
  toolCallId,
}: {
  chunk: LangChainToolCall;
  matchingToolCallChunk: LangChainToolCallChunk | undefined;
  messageId: string | undefined;
  toolArgsKeyOrderCache: Map<string, Map<string, string[]>> | undefined;
  toolCallId: string;
}): Pick<ToolCallMessagePart, "args" | "argsText"> => {
  // tool call args는 완성 JSON과 partial_json 양쪽에서 올 수 있으므로 표시용 문자열과 파싱값을 함께 만듭니다.
  const cacheKey = getToolArgsCacheKey(messageId, "tool", toolCallId);
  const providedArgsText =
    chunk.partial_json ??
    matchingToolCallChunk?.args ??
    matchingToolCallChunk?.args_json;
  const argsText =
    providedArgsText ??
    stableStringifyToolArgs(toolArgsKeyOrderCache, cacheKey, chunk.args);

  const parsedPartialArgs = argsText ? parsePartialJsonObject(argsText) : null;
  const args = (
    argsText ? (parsedPartialArgs ?? {}) : chunk.args
  ) as ReadonlyJSONObject;
  trackToolArgsKeyOrder(
    toolArgsKeyOrderCache,
    cacheKey,
    (parsedPartialArgs ?? chunk.args) as ReadonlyJSONObject,
  );

  if (providedArgsText == null) {
    toolArgsKeyOrderCache?.delete(cacheKey);
  }

  return { args, argsText };
};

const getCustomMetadata = (
  additionalKwargs: Record<string, unknown> | undefined,
): Record<string, unknown> =>
  (additionalKwargs?.metadata as Record<string, unknown>) ?? {};

const warnedMessagePartTypes = new Set<string>();
const warnForUnknownMessagePartType = (type: string) => {
  if (
    typeof process === "undefined" ||
    process?.env?.NODE_ENV !== "development"
  )
    return;
  if (warnedMessagePartTypes.has(type)) return;
  warnedMessagePartTypes.add(type);
  console.warn(`Unknown message part type: ${type}`);
};

const warnedFilePartShapes = new Set<string>();
const warnForUnsupportedFilePartShape = (part: FileContentPart) => {
  if (
    typeof process === "undefined" ||
    process?.env?.NODE_ENV !== "development"
  )
    return;
  const shape = Object.keys(part).sort().join(",");
  if (warnedFilePartShapes.has(shape)) return;
  warnedFilePartShapes.add(shape);
  console.warn(`Unsupported file content block shape: ${shape}`);
};

type FileContentPart = Extract<
  Exclude<LangChainMessage["content"], string>[number],
  { type: "file" }
>;

const contentFilePartToThreadPart = (
  part: FileContentPart,
): Extract<ThreadUserMessage["content"][number], { type: "file" }> | null => {
  // LangChain 파일 content는 버전/호출 방식에 따라 여러 shape로 들어오므로 지원되는 형태를 하나로 접습니다.
  if ("file" in part) {
    return {
      type: "file",
      filename: part.file.filename,
      data: part.file.file_data,
      mimeType: part.file.mime_type,
    };
  }

  if ("data" in part && typeof part.data === "string") {
    return {
      type: "file",
      filename: part.metadata?.filename ?? "file",
      data: part.data,
      mimeType: part.mime_type,
    };
  }

  if ("base64" in part && typeof part.base64 === "string") {
    return {
      type: "file",
      filename: part.filename ?? "file",
      data: part.base64,
      mimeType: part.mime_type,
    };
  }

  warnForUnsupportedFilePartShape(part);
  return null;
};

const contentToParts = (
  content: LangChainMessage["content"],
  metadata: LangGraphMessageConverterMetadata,
  messageId: string | undefined,
) => {
  // LangChain content block을 assistant-ui의 text/image/file/reasoning/tool-call part로 변환합니다.
  if (typeof content === "string")
    return [{ type: "text" as const, text: content }];
  return content
    .map(
      (
        part,
      ):
        | (ThreadUserMessage | ThreadAssistantMessage)["content"][number]
        | null => {
        const type = part.type;
        switch (type) {
          case "text":
            return { type: "text", text: part.text };
          case "text_delta":
            return { type: "text", text: part.text };
          case "image_url":
            if (typeof part.image_url === "string") {
              return { type: "image", image: part.image_url };
            } else {
              return {
                type: "image",
                image: part.image_url.url,
              };
            }
          case "file":
            return contentFilePartToThreadPart(part);

          case "thinking":
            return { type: "reasoning", text: part.thinking };

          case "reasoning":
            return {
              type: "reasoning",
              text: part.summary.map((s) => s.text).join("\n\n\n"),
            };

          case "tool_use":
            return null;
          case "input_json_delta":
            return null;

          case "computer_call": {
            const args = part.action as ReadonlyJSONObject;
            return {
              type: "tool-call",
              toolCallId: part.call_id,
              toolName: "computer_call",
              args,
              argsText: stableStringifyToolArgs(
                metadata.toolArgsKeyOrderCache,
                getToolArgsCacheKey(messageId, "computer", part.call_id),
                args,
              ),
            };
          }

          default: {
            const _exhaustiveCheck: never = type;
            warnForUnknownMessagePartType(_exhaustiveCheck);
            return null;
          }

          // const _exhaustiveCheck: never = type;
          // throw new Error(`Unknown message part type: ${_exhaustiveCheck}`);
        }
      },
    )
    .filter((a) => a !== null);
};

export const convertLangChainMessages: useExternalMessageConverter.Callback<
  LangChainMessage
> = (message, metadata: LangGraphMessageConverterMetadata = {}) => {
  // assistant-ui는 role 중심의 ThreadMessage를 기대하므로 LangChain type별로 역할과 content를 매핑합니다.
  switch (message.type) {
    case "system":
      return {
        role: "system",
        id: message.id,
        content: [{ type: "text", text: message.content }],
        metadata: { custom: getCustomMetadata(message.additional_kwargs) },
      };
    case "human":
      return {
        role: "user",
        id: message.id,
        content: contentToParts(message.content, metadata, message.id),
        metadata: { custom: getCustomMetadata(message.additional_kwargs) },
      };
    case "ai": {
      // AI 메시지에는 텍스트 content 외에 tool call, reasoning, tool output, Generative UI part가 함께 붙을 수 있습니다.
      const toolCallParts =
        message.tool_calls?.map((chunk, idx): ToolCallMessagePart => {
          const fallbackIndex = chunk.index ?? idx;
          const toolCallId = chunk.id
            ? chunk.id
            : `lc-toolcall-${message.id ?? "unknown"}-${fallbackIndex}`;
          const matchingToolCallChunk = message.tool_call_chunks?.find((c) =>
            chunk.id ? c.id === chunk.id : c.index === fallbackIndex,
          );
          const { args, argsText } = resolveToolCallArgs({
            chunk,
            matchingToolCallChunk,
            messageId: message.id,
            toolArgsKeyOrderCache: metadata.toolArgsKeyOrderCache,
            toolCallId,
          });

          return {
            type: "tool-call",
            toolCallId,
            toolName: chunk.name,
            args,
            argsText,
          };
        }) ?? [];

      const normalizedContent =
        typeof message.content === "string"
          ? [{ type: "text" as const, text: message.content }]
          : message.content;

      const allContent = [
        message.additional_kwargs?.reasoning,
        ...normalizedContent,
        ...(message.additional_kwargs?.tool_outputs ?? []),
      ].filter((c) => c !== undefined);

      const uiDataParts: readonly DataMessagePart[] =
        (message.id
          ? metadata.uiMessagesByParent
              ?.get(message.id)
              ?.map(uiMessageToDataPart)
          : undefined) ?? [];

      const timing = message.id
        ? metadata.messageTiming?.[message.id]
        : undefined;

      return {
        role: "assistant",
        id: message.id,
        content: [
          ...contentToParts(allContent, metadata, message.id),
          ...toolCallParts,
          ...uiDataParts,
        ],
        metadata: {
          custom: getCustomMetadata(message.additional_kwargs),
          ...(timing && { timing }),
        },
        ...(message.status && { status: message.status }),
      };
    }
    case "tool":
      return {
        role: "tool",
        toolName: message.name,
        toolCallId: message.tool_call_id,
        result: message.content,
        artifact: message.artifact,
        isError: message.status === "error",
      };
  }
};
