---
sidebar_position: 8
---

# vectorbt - 정배열 SMAIndicator


## 1Pager


### Hypothesis

이동평균선을 이용한 슈퍼 상승장(정배열) 매매 기법이다. 
- SMAIndicator 문서  
- https://technical-analysis-library-in-python.readthedocs.io/en/latest/ta.html#ta.trend.SMAIndicator



### Long Position  

매수 조건 : 
- 현재 가격 > 3일 이평선  
- 현재 가격 > 5일 이평선  
- 현재 가격 > 10일 이평선  
- 현재 가격 > 20일 이평선  

1일 1회 체크  


### Short Position
- Condition  
- StopLoss


## Result - BTC/USDT, 1d  

```py
import numpy as np
import pandas as pd
import ccxt
import ta
import vectorbt as vbt
import quantstats as qs
import warnings

# data layer
df = vbt.CCXTData.download_symbol(
    "BTC/USDT",
    exchange='upbit',
    config=None,
    timeframe='1d',
    start='5 months ago', # '1 months ago'
    end='now UTC',
    delay=0.1,
    limit=500,
    retries=3,
    show_progress=True,
    params=None,
    tqdm_kwargs=None
)

# signal layer
df['ma3'] = ta.trend.SMAIndicator(df['Close'], 3).sma_indicator()
df['ma5'] = ta.trend.SMAIndicator(df['Close'], 5).sma_indicator()
df['ma10'] = ta.trend.SMAIndicator(df['Close'], 10).sma_indicator()
df['ma20'] = ta.trend.SMAIndicator(df['Close'], 20).sma_indicator()

straightArrangement = (df['Close'] > df['ma3']) & (df['ma3'] > df['ma5']) & (df['ma5'] > df['ma10']) & (df['ma10'] > df['ma20'])
reverseArrangement = (df['Close'] < df['ma3']) & (df['ma3'] < df['ma5']) & (df['ma5'] < df['ma10']) & (df['ma10'] < df['ma20'])

df['signal1'] = np.select([straightArrangement,reverseArrangement],[1,-1],0)

cond_go = [ df['signal1'] == 1, df['signal1'] == -1]
df['go'] = np.select(cond_go, [1,-1], 0)

# anomalo
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
    # short_entries = (df['go']==-1), # short 포지션 진입
    # short_exits = (df['go']==1) # short 포지션 탈출
)
pf.stats()

# visualize layer
pf.plot().show()

# report layer
pf.qs.plot_snapshot()
qs.plots.snapshot(pf.benchmark_returns())
```

### stats

```
Start                         2023-10-04 00:00:00+00:00
End                           2024-03-03 00:00:00+00:00
Period                                152 days 00:00:00
Start Value                                       100.0
End Value                                    187.185005
Total Return [%]                              87.185005
Benchmark Return [%]                         123.386994
Max Gross Exposure [%]                            100.0
Total Fees Paid                                0.217853
Max Drawdown [%]                              11.252809
Max Drawdown Duration                  32 days 00:00:00
Total Trades                                          2
Total Closed Trades                                   1
Total Open Trades                                     1
Open Trade PnL                                 55.61114
Win Rate [%]                                      100.0
Best Trade [%]                                 31.59281
Worst Trade [%]                                31.59281
Avg Winning Trade [%]                          31.59281
Avg Losing Trade [%]                                NaN
Avg Winning Trade Duration             88 days 00:00:00
Avg Losing Trade Duration                           NaT
Profit Factor                                       inf
Expectancy                                    31.573865
Sharpe Ratio                                    3.81679
Calmar Ratio                                  31.158288
Omega Ratio                                    1.938685
Sortino Ratio                                  7.161942
```


## Result - BTC/USDT, 4d

```py
import numpy as np
import pandas as pd
import ccxt
import ta
import vectorbt as vbt
import quantstats as qs
import warnings

# data layer
df = vbt.CCXTData.download_symbol(
    "BTC/USDT",
    exchange='upbit',
    config=None,
    timeframe='4h',
    start='6 months ago', # '1 months ago'
    end='now UTC',
    delay=0.1,
    limit=500,
    retries=3,
    show_progress=True,
    params=None,
    tqdm_kwargs=None
)

# signal layer
df['ma3'] = ta.trend.SMAIndicator(df['Close'], 3).sma_indicator()
df['ma5'] = ta.trend.SMAIndicator(df['Close'], 5).sma_indicator()
df['ma10'] = ta.trend.SMAIndicator(df['Close'], 10).sma_indicator()
df['ma20'] = ta.trend.SMAIndicator(df['Close'], 20).sma_indicator()

straightArrangement = (df['Close'] > df['ma3']) & (df['ma3'] > df['ma5']) & (df['ma5'] > df['ma10']) & (df['ma10'] > df['ma20'])
reverseArrangement = (df['Close'] < df['ma3']) & (df['ma3'] < df['ma5']) & (df['ma5'] < df['ma10']) & (df['ma10'] < df['ma20'])

df['signal1'] = np.select([straightArrangement,reverseArrangement],[1,-1],0)

cond_go = [ df['signal1'] == 1, df['signal1'] == -1]
df['go'] = np.select(cond_go, [1,-1], 0)

# anomalo
print("df['go'] \n",df['go'].value_counts())

returns = (df['Close'].iloc[-1] - df['Close'].iloc[0]) / df['Close'].iloc[0]
print("benchmark total return",returns*100)

# trading layer
pf = vbt.Portfolio.from_signals(
    df['Close'],
    entries = (df['go']==1), # long 포지션 진입
    exits = (df['go']==-1), # long 포지션 탈출
    fees = 0.0006, # 거래수수료 ( bybit ) 주문시 post-only
    # post-only True -> 무조건 지정한 가격에만 체결 / 수수료 낮게 지불 가능 / 실수해서 손해보는 경우가 없다. (시장가 체결 되는 케이스)
    # tp_stop = 0.09, # take profit, 9% 이익 > 익절
    # sl_stop = 0.02, # stop loss, 2% 손해 > 손절
    sl_trail = True, # 트레일링 스탑
    # short_entries = (df['go']==-1), # short 포지션 진입
    # short_exits = (df['go']==1) # short 포지션 탈출
)
print(pf.stats())

# visualize layer
pf.plot().show()

# report layer
pf.qs.plot_snapshot()
qs.plots.snapshot(pf.benchmark_returns())


```

