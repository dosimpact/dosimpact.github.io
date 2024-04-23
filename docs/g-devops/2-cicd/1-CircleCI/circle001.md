---
sidebar_position: 1
---

# YAML 핵심

YAML은 사람이 읽고 쓰기 쉬운 데이터 직렬화 언어로, 주로 설정 파일이나 데이터 전송에 사용됩니다. 다음은 YAML의 주요 핵심 내용입니다:

1. **들여쓰기**: YAML은 공백 문자로 들여쓰기를 사용하여 데이터의 계층 구조를 나타냅니다. 들여쓰기는 공백 문자 여섯 개나 탭 하나로 표현될 수 있습니다.

2. **매핑**: 키-값 쌍을 나타내는 매핑은 콜론(:)으로 키와 값을 구분하고, 콜론 뒤에는 공백을 포함해야 합니다.

    ```yaml
    key: value
    ```

3. **시퀀스**: 목록이나 배열과 같은 여러 항목을 나타내는 시퀀스는 대시(-)로 시작합니다.

    ```yaml
    - item1
    - item2
    ```

4. **문자열**: 따옴표(`'` 또는 `"`)로 감싸지 않은 문자열은 기본적으로 문자열로 처리됩니다. 따옴표로 감싼 문자열은 특수 문자나 공백을 포함할 수 있습니다.

    ```yaml
    key: "value"
    ```

5. **주석**: `#`을 사용하여 주석을 추가할 수 있습니다. 주석은 해당 줄의 끝까지만 적용됩니다.

    ```yaml
    # 이것은 주석입니다.
    key: value  # 이것도 주석입니다.
    ```

6. **상속**: YAML은 `&`와 `*`를 사용하여 이름을 붙여진 값으로 참조하고 재사용할 수 있습니다.

    ```yaml
    base: &base
      key: value

    derived:
      <<: *base
    ```

이것들이 YAML의 가장 중요한 구성 요소입니다. 이외에도 YAML은 더 많은 기능을 제공하지만, 이러한 요소들만으로도 대부분의 YAML 파일을 이해하고 작성할 수 있습니다.


## eg) node.js build  

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/node:latest

    steps:
      - checkout

      - run:
          name: Install dependencies
          command: npm install

      - run:
          name: Build
          command: npm run build

      # Add more steps as needed, such as testing, deploying, etc.

workflows:
  version: 2
  build:
    jobs:
      - build

```

## eg) circleci-demo-javascript-react-app

https://github.com/CircleCI-Public/circleci-demo-javascript-react-app/blob/main/.circleci/config.yml