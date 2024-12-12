---
sidebar_position: 1
---

# 채널톡 연동하기 

## 채널톡 연동하기 with next.js  

1.스크립트 삽입하기 
2.boot 함수 호출 with pluginKey  
2.1 익명유저가 아니라면 사용자 정보를 같이 남긴다.  


>https://developers.channel.io/reference/web-quickstart-kr#typescript%EB%A5%BC-%EC%9C%84%ED%95%9C-service  

```js
// ChannelTalk.tsx
declare global {
  interface Window {
    ChannelIO?: IChannelIO;
    ChannelIOInitialized?: boolean;
  }
}

interface IChannelIO {
  c?: (...args: any) => void;
  q?: [methodName: string, ...args: any[]][];
  (...args: any): void;
}

interface BootOption {
  appearance?: string;
  customLauncherSelector?: string;
  hideChannelButtonOnBoot?: boolean;
  hidePopup?: boolean;
  language?: string;
  memberHash?: string;
  memberId?: string;
  pluginKey: string;
  profile?: Profile;
  trackDefaultEvent?: boolean;
  trackUtmSource?: boolean;
  unsubscribe?: boolean;
  unsubscribeEmail?: boolean;
  unsubscribeTexting?: boolean;
  zIndex?: number;
}

interface Callback {
  (error: Error | null, user: CallbackUser | null): void;
}

interface CallbackUser {
  alert: number;
  avatarUrl: string;
  id: string;
  language: string;
  memberId: string;
  name?: string;
  profile?: Profile | null;
  tags?: string[] | null;
  unsubscribeEmail: boolean;
  unsubscribeTexting: boolean;
}

interface UpdateUserInfo {
  language?: string;
  profile?: Profile | null;
  profileOnce?: Profile;
  tags?: string[] | null;
  unsubscribeEmail?: boolean;
  unsubscribeTexting?: boolean;
}

interface Profile {
  [key: string]: string | number | boolean | null | undefined;
}

interface FollowUpProfile {
  name?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
}

interface EventProperty {
  [key: string]: string | number | boolean | null | undefined;
}

type Appearance = "light" | "dark" | "system" | null;

class ChannelService {
  loadScript() {
    (function () {
      var w = window;
      if (w.ChannelIO) {
        return w.console.error("ChannelIO script included twice.");
      }
      var ch: IChannelIO = function () {
        ch.c?.(arguments);
      };
      ch.q = [];
      ch.c = function (args) {
        ch.q?.push(args);
      };
      w.ChannelIO = ch;
      function l() {
        if (w.ChannelIOInitialized) {
          return;
        }
        w.ChannelIOInitialized = true;
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
        var x = document.getElementsByTagName("script")[0];
        if (x.parentNode) {
          x.parentNode.insertBefore(s, x);
        }
      }
      if (document.readyState === "complete") {
        l();
      } else {
        w.addEventListener("DOMContentLoaded", l);
        w.addEventListener("load", l);
      }
    })();
  }

  boot(option: BootOption, callback?: Callback) {
    window.ChannelIO?.("boot", option, callback);
  }

  shutdown() {
    window.ChannelIO?.("shutdown");
  }

  showMessenger() {
    window.ChannelIO?.("showMessenger");
  }

  hideMessenger() {
    window.ChannelIO?.("hideMessenger");
  }

  openChat(chatId?: string | number, message?: string) {
    window.ChannelIO?.("openChat", chatId, message);
  }

  track(eventName: string, eventProperty?: EventProperty) {
    window.ChannelIO?.("track", eventName, eventProperty);
  }

  onShowMessenger(callback: () => void) {
    window.ChannelIO?.("onShowMessenger", callback);
  }

  onHideMessenger(callback: () => void) {
    window.ChannelIO?.("onHideMessenger", callback);
  }

  onBadgeChanged(callback: (unread: number, alert: number) => void) {
    window.ChannelIO?.("onBadgeChanged", callback);
  }

  onChatCreated(callback: () => void) {
    window.ChannelIO?.("onChatCreated", callback);
  }

  onFollowUpChanged(callback: (profile: FollowUpProfile) => void) {
    window.ChannelIO?.("onFollowUpChanged", callback);
  }

  onUrlClicked(callback: (url: string) => void) {
    window.ChannelIO?.("onUrlClicked", callback);
  }

  clearCallbacks() {
    window.ChannelIO?.("clearCallbacks");
  }

  updateUser(userInfo: UpdateUserInfo, callback?: Callback) {
    window.ChannelIO?.("updateUser", userInfo, callback);
  }

  addTags(tags: string[], callback?: Callback) {
    window.ChannelIO?.("addTags", tags, callback);
  }

  removeTags(tags: string[], callback?: Callback) {
    window.ChannelIO?.("removeTags", tags, callback);
  }

  setPage(page: string) {
    window.ChannelIO?.("setPage", page);
  }

  resetPage() {
    window.ChannelIO?.("resetPage");
  }

  showChannelButton() {
    window.ChannelIO?.("showChannelButton");
  }

  hideChannelButton() {
    window.ChannelIO?.("hideChannelButton");
  }

  setAppearance(appearance: Appearance) {
    window.ChannelIO?.("setAppearance", appearance);
  }
}

// export default new ChannelService();
export default ChannelService;

```

### ChannelTalkProvider
- use client를 사용해서 브라우저에서 스크립트를 로드해야 한다.  
- Root layout에 넣어주기  

```js
// ChannelTalkProvider.tsx
"use client";
import React, { useEffect } from "react";
import ChannelService from "./ChannelTalk";

interface ChannelTalkProvider {
  children: React.ReactNode;
}

const ChannelTalkProvider = ({ children }: ChannelTalkProvider) => {
  useEffect(() => {
    const CT = new ChannelService();
    if (!window.ChannelIO) CT.loadScript();
    CT.boot({
      pluginKey: process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY!,
    });

    return () => {
      CT.shutdown();
    };
  }, []);

  return <>{children}</>;
};

export default ChannelTalkProvider;

```