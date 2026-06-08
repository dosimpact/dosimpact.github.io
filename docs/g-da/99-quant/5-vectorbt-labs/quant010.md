---
sidebar_position: 10
---

# vectorbt - 변동성 돌파

## 1Pager


### Hypothesis

이동평균선을 이용한 슈퍼 상승장(정배열) 매매 기법이다. 
- SMAIndicator 문서  
- https://technical-analysis-library-in-python.readthedocs.io/en/latest/ta.html#ta.trend.SMAIndicator


1일 1회 체크  

### Long Position  

매수 조건 : 
- 현재 가격 > 3일 이평선  
- 현재 가격 > 5일 이평선  
- 현재 가격 > 10일 이평선  
- 현재 가격 > 20일 이평선  



### Short Position

매수 조건 : 
- 현재 가격 < 3일 이평선  
- 현재 가격 < 5일 이평선  
- 현재 가격 < 10일 이평선  
- 현재 가격 < 20일 이평선  

## Result - LINK/KRW, 1h  

```py

import numpy as np
import pandas as pd
import ccxt
import ta
import vectorbt as vbt
import quantstats as qs
import warnings
warnings.filterwarnings('ignore')

# data layer
dfOHLCV = vbt.CCXTData.download_symbol(
    "LINK/KRW",
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
df = dfOHLCV.copy()
df['MA3'] = ta.trend.SMAIndicator(df['Close'], 3).sma_indicator()
df['MA5'] = ta.trend.SMAIndicator(df['Close'], 5).sma_indicator()
df['MA10'] = ta.trend.SMAIndicator(df['Close'], 10).sma_indicator()
df['MA20'] = ta.trend.SMAIndicator(df['Close'], 20).sma_indicator()

# K Range
dfRolling = df.rolling(window='24H').agg({
    'High': 'max',
    'Low': 'min'
})
dfRolling.columns = ['HighMax24h','LowMin24h']
df = pd.concat([df,dfRolling],axis=1)

K = 0.5
df['TargetOpen'] = ((df['HighMax24h'] - df['LowMin24h']) * K + df['Open']).shift(1)
df['SignalVB'] = df['TargetOpen'] >= df['Open']
df['SignalBullMarket'] = (df['Close'] > df['MA20'])


cond_go = [ (df['SignalVB'] == 1) & (df['SignalBullMarket'] == 1), df['SignalBullMarket'] == None ]
cond_go


# straightArrangement = (df['Close'] > df['MA3']) & (df['MA3'] > df['MA5']) & (df['MA5'] > df['MA10']) & (df['MA10'] > df['MA20'])

# reverseArrangement = (df['Close'] < df['MA3']) & (df['MA3'] < df['MA5']) & (df['MA5'] < df['MA10']) & (df['MA10'] < df['MA20'])

# df['signal1'] = np.select([straightArrangement,reverseArrangement],[1,-1],0)

cond_go = [ (df['SignalVB'] == 1) & (df['SignalBullMarket'] == 1), df['SignalBullMarket'] == None ]
df['go'] = np.select(cond_go, [1,0], 0)

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
    sl_stop = 0.02, # stop loss, 2% 손해 > 손절
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
Start                         2023-09-16 04:00:00+00:00
End                           2024-03-03 15:00:00+00:00
Period                                             1800
Start Value                                       100.0
End Value                                    267.320012
Total Return [%]                             167.320012
Benchmark Return [%]                         236.342321
Max Gross Exposure [%]                            100.0
Total Fees Paid                               15.026397
Max Drawdown [%]                              26.957419
Max Drawdown Duration                             632.0
Total Trades                                         66
Total Closed Trades                                  66
Total Open Trades                                     0
Open Trade PnL                                      0.0
Win Rate [%]                                  40.909091
Best Trade [%]                                53.020302
Worst Trade [%]                               -8.637867
Avg Winning Trade [%]                          6.883528
Avg Losing Trade [%]                          -1.752337
Avg Winning Trade Duration                    27.592593
Avg Losing Trade Duration                     10.948718
Profit Factor                                  2.256687
Expectancy                                     2.535152

```