# 2. 에이전트별 외부 API와 데이터 소스

## 2.1 목적

이 문서는 TradingAgents의 각 LangGraph 에이전트가 어떤 외부 데이터 소스를 사용하는지, 데이터가 어떤 경로로 전달되는지, MCP가 사용되는지를 정리한다.

TradingAgents에서 말하는 `Tool`은 MCP Tool이 아니라 LangChain의 `@tool` Python 함수다. LangGraph의 `ToolNode`가 이 함수를 실행하며, 함수 내부에서 외부 HTTP API 또는 `yfinance` 라이브러리를 호출한다.

```text
LangGraph Agent
    |
    +-- LangChain @tool
    |       |
    |       +-- route_to_vendor()
    |               |
    |               +-- Yahoo Finance
    |               +-- Alpha Vantage (선택 사항)
    |               +-- FRED
    |               +-- Polymarket
    |
    +-- 노드 실행 전 직접 수집
    |       +-- StockTwits API
    |       +-- Reddit RSS
    |
    +-- LLM 호출
            |
            +-- codex-oauth-proxy
                    |
                    +-- ChatGPT Codex API
```

## 2.2 MCP 사용 여부

현재 TradingAgents에는 다음 MCP 구성요소가 없다.

- MCP Server
- MCP Client
- MCP Tool Discovery
- MCP transport(stdio, SSE, Streamable HTTP)

에이전트가 사용하는 도구는 정적으로 등록된 LangChain Tool이다.

```python
from langchain_core.tools import tool

@tool
def get_stock_data(...):
    return route_to_vendor("get_stock_data", ...)
```

따라서 현재 데이터 계층은 다음 구조다.

```text
Agent -> LangChain Tool -> Python vendor router -> 외부 API
```

MCP 기반으로 전환하려면 외부 데이터 공급자를 MCP Server 뒤에 배치하고, TradingAgents에 MCP Client와 동적 Tool 등록 계층을 추가해야 한다.

## 2.3 현재 기본 데이터 공급자

`tradingagents/default_config.py`의 기본 설정은 다음과 같다.

| 데이터 범주 | 기본 공급자 | 인증 |
|---|---|---|
| 주가 OHLCV | Yahoo Finance | 불필요 |
| 기술적 지표 | Yahoo Finance + 로컬 계산 | 불필요 |
| 기업 재무정보 | Yahoo Finance | 불필요 |
| 종목 및 글로벌 뉴스 | Yahoo Finance | 불필요 |
| 거시경제 | FRED | `FRED_API_KEY` 필요 |
| 예측시장 | Polymarket | 불필요 |
| 투자 심리 | Yahoo Finance, StockTwits, Reddit RSS | 불필요 |
| LLM | `codex-oauth-proxy` | ChatGPT OAuth |

기본 vendor 설정:

```python
"data_vendors": {
    "core_stock_apis": "yfinance",
    "technical_indicators": "yfinance",
    "fundamental_data": "yfinance",
    "news_data": "yfinance",
    "macro_data": "fred",
    "prediction_markets": "polymarket",
}
```

현재 로컬 환경에서는 `FRED_API_KEY`와 `ALPHA_VANTAGE_API_KEY`가 설정되지 않았다. 따라서 Alpha Vantage는 사용되지 않으며, FRED 데이터는 사용 불가 sentinel로 대체된 후 분석이 계속된다.

## 2.4 에이전트별 데이터 소스

### 2.4.1 Market Analyst

Market Analyst는 다음 LangChain Tool을 사용한다.

| Tool | 실제 데이터 소스 | 동작 |
|---|---|---|
| `get_stock_data` | Yahoo Finance | 지정 기간의 OHLCV 조회 |
| `get_indicators` | Yahoo Finance | OHLCV 수집 후 `stockstats`로 지표 계산 |
| `get_verified_market_snapshot` | Yahoo Finance | 가격과 주요 지표를 로컬에서 재계산·검증 |

대표 지표:

- SMA와 EMA
- RSI
- MACD
- Bollinger Bands
- ATR
- VWMA

실행 흐름:

```text
Market Analyst
    |
    +-- tool_calls 있음 -> tools_market -> Market Analyst 재호출
    |
    +-- tool_calls 없음 -> market_report 확정
```

`get_verified_market_snapshot`은 vendor router를 거치지 않고 Yahoo Finance 기반 OHLCV를 직접 불러온다. 이 경로는 LLM이 정확한 가격이나 지표 값을 잘못 생성하지 않도록 검증 기준을 제공한다.

### 2.4.2 Sentiment Analyst

Sentiment Analyst는 LangGraph `ToolNode`를 통한 도구 호출을 사용하지 않는다. 노드가 실행될 때 Python 코드가 다음 데이터를 먼저 수집하고, 결과를 LLM 프롬프트에 삽입한다.

