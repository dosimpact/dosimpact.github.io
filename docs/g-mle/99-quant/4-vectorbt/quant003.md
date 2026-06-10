---
sidebar_position: 3
---


# vectorbt - 기본예제

## 전략

Long Position
- MA 10 > MA 30
- 0 <= RSI <= 50

Short Position
- MA 10 < MA 30
- 50 < RSI

## Basic code

```py

import numpy as np
import pandas as pd
import ccxt
import ta
import vectorbt as vbt

# data layer
df = vbt.CCXTData.download_symbol(
    "BTC/USDT",
    exchange='upbit',
    config=None,
    timeframe='4h',
    start='1 months ago', # '1 months ago' | 
    end='now UTC',
    delay=0.1,
    limit=500,
    retries=3,
    show_progress=True,
    params=None,
    tqdm_kwargs=None
)

# signal layer
df['ma10'] = ta.trend.SMAIndicator(df['Close'], 10).sma_indicator()
df['ma30'] = ta.trend.SMAIndicator(df['Close'], 30).sma_indicator()
df['rsi'] = ta.momentum.RSIIndicator(df['Close']).rsi()

df['signal'] = np.where(  df['rsi'].between(0, 50), 1, -1)
df['signal2'] = np.select([ df['ma10']>df['ma30'], df['ma30']>df['ma10']], [1,-1],  0 )

cond_go = [(df['signal'] == 1 ) & (df['signal2'] == 1),(df['signal'] == -1 ) & (df['signal2'] == -1)]
df['go'] = np.select(cond_go, [1,-1], 0)

# anomalo laery
df['go'].value_counts()


# trading layer
pf = vbt.Portfolio.from_signals(
    df['Close'],
    entries = (df['go']==1), # long 포지션 진입
    exits = (df['go']==-1), # long 포지션 탈출
    fees = 0.0006, # 거래수수료 ( bybit ) 주문시 post-only
    # post-only True -> 무조건 지정한 가격에만 체결 / 수수료 낮게 지불 가능 / 실수해서 손해보는 경우가 없다. (시장가 체결 되는 케이스)
    tp_stop = 0.09, # take profit, 9% 이익 > 익절
    sl_stop = 0.02, # stop loss, 2% 손해 > 손절
    sl_trail = True, # 트레일링 스탑
    short_entries = (df['go']==-1), # short 포지션 진입
    short_exits = (df['go']==1) # short 포지션 탈출
)

# statistic layer
pf.stats()


# visualize layer
pf.plot().show()

# report layer



```
## About statistic

```
Start                         2024-02-01 12:00:00+00:00
End                           2024-03-01 08:00:00+00:00
Period                                 29 days 00:00:00
Start Value                                       100.0
End Value                                    109.572245
Total Return [%]                               9.572245
Benchmark Return [%]                           44.81877
Max Gross Exposure [%]                            100.0
Total Fees Paid                                0.833725
Max Drawdown [%]                               3.399299
Max Drawdown Duration                  19 days 00:00:00
Total Trades                                          7
Total Closed Trades                                   7
Total Open Trades                                     0
Open Trade PnL                                      0.0
Win Rate [%]                                  71.428571
Best Trade [%]                                10.168664
Worst Trade [%]                               -2.572038
Avg Winning Trade [%]                          2.720888
Avg Losing Trade [%]                           -1.95435
Avg Winning Trade Duration              1 days 13:36:00
Avg Losing Trade Duration               1 days 08:00:00
Profit Factor                                  3.459934
Expectancy                                     1.367464
Sharpe Ratio                                   4.562917
Calmar Ratio                                  63.540884
Omega Ratio                                    1.573677
Sortino Ratio                                  8.072026
dtype: object
```

1. **시작일자 (Start):** 2024년 2월 1일부터 백테스팅이 시작된 날짜 및 시간.

2. **종료일자 (End):** 2024년 3월 1일까지의 백테스팅 종료일자 및 시간.

3. **기간 (Period):** 전체 백테스팅 기간으로, 29일 동안 진행됨.

4. **시작 자본금 (Start Value):** 백테스팅 초기 투자금으로, 100.0 단위.

5. **종료 자본금 (End Value):** 백테스팅 종료 시의 자본금.

6. **총 수익률 [%] (Total Return [%]):** 전체 기간 동안의 수익률. 현재는 9.572245%로 나타남.

7. **벤치마크 수익률 [%] (Benchmark Return [%]):** 벤치마크 수익률로, 현재는 44.81877%로 나타남.

8. **최대 총 노출 비율 [%] (Max Gross Exposure [%]):** 전체 포트폴리오의 최대 노출 비율로, 현재는 100.0%로 나타남.

9. **총 수수료 지불액 (Total Fees Paid):** 전체 백테스팅 기간 동안 지불된 총 수수료.

10. **최대 손실률 [%] (Max Drawdown [%]):** 포트폴리오가 최대로 손실을 본 비율.

11. **최대 손실률 지속 기간 (Max Drawdown Duration):** 최대 손실률이 지속된 기간.

12. **총 거래 횟수 (Total Trades):** 전체 거래 횟수.

13. **총 체결된 거래 횟수 (Total Closed Trades):** 완료된 거래의 총 횟수.

14. **총 미체결 거래 횟수 (Total Open Trades):** 아직 완료되지 않은 거래의 총 횟수.

15. **미체결 거래 손익 (Open Trade PnL):** 아직 완료되지 않은 거래의 손익.

16. **승률 [%] (Win Rate [%]):** 전체 거래 중 이긴 거래의 비율.

17. **최대 수익률 [%] (Best Trade [%]):** 단일 거래 중 최대 수익률.

18. **최대 손실률 [%] (Worst Trade [%]):** 단일 거래 중 최대 손실률.

19. **평균 이긴 거래 수익률 [%] (Avg Winning Trade [%]):** 이긴 거래의 평균 수익률.

20. **평균 진 거래 손실률 [%] (Avg Losing Trade [%]):** 진 거래의 평균 손실률.

21. **평균 이긴 거래 기간 (Avg Winning Trade Duration):** 이긴 거래의 평균 기간.

22. **평균 진 거래 기간 (Avg Losing Trade Duration):** 진 거래의 평균 기간.

23. **수익 요인 (Profit Factor):** 이긴 거래 대비 진 거래의 비율.

24. **기대값 (Expectancy):** 평균적으로 기대되는 수익.

25. **샤프 비율 (Sharpe Ratio):** 투자에 대한 리스크 대비 수익의 비율.

26. **칼마 비율 (Calmar Ratio):** 최대 손실 대비 연간 수익의 비율.

27. **오메가 비율 (Omega Ratio):** 이긴 거래와 진 거래의 비율을 고려한 측정 지표.

28. **소르티노 비율 (Sortino Ratio):** 리스크를 고려하여 계산된 수익 대비 비율.