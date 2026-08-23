---
sidebar_position: 1
---

# TradingAgents 프로젝트 개요

TradingAgents는 여러 LLM 에이전트가 실제 투자회사처럼 역할을 나눠 시장을 분석하고 매매 의견을 만드는 연구용 프레임워크다. 하나의 모델에 판단을 맡기는 대신 분석가, 연구원, 트레이더, 리스크 관리자와 포트폴리오 매니저가 순서대로 보고서를 작성하고 서로의 판단을 검토한다.

결과는 실제 주문을 체결하는 자동매매 시스템이라기보다 시장 데이터를 바탕으로 `BUY`, `SELL`, `HOLD` 의견과 근거를 생성하는 멀티 에이전트 투자 리서치에 가깝다.

## 전체 실행 흐름

```text
종목·분석일 입력
  ↓
시장 / 심리 / 뉴스 / 펀더멘털 분석
  ↓
강세 연구원 ↔ 약세 연구원 토론
  ↓
Research Manager가 투자 방향 정리
  ↓
Trader가 거래안 작성
  ↓
공격적 / 중립적 / 보수적 리스크 토론
  ↓
Portfolio Manager가 최종 결정
  ↓
BUY / SELL / HOLD 신호와 상세 보고서
```

실행 순서는 LangGraph 상태 그래프로 정의된다. 각 에이전트는 앞 단계의 보고서와 공용 상태를 전달받아 자신의 결과를 추가한다.

## 에이전트 구성

| 에이전트 | 역할 | 주요 데이터 |
|---|---|---|
| Market Analyst | 가격 흐름과 기술적 지표 분석 | OHLCV, RSI, MACD 등 |
| Sentiment Analyst | 단기 시장 심리 분석 | 종목 뉴스, 소셜 데이터 |
| News Analyst | 기업·시장·거시경제 이벤트 분석 | 글로벌 뉴스, 내부자 거래, FRED, Polymarket |
| Fundamentals Analyst | 기업 가치와 재무 건전성 분석 | 재무제표, 현금흐름, 밸류에이션 |

분석 후 `Bull Researcher`와 `Bear Researcher`가 상승 논리와 하락 위험을 토론하고, `Research Manager`가 투자 방향을 정리한다. `Trader`가 거래안을 만들면 공격적·중립적·보수적 리스크 에이전트가 다시 검토한다. 마지막으로 `Portfolio Manager`가 최종 결정을 내린다.

토론 횟수는 `max_debate_rounds`와 `max_risk_discuss_rounds`로 조절한다. 횟수가 늘면 분석은 깊어지지만 LLM 호출량, 시간과 비용도 증가한다.

## 주요 코드 구조

```text
TradingAgents/
├── cli/                         # Rich/Typer 기반 대화형 CLI
├── tradingagents/
│   ├── agents/                  # 역할별 에이전트와 공용 상태
│   ├── dataflows/               # 시세·뉴스·재무 데이터 공급자
│   ├── graph/                   # LangGraph 워크플로와 실행 제어
│   ├── llm_clients/             # LLM 공급자별 클라이언트
│   ├── default_config.py        # 기본 설정과 환경변수 처리
│   └── reporting.py             # Markdown 보고서 출력
├── tests/                       # 테스트
├── main.py                      # Python 실행 예제
└── pyproject.toml               # 패키지와 의존성 정의
```

중심 클래스는 `tradingagents/graph/trading_graph.py`의 `TradingAgentsGraph`다. LLM과 데이터 도구를 준비하고 그래프를 실행하며 최종 상태와 거래 신호를 반환한다. 노드 연결 순서는 `tradingagents/graph/setup.py`에 정의되어 있다.

## 데이터 공급자

| 데이터 종류 | 기본 공급자 | 대안 |
|---|---|---|
| 시세·OHLCV | Yahoo Finance | Alpha Vantage |
| 기술적 지표 | Yahoo Finance, stockstats | Alpha Vantage |
| 기업 재무 | Yahoo Finance | Alpha Vantage |
| 종목·글로벌 뉴스 | Yahoo Finance | Alpha Vantage |
| 거시경제 지표 | FRED | - |
| 예측시장 | Polymarket | - |

여러 공급자를 쉼표로 연결하면 지정한 순서대로 폴백한다.

```python
config["data_vendors"]["core_stock_apis"] = "yfinance,alpha_vantage"
config["tool_vendors"]["get_news"] = "alpha_vantage,yfinance"
```

프레임워크는 설정하지 않은 공급자로 임의 전환하지 않는다. 핵심 데이터가 없거나 오래된 경우에는 명시적인 데이터 없음 결과를 전달해 LLM의 추측을 줄인다.

## 지원하는 LLM

OpenAI, Anthropic Claude, Google Gemini, Azure OpenAI, AWS Bedrock, xAI, DeepSeek, Qwen, GLM, MiniMax, OpenRouter를 지원한다. Ollama 로컬 모델과 vLLM, LM Studio, llama.cpp 등 OpenAI 호환 엔드포인트도 사용할 수 있다.

복잡한 판단에는 `deep_think_llm`, 빠른 분석에는 `quick_think_llm`을 별도로 지정한다.

```python
config["llm_provider"] = "openai"
config["deep_think_llm"] = "gpt-5.5"
config["quick_think_llm"] = "gpt-5.4-mini"
```