| 데이터 | 외부 소스 | 인증 |
|---|---|---|
| 종목 뉴스 | Yahoo Finance | 불필요 |
| 개인투자자 메시지 | StockTwits public API | 불필요 |
| 커뮤니티 토론 | Reddit public RSS | 불필요 |

StockTwits endpoint:

```text
https://api.stocktwits.com/api/2/streams/symbol/{ticker}.json
```

수집 항목:

- 최근 메시지 최대 30개
- 작성자가 지정한 `Bullish` 또는 `Bearish` 태그
- 메시지 본문
- 작성자와 작성 시각

Reddit 기본 대상:

- `r/wallstreetbets`
- `r/stocks`
- `r/investing`

Reddit endpoint:

```text
https://www.reddit.com/r/{subreddit}/search.rss
```

Reddit JSON 검색 API는 비 OAuth 요청이 WAF에서 차단되는 경우가 많아 기본 경로로 사용하지 않는다. RSS에는 점수와 댓글 수가 없으므로 코드도 이를 임의로 생성하지 않는다.

실행 흐름:

```text
Yahoo 뉴스 ----+
StockTwits -----+--> 프롬프트 조립 --> Sentiment Analyst LLM
Reddit RSS -----+
```

### 2.4.3 News Analyst

News Analyst는 다음 Tool을 사용한다.

| Tool | 데이터 소스 | 인증 |
|---|---|---|
| `get_news` | Yahoo Finance | 불필요 |
| `get_global_news` | Yahoo Finance Search | 불필요 |
| `get_macro_indicators` | FRED | `FRED_API_KEY` 필요 |
| `get_prediction_markets` | Polymarket Gamma API | 불필요 |

Yahoo Finance 뉴스는 분석 기준일을 중심으로 날짜를 필터링한다. 과거 날짜 분석에 미래 기사가 포함되는 look-ahead 문제를 방지하기 위한 처리다.

FRED API base URL:

```text
https://api.stlouisfed.org/fred
```

대표 FRED series:

| 의미 | Series ID |
|---|---|
| 연방기금금리 | `FEDFUNDS` |
| 미국 2년물 금리 | `DGS2` |
| 미국 10년물 금리 | `DGS10` |
| 장단기 금리차 | `T10Y2Y` |
| CPI | `CPIAUCSL` |
| Core CPI | `CPILFESL` |
| Core PCE | `PCEPILFE` |
| 실업률 | `UNRATE` |
| 비농업 고용 | `PAYEMS` |
| GDP | `GDP`, `GDPC1` |
| VIX | `VIXCLS` |

FRED는 선택적 보강 데이터다. 키 누락이나 API 장애가 발생하면 전체 분석을 중단하지 않고 다음 형태의 명시적 메시지를 반환한다.

```text
DATA_UNAVAILABLE: optional macro_data could not be retrieved
```

Polymarket API base URL:

```text
https://gamma-api.polymarket.com
```

검색 endpoint:

```text
GET /public-search
```

수집 항목:

- 이벤트별 시장 내재 확률
- 거래량
- 시장 종료 날짜
- 최근 1주 가격 또는 확률 변화

`get_insider_transactions`는 News용 `ToolNode`에 등록되어 있지만 현재 News Analyst의 `bind_tools()` 목록에는 포함되지 않는다. 따라서 현재 그래프에서 LLM이 이 도구를 호출할 수 없으며 사실상 휴면 기능이다.

### 2.4.4 Fundamentals Analyst

Fundamentals Analyst는 다음 Tool을 사용한다.

| Tool | 현재 데이터 소스 | 데이터 |
|---|---|---|
| `get_fundamentals` | Yahoo Finance | 기업 개요, 밸류에이션, 주요 재무 지표 |
| `get_balance_sheet` | Yahoo Finance | 자산, 부채, 자본 |
| `get_cashflow` | Yahoo Finance | 영업·투자·재무 현금흐름 |
| `get_income_statement` | Yahoo Finance | 매출, 영업이익, 순이익 |

재무제표는 연간 또는 분기 단위로 요청할 수 있다.

### 2.4.5 Research, Trader, Risk, Manager 에이전트

다음 에이전트는 새로운 시장 데이터 API를 호출하지 않는다.

| 에이전트 | 입력 데이터 |
|---|---|
| Bull Researcher | 분석가 4명의 보고서와 Bear 토론 |
| Bear Researcher | 분석가 4명의 보고서와 Bull 토론 |
| Research Manager | Bull/Bear 토론 기록 |
| Trader | Research Manager 투자 계획 |
| Aggressive Analyst | 분석 보고서와 Trader 제안 |
| Conservative Analyst | 분석 보고서와 Trader 제안 |
| Neutral Analyst | 분석 보고서와 Trader 제안 |
| Portfolio Manager | 연구 계획, 거래안, 위험 토론, 과거 교훈 |

이 에이전트들은 외부 시장 데이터 API를 직접 호출하지 않지만 모두 LLM API를 호출한다.

현재 모델 배정:

| 역할 | 모델 |
|---|---|
| 분석가, Bull/Bear, Trader, 위험 분석가 | `gpt-5.6-terra` |
| Research Manager, Portfolio Manager | `gpt-5.6-sol` |

## 2.5 그래프 실행 전 공통 외부 호출

LangGraph 실행 전에 종목 신원을 결정적으로 확인하기 위해 Yahoo Finance를 호출한다.

```python
yf.Ticker(normalized_ticker).info
```

수집 정보:

- 회사명
- 섹터
- 산업
- 거래소
- quote type

결과는 `instrument_context`에 저장되어 모든 에이전트에 전달된다. 이를 통해 에이전트가 티커를 다른 회사나 자산으로 잘못 해석하는 것을 방지한다.

## 2.6 Vendor 라우팅과 대체 공급자

대부분의 데이터 Tool은 다음 경로로 실행된다.

```text
Agent
  -> LangChain @tool
  -> route_to_vendor(method)
  -> data_vendors 또는 tool_vendors 설정 확인
  -> 선택된 vendor 구현 호출
```

Tool별로 `tool_vendors`를 설정하면 범주 기본값보다 우선한다.

```python
"tool_vendors": {
    "get_stock_data": "alpha_vantage",
}
```

여러 공급자를 명시하면 지정한 순서대로 fallback한다.

```python
"data_vendors": {
    "core_stock_apis": "yfinance,alpha_vantage",
}
```

라우터는 사용자가 지정하지 않은 공급자로 임의 전환하지 않는다.

Alpha Vantage base URL:

```text
https://www.alphavantage.co/query
```

필요한 환경변수:

```dotenv
ALPHA_VANTAGE_API_KEY=...
```

Alpha Vantage는 가격, 기술적 지표, 재무제표, 뉴스와 내부자 거래의 대체 공급자로 구현되어 있다.

## 2.7 LLM API 경로

모든 LLM 기반 에이전트의 현재 호출 경로는 다음과 같다.

```text
TradingAgents
    -> OpenAI-compatible Chat Completions
    -> http://127.0.0.1:18741/v1/chat/completions
    -> Docker codex-oauth-proxy
    -> https://chatgpt.com/backend-api/codex/responses
```

현재 모델:

```text
quick: gpt-5.6-terra
deep:  gpt-5.6-sol
```

`codex-oauth-proxy`는 시장 데이터 공급자가 아니다. 분석가가 수집한 데이터를 받아 LLM 추론을 수행할 수 있도록 OpenAI-compatible API를 제공하는 역할이다.

## 2.8 데이터 전달과 보안 경계

외부 데이터의 최종 전달 경로는 다음과 같다.

```text
Yahoo / FRED / StockTwits / Reddit / Polymarket
                    |
                    v
             Python 문자열과 표
                    |
                    v
              Agent 프롬프트
                    |
                    v
         localhost codex-oauth-proxy
                    |
                    v
           ChatGPT Codex API
```

따라서 외부 API에서 받은 가격, 재무정보, 뉴스와 소셜 데이터는 일부 로컬 계산에만 사용되는 것이 아니라 LLM 프롬프트에도 포함되어 외부 LLM 서비스로 전달된다.

OAuth 토큰은 다음 로컬 경로에 저장되며 Git에서 제외되어야 한다.

```text
infra/2-codex-oauth-proxy/.config/chatgpt_auth.json
```

## 2.9 장애 처리 특성

| 데이터 범주 | 장애 시 처리 |
|---|---|
| 가격·재무·뉴스 | 설정된 fallback 공급자를 시도한 후 핵심 오류를 노출 |
| 종목 데이터 없음 | `NO_DATA_AVAILABLE`을 반환하고 값 생성을 금지 |
| FRED·Polymarket | 선택 데이터이므로 `DATA_UNAVAILABLE`로 완화 |
| StockTwits·Reddit | placeholder 문자열을 반환하고 Sentiment 분석을 계속 |
| LLM API | SDK retry budget 이후 실패하면 그래프 중단 |

핵심 데이터 공급자는 오류를 숨기지 않으며, 선택적 보강 데이터는 전체 분석을 중단시키지 않는 구조다.

## 2.10 요약

현재 TradingAgents가 의존하는 외부 시스템은 다음과 같다.

1. Yahoo Finance: 가격, 지표 원천, 재무정보, 뉴스, 종목 신원
2. StockTwits public API: 개인투자자 메시지와 명시적 심리 태그
3. Reddit public RSS: 투자 커뮤니티 토론
4. FRED API: 거시경제 시계열; 현재 키 미설정
5. Polymarket Gamma API: 이벤트별 시장 내재 확률
6. Alpha Vantage: 선택 가능한 대체 공급자; 현재 키 미설정
7. ChatGPT Codex API: 모든 LLM 에이전트의 추론

현재 구현은 MCP가 아니라 정적 LangChain Tool과 Python vendor router 기반이다.
