---
sidebar_position: 2
---

# Solidity 입문 1

- [Solidity 입문 1](#solidity-입문-1)
  - [Refs](#refs)
  - [개발환경](#개발환경)
  - [solidity 예제 1.Storage](#solidity-예제-1storage)
  - [solidity 예제 2.Subcurrency 예제](#solidity-예제-2subcurrency-예제)
  - [solidity 예제 will.sol](#solidity-예제-willsol)
  - [solidity 예제 AddressWallets.sol](#solidity-예제-addresswalletssol)
  - [solidity 예제](#solidity-예제)
  - [solidity 예제 Coin.sol](#solidity-예제-coinsol)
  - [5.Solidity \& 스마트 계약 용어집](#5solidity--스마트-계약-용어집)


## Refs 
- solidity docs : https://solidity-kr.readthedocs.io/ko/latest/introduction-to-smart-contracts.html#


## 개발환경  

1.Remix  
- Solidity - Web IDE  
- https://remix.ethereum.org/  

2.Hardhat  
- 기존에는 로컬에 가상 네트워크를 구현하기 위해 가나슈를 사용했으나, hardhat으로 변경되었다. (최신 네트워크 버전을 지원하는 듯).  
- https://hardhat.org/hardhat-runner/docs/getting-started  

```
# hardhat 프로젝트 실행  
npx hardhat init

# 로컬 네트워크 오픈  
npx hardhat node

# Remix에서 hardhat 연동하기.   
```

![Alt text](image.png)

## solidity 예제 1.Storage    

- [스마트 컨트랙트 소개](https://solidity-kr.readthedocs.io/ko/latest/introduction-to-smart-contracts.html#)

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// pragma solidity >=0.4.0 <0.6.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
```
1.pragma 을 통해서 컴파일러 버전을 명시한다. 
- 권장 : 라이센스를 헤더에 명시 : SPDX-License-Identifier: MIT    

솔리디티 언어로된 코드가 컴파일 되면 바이트 코드로 변환이 된다.  
- 컴파일 결과 opcode가 보이며, 이는 바이트코드와 매핑된다. opcode를 솔리디티에 적을수도 있다.  
- EVM은 스택방식이며 LIFO 으로 처리된다.  
- *컴파일러 버전에 맞추어 만들어진 opcode가 네트워크 버전에 호환이 안될 수 있다.   

네트워크에 스마트 컨트랙 배포의 의미 
- Solidity의 관점에서 컨트랙트란 무수한 코드들(함수)과 데이터(상태)가 Ethereum 블록체인의 특정 주소에 존재하는 것.  

2.public 키워드  
- 외부에 인터페이스로 노출시킨다. 상호작용이 가능하다. ABI 명시될듯  

3.view 키워드  
- 해당함수는 내부 상태를 변경시키지 않음을 명시한다.  

## solidity 예제 2.Subcurrency 예제

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Coin {
    // The keyword "public" makes those variables easily readable from outside.
    // pulbic변수를 외부에서 읽는데 비용이 들지는 않는다.  
    address public minter;
    mapping (address => uint) public balances; // mapping은 객체 이다. 
    // address 타입 = 컨트랙트 주소나 외부 사용자들의 키 쌍을 저장

    // 이벤트:블록체인 상에서 발생한 이벤트들을 큰 비용을 들이지 않고 받아볼 수 있습니다.
    event Sent(address from, address to, uint amount);

    // This is the constructor whose code is run only when the contract is created.
    constructor() {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount) public {
        require(msg.sender == minter); // 생성자만 mint함수를 작동시킬 수 있다.  
        require(amount < 1e60);
        balances[receiver] += amount;
    }

    function send(address receiver, uint amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance."); // 오류 발생시 취소  
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount); // 이벤트 발생  
    }
}
```

1.변수에 public을 붙이는것의 의미  
- 외부에서 해당 변수를 읽을 수 있게된다. 이는 getter함수를 만들어주는 효과이다.  

---


## solidity 예제 will.sol


```js
contract Will {
  address owner;
  uint  fortune;
  bool deceased;

  constructor() payable public{
    owner = msg.sender;
    fortune = msg.value;
    deceased = false;
  }
  modifier onlyOwner{
    require(msg.sender = owner);
    _;
  }
  modifier mustBeDeceased {
    require(deceased == true);
    _;
  }

  address payable[] familyWallets;
  mapping(address => uint) inheritance;

  function setInheritance(address payable wallet, uint amount) public onlyOwner{
    familyWallets.push(wallet);
    inheritance[wallet] = amount;
  }

  // 잔액이 부족하면 tranfer 실패 
  function payout() private mustBeDeceased{
    for(unit i = 0; i <  familyWallets.length; i++ ){
      familyWallets[i].transfer(inheritance[familyWallets[i]])
    }
  }
  // oracle switch simulation
  function hasDeceased() public onlyOwner{
    deceased = true;
    payout();
  }
  // getBalance 추가하기  
}
```

1.payable 키워드  

1.1 함수명 payable : 
- 이더리움을 해당 계약에 보낼 수 있는 특별한 키워드.  
- 함수에 적용할 수 있으며, 스마트계약의 잔고에 이더가 저장될 수있도록 코드가 자동으로 추가된다.  

1.2 address payable[]: 
- 해당 주소는 이더리움을 받을 수 있는 주소로 간주된다.  

참고 transfer  
- address payable이더를 전송할때 사용한다. 
- `address payable recipient; recipient.transfer(amount);`

2.modifier 키워드  
- require 조건을 재사용하고자 할때 사용  
- 합성 가능 : _ 언더바 부분에 본래의 함수가 들어간다.  

3.transfer 함수  
- address payable에게 전송할 수 있다.  
- 컨트랙마다 돈통(balance)가 있다. 여기서 해당 주소로 돈을 보낸다.   

4.Oracle Problem    
- 실제로 사망선고를 받고, deceased를 눌러주는 누군가가 필요하다.  
- 즉 외부데이터를 신뢰 가능한 형태로 컨트랙과 연결해야 한다.  
- 체인링크는 여러 소스에서 데이터를 수집하여 검증하는 네트워크 운영  
  - Price Feed : 체인링크데이터로 담보 비율 관리.  
  - VRF : NFT 유니크 난수 보장  
  - Proof of Reserve : 은행 보관 자산 실제 확인 연동  
  - 기존 금융시스템과의 결합 작업  

## solidity 예제 AddressWallets.sol

```js
pragma solidity >= 0.7.0 < 0.9.0;

contract AddressWallets {
    
    address payable[] investorWallets; 
    
    mapping(address => uint) investors;
    
    function payInvestors(address payable wallet, uint amount) public {
        investorWallets.push(wallet);
        investors[wallet] = amount;
    }

    function checkInvestors() public view returns (uint) {
        return investorWallets.length;
    }    
}

```

## solidity 예제   

공개확률 기반 추첨 컨트랙  

## solidity 예제 Coin.sol

```js
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract Coin {
    // The keyword "public" makes variables accessible from other contracts
    address public minter;
    mapping(address => uint) public balances;

    // Events allow clients to react to specific contract changes you declare

    /* Event is an inheritable member of a contract. An event is emitted, it stores the arguments passed in transaction logs. 
     These logs are stored on blockchain and are accessible using address of the contract till the contract is present on the blockchain. */
    event Sent(address from, address to, uint amount);

    // Constructor code is only run when the contract is created
    constructor() {
        minter = msg.sender;
    }

    // Sends an amount of newly created coins to an address Can only be called by the contract creator
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        balances[receiver] += amount;
    }

    // Errors allow you to provide information about
    // why an operation failed. They are returned to the caller of the function.
    error InsufficientBalance(uint requested, uint available);

    // Sends an amount of existing coins
    // from any caller to an address
    function send(address receiver, uint amount) public {
        if (amount > balances[msg.sender])
            // stop transaction and return error
            revert InsufficientBalance({
                requested: amount,
                available: balances[msg.sender]
            });

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}

// 컨트랙 0x5FbDB2315678afecb367f032d93F642f64180aa3
// 민터 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// 고객1 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```


## 5.Solidity & 스마트 계약 용어집  

>https://dev.to/gbengelebs/introduction-to-solidity-228c

address : 20바이트 짜리 변수  

```js
address payable[] wallets
```

mppping : key-value 쌍 데이터  
```js
mapping(address => uint) public balances;
```

Scope : 변수의 유효 범위
- State Variables : contract storage 안에 영구적으로 저장되는 변수  
- Local Variables − 함수 내에서 유효한 변수  
- Global Variables − 특별한 변수이다. 블록체인에 관련된 정보에 접근가능.
예) block.gaslimit, msg.sender ...   


Modifiers : 함성함수를 만들 수 있는 기능  

```js
// onlyOwner 함수는 test함수를 wrapping 하게 된다.  
modifier onlyOwner() {
  if (msg.sender == testAddress) {
    _;
  }

function test() public onlyOwner { }
```