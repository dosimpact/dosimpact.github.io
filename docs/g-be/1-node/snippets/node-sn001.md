---
sidebar_position: 1
---

# crawling library

## goal


### 크롤링 전략 

node.js 환경에서 크롤링 방법 및 코드 스니펙을 다룬다.  
- 웹페이지 크롤링할때는 크게 3가지를 관측하면 된다.    

1.내가 수집하려는 정보에 관련된 API가 있는가?  
- 크롤링 필요 없음  
- OpenAPI 제공, Library 제공, Network API 분석  

2.내가 수집하려는 사이트가 정적페이지인가?
- cheerio, jsdom 을 사용해서 html구문을 분석한다.  

3.내가 수집하려는 사이트가 동적페이지인가?
- puppeteer을 이용해서 웹페이지를 랜더링과 동시에 데잉터를 수집한다.  
- (React, Vue 등의 SPA 웹페이지 등)

### 산출물 파일 저장

크롤링 결과물을 저장하는 방법은 다양하다.  

1.csv 파일 저장

2.json 파일 저장

3.excel 파일 저장

4.db 저장


### 크롤링 스케쥴러  

크롤링을 하는 순간 그 때의 데이터를 수집할뿐 최신 데이터를 보장하지는 않는다.  
- 따라서 최신 데이터 유지가 중요하다면, 스케쥴러를 이용해서 데이터의 refresh를 구현한다.  
- jenkins batch, cron, node.js bull.js 잡 큐 등으로 구현 가능하다.


## static site crawling

## jsdom

html 분석에 cheerio 라이브러리를 많이 사용한다.  
- 하지만 라이브러리 사용법을 익혀야 하므로, 순수 바닐라JS만으로 가능한 방법으로 jsdom을 추천
- query.selecotr등 기존의 알고있는 DOM API 지식으로 가능하다. 

### 예) a태그 리스트 링크를 수집

```js
// html 리턴
const response = await axios.get(getListPageTemplate(page), {
  headers: { "User-Agent": "Mozilla/5.0" },
});

const html = response.data;

const dom = new JSDOM(html);
const document = dom.window.document;

// 크롬의 콘솔 document접근 방법이랑 동일
const listBody = document.querySelector(".lectures_card_list_body");
const list = Array.from(listBody.querySelectorAll(".lecture_card_front"));
const hrefList = list.map((e) => e.getAttribute("href"));

detailPageList = detailPageList.concat(...hrefList);

console.log("[info] crawlingListPage success ", detailPageList.length);

```


## dynamic site crawling


