---
sidebar_position: 1
slug: overview
---

# Twenty Front Reusable Patterns

`packages/twenty-front/src/modules`에서 재사용 가능한 구현 패턴을 카테고리별로 정리한다.

각 문서는 기본적으로 두 단계만 가진다.

1. `모듈 코드`
2. `사용 예제`

## Global Managers

- [Context-backed Imperative File Upload](global-managers/context-backed-imperative-file-upload.md): hidden file input을 전역 파일 선택기처럼 여는 패턴.
- [Queued Dialog Manager](global-managers/queued-dialog-manager.md): dialog queue를 manager가 렌더링하고 caller는 enqueue만 하는 패턴.
- [Queued Snack Bar Manager](global-managers/queued-snackbar-manager.md): snackbar queue를 provider가 렌더링하고 caller는 variant별 enqueue만 하는 패턴.
- [Instance-scoped Modal](global-managers/instance-scoped-modal.md): `modalInstanceId`로 modal open state를 분리하는 패턴.

## State Context

- [Component Instance State](state-context/component-instance-state.md): 같은 atom state를 `instanceId`별로 격리하는 패턴.
- [Required Context Provider Hook](state-context/required-context-provider-hook.md): Provider와 `useXxxOrThrow` hook을 함께 만드는 패턴.
- [Field Context Injection](state-context/field-context-injection.md): record field metadata/update hook을 하위 input/display에 주입하는 패턴.
- [Command Menu Context Filtering](state-context/command-menu-context-filtering.md): 현재 화면 context로 command menu item을 필터링하는 패턴.

## Record UI

- [Field Meta-Type Router](record-ui/field-meta-type-router.md): field metadata type guard로 display/input 컴포넌트를 선택하는 패턴.
- [Inline Cell Edit Lifecycle](record-ui/inline-cell-edit-lifecycle.md): display/edit 전환과 persist/close/focus 복귀를 cell shell에 모으는 패턴.
- [Anchored Portal Field Editor](record-ui/anchored-portal-field-editor.md): record cell anchor 위치에 field editor를 portal로 렌더링하는 패턴.
- [Junction Relation Resolver](record-ui/junction-relation-resolver.md): many-to-many relation metadata를 picker/display/update용 junction config로 바꾸는 패턴.

## Filter Metadata

- [Advanced Filter Builder Pipeline](filter-metadata/advanced-filter-builder-pipeline.md): field/sub-field/relation target 선택을 advanced `RecordFilter`로 정규화하는 패턴.
- [Object Filter Dropdown Operand Pipeline](filter-metadata/object-filter-dropdown-operand-pipeline.md): operand와 typed value input을 dropdown state 기반 `RecordFilter` upsert로 연결하는 패턴.
- [Object Metadata Selector Formatter Hooks](filter-metadata/object-metadata-selector-formatter-hooks.md): raw object/field metadata를 select, field definition, filter UI contract로 변환하는 패턴.
- [Column Definition From Metadata](filter-metadata/column-definition-from-metadata.md): readable field metadata를 table column definition과 filter/sort capability로 변환하는 패턴.

## Interactions

- [Instance-scoped Dropdown](interactions/instance-scoped-dropdown.md): `dropdownId`로 dropdown open/focus state를 분리하는 패턴.
- [Click Outside Listener](interactions/click-outside-listener.md): document-level pointer event를 안전한 outside click callback으로 바꾸는 패턴.
- [Global Hotkeys](interactions/global-hotkeys.md): focus stack 설정을 통과한 hotkey만 실행하는 패턴.
- [Drag Drop Context Adapter](interactions/drag-drop-context-adapter.md): dnd-kit 이벤트를 앱의 drop result 모델로 바꾸는 패턴.

## Focus State

- [Focus Stack Push/Remove](focus-state/focus-stack-push-remove.md): focus 대상 UI를 stack top으로 올리고 닫힐 때 제거하는 패턴.
- [Current Focus Selectors](focus-state/current-focus-selectors.md): focus stack top에서 current focus id/item/hotkey config를 파생하는 패턴.
- [Focus-Gated Global Hotkey Config](focus-state/focus-gated-global-hotkey-config.md): 현재 focus item의 config로 전역 hotkey 실행 여부를 제어하는 패턴.
- [Reset Focus Stack To Item](focus-state/reset-focus-stack-to-item.md): UI 전환 후 focus stack을 하나의 기준 item으로 재초기화하는 패턴.

## UI Primitives

- [Selectable List With Hotkeys](ui-primitives/selectable-list-with-hotkeys.md): list instance가 arrow navigation state를 갖고 item이 Enter action을 제공하는 패턴.
- [Tab List Hidden Measurement](ui-primitives/tab-list-hidden-measurement.md): hidden layer에서 실제 tab widths를 측정해 visible/overflow tabs를 나누는 패턴.
- [Resizable Panel Pointer Drag](ui-primitives/resizable-panel-pointer-drag.md): document-level pointer tracking으로 panel width를 preview하고 release 때 commit하는 패턴.
- [Expandable List Overflow Dropdown](ui-primitives/expandable-list-overflow-dropdown.md): inline overflow child를 `+N` chip과 floating dropdown으로 전환하는 패턴.

