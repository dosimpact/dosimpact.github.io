---
sidebar_position: 3
---

# (Stream) 2. Nodejs 에서 구현

### 스트림 101 (기초)

Node.js에는 네 가지 기초 스트림 타입이 있습니다. Readable, Writable, Duplex, Transform 스트림입니다.  
- 읽기 가능한(readable) 스트림은 소비할수 있는 데이터를 추상화한 것입니다. 예를들어 fs.createReadStream 메소드가 그렇죠.  
- 쓰기 가능한 (writable) 스트림은 데이터를 기록할수 있는 종착점을 추상화한 것입니다. 예를 들어 fs.createWriteStream 메소드가 있죠.  
- 듀플렉스(duplex) 스트림은 읽기/쓰기 모두 가능합니다. 예를 들어 TCP 소켓이 있죠.  

트랜스폼(transform) 스트림은 기본적으로 듀플렉스 스트림입니다.
- 데이터를 읽거나 기록할 때 수정/변환될수 있는 데이터죠.
- 예를들어 gzip을 이용해 데이터를 압축하는 zlib.createGzip 스트림이 있습니다.
- 입력은 쓰기 가능한 스트림이고 출력은 읽기 가능한 스트림인 트랜스폼 스트림을 생각할 수 있을 겁니다. - 트랜스폼 스트림이 *"스트림을 통해(through streams)"*라고 불리는 것을 들어 봤을 겁니다.
- 모든 스트림은 EventEmitter의 인스턴스 입니다. 데이터를 읽거나 쓸 때 사용할 이벤트를 방출(emit) 합니다.
- 하지만, pipe 메소드를 이용하면 더 간단하게 스트림 데이터를 사용할 수 있습니다.

### Event vs Pipe

모든 스트림은 EventEmitter의 인스턴스 입니다.
- 데이터를 읽거나 쓸 때 사용할 이벤트를 방출(emit) 합니다.
- 하지만, pipe 메소드를 이용하면 더 간단하게 스트림 데이터를 사용할 수 있습니다.

```
reableSrc
.pipe(transformStream1)
.pipe(transformStream2)
.pipe(finalWritableDest)
```


읽기 가능한 스트림으로부터 읽거나 쓰기 가능한 스트림으로 쓰는 것 외에도 pipe 메소드는 자동으로 몇가지 작업을 관리합니다.
- 에러 처리나 파일의 끝부분 처리,
- 어떤 스트림이 다른 것들에 비해 느리거나 빠를 경우를 처리합니다.

하지만 스트림은 직접 이벤트와 함께 사용할수 있습니다.

```
- 여기 pipe 메소드가 데이터를 읽고 쓰기위해 주로 하는 것을 나타내는 간단한 코드가 있습니다.
// readable.pipe(writable)
 
readable.on("data", chunk => {
  writable.write(chunk)
})
 
readable.on("end", () => {
  writable.end()
})
```

### 이벤트와 함수 목록

Readable Streams
- Events : data, end, erorr, close, readable
- Functions : pipe, unpipe / read, unshift, resume / pause, isPaused, setEncoding

Writable Streams
- Events : drain, finsh, erorr, close, pipe/unpipe
- Functions : write / end / cork, uncork / setDefaultEncoding


이벤트와 함수들은 보통 함께 사용되기 때문에 서로 관련이 있습니다.

읽기 가능한 스트림에서 가장 중요한 이벤트는 다음과 같습니다.
- data 이벤트: 스트림이 소비자에게 데이터 청크를 전송할때 발생합니다.
- end 이벤트: 더 이상 소비할 데이터가 없을때 발생합니다.

쓰기 가능한 스트림에서 가장 중요한 이벤트는 다음과 같습니다.
- drain 이벤트: 쓰기 가능한 스트림이 더 많은 데이터를 수신할 수 있다는 신호입니다.
- finish 이벤트: 모든 데이터가 시스템으로 플러시 될때 생성됩니다.


이벤트와 함수는 커스터마이징된 스트림을 사용하기 위해 함께 사용할 수 있습니다.
읽기 가능한 스트림을 사용하기 위해 pipe/unpipe 메소드를 사용하거나 read/unshift/resume 메소드를 사용할 수 있습니다. 쓰기 가능한 스트림을 사용하기 위해 우리는 이것을 pipe/unpip의 종착점으로 만들수 있습니다.
혹은 write 메소드로 쓰고 끝날때 done 메소드를 호출하면 됩니다.


### 읽기 가능한 스트림의 일시 정지 모드와 흐름 모드

