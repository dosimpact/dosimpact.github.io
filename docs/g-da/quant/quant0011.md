---
sidebar_position: 11
---

# vectorbt - 분할매수 + MA Gap ZScore

## 1Pager


### Hypothesis


### Long Position  

### Short Position


## Result - BTC/USDT, 1h  

```py

import numpy as np
import pandas as pd
import ccxt
import ta
import vectorbt as vbt
import quantstats as qs
import warnings
import time
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from scipy.stats import norm

# 데이터 호출 함수
def getHourlyOHLCV(days=100, ticker='BTC/USDT'):
  startSince = datetime.now() - timedelta(days)
  dfOHLCV = pd.DataFrame(columns=['Time', 'Open', 'High', 'Low', 'Close', 'Volume'])
  since = int(startSince.timestamp() * 1000)
  prevSince = None

  while True:
      data = ccxt.upbit().fetch_ohlcv(ticker, '1h', since)
      df = pd.DataFrame(data, columns=['Time', 'Open', 'High', 'Low', 'Close', 'Volume'])
      df['Time'] = pd.to_datetime(df['Time'], unit='ms')  # ms(long) > datetime

      dfOHLCV = pd.concat([dfOHLCV, df], ignore_index=True)
      since = int(dfOHLCV['Time'].iloc[-1].timestamp() * 1000) + 1 # +1ms for no dedup

      if since != None and prevSince == since:
        break

      prevSince = since
      time.sleep(0.1)

  dfOHLCV = dfOHLCV.drop_duplicates(subset=['Time']) # dedup
  dfOHLCV = dfOHLCV.set_index('Time').resample('1H').ffill() # backfill prev data
  return dfOHLCV

# 이상값 제거
def remove_outliers(series):
    rev_range = 3  # 제거 범위 조절 변수
    level_1q, level_3q = series.quantile(0.25), series.quantile(0.75)
    IQR = level_3q - level_1q
    return series[(series <= level_3q + (rev_range * IQR)) & (series >= level_1q - (rev_range * IQR))]

# ---- layer:data
dfOHLCV = getHourlyOHLCV(days=100,ticker="LINK/KRW")

# ---- layer:indicator
df = dfOHLCV.copy()
df['RowNum'] = df.reset_index().index
df['MA4'] = ta.trend.SMAIndicator(df['Close'],4).sma_indicator()
df['MA12'] = ta.trend.SMAIndicator(df['Close'], 12).sma_indicator()
df['MA24'] = ta.trend.SMAIndicator(df['Close'], 24).sma_indicator()
df['MA72'] = ta.trend.SMAIndicator(df['Close'], 72).sma_indicator()

# zscore
df['MA12Gap'] = df['Close'] - df['MA12']
df['MA12ZScore'] = (df['MA12Gap'] - df['MA12Gap'].expanding().mean()) / df['MA12Gap'].expanding().std()
df['MA12ZScore'] = remove_outliers(df['MA12ZScore'])


# ---- layer:signal
# long only
df['SignalMA12ZScore'] = np.select( [ df['MA12ZScore'] < df['MA12ZScore'].quantile(0.01), df['MA12ZScore'] > df['MA12ZScore'].quantile(0.99),  ],[1,0],0 )

# ---- layer:position
cond_go = [ (df['SignalMA12ZScore'] == 1) & (df['RowNum'] > 12*10), df['SignalMA12ZScore'] == -1 ]
df['go'] = np.select(cond_go, [1,-1], 0)
df['go'] = df['go'].mask(df['go'] == df['go'].shift(1), 0) # 최초값유지

df['size'] = (df[['go']].expanding().sum()*10).abs() # 분할매수 사이즈

# ---- layer:anomalo
plt.figure(figsize=(25,5))
plt.grid(True)
plt.hist([df['MA12ZScore']],bins=300,label=['a'])
plt.legend()
plt.show()

benchmarkTotlaReturns = ((df['Close'].iloc[-1] - df['Close'].iloc[0]) / df['Close'].iloc[0])*100
lastSize = df['size'][-1]
countGoTrue = df['go'].value_counts()[1]
countGoHold = df['go'].value_counts()[0]
countSignalMA12ZScoreTrue = df['SignalMA12ZScore'].value_counts()[1]
countSignalMA12ZScoreFalse = df['SignalMA12ZScore'].value_counts()[0]

print(f"countGoTrue {countGoTrue}")
print(f"countGoHold {countGoHold}")
print(f"countSignalMA12ZScoreTrue {countSignalMA12ZScoreTrue}")
print(f"countSignalMA12ZScoreFalse {countSignalMA12ZScoreFalse}")
print(f"benchmarkTotlaReturns {benchmarkTotlaReturns}")
print(f"lastSize {lastSize}")

# layer:trading
pf = vbt.Portfolio.from_signals(
    df['Close'],
    entries = (df['go']==1), # long 포지션 진입
    exits = (df['go']==-1), # long 포지션 탈출
    sl_stop = 0.3, # stop loss, 10% 손해 > 손절
    sl_trail = True, # 트레일링 스탑
    fees = 0.0006, # 거래수수료 ( bybit ) 주문시 post-only
    # allow_partial = True,
    size_type = 1, # Value 1 | Percent 2 | TargetValue 4
    size = df['size'],
    log=True,
    freq='1H',
    accumulate = True # 분할 매수 가능하게, 기본값=False > 매수 후 Hold
    # post-only True -> 무조건 지정한 가격에만 체결 / 수수료 낮게 지불 가능 / 실수해서 손해보는 경우가 없다. (시장가 체결 되는 케이스)
    # tp_stop = 0.09, # take profit, 9% 이익 > 익절
    # short_entries = (df['go']==-1), # short 포지션 진입
    # short_exits = (df['go']==1) # short 포지션 탈출
)
print(pf.stats())

# layer:visualize
pf.plot().show()


# layer:report
pf.qs.plot_snapshot()
qs.plots.snapshot(pf.benchmark_returns())

# layer:notice
buyNotice = (df.tail(4)['go'] == 1).any()



```

