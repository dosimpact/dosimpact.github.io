---
sidebar_position: 2
---

# react-native Webview 구축 


## 안드로이드 Intent 문제  

문제  
- 웹뷰 안에서 JS SDK방식의 카카오 로그인 (하이브리드)은 안드로이드 환경에서 오류가 발생한다.  
- 이유는 Intent를 제대로 처리하지 못함에 있다.   
- 원래는 크롬 웹뷰 컴포넌트를 사용했는데, 버전이 업데이트되면서 크로미움으로 변경되었고 이는 Intent기능이 없다.  
- 따라서, Intent를 적절한 네이티브 시스템에 보내줘야 한다.  

해결  

version 문제 ... ㅅㅂㅅㅂㅅ 
- 은인 : https://liveforownhappiness.tistory.com/110


```js
// 공식문서 내용은 out of date 되었다. 그대로 따라하다가는 오류가 발생한다.  
// 최신 gradle 에 맞게 몇몇 설정을 변경 해야 한다.  

---
yarn add react-native-send-intent@^1.3.0

--- 
// android/MainApplication.java 에 추가 
...
import com.burnweb.rnsendintent.RNSendIntentPackage;  


---
// AndroidManifest.xml 에 추가
// android:autoVerify="true" : 애플리케이션의 링크를 자동으로 검증 후 앱 자동 오픈  
// 	android.intent.category.DEFAULT:
//	•	일반적인 인텐트 필터로, 사용자가 명시적으로 지정하지 않는 한, 이 카테고리와 일치하는 인텐트 필터가 기본으로 선택돼요.
//	•	android.intent.category.BROWSABLE:
//	•	브라우저에서 인텐트를 호출할 수 있게 해줘요. 주로 외부에서 URI를 열 때 사용돼요.

        <intent-filter android:autoVerify="true">
            ...
            + <action android:name="android.intent.action.VIEW" />
            + <category android:name="android.intent.category.DEFAULT" />
            + <category android:name="android.intent.category.BROWSABLE" />
        </intent-filter>

---

// android/app/build.gradle
// Compile을 더이상 안쓴다. 그리고 :react-native-send-intent 라고 적어준다.  
// MainApplication.java 에도 패키지 추가 없이 import만으로도 된다.  
dependencies{
   ...
   implementation project(':react-native-send-intent')
}

---


```

```js
import React, {useRef} from 'react';
import {
  StatusBar,
  useColorScheme,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import useWebviewInjector from './hooks/useWebviewInjector';
import SendIntentAndroid from 'react-native-send-intent';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';

// Intent URL에서 fallback URL을 추출하는 함수
const extractFallbackUrl = (intentUrl: string) => {
  const match = intentUrl.match(/S\.browser_fallback_url=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

function App(): JSX.Element {
  const webviewRef = useRef<WebView>(null);
  const injectedJavaScript = useWebviewInjector();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    // const data = JSON.parse(event.nativeEvent.data);
    //   if (data.type === 'selectPhoto') {
    //     navigation.navigate('SelectImage');
    //   }
  };

  const onShouldStartLoadWithRequest = (event: ShouldStartLoadRequest) => {
    if (Platform.OS === 'android' && event.url.includes('intent')) {
      SendIntentAndroid.openChromeIntent(event.url)
        .then(isOpened => {
          if (!isOpened) {
            const fallbackUrl = extractFallbackUrl(event.url);
            if (fallbackUrl) {
              Linking.openURL(fallbackUrl);
            } else {
              Linking.openURL(event.url).catch(err => {
                Alert(
                  '앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.',
                );
              });
            }
          }
          console.log(event.url);
          return false;
        })
        .catch(err => {
          Alert('앱 실행에 실패했습니다.');
        });
      return false;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <WebView
        ref={webviewRef}
        style={{flex: 1}}
        source={{
          uri: 'https://www.example.com',
        }}
        originWhitelist={['*']}
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
        javaScriptEnabled
        javaScriptCanOpenWindowsAutomatically={true}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded=""
        injectedJavaScript={injectedJavaScript}
        onContentProcessDidTerminate={() => {
          webviewRef.current?.reload();
        }}
        onLoadEnd={() => {
          // SplashScreen.hideAsync();
        }}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
    </SafeAreaView>
  );
}

export default App;

```