---
sidebar_position: 2
---

# NextJS Essential 4 - API Reference



https://nextjs.org/docs/14/app/api-reference

## File Conventions

default.js  
error.js  
instrumentation.js  
layout.js 
loading.js  
middleware.js 
not-found.js  
- route segment 에서 notFound 함수가 호출되면 보여지는 화면  
- app router 루트에 위치한다.  

page.js  

```Js
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <h1>My Page</h1>
}
```

route.js 
Route Segment Config  
template.js  
Metadata Files  