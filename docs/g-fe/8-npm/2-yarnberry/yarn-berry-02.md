---
sidebar_position: 2
---

# Yarn Berry    

- [Yarn Berry](#yarn-berry)
  - [Yarn Berry 소개](#yarn-berry-소개)
    - [이점](#이점)
  - [7.Plug'n'Play](#7plugnplay)
  - [11.Workspaces](#11workspaces)


## Yarn Berry 소개   

- Yarn Berry는 기본으로 셋팅되는 yarn 1.x 버전이 아닌 2.x 이상의 버전을 의미한다.  
- Yarn은 JavaScript 프로젝트에서 의존성을 관리하는 데 사용되는 오픈 소스 패키지 매니저 중 하나  
- Yarn은 속도, 정확성, 보안, 그리고 개발자 경험을 중점적으로 다루며, 작업 공간(workspaces), 오프라인 캐싱, 병렬 설치, 강화 모드(hardened mode), 상호작용 명령어(interactive commands) 등 혁신적인 기능들을 통해 이 모든 측면을 개선  

### 이점

Yarn Classic(1.x) 버전이 여전히 JavaScript 생태계의 중요한 축으로 자리 잡고 있지만, 가능한 한 업그레이드를 권장해요. 왜 그럴까요?  

1. 안정성
- Yarn Modern은 Classic 버전 유지 보수에서 얻은 수년간의 경험을 바탕으로 설계되었어요. 그 결과, 소프트웨어가 이전보다 훨씬 더 안정적으로 작동해요.

2. 새로운 기능
- Yarn Modern은 1.x 버전이나 다른 패키지 관리자에서 존재하지 않던 새로운 기능들을 제공해요.  
- 예를 들어, 'Constraints' 기능은 Yarn Modern에서만 사용할 수 있는 독점적인 기능이에요.

3. 유연성: Yarn Modern은 세 가지 설치 전략을 모두 지원
- Yarn PnP, `node_modules`, 그리고 `pnpm`과 유사한 콘텐츠-주소 캐시(content-addressed cache). 

4. 확장성
- Yarn Modern의 아키텍처는 필요한 기능을 직접 구현할 수 있게 해줘요. 
- 우리가 새로운 기능을 구현해주기를 기다릴 필요 없이, 자신만의 사양에 맞춰 직접 구현하여 즉시 사용할 수 있어요! 
- 포커스된 작업 공간, 커스텀 설치, 프로젝트 검증 등 다양한 확장성을 제공해요.

5. 미래 지향성
- Yarn Modern은 Classic 버전에서 새로운 기능을 추가하기 어려운 문제들을 해결한 후에 개발되었어요. 


## 7.Plug'n'Play

**정보**  
이 단계들은 완전히 선택 사항이에요!

새 프로젝트에서 Yarn Plug'n'Play(PnP)를 사용하는 것을 권장하지만, 기존 프로젝트에서 이를 활성화하려면 시간이 좀 걸릴 수 있어요. 시간이 부족하거나 특별한 이점이 없다면 이 부분을 건너뛰고 나중에 다시 돌아와도 괜찮아요.

**Doctor 호출하기**  
Plug'n'Play는 엄격한 의존성 규칙을 적용해요. 애플리케이션이 명시되지 않은 의존성에 의존하면 오류가 발생할 수 있고, 애플리케이션이 불안정해질 수 있어요.

위험한 패턴을 사용하는 위치를 빠르게 감지하려면 Yarn에서 제공하는 Doctor 도구를 사용할 수 있어요. 프로젝트에서 `yarn dlx @yarnpkg/doctor` 명령어를 실행하면 Doctor가 소스 파일을 검사하여 잠재적으로 문제가 될 수 있는 패턴을 감지해요.

**예시**  
예를 들어, webpack-dev-server에 대한 Doctor의 결과는 다음과 같아요:

```
➤ YN0000: Found 1 package(s) to process
➤ YN0000: For a grand total of 236 file(s) to validate

➤ YN0000: ┌ /webpack-dev-server/package.json
➤ YN0000: │ /webpack-dev-server/test/testSequencer.js:5:19: Undeclared dependency on @jest/test-sequencer
➤ YN0000: │ /webpack-dev-server/client-src/default/webpack.config.js:12:14: Webpack configs from non-private packages should avoid referencing loaders without require.resolve
➤ YN0000: │ /webpack-dev-server/test/server/contentBase-option.test.js:68:8: Strings should avoid referencing the node_modules directory (prefer require.resolve)
➤ YN0000: └ Completed in 5.12s

➤ YN0000: Failed with errors in 5.12s
```

위 예시에서 Doctor는 두 가지 주요 문제를 발견했어요:

- `testSequencer.js`는 @jest/test-sequencer에 대한 명시된 의존성 없이 사용되고 있어요. 이는 Yarn Plug'n'Play에서 런타임 시 오류로 보고될 수 있어요.
- `webpack.config.js`는 loader를 require.resolve 없이 참조하고 있어요. 이는 loader가 webpack-dev-server의 의존성이 아닌 webpack 패키지로부터 해석될 수 있기 때문에 안전하지 않아요.
- `contentBase-option.test.js`는 node_modules 폴더의 내용을 확인하고 있어요. 그러나 PnP에서는 node_modules 폴더가 존재하지 않아요.

**Yarn PnP 활성화**  
`.yarnrc.yml` 파일에서 `nodeLinker` 설정을 확인하세요. 해당 설정이 없거나 이미 `pnp`로 설정되어 있다면, Yarn Plug'n'Play를 사용하고 있는 것이에요. 그렇지 않다면 설정에서 해당 부분을 제거하고 `yarn install`을 실행하세요. 그리고 변경 사항을 커밋하세요.

**주의 사항**  
Yarn Plug'n'Play 설정을 활성화한 후에도 저장소에 추가적인 관리가 필요할 수 있어요. 몇 가지 고려할 사항들은 다음과 같아요:

- 더 이상 `node_modules` 폴더가 없어요. `require.resolve`를 사용하세요.
- 더 이상 `.bin` 폴더가 없어요. `yarn run bin`을 사용하여 바이너리를 실행하세요.
- `node` 호출 대신 `yarn node`를 사용하세요.
- 커스텀 pre-hook(e.g., prestart)은 수동으로 호출해야 해요(`yarn prestart`).
- 이 외에도 여러 사항들이 문서화되어 있어요. 애플리케이션을 실행하고 문제가 발생하는 부분을 점검한 후, 해결 방법을 찾아보세요.

**에디터 지원**  
VSCode에 대해서만 다루지만, 더 많은 IDE에 대한 전용 문서 페이지가 있어요!

**경고**  
타입스크립트, ESLint, Prettier와 같은 의존성들이 프로젝트 최상위에 리스트되어 있는지 확인하세요.

1. `ZipFS` VSCode 확장을 설치하세요.
2. `yarn dlx @yarnpkg/sdks vscode`를 실행하고 변경 사항을 커밋하세요.
3. TypeScript의 경우, VSCode에서 'Use Workspace Version'을 선택하세요.

**일반적인 조언**  
패키지 의존성을 `packageExtensions`로 수정하세요. 때로는 패키지가 의존성을 명시하지 않는 경우가 있어요. 이런 경우, `packageExtensions` 설정을 통해 안전하고 예측 가능한 방식으로 문제를 해결할 수 있어요.

**바이너리를 `yarn run bin`으로 호출하세요**  
PnP 설치는 더 이상 `node_modules/.bin` 폴더를 생성하지 않아요. 대신 `yarn run bin` 명령어를 사용하여 스크립트와 바이너리를 시작할 수 있어요:

```
yarn run jest
# 또는, 단축 명령어를 사용하여:
yarn jest
```

**스크립트를 `yarn node`로 실행하세요**  
Node.js 환경에서 의존성을 올바르게 찾기 위해 변수를 주입해야 해요. 이를 위해 `yarn node`를 사용하세요.

**PnP 지원을 위한 IDE 설정**  
Yarn Plug'n'Play는 `node_modules` 폴더를 생성하지 않기 때문에, 일부 IDE 통합 기능이 바로 작동하지 않을 수 있어요. 이를 해결하는 방법은 가이드에서 확인할 수 있어요.

**문제 해결**  
- "Cannot find module" 오류는 Yarn이 아닌 Node.js의 해석 시스템에서 발생한 것이에요. `yarn node`로 스크립트를 실행했는지 확인하세요.
- 일부 패키지는 의존성을 명시하지 않아요. 이 경우 `packageExtensions` 설정을 통해 해결할 수 있어요.



## 11.Workspaces  

