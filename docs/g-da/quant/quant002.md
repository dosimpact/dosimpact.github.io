---
sidebar_position: 2
---

# vectorbt - 가격데이터 가져오기


## 1분봉

upbit 
- [upbitAPI - 분(Minute) 캔들](https://docs.upbit.com/reference/%EB%B6%84minute-%EC%BA%94%EB%93%A4-1). 
- 캔들 200개 까지 호출 가능  
- 분 단위. 가능한 값 : 1, 3, 5, 15, 10, 30, 60, 240

### ccxt.upbit

```py
import numpy as np
import pandas as pd
import ccxt
import ta
import vectorbt as vbt

exchange = ccxt.upbit()
data = exchange.fetch_ohlcv('BTC/USDT', '4h')
df = pd.DataFrame(data, columns = ['Time', 'Open', 'High', 'Low', 'Close', 'Volume'])
df['Time'] = pd.to_datetime(df['Time'], unit='ms') # ms(long) > datetime
df

```

### vbt.CCXTData.download_symbol

- bulk download가 가능하다. 

```py
# download from
# - exchage, timeframe, start ~ end
# *delay, limit, retries ...

df = vbt.CCXTData.download_symbol(
    "BTC/USDT",
    exchange='upbit',
    config=None,
    timeframe='4h',
    start='1 months ago',
    end='now UTC',
    delay=None,
    limit=500,
    retries=3,
    show_progress=True,
    params=None,
    tqdm_kwargs=None
)
```