## Data Operations

- [Direct File Upload Pipeline](data-operations/direct-file-upload-pipeline.md): create target, PUT upload, complete mutation을 하나의 hook으로 묶는 패턴.
- [Object Record CRUD Hook](data-operations/object-record-crud-hook.md): object metadata 기반 GraphQL mutation, optimistic cache, store update를 감싸는 패턴.
- [Generated GraphQL Fields](data-operations/generated-graphql-fields.md): runtime metadata로 GraphQL selection set과 operation document를 만드는 패턴.
- [Optimistic Record Effects](data-operations/optimistic-record-effects.md): create/update/delete 결과를 Apollo connection cache와 record store에 즉시 반영하는 패턴.
- [Apollo Record Cache Wrappers](data-operations/apollo-record-cache-wrappers.md): metadata 기반 fragment read/write/cache modify를 helper로 감싸는 패턴.

## Settings Integrations

- [Billing Plan/Price Selector Hooks](settings-integrations/billing-plan-price-selector-hooks.md): billing catalog query를 plan/price selector hook으로 재사용하는 패턴.
- [Stripe Promise/Payment Flow](settings-integrations/stripe-promise-payment-flow.md): Stripe promise memoization과 Elements payment/setup intent submit을 묶는 패턴.
- [Provider Reconnect OAuth Trigger](settings-integrations/provider-reconnect-oauth-trigger.md): connected account provider별 reconnect route/OAuth redirect를 분기하는 패턴.
- [Data Model Select Option Bulk Parser](settings-integrations/data-model-select-option-bulk-parser.md): select options와 bulk textarea text를 metadata 보존 방식으로 변환하는 패턴.

## Record Data Loading

- [Generic Find Many Query Hook](record-data-loading/generic-find-many-query-hook.md): metadata 기반 list query, cursor state, fetchMore를 하나의 hook으로 묶는 패턴.
- [Lazy Query Pagination Fetch More](record-data-loading/lazy-query-pagination-fetch-more.md): lazy query로 첫 페이지를 시작하고 cursor 기반 fetchMore로 이어가는 패턴.
- [Record Table Virtualization Data Loader](record-data-loading/record-table-virtualization-data-loader.md): virtual row slot과 real index map을 분리해 필요한 page만 로드하는 패턴.
- [Aggregate Records Query](record-data-loading/aggregate-records-query.md): field aggregate 요청을 generated GraphQL aggregate query와 display state로 연결하는 패턴.

## Timeline Activity

- [Timeline Activity Type Filter](timeline-activity/timeline-activity-type-filter.md): active type과 record별 selected type을 합쳐 activity filter로 적용하는 패턴.
- [Timeline Events Month Grouping](timeline-activity/timeline-events-month-grouping.md): flat timeline events를 렌더링 직전에 month group으로 바꾸는 패턴.
- [Dynamic Timeline Activity Renderer](timeline-activity/dynamic-timeline-activity-renderer.md): 기본 row 위에 standard/front component detail renderer를 선택적으로 붙이는 패턴.
- [Field Diff Value Renderer](timeline-activity/field-diff-value-renderer.md): diff 값을 artificial record store에 넣고 기존 `FieldDisplay`로 표시하는 패턴.

## View Layout State

- [View Filter/Sort Apply-Save Pipeline](view-layout-state/view-filter-sort-apply-save-pipeline.md): persisted view filter/sort와 현재 화면 filter/sort state를 적용, 비교, 저장하는 패턴.
- [Page Layout Draft-To-Persist Pipeline](view-layout-state/page-layout-draft-to-persist-pipeline.md): page layout draft를 edit state로 다루고 save/reset 시 persisted snapshot과 동기화하는 패턴.
- [Layout Customization Dirty/Save/Cancel Flow](view-layout-state/layout-customization-dirty-save-cancel-flow.md): navigation, command menu, page layout customization draft를 한 save/cancel flow로 묶는 패턴.

## Sync Effects

- [Browser Event Listener](sync-effects/browser-event-listener.md): `CustomEvent` dispatch/listen을 typed hook과 feature filter로 감싸는 패턴.
- [SSE Event To Optimistic Effect](sync-effects/sse-event-to-optimistic-effect.md): SSE payload를 optimistic cache update와 browser event broadcast로 분기하는 패턴.
- [Metadata Store Bootstrap Refresh](sync-effects/metadata-store-bootstrap-refresh.md): persisted metadata hash를 비교해 stale entity만 refresh하고 ready gate를 여는 패턴.

## App Bootstrap Runtime

