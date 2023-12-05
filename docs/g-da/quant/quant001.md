---
sidebar_position: 1
---

# 백테스팅 라이브러리 vectorbt 1

## 소개
---

### Gooal vectorbt lecture   

- 주요 라이브러리로 매매전략 구현 방법  
- 대표적인 지표의 개념 및 구현 방법  
- 최적화된 지표로 나만의 input 찾는 법 
- 고정 Take Profit / Stop Loss 설정법  
- 전략 비교하기  
- 텔레그램 매매 시그널 전송   

<br/>

### 라이브러리 리스트 및 설명

- ccxt : 가격 데이터 API 
- ta : 기술적 분석 라이브러리 
  - https://technical-analysis-library-in-python.readthedocs.io/en/latest/ta.html
- vectorbt : 백테스트팅 라이브러리
  - 현재 1버전까지는 아니지만, 0.24버전이고 충분히 백테스트 기능을 수행 가능하다. 
  - https://vectorbt.dev/api/data/custom/#vectorbt.data.custom.CCXTData 
- QuantStats : 리포트 라이브러리  


## 구현 예제


### 개발환경 

- python 3.10  
- google colab

### goal 

Long Position 
- MA 10 > MA 30 
- 0 <= RSI <= 50

Short Position 
- MA 10 < MA 30 
- 50 < RSI

output : Backtest ? 


### install

```
from google.colab import drive
# drive.mount('/content/drive')

# install packages
# !pip install QuantStats
# !pip install finance_datareader
# !pip install dart-fss
# !pip install opendartreader
# !pip install pybithumb
# !pip install backtrader
# !pip install redis
# !pip install yfinance
# !pip install python-binance
# !pip install beautifulsoup4
# !pip install requests
# !pip install QuantStats
!pip install ccxt
!pip install ta
!pip install vectorbt
```

## code

```py
import ccxt
import pandas as pd
import ta
import numpy as np
import vectorbt as vbt


# download from 
# - exchage, timeframe, start ~ end
# *delay, limit, retries ... 

df = vbt.CCXTData.download_symbol(
    "BTC/USDT",
    exchange='upbit',
    config=None,
    timeframe='1h',
    start='2 months ago',
    end='now UTC',
    delay=None,
    limit=500,
    retries=3,
    show_progress=True,
    params=None,
    tqdm_kwargs=None
)

# signal
df['ma10'] = ta.trend.SMAIndicator(df['Close'], 10).sma_indicator()
df['ma30'] = ta.trend.SMAIndicator(df['Close'], 30).sma_indicator()
df['rsi'] = ta.momentum.RSIIndicator(df['Close']).rsi()

df['signal'] = np.where(  df['rsi'].between(0, 50), 1, -1)
df['signal2'] = np.select([ df['ma10']>df['ma30'], df['ma30']>df['ma10']], [1,-1],  0 )

cond_go = [(df['signal'] == 1 ) & (df['signal2'] == 1),(df['signal'] == -1 ) & (df['signal2'] == -1)]
df['go'] = np.select(cond_go, [1,-1], 0)

# preview 
df['go'].value_counts()


# running bt
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

# result 
pf.stats()

# report - plotly.js
pf.plot().show()


```

---

참고) 자주 사용하는 np
  - np.where   
  - np,select  
  - np.arrange 

```
np.where( df["rsi"] > 10, 1, -1)
np.where( df["close"] > df["ma10"], 1, -1)
np.where( df["rsi"].between(5,15) , 1, -1)

# *시그널 컬럼의 정의 => 1은 Long 포지션 유지, -1은 Short 포지션 유지  
( 시그널 값의 변경은 포지션 변경을 의미한다 ) 

np['signal'] = np.select( [ rsi <50, rsi > 50], [1,-1], 0) 
- if, elif, else 를 한문장으로 가능.

```