읽기 가능한 스트림은 사용할 수 있는 방법에 영향을 주는 두 가지 주요 모드가 있습니다.
- 일시 정지 (Pause) 모드
- 흐름 (Flowing) 모드

두 개는 풀(pull), 푸시(push) 모드라고도 합니다.

기본적으로 모든 읽기 가능한 스트림은 일시정지 모드에서 시작하지만,
- 필요에 따라 흐름 모드로 변경되거나 일시 정지 모드로 되돌아갈 수도 있습니다.
- 가끔은 자동으로 스위칭 되기도 합니다.

1) 읽기가능한 스트림이 -  일시정지 모드일 때,
- 스트림을 읽기 위해 read() 메소드를 호출할 수 있습니다.

2) 읽기가능한 스트림이 - 흐름 모드일 때,
- 하지만 흐름 모드일 경우에는 데이터가 연속적으로 흐르고 있고 우리는 이것을 기다려야 합니다.
- 만약 이것을 수신할 소비자가 없으면 데이터는 사라지게 됩니다.

수동으로 두 모드 간에 변경하려면 resume(), pause() 메도드를 사용하면 됩니다.
pipe 메소드로 읽기 가능한 스트림을 사용할 때는 두 모드를 신경쓰지 않아도 됩니다. pipe 가 자동으로 관리하기 때문이죠.


## examples

### eg01 stdin > stdout 스트림 ( pipe )

```js
// eg, stdin > stdout 스트림
// 1. 아래처럼 pipe를 하나로만 연결.
process.stdin.map((e) => String(e).toUpperCase()).pipe(process.stdout);
```

### eg02 Transform ( pipe )

Transform 사용법
- transform - chunk, push, callback
- writableObjectMode, readableObjectMode


```js
import { Transform } from "stream";
 
// eg,
// stream 의 object 모드를 사용해서, 코드로 처리 가능한 Object 단위의 스트림 파이프라인을 구성하자.
 
// process.stdin            // 1.사용자의 입력
//   .pipe(commaSplitter)   // 2.콤마로 분리 (출력=objectMode)
//   .pipe(arrayToObject)   // 3.Object 만들기 (입출력=objectMode)
//   .pipe(objectToString)  // 4.String으로 만들기  (입력=objectMode)
//   .pipe(process.stdout); // 5.console 출력
 
const commaSplitter = new Transform({
  // writableObjectMode: true, // IN - string is ok
  readableObjectMode: true, // OUT
  transform(chunk, encoding, callback) {
    console.log("-->[1] commaSplitter chunk", chunk);
    console.log("-->[1] commaSplitter chunk(string)", chunk.toString("utf-8"));
 
    this.push(chunk.toString().trim().split(","));
    callback();
  },
});
 
const arrayToObject = new Transform({
  writableObjectMode: true, // IN
  readableObjectMode: true, // OUT
 
  transform(chunk, encoding, callback) {
    console.log("-->[2] arrayToObject chunk", chunk);
    const obj = {};
    for (let i = 0; i < chunk.length; i += 2) {
      obj[chunk[i]] = chunk[i + 1];
    }
    this.push(obj);
    callback();
  },
});
 
const objectToString = new Transform({
  writableObjectMode: true,
  // readableObjectMode: true, // OUT - string is ok
  transform(chunk, encoding, callback) {
    console.log("-->[3] objectToString chunk", chunk);
    this.push(JSON.stringify(chunk) + "\n");
    callback();
  },
});
 
process.stdin
  .pipe(commaSplitter)
  .pipe(arrayToObject)
  .pipe(objectToString)
  .pipe(process.stdout);
```

### eg03 Transform ( event, pipe )

