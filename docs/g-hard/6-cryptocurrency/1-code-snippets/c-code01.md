---
sidebar_position: 1
---

# Code Snippets  

## Nnemonic > privateKey

```js
// npm init -y
// npm i @babel/node @babel/cli @babel/core @babel/preset-env -D
// npm i @scure/bip39 ethers@^5.4.0
import * as bip39 from "@scure/bip39";
import { wordlist as enWordList } from "@scure/bip39/wordlists/english";
import { wordlist as koWordList } from "@scure/bip39/wordlists/korean";
import { ethers } from "ethers";

const bootstrap = async () => {
  const mnemonic =
    "물체 일등 이혼 해답 연극 성명 공동 합리적 영역 연세 깜빡 왼쪽";

  const enNnemonic = mnemonic
    .split(" ")
    .map((word) => {
      const idx = koWordList.findIndex((w) => word === w);

      return enWordList[idx];
    })
    .join(" ");

  const seed = await bip39.mnemonicToSeed(enNnemonic);
  const wallet = ethers.Wallet.fromMnemonic(enNnemonic, "m/44'/60'/0'/0/0");

  console.log("-->wallet.privateKey : ", wallet.privateKey);
};y 5
bootstrap();

// npx babel --presets @babel/env getPrivateKeyfromMnemonic.js | node

```