### stats

```
Start                         2023-11-25 08:00:00
End                           2024-03-04 07:00:00
Period                          100 days 00:00:00
Start Value                                 100.0
End Value                              168.937901
Total Return [%]                        68.937901
Benchmark Return [%]                    68.358269
Max Gross Exposure [%]                      100.0
Total Fees Paid                          0.322645
Max Drawdown [%]                        19.575762
Max Drawdown Duration            30 days 12:00:00
Total Trades                                    3
Total Closed Trades                             2
Total Open Trades                               1
Open Trade PnL                          64.883777
Win Rate [%]                                 50.0
Best Trade [%]                          14.855785
Worst Trade [%]                         -9.403154
Avg Winning Trade [%]                   14.855785
Avg Losing Trade [%]                    -9.403154
Avg Winning Trade Duration       47 days 14:00:00
Avg Losing Trade Duration        10 days 12:00:00
Profit Factor                            1.375634
Expectancy                               2.027062
Sharpe Ratio                             2.920345
Calmar Ratio                            29.524251
Omega Ratio                               1.09474
Sortino Ratio                            4.242156

```

![Alt text](image-7.png)


## Result - LINK/KRW, 1h - TC2

매도 : -10% drawdown 손실

### stats

```
benchmark total return 43.658413340070744
Start                         2023-11-25 08:00:00
End                           2024-03-04 07:00:00
Period                          100 days 00:00:00
Start Value                                 100.0
End Value                              134.324584
Total Return [%]                        34.324584
Benchmark Return [%]                    43.658413
Max Gross Exposure [%]                      100.0
Total Fees Paid                          0.888398
Max Drawdown [%]                        24.620326
Max Drawdown Duration            54 days 06:00:00
Total Trades                                    8
Total Closed Trades                             7
Total Open Trades                               1
Open Trade PnL                          10.461915
Win Rate [%]                            42.857143
Best Trade [%]                          25.874756
Worst Trade [%]                         -9.663215
Avg Winning Trade [%]                   17.630381
Avg Losing Trade [%]                    -6.444443
Avg Winning Trade Duration       13 days 10:20:00
Avg Losing Trade Duration         7 days 15:15:00
Profit Factor                            1.949065
Expectancy                               3.408953
Sharpe Ratio                             1.879882
Calmar Ratio                             7.863738
Omega Ratio                              1.064586
Sortino Ratio                            2.685104
dtype: object
```

## Result - LINK/KRW, 1h - TC3

매도 : -20% drawdown 손실

### stats