지원 모델과 기본값은 버전에 따라 바뀔 수 있으므로 `tradingagents/default_config.py`와 `tradingagents/llm_clients/model_catalog.py`에서 확인한다.

## 설치와 API 키

Python 3.10 이상이 필요하며 프로젝트는 Python 3.12 환경을 권장한다.

```bash
git clone https://github.com/TauricResearch/TradingAgents.git
cd TradingAgents
python -m venv .venv
source .venv/bin/activate
pip install .
```

개발 도구까지 설치하려면 `pip install ".[dev]"`를 사용한다. 사용할 공급자의 키는 환경변수 또는 `.env`에 등록한다.

```bash
cp .env.example .env
export OPENAI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
export GOOGLE_API_KEY="..."
export ALPHA_VANTAGE_API_KEY="..."
export FRED_API_KEY="..."
```

`.env`에는 비밀키가 들어가므로 Git에 커밋하지 않는다.

## CLI 실행

```bash
tradingagents
# 또는
python -m cli.main
```

CLI에서 종목, 분석 기준일, LLM, 분석가, 토론 깊이와 출력 언어를 선택한다.

| 시장 | 티커 예시 |
|---|---|
| 미국 | `AAPL`, `NVDA`, `SPY` |
| 한국 | `005930.KS`, `000660.KS` |
| 일본 | `7203.T` |
| 홍콩 | `0700.HK` |
| 암호화폐 | `BTC-USD`, `ETH-USD` |

## Python에서 실행

```python
from tradingagents.default_config import DEFAULT_CONFIG
from tradingagents.graph.trading_graph import TradingAgentsGraph

config = DEFAULT_CONFIG.copy()
config["output_language"] = "Korean"
config["max_debate_rounds"] = 2
config["max_risk_discuss_rounds"] = 2

graph = TradingAgentsGraph(
    selected_analysts=("market", "news", "fundamentals"),
    debug=True,
    config=config,
)

state, decision = graph.propagate("005930.KS", "2026-08-20")
print(decision)
```

`propagate()`는 전체 분석과 토론을 담은 `state`, 최종 핵심 신호 `decision`을 반환한다. 암호화폐는 `asset_type="crypto"`를 추가한다.

## 환경변수 설정

```bash
export TRADINGAGENTS_LLM_PROVIDER="openai"
export TRADINGAGENTS_DEEP_THINK_LLM="gpt-5.5"
export TRADINGAGENTS_QUICK_THINK_LLM="gpt-5.4-mini"
export TRADINGAGENTS_OUTPUT_LANGUAGE="Korean"
export TRADINGAGENTS_MAX_DEBATE_ROUNDS="2"
export TRADINGAGENTS_MAX_RISK_ROUNDS="2"
export TRADINGAGENTS_CHECKPOINT_ENABLED="true"
```

전체 설정은 `tradingagents/default_config.py`에서 확인한다.

## 결과 저장과 메모리

전체 상태는 기본적으로 `~/.tradingagents/logs/<ticker>/TradingAgentsStrategy_logs/` 아래에 JSON으로 기록된다. 역할별 Markdown 보고서는 다음처럼 저장한다.

```python
state, decision = graph.propagate("NVDA", "2026-08-20")
report_dir = graph.save_reports(state, "NVDA")
```

프레임워크는 결정을 메모리 로그에 기록한다. 같은 티커를 다시 분석하면 이전 결정 이후의 실제 수익률과 지역별 벤치마크 대비 알파를 계산하고 LLM이 과거 판단을 회고한다. 모델 재학습이 아니라 과거 기록을 다음 프롬프트 컨텍스트로 재사용하는 방식이다.

## 체크포인트와 테스트

`config["checkpoint_enabled"] = True`로 설정하면 각 LangGraph 노드 실행 후 상태를 SQLite에 저장한다. 중단된 뒤 같은 종목, 날짜와 그래프 설정으로 실행하면 마지막 성공 지점부터 재개할 수 있다.

```bash
pytest
```

테스트는 LLM 공급자 설정, 데이터 라우팅, 날짜 경계, 체크포인트 복구, 암호화폐 모드, 티커 정규화와 구조화 출력을 검증한다.

## 장점과 한계

역할별 프롬프트와 토론 구조가 명확하고 LLM과 데이터 공급자를 교체하기 쉬우며 분석 중간 결과를 확인할 수 있다. 다만 다음 한계를 고려해야 한다.

- 여러 번의 LLM 호출로 실행 시간과 API 비용이 커질 수 있다.
- 같은 입력도 모델의 비결정성 때문에 결과가 달라질 수 있다.
- 과거 날짜 분석에서는 당시 공개된 정보만 사용되는지 검증해야 한다.
- 뉴스와 재무 데이터의 누락, 지연과 공급자별 차이가 판단에 영향을 준다.
- 최종 신호는 주문 체결과 포지션 관리를 포함한 완성된 매매 시스템이 아니다.

따라서 실제 자금을 자동 운용하기보다 멀티 에이전트 협업, 금융 리서치 자동화와 전략 실험의 기반으로 사용하는 편이 적합하다.

## 참고

- [TradingAgents GitHub](https://github.com/TauricResearch/TradingAgents)
- [TradingAgents 논문](https://arxiv.org/abs/2412.20138)
