---
sidebar_position: 6
---

# OpenClaw(몰트봇)구축하기 1  
- [OpenClaw(몰트봇)구축하기 1](#openclaw몰트봇구축하기-1)
  - [1, OpenClaw(몰트봇) 설치하기](#1-openclaw몰트봇-설치하기)
  - [2, ollama 가이드](#2-ollama-가이드)
  - [3. 몰트봇(OpenClaw) 설치, 연동 설정값](#3-몰트봇openclaw-설치-연동-설정값)
  - [99, 스킬](#99-스킬)


26년 초 OpenClaw(몰트봇)이 굉장히 핫 하다.. 그럴듯한 개인용 AI 비서 + 오픈소스라니 굉장히 인기가 많을 수 밖에 없다.  
- 결국 사람이 원하는것은 내 귀잖은 일을 잘 해줄 비서같은 AI에 대한 수요가 확실히 검증되었다고 생각된다.  
- 정말 필요하다면 이제 1인 AI PC 시대가 올 것이다. 집에 인터넷 공유기는 하나씩 있는데 그 옆에 맥미니 같은 컴퓨터가 있을듯 하다.   


## 1, OpenClaw(몰트봇) 설치하기  


## 2, ollama 가이드  


1, ollama 설치
- https://ollama.com -> `curl -fsSL https://ollama.com/install.sh | sh` 명령어로 설치    


2, ollama 명령어  

```
✅ 모델 관리 (저장소)
* `ollama list`: 내 컴퓨터에 설치된 모든 모델 목록 확인
* `ollama pull [모델명]`: 모델 다운로드 (실행은 하지 않음)
* `ollama rm [모델명]`: 모델 삭제 (SSD 용량 확보)

✅ 실행 및 모니터링 (메모리)
* `ollama run [모델명]`: 모델 실행 및 대화 시작 (메모리 로드)
* `ollama ps`: **현재 RAM에 올라가 작동 중인 모델 확인** (가장 중요)
* `ollama stop [모델명]`: 실행 중인 모델을 메모리에서 즉시 해제



```

3, 로컬 LLM 모델 설치하기  

모델 선택 가이드
- 1, 가용 메모리가 적은 개인 컴퓨터 환경에서는 양자화된 모델 선택하기
- 2, 코더 모델을 선택, 왜 "Qwen3" 일반 모델보다 "Coder" 모델인가? - Tool Calling(함수 호출) 능력은 코더 모델들이 압도적으로 훈련되었다.  
- *MoE(Mixture of Experts) 모델이란? 질문을 받으면 라우터가 관련 있는 '전문가(Expert) 뇌' 몇 개만 깨워서 답변  
  - 장점: 전체 뇌 용량(파라미터)은 크지만, 한 번에 쓰는 에너지는 적고 똑똑하면서도 속도가 매우 빠릅니다.  


M3 Pro 18GB 맥북 프로에서 적절한 로컬 LLM  
- Qwen 2.5 Coder 7B : 가장 추천. 코딩과 도구 사용 능력이 매우 뛰어나며 M3 Pro에서 매우 빠름. 
  - ollama run qwen2.5-coder:7b  
- Qwen3-Coder-Next (3B/8B active MoE)  
- Llama 3.1 8B : 범용성이 가장 좋고 안정적임. 한국어 대응도 무난함.  

M2 Max 32GB 맥스튜디오에서 적절한 로컬 LLM    
- 가장 똑똑한 걸 원하신다면 Qwen3-30B-A3B, 추천 파일: qwen3-30b-a3b-instruct-q4_k_m.gguf
- 아주 빠르고 똑똑한 걸 원하신다면 DeepSeek-R1-14B를 선택  - https://ollama.com/cyberuser42/DeepSeek-R1-Distill-Qwen-14B  


## 3. 몰트봇(OpenClaw) 설치, 연동 설정값

https://github.com/openclaw/openclaw  

```js
npm install -g openclaw@latest
# or: pnpm add -g openclaw@latest
openclaw onboard --install-daemon
```
![Alt text](image-2.png)  

```
◇  Discord bot token ──────────────────────────────────────────────────────────────────────╮
│                                                                                          │
│  1) Discord Developer Portal → Applications → New Application                            │
│  2) Bot → Add Bot → Reset Token → copy token                                             │
│  3) OAuth2 → URL Generator → scope 'bot' → invite to your server                         │
│  Tip: enable Message Content Intent if you need message text. (Bot → Privileged Gateway  │
│  Intents → Message Content Intent)                                                       │
│  Docs: discord                               │
│                                                                                          │
├───────────────────────────────────────────────────────────────────────────────────────
```

```
1. 기존 프로세스 종료
openclaw gateway stop

2, ollama에서 게이트웨이를 열면서 openclaw도 실행하기  
ollama launch openclaw

Select models for OpenClaw: Type to filter...
  >  [ ] qwen2.5-coder:7b
     [ ] glm-4.7-flash - Recommended (requires ~25GB VRAM), install?
     [ ] glm-4.7:cloud - Recommended, install?
     [ ] kimi-k2.5:cloud - Recommended, install?
     [ ] qwen3:8b - Recommended (requires ~11GB VRAM), install?

  Select at least one model.

 ollama launch openclaw

Launching OpenClaw with qwen2.5-coder:7b...
2026-02-11T15:17:33.650Z [canvas] host mounted at http://127.0.0.1:18789/__openclaw__/canvas/ (root /Users/dodo/.openclaw/canvas)
2026-02-11T15:17:33.723Z [heartbeat] started
2026-02-11T15:17:33.726Z [gateway] agent model: ollama/qwen2.5-coder:7b
2026-02-11T15:17:33.727Z [gateway] listening on ws://127.0.0.1:18789 (PID 3990)
2026-02-11T15:17:33.728Z [gateway] listening on ws://[::1]:18789
2026-02-11T15:17:33.731Z [gateway] log file: /tmp/openclaw/openclaw-2026-02-12.log
2026-02-11T15:17:33.756Z [browser/service] Browser control service ready (profiles=2)
2026-02-11T15:17:34.393Z [discord] [default] Discord Message Content Intent is disabled; bot may not respond to channel messages. Enable it in Discord Dev Portal (Bot → Privileged Gateway Intents) or require mentions.
2026-02-11T15:17:34.396Z [discord] [default] starting provider (@갱얼지)
2026-02-11T15:17:35.038Z [discord] channels unresolved: 1311708616650129559/1471159144789708900
2026-02-11T15:17:35.342Z [ws] webchat connected conn=47b11c5e-0355-4314-8341-ca72d91ae20c remote=127.0.0.1 client=openclaw-control-ui webchat vdev
2026-02-11T15:17:35.354Z [ws] webchat connected conn=d914cb87-4dad-4c1a-898e-121557ac3c8e remote=127.0.0.1 client=openclaw-control-ui webchat vdev
2026-02-11T15:17:36.297Z [discord] logged in to discord as 1471157887467262003
2026-02-11T15:17:36.332Z [discord] gateway: WebSocket connection closed with code 4014
2026-02-11T15:17:36.334Z [discord] gateway error: Error: Fatal Gateway error: 4014
2026-02-11T15:17:36.335Z [discord] [default] channel exited: Fatal Gateway error: 4014
```


몰트봇 설정 시 로컬 LLM 연결을 위한 기본 정보입니다.

* **Provider:** `openai-compatible` (또는 `ollama`)
* **Base URL:** `http://localhost:11434/v1`
* **API Key:** `ollama` (아무 값이나 입력해도 무방)
* **Model:** `qwen2.5-coder:7b` (설치한 모델 태그와 일치해야 함)

---

> **Tip:** 모델 구동 중 Mac이 느려진다면 `ollama ps`로 현재 어떤 모델이 올라가 있는지 확인하고, 불필요한 모델은 `ollama stop`으로 꺼주세요.

**이제 어떤 모델을 먼저 설치해 보시겠어요?** 명령어가 기억나지 않으시면 바로 물어봐 주세요!


-- 


## 99, 스킬 

https://clawhub.ai/skills?sort=downloads&dir=desc  
- 유용한 스킬들을 살펴보자. pdf to word, gmail 탐색, IoT기기 제어 등  


참고자료  
- https://brunch.co.kr/@sungdairi/19  
- openclaw + ollama https://leejams.github.io/openclaw-ollama/  