### stats

```
Start                         2023-10-23 16:00:00+00:00
End                           2024-03-03 12:00:00+00:00
Period                                              493
Start Value                                       100.0
End Value                                    162.429861
Total Return [%]                              62.429861
Benchmark Return [%]                          99.950618
Max Gross Exposure [%]                            100.0
Total Fees Paid                                1.103005
Max Drawdown [%]                               7.654154
Max Drawdown Duration                              82.0
Total Trades                                          8
Total Closed Trades                                   8
Total Open Trades                                     0
Open Trade PnL                                      0.0
Win Rate [%]                                       75.0
Best Trade [%]                                 18.15682
Worst Trade [%]                               -2.501163
Avg Winning Trade [%]                          9.304526
Avg Losing Trade [%]                          -1.907836
Avg Winning Trade Duration                    47.333333
Avg Losing Trade Duration                          12.5
Profit Factor                                 15.859574
Expectancy                                     7.803733
```

## Result - BTC/USDT, 1h  

```py
import numpy as np
import pandas as pd
import ccxt
import ta
import vectorbt as vbt
import quantstats as qs
import warnings

# data layer
df = vbt.CCXTData.download_symbol(
    "BTC/USDT",
    exchange='upbit',
    config=None,
    timeframe='1h',
    start='6 months ago', # '1 months ago'
    end='now UTC',
    delay=0.1,
    limit=500,
    retries=3,
    show_progress=True,
    params=None,
    tqdm_kwargs=None
)

# signal layer
df['ma3'] = ta.trend.SMAIndicator(df['Close'], 3).sma_indicator()
df['ma5'] = ta.trend.SMAIndicator(df['Close'], 12).sma_indicator()
df['ma10'] = ta.trend.SMAIndicator(df['Close'], 36).sma_indicator()
df['ma20'] = ta.trend.SMAIndicator(df['Close'], 60).sma_indicator()

straightArrangement = (df['Close'] > df['ma3']) & (df['ma3'] > df['ma5']) & (df['ma5'] > df['ma10']) & (df['ma10'] > df['ma20'])
reverseArrangement = (df['Close'] < df['ma3']) & (df['ma3'] < df['ma5']) & (df['ma5'] < df['ma10']) & (df['ma10'] < df['ma20'])

df['signal1'] = np.select([straightArrangement,reverseArrangement],[1,-1],0)

cond_go = [ df['signal1'] == 1, df['signal1'] == -1]
df['go'] = np.select(cond_go, [1,-1], 0)

# anomalo
print("df['go'] \n",df['go'].value_counts())

returns = (df['Close'].iloc[-1] - df['Close'].iloc[0]) / df['Close'].iloc[0]
print("benchmark total return",returns*100)

# trading layer
pf = vbt.Portfolio.from_signals(
    df['Close'],
    entries = (df['go']==1), # long 포지션 진입
    exits = (df['go']==-1), # long 포지션 탈출
    fees = 0.0006, # 거래수수료 ( bybit ) 주문시 post-only
    # post-only True -> 무조건 지정한 가격에만 체결 / 수수료 낮게 지불 가능 / 실수해서 손해보는 경우가 없다. (시장가 체결 되는 케이스)
    # tp_stop = 0.09, # take profit, 9% 이익 > 익절
    # sl_stop = 0.02, # stop loss, 2% 손해 > 손절
    sl_trail = True, # 트레일링 스탑
    # short_entries = (df['go']==-1), # short 포지션 진입
    # short_exits = (df['go']==1) # short 포지션 탈출
)
print(pf.stats())

# visualize layer
pf.plot().show()

# report layer
pf.qs.plot_snapshot()
qs.plots.snapshot(pf.benchmark_returns())
```

### stats

```
Start                         2023-09-14 23:00:00+00:00
End                           2024-03-03 13:00:00+00:00
Period                                             1800
Start Value                                       100.0
End Value                                    171.915561
Total Return [%]                              71.915561
Benchmark Return [%]                         135.555664
Max Gross Exposure [%]                            100.0
Total Fees Paid                                 1.31256
Max Drawdown [%]                              10.752641
Max Drawdown Duration                             581.0
Total Trades                                          9
Total Closed Trades                                   9
Total Open Trades                                     0
Open Trade PnL                                      0.0
Win Rate [%]                                  55.555556
Best Trade [%]                                27.186123
Worst Trade [%]                               -3.204087
Avg Winning Trade [%]                         14.183444
Avg Losing Trade [%]                          -2.341058
Avg Winning Trade Duration                        202.2
Avg Losing Trade Duration                         41.25
Profit Factor                                  7.330472
Expectancy                                     7.990618
```

## summary  

- buy and hold win 