- [Captcha Script Gated Provider](app-bootstrap-runtime/captcha-script-gated-provider.md): captcha가 필요한 route에서만 외부 script와 token refresh를 붙이는 패턴.
- [Client Config Error Gate Provider](app-bootstrap-runtime/client-config-error-gate-provider.md): client config fetch 실패를 앱 공통 full-screen error gate로 처리하는 패턴.
- [Auth Session Cross-tab Effects](app-bootstrap-runtime/auth-session-cross-tab-effects.md): sign-out broadcast와 pending server sign-out retry를 부트스트랩 effect로 묶는 패턴.
- [Front Component Runtime Bridge](app-bootstrap-runtime/front-component-runtime-bridge.md): database-backed front component runtime에 host API, token, context를 주입하는 패턴.

## AI Runtime

- [Agent Chat Runtime Effects](ai-runtime/agent-chat-runtime-effects.md): AI chat이 열린 뒤에만 fetch, stream, preprompt, keepalive effect를 붙이는 패턴.
- [Streaming Parts Diff Sync](ai-runtime/streaming-parts-diff-sync.md): incoming stream message를 diff한 뒤 변경된 part side effect만 실행하는 패턴.
- [Chat Thread URL/Selection Sync](ai-runtime/chat-thread-url-selection-sync.md): thread 선택을 state, draft, URL, side-panel navigation에 함께 반영하는 패턴.
- [Dictation Availability/Event Emitter](ai-runtime/dictation-availability-event-emitter.md): Web Speech capability gate와 emitter 기반 dictation engine lifecycle 패턴.

## Activity Composer

- [Email Recipient Parse/Merge/Serialize Pipeline](activity-composer/email-recipient-parse-merge-serialize-pipeline.md): free text와 chips를 같은 email recipient 배열 모델로 정규화하는 패턴.
- [Email Composer State Hook](activity-composer/email-composer-state-hook.md): sender, recipients, body, attachments, validation, send action을 하나의 hook contract로 묶는 패턴.
- [Calendar Event Composer Date Transitions](activity-composer/calendar-event-composer-date-transitions.md): timed/all-day 전환과 start/end 변경을 valid date range로 유지하는 패턴.
- [Activity Target Related Record Actions](activity-composer/activity-target-related-record-actions.md): record context용 task/note/file/email/calendar action을 같은 binding contract로 수집하는 패턴.

## Spreadsheet Workflows

- [Spreadsheet Import Workflow](spreadsheet-workflows/spreadsheet-import-workflow.md): upload부터 submit까지 step state로 import wizard를 연결하는 패턴.
- [Spreadsheet Column Auto-Match](spreadsheet-workflows/spreadsheet-column-auto-match.md): imported headers를 fields에 fuzzy match하고 mapping state에 반영하는 패턴.
- [Spreadsheet Validation Pipeline](spreadsheet-workflows/spreadsheet-validation-pipeline.md): row/table hooks와 field validations로 imported rows를 검증하는 패턴.
- [Object Records Spreadsheet Adapter](spreadsheet-workflows/object-records-spreadsheet-adapter.md): generic importer를 object metadata와 batch create mutation에 연결하는 패턴.

## Routing Navigation

- [Side Panel Routed Page Navigation](routing-navigation/side-panel-routed-page-navigation.md): 일반 route path를 side panel navigation stack item으로 열고 내부 navigation도 같은 stack으로 이어가는 패턴.
- [Navigation Mode Switcher](routing-navigation/navigation-mode-switcher.md): route-owned mode와 memorized tab state를 조합해 navigation drawer mode를 전환하는 패턴.

## Navigation Menu Patterns

- [Navigation Menu Tree Filter/Sort](navigation-menu-patterns/navigation-menu-tree-filter-sort.md): raw navigation items를 readable tree display list로 바꾸는 패턴.
- [Navigation Menu DnD Reorder Position](navigation-menu-patterns/navigation-menu-dnd-reorder-position.md): dnd-kit target을 folder destination과 사이 position update로 바꾸는 패턴.
- [Navigation Menu Draft Save Pipeline](navigation-menu-patterns/navigation-menu-draft-save-pipeline.md): workspace navigation draft를 save 시 create/delete/recreate/update diff로 저장하는 패턴.
- [Add-To-Navigation Drop Handler](navigation-menu-patterns/add-to-navigation-drop-handler.md): 외부 draggable payload를 navigation draft item과 edit side panel로 연결하는 패턴.

## Workflow Patterns

- [Workflow Diagram Generation](workflow-patterns/workflow-diagram-generation.md): workflow trigger/steps를 React Flow nodes/edges로 변환하는 패턴.
- [Workflow Step Mutation Facade](workflow-patterns/workflow-step-mutation-facade.md): step/edge 변경 mutation과 local flow/cache sync를 UI용 API로 감싸는 패턴.
- [Workflow Run Action Hooks](workflow-patterns/workflow-run-action-hooks.md): run/stop/retry mutation 주변의 optimistic cache, SSE, browser event, side panel side effect를 hook에 모으는 패턴.
- [Step Output Schema Computation](workflow-patterns/step-output-schema-computation.md): step settings와 object metadata를 variable picker용 output schema로 계산하고 cache하는 패턴.