```js
import express from "express";
import { Readable, Transform, Writable } from "stream";
import { readFileSync, createReadStream, createWriteStream } from "fs";
 
// eg,
 
function getUserByIdMocked(cursor) {
  const tmp = [];
  for (let i = 0; i < 1; i++) {
    const data = {
      name: `User-${cursor}-${i}`,
      cursor,
      at: Date.now(),
    };
    tmp.push(JSON.stringify(data));
  }
  return `${tmp.join()}` + ",";
}
 
const userDBReadableStream = (() => {
  const totalCount = 10;
  const readableStream = new Readable({
    read(size) {
      // console.log("-->readableStream read event");
      // console.log(`ㄴcursor : ${this.currentCursor} / size : ${size}`);
 
      const str = getUserByIdMocked(this.currentCursor);
      this.push(str + "\n");
      this.currentCursor += 1; // 읽기 커서
 
      // 모든 데이터를 읽은 경우, null을 보낸다.
      if (this.currentCursor >= totalCount) {
        this.push(null); // finished
      }
    },
  });
 
  readableStream.currentCursor = 0;
  readableStream.totalCount = totalCount;
  return readableStream;
})();
 
const progressStream = new Transform({
  transform(chunk, encoding, callback) {
    const progress =
      (
        userDBReadableStream.currentCursor / userDBReadableStream.totalCount
      ).toFixed(2) * 100;
    callback(null, chunk);
  },
});
 
let finalWriteStream = null;
// const finalWriteStream = createWriteStream("eg3-response.json", {
//   flags: "w",
//   encoding: "utf8",
// });
 
const myWritableStream = new Writable({
  write(chunk, encodeing, callback) {
    // 스트림을 다르게 설정하지 않는다면 chunk는 보통 버퍼입니다.
    // 위에서는 encoding 인자를 썼지만 보통은 무시할 수 있습니다.
    // callback은 데이터 청크를 처리한 뒤에 호출되는 함수 입니다.
    // - 쓰기를 성공했지는 여부를 알리는 신호입니다. 실패를 알리려면 에러 객체와 함께 콜백을 호출하면 됩니다.
    console.log(chunk.toString());
    callback();
  },
});
 
finalWriteStream = myWritableStream;
 
// data 이벤트: 스트림이 소비자에게 데이터 청크를 전송할때 발생합니다.
userDBReadableStream.on("data", () => {
  console.log("Event userDBReadableStream data");
});
 
userDBReadableStream.on("error", () => {
  console.log("Event userDBReadableStream error");
});
userDBReadableStream.on("end", () => {
  // end 이벤트: 더 이상 소비할 데이터가 없을때 발생합니다.
  console.log("Event userDBReadableStream end");
});
 
userDBReadableStream.on("close", () => {
  // end > close
  console.log("Event userDBReadableStream close");
});
 
// readable 이벤트를 수신하게 되면, read 를 직접 호출하여 관리해야 한다.
userDBReadableStream.on("readable", () => {
  console.log("Event userDBReadableStream readable");
  // There is some data to read now.
  let data;
  while ((data = userDBReadableStream.read()) !== null) {
    // console.log(data);
  }
});
 
// ========
 
// progressStream.on("pipe", () => {
//   // pipe 이벤트 : pipe 연결되면 이벤트 발생
//   console.log("Event progressStream pipe");
// });
 
// progressStream.on("drain", () => {
//   // drain 이벤트: 쓰기 가능한 스트림이 더 많은 데이터를 수신할 수 있다는 신호입니다.
//   console.log("Event progressStream drain");
// });
 
// progressStream.on("finish", () => {
//   console.log("Event progressStream finish");
// });
 
// progressStream.on("error", () => {
//   console.log("Event progressStream error");
// });
 
// progressStream.on("close", () => {
//   console.log("Event progressStream close");
// });
 
// progressStream.on("unpipe", () => {
//   console.log("Event progressStream unpipe");
// });
 
// ====
// pipe 이벤트 : pipe 연결되면 이벤트 발생
finalWriteStream.on("pipe", () => {
  console.log("Event finalWriteStream pipe");
});
 
// drain 이벤트: 쓰기 가능한 스트림이 더 많은 데이터를 수신할 수 있다는 신호입니다.
finalWriteStream.on("drain", () => {
  console.log("Event finalWriteStream drain");
});
 
finalWriteStream.on("error", () => {
  console.log("Event finalWriteStream error");
});
 
finalWriteStream.on("finish", () => {
  // finish 이벤트: 모든 데이터가 시스템으로 플러시 될때 생성됩니다.
  console.log("Event finalWriteStream finish");
});
 
finalWriteStream.on("unpipe", () => {
  // finish > unpipe > close
  console.log("Event finalWriteStream unpipe");
});
 
finalWriteStream.on("close", () => {
  console.log("Event finalWriteStream close");
});
 
userDBReadableStream.pipe(progressStream).pipe(finalWriteStream);
```

### eg04 bigFile stream server.