```
Start                         2023-11-25 08:00:00
End                           2024-03-04 07:00:00
Period                          100 days 00:00:00
Start Value                                 100.0
End Value                              129.473206
Total Return [%]                        29.473206
Benchmark Return [%]                    43.759474
Max Gross Exposure [%]                      100.0
Total Fees Paid                          0.265968
Max Drawdown [%]                        30.675143
Max Drawdown Duration            55 days 07:00:00
Total Trades                                    3
Total Closed Trades                             2
Total Open Trades                               1
Open Trade PnL                          48.190837
Win Rate [%]                                  0.0
Best Trade [%]                          -9.617927
Worst Trade [%]                        -10.079824
Avg Winning Trade [%]                         NaN
Avg Losing Trade [%]                    -9.848875
Avg Winning Trade Duration                    NaT
Avg Losing Trade Duration        16 days 20:00:00
Profit Factor                                 0.0
Expectancy                              -9.358816
Sharpe Ratio                             1.638765
Calmar Ratio                             5.108964
Omega Ratio                              1.053357
Sortino Ratio                            2.355005
```

## Result - LINK/KRW, 1h - TC3

매도 : -10% drawdown 손실

### stats

```

```


## Result - LINK/KRW, 1h - TC4

매도 : -30% drawdown 손실
매집 : df['MA12ZScore'] < df['MA12ZScore'].quantile(0.01)

### stats

```
Start                         2023-11-25 09:00:00
End                           2024-03-04 08:00:00
Period                          100 days 00:00:00
Start Value                                 100.0
End Value                               135.95403
Total Return [%]                         35.95403
Benchmark Return [%]                    43.574297
Max Gross Exposure [%]                      100.0
Total Fees Paid                          0.059964
Max Drawdown [%]                        25.721672
Max Drawdown Duration            35 days 13:00:00
Total Trades                                    1
Total Closed Trades                             0
Total Open Trades                               1
Open Trade PnL                           35.95403
Win Rate [%]                                  NaN
Best Trade [%]                                NaN
Worst Trade [%]                               NaN
Avg Winning Trade [%]                         NaN
Avg Losing Trade [%]                          NaN
Avg Winning Trade Duration                    NaT
Avg Losing Trade Duration                     NaT
Profit Factor                                 NaN
Expectancy                                    NaN
Sharpe Ratio                             1.880543
Calmar Ratio                              8.04062
Omega Ratio                              1.060568
Sortino Ratio                             2.71913
dtype: object
```


## Result - LINK/KRW, 1h - TC5

매도 : -30% drawdown 손실  
매집 : df['MA12ZScore'] < df['MA12ZScore'].quantile(0.01) , 2  
매집 : df['MA24ZScore'] < df['MA24ZScore'].quantile(0.01) , 8  

