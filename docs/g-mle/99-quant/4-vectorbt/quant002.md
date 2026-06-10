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

### upbit candle collector (ccxt, hourly)   

ccxt.upbit.hourly

```py
import numpy as np
import pandas as pd
import ccxt
from datetime import datetime, timedelta
import time



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
  # dfOHLCV = dfOHLCV.set_index('Time').resample('1H').asfreq()
  dfOHLCV = dfOHLCV.set_index('Time').resample('1H').ffill() # backfill prev data
  return dfOHLCV
  # return dfOHLCV 

dfOHLCV = getHourlyOHLCV()
dfOHLCV
```