```js

import express from "express";
import { readFileSync, createReadStream } from "fs";
 
const PORT = process.env.PORT || 5050;
 
// eg) bigFile stream server
 
// 1. make bigfile
// node -e "process.stdout.write(crypto.randomBytes(2e9))" > big.file
 
// 2. monitoring process
// htop
// - filter > mjs
// - VIRT : 가상메모리 / RES : 물리메모리 사용량 체크
 
// check file size
// ls -alh
 
// 3. download bigfile(client)
// curl localhost:5050/1-oom --output down.file
// 결과 : RES : 물리메모리 사용량 700MB까지 상승
 
// curl localhost:5050/2-stream --output down.file
// 결과 : RES : 물리메모리 사용량 100MB까지 상승
 
const bootstrap = async () => {
  const app = express();
 
  app.get("/1-oom", (req, res) => {
    const file = readFileSync("big.file");
    res.write(file);
    return res.end();
  });
 
  app.get("/2-stream", (req, res) => {
    // HTPP 응답객체는 쓰기 가능한 객체이다.
    createReadStream("big.file").pipe(res);
  });
 
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};
 
bootstrap();

// eg) bigFile stream server

// 1. make bigfile
// node -e "process.stdout.write(crypto.randomBytes(2e9))" > big.file

// 2. monitoring process
// htop
// - filter > mjs
// - VIRT : 가상메모리 / RES : 물리메모리 사용량 체크

// check file size
// ls -alh

// 3. download bigfile(client)
// curl localhost:5050/1-oom --output down.file
// 결과 : RES : 물리메모리 사용량 700MB까지 상승

// curl localhost:5050/2-stream --output down.file
// 결과 : RES : 물리메모리 사용량 100MB까지 상승

실험 환경 : M1 Mac
```

### eg05 DB readable stream.

```js
// eg05-server.mjs
 
import express from "express";
import { readFileSync, createReadStream } from "fs";
import { Readable, Transform, Writable } from "stream";
import { randomUUID } from "crypto";
 
const PORT = process.env.PORT || 5050;
const INDEX_1GM = 10_000_000;
 
// eg) server to server stream ( csv download )
// server [ read csv > http response ] >>>  client [ http request > file ] with stream pipe
// ( not object mode )
 
// read DB
function getUserByIdMocked(cursor) {
  const tmp = [];
  for (let i = 0; i < 100; i++) {
    const data = {
      id: randomUUID(),
      name: `User-${cursor}-${i}`,
      cursor,
      at: Date.now(),
    };
    tmp.push(JSON.stringify(data));
  }
  return `${tmp.join()}` + ",";
}
 
// point1.
// chunk
// - For streams not operating in object mode, chunk must be a string,
// - Buffer or Uint8Array. For object mode streams
 
const bootstrap = async () => {
  const app = express();
 
  app.get("/1-readable", (req, res) => {
    const totalCount = 1_000;
 
    const readableStream = Readable({
      read(size) {
        // 스트림은 버퍼가 찰때까지 read 여러번 호출하여 청크데이터를 요청한다.
        // 읽기 로직을 통해 데이터를 Push한다.
        // 다운스트림에서 데이터를 다 소화하면 다시 read가 호출된다. 이는 pipe함수에 의해 관리된다.
        console.log("-->readableStream read event");
        console.log(`ㄴcursor : ${this.currentCursor} / size : ${size}`);
 
        const str = getUserByIdMocked(this.currentCursor);
        this.push(str);
        this.currentCursor += 1; // 읽기 커서
 
        // 모든 데이터를 읽은 경우, null을 보낸다.
        if (this.currentCursor >= totalCount) {
          this.push(null); // finished
        }
      },
    });
    readableStream.currentCursor = 0;
 
    const progressStream = new Transform({
      transform(chunk, encoding, callback) {
        const progress =
          (readableStream.currentCursor / totalCount).toFixed(2) * 100;
        console.log(`-->progressStream ${progress}%`);
        callback(null, chunk);
      },
    });
 
    readableStream
      .pipe(progressStream)
      .pipe(res)
      .on("end", () => console.log("Event end"))
      .on("finish", () => console.log("Event finish"))
      .on("error", () => console.log("Event error"));
  });
 
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};
 
bootstrap();
 
 
---
 
// eg05-client.mjs
 
import express from "express";
import { readFileSync, createReadStream, createWriteStream } from "fs";
import { Readable, Writable, Duplex, Transform } from "stream";
import { randomUUID } from "crypto";
import { get } from "http";
 
const url = "http://localhost:5050/1-readable";
 
const getHttpStream = () =>
  new Promise((resolve) => get(url, (response) => resolve(response)));
 
const httpReadableStream = await getHttpStream();
 
const monitoringStream = Transform({
  transform(chunk, enc, cb) {
    cb(null, chunk); // pass through
  },
});
 
const fileWriteStream = createWriteStream("response.json", {
  flags: "w",
  encoding: "utf8",
});
 
httpReadableStream.pipe(monitoringStream).pipe(fileWriteStream);
```