```py

# ---- layer:indicator
df = dfOHLCV.copy()
df['RowNum'] = df.reset_index().index
df['MA4'] = ta.trend.SMAIndicator(df['Close'],4).sma_indicator()
df['MA12'] = ta.trend.SMAIndicator(df['Close'], 12).sma_indicator()
df['MA24'] = ta.trend.SMAIndicator(df['Close'], 24).sma_indicator()
df['MA72'] = ta.trend.SMAIndicator(df['Close'], 72).sma_indicator()

# zscore
df['MA12Gap'] = df['Close'] - df['MA12']
df['MA12ZScore'] = (df['MA12Gap'] - df['MA12Gap'].expanding().mean()) / df['MA12Gap'].expanding().std()
df['MA12ZScore'] = remove_outliers(df['MA12ZScore'])

df['MA24Gap'] = df['Close'] - df['MA24']
df['MA24ZScore'] = (df['MA24Gap'] - df['MA24Gap'].expanding().mean()) / df['MA24Gap'].expanding().std()
df['MA24ZScore'] = remove_outliers(df['MA24ZScore'])

# ---- layer:signal
# long only
df['SignalMA12ZScore'] = np.select( [ df['MA12ZScore'] < df['MA12ZScore'].quantile(0.01), df['MA12ZScore'] > df['MA12ZScore'].quantile(0.99),  ],[1,0],0 )
df['SignalMA24ZScore'] = np.select( [ df['MA24ZScore'] < df['MA24ZScore'].quantile(0.01), df['MA24ZScore'] > df['MA24ZScore'].quantile(0.99),  ],[1,0],0 )

# ---- layer:position
cond_go = [ (df['RowNum'] > 12*10) & (df['SignalMA12ZScore'] == 1) , df['SignalMA12ZScore'] == -1 ]
df['go1'] = np.select(cond_go, [1,-1], 0)
df['go1'] = df['go1'].mask(df['go1'] == df['go1'].shift(1), 0) # 최초값유지

cond_go = [ (df['RowNum'] > 12*10) & (df['SignalMA24ZScore'] == 1) , df['SignalMA12ZScore'] == -1 ]
df['go2'] = np.select(cond_go, [1,-1], 0)
df['go2'] = df['go2'].mask(df['go2'] == df['go2'].shift(1), 0) # 최초값유지

result_df = pd.concat([(df[['go1']].expanding().sum()*2).abs(), (df[['go2']].expanding().sum()*8).abs()], axis=1 )
df['go'] = df['go1'] & df['go2']
df['size'] = result_df.sum(axis=1)

# df['size'] = (df[['go1']].expanding().sum()*1).abs() + (df[['go2']].expanding().sum()*5).abs() # 분할매수 사이즈

# ---- layer:anomalo
plt.figure(figsize=(25,5))
plt.grid(True)
plt.hist([df['MA12ZScore']],bins=300,label=['a'])
plt.legend()
plt.show()

benchmarkTotlaReturns = ((df['Close'].iloc[-1] - df['Close'].iloc[0]) / df['Close'].iloc[0])*100
lastSize = df['size'][-1]
countGoTrue = df['go'].value_counts()[1]
countGoHold = df['go'].value_counts()[0]
countSignalMA12ZScoreTrue = df['SignalMA12ZScore'].value_counts()[1]
countSignalMA12ZScoreFalse = df['SignalMA12ZScore'].value_counts()[0]

print(f"countGoTrue {countGoTrue}")
print(f"countGoHold {countGoHold}")
print(f"countSignalMA12ZScoreTrue {countSignalMA12ZScoreTrue}")
print(f"countSignalMA12ZScoreFalse {countSignalMA12ZScoreFalse}")
print(f"benchmarkTotlaReturns {benchmarkTotlaReturns}")
print(f"lastSize {lastSize}")

# layer:trading
pf = vbt.Portfolio.from_signals(
    df['Close'],
    entries = (df['go']>=1), # long 포지션 진입
    exits = (df['go']<=-1), # long 포지션 탈출
    sl_stop = 0.3, # stop loss, 10% 손해 > 손절
    sl_trail = True, # 트레일링 스탑
    fees = 0.0006, # 거래수수료 ( bybit ) 주문시 post-only
    # allow_partial = True,
    size_type = 1, # Value 1 | Percent 2 | TargetValue 4
    size = df['size'],
    log=True,
    freq='1H',
    accumulate = True # 분할 매수 가능하게, 기본값=False > 매수 후 Hold
    # post-only True -> 무조건 지정한 가격에만 체결 / 수수료 낮게 지불 가능 / 실수해서 손해보는 경우가 없다. (시장가 체결 되는 케이스)
    # tp_stop = 0.09, # take profit, 9% 이익 > 익절
    # short_entries = (df['go']==-1), # short 포지션 진입
    # short_exits = (df['go']==1) # short 포지션 탈출
)
print(pf.stats())

# layer:visualize
pf.plot().show()


# layer:report
pf.qs.plot_snapshot()
qs.plots.snapshot(pf.benchmark_returns())

# layer:notice
buyNotice = (df.tail(4)['go'] == 1).any()
```

### stats
![Alt text](image-8.png)
```
lastSize 108.0
Start                         2023-11-25 09:00:00
End                           2024-03-04 08:00:00
Period                          100 days 00:00:00
Start Value                                 100.0
End Value                              144.534144
Total Return [%]                        44.534144
Benchmark Return [%]                    43.574297
Max Gross Exposure [%]                      100.0
Total Fees Paid                          0.059964
Max Drawdown [%]                        17.492328
Max Drawdown Duration            17 days 01:00:00
Total Trades                                    1
Total Closed Trades                             0
Total Open Trades                               1
Open Trade PnL                          44.534144
Win Rate [%]                                  NaN
Best Trade [%]                                NaN
Worst Trade [%]                               NaN
Avg Winning Trade [%]                         NaN
Avg Losing Trade [%]                          NaN
Avg Winning Trade Duration                    NaT
Avg Losing Trade Duration                     NaT
Profit Factor                                 NaN
Expectancy                                    NaN
Sharpe Ratio                             2.563104
Calmar Ratio                            16.213507
Omega Ratio                              1.091704
Sortino Ratio                            3.855461
```