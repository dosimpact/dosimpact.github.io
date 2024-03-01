
# python schedule 


## 스케쥴 문서 

문서 : https://schedule.readthedocs.io/en/stable/  


```py
# $ pip install schedule

import schedule
import time

def job():
    print("I'm working...")

schedule.every(10).minutes.do(job)
schedule.every().hour.do(job)
schedule.every().day.at("10:30").do(job)
schedule.every().monday.do(job)
schedule.every().wednesday.at("13:15").do(job)
schedule.every().day.at("12:42", "Europe/Amsterdam").do(job)
schedule.every().minute.at(":17").do(job)

while True:
    schedule.run_pending()
    time.sleep(1)

```


## 예) vt - ScheduleManager

```py

import numpy as np
import pandas as pd
import ccxt
import ta
import vectorbt as vbt
import requests

def engulfing_rsi():
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
    df['signal_engulfing'] = 0
    
    for current in range(1, len(df.index)):
        previous = current - 1
        if df.iat[current, 3] > df.iat[previous, 0]:
            if df.iat[current, 0] < df.iat[previous, 3]:
                df.iat[current, 5] = 1
        elif df.iat[current, 3] < df.iat[previous, 0]:
            if df.iat[current, 0] > df.iat[previous, 3]:
                df.iat[current, 5] = -1

    df['rsi'] = ta.momentum.RSIIndicator(df['Close']).rsi()
    cond_rsi = [ df['rsi'] < 30, df['rsi'] > 60 ]
    df['signal_rsi'] = np.select(cond_rsi, [1,-1], 0)
    
    cond_go = [ (df['signal_engulfing'] == 1) & (df['signal_rsi'] == 1), 
               (df['signal_engulfing'] == -1) & (df['signal_rsi'] == -1)  ]
    df['go'] =np.select(cond_go, [1, -1], 0)
    
    pf = vbt.Portfolio.from_signals(df['Close'], 
                                entries = (df['go'] == 1), 
                                exits = (df['go'] == -1), 
                                fees = 0.0006,
                                tp_stop = 0.09,
                                sl_stop = 0.03,
                                short_entries = (df['go'] == -1),
                                short_exits = (df['go'] == 1)                                                         
                               )
    
    return df['go'].iloc[-1], df['Close'].iloc[-1]

list_strategy = [engulfing_rsi]

def get_signal():
    for strategy in list_strategy:
        (go, closing_price) = strategy()
        if go == 1:
            requests.get(f'{base_url}{strategy.__name__}_LONG @ {closing_price}')
        elif go == -1:
            requests.get(f'{base_url}{strategy.__name__}_SHORT @ {closing_price}')


base_url = 'https://api.telegram.org/bot7021924962:AAET_xxx-0WKc/sendmessage?chat_id=-xxxx&text='

get_signal()
manager = vbt.ScheduleManager()
manager.every().minutes.do(get_signal)
manager.start()
```