### eg06 gzip readable stream.

```js
import express from "express";
import { Readable, Transform, Writable } from "stream";
import { readFileSync, createReadStream, createWriteStream } from "fs";
import crypto from "crypto";
import zlib from "zlib";
// eg,
 
function getUserByIdMocked(cursor) {
  const tmp = [];
  for (let i = 0; i < 1; i++) {
    const data = {
      name: `User-${cursor}-${i}`,
      cursor,
      at: Date.now(),
    };
    tmp.push(JSON.stringify(data));
  }
  return `${tmp.join()}` + ",";
}
 
const userDBReadableStream = (() => {
  const totalCount = 10;
  const readableStream = new Readable({
    read(size) {
      // console.log("-->readableStream read event");
      // console.log(`ㄴcursor : ${this.currentCursor} / size : ${size}`);
 
      const str = getUserByIdMocked(this.currentCursor);
      this.push(str + "\n");
      this.currentCursor += 1; // 읽기 커서
 
      // 모든 데이터를 읽은 경우, null을 보낸다.
      if (this.currentCursor >= totalCount) {
        this.push(null); // finished
      }
    },
  });
 
  readableStream.currentCursor = 0;
  readableStream.totalCount = totalCount;
  return readableStream;
})();
 
const progressStream = new Transform({
  transform(chunk, encoding, callback) {
    const progress =
      (
        userDBReadableStream.currentCursor / userDBReadableStream.totalCount
      ).toFixed(2) * 100;
    callback(null, chunk);
  },
});
 
const finalWriteStream = createWriteStream("eg6-response.json.gz");
 
userDBReadableStream
  .pipe(progressStream)
  .pipe(zlib.createGzip())
  .pipe(finalWriteStream)
  .on("finish", () => console.log("Done"));

```



---

### Stream in Browser eg1 DOM에 스트림 랜더링

문자열을 스트림으로 만들어 DOM에 텍스트 작성

```js

// https://web.dev/streams/#%EC%93%B0%EA%B8%B0-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%8A%A4%ED%8A%B8%EB%A6%BC-%EC%BD%94%EB%93%9C-%EC%83%98%ED%94%8C
 
const bootstrap = async () => {
 
  const writableStream = new WritableStream({
    start(controller) {
      console.log("[start]");
    },
    async write(chunk, controller) {
      console.log("[write]", chunk);
      // Wait for next write.
      await new Promise((resolve) =>
        setTimeout(() => {
          document.body.textContent += chunk;
          resolve();
        }, 1_000)
      );
    },
    close(controller) {
      console.log("[close]");
    },
    abort(reason) {
      console.log("[abort]", reason);
    },
  });
 
 
  const writer = writableStream.getWriter();
  const start = Date.now();
  for (const char of "abcdefghijklmnopqrstuvwxyz") {
    // Wait to add to the write queue.
    await writer.ready;
    console.log("[ready]", Date.now() - start, "ms");
    // The Promise is resolved after the write finishes.
    writer.write(char);
  }
  await writer.close();
};
// bootstrap()

```

### Stream in Browser eg2 파일읽기 쓰트림

응답 스트림으로 DOM에 텍스트 작성

```js
// https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream
 
function upperCaseStream() {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase());
    },
  });
}
 
function appendToDOMStream(el) {
  return new WritableStream({
    write(chunk) {
      el.append(chunk);
    },
  });
}
 
fetch("./lorem-ipsum.txt").then((response) =>
  response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(upperCaseStream())
    .pipeTo(appendToDOMStream(document.body))
);
```


### Stream in Browser eg3 파일 저장

문자열을 스트림으로 만들어 특정 디렉터리에 파일 저장


```js
// https://developer.chrome.com/articles/file-system-access/#create-a-new-file
const options = {
  suggestedName: "Untitled Text.txt",
  types: [
    {
      description: "Text documents",
      accept: {
        "text/plain": [".txt"],
      },
    },
  ],
};
 
const bootstrap = async () => {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const fileHandle = await window.showSaveFilePicker(options);
 
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write("231231231");
  await writable.write("asfdsafdas");
  await sleep(1500);
  // Close the file and write the contents to disk.
  await writable.close();
};
 
bootstrap();
```



문제 : 하단의 download dialog 로 나